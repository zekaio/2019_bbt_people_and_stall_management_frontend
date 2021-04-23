import fetch from "./fetch_utils";
import web from "./web_utils";
import data from "./data_utils";

const LoginRoute = "/api/authorizations";
const ResetCodeRoute = "/api/psd_reset/captcha";
const ResetRoute = "/api/reset_password";
const ResetRoute2 = "/api/user/update/password";
const SetEmailCodeRoute = "/api/user/email/captcha";
const SetEmailRoute = "/api/user/email";
const OperRoute = "/api/user";
const CreateRoute = "/api/users";
const RecyRoute = "/api/users/recycle";
const EditRoute = "/api/users/detail";
const UpdateRoute = "/api/authorizations";
const ScheduleRoute = "/api/stall/schedule";
const AvatarRoute = "/api/users/avatar";
const ScheduleImageRoute = "/api/stall/schedule/upload";
const ScheduleUnverifyListRoute = "/api/stall/schedule/uncheck";
const SchedulePassRoute = "/api/stall/schedule/check";

// 授权信息
var auth = {
    type: "bearer",
    token: localStorage.getItem("token") || "",
    expires_in: 0,

    active: false,
    enoughPower: false,
    temp_email: "",

    data: {
        detail: {
            id: 0,
            user_id: 0,
            name: "",
            sex: "",
            avatar: "",
            dormitory: "",
            room: "",
            major: "",
            birth: "",
            origin: "",
            politics: "",
            mobile: "",
            shortMobile: "",
            qq: "",
            weibo: "",
            college_id: 0,
            created_at: "",
            updated_at: "",
            college: null,
            campus: "",
            sno: ""
        },
        schedule: {
            list: [],
            poster: ""
        }
    },
    baseUrl: fetch.URL,
    getAuthHeader: () => auth.type + " " + auth.token,

    getHeadersObject: () => ({ Authorization: auth.getAuthHeader() }),

    getObject: (main_key, sub_key) =>
        auth.data[main_key] ? auth.data[main_key][sub_key] : null,

    getDetailObject: key => auth.getObject("detail", key),
    getDepartmentObject: key => auth.getObject("department", key),
    getGroupObject: key => auth.getObject("group", key),

    getDetail: key => auth.getDetailObject(key) /* || '未知'*/,
    getDepartment: key => auth.getDepartmentObject(key) /* || '未知'*/,
    getGroup: key => auth.getGroupObject(key) /* || '未知'*/,

    getAvatar: () => fetch.URL + auth.getDetail("avatar"),

    getName: () => auth.getDetailObject("name") /* || '未登录'*/,
    getNameForTitle: () => auth.getName() || "未登录",
    getSno: () => auth.getDetailObject("sno"),

    getSex: () => auth.getDetail("sex"),
    getDormBulid: () => auth.getDetail("dormitory"),
    getDormRoom: () => auth.getDetail("room"),
    getDorm: () =>
        (auth.getDormBulid() || "") + "-" + (auth.getDormRoom() || ""),
    getCampus: () => auth.getDetail("campus"),
    getMajor: () => auth.getDetail("major"),
    getClass: () => auth.getDetail("class"),
    getBirth: () => auth.getDetail("birth"),
    getOrigin: () => auth.getDetail("origin"),
    getPolitics: () => auth.getDetail("politics"),
    getMobile: () => auth.getDetail("mobile"),
    getShortMobile: () => auth.getDetail("shortMobile"),
    getQQ: () => auth.getDetail("qq"),
    getWeibo: () => auth.getDetail("weibo"),
    getCreateTime: () => auth.getDetail("created_at"),
    getUpdateTime: () => auth.getDetail("updated_at"),
    getCollegeId: () => auth.getDetail("college_id"),
    getCollege: () => {
        var college = auth.getDetailObject("college");
        return college ? college.name : "";
    },

    getDept: () => auth.getDepartment("name"),
    getDeptId: () => auth.getDepartment("id"),
    getJob: () => auth.getGroup("name"),
    getJobId: () => auth.getGroup("id"),
    getDepJob: () => auth.getDept() + " " + auth.getJob(),
    getDepIntro: () => auth.getDepartment("introduction"),

    isEmailed: () => !!auth.data.email,
    setEmailLocal: () => (auth.data.email = auth.temp_email),

    // 头像上传路由
    avatarRoute: function() {
        return fetch.URL + AvatarRoute;
    },

    scheduleImageRoute: function() {
        return fetch.URL + ScheduleImageRoute;
    },

    send: async (method, url, data) => {
        web.web.showLoading();
        var res = await fetch.send(method, url, data, auth.getHeadersObject());
        web.web.hideLoading();
        return res;
    },

    // 更新 token
    update: async id => {
        var data = await auth.send("PUT", UpdateRoute);
        if (!data || data.error) return;
        auth.type = data.type;
        auth.token = data.token;
        auth.expires_in = data.expires_in;
        auth.save();
        return true;
    },

    // 操作用户
    oper: async (oper, id, params, route) => {
        if (auth.token.length <= 0) return false;
        route = route || OperRoute;
        route += id === undefined ? "" : "/" + id;
        let res = await auth.send(oper, route, params);
        return res;
    },

    // 获取全部信息
    get: async id => {
        let res = await auth.oper("GET", id);
        if (id) return res;
        auth.setup(res);
        if ((res = res && !res.error)) await data.getData();
        auth.active = res && auth.data.email;
        auth.enoughPower =
            auth.data.group &&
            auth.data.group.name &&
            auth.data.group.name !== "主管" &&
            auth.data.group.name !== "干事";
        return res;
    },
    // 删除用户
    delete: async id => !(await auth.oper("DELETE", id)),
    // 编辑用户
    put: async (id, department_id, group_id) =>
        await auth.oper("PUT", id, { group_id, department_id }),
    // 回收用户
    recy: async id => !(await auth.oper("POST", id, null, RecyRoute)),

    // 添加用户（批量/单个）
    create: async (snos, department, group) => {
        var data = snos.map(sno => ({ sno }));
        var res = await auth.send("POST", CreateRoute, {
            data,
            group,
            department
        });
        return !(res && res.error);
    },

    // 配置详细信息项
    setup: data => {
        if (!data || data.error) auth.clear();
        else
            for (let key in data) {
                if (key === "detail")
                    for (let dkey in data[key])
                        auth.data[key][dkey] = data[key][dkey];
                else auth.data[key] = data[key];
            }
        console.info(auth.data);
    },

    // 清除详细信息
    clear: () => {
        for (let key in auth.data)
            if (key === "detail")
                for (let dkey in data[key]) auth.data[key][dkey] = "";
            else auth.data[key] = undefined;
    },

    // 登陆
    login: async (username, password) => {
        let data = await auth.send("POST", LoginRoute, {
            sno: username,
            password
        });
        auth.type = data.type;
        auth.expires_in = data.expires_in;
        auth.token = data.token;
        if (data && !data.error) return !!(await auth.get());
        return undefined;
    },

    // 储存 token
    save: () => {
        auth.active = true;
        localStorage.setItem("token", auth.token);
    },

    // 登出
    logout: () => {
        auth.active = false;
        auth.enoughPower = false;
        localStorage.removeItem("token");
    },

    // 重置密码验证码
    resetCode: async (username, email) => {
        let data =
            (await auth.send("POST", ResetCodeRoute, {
                sno: username,
                email
            })) || {};
        return !data.error;
    },

    // 重置密码
    reset: async (username, password, code) => {
        let data =
            (await auth.send("POST", ResetRoute, {
                sno: username,
                captcha: code,
                password
            })) || {};
        return !data.error;
    },

    // 修改密码
    editPwd: async (old_password, password, password2) => {
        let data =
            (await auth.send("PUT", ResetRoute2, {
                old_password,
                password,
                password2
            })) || {};
        return !(data && data.error);
    },

    // 设置邮箱验证码
    emailCode: async email => {
        let data =
            (await auth.send("POST", SetEmailCodeRoute, { email })) || {};
        return !data.error;
    },

    // 设置邮箱
    setEmail: async code => {
        let data =
            (await auth.send("POST", SetEmailRoute, { captcha: code })) || {};
        return !data.error;
    },

    // 修改信息
    edit: async detail => {
        let data = await auth.send("POST", EditRoute, detail);
        if (data && !data.error) return !!(await auth.get());
        return false;
    },

    uploadSchedule: async schedules => {
        let res = await auth.send("POST", `${ScheduleRoute}/store`, {
            id: auth.getDetailObject("user_id"),
            schedules
        });
        return res;
    },
    obtainSchedule: async id => {
        if (!id) id = auth.getDetailObject("user_id");
        return await auth.send("GET", `${ScheduleRoute}/show/${id}`);
    },
    uncheckScheduleList: async () => {
        return await auth.send("GET", ScheduleUnverifyListRoute);
    },
    passSchedule: async id => {
        return await auth.send("PUT", `${SchedulePassRoute}/${id}`);
    }
};

export default auth;
