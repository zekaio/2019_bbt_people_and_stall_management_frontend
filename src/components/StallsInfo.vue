<template>
    <div>
        <transition name="el-zoom-in-center">
            <div id="main_content" v-show="!detail && !edit">
                <el-card class="box-card" v-for="(stall, index) in stalls" :key="index">
                    <div slot="header" class="clearfix">
                        <span>{{stall.name}}</span>
                        <el-button class="oper_button" type="text"
                                   @click="stall.onDelete">删除项目</el-button>
                        <el-button class="oper_button" type="text"
                                   @click="stall.onEdit">修改信息</el-button>
                        <el-button class="oper_button" type="text"
                                   @click="stall.onDetail">查看详情</el-button>
                    </div>
                    <el-row :gutter="20" class="grid-content" v-for="(item, index) in stall.detail" :key="index">
                        <el-col :span="8"><div><b>{{item.field}}</b></div></el-col>
                        <el-col :span="16"><div>{{item.value}}</div></el-col>
                    </el-row>
                </el-card>
            </div>
        </transition>
        <transition name="el-zoom-in-center">
            <div id="edit_content" v-show="edit">
                <h1>修改摆摊项目：{{selected_stall.name}}</h1>
                <el-row :gutter="20" class="edit-grid-content bg-purple">
                    <el-col :span="4"><div>名称</div></el-col>
                    <el-col :span="20"><div>
                        <el-input id="name_input" v-model="selected_stall.name" clearable
                                  maxlength="16" @focus="onFocus" placeholder="请输入项目名称">
                        </el-input>
                    </div></el-col>
                </el-row>
                <el-row :gutter="20" class="edit-grid-content bg-purple">
                    <el-col :span="4"><div>描述</div></el-col>
                    <el-col :span="20"><div id="desc_container">
                        <el-input id="desc_input" v-model="selected_stall.description" type="textarea"
                                  :rows="8" clearable @focus="onFocus"
                                  placeholder="请输入项目描述">
                        </el-input>
                    </div></el-col>
                </el-row>
                <el-row :gutter="20" class="button_content">
                    <el-button id="edit" @click="onEditStallConfirm" type="primary">修改</el-button>
                    <el-button id="close_edit" @click="edit=false" type="primary" plain>关闭</el-button>
                </el-row>
            </div>
        </transition>
        <transition name="el-zoom-in-center">
            <el-collapse id="detail_content" v-model="active_tags" v-show="detail && !add_substall && !sub_stall_detail">
                <el-collapse-item title="基本信息" name="1">
                    <el-row :gutter="20" class="detail-grid-content">
                        <el-col :span="8"><div><b>项目名称</b></div></el-col>
                        <el-col :span="16"><div>{{selected_stall.name}}</div></el-col>
                    </el-row>
                    <el-row :gutter="20" class="detail-grid-content" v-for="(item, index) in selected_stall.detail" :key="index">
                        <el-col :span="8"><div><b>{{item.field}}</b></div></el-col>
                        <el-col :span="16"><div>{{item.value}}</div></el-col>
                    </el-row>
                </el-collapse-item>
                <el-collapse-item title="摆摊信息" name="2">
                    <!--el-pagination id="pagination_content"
                                   layout="prev, pager, next"
                                   @current-change="onPageChanged"
                                   :current-page="current_page"
                                   :page-size="per_page" :total="total">
                    </el-pagination>
                    <div id="page_info">第 {{current_page}} 页，每页 {{per_page}} 项，共 {{Math.ceil(total/per_page)}} 页。共 {{total}} 项，本页显示第 {{from}} 项到第 {{to}} 项</div-->
                    <el-row :gutter="20" class="detail-grid-content">
                        <el-col :span="8"><div>共 {{sub_stalls.length}} 个摆摊内容</div></el-col>
                        <el-col :span="16">
                            <el-button id="export_excel" @click="exportExcel" type="primary">导出表格</el-button>
                            <el-button id="add_stall" @click="add_substall=true" type="primary">添加摆摊</el-button>
                        </el-col>
                    </el-row>
                    <div class="table_content">
                        <el-table :data="sub_stalls" stripe border>
                            <el-table-column prop="order" label="编号" width="52"></el-table-column>
                            <el-table-column prop="date" label="日期" width="96"></el-table-column>
                            <el-table-column prop="start" label="开始节" width="64"></el-table-column>
                            <el-table-column prop="end" label="结束节" width="64"></el-table-column>
                            <el-table-column prop="location" label="地点"></el-table-column>
                            <el-table-column prop="number" label="所需人数"></el-table-column>
                            <!--el-table-column prop="added" label="已有人数"></el-table-column-->
                            <el-table-column label="操作" width="96" fixed="right">
                                <template slot-scope="scope">
                                    <el-button @click="onDetail(scope.row)" type="text">详情</el-button>
                                    <el-button @click="onDelete(scope.row)" type="text">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-collapse-item>
                <el-row :gutter="20" class="button_content">
                    <el-button id="close_detail" @click="detail=false" type="primary">关闭</el-button>
                </el-row>
            </el-collapse>
        </transition>
        <transition name="el-zoom-in-center">
            <div id="add_sub_stall_content" v-show="add_substall">
                <h1>为 {{selected_stall.name}} 添加第 {{sub_stalls.length+1}} 个摆摊内容</h1>
                <el-row :gutter="20" class="detail-grid-content bg-purple">
                    <el-col :span="4"><div>名称</div></el-col>
                    <el-col :span="20"><div>
                        <el-input id="sub_name" v-model="create.sub_name" clearable
                                  @focus="onFocus" placeholder="请输入摆摊名称">
                        </el-input>
                    </div></el-col>
                </el-row>
                <el-row :gutter="20" class="detail-grid-content bg-purple">
                    <el-col :span="4"><div>地点</div></el-col>
                    <el-col :span="20"><div>
                        <el-input id="location_input" v-model="create.location" clearable
                                  @focus="onFocus" placeholder="请输入摆摊地点">
                        </el-input>
                    </div></el-col>
                </el-row>
                <el-row :gutter="20" class="detail-grid-content bg-purple">
                    <el-col :span="4"><div>开始节</div></el-col>
                    <el-col :span="20"><div>
                        <el-select id="start_sess" v-model="create.start_sess" placeholder="请选择">
                            <el-option v-for="opt in create.sess_options"
                                       :key="opt" :label="opt" :value="opt">
                            </el-option>
                        </el-select>
                    </div></el-col>
                </el-row>
                <el-row :gutter="20" class="detail-grid-content bg-purple">
                    <el-col :span="4"><div>结束节</div></el-col>
                    <el-col :span="20"><div>
                        <el-select id="end_sess" v-model="create.end_sess" placeholder="请选择">
                            <el-option v-for="opt in create.sess_options"
                                       :key="opt" :label="opt" :value="opt">
                            </el-option>
                        </el-select>
                    </div></el-col>
                </el-row>
                <el-row :gutter="20" class="detail-grid-content bg-purple">
                    <el-col :span="4"><div>人数</div></el-col>
                    <el-col :span="20"><div>
                        <el-input-number v-model="create.num" :min="0" :max="99" label="摆摊人数"></el-input-number>
                    </div></el-col>
                </el-row>
                <el-row :gutter="20" class="detail-grid-content bg-purple">
                    <el-col :span="4"><div>日期</div></el-col>
                    <el-col :span="20"><div>
                        <el-date-picker id="date_input" v-model="create.date"
                                        type="date" placeholder="选择日期"
                                        @focus="onDateFocus">
                        </el-date-picker>
                    </div></el-col>
                </el-row>
                <el-row :gutter="20" class="button_content">
                    <el-button id="add" @click="addSubStall" type="primary">添加</el-button>
                    <el-button id="close" @click="closeSubStall" type="primary">返回</el-button>
                </el-row>
            </div>
        </transition>
        <transition name="el-zoom-in-center">
            <el-collapse id="sub_stall_detail_content" v-model="active_tags" v-show="sub_stall_detail">
                <el-collapse-item title="摆摊信息" name="1">
                    <el-row :gutter="20" class="detail-grid-content" v-for="(item, index) in selected_sub_stall_detail" :key="index">
                        <el-col :span="8"><div><b>{{item.field}}</b></div></el-col>
                        <el-col :span="16"><div>{{item.value}}</div></el-col>
                    </el-row>
                </el-collapse-item>
                <el-collapse-item title="人员信息" name="2">
                    <el-row :gutter="20" class="detail-grid-content" v-if="no_duty">
                        <div class="tips">请先添加负责人！</div>
                        <el-col :span="4"><div>学号</div></el-col>
                        <el-col :span="12"><div>
                            <el-input id="duty_sno" v-model="duty_sno" clearable
                                      maxlength="12" @focus="onFocus" placeholder="请输入负责人学号">
                            </el-input>
                        </div></el-col>
                        <el-col :span="8">
                            <el-button id="add_duty" @click="addDuty" type="primary">添加负责人</el-button>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" class="detail-grid-content button_content" v-if="!no_duty">
                        <el-button id="random_member" @click="randomMember" type="primary">随机分配成员</el-button>
                    </el-row>
                    <div class="table_content">
                        <el-table :data="member_data" stripe border>
                            <el-table-column prop="name" label="姓名"></el-table-column>
                            <el-table-column prop="sno" label="学号" width="118"></el-table-column>
                            <el-table-column prop="sex" label="性别" width="50"></el-table-column>
                            <el-table-column prop="dept" label="部门" width="96"></el-table-column>
                            <el-table-column prop="group" label="管理层"></el-table-column>
                            <el-table-column prop="mobile" label="手机号" width="108"></el-table-column>
                            <el-table-column prop="role" label="负责人"></el-table-column>
                            <el-table-column prop="check_in" label="签到"></el-table-column>
                            <el-table-column label="操作" width="96" fixed="right">
                                <template slot-scope="scope">
                                    <el-button @click="onMemberCheckIn(scope.row)" type="text">签到</el-button>
                                    <el-button @click="onMemberDelete(scope.row)" type="text" v-if="member_data.length<=1">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-collapse-item>
                <el-row :gutter="20" class="button_content">
                    <el-button id="close_sub_stall_detail" @click="sub_stall_detail=false" type="primary">关闭</el-button>
                </el-row>
            </el-collapse>
        </transition>
    </div>
