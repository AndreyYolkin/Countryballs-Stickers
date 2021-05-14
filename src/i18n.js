import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from './lang/en'
import es from './lang/es'
import pt from './lang/pt'
import ru from './lang/ru'

Vue.use(VueI18n)

const messages = { en, es, pt, ru }

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
