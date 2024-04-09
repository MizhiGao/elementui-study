import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false


Vue.use(ElementUI)


import '@/styles/index.css' // global css
import empty from './directives/empty'
Vue.use(empty)

new Vue({
  render: h => h(App),
}).$mount('#app')
