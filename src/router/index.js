import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "../pages/Home.vue";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            isLogin: true
        }
    },
    {
        path: '/404',
        name: "404",
        component: () => import('@/pages/404'),
        meta: {
            isLogin: true
        }
    },
    {
        path: '/Login',
        name: "Login",
        component: () => import('@/pages/Login'),
        meta: {
            isLogin: false
        }
    },
    {
        path: '/Server',
        name: "Server",
        component: () => import('@/pages/Server'),
        meta: {
            isLogin: false
        }
    },
    {
        path: '/Server/:id',
        name: "ServerInfo",
        component: () => import('@/pages/ServerInfo'),
        meta: {
            isLogin: true
        }
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
        meta: {
            isLogin: true
        }
    },
    {
        path: '*',
        name: "404 Page",
        component: () => import('@/pages/404'),
        meta: {
            isLogin: true
        }
    }
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router