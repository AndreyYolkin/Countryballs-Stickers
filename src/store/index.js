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
    },
    app: {
      continents: [
        { text: 'Europe', value: 'EU' },
        { text: 'Asia', value: 'AS' },
        { text: 'America', value: 'AM' },
        { text: 'Africa & Australia', value: 'AFAU' },
        { text: 'Other', value: 'OT' },
      ],
      continent: 'EU'
    },
    selected: {
      active: false,
      objects: {}
    }
  }),
  mutations: {
    setFlag(state, data) {
      state.ball.flag = data
    },
    setContinent(state, continent) {
      state.app.continent = continent
    },
    setSelected(state, data) {
      state.selected.active = data.active
      state.selected.objects = data.objects
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
