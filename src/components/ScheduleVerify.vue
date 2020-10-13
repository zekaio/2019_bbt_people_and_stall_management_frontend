<template>
    <div>
        <div id="main_content">
            <el-tabs v-model="main_page" @tab-click="onTabChanged">
                <el-tab-pane label="全部" name="all"></el-tab-pane>
                <el-tab-pane label="同部门" name="dept"></el-tab-pane>
            </el-tabs>
            <div id="table_content">
                <el-table :data="page_data" stripe border>
                    <el-table-column prop="name" label="姓名"></el-table-column>
                    <el-table-column
                        prop="sno"
                        label="学号"
                        width="118"
                    ></el-table-column>
                    <el-table-column
                        prop="sex"
                        label="性别"
                        width="50"
                    ></el-table-column>
                    <el-table-column
                        prop="dept"
                        label="部门"
                        width="96"
                    ></el-table-column>
                    <el-table-column
                        prop="campus"
                        label="校区"
                        width="96"
                    ></el-table-column>
                    <el-table-column
                        prop="group"
                        label="管理层"
                    ></el-table-column>
                    <el-table-column label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button
                                @click="onDetail(scope.row, scope.$index)"
                                type="text"
                                >查看课表</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <transition name="fade">
            <div id="popover" v-show="verify">
                <schedule-table
                    :scheduleList="schedule"
                    :cellHeight="45"
                    class="popover__schedule"
                ></schedule-table>
                <img :src="photo" id="photo" v-if="!!photo" />
                <div id="photo" class="photo_empty" v-else>暂未上传图片哦~</div>
                <div class="main-function">
                    <el-button type="success" round @click="passVerify()"
                        ><i class="el-icon-check main-function__bnt-icon"></i
                        >通过审核</el-button
                    >
                    <el-button
                        type="info"
                        round
                        @click="cancelVerify()"
                        class="main-function__bnt"
                        ><i class="el-icon-close main-function__bnt-icon"></i
                        >取消审核</el-button
                    >
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import scheduleTable from "../components/schedule-table";
import auth from "../utils/auth_utils";
import web from "../utils/web_utils";

export default {
    data() {
        web.web.checkLogin(this);

        return {
            verify: false,
            total_data: [],
            page_data: [],
            main_page: "dept",
            schedule: [
                {
                    beginWeek: "1",
                    endWeek: "2",
                    weekday: "1",
                    beginLesson: "1",
                    endLesson: "7"
                },
                {
                    beginWeek: "2",
                    endWeek: "3",
                    weekday: "2",
                    beginLesson: "3",
                    endLesson: "4"
                },
                {
                    beginWeek: "4",
                    endWeek: "6",
                    weekday: "3",
                    beginLesson: "5",
                    endLesson: "6"
                }
            ],
            photo: "",
            verifyingRow: -1,
            deptName: auth.getDept()
        };
    },
    methods: {
        async onDetail(row, index) {
            this.verifyingRow = index;
            if (!!row.photo || !!row.schedule) {
                this.photo = row.photo;
                this.schedule = row.schedule;
                this.verify = !this.verify;
                return;
            }
            let { photo, schedule } = await auth.obtainSchedule(row.id);
            schedule = this.handleScheduleRes(schedule);
            this.photo = !!photo ? auth.baseUrl + photo : "";
            this.schedule = schedule;
            row.photo = this.photo;
            row.schedule = schedule;
            this.verify = !this.verify;
        },
        handleScheduleRes(res = {}) {
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
                beginWeek: String(single.beginWeek),
                endWeek: String(single.endWeek),
                beginLesson: String(single.beginLesson),
                endLesson: String(single.endLesson),
                weekday: String(single.weekday)
            }));
            return finalSchedule;
        },
        cancelVerify() {
            this.verify = !this.verify;
            this.verifyingRow = -1;
        },
        async passVerify() {
            let id = this.page_data[this.verifyingRow].id;
            await auth.passSchedule(id);
            this.page_data.splice(this.verifyingRow, 1);
            this.total_data = this.total_data.filter(item => item.id !== id);
            this.verify = !this.verify;
        },
        onTabChanged({ name }, event) {
            this.main_page = name;
            this.getPageData();
        },
        handleUsers(users) {
            return users.map(user => ({
                id: user.id,
                sno: user.sno,
                name: user.detail.name,
                sex: user.detail.sex,
                campus: user.detail.campus,
                dept: user.department.name,
                group: user.group.name
            }));
        },
        getPageData() {
            this.page_data =
                this.main_page === "dept"
                    ? this.total_data.filter(
                          item => item.dept === this.deptName
                      )
                    : this.total_data;
        }
    },
    components: {
        scheduleTable
    },

    async mounted() {
        if (auth.getJob() === "主管" || auth.getJob() === "干事")
            this.$root.$router.push("/user");
        let data = await auth.uncheckScheduleList();
        this.total_data = this.handleUsers(data);
        this.getPageData();
    }
};
</script>

<style scoped>
#main_content {
    position: absolute;
    padding: 12px 24px;
    top: 32px;
    bottom: 32px;
    left: 5%;
    right: 5%;
    /*margin: 32px 5% 32px;*/
    min-width: 444px;
    max-width: 840px;
    /*height: 90%;*/
    text-align: center;
    border-radius: 4px;
    background: rgba(192, 192, 192, 0.2);
    overflow-y: scroll;
}
#popover {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 20;
    display: flex;
    align-items: center;
}
#popover::after {
    content: "";
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    filter: blur(5px);
}

#popover .popover__schedule {
    width: 48%;
    background: white;
    border-radius: 6px;
    overflow: hidden;
    margin-left: 2%;
    margin-top: -10vh;
}
#photo {
    width: 48%;
    border-radius: 6px;
    margin-top: -10vh;
    margin-left: 1%;
    max-height: 85%;
    object-fit: contain;
}
.main-function {
    position: absolute;
    bottom: 5vh;
    left: 0;
    right: 0;
    margin: 0 auto;
}
.photo_empty {
    height: 40%;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
}
.main-function__bnt-icon {
    margin-right: 6px;
}
.main-function__bnt:first-child {
    margin-right: 30px;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
</style>
