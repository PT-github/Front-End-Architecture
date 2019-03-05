import titleComponent from './title.vue'
import menuComponent from './menu'
import Calendar from './calendar'
import replaceComponent from './replaceCourseDialog.vue'
import adjustComponent from './adjustCourseDialog.vue'
const cusComponent = {
  install: function(Vue) {
    Vue.component('s-title', titleComponent)
    Vue.component('s-menu', menuComponent)
    Vue.component('Calendar', Calendar)
    Vue.component('replace-dialog', replaceComponent)
    Vue.component('adjust-dialog', adjustComponent)
  }
}
export default cusComponent