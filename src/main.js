// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import web from './utils/web_utils';
import auth from './utils/auth_utils';

Vue.config.productionTip = false;
Vue.use(ElementUI);

async function initialize() {
    console.info(initialize);
    await initializeData();
    initializeVue();
}

async function onLoginSuccess() {
    await auth.update(); router.push({path: '/user'});
}

function onLoginFail() {
    auth.logout(); router.push({path: '/'});
}

async function initializeData() {
    var success = await auth.get();
    if(success) await onLoginSuccess();
    else onLoginFail();
}

function initializeVue() {
    /* eslint-disable no-new */
    web.vm = new Vue({
        el: '#app',
        router,
        components: { App },
        template: '<App/>'
    });
}

initialize();
