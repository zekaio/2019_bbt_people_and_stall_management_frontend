<template>
  <div>
    <div id="main_content">
      <el-tabs v-model="main_page" @tab-click="onTabChanged">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane label="同部门" name="dept"></el-tab-pane>
      </el-tabs>
      <div id="table_content">
        <el-table :data="page_data" height="100%" stripe border>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column
            prop="sno"
            label="学号"
            width="118"
          ></el-table-column>
          <el-table-column prop="sex" label="性别" width="50"></el-table-column>
          <el-table-column
            prop="dept"
            label="部门"
            width="96"
          ></el-table-column>
          <el-table-column prop="group" label="管理层"></el-table-column>
          <el-table-column prop="create" label="加入时间"></el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button @click="onDetail(scope.row)" type="text"
                >查看</el-button
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
          :cellHeight="40"
          class="popover__schedule"
        ></schedule-table>
        <img :src="photo" id="photo" />
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

export default {
  data() {
    return {
      verify: false,
      page_data: [
        {
          id: 1,
          sno: "201010101010",
          name: "SuperRoot",
          sex: "不明",
          dept: "技术部",
          group: "超级管理员",
          create: "2011-07-20"
        }
      ],
      main_page: "all",
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
      photo:
        "https://tse3-mm.cn.bing.net/th?id=OIP.VDrsIs6hn8rs9j65DeaIoQHaE7&w=193&h=128&c=7&o=5&pid=1.7"
    };
  },
  methods: {
    async onDetail(row) {
      this.verify = !this.verify;
    },
    cancelVerify() {
      this.verify = !this.verify;
    },
    passVerify() {}
  },
  components: {
    scheduleTable
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
  width: 47%;
  background: white;
  border-radius: 6px;
  overflow: hidden;
  margin-left: 2%;
  margin-top: -20vh;
}
#photo {
  width: 48%;
  border-radius: 6px;
  margin-top: -20vh;
  margin-left: 1%;
}
.main-function {
  position: absolute;
  bottom: 20vh;
  left: 0;
  right: 0;
  margin: 0 auto;
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