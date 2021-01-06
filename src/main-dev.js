import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as echarts from 'echarts'
// element-ui
import './plugins/element-ui'
// 全局样式
import '@/assets/style/global.less'
// jquery
// import $ from 'jquery'

// 格式化时间
import dayjs from 'dayjs'
Vue.prototype.echarts = echarts

Vue.config.productionTip = false
// 格式化时间
Vue.filter('dateFormat', function (time) {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
})
Vue.filter('dateFormat1', function (time) {
  return dayjs(time).format('YYYYMMDDHHmm')
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
