import { createApp } from 'vue'
import App from './App.vue'

import '@capacitor/core'
import 'vuetify/styles'

import { store } from './store'
import { vuetify } from './plugins/vuetify'
import { i18n } from './i18n'

import './assets/styles/tw.css'
import '@fontsource/rubik/variable.css'

const app = createApp(App)

app.use(store)
app.use(vuetify)
app.use(i18n)

app.mount('#app')
