// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
// MyBread其实是组件选项所在的对象
import MyBread from "@/components/cuscom/myBread.vue"
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/reset.css'
import MyServerHttp from '@/plugins/https.js'
import moment from 'moment'

Vue.use(ElementUI)
Vue.use(MyServerHttp)

// 全局自定义组件
Vue.component(MyBread.name, MyBread)

Vue.config.productionTip = false

//定义全局过滤器
Vue.filter('dateFormat', function (dataStr, pattern = "YYYY-MM-DD HH:mm:ss") {
  return moment(dataStr).format(pattern)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
