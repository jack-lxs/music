<template>

  <div class="login">

      <div class="logo">
          <div class="head">
            <img class="auto-img" src="../assets/images/logo.png" alt="">
          </div>
      </div>


    <!-- 表单 -->
    <van-form
      validate-first
     
      @submit="onSubmit"
    >
      <!-- 电话号码 -->
      <van-field
        label="电话号码"
        v-model="form.phone"
        name="pattern"
        :rules="[{ pattern:pattern.pattern1, message: '请输入正确的手机号码' }]"
      />
      <!-- 密码 -->
      <van-field
        label="密码"
        type="password"
        v-model="form.password"
        name="pattern"
        :rules="[{ pattern:pattern.pattern2, message: '密码包含 数字,英文,字符中的两种以上，长度6-20' }]"
      />
      <div style="margin: 16px;">
        <van-button
          round
          block
          type="info"
          native-type="submit"
        >
          登录
        </van-button>
      </div>
    </van-form>
    <div class="toRegister">
      <router-link to='/register'>去注册</router-link>
    </div>
  </div>
</template>

<script>
// vant=>toast
import { Toast } from "vant";

// vuex
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("login");

export default {
  data() {
    return {
      // 正则
      pattern: {
        pattern1: /^1[3456789]\d{9}$/,
        pattern2: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,20}$/
      },

      // 表单
      form: {
        // 电话号码
        phone: "13536779411",
        // 15914203799
        // 密码
        password: "lxs123"
        // 19971229niu
      }
    };
  },
  computed: {
    //   vuex
    ...mapState({
      url:(state)=>{
        return state.url
      }
    })
  },
  methods: {
    //   vuex
    ...mapMutations(["PHONE_LOGIN"]),

    // 登录按钮点击事件
    onSubmit() {
      // 修改vuex的url
      this.PHONE_LOGIN(this.form);
      // console.log(111)
      // 发起网络请求
      this.$axios(this.url).then(data => {
        console.log(data);
        if (data.data.code == 502) {
          // 登录失败提示
          Toast(data.data.msg);
          return;
        } else if (data.data.code == 200) {
          // 登录成功提示
          Toast("登录成功");
          // 改变vuex的loginType
          this.$store.commit("setState", ["loginType", data.data.loginType]);
          // 改变vuex的token
          this.$store.commit("setState", ["token", data.data.token]);
          // 改变vuex的userId
          this.$store.commit("setState", ["userId", data.data.account.id]);
          // 改变vuex的userName
          this.$store.commit("setState", [
            "userName",
            data.data.account.userName
          ]);
          // 改变vuex的phone
          this.$store.commit("setState", [
            "phone",
            JSON.parse(data.data.bindings[0].tokenJsonStr).cellphone
          ]);
          // 改变vuex的nickname
          this.$store.commit("setState", [
            "nickname",
            data.data.profile.nickname
          ]);
         
          this.$router.push("/");

        }
      });
    },

    // 去注册路由跳转
    toRegister() {
      this.$router.push("/register");
    },

    // 表单验证
    onFailed() {
      // console.log("failed", errorInfo);
    },

  

  },
  created() {
    this.$store.commit('setState',['tabbar',false])
  },
  
  // 离开前判断是否已登录
  beforeRouteLeave(to, from, next) {
    if (this.$store.state.loginType||to.path=='/register') {
      next();
    }
  }
};
</script>

<style lang="scss" scoped>

.logo{
  height: 80px;
  padding: 60px;
  background-color: #e8e8e8e8;
}
.head{
  height: 100px;
  width: 120px;
  margin: 0 auto;
  border-radius: 50%;
}
button::v-deep {
  margin-bottom: 1rem;
}
.toRegister{
  height: 20px;
  line-height: 20px;
  text-align: center;
}
.toRegister a{
  text-decoration: underline;
  font-size: 0.9rem;
  color: #494646;
}


</style>