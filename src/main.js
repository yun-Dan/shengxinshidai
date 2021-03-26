import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// font
import 'font-awesome/css/font-awesome.css'
// css
import './assets/css/reset.css'
import './assets/css/global.css'
import './assets/css/print.css'
import './assets/css/two.css'
import './assets/css/four.css'
// elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css' // 基于断点的隐藏类
// cookie
import VueCookie from 'vue-cookie'
// 使用UEditor
// import 'vue-simple-ueditor/dist/css/vue-ueditor.css'
import VueUEditor from 'vue-simple-ueditor'
// vue 单页面设置网页title插件 'vue-wechat-title'
import VueWechatTitle from 'vue-wechat-title'
// 引用md5加密
import md5 from 'js-md5'
// 设置全局方法
import filters from './assets/js/filters'
import methods from './assets/js/methods'
Object.keys(filters).forEach(k => {
  Vue.filter(k, filters[k])
})
Object.keys(methods).forEach(k => {
  Vue.prototype[k] = methods[k]
})
Vue.use(ElementUI)
Vue.use(VueCookie)
Vue.use(VueUEditor)
Vue.use(VueWechatTitle)
Vue.prototype.$md5 = md5

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
