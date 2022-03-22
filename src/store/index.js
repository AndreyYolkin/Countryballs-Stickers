import { createStore } from 'vuex'

export const store = createStore({
  state() {
    return {
      ball: {
        flag: 'EU_0',
        back: 0,
        customBack: false,
        eye: 0,
        accessories: [],
      },
      app: {
        continents: ['EU', 'AS', 'AM', 'AF', 'AU', 'OT'],
        continent: 'EU',
        backgrounds: ['transparent', 'color', 'BO', 'GE', 'ME'],
        background: 'transparent'
      },
      selected: {
        active: false,
        objects: {},
        texts: []
      },
      snackbar: {
        active: false,
        text: '',
        status: ''
      },
    }
  },
  mutations: {
    setFlag(state, data) {
      state.ball.flag = data
    },
    setContinent(state, continent) {
      state.app.continent = continent
    },
    setBackground(state, background) {
      state.app.background = background
    },
    setSelected(state, data) {
      state.selected.active = data.active
      state.selected.objects = data.objects
      state.selected.texts = data.texts
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
