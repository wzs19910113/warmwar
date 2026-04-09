import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import Start from '@/pages/Start'
import Influ from '@/pages/Influ'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/home',
            name: 'Home',
            component: Home
        },
        {
            path: '/',
            name: 'Start',
            component: Start
        },
        {
            path: '/influ',
            name: 'Influ',
            component: Influ
        }
    ]
})
