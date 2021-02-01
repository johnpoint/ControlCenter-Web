import Vue from 'vue';
import VueResource from 'vue-resource';
import Vuex from 'vuex'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/main.css';
import router from "./router";
import App from './App';
import config from "@/config";
import VueNativeSock from "vue-native-websocket";

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueResource);
Vue.use(Vuex);
let uri = 'ws://';
if (window.location.protocol === 'https:') {
    uri = 'wss://';
}
let addr;
addr = config.apiAddress.replace("http://", "").replace("https://", "")
console.log(this)
Vue.use(VueNativeSock, uri + addr + "/api/v2");

console.log("Powered by ControlCenter-web v1.0.2\nhttps://github.com/johnpoint/ControlCenter-web")
const store = new Vuex.Store({
    state: {
        jwt: '',
        isLogin: false,
        userInfo: null,
    },
    mutations: {
        setjwt(state, jwt) {
            state.jwt = jwt
        },
        setStatus(state, bool) {
            state.isLogin = bool
        },
        setUserInfo(state, data) {
            state.userInfo = data
        },
        setTimer(state, timer) {
            state.timer = timer
        },
        setServer(state, data) {
            state.viewServer = data
        }
    }
})

new Vue({
    router,
    store: store,
    render: h => h(App)
}).$mount('#app')