<template>
    <div>
        <transition name="el-zoom-in-center">
            <div id="main_content" v-show="!detail && !edit">
                <el-tabs v-model="main_page" @tab-click="onTabChanged">
                    <el-tab-pane label="全体成员" name="all"></el-tab-pane>
                    <el-tab-pane label="同部门成员" name="dept"></el-tab-pane>
                    <el-tab-pane
                        label="同管理层成员"
                        name="group"
                    ></el-tab-pane>
                </el-tabs>
                <div id="table_content">
                    <el-table :data="page_data" height="100%" stripe border>
                        <el-table-column
                            prop="name"
                            label="姓名"
                        ></el-table-column>
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
                            prop="group"
                            label="管理层"
                        ></el-table-column>
                        <el-table-column
                            prop="create"
                            label="加入时间"
                        ></el-table-column>
                        <el-table-column label="操作" fixed="right">
                            <template slot-scope="scope">
                                <el-button
                                    @click="onDetail(scope.row)"
                                    type="text"
                                    >详情</el-button
                                >
                                <el-button
                                    @click="onEdit(scope.row)"
                                    type="text"
                                    >编辑</el-button
                                >
                                <el-button
                                    @click="onDelete(scope.row)"
                                    type="text"
                                    >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div id="page_info">
                    第 {{ current_page }} 页，每页 {{ per_page }} 项，共
                    {{ Math.ceil(total / per_page) }} 页。共
                    {{ total }} 项，本页显示第 {{ from }} 项到第 {{ to }} 项
                </div>
                <el-pagination
                    id="pagination_content"
                    layout="prev, pager, next"
                    @current-change="onPageChanged"
                    :current-page="current_page"
                    :page-size="per_page"
                    :total="total"
                >
                </el-pagination>
            </div>
        </transition>
        <transition name="el-zoom-in-center">
            <el-collapse
                id="detail_content"
                v-model="active_tags"
                v-show="detail"
            >
                <el-collapse-item class="item" title="基本信息" name="1">
                    <div class="base_info">
                        <div
                            class="icon_container crop_img"
                            :style="{
                                backgroundImage:
                                    'url(' + detail_data.avatar + ')'
                            }"
                        ></div>
                        <div class="name">
                            {{ detail_data.name }}<br /><span class="job">{{
                                detail_data.dept
                            }}</span>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item class="item" title="详细信息" name="2">
                    <el-row
                        :gutter="20"
                        class="detail-grid-content"
                        v-for="(item, index) in detail_data.items"
                        :key="index"
                    >
                        <el-col :span="8"
                            ><div>
                                <b>{{ item.field }}</b>
                            </div></el-col
                        >
                        <el-col :span="16"
                            ><div>{{ item.value }}</div></el-col
                        >
                    </el-row>
                </el-collapse-item>
                <el-row :gutter="20" class="button_content">
                    <el-button
                        id="closeDetail"
                        @click="onDetailClose"
                        type="primary"
                        >关闭</el-button
                    >
                </el-row>
            </el-collapse>
        </transition>
        <transition name="el-zoom-in-center">
            <div id="edit_content" v-show="edit">
                <h1>编辑成员</h1>
                <el-row :gutter="20" class="button_content">
                    <div class="base_info">
                        <div
                            class="icon_container crop_img"
                            :style="{
                                backgroundImage:
                                    'url(' + detail_data.avatar + ')'
                            }"
                        ></div>
                        <div class="name">
                            {{ detail_data.name }}<br /><span class="job">{{
                                detail_data.dept
                            }}</span>
                        </div>
                    </div>
                </el-row>
                <el-row
                    :gutter="20"
                    class="edit-grid-content bg-purple"
                    v-for="(item, index) in edit_items"
                    :key="index"
                >
                    <el-col :span="8"
                        ><div>
                            <b>{{ item.field }}</b>
                        </div></el-col
                    >
                    <el-col :span="16"
                        ><div>
                            <el-select
                                v-bind:id="item.key + '_input'"
                                v-model="detail_data[item.key]"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="opt in item.options"
                                    :key="opt"
                                    :label="opt"
                                    :value="opt"
                                >
                                </el-option>
                            </el-select></div
                    ></el-col>
                </el-row>
                <br />
                <el-row :gutter="20" class="button_content">
                    <el-button
                        id="submitEdit"
                        @click="onEditConfirm"
                        type="primary"
                        >修改</el-button
                    >
                    <el-button
                        id="closeEdit"
                        @click="onEditClose"
                        type="primary"
                        plain
                        >关闭</el-button
                    >
                </el-row>
            </div>
        </transition>
    </div>
