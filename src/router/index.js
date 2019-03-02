import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base:  process.env.PUB_PROJECTNAME ? '/' + process.env.PUB_PROJECTNAME + '/' : '/',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import(/* webpackChunkName: "Home" */ '@/views/home/index.vue'),
      meta: {
        menu: '102'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import(/* webpackChunkName: "Login" */ '@/views/user/index.vue')
    },
  ]
})

export default router