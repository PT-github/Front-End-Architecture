import Vue from 'vue'
// import { sendSpot } from '@/views/index/store/api'
// 坑位埋点指令
Vue.directive('stat', {
  bind(el, binding) {
    el.addEventListener('click', () => {
      const data = binding.value;
      // sendSpot(data)
    }, false);
  }
});