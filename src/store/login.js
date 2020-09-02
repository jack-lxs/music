

export default {
    namespaced:true,
    state:{
        url:''
    },
    mutations:{
        // 手机登录
        PHONE_LOGIN(state,{phone,password}){
            state.url='/login/cellphone?phone='+phone+'&password='+password
        },
        // 退出登录
        MUSE_LOGOUT(state){
            state.url='/logout'
        },

        
        // 刷新登录
        REFRESH_LOGIN(state){
            state.url='/login/refresh'
        },
        // 登录状态
        MUSE_LOGIN_STATUS(state){
            state.url='/login/status'
        }
    }
}