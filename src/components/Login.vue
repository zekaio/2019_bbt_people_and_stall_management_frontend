<template>
    <div>
        <transition name="el-fade-in-linear">
            <div id="login_content" v-show="!logined">
                <h1>登陆</h1>
                <el-row :gutter="20" class="grid-content bg-purple">
                    <el-col :span="4"><div>学号</div></el-col>
                    <el-col :span="20"><div>
                        <el-input id="username" v-model="username"
                                  clearable maxlength="12" minlength="12"
                                  @focus="onFocus" placeholder="请输入学号">
                        </el-input>
                    </div></el-col>
                </el-row>
                <el-row :gutter="20" class="grid-content bg-purple">
                    <el-col :span="4"><div>密码</div></el-col>
                    <el-col :span="20"><div>
                        <el-input id="password" show-password v-model="password"
                                  clearable minlength="6" @focus="onFocus"
                                  placeholder="请输入密码">
                        </el-input>
                    </div></el-col>
                </el-row>
                <el-row :gutter="20" class="grid-content bg-purple">
                    <el-button id="login" @click="login" type="primary">登陆</el-button>
                    <el-button id="forget" @click="toggleReset" type="text">忘记密码？</el-button>
                </el-row>
            </div>
        </transition>
        <transition name="el-fade-in-linear">
            <div id="reset_content" v-show="!logined && show_reset">
                <h1>重置密码</h1>
                <el-row :gutter="20" class="grid-content bg-purple">
                    <el-col :span="4"><div>学号</div></el-col>
                    <el-col :span="20"><div>
                        <el-input id="username2" v-model="username"
                                  clearable maxlength="12" minlength="12"
                                  @focus="onFocus" placeholder="请输入学号">
                        </el-input>
                    </div></el-col>
                </el-row>
                <el-row :gutter="20" class="grid-content bg-purple">
                    <el-col :span="4"><div>邮箱</div></el-col>
                    <el-col :span="20"><div>
                        <el-input id="email" v-model="email" @focus="onFocus"
                                  clearable placeholder="请输入邮箱">
                        </el-input>
                    </div></el-col>
                </el-row>
                <el-row :gutter="20" class="grid-content bg-purple">
                    <el-col :span="4"><div>验证码</div></el-col>
                    <el-col :span="10"><div>
                        <el-input id="code" v-model="code" @focus="onFocus" maxlength="8"
                                  clearable placeholder="请输入验证码">
                        </el-input>
                    </div></el-col>
                    <el-col :span="10">
                        <el-button id="send" @click="send" type="text">发送验证码</el-button>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="grid-content bg-purple">
                    <el-col :span="4"><div>密码</div></el-col>
                    <el-col :span="20"><div>
                        <el-input id="password2" show-password v-model="password2"
                                  clearable minlength="6" @focus="onFocus"
                                  placeholder="请输入新密码（6位以上）">
                        </el-input>
                    </div></el-col>
                </el-row>
                <el-row :gutter="20" class="grid-content bg-purple">
                    <el-button id="reset" @click="reset" type="primary" >重置密码</el-button>
                    <el-button id="close" @click="toggleReset" type="primary" plain>关闭窗口</el-button>
                </el-row>
            </div>
        </transition>
        <transition name="el-fade-in-linear">
            <div id="email_content" v-show="logined && !emailed">
                <h1>设置邮箱</h1>
                <el-row :gutter="20" class="grid-content bg-purple">
                    <el-col :span="4"><div>邮箱</div></el-col>
                    <el-col :span="20"><div>
                        <el-input id="email2" v-model="email" @focus="onFocus"
                                  clearable placeholder="请输入邮箱">
                        </el-input>
                    </div></el-col>
                </el-row>
                <el-row :gutter="20" class="grid-content bg-purple">
                    <el-col :span="4"><div>验证码</div></el-col>
                    <el-col :span="10"><div>
                        <el-input id="code2" v-model="code" @focus="onFocus" maxlength="8"
                                  clearable placeholder="请输入验证码">
                        </el-input>
                    </div></el-col>
                    <el-col :span="10">
                        <el-button id="send2" @click="sendEmail" type="text">发送验证码</el-button>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="grid-content bg-purple">
                    <el-button id="resetEmail" @click="setEmail" type="primary">设置邮箱</el-button>
                </el-row>
            </div>
        </transition>
    </div>
