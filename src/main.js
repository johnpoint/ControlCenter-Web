import Vue from 'vue';
import VueResource from 'vue-resource';
import Vuex from 'vuex'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/main.css';
import router from "./router";
import App from './App';

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueResource);
Vue.use(Vuex);

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

/*new Vue({
    el: '#app',
    data: {
        currentRoute: window.location.pathname
    },
    computed: {
        ViewComponent () {
            return routes[this.currentRoute] || NotFound
        }
    },
    render (h) { return h(this.ViewComponent) }
})*/