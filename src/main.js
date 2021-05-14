import '@capacitor/core'

import Vue from 'vue'
import App from './App.vue'
import store from './store'

import './assets/styles/tw.css'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import i18n from './i18n'

Vue.config.productionTip = false

new Vue({
  store,
  vuetify,
  i18n,
  render: (h) => h(App)
}).$mount('#app')
