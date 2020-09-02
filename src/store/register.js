

export default {
    namespaced:true,
    state:{
        url:''
    },
    mutations:{
        // 发送验证码（电话号码，地区号）
        SENT_CAPTCHA(state,{phone,ctcode=86}){
            if(!phone) return
            state.url = '/captcha/sent?phone='+phone+'&ctcode='+ctcode
        },
        // 验证验证码（电话号码，验证码，地区号）
        VERIFY_CAPTCHA(state,{phone,captcha,ctcode=86}){
            if(!(phone&&captcha)) return
            state.url = '/captcha/verify?phone='+phone+'&captcha='+captcha+'&ctcode='+ctcode
        },
        // 注册(修改密码)（电话号码，验证码，密码，昵称）
        MUSE_REGISTER(state,{phone,captcha,password,nickname}){
            if(!(phone&&captcha&&password&&nickname)) return
            state.url = '/register/cellphone?phone='+phone+'&password='+password+'&captcha='+captcha+'&nickname='+nickname
        },
        // 检测手机号码是否已注册
        MUSE_ISREGISTER(state,{phone}){
            if(!phone) return
            state.url = '/cellphone/existence/check?phone='+phone
        },
        // 初始化昵称
        MUSE_INITNICKNAME(state,{nickname}){
            if(!nickname) return
            state.url = '/activate/init/profile?nickname='+nickname
        }
    }
}