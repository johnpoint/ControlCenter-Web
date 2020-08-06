import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "../pages/Home.vue";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/404',
        name: "404",
        component: () => import('@/pages/statusPages/404'),
    },
    {
        path: '/Login',
        name: "Login",
        component: () => import('@/pages/Login'),
    },
    {
        path: '/Server',
        name: "Server",
        component: () => import('@/pages/Server'),
    },
    {
        path: '/Server/:id',
        name: "ServerInfo",
        component: () => import('@/pages/ServerInfo'),
    },
    {
        path: '/Certificate',
        name: 'Certificate',
        component: () => import('@/pages/Certificate'),
        meta: {
            isLogin: true
        }
    },
    {
        path: '/Certificate/:id',
        name: 'CertificateInfo',
        component: () => import('@/pages/CertificateInfo'),
    },
    {
        path: '/Console',
        name: 'Console',
        component: () => import('@/pages/Console'),
    },
    {
        path: '/Settings',
        name: 'Settings',
        component: () => import('@/pages/Settings'),
    },
    {
        path: '*',
        name: "404 Page",
        component: () => import('@/pages/statusPages/404'),
    }
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router