</template>

<script>
import fetch from "../utils/fetch_utils";
import web from "../utils/web_utils";
import admin from "../utils/admin_utils";
import auth from "../utils/auth_utils";
import data from "../utils/data_utils";

var member = {};

function onTabChanged() {
    this.current_page = 1;
    loadData(this);
}
function onPageChanged(page) {
    console.info("onPageChanged: ", page);
    this.current_page = page;
    loadData(this);
}

function getDetailData() {
    let dept = member.department.name,
        job = member.group.name;
    let avatar = fetch.URL + member.detail.avatar;
    let college = member.detail.college;
    college = college ? college.name : "";
    return {
        name: member.detail.name,
        dept: dept + " " + job,
        avatar,
        dept_name: dept,
        group_name: job,
        items: [
            { field: "性别", value: member.detail.sex },
            {
                field: "宿舍",
                value:
                    (member.detail.dormitory || "") +
                    "-" +
                    (member.detail.room || "")
            },
            { field: "手机号", value: member.detail.mobile },
            { field: "短号", value: member.detail.shortMobile },
            { field: "校区", value: member.detail.campus },
            { field: "学院", value: college },
            { field: "专业", value: member.detail.major },
            { field: "班级", value: member.detail.class },
            { field: "生日", value: member.detail.birth },
            { field: "户籍", value: member.detail.origin },
            { field: "政治面貌", value: member.detail.politics },
            { field: "QQ", value: member.detail.qq },
            { field: "微博", value: member.detail.weibo },
            { field: "创建日期", value: member.created_at },
            { field: "修改日期", value: member.updated_at }
        ]
    };
}

async function refreshDetail(id) {
    member = await auth.get(id || member.id);
    if (member) {
        this.detail_data = getDetailData();
        this.edit_items = getEditItems();
    }
    return !!member;
}

async function onDetail(row) {
    this.detail = false;
    if (await refreshDetail.call(this, row.id)) this.detail = true;
    else web.web.showAlert("查询成员信息失败！");
}
function onDetailClose() {
    this.detail = false;
    /*this.detail_data = {name: '', dept: '', avatar: '', items: []};*/
}

function getEditItems() {
    return [
        {
            field: "部门",
            key: "dept_name",
            must: true,
            options: data.getDeptsSelections()
        },
        {
            field: "管理层",
            key: "group_name",
            must: true,
            options: data.getGroupsSelections()
        }
    ];
}

async function onEdit(row) {
    this.edit = false;
    if (await refreshDetail.call(this, row.id)) this.edit = true;
    else web.web.showAlert("查询成员信息失败！");
}
async function onEditConfirm() {
    let did = data.getDeptId(this.detail_data.dept_name);
    let gid = data.getGroupId(this.detail_data.group_name);
    let res = await auth.put(member.id, did, gid);
    if (res && res.error) return;
    if (await refreshDetail.call(this)) {
        web.web.showAlert("修改成员信息成功！");
        this.edit = true;
        loadData(this);
    } else {
        web.web.showAlert("查询成员信息失败！");
        onEditClose.call(this);
    }
}
function onEditClose() {
    onDetailClose.call(this);
    this.edit = false;
    /*this.edit_items = [];*/
}

async function onDeleteConfirm(row) {
    let res = await auth.delete(row.id);
    if (res) {
        loadData(this);
        web.web.showAlert(row.name + " 已成功删除！");
    }
}

