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
      continents: ['EU', 'AS', 'AM', 'AFAU', 'OT'],
      continent: 'EU'
    },
    selected: {
      active: false,
      objects: {}
    },
    snackbar: {
      active: false,
      text: '',
      status: ''
    },
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
    setSnackbar(state, data) {
      state.snackbar = { ...data, active: true }
    },
    removeSnackbar(state) {
      state.snackbar = { text: '', active: false }
    },
  },
  actions: {
  },
  modules: {
  }
})
