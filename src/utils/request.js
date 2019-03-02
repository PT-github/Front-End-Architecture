import axios from 'axios'
// import { Message } from 'element-ui'
import envConfig from '@/config'

// import router from '@/views/index/router'
// import store from '@/views/index/store/store'

// create an axios instance
const service = axios.create({
	// baseURL: envConfig.baseUrl, // api的base_url
	timeout: 0, // request timeout
	withCredentials: true
})
// service.interceptors.request.use(
// 	config => {
// 		if (config.mode) {
// 			config.baseURL = envConfig[config.mode]
// 		}
// 		let r = '_r=' + new Date().getTime();
// 		if (config.url.indexOf('?') > 0) {
// 			r = '&' + r;
// 		} else {
// 			r = '?' + r;
// 		}
// 		let school = localStorage.getItem('currentSchool');
// 		if (school) {
// 			let currentSchool = JSON.parse(school);
// 			config.url = config.url + r + (window['menu'] ? ('&menu=' + window['menu']) : '') + (currentSchool ? '&logSchoolId=' + currentSchool.uid : '')
// 			return config
// 		} else {
// 			config.url = config.url + r + (window['menu'] ? ('&menu=' + window['menu']) : '')
// 			return config
// 		}
// 	}, function (error) {
// 		return Promise.reject(error)
// 	}
// )
// service.interceptors.response.use(
// 	response => {
// 		const res = response.data;
// 		/**
// 		 * 通过response自定义success来标示请求状态
// 		 */
// 		if (res && res.code === '10060002') {
// 			// 未登录 跳转到首页
// 			router.push({ path: '/' })
// 			// this.$message.warning("登录超时，请您重新登录");
// 			Message({
// 				message: res.viewMsg || '登录超时，请您重新登录',
// 				type: 'error',
// 				duration: 3 * 1000
// 			})
// 			store.commit('CLEAR_USERINFO')
// 		}
// 		if (res && res.code === '00000000') {
// 			return res;
// 		} else {
// 			Message({
// 				message: res.viewMsg || '抱歉，访问出错了，请稍后再试试！',
// 				type: 'error',
// 				duration: 3 * 1000
// 			})
// 			return Promise.reject('error');
// 		}
// 	},
// 	error => {
// 		console.log('err' + error)// for debug
// 		let errorMsg = '<span style="font-weight: bold; font-size: 13px; display: inline-block; padding-bottom: 5px;">请求失败</span><br/>' +
// 			'<span>请刷新页面重新操作，如果问题依旧存在，请联系管理员</span>';
// 		Message({
// 			message: errorMsg,
// 			type: 'error',
// 			dangerouslyUseHTMLString: true,
// 			duration: 3 * 1000
// 		})
// 		return Promise.reject(error)
// 	})

export default service