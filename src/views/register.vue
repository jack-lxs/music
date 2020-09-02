<template>
  <div>

    <van-form
      validate-first
      @failed="onFailed"
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
        v-model="form.password"
        name="pattern"
        :rules="[{ pattern:pattern.pattern2, message: '密码包含 数字,英文,字符中的两种以上，长度6-20' }]"
      />

      <!-- 昵称 -->
      <van-field
        label="昵称"
        v-model="form.nickname"
        :rules="[{ pattern:pattern.pattern3, message: '昵称不能为空' }]"
      />

      <!-- 验证码 -->
      <van-field
        label="验证码"
        v-model="form.captcha"
        :rules="[{ pattern:pattern.pattern4, message: '请输入正确的验证码' }]"
      />

      <div style="margin: 16px;">
        <van-button
          round
          block
          type="info"
          @click="sentcaptchaHandler"
          :disabled=isDisable
          native-type="submit"
        >
          发送验证码<span>({{resttime}})</span>
        </van-button>

        <van-button
          round
          block
          type="info"
          native-type="submit"
        >
          注册
        </van-button>
      </div>
    </van-form>
    <div class="toRegister">
      <router-link to='/login'>去登录</router-link>
    </div>
  </div>
</template>

<script>
// vant=>toast
import { Toast } from "vant";

// vuex
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("register");

export default {
  data() {
    return {
      // 是否可以发送验证码
      isDisable: false,
      // 定时器
      interval: null,
      // 验证码冷却时间
      resttime: 60,
      // 正则
      pattern: {
        pattern1: /^1[3456789]\d{9}$/,
        pattern2: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,20}$/,
        pattern3: /\S/,
        pattern4: /^\d{4}$/
      },

      // 表单
      form: {
        // 电话号码 15914203799
        phone: "",
        // 密码 19971229niu
        password: "",
        // 昵称 我最喜欢JavaScript了
        nickname: "",
        //   验证码 
        captcha: ""
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
    ...mapMutations(["SENT_CAPTCHA", "MUSE_ISREGISTER", "VERIFY_CAPTCHA",'MUSE_REGISTER']),

    // 发送验证码按钮点击事件
    sentcaptchaHandler() {
      // 发送验证码按钮失效
      this.isDisable = !this.isDisable;
      // 改变vuex的url
      this.SENT_CAPTCHA(this.form);
      console.log(this.url);
      // 发送网络请求
      this.$axios(this.url).then(d => {
        // 如果发送不成功，结束
        if (!(d.status == 200)) return;
        // 设置定时器
        this.interval = setInterval(() => {
          // 冷却时间减一
          this.resttime -= 1;
          // 如果冷却结束
          if (this.resttime == -1) {
            // 清除定时器
            clearInterval(this.interval);
            // 重置冷却时间
            this.resttime = 60;
            // 发送验证码按钮可点击
            this.isDisable = !this.isDisable;
          }
        }, 1000);
      });
    },

    // 注册按钮点击事件
    onSubmit() {
      // 验证手机号是否被注册的promise
      this.MUSE_ISREGISTER(this.form);
      let p1 = this.$axios(this.url);

      // 验证验证码的promise
      this.VERIFY_CAPTCHA(this.form);
      let p2 = this.$axios(this.url);

      // 生成一个新的promise
      Promise.all([p1, p2]).then(([register, captcha]) => {
        console.log(register, captcha);
        if (!(captcha.data.code == 200)) {
          // 如果验证码不正确直接503服务器报错
          Toast("验证码不正确");
        } else if (register.data.exist>=0) {
          Toast("手机号已被注册");
        } else {
          // 调用注册接口
          this.register()
        }
      });
    },

    // 注册
    register(){
      this.MUSE_REGISTER(this.form)
      // console.log(this.url)
      this.$axios(this.url).then(data=>{
        console.log(data)
      })
    },

    // 表单验证
    onFailed() {
      // console.log("failed", errorInfo);
    }
  },
  created() {
    this.$store.commit('setState',['tabbar',false])
  },
};
</script>

<style lang="scss" scoped>
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