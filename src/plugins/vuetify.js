import colors from 'vuetify/lib/util/colors'
import { aliases, mdi } from 'vuetify/lib/iconsets/mdi-svg'
import { createVuetify } from 'vuetify'

export const vuetify = createVuetify(
  {
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    theme: {
      options: {
        customProperties: true,
      },
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#6455EC',
            accent: colors.grey.lighten1,
            secondary: colors.indigo.lighten1,
            add: colors.green.lighten1,
            remove: colors.red.lighten1,
            info: colors.teal.lighten1,
            warning: colors.amber.lighten1,
            error: colors.deepOrange.accent4,
            success: colors.green.accent3,
          }
        },
      },
    },
  })
