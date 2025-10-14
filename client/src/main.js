// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import i18n from './i18n/i18n'
import 'babel-polyfill';

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import VueLazyload from 'vue-lazyload';
Vue.use(VueLazyload, {
  error:require('./assets/images/loading-fail.png'),
  loading:require('./assets/images/loading_gif.gif')
})

import axios from "@/axios/index";
Vue.prototype.$axios = axios;

import Cookies from 'js-cookie'
Vue.prototype.$cookie = Cookies;

// 引入时间库
import miment from 'miment'
Vue.prototype.$miment = miment;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n, 
  components: { App },
  template: '<App/>'
})
