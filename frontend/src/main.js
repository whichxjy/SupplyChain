import Vue from 'vue'
import router from './router/route'
import axios from 'axios'
import App from './App.vue'
import './plugins/element.js'

const http = axios.create({
  baseURL: process.env.BACKEND_URL ? process.env.BACKEND_URL : 'http://localhost'
})

Vue.prototype.$http = http

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
