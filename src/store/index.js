import Vue from 'vue'
import Vuex from 'vuex'
import globalConfig from '@/globalConfig.json'
import { getStorage } from '@/utils/storage.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: getStorage(globalConfig.token) || ''
  },
  mutations: {
    setToken (state, userToken) {
      state.token = userToken
    }
  },
  actions: {
  },
  modules: {
  }
})
