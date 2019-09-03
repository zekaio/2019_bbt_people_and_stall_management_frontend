<template>
    <div>
        <el-collapse id="edit_content" v-model="activeNames" @change="handleChange">
            <el-collapse-item class="item" title="修改头像" name="1">
                <div class="tips">注：只支持jpg、png和gif格式</div>
                <div class="ori_avatar crop_img"
                     :style="{'backgroundImage':'url('+image_url+')'}"></div>
                <el-upload
                    class="avatar-uploader"
                    :action="avatar_route"
                    name="avatar"
                    :headers="headers"
                    :show-file-list="false"
                    :on-progress="handleUploading"
                    :on-error="handleAvatarError"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <div class="avatar">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    </div>
                </el-upload>
            </el-collapse-item>
            <el-collapse-item class="item" title="修改信息" name="2">
                <div class="tips">注：红色为必填项，黑色为选填项</div>
                <el-row :gutter="20" class="grid-content" v-for="item in items">
                    <el-col :span="8"><div v-bind:class="{ must: item.must }"><b>{{item.field}}</b></div></el-col>
                    <el-col :span="16"><div>
                        <el-input v-bind:id="item.key+'_input'" v-model="detail[item.key]"
                                  clearable v-bind:maxlength="item.max || 48"
                                  @focus="onFocus" v-if="item.type==='text'">
                        </el-input>

                        <el-input v-bind:id="item.key+'_input'" v-model="detail[item.key]" clearable
                                  @input="onInputLimitNumber" v-bind:maxlength="item.max || 48"
                                  @focus="onFocus" v-if="item.type==='number'">
                        </el-input>

                        <el-radio-group v-bind:id="item.key+'_input'" v-model="detail[item.key]"
                                        @focus="onFocus" v-if="item.type==='radio'">
                            <el-radio v-for="opt in item.options"
                                      :label="opt">{{opt}}</el-radio>
                        </el-radio-group>

                        <el-select v-bind:id="item.key+'_input'" v-model="detail[item.key]"
                                   placeholder="请选择" v-bind:clearable="!item.must"
                                   @focus="onFocus" v-if="item.type==='select'">
                            <el-option
                                v-for="opt in item.options"
                                :key="opt" :label="opt" :value="opt">
                            </el-option>
                        </el-select>

                        <el-date-picker v-bind:id="item.key+'_input'" v-model="detail[item.key]"
                                        type="date" placeholder="选择日期"
                                        @focus="onDateFocus" v-if="item.type==='date'">
                        </el-date-picker>
                    </div></el-col>
                </el-row>
                <el-row :gutter="20" id="button_content">
                    <el-button id="edit" @click="edit" type="primary">修改</el-button>
                    <el-button id="reset" @click="reset" type="primary" plain>重置</el-button>
                </el-row>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
    import web from '../utils/web_utils';
    import auth from '../utils/auth_utils';
    import data from '../utils/data_utils';

    const PhoneReg = /^1[0-9]{10}$/;
    const ShortReg = /^[0-9]*$/;
    const QQReg = /^[0-9]*$/;

    const NameEmpty = "名字不能为空！";
    //const BulidIncorrect = "宿舍楼格式不正确！";
    //const RoomIncorrect = "宿舍号格式不正确！";
    const DateEmpty = "生日不能为空！";
    const PhoneEmpty = "手机号不能为空！";
    const PhoneIncorrect = "手机号格式不正确！";
    const ShortIncorrect = "短号格式不正确！";
    const QQIncorrect = "QQ格式不正确！";

    function onFocus(event) {
        console.info("onFocus: ", this, event);
        web.web.removeInvalid(event.target);
    }

    function onDateFocus(event) {
        console.info("onFocus: ", this, event);
        web.web.removeInvalid(event.$el.children[0]);
    }

    var detail = {};

    function updateDetail() {
        detail.sex = auth.getSex();
        detail.name = auth.getName();
        //detail.avatar = auth.getAvatar();
        detail.dormitory = auth.getDormBulid();
        detail.room = auth.getDormRoom();
        detail.college = auth.getCollege();
        detail.major = auth.getMajor();
        detail.class = auth.getClass();
        detail.birth = auth.getBirth();
        detail.origin = auth.getOrigin();
        detail.politics = auth.getPolitics();
        detail.mobile = auth.getMobile();
        detail.shortMobile = auth.getShortMobile();
        detail.qq = auth.getQQ();
        detail.weibo = auth.getWeibo();
    }

    // 修改信息校验
    function validateEdit() {
        var flag = true;
        console.info(detail);
        if(!detail.name)
            flag = web.web.setInvalid(name_input, NameEmpty, detail, 'name');
        if(!detail.mobile)
            flag = web.web.setInvalid(mobile_input, PhoneEmpty, detail, 'mobile');
        else if(!detail.mobile.match(PhoneReg))
            flag = web.web.setInvalid(mobile_input, PhoneIncorrect, detail, 'mobile');
        if(detail.shortMobile && !detail.shortMobile.match(ShortReg))
            flag = web.web.setInvalid(shortMobile_input, ShortIncorrect, detail, 'shortMobile');
        if(detail.qq && !detail.qq.match(QQReg))
            flag = web.web.setInvalid(qq_input, QQIncorrect, detail, 'qq');
        if(!detail.birth)
            flag = web.web.setInvalid(birth_input, DateEmpty, detail, 'birth');
        return flag;
    }

    function generateSendData() {
        console.info("Origin: ", detail);
        var send_data = JSON.parse(JSON.stringify(detail));
        send_data.college_id = data.getCollegeId(send_data.college);
        if(detail.birth instanceof Date)
            send_data.birth = detail.birth.format('yyyy-MM-dd');
        delete send_data.college;
        console.info("Generate: ", send_data);
        return send_data;
    }

    async function edit() {
        var success = validateEdit() && await auth.edit(generateSendData());
        if(success) {
            web.web.showAlert("信息已成功修改！");
            this.$router.push({path: '/edit'});
        }
    }

    function reset() {
        updateDetail();
    }

    function onInputLimitNumber(value, event) {
        console.info(this, value, event);
        this.value = value.replace(/[^\d]/g,'');
    }

    function handleUploading(event, file) {
        console.info("handleUploading: ",event);
        web.web.showLoading();
    }
    function handleAvatarError(res, file) {
        console.info("handleAvatarError: ",res);
        web.web.showAlert('上传失败！请更换图片或重试！');
        web.web.hideLoading();
    }
    function handleAvatarSuccess(res, file) {
        console.info("handleAvatarSuccess: ", res);
        auth.data.detail.avatar = res.avatar;
        this.image_url = URL.createObjectURL(file.raw);
        web.web.hideLoading();
        web.web.showAlert('上传成功！');
    }
    function beforeAvatarUpload(file) {
        console.info("beforeAvatarUpload: type: "+file.type);
        const isValid = data.acceptable_avatar_type.indexOf(file.type)>=0;
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isValid)
            web.web.showAlert('上传头像图片格式不正确！');
        else if (!isLt2M)
            web.web.showAlert('上传头像图片大小不能超过 2MB！');
        return isValid && isLt2M;
    }

    export default {
        data() {
            web.web.checkLogin(this) && updateDetail();
            return {
                avatar_route: auth.avatarRoute(),
                headers: auth.getHeadersObject(),
                activeNames: ['1','2'],
                image_url: auth.getAvatar(),
                detail,
                items: [
                    {field: "姓名", type: 'text', key: 'name', must: true},
                    {field: "性别", type: 'radio', key: 'sex', must: true,
                        options: data.sexs },
                    {field: "宿舍楼", type: 'text', key: 'dormitory', must: false, max: 5},
                    {field: "宿舍号", type: 'text', key: 'room', must: false, max: 6},
                    {field: "学院", type: 'select', key: 'college', must: false,
                        options: data.getCollegesSelections() },
                    {field: "专业", type: 'text', key: 'major', must: false},
                    {field: "班级", type: 'text', key: 'class', must: false},
                    {field: "生日", type: 'date', key: 'birth', must: true},
                    {field: "户籍", type: 'text', key: 'origin', must: false},
                    {field: "政治面貌", type: 'select', key: 'politics', must: false,
                        options: data.politics},
                    {field: "手机号", type: 'number', key: 'mobile', must: true, max: 11},
                    {field: "短号", type: 'number', key: 'shortMobile', must: false, max: 6},
                    {field: "QQ", type: 'number', key: 'qq', must: false},
                    {field: "微博", type: 'text', key: 'weibo', must: false},
                ],
            };
        },
        methods: {
            onFocus, onDateFocus,
            edit, reset,
            onInputLimitNumber,
            handleUploading,
            handleAvatarError,
            handleAvatarSuccess,
            beforeAvatarUpload,
            handleChange(val) {
                console.log(val);
            }
        },
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #edit_content{
        /*position: absolute;*/
        padding: 12px 24px;
        margin: 32px 15% 32px;
        min-width: 444px;
        max-width: 680px;
        text-align: center;
        border-radius: 4px;
        background: rgba(192,192,192,0.2);
    }
    .tips{
        margin-top: 4px;
        margin-bottom: 12px;
    }

    .item {
        font-size: 32px;
        text-align: left;
        background-color: transparent;
    }

    .must {
        color: red;
    }

    .grid-content {
        padding: 4px;
        margin-bottom: 12px;
        height: 36px;
        line-height: 36px;
        border-radius: 4px;
        font-size: 15px;
        text-align: left;
    }
    #button_content{
        margin-top: 24px;
        margin-bottom: -16px;
        text-align: center;
    }
    #edit{
        width: 92px;
        margin-right: 64px;
    }

    .avatar-uploader {
        display: inline-block;
        margin-left: 24px;
        width: 178px;
        height: 178px;
        border-color: rgb(84,92,100);
        border-style: dashed;
        border-width: 2px;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .ori_avatar{
        display: inline-block;
        width: 178px; height: 178px;
        border-color: rgb(84,92,100);
        border-style: solid;
        border-width: 2px;
        border-radius: 6px;
    }
    .avatar {
        display: block;
        width: 178px; height: 178px;
    }

    .crop_img{
        overflow: hidden;

        background-position: center;
        background-size: cover;
    }
</style>
