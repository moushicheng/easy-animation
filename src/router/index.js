import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: (resolve) => require(['@/views/index'], resolve)
  },
  {
    path: '/main',
    name: 'mainPage',
    component: (resolve) => require(['@/views/MainPage/index'], resolve)
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
