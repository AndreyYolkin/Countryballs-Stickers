import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
// eslint-disable-next-line no-unused-vars
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        ...colors,
        primary: '#3c096c',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#E53935',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
      },
    },
  },
})
