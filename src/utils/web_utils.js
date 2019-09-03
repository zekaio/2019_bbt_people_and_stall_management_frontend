import Vue from 'vue';
import auth from "./auth_utils";

var vm = undefined;

var web = {
    showLoading: () => Vue.prototype.$loading().visible = true,
    hideLoading: () => Vue.prototype.$loading().visible = false,
    showAlert: (msg) => Vue.prototype.$alert(msg).visible = true,
    hideAlert: () => Vue.prototype.$alert().visible = false,

    showConfirm: (msg, confirm, cancel) =>
        Vue.prototype.$confirm(msg).then(confirm).catch(cancel),

    // invalid: 定义在 index.html
    setInvalid: (ele, text, data, key) => {
        if(ele.classList.contains('invalid')) return;
        ele.classList.add('invalid');
        ele.old_ph = ele.placeholder;
        ele.placeholder = text;
        data ? data[key] = '' : ele.value = '';
    },
    removeInvalid: (ele) => {
        if(!ele.classList.contains('invalid')) return;
        ele.classList.remove('invalid');
        ele.placeholder = ele.old_ph;
        ele.value = '';
    },
    checkLogin: (self) => {
        if(auth.token) return true;
        web.showAlert("未登录！");
        self.$router.push({path: '/'});
        return false;
    }
};

export default {
    web, vm
}
