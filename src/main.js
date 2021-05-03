import '@capacitor/core'

import Vue from 'vue'
import App from './App.vue'
import store from './store'

import 'material-icons/iconfont/material-icons.css'
import './assets/styles/tw.css'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false

new Vue({
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
