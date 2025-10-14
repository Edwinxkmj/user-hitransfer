import Axios from 'axios'
import { Loading, Notification } from 'element-ui'
import Cookies from 'js-cookie'
import Qs from 'qs';
import router from '@/router'

let loading;
let needLoadingCount = 0;

const axios = Axios.create({
  // config里面有这个transformRquest， 这个选项会在发送参数前进行处理。 这时候我们通过Qs.stringify转换为表单查询参数
  transformRequest: [function (data) {
    data = Qs.stringify(data)
    return data
  }],
  headers: {
    'Authorization': Cookies.get('access_token') || '',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  timeout: 20000,
  baseURL: process.env.API_HOST, // api 的 base_url
});

// 添加请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = Cookies.get('access_token')!=null && Cookies.get('access_token') != "" ? Cookies.get('access_token') : "";
  if (config.showLoading) {
    showLoadingRequest()
  }
  return config
}, error => {
  hideLoadingRequest();
  return Promise.reject(error)
});

// 添加响应拦截器
axios.interceptors.response.use(response => {
  if (response.data.status == 401) {
    Notification.error(sessionStorage.getItem('lang') == 'en' ?'Please log in~':'请登陆~');
    router.push({ 'path': '/index/user', 'query': {type: 'login'}})

    if (Cookies.get('access_token')) {
      Cookies.remove('access_token');
      location.reload();
    }
    return;
  }
  if (axios.defaults.headers.Authorization && Cookies.get('access_token')) {
      Cookies.set('access_token', Cookies.get('access_token'));
  }

  hideLoadingRequest()

  if (response.status && response.data.status == 1) {
    return response;
  } else {
    Notification.error(response.data.message)
    return Promise.reject(response.data)
  }
}, error => {
  if (error.message.includes('timeout')) {
    Notification.error('网络超时')
  } else if (error.response.status === 404 || error.response.status === 504) {
    Notification.error('服务器找不到啦~⊙﹏⊙')
  } else if (error.response.status === 403) {
    Notification.error('权限不足，请联系管理员')
  } else {
    Notification.error(error.message)
  }
  hideLoadingRequest()
  // 响应错误
  return Promise.reject(error)
})

// 由于目前版本的axios已经不支持jsonp,在使用百度地图api时又需要以jsonp的方式进行跨域，所以自己封装了一个jsonp方法
axios.jsonp = (url) => {
  if(!url){
    console.error('Axios.JSONP 至少需要一个url参数!')
    return;
  }
  return new Promise((resolve,reject) => {
    window.jsonCallBack =(result) => {
      if (result.status === 0) {
        resolve(result.result)
      } else {
        reject(result)
      }
    }
    var JSONP=document.createElement("script");
    JSONP.type="text/javascript";
    JSONP.src=`${url}&callback=jsonCallBack`;
    document.getElementsByTagName("head")[0].appendChild(JSONP);
    setTimeout(() => {
      document.getElementsByTagName("head")[0].removeChild(JSONP)
    },500)
  })
}

function showLoadingRequest () {
  if (needLoadingCount === 0) { // 只有当数量为0时才开启loading，避免多个请求打开多个loading
    startLoading()
  }
  needLoadingCount++
}

function hideLoadingRequest () {
  if (needLoadingCount <= 0) return
  needLoadingCount--
  if (needLoadingCount === 0) {
    endLoading()
  }
}

function startLoading () {
  loading = Loading.service({
    lock: true,
    text: '加载中，请稍后...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

function endLoading () {
  loading && loading.close()
}

export default {
  post: (url, data, config = { showLoading: false, showError: true }) => axios.post(url, data, config),
  get: (url, config = { showLoading: false, showError: true }) => axios.get(url, config),
  jsonp: (url) => axios.jsonp(url)
}
