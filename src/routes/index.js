import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Home from 'Components/pages/Home'

const routes = [
        { name: 'home', path: '/', component: Home, meta: { title: 'Home Page' }},
        { name: '*', path: '*', redirect: '/' },
]

const router = new VueRouter({
    routes: routes 
})

router.beforeEach((to, from, next) => {
    if(to.meta && to.meta.title) {
        window.document.title = to.meta.title
    }
    next()
})

export default router