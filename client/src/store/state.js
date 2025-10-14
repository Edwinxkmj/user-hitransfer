// 全局state

export default {
  activePath: '',
  isLogin: false, // 是否登录
  hideLoginOrRegister: true, //是否显示登陆/注册模态框
  userInfo: null, // 用户信息
  cityLoading: false, // 城市列表加载状态
  sourceCities: [], // 城市列表
  airports: [], // 机场列表
  cacheAccount: null, // 缓存的账号，密码
  lang: sessionStorage.getItem('lang') || 'en',
  currency: sessionStorage.getItem('currency') || 'USD',
}