</template>

<script>
    import stall from "../utils/stall_utils";
    import web from '../utils/web_utils';
    import fetch from "../utils/fetch_utils";
    import admin from '../utils/admin_utils';
    import auth from '../utils/auth_utils';
    import data from '../utils/data_utils';

    const SNOReg = /^20[0-9]{10}$/;

    const SNOIncorrect = "学号输入格式不正确！";
    const SNOEmpty = "学号未填写！";
    const NameEmpty = "名称未填写！";
    const DescriptionEmpty = "描述未填写！";
    const LocationEmpty = "地点未填写！";
    const DateEmpty = "日期未填写！";

    var stalls = [];

    function onFocus(event) {
        console.info("onFocus: ", this, event);
        web.web.removeInvalid(event.target);
    }

    function onDateFocus(event) {
        console.info("onFocus: ", this, event);
        web.web.removeInvalid(event.$el.children[0]);
    }

    async function makeStallsData(self) {
        //stall.createFirstWeekRoute(2019, 1, '2019-8-26');
        while(stalls.length > 0) stalls.pop();
        let _stalls = await stall.refreshStalls();
        for(var s=0; s<_stalls.length; s++)
            stalls.push(convertToData(self, _stalls[s]));
        console.info("makeStallsData: ", _stalls, stalls);
    }

    function convertToData(self, stall) {
        stall.detail = makeDetail(stall);
        return { name: stall.name, detail: stall.detail,
            onDetail: async ()=> await detailStall.call(self, stall),
            onEdit: ()=> editStall.call(self, stall),
            onDelete: ()=> deleteStall.call(self, stall),
        };
    }

    function makeDetail(stall) {
        return [
            {field: "创建日期", value: stall.created_at},
            {field: "发起部门", value: data.getDeptById(stall.department_id).name},
            {field: "项目描述", value: stall.description},
            {field: "任务数量", value: stall.stall_tasks[0] ?
                    stall.stall_tasks[0].tasks_number : 0},
        ]
    }

    async function getSubStalls(stall_data) {
        var res = await stall.getSubStalls(stall_data.id);
        if(res && !res.error) {
            for(var i=0;i<res.length;i++) res[i].order = i+1;
            return res;
        }
        return [];
    }

    async function detailStall(stall) {
        this.selected_stall = stall;
        this.detail = true;
        this.sub_stalls = await getSubStalls(stall);
    }

    function editStall(stall) {
        this.selected_stall = stall;
        this.edit = true;
        console.info(this);
    }

    async function onEditStallConfirm (){
        let stall_data = this.selected_stall;
        let res = validateCreate.call(this) && await stall.updateStall(stall_data.id,
            stall_data.name, stall_data.description, auth.getDeptId());
        if(res) {
            web.web.showAlert("成功修改项目！");
            await makeStallsData(this);
            this.edit = false;
        }
    }

    async function onDeleteConfirm(stall_data) {
        let res = await stall.deleteStall(stall_data.id);
        if(res) {
            web.web.showAlert("项目 "+stall_data.name+" 已删除！");
            await makeStallsData(this);
        }
    }

    function deleteStall(stall) {
        web.web.showConfirm("确定删除项目 "+stall.name+" 吗？", onDeleteConfirm.bind(this, stall))
    }

    function validateCreate() {
        let flag = true;
        if(this.selected_stall.name.length <= 0)
            flag = web.web.setInvalid(name_input, NameEmpty);
        if(this.selected_stall.description.length <= 0)
            flag = web.web.setInvalid(desc_input, DescriptionEmpty);
        return flag;
    }

    function validateSubStall() {
        let flag = true;
        if(this.create.sub_name.length <= 0)
            flag = web.web.setInvalid(sub_name, NameEmpty);
        if(this.create.location.length <= 0)
            flag = web.web.setInvalid(location_input, LocationEmpty);
        if(!this.create.date)
            flag = web.web.setInvalid(date_input, DateEmpty);
        return flag;
    }

    async function addSubStall() {
        if(this.create.date instanceof Date)
            this.create.date = this.create.date.format('yyyy-MM-dd');
        let date = this.create.date;
        if(date instanceof Date) date = date.format('yyyy-MM-dd');
        let res = validateSubStall.call(this);
        if (!res) return;
        res = await stall.createSubStall(this.selected_stall.id,
            this.create.location, date, this.create.num,
            this.create.start_sess, this.create.end_sess);
        console.info(res);
        if(res && !res.error) {
            web.web.showAlert("添加摆摊成功！目前本项目已有 "+(this.sub_stalls.length+1)+" 个摆摊活动，你可继续添加。");
            this.sub_stalls = await getSubStalls(this.selected_stall);
        }
    }

    async function closeSubStall() {
        this.add_substall = false;
    }

    function makeMemberData(members) {
        let res = [];
        for(var i in members)
            res.push(convertToMemberData(members[i]));
        return res;
    }

    function convertToMemberData(member){
        return {
            sno: member.sno, id: member.id,
            group: data.getGroupById(member.group_id).name,
            dept: data.getDeptById(member.department_id).name,
            name: member.detail.name, sex: member.detail.sex,
            mobile: member.detail.mobile,
            role: member.stallTasks.role ? "是" : "否",
            check_in: member.stallTasks.check_in ? "是" : "否",
        }
    }

    function makeSubStallDetail(row) {
        return [
            {field: "日期", value: row.date},
            {field: "开始节", value: row.start},
            {field: "结束节", value: row.end},
            {field: "地点", value: row.location},
            {field: "所需人数", value: row.number},
        ]
    }

    async function onDetail(row) {
        console.info("onDetail: ",row);
        let res = await stall.getSubStallMember(row.id);
        if(res) {
            this.member_data = makeMemberData(res);
            this.no_duty = !this.member_data.some((data)=>data.role==='是');
            this.selected_sub_stall = row;
            this.selected_sub_stall_detail = makeSubStallDetail(row);
            this.sub_stall_detail = true;
        }
    }

    async function onDeleteSubStallConfirm(row) {
        let res = await stall.deleteSubStall(row.id);
        if(!res) {
            web.web.showAlert("已删除指定摆摊！");
            this.sub_stalls = await getSubStalls(this.selected_stall);
        }
    }

    async function onDelete(row) {
        web.web.showConfirm("真的要删除该摆摊吗？", onDeleteSubStallConfirm.bind(this, row));
    }

    function validateDuty(){
        var flag = true;
        if(this.duty_sno.length <= 0)
            flag = web.web.setInvalid(duty_sno, SNOEmpty);
        else if(!this.duty_sno.match(SNOReg))
            flag = web.web.setInvalid(duty_sno, SNOIncorrect);
        return flag;
    }

    async function addDuty() {
        let id = this.selected_sub_stall.id;
        let res = validateDuty.call(this);
        if(!res) return;
        res = await stall.addSubStallDuty(id, this.duty_sno);
        if(!res) {
            web.web.showAlert("添加负责人成功！");
            if(res = await stall.getSubStallMember(id)) {
                this.member_data = makeMemberData(res);
                this.no_duty = !this.member_data.some((data) => data.role === '是');
            }
        }
    }

    async function onDeleteMemberConfirm(row) {
        let id = this.selected_sub_stall.id;
        if(row.role === '是') {
            let res = await stall.deleteSubStallDuty(id);
            if(!res) {
                web.web.showAlert("已删除本摆摊负责人！");
                if(res = await stall.getSubStallMember(id)) {
                    this.member_data = makeMemberData(res);
                    this.no_duty = !this.member_data.some((data) => data.role === '是');
                }
            }
        }else
            web.web.showAlert("暂不支持删除普通成员！");
    }

    function onMemberDelete(row) {
        web.web.showConfirm("真的要删除 "+row.name+" 吗？", onDeleteMemberConfirm.bind(this, row));
    }

    async function onMemberCheckIn(row) {
        let id = this.selected_sub_stall.id, res;
        if(row.check_in === '是') web.web.showAlert("该成员已签到！");
        else {
            await stall.checkInSubStall(id,row.id);
            if(res = await stall.getSubStallMember(id)) {
                this.member_data = makeMemberData(res);
                this.no_duty = !this.member_data.some((data) => data.role === '是');
            }
        }

    }

    async function randomMember() {
        let id = this.selected_sub_stall.id;
        var res = await stall.randomSubStall(id);
        if(!res) {
            web.web.showAlert("随机添加人员成功！");
            if(res = await stall.getSubStallMember(id)) {
                this.member_data = makeMemberData(res);
                this.no_duty = !this.member_data.some((data) => data.role === '是');
            }
        }
    }

    async function exportExcel() {
        let res = await stall.getExportPath(this.selected_stall.id);
        if(res && !res.error) window.open(fetch.URL + res.path);
    }

    export default {
        data() {
            web.web.checkLogin(this) && makeStallsData(this);
            return {
                detail: false, edit: false,
                sub_stall_detail: false,
                sub_stall_edit: false,

                duty_add: false,

                add_substall: false,
                selected_stall: {},
                selected_sub_stall: {},

                selected_sub_stall_detail: [],

                active_tags: ['1','2'],
                sub_stalls: [],
                stalls,

                duty_sno: '',
                no_duty: true,
                member_data: [],

                create: {
                    sub_name: '',
                    location: '',
                    num: 1,
                    //start_day: '周一',
                    start_sess: '1',
                    //end_day: '周一',
                    end_sess: '2',
                    date: new Date(),
                    //day_options: data.days,
                    sess_options: data.sesses,
                }
            }
        },
        methods: {
            onFocus, onDateFocus,
            addSubStall, closeSubStall,
            onEditStallConfirm,
            onDetail, onDelete,
            onMemberCheckIn, onMemberDelete,
            addDuty, randomMember, exportExcel
        }
    }
