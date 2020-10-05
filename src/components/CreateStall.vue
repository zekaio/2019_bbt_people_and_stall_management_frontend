<template>
    <div>
        <transition name="el-zoom-in-center">
            <div id="create_content" v-show="!created">
                <h1>添加摆摊项目</h1>
                <el-row :gutter="20" class="grid-content bg-purple">
                    <el-col :span="4"><div>名称</div></el-col>
                    <el-col :span="20"
                        ><div>
                            <el-input
                                id="name_input"
                                v-model="name"
                                clearable
                                maxlength="16"
                                @focus="onFocus"
                                placeholder="请输入项目名称"
                            >
                            </el-input></div
                    ></el-col>
                </el-row>
                <el-row :gutter="20" class="grid-content bg-purple">
                    <el-col :span="4"><div>描述</div></el-col>
                    <el-col :span="20"
                        ><div id="desc_container">
                            <el-input
                                id="desc_input"
                                v-model="description"
                                type="textarea"
                                :rows="8"
                                clearable
                                @focus="onFocus"
                                placeholder="请输入项目描述"
                            >
                            </el-input></div
                    ></el-col>
                </el-row>
                <el-row :gutter="20" class="button_content">
                    <el-button id="create" @click="create" type="primary"
                        >添加</el-button
                    >
                </el-row>
            </div>
        </transition>
        <transition name="el-zoom-in-center">
            <div id="sub_stall_content" v-show="created">
                <h1>为 {{ name }} 添加第 {{ counter }} 个摆摊内容</h1>
                <el-row :gutter="20" class="grid-content bg-purple">
                    <el-col :span="4"><div>名称</div></el-col>
                    <el-col :span="20"
                        ><div>
                            <el-input
                                id="sub_name"
                                v-model="sub_name"
                                clearable
                                @focus="onFocus"
                                placeholder="请输入摆摊名称"
                            >
                            </el-input></div
                    ></el-col>
                </el-row>
                <el-row :gutter="20" class="grid-content bg-purple">
                    <el-col :span="4"><div>校区</div></el-col>
                    <el-col :span="20"
                        ><div>
                            <el-select
                                id="campus"
                                v-model="campus"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="opt in campus_options"
                                    :key="opt"
                                    :label="opt"
                                    :value="opt"
                                >
                                </el-option>
                            </el-select></div
                    ></el-col>
                </el-row>
                <el-row :gutter="20" class="grid-content bg-purple">
                    <el-col :span="4"><div>地点</div></el-col>
                    <el-col :span="20"
                        ><div>
                            <el-input
                                id="location_input"
                                v-model="location"
                                clearable
                                @focus="onFocus"
                                placeholder="请输入摆摊地点"
                            >
                            </el-input></div
                    ></el-col>
                </el-row>
                <el-row :gutter="20" class="grid-content bg-purple">
                    <el-col :span="4"><div>开始节</div></el-col>
                    <el-col :span="20"
                        ><div>
                            <el-select
                                id="start_sess"
                                v-model="start_sess"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="opt in sess_options"
                                    :key="opt"
                                    :label="opt"
                                    :value="opt"
                                >
                                </el-option>
                            </el-select></div
                    ></el-col>
                </el-row>
                <el-row :gutter="20" class="grid-content bg-purple">
                    <el-col :span="4"><div>结束节</div></el-col>
                    <el-col :span="20"
                        ><div>
                            <el-select
                                id="end_sess"
                                v-model="end_sess"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="opt in sess_options"
                                    :key="opt"
                                    :label="opt"
                                    :value="opt"
                                >
                                </el-option>
                            </el-select></div
                    ></el-col>
                </el-row>
                <el-row :gutter="20" class="grid-content bg-purple">
                    <el-col :span="4"><div>人数</div></el-col>
                    <el-col :span="20"
                        ><div>
                            <el-input-number
                                v-model="num"
                                :min="0"
                                :max="99"
                                label="摆摊人数"
                            ></el-input-number></div
                    ></el-col>
                </el-row>
                <el-row :gutter="20" class="grid-content bg-purple">
                    <el-col :span="4"><div>日期</div></el-col>
                    <el-col :span="20"
                        ><div>
                            <el-date-picker
                                id="date_input"
                                v-model="date"
                                type="date"
                                placeholder="选择日期"
                                @focus="onDateFocus"
                            >
                            </el-date-picker></div
                    ></el-col>
                </el-row>
                <el-row :gutter="20" class="button_content">
                    <el-button id="add" @click="add" type="primary"
                        >添加</el-button
                    >
                    <el-button id="close" @click="close" type="primary"
                        >返回</el-button
                    >
                </el-row>
            </div>
        </transition>
    </div>
