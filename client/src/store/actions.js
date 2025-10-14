import * as api from '@/store/api'
import * as types from '@/store/mutation_types'
import axios from '@/axios'

export default {
  // 获取城市列表
  getCityList ({ commit }) {
    commit(types.CITY_LOAD_STATUS, true)
    axios.get(api.API_GET_CITY_LIST).then(res => {
      commit(types.SET_CITY_LIST, res.data.data)
      commit(types.CITY_LOAD_STATUS, false)
    }, () => {
      commit(types.CITY_LOAD_STATUS, false)
    })
  },

  // 获取机场列表
  getAirport ({ commit }) {
    commit(types.CITY_LOAD_STATUS, true);
    axios.get(api.API_GET_AIR_PORT).then(res => {
      commit(types.SET_AIR_PORT, res.data.data);
      commit(types.CITY_LOAD_STATUS, false)
    }, () => {
      commit(types.CITY_LOAD_STATUS, false)
    })
  },
}
