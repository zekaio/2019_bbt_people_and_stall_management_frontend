<template>
    <div id="app">
        <title>百步梯人员管理系统：{{name()}}</title>
        <div id="left_menu">
            <el-row class="tac">
                <el-col>
                    <h3>百步梯人员管理系统</h3>
                    <el-collapse-transition>
                        <div v-show="auth.active">
                            <el-menu router
                                     :select="select"
                                     :default-active="this.$route.path"
                                     class="el-menu-vertical-demo"
                                     background-color="#545c64"
                                     text-color="#fff"
                                     unique-opened
                                     active-text-color="#ffd04b">
                                <el-submenu index="1">
                                    <template slot="title">
                                        <i class="el-icon-info"></i>
                                        <span>个人信息</span>
                                    </template>
                                    <el-menu-item index="/user">查看个人信息</el-menu-item>
                                    <el-menu-item index="/edit">修改个人信息</el-menu-item>
                                    <el-menu-item index="/reset">修改密码</el-menu-item>
                                </el-submenu>
                                <el-submenu index="2">
                                    <template slot="title">
                                        <i class="el-icon-menu"></i>
                                        <span>人员管理</span>
                                    </template>
                                    <el-menu-item index="/members">人员概览</el-menu-item>
                                    <el-menu-item index="/library">梯友库</el-menu-item>
                                    <el-menu-item index="/search">查找人员</el-menu-item>
                                    <el-menu-item index="/create">添加人员</el-menu-item>
                                    <el-menu-item index="/recycle">回收站</el-menu-item>
                                </el-submenu>
                                <el-submenu index="3">
                                    <template slot="title">
                                        <i class="el-icon-date"></i>
                                        <span>课表管理</span>
                                    </template>
                                    <el-menu-item index="3-1">查看课表</el-menu-item>
                                    <el-menu-item index="3-2">填写课表</el-menu-item>
                                    <el-menu-item index="3-3">审批课表</el-menu-item>
                                </el-submenu>
                                <el-submenu index="4">
                                    <template slot="title">
                                        <i class="el-icon-location"></i>
                                        <span>摆摊管理</span>
                                    </template>
                                    <el-menu-item index="/stalls">查看项目</el-menu-item>
                                    <el-menu-item index="/create_stall">增加项目</el-menu-item>
                                </el-submenu>
                                <el-menu-item @click="logout" index="/logout">
                                    <i class="el-icon-circle-close"></i>
                                    <span slot="title">退出登录</span>
                                </el-menu-item>
                            </el-menu>
                        </div>
                    </el-collapse-transition>
                </el-col>
            </el-row>
        </div>
        <div id="right_content">
            <router-view id="content"/>
            <div id="buttom">
                百步梯大学城校区技术部
            </div>
        </div>
    </div>
</template>

<script>
    import auth from './utils/auth_utils';
    import web from './utils/web_utils';

    function select(index, index_path) {
        console.info("select: ",index, index_path);
    }

    function onLogout() {
        auth.logout(); this.$router.push({path: '/'});
    }

    function logout() {
        web.web.showConfirm("确定登出？", onLogout.bind(this))
    }

    export default {
        name: "app",
        data() {
            return {
                auth,
                active: false
            }
        },
        methods: {
            name: auth.getNameForTitle,
            select, logout
        }
    }
</script>

<style>
    html{
        position: absolute;
        top: 0; bottom: 0;
        left: 0; right: 0;
        margin: 0;
    }
    body{
        position: absolute;
        top: 0; bottom: 0;
        left: 0; right: 0;
        margin: 0;
    }
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        /*-webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;*/
        position: absolute;
        top: 0; bottom: 0;
        left: 0; right: 0;
        text-align: center;
        color: #2c3e50;
        /*margin-top: 60px;*/
    }
    #left_menu{
        position: fixed;
        left: 0; top: 0; bottom: 64px;
        width: 30%; max-width: 324px;
        border-right: rgba(0,0,0,0.1) solid 1px;
        background-color: rgba(0,64,0,0.1);
    }
    #right_content{
        position: fixed;
        left: 30%; right: 0;
        top: 0; bottom: 0;
    }
    #content{
        position: absolute;
        left: 0; right: 0;
        top: 0; bottom: 64px;
        overflow-y: scroll;
    }
    #buttom {
        position: fixed;
        left: 0; right: 0; bottom: 0;
        height: 64px; line-height: 64px;
        border-top: rgb(229,229,229) solid 1px;
        color: rgb(64,64,64);
        background-color: rgba(244,244,244,1);
    }
    #vue-loading {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0
    }

</style>
