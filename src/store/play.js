
export default {
    namespaced:true,
    state:{
        url:'',
        id:'',
        //判断隐藏mi播放器
        isgo:false,
        //App页音乐详情 传在vuex
        detail:null,
        //play页当前音乐播放时间
        currentTime:0,
        //play页播放键
        isOpen:false,
    },
    mutations:{
        //赋值方法
        setState(state,[key,val]){
            state[key] = val
        },
        //传递id的方法
        setStates(state,val){
            state.id = val
        },

         //传递isgo的方法
         setStatego(state,val){
            state.isgo = val
        },
         //传递isgo的方法
         setStateOpen(state,val){
            state.isOpen = val
        },

       
    }
}