</template>
<script>

    import auth from '../utils/auth_utils';
    import web from '../utils/web_utils';

    const ResetCodeText = "验证码已经发到你的邮箱！";
    const ResetText = "密码已重置，请返回登录！";

    const SNOReg = /^20[0-9]{10}$/;
    const EmailReg = /^[a-z0-9]+([._\\\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;

    const UsernameIncorrect = "学号输入格式不正确！";
    const PasswordIncorrect = "密码长度要大于6位！";
    const EmailIncorrect = "邮箱格式不正确！";
    const EmailDifferent = "邮箱不一致，请重新发送验证码！";
    const CodeIncorrect = "验证码长度为8位！";

    // 登录信息校验
    function validateLogin() {
        var flag = true;
        var un = username.value, pw = password.value;
        if(!un.match(SNOReg)) flag = web.web.setInvalid(username, UsernameIncorrect);
        if(pw.length < 6) flag = web.web.setInvalid(password, PasswordIncorrect);
        return flag;
    }

    // 发送重置验证码信息校验
    function validateSend() {
        var flag = true;
        var un = username2.value, em = email.value;
        if(!un.match(SNOReg)) flag = web.web.setInvalid(username2, UsernameIncorrect);
        if(!em.match(EmailReg)) flag = web.web.setInvalid(email, EmailIncorrect);
        return flag;
    }

    // 重置密码信息校验
    function validateReset() {
        var flag = true;
        var un = username2.value, pw = password2.value, em = email.value, c = code.value;
        if(!un.match(SNOReg)) flag = web.web.setInvalid(username2, UsernameIncorrect);
        if(pw.length < 6) flag = web.web.setInvalid(password2, PasswordIncorrect);
        if(c.length != 8) flag = web.web.setInvalid(code, CodeIncorrect);
        if(!em.match(EmailReg)) flag = web.web.setInvalid(email, EmailIncorrect);
        return flag;
    }

    // 邮箱验证码信息校验
    function validateEmail() {
        var flag = true, em = email2.value;
        if(!em.match(EmailReg)) flag = web.web.setInvalid(email2, EmailIncorrect);
        return flag;
    }

    // 设置邮箱信息校验
    function validateSetEmail() {
        var flag = true, c = code2.value, em = email2.value;
        if(em !== auth.temp_email) flag = web.web.setInvalid(email2, EmailDifferent);
        if(c.length != 8) flag = web.web.setInvalid(code2, CodeIncorrect);
        return flag;
    }

    function onFocus(event) {
        console.info("onFocus: ", this, event);
        web.web.removeInvalid(event.target);
    }

    function onLoginSuccess(self) {
        console.info("onLoginSuccess");
        console.info(self);
        console.info(auth);
        console.info(auth.isEmailed());
        if(self.emailed = auth.isEmailed()) {
            auth.save();
            self.emailed = true;
            self.$emit('activate');
            web.web.showAlert("欢迎你："+auth.getName());
            self.$router.push({path: '/user'});
        }
    }

    async function login() {
        this.logined = this.emailed = true;
        var success = validateLogin() && await auth.login(username.value, password.value);
        console.info(success);
        if(this.logined = success) onLoginSuccess(this);
    }
    async function send() {
        var success = validateSend() && await auth.resetCode(username.value, email.value);
        if(success) web.web.showAlert(ResetCodeText);
    }
    async function reset() {
        var success = validateReset() && await auth.reset(username2.value, password2.value, code.value);
        if(success) {
            web.web.showAlert(ResetText);
            this.show_reset = false;
            username.focus();
        }
    }

    async function sendEmail() {
        var success = validateEmail() && await auth.emailCode(email2.value);
        if(success) {
            auth.temp_email = email2.value;
            web.web.showAlert(ResetCodeText);
        }
    }
    async function setEmail() {
        var success = validateSetEmail() && await auth.setEmail(code2.value);
        if(success) {
            this.emailed = true;
            auth.setEmailLocal();
            onLoginSuccess(this);
        }
    }

    function showReset(self) {
        self.show_reset = true;
        setTimeout(username2.focus.bind(username2), 300);
    }
    function hideReset(self) {
        self.show_reset = false;
        username.focus();
    }
    function toggleReset() {
        this.show_reset ? hideReset(this) : showReset(this);
    }

    export default {
        data() {
            return {
                logined: false,
                show_reset: false,
                emailed: false,

                username: '',
                password: '',
                email: '',
                code: '',
                password2: '',
            }
        }, methods: {login, send, reset,
            sendEmail, setEmail,
            toggleReset, onFocus
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #login_content{
        /*position: absolute;*/
        padding: 12px 24px;
        margin: 64px 15% 0;
        min-width: 396px;
        max-width: 680px;
        text-align: center;
        border-radius: 4px;
        background: rgba(192,192,192,0.2);
    }
    #reset_content{
        padding: 12px 24px;
        margin: 32px 15% 64px;
        min-width: 396px;
        max-width: 680px;
        text-align: center;
        border-radius: 4px;
        background: rgba(192,192,192,0.2);
    }
    #email_content{
        padding: 12px 24px;
        margin: 64px 15% 0;
        min-width: 396px;
        max-width: 680px;
        text-align: center;
        border-radius: 4px;
        background: rgba(192,192,192,0.2);
    }
    h1{
        margin: 0;
    }

    /* .bg-purple {
        background: rgba(128,128,128,0.1);
    } */
    .grid-content {
        /*height: 64px;*/
        line-height: 64px;
        border-radius: 4px;
    }
    #login, #reset{
        width: 92px;
        margin-right: 64px;
    }
</style>
