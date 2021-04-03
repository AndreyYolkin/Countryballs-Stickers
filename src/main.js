import '@capacitor/core'

import Vue from 'vue'
import App from './App.vue'
import store from './store'

import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css'
import 'material-icons/iconfont/material-icons.css';
import './assets/styles/tw.css'
Vue.use(Vuesax, {})

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
