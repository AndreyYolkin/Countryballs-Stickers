import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: () => ({
    ball: {
      flag: 'EU_0',
      back: 0,
      customBack: false,
      eye: 0,
      accessories: [],
    }
  }),
  mutations: {
    setFlag(state, data) {
      state.ball.flag = data
    },
    setBack(state, data) {
      state.ball.flag = data
    },
    setEye(state, data) {
      state.ball.flag = data
    },
  },
  actions: {
  },
  modules: {
  }
})