</template>

<script>
import web from "../utils/web_utils";
import auth from "../utils/auth_utils";
import data from "../utils/data_utils";
import stall from "../utils/stall_utils";

const NameEmpty = "名称未填写！";
const DescriptionEmpty = "描述未填写！";
const LocationEmpty = "地点未填写！";
const DateEmpty = "日期未填写！";

var cur_stall = {};

function onFocus(event) {
    console.info("onFocus: ", this, event);
    web.web.removeInvalid(event.target);
}

function onDateFocus(event) {
    console.info("onFocus: ", this, event);
    web.web.removeInvalid(event.$el.children[0]);
}

function validateCreate() {
    let flag = true;
    if (this.name.length <= 0) flag = web.web.setInvalid(name_input, NameEmpty);
    if (this.description.length <= 0)
        flag = web.web.setInvalid(desc_input, DescriptionEmpty);
    return flag;
}

function validateSubStall() {
    let flag = true;
    if (this.sub_name.length <= 0)
        flag = web.web.setInvalid(sub_name, NameEmpty);
    if (this.location.length <= 0)
        flag = web.web.setInvalid(location_input, LocationEmpty);
    if (!this.date) flag = web.web.setInvalid(date_input, DateEmpty);
    return flag;
}

function clear() {
    this.name = this.description = "";
}

async function create() {
    let dept_id = auth.getDeptId();
    let res =
        validateCreate.call(this) &&
        (await stall.createStall(this.name, this.description, dept_id));
    if (res) {
        console.info("create: ", res);
        cur_stall = res;
        this.created = true;
        web.web.showAlert("添加项目成功！");
    }
}

async function add() {
    if (this.date instanceof Date) this.date = this.date.format("yyyy-MM-dd");
    let res = validateSubStall.call(this);
    if (!res) return;
    res = await stall.createSubStall(
        cur_stall.id,
        this.campus,
        this.location,
        this.date,
        this.num,
        this.start_sess,
        this.end_sess
    );
    console.info(res);
    if (res)
        web.web.showAlert(
            "添加摆摊成功！目前本项目已有 " +
                this.counter++ +
                " 个摆摊活动，你可继续添加。"
        );
}

function close() {
    this.$router.push("/stalls");
}

export default {
    name: "CreateMembers",
    data() {
        web.web.checkLogin(this);
        let groups = data.getGroupsSelections();
        return {
            created: false,
            name: "",
            description: "",
            sub_name: "",
            location: "",
            counter: 1,
            num: 1,
            start_sess: "1",
            end_sess: "2",
            campus: "大学城校区",
            date: new Date(),
            sess_options: data.sesses,
            campus_options: data.campus
        };
    },
    methods: {
        create,
        add,
        onFocus,
        onDateFocus,
        close
    }
};
</script>

<style scoped>
#create_content {
    /*position: absolute;*/
    padding: 12px 24px;
    margin: 32px 10% 32px;
    min-width: 384px;
    max-width: 680px;
    text-align: center;
    border-radius: 4px;
    background: rgba(192, 192, 192, 0.2);
}
#sub_stall_content {
    /*position: absolute;*/
    padding: 12px 24px;
    margin: 32px 10% 32px;
    min-width: 384px;
    max-width: 680px;
    text-align: center;
    border-radius: 4px;
    background: rgba(192, 192, 192, 0.2);
}

h1 {
    margin: 0;
}
.grid-content {
    padding: 4px;
    line-height: 36px;
    border-radius: 4px;
    font-size: 15px;
    text-align: left;
}
#desc_container {
    height: fit-content;
    margin-bottom: 16px;
}
.button_content {
    margin-top: 24px;
    text-align: center;
}
#create,
#add {
    width: 128px;
}
</style>
