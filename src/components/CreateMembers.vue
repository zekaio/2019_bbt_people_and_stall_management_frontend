<template>
    <div>
        <el-collapse id="create_content" accordion v-model="activeNames">
            <el-collapse-item class="item" title="添加单个" name="1">
                <el-row :gutter="20" class="grid-content bg-purple">
                    <el-col :span="6"><div>学号</div></el-col>
                    <el-col :span="18"><div>
                        <el-input id="sno" v-model="sno"
                                  clearable maxlength="12" minlength="12"
                                  @focus="onFocus" placeholder="请输入学号">
                        </el-input>
                    </div></el-col>
                </el-row>
            </el-collapse-item>
            <el-collapse-item class="item" title="添加多个" name="2">
                <el-row :gutter="20" class="grid-content bg-purple">
                    <el-col :span="6"><div>多个学号</div></el-col>
                    <el-col :span="18"><div>
                        <el-input id="sno_mult" v-model="sno_mult" type="textarea"
                                  :rows="8" clearable autosize @focus="onFocus"
                                  placeholder="多个学号，一行一个（按回车可换行）">
                        </el-input>
                    </div></el-col>
                </el-row>
            </el-collapse-item>
            <h4>添加的成员类别：</h4>
            <el-row :gutter="20" class="out-grid-content grid-content" v-for="item in create_items">
                <el-col :span="8"><div>{{item.field}}</div></el-col>
                <el-col :span="16"><div>
                    <el-select v-bind:id="item.key+'_input'" v-model="create_pos[item.key]"
                               placeholder="请选择">
                        <el-option
                            v-for="opt in item.options"
                            :key="opt" :label="opt" :value="opt">
                        </el-option>
                    </el-select>
                </div></el-col>
            </el-row>
            <el-row :gutter="20" id="button_content">
                <el-button id="create" @click="create" type="primary">执行</el-button>
            </el-row>
        </el-collapse>
    </div>
</template>

<script>
    import web from '../utils/web_utils';
    import auth from '../utils/auth_utils';
    import data from '../utils/data_utils';

    const SNOReg = /^20[0-9]{10}$/;

    const SNOIncorrect = "学号输入格式不正确！";
    const SNOEmpty = "学号未填写！";

    function onFocus(event) {
        console.info("onFocus: ", this, event);
        web.web.removeInvalid(event.target);
    }

    function mode() {
        if(this.activeNames.includes('1')) return 'single';
        if(this.activeNames.includes('2')) return 'mult';
        return 'none';
    }

    function makeSNOArray() {
        switch(mode.call(this)){
            case 'single': return [this.sno];
            case 'mult': return this.sno_mult.split('\n')
                .filter(sno => sno && sno.trim());
            default: return undefined;
        }
    }

    function validateSNO(snos) {
        switch(mode.call(this)){
            case 'single': return validateSingleSNO.call(this, snos);
            case 'mult': return validateMultSNO.call(this, snos);
            default: return processNoSNO.call(this);
        }
    }

    function validateSingleSNO(snos) {
        var flag = true;
        if(snos.length <= 0 || snos[0].length <= 0)
            flag = web.web.setInvalid(sno, SNOEmpty);
        else if(!snos[0].match(SNOReg))
            flag = web.web.setInvalid(sno, SNOIncorrect);
        return flag;
    }

    function validateMultSNO(snos) {
        var flag = true;
        if(snos.length <= 0)
            flag = web.web.setInvalid(sno_mult, SNOEmpty);
        else for(var i in snos)
            if(!snos[i].match(SNOReg)) {
                flag = web.web.setInvalid(sno_mult, SNOIncorrect);
                break;
            }
        return flag;
    }

    function processNoSNO() {
        this.activeNames = ['1'];
        web.web.setInvalid(sno, SNOEmpty);
        return false;
    }

    function clear(){
        this.sno = this.sno_mult = '';
    }

    async function create() {
        let snos = makeSNOArray.call(this);
        let dept = this.create_pos.dept_name;
        let group = this.create_pos.group_name;
        console.info("snos: ", snos);
        let res = validateSNO.call(this, snos) &&
            await auth.create(snos, dept, group);
        if(res) {
            web.web.showAlert("添加成员成功！");
            clear.call(this);
        }
    }

    export default {
        name: "CreateMembers",
        data() {
            web.web.checkLogin(this);
            let groups = data.getGroupsSelections();
            return {
                activeNames: ['1'],
                create_pos: {
                    dept_name: auth.getDept(),
                    group_name: groups[groups.length-1],
                },
                create_items: [
                    {field: "部门", key: 'dept_name', must: true,
                        options: data.getDeptsSelections()},
                    {field: "管理层", key: 'group_name', must: true,
                        options: groups},
                ],
                sno: '',
                sno_mult: '',
            }
        },
        methods: {
            create, onFocus
        }
    }
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
        background: rgba(192,192,192,0.2);
    }

    h4 {
        text-align: left;
        padding-left: 12px;
        margin-top: 12px;
        margin-bottom: 8px;
    }

    .grid-content {
        padding: 4px;
        height: 36px;
        line-height: 36px;
        border-radius: 4px;
        font-size: 15px;
        text-align: left;
    }
    .out-grid-content {
        margin-bottom: 12px;
        padding-left: 24px;
    }
    #button_content{
        margin-top: 24px;
        text-align: center;
    }
    #create{
        width: 128px;
    }
</style>
