import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: () =>
            import ('@/pages/Home'),
    },
    {
        path: '/404',
        name: "404",
        component: () =>
            import ('@/pages/statusPages/404'),
    },
    {
        path: '/403',
        name: "403",
        component: () =>
            import ('@/pages/statusPages/403'),
    },
    {
        path: '/Login',
        name: "Login",
        component: () =>
            import ('@/pages/Login'),
    },
    {
        path: '/Server',
        name: "Server",
        component: () =>
            import ('@/pages/Server'),
    },
    {
        path: '/Server/:id',
        name: "ServerInfo",
        component: () =>
            import ('@/pages/ServerInfo'),
    },
    {
        path: '/Certificate',
        name: 'Certificate',
        component: () =>
            import ('@/pages/Certificate'),
        meta: {
            isLogin: true
        }
    },
    {
        path: '/Certificate/:id',
        name: 'CertificateInfo',
        component: () =>
            import ('@/pages/CertificateInfo'),
    },
    {
        path: '/Console',
        name: 'Console',
        component: () =>
            import ('@/pages/Console'),
    },
    {
        path: '/Settings',
        name: 'Settings',
        component: () =>
            import ('@/pages/Settings'),
    },
    {
        path: '/Configuration',
        name: 'Configuration',
        component: () =>
            import ('@/pages/Configuration')
    },
    {
        path: '/Configuration/:id',
        name: 'ConfigurationInfo',
        component: () =>
            import ('@/pages/ConfigurationInfo'),
    },
    {
        path: '/Terminal/:uuid',
        name: 'Terminal',
        component: () =>
            import ('@/components/terminal'),
    },
    {
        path: '*',
        name: "404 Page",
        component: () =>
            import ('@/pages/statusPages/404'),
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router