</script>

<style scoped>
    #main_content{
        position: absolute;
        padding: 12px 24px;
        left: 0; right: 0;
        margin: 32px 5% 32px;
        min-width: 444px;
        max-width: 840px;
        text-align: center;
        border-radius: 4px;
        background: rgba(192,192,192,0.2);
    }
    #edit_content {
        position: absolute;
        padding: 12px 24px;
        left: 0; right: 0;
        margin: 32px 10% 32px;
        min-width: 384px;
        max-width: 680px;
        text-align: center;
        border-radius: 4px;
        background: rgba(192,192,192,0.2);
    }
    #detail_content {
        position: absolute;
        padding: 12px 24px;
        left: 0; right: 0;
        margin: 32px 5% 32px;
        min-width: 384px;
        max-width: 840px;
        text-align: center;
        border-radius: 4px;
        background: rgba(192,192,192,0.2);
    }
    #sub_stall_detail_content {
        position: absolute;
        padding: 12px 24px;
        left: 0; right: 0;
        margin: 32px 5% 32px;
        min-width: 384px;
        max-width: 840px;
        text-align: center;
        border-radius: 4px;
        background: rgba(192,192,192,0.2);
    }

    #add_sub_stall_content {
        position: absolute;
        padding: 12px 24px;
        left: 0; right: 0;
        margin: 32px 5% 32px;
        min-width: 424px;
        max-width: 680px;
        text-align: center;
        border-radius: 4px;
        background: rgba(192,192,192,0.2);
    }

    h1{
        margin: 0;
    }

    .oper_button {
        float:right;
        padding: 3px 0;
        margin-left: 3px;
        margin-right: 3px;
    }

    .text {
        font-size: 14px;
    }

    .grid-content {
        padding: 4px 4px 0;
        line-height: 36px;
        border-bottom-color: rgba(0,0,0,0.15);
        border-bottom-style: solid;
        border-bottom-width: 1px;
        font-size: 15px;
        text-align: left;
        height: fit-content;
    }
    .edit-grid-content {
        padding: 4px;
        line-height: 36px;
        border-radius: 4px;
        font-size: 15px;
        text-align: left;
    }
    .detail-grid-content{
        padding: 4px;
        line-height: 36px;
        border-radius: 4px;
        font-size: 15px;
        text-align: left;
    }
    #desc_container{
        height: fit-content;
        margin-bottom: 16px;
    }
    .button_content{
        text-align: center;
    }

    #add_stall {
        float: right;
        margin-left: 4px;
    }
    #export_excel {
        float: right;
        margin-left: 4px;
    }

    .tips {
        text-align: center;
        color: red;
        margin-top: -8px;
        margin-bottom: -4px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }

    .box-card {
        margin-top: 12px;
        margin-bottom: 12px;
        width: 100%;
        text-align: left;
    }
</style>
