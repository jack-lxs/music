import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:3000'
Vue.prototype.$axios = axios

//node模块
// const cors = require('koa2-cors');
// Vue.use(cors());

// vant
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

Vue.config.productionTip = false

// 全局路由配置，检查登录状态
router.beforeEach((to, form, next) => {
  if (!store.state.loginType && to.path != '/login' && to.path != '/register') {
    next({ path: '/login' })
  }
  next()
})



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
