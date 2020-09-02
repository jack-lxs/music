<template>
  <div>
    <button @click="onclickHandler">退出登录</button>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("login");
export default {
  computed: {
    ...mapState({
      url: state => {
        return state.url;
      }
    })
  },

  methods: {
    ...mapMutations(["MUSE_LOGOUT"]),
    onclickHandler() {
      this.MUSE_LOGOUT();
      this.$axios(this.url).then(d => console.log(d));
      this.$router.push({path:"/login"});
    }
  }
};
</script>

<style lang="less" scoped>
</style>