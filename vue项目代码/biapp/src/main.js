// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './app'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios'
import Vuex from 'vuex'
import store from './vuex/store'
import 'element-ui/lib/theme-default/index.css'
import echarts from 'echarts'

/*Vue.config.productionTip = false;*/
// Vue.prototype.ctx = window.location.origin;
/*Vue.prototype.ctx = 'http://123.57.173.13:8080';*/
// Vue.prototype.ctx = 'http://localhost:8080';
Vue.prototype.router = router;

/* eslint-disable no-new */

Vue.use(ElementUI);
new Vue({
  el: '#app',
  router,
	store,
  template: '<App/>',
  components: {App}
});

Vue.prototype.$echarts = echarts;
Vue.prototype.axios = axios;
/*axios.defaults.timeout = 5000;  // 添加超时
axios.defaults.withCredentials = true;*/

// 添加一个请求拦截器
/*axios.interceptors.request.use(config => {
  // Do something before request is sent
  console.warn("axios request ok : " + config);
  return config;
}, error => {
  // Do something with request error
  window.location.href = window.location.origin + '/#/login';
  console.warn("axios request error .");
  return Promise.reject(error);
});

// 添加一个响应拦截器
axios.interceptors.response.use(response => {
  // Do something with response data
  console.warn("axios response ok : " + response);
  if (response && response.status != 200) {
    router.push('/login');
  }
  return response;
}, error => {
  // Do something with response error
  window.location.href = window.location.origin + '/#/login';
  console.warn("axios response error .");
  return Promise.reject(error);
});*/
