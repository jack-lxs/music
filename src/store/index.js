import Vue from 'vue'
import Vuex from 'vuex'

// 引入api模块
import register from './register'
import login from './login'
import play from './play'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 登录状态
    loginType:1,
    // token
    token:'',
    // 用户id
    userId:'',
    // 用户名
    userName:'',
    // 手机号
    phone:'',
    // 昵称
    nickname:'',
    // // 头部导航
    // navbar:true,
    // 底部导航
    // tabbar:false,
  },
  mutations: {
    setState(state,[key,val]){
      state[key]=val
    }
  },
  actions: {
  },
  modules: {
    register,
    login,
    play
  }
})
