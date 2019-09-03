<template>
    <div>
        <div id="reset_content">
            <h1>修改密码</h1>
            <el-row :gutter="20" class="grid-content bg-purple">
                <el-col :span="6"><div>原密码</div></el-col>
                <el-col :span="18"><div>
                    <el-input id="old_password" show-password v-model="old_password"
                              clearable minlength="6" @focus="onFocus"
                              placeholder="请输入原密码">
                    </el-input>
                </div></el-col>
            </el-row>
            <el-row :gutter="20" class="grid-content bg-purple">
                <el-col :span="6"><div>新密码</div></el-col>
                <el-col :span="18"><div>
                    <el-input id="password1" show-password v-model="password1"
                              clearable minlength="6" @focus="onFocus"
                              placeholder="请输入新密码（6位以上）">
                    </el-input>
                </div></el-col>
            </el-row>
            <el-row :gutter="20" class="grid-content bg-purple">
                <el-col :span="6"><div>重复密码</div></el-col>
                <el-col :span="18"><div>
                    <el-input id="password2" show-password v-model="password2"
                              clearable minlength="6" @focus="onFocus"
                              placeholder="请再次输入新密码">
                    </el-input>
                </div></el-col>
            </el-row>
            <el-row :gutter="20" class="grid-content bg-purple">
                <el-button id="reset" @click="reset" type="primary" >修改密码</el-button>
            </el-row>
        </div>
    </div>
</template>

<script>
    import web from "../utils/web_utils";
    import auth from "../utils/auth_utils";

    const PasswordIncorrect = "密码长度要大于6位！";

    const PasswordSame = "新密码与原密码一致！";
    const PasswordDifferent = "再次输入的新密码不一致！";

    const ResetText = "密码已成功修改！";

    function onFocus(event) {
        console.info("onFocus: ", this, event);
        web.web.removeInvalid(event.target);
    }

    // 修改密码信息校验
    function validateReset(op, p1, p2) {
        let flag = true;
        if(op.length < 6) flag = web.web.setInvalid(old_password, PasswordIncorrect);
        if(p1.length < 6) flag = web.web.setInvalid(password1, PasswordIncorrect);
        if(p2.length < 6) flag = web.web.setInvalid(password2, PasswordIncorrect);
        if(p2 !== p1) flag = web.web.setInvalid(password2, PasswordDifferent);
        if(op === p1) flag = web.web.setInvalid(password1, PasswordSame);
        return flag;
    }

    async function reset() {
        var op = old_password.value, p1 = password1.value, p2 = password2.value;
        var success = validateReset(op, p1, p2) && await auth.editPwd(op, p1, p2);
        if(success) {
            web.web.showAlert(ResetText);
            this.$router.push('/user');
        }
    }

    export default {
        data() {
            web.web.checkLogin(this);
            return {
                old_password: '',
                password1: '',
                password2: '',
            }
        }, methods: {
            reset, onFocus
        }
    }
</script>

<style scoped>
    #reset_content{
        padding: 12px 24px;
        margin: 64px 15% 64px;
        min-width: 396px;
        max-width: 680px;
        text-align: center;
        border-radius: 4px;
        background: rgba(192,192,192,0.2);
    }
    h1{
        margin: 0;
    }

    .bg-purple {
        /*background: rgba(128,128,128,0.1);*/
    }
    .grid-content {
        /*height: 64px;*/
        line-height: 64px;
        border-radius: 4px;
    }
    #reset{
        width: 128px;
    }
</style>
