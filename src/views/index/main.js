import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
import App from '@/components/App.vue'
import '@/filter'
import '@/directive'
import '@/utils/mixin'
import router from './router'
import store from './store/store'
import storage from '@/utils/storage'
// 刷新页面重新从本地存储中获取到用户信息 当前学校
let userInfo = storage.getItem('userInfo') || '', currentSchool = storage.getItem('currentSchool') || '';
if (userInfo) { // 派发存储用户信息到store的action
  store.dispatch('SetUserInfo', userInfo) 
}
if (currentSchool) { // 派发存储用户信息到store的action
  store.dispatch('SetCurrentSchool', currentSchool) 
}
// store.dispatch('updateUserMsgCountStatus') // 刷新页面就更新store中的未读消息数
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
