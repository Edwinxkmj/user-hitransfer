const state = {
  isShowLoginBox: false,
};

const mutations = {
  CHANGE_SHOW_LOGIN_BOX(state, flag) {
    state.isShow = flag;
  }
};

const actions = {
  changeShowLoginBox({commit}, flag){
    commit('CHANGE_SHOW_LOGIN_BOX', flag);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
