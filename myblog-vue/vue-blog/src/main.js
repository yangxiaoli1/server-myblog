import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/plugins/http'
// 插件引入顺序很重要
import '@/plugins/vant'
import '@/plugins/element'
import '@/plugins/vuescroll'


import '@/assets/css/global.styl'
import 'element-ui/lib/theme-chalk/display.css'
import 'animate.css'
import 'github-markdown-css/github-markdown.css'
import 'vant/lib/index.css'
// import 'element-ui/lib/theme-chalk/index.css';

// import _ from "lodash";
Vue.config.productionTip = false

// 直接引用http不安全
// import http from '@/api/http'
// Vue.prototype.$api = http

// 通过插件引用http更安全 不可枚举 不可重写
// Vue.use(httpPlugin)
// Vue.prototype._ = _


Vue.prototype.$EventBus = new Vue()

//hack alert
window.alert = function (value) {
  Vue.prototype.$notify.error({
    title: '错误',
    message: value
  })
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
