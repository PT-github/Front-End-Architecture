import Vue from 'vue';
import '@/assets/css/element-user.scss';
import VueCropper from 'vue-cropper'
Vue.use(VueCropper)
import { TimeSelect, Loading, MessageBox, Message, Collapse, CollapseItem, Button, Select, Option, Input, Table, TableColumn, 
  Form, FormItem, Pagination, Dialog, DatePicker, Radio, RadioGroup, RadioButton, Upload, Switch,
  Checkbox, CheckboxButton, CheckboxGroup, InputNumber, Tree, Tooltip, Alert, Col, Row, Popover, Carousel, CarouselItem, Autocomplete, Cascader,Breadcrumb,
  BreadcrumbItem, OptionGroup} from 'element-ui';
Vue.use(TimeSelect)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Select)
Vue.use(Option)
Vue.use(Input)
Vue.use(DatePicker)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Upload)
Vue.use(Switch)
Vue.use(Checkbox)
Vue.use(CheckboxButton)
Vue.use(CheckboxGroup)
Vue.use(InputNumber)
Vue.use(Tree)
Vue.use(Tooltip)
Vue.use(Loading.directive)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Popover)
Vue.use(Row)
Vue.use(Col)
Vue.use(Alert)
Vue.use(Autocomplete)
Vue.use(Cascader)
Vue.use(BreadcrumbItem),
Vue.use(Breadcrumb)
Vue.use(OptionGroup)
Vue.prototype.$loading = Loading.service;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;
import cusComponent from '@/components'
Vue.use(cusComponent)
import App from '@/components/App.vue'
import '@/filter'
import '@/directive'
import '@/utils/mixin'
import router from './views/index/router'
import store from './views/index/store/store'
import storage from '@/utils/storage'
// 自定义滚动条
import vuescroll from 'vuescroll/dist/vuescroll-native';
import 'vuescroll/dist/vuescroll.css';
Vue.use(vuescroll, {
  ops: {
    // 滚动条滚动的地方
    rail: {
      size: '6px',
      opacity: 0
    },
    // 滚动条
    bar: {
      background: '#CCC',
      onlyShowBarOnScroll: false
      // keepShow: true
    }
  }
});
// 刷新页面重新从本地存储中获取到用户信息 当前学校
let userInfo = storage.getItem('userInfo') || '', currentSchool = storage.getItem('currentSchool') || '';
if (userInfo) { // 派发存储用户信息到store的action
  store.dispatch('SetUserInfo', userInfo) 
}
if (currentSchool) { // 派发存储用户信息到store的action
  store.dispatch('SetCurrentSchool', currentSchool)
}
store.dispatch('updateUserMsgCountStatus') // 刷新页面就更新store中的未读消息数
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
