import * as types from '@/store/mutation_types'
export default {
  [types.SET_ACTIVE_PATH] (state, payload) {
    state.activePath = payload
  },

  [types.LANG] (state, payload) {
    state.lang = payload;
  },

  [types.CURRENCY] (state, payload) {
    state.currency = payload;
  },

  // 设置用户信息（登录）
  [types.SET_USER_INFO] (state, payload) {
    state.userInfo = Object.assign({}, payload)
    state.isLogin = true
  },

  // 改变登录状态
  [types.CHANGE_LOGIN_SATUS] (state, status) {
    state.isLogin = status
    if (!status) {
      state.userInfo = null
    }
  },

  // 隐藏登陆/注册模态框
  [types.HIDEN_R_L] (state, status) {
    state.hideLoginOrRegister = false;
  },

  // 设置记住密码
  [types.SET_CACHE_ACCOUNT] (state, account) {
    state.cacheAccount = Object.assign({}, account)
  },

  // 清除记住密码
  [types.CLEAR_CACHE_ACCOUNT] (state) {
    state.cacheAccount = null
  },

  // 城市列表的请求状态
  [types.CITY_LOAD_STATUS] (state, payload) {
    state.cityLoading = payload
  },
  
  // 设置城市列表
  [types.SET_CITY_LIST] (state, payload) {
    state.sourceCities = [...payload]
  },

  // 设置机场列表
  [types.SET_AIR_PORT] (state, payload) {
    state.airports = [...payload]
  }
}