import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdiSvg',
  },
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#6455EC',
        accent: colors.grey.lighten1,
        secondary: colors.indigo.lighten1,
        add: colors.green.lighten1,
        remove: colors.red.lighten1,
        info: colors.teal.lighten1,
        warning: colors.amber.lighten1,
        error: colors.deepOrange.accent4,
        success: colors.green.accent3,
      },
    },
  },
})
