<template>
    <div>
        <el-collapse id="main_content" v-model="activeNames" @change="handleChange">
            <el-collapse-item class="item" title="基本信息" name="1">
                <div id="base_info">
                    <div id="icon_container" class="crop_img" :style="{'backgroundImage':'url('+avatar+')'}"></div>
                    <div id="name">{{name}}<br><span id="job">{{dept}}</span></div>
                </div>
            </el-collapse-item>
            <el-collapse-item class="item" title="详细信息" name="2">
                <el-row :gutter="20" class="grid-content" v-for="item in detail">
                    <el-col :span="8"><div><b>{{item.field}}</b></div></el-col>
                    <el-col :span="16"><div>{{item.value}}</div></el-col>
                </el-row>
            </el-collapse-item>
            <el-collapse-item class="item" title="部门信息" name="3">
                <el-row :gutter="20" class="grid-content" v-for="item in department">
                    <el-col :span="8"><div><b>{{item.field}}</b></div></el-col>
                    <el-col :span="16"><div>{{item.value}}</div></el-col>
                </el-row>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
    import auth from '../utils/auth_utils';
    import web from '../utils/web_utils';

    export default {
        data() {
            web.web.checkLogin(this);
            return {
                activeNames: ['1','2'],
                avatar: auth.getAvatar(),
                name: auth.getName(),
                dept: auth.getDepJob(),
                detail: [
                    {field: "性别", value: auth.getSex()},
                    {field: "宿舍", value: auth.getDorm()},
                    {field: "手机号", value: auth.getMobile()},
                    {field: "短号", value: auth.getShortMobile()},
                    {field: "学院", value: auth.getCollege()},
                    {field: "专业", value: auth.getMajor()},
                    {field: "班级", value: auth.getClass()},
                    {field: "生日", value: auth.getBirth()},
                    {field: "户籍", value: auth.getOrigin()},
                    {field: "政治面貌", value: auth.getPolitics()},
                    {field: "QQ", value: auth.getQQ()},
                    {field: "微博", value: auth.getWeibo()},
                    {field: "创建日期", value: auth.getCreateTime()},
                    {field: "修改日期", value: auth.getUpdateTime()},
                ],
                department: [
                    {field: "部门", value: auth.getDept()},
                    {field: "职位", value: auth.getJob()},
                    {field: "部门介绍", value: auth.getDepIntro()},
                ],
            };
        },
        methods: {
            handleChange(val) {
                console.log(val);
            }
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #main_content{
        /*position: absolute;*/
        padding: 12px 24px;
        margin: 32px 15% 32px;
        min-width: 444px;
        max-width: 680px;
        text-align: center;
        border-radius: 4px;
        background: rgba(192,192,192,0.2);
    }

    br{
        height: 32px;
    }

    .item {
        font-size: 32px;
        text-align: left;
        background-color: transparent;
    }

    #base_info {
        padding: 12px 5% 4px;
        height: 128px;
        border-radius: 4px;
    }
        #icon_container{
            display: inline-block;
            width: 128px; height: 128px;
            margin-left: 10%;
            line-height: 128px;
            border-style: solid;
            border-color: rgb(84,92,100);
            border-width: 2px;
        }
        /*
        #icon{
            width: 100%;
            height: 100%;
        }*/
        #name{
            display: inline-block;
            margin-top: -16px;
            margin-left: 16px;
            line-height: 36px;
            font-size: 36px;
            font-weight: bold;
            position: relative;
            max-width: 45%;
            overflow-x: hidden;
            overflow-y: hidden;
            top: -6px;
        }
        #job{
            font-size: 16px;
            line-height: 8px;
            font-weight: normal;
        }

    .grid-content {
        padding: 4px;
        height: 36px;
        line-height: 36px;
        border-radius: 4px;
        font-size: 15px;
    }

    .crop_img{
        background-position: center;
        background-size: cover;
    }
</style>