async function onDelete(row) {
    web.web.showConfirm(
        "确认把 " + row.name + " 移至回收站？",
        onDeleteConfirm.bind(this, row)
    );
}

async function loadData(self, page) {
    let res = false;
    switch (page || self.main_page) {
        case "all":
            res = await admin.getAllMembers(self.current_page);
            break;
        case "dept":
            res = await admin.getDeptMembers(self.current_page);
            break;
        case "group":
            res = await admin.getGroupMembers(self.current_page);
            break;
    }
    if (res) {
        let data = admin.cur_page_data;
        self.current_page = data.current_page;
        self.total = data.total;
        self.per_page = data.per_page;
        self.from = data.from || 0;
        self.to = data.to || 0;
    }
    self.page_data = admin.getShowData();
}

export default {
    data() {
        web.web.checkLogin(this) && loadData(this, "dept");
        return {
            active_tags: ["1"],
            current_page: 1,
            per_page: 20,
            total: 0,
            from: 0,
            to: 0,
            main_page: "dept",
            page_data: admin.getShowData(),
            detail: false,
            edit: false,
            detail_data: {
                dept_name: "",
                group_name: "",
                name: "",
                dept: "",
                avatar: "",
                items: []
            },
            edit_items: []
        };
    },
    methods: {
        onTabChanged,
        onPageChanged,
        onDetail,
        onDetailClose,
        onEdit,
        onEditConfirm,
        onEditClose,
        onDelete
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
#detail_content {
    position: absolute;
    top: 32px;
    left: 5%;
    right: 5%;
    margin-bottom: 32px;
    padding: 12px 24px;
    min-width: 444px;
    max-width: 840px;
    text-align: center;
    border-radius: 4px;
    background: rgba(233, 233, 233, 0.8);
}
#edit_content {
    position: absolute;
    top: 32px;
    left: 5%;
    right: 5%;
    margin-bottom: 32px;
    padding: 12px 24px 16px;
    min-width: 444px;
    max-width: 540px;
    text-align: center;
    border-radius: 4px;
    background: rgba(233, 233, 233, 0.8);
}

.button_content {
    margin-top: 24px;
    margin-bottom: 12px;
    text-align: center;
}

#table_content {
    position: absolute;
    top: 64px;
    bottom: 64px;
    left: 24px;
    right: 24px;
}

#page_info {
    position: absolute;
    left: 24px;
    right: 24px;
    bottom: 42px;
    text-align: center;
    font-size: 14px;
}
#pagination_content {
    position: absolute;
    left: 24px;
    right: 24px;
    bottom: 8px;
}
.el-table {
    text-align: center;
    /*width: auto;*/
    margin: 0 0 4px;
    background-color: transparent;
}
.el-button {
    margin: -16px 2px;
}

h1 {
    margin: 0 0 -24px;
}
br {
    height: 32px;
}

.item {
    font-size: 32px;
    text-align: left;
    background-color: transparent;
}

.base_info {
    padding: 12px 5% 4px;
    height: 128px;
    border-radius: 4px;
}
.icon_container {
    display: inline-block;
    width: 128px;
    height: 128px;
    margin-left: 10%;
    line-height: 128px;
    border-style: solid;
    border-color: rgb(84, 92, 100);
    border-width: 2px;
}
/*
    #icon{
        width: 100%;
        height: 100%;
    }*/
.name {
    display: inline-block;
    margin-top: -16px;
    margin-left: 16px;
    line-height: 36px;
    font-size: 36px;
    font-weight: bold;
    position: relative;
    top: -6px;
}
.job {
    font-size: 16px;
    line-height: 8px;
    font-weight: normal;
}

.edit-grid-content {
    padding: 4px;
    margin-top: 12px;
    margin-bottom: 12px;
    height: 36px;
    line-height: 36px;
    border-radius: 4px;
    font-size: 15px;
    text-align: left;
}
.detail-grid-content {
    padding: 4px;
    height: 36px;
    line-height: 36px;
    border-radius: 4px;
    font-size: 15px;
}

.crop_img {
    background-position: center;
    background-size: cover;
}
</style>
