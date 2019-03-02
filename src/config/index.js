import Vue from 'vue'
const config = require(`./${process.env.ENV_CONFIG}.js`).default
Vue.prototype.$config = config
export default config