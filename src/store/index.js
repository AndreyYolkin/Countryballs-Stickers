import { defineStore } from 'pinia'

export const useStore = defineStore('app', {
  state: () => {
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
  actions: {
    setFlag(data) {
      this.ball.flag = data
    },
    setContinent(continent) {
      this.app.continent = continent
    },
    setBackground(background) {
      this.app.background = background
    },
    setSelected(data) {
      this.selected.active = data.active
      this.selected.objects = data.objects
      this.selected.texts = data.texts
    },
    setBack(data) {
      this.ball.flag = data
    },
    setEye(data) {
      this.ball.flag = data
    },
    setSnackbar(data) {
      this.snackbar = { ...data, active: true }
    },
    removeSnackbar() {
      this.snackbar = { text: '', active: false }
    },
  },
})
