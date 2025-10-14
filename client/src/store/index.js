import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate' // 引入vuex-persistedstate，将vuex的数据持久化到本地

import modules from './modules';
import getters from './getters';
import state from '@/store/state'
import mutations from '@/store/mutations'
import actions from '@/store/actions'

Vue.use(Vuex);

// const state={
//   activePath: "",
// };
// const mutations={
//   setActivePath(state,data){
//     state.activePath = data;
//   }
// };
// const actions={
//   commitUserList:({commit},userList)=>commit('setUserList',userList)
// };

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules,
  getters,
  plugins: [
    createPersistedState({
      reducer (state) {
        return {
          userInfo: state.userInfo,
          cacheAccount: state.cacheAccount
        }
      }
    })
  ]
})
