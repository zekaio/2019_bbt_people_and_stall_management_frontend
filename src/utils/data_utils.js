
import fetch from './fetch_utils';
import web from './web_utils';
import auth from './auth_utils';

const CollegeRoute = "/api/colleges";
const GroupRoute = "/api/groups/index";
const DeptRoute = "/api/departments/index";

Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

var data = {

    acceptable_avatar_type: ['image/jpeg','image/jpg','image/png','image/gif'],

    //days: ['周一','周二','周三','周四','周五','周六','周日'],
    sesses: [1,2,3,4,5,6,7,8,9,10,11,12],//,'三四节','五六节','七节','八节','晚上'],

    sexs: ['男','女','不明'],
    politics: ['群众','共青团员','中共预备党员','中共党员','其他'],
    campus: ['大学城校区', '五山校区', '国际校区'],
    colleges: [], colleges_selections: [],
    groups: [], groups_selections: [],
    depts: [], depts_selections: [],

    start_year: 2010,

    getYears: () => {
        let res = [], now = new Date();
        for(let y=data.start_year; y<=now.getFullYear(); y++)
            res.push(y);
        return res;
    },

    getDatum: async (route, type)=> {
        if(data[type].length <= 0){
            data[type+"_selections"] = [];
            data[type] = (await auth.send("GET", route)) || [];
            console.info("getDatum: ", type, data[type]);
        }
        return data[type];
    },
    getDatumSelections: (type)=> {
        if(data[type+"_selections"].length <= 0){
            for(var i in data[type]) data[type+"_selections"].push(data[type][i].name);
            console.info("getDatumSelections: ", type, data[type+"_selections"]);
        }
        return data[type+"_selections"];
    },
    getDatumId: (name, type) => {
        for(var c in data[type])
            if(data[type][c].name === name)
                return data[type][c].id;
        return -1;
    },
    getDatumById: (id, type)=> {
        for(var c in data[type])
            if(data[type][c].id === id)
                return data[type][c];
        return {};
    },

    getData: async ()=> {
        await data.getColleges();
        await data.getGroups();
        await data.getDepts();
    },

    getColleges: async ()=> await data.getDatum(CollegeRoute, 'colleges'),
    getCollegesSelections: ()=> data.getDatumSelections('colleges'),
    getCollegeId: (name)=> data.getDatumId(name, 'colleges'),
    getCollegeById: (id)=> data.getDatumById(id, 'colleges'),

    getGroups: async ()=> await data.getDatum(GroupRoute, 'groups'),
    getGroupsSelections: ()=> data.getDatumSelections('groups'),
    getGroupId: (name)=> data.getDatumId(name, 'groups'),
    getGroupById: (id)=> data.getDatumById(id, 'groups'),

    getDepts: async ()=> await data.getDatum(DeptRoute, 'depts'),
    getDeptsSelections: ()=> data.getDatumSelections('depts'),
    getDeptId: (name)=> data.getDatumId(name, 'depts'),
    getDeptById: (id)=> data.getDatumById(id, 'depts'),

};

export default data
