<template>
    <div>
        <schedule-table
            :scheduleList="scheduleForm.data"
            :cellHeight="65"
            class="schedule"
        ></schedule-table>
        <div id="notice">
            注：灰色为上课时间以及上课周数， 红色为表格周数有误（需修改）
        </div>
        <el-row style="width: fit-content;" ref="form">
            <el-col style="width: fit-content; float: none;">
                <el-table
                    size="mini"
                    :data="scheduleForm.data"
                    border
                    style="width: 100%"
                    highlight-current-row
                >
                    <el-table-column type="index"></el-table-column>
                    <el-table-column
                        v-for="(v, i) in scheduleForm.columns"
                        :key="i"
                        :prop="v.field"
                        :placeholder="v.placeholder"
                        :label="v.title"
                        :width="v.width"
                    >
                        <template slot-scope="scope">
                            <span v-if="scope.row.isSet">
                                <el-input
                                    size="mini"
                                    :placeholder="v.placeholder"
                                    v-model="scheduleForm.sel[v.field]"
                                >
                                </el-input>
                            </span>
                            <span v-else>{{ scope.row[v.field] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <span
                                class="el-tag el-tag--info el-tag--mini"
                                style="cursor: pointer;"
                                @click="
                                    operation(scope.row, scope.$index, true)
                                "
                            >
                                {{ scope.row.isSet ? "保存" : "修改" }}
                            </span>
                            <span
                                v-if="!scope.row.isSet"
                                class="el-tag el-tag--danger el-tag--mini"
                                style="cursor: pointer;"
                                @click="deleteSchedule(scope.$index)"
                            >
                                删除
                            </span>
                            <span
                                v-else
                                class="el-tag  el-tag--mini"
                                style="cursor: pointer;"
                                @click="
                                    operation(scope.row, scope.$index, false)
                                "
                            >
                                取消
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>

            <div class="main-function">
                <el-button type="primary" round @click="importFromJiaoWu()">
                    <i class="el-icon-plus main-function__bnt-icon"></i
                    >教务系统导入</el-button
                >
                <el-button type="primary" round @click="addSchedule()"
                    ><i class="el-icon-plus main-function__bnt-icon"></i
                    >添加课程</el-button
                >
                <el-button
                    type="success"
                    round
                    @click="uploadSchedule()"
                    class="main-function__bnt_upload-schedule"
                    ><i class="el-icon-upload2 main-function__bnt-icon"></i
                    >更新课表</el-button
                >
                <el-upload
                    class="main-function__bnt_upload-img"
                    :action="photoApi"
                    name="schedule"
                    :headers="headers"
                    :show-file-list="false"
                    :on-success="uploadImage"
                    :before-upload="beforeAvatarUpload"
                >
                    <el-button type="primary" round
                        >{{ !!photo ? "更新" : "上传" }}课表图片</el-button
                    >
                </el-upload>

                <img :src="photo" class="main-function__img" v-if="!!photo" />
            </div>
        </el-row>

        <el-dialog
            title="请输入学校统一身份认证的学号和密码"
            :visible.sync="dialogFormVisible"
            style="z-index: 10000"
            :modal="false"
        >
            <el-form :model="userInfo">
                <el-form-item label="学号" :label-width="formLabelWidth">
                    <el-input
                        v-model="userInfo.sno"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input
                        v-model="userInfo.passwd"
                        autocomplete="off"
                        type="password"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="uploadForm()"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import web from "../utils/web_utils";
import auth from "../utils/auth_utils";

import scheduleTable from "../components/schedule-table";
let generateId = {
    _count: 1,
    get() {
        return this._count++;
    },
    clear() {
        this._count = 1;
    }
};

export default {
    data() {
        web.web.checkLogin(this);

        return {
            dialogFormVisible: false,
            userInfo: {
                sno: auth.data.sno,
                passwd: ""
            },
            formLabelWidth: "120px",

            dialogVisible: true,
            scheduleForm: {
                sel: null, //选中行
                columns: [
                    {
                        field: "weekday",
                        title: "星期",
                        width: 140,
                        placeholder: "填入星期:1-7"
                    },
                    {
                        field: "beginLesson",
                        title: "开始节次",
                        width: 140,
                        placeholder: "填入节次:1-12"
                    },
                    {
                        field: "endLesson",
                        title: "结束节次",
                        width: 140,
                        placeholder: "填入节次:1-12"
                    },
                    {
                        field: "beginWeek",
                        title: "开始周数",
                        width: 140,
                        placeholder: "填入数字:1-20"
                    },
                    {
                        field: "endWeek",
                        title: "结束周数",
                        width: 140,
                        placeholder: "填入数字:1-20"
                    }
                ],
                data: []
            },
            photo: "",
            photoApi: auth.scheduleImageRoute(),
            headers: auth.getHeadersObject()
        };
    },
    mounted() {
        this.obtaineScheduleInfo();
    },
    methods: {
        //添加课程
        addSchedule() {
            for (let i of this.scheduleForm.data) {
                if (i.isSet) return web.web.showAlert("请先保存当前编辑项");
            }
            let j = {
                id: generateId.get(),
                beginWeek: "",
                endWeek: "",
                weekday: "",
                beginLesson: "",
                endLesson: "",
                isSet: true,
                _temporary: true
            };
            this.scheduleForm.data.push(j);
            this.scheduleForm.sel = JSON.parse(JSON.stringify(j));
        },
        //修改
        operation(row, index, cg) {
            // 判断当前是否存在正在修改row数据
            for (let i of this.scheduleForm.data) {
                if (i.isSet && i.id != row.id) {
                    web.web.showAlert("请先保存当前编辑项");
                    return false;
                }
            }
            //取消操作
            if (!cg) {
                // 判断是否为新创建课程
                if (this.scheduleForm.sel._temporary)
                    this.scheduleForm.data.splice(index, 1);
                return (row.isSet = !row.isSet);
            }
            //提交数据
            if (row.isSet) {
                let data = JSON.parse(JSON.stringify(this.scheduleForm.sel));
                //
                if (
                    !data["beginWeek"] ||
                    !data["endWeek"] ||
                    +data["beginWeek"] > +data["endWeek"]
                ) {
                    web.web.showAlert("请填写正确的周数");
                    return;
                }
                if (
                    !data["beginLesson"] ||
                    !data["endLesson"] ||
                    +data["beginLesson"] > +data["endLesson"] ||
                    +data["beginLesson"] > 12 ||
                    +data["endLesson"] > 12 ||
                    +data["beginLesson"] < 1 ||
                    +data["endLesson"] < 1
                ) {
                    web.web.showAlert("请填写正确的节次");
                    return;
                }
                if (
                    !data["weekday"] ||
                    +data["weekday"] > 7 ||
                    +data["weekday"] < 1
                ) {
                    web.web.showAlert("请填写正确的上课星期");
                    return;
                }
                if (data._temporary) delete data["_temporary"];
                data.isSet = false;
                this.$set(this.scheduleForm.data, index, data);
                web.web.showAlert("保存成功!");
                //然后这边重新读取表格数据
            } else {
                this.scheduleForm.sel = JSON.parse(JSON.stringify(row));
                row.isSet = true;
            }
        },
        deleteSchedule(index) {
            if (index < this.scheduleForm.data.length) {
                this.scheduleForm.data.splice(index, 1);
                web.web.showAlert("删除成功");
            } else web.web.showAlert("删除失败");
        },
        async uploadSchedule() {
            for (let i of this.scheduleForm.data) {
                if (i.isSet) return web.web.showAlert("请先保存当前编辑项");
            }
            if (
                document.getElementsByClassName("col__content_format_error")
                    .length > 0
            )
                return web.web.showAlert(
                    "表格中含有错误周数，具体看课表图中的红色单元格！"
                );
            let arr = [];
            this.scheduleForm.data
                .filter(single => (single._temporary ? false : true))
                .forEach(single => {
                    for (
                        let i = +single.beginLesson;
                        i <= +single.endLesson;
                        i++
                    )
                        arr.push({
                            start: single.beginWeek,
                            end: single.endWeek,
                            day: single.weekday,
                            class: String(i)
                        });
                });
            console.log(arr);
            await auth.uploadSchedule(arr);
            web.web.showAlert("更新成功！");
        },

        async obtaineScheduleInfo() {
            let { photo, schedule } = await auth.obtainSchedule();
            this.photo = !!photo ? auth.baseUrl + photo : "";
            this.$set(
                this.scheduleForm,
                "data",
                this.handleScheduleRes(schedule)
            );
        },
        // 转换响应的课程数据为前端需要的格式
        handleScheduleRes(res) {
            let schedule = [];
            let scheduleLastIndex = -1;
            for (let weekday in res) {
                for (let lesson in res[weekday]) {
                    let freeWeeks = res[weekday][lesson];
                    for (let i = 0; i < freeWeeks.length; i++) {
                        if (i === 0 || freeWeeks[i] - 1 !== freeWeeks[i - 1]) {
                            schedule.push({
                                beginWeek: +freeWeeks[i],
                                endWeek: +freeWeeks[i],
                                beginLesson: +lesson,
                                endLesson: +lesson,
                                weekday: +weekday
                            });
                            scheduleLastIndex++;
                            continue;
                        } else
                            schedule[scheduleLastIndex].endWeek = freeWeeks[i];
                    }
                }
            }
            //
            schedule.sort((left, right) => {
                return left.beginWeek > right.beginWeek
                    ? 1
                    : left.endWeek > right.endWeek
                    ? 1
                    : left.weekday > right.weekday
                    ? 1
                    : left.beginLesson > right.beginLesson
                    ? 1
                    : 0;
            });
            let finalSchedule = [];
            for (let i = 0; i <= scheduleLastIndex; i++) {
                if (i === 0) {
                    finalSchedule.push(schedule[i]);
                    continue;
                }
                if (
                    schedule[i].beginWeek === schedule[i - 1].beginWeek &&
                    schedule[i].endWeek === schedule[i - 1].endWeek &&
                    schedule[i].weekday === schedule[i - 1].weekday &&
                    schedule[i].beginLesson - 1 === schedule[i - 1].endLesson
                ) {
                    finalSchedule[finalSchedule.length - 1].endLesson =
                        schedule[i].endLesson;
                } else finalSchedule.push(schedule[i]);
            }
            finalSchedule = finalSchedule.map(single => ({
                id: generateId.get(),
                beginWeek: String(single.beginWeek),
                endWeek: String(single.endWeek),
                beginLesson: String(single.beginLesson),
                endLesson: String(single.endLesson),
                weekday: String(single.weekday)
            }));
            return finalSchedule;
        },
        uploadImage(res, file) {
            console.log(auth.baseUrl, "test");
            this.photo = auth.baseUrl + res.schedule;
            web.web.showAlert("课表图片 上传/更新 成功");
        },
        beforeAvatarUpload(file) {
            const isValid =
                ["image/jpeg", "image/png", "image/jpg"].indexOf(file.type) >=
                0;
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isValid) web.web.showAlert("上传图片格式不正确！");
            else if (!isLt5M) web.web.showAlert("上传图片大小不能超过 5MB！");
            return isValid && isLt5M;
        },
        async importFromJiaoWu() {
            this.$confirm(
                "此操作会清空之前填过的课表并从教务系统中导入本学期课表, 是否继续?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(() => {
                    this.dialogFormVisible = true;
                })
                .catch(() => {});
        },
        async uploadForm() {
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let term;
            if (month >= 9) {
                term = "1";
            } else if (month < 3) {
                year = year - 1;
                term = "1";
            } else {
                year = year - 1;
                term = "2";
            }

            let formdata = new FormData();
            formdata.append("account", this.userInfo.sno);
            formdata.append("password", this.userInfo.passwd);
            formdata.append("year", String(year));
            formdata.append("term", String(term));
            web.web.showLoading();
            const timeout = setTimeout(() => {
                web.web.hideLoading();
            }, 7000);
            fetch("https://apiv2.100steps.top/xsjw2018/schedule", {
                method: "post",
                body: formdata
            })
                .then(res => {
                    web.web.hideLoading();
                    clearTimeout(timeout);
                    if (res.status >= 200 && res.status < 300) {
                        return res;
                    } else {
                        const err = new Error(res.statusText);
                        err.res = res;
                        throw err;
                    }
                })
                .then(res => res.json())
                .then(res => {
                    let schedule = [];

                    generateId.clear();

                    let courses = res.kbList;

                    for (let index in courses) {
                        const course = courses[index];
                        const lessonRe = /(\d*)-?(\d*)/;

                        const lessonArr = lessonRe.exec(course["jcs"]);

                        const weeks = course["zcd"].split(",");
                        const weekRe = /(\d*)-?(\d*)周/;

                        for (let i in weeks) {
                            const weekArr = weekRe.exec(weeks[i]);
                            let data = {
                                id: generateId.get(),
                                beginLesson: lessonArr[1],
                                endLesson:
                                    lessonArr[2] !== ""
                                        ? lessonArr[2]
                                        : lessonArr[1],

                                beginWeek: weekArr[1],
                                endWeek:
                                    weekArr[2] !== "" ? weekArr[2] : weekArr[1],
                                isSet: false,
                                weekday: course["xqj"]
                            };

                            schedule.push(data);
                        }
                    }

                    this.dialogFormVisible = false;

                    this.scheduleForm.data = schedule;

                    for (let i = 1; i < schedule.length; i++) {
                        if (
                            Number(schedule[i].weekday) ==
                                Number(schedule[i - 1].weekday) &&
                            Number(schedule[i].beginLesson) <=
                                Number(schedule[i - 1].endLesson)
                        ) {
                            schedule[i - 1].beginWeek = String(
                                Math.min(
                                    Number(schedule[i].beginWeek),
                                    Number(schedule[i - 1].beginWeek)
                                )
                            );
                            schedule[i].beginLesson = String(
                                Number(schedule[i - 1].endLesson) + 1
                            );
                        }
                    }
                })
                .catch(err => {
                    console.error(err);
                    err.res.json().then(res => {
                        web.web.showAlert(res.message);
                    });
                });
        }
    },
    computed: {},
    components: {
        scheduleTable
    }
};
</script>

<style scoped>
.main-function {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    margin-bottom: 10px;
    position: relative;
}
#notice {
    text-align: left;
    color: chocolate;
    margin-bottom: 20px;
}
.schedule {
    margin-bottom: 20px;
    margin-top: 20px;
}
.main-function__bnt-icon {
    margin-right: 6px;
}
.main-function__bnt_upload-schedule {
    margin-right: 10px;
}
.main-function__bnt_upload-img:hover + .main-function__img {
    display: block;
    transform: translateY(-105%);
}
.main-function__img {
    position: absolute;
    border-radius: 6px;
    display: none;
    width: 70%;
    z-index: 200;
}
</style>
