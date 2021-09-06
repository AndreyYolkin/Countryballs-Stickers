import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from './lang/en'
import ru from './lang/ru'
import ua from './lang/ua'
import be from './lang/be'
import es from './lang/es'
import pt from './lang/pt'

Vue.use(VueI18n)

const messages = { en, es, pt, ru, ua, be }

const getLocale = () => {
  const cookieLanguage = sessionStorage.getItem('language')
  if (cookieLanguage) {
    return cookieLanguage
  }
  const language = navigator.language.toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.includes(locale)) {
      return locale
    }
  }
  return 'en'
}

export default new VueI18n({
  locale: getLocale() || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages
})
