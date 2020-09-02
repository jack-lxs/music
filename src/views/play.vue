<template>
  <div class="play" @touchmove="touchBack">
    <div class="play-needle">
      <img class="auto-img" src="../assets/images/needle.png" alt />
    </div>
    <div class="bg" :style="{backgroundImage: 'url(' + bgurl + ')' }"></div>
    <div>
      <div class="play-box">
        <div class="box">
          <div class="draw">
            <div class="rotate"  >
             
              <div class="disc"></div>
              <div class="disc-1">
                <img :src="detail.songs[0].al.picUrl" alt />
              </div>
              <div class="play-lit" @click="play" v-if="!isOpen">
                <img class="auto-img" src="../assets/images/play-play.png" alt />
              </div>
              <div class="play-lits" @click="play" v-else></div>
            </div>
          </div>

          <div class="songsinfo">
            <div class="songstitle">
              <span class="title">{{detail.songs[0].name}} -</span>
              <span class="zj">{{detail.songs[0].ar[0].name}}</span>
            </div>
            <div class="songs-box">
              <p>{{oneLyric}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/play.less";
// vuex
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("play");
export default {
  watch: {
    currentTime() {
      for (let key in this.lyric) {
        if (this.currentTime >= key) {
          this.oneLyric = this.lyric[key];
        }
      }
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.getmusicurl();
    this.getlyric();
    this.setState(["isgo", false]);
  },
  data() {
    return {
      //歌词
      oneLyric: "",
      //获取歌词
      lyric: {},
      bgurl: "",
      rotateTime:5,
    };
  },
  computed: {
    //vue取值
    ...mapState(["url", "isgo", "detail", "currentTime", "isOpen"])
  },
  methods: {
    //vuex的方法
    ...mapMutations(["setState"]),

    play() {
      if (this.isOpen) {
        this.setState(["isOpen", false]);
        // console.log()
      } else {
        this.setState(["isOpen", true]);
      }
    },

    //获取音乐的url
    getmusicurl() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.$axios({
        method: "GET",
        url: "/song/url",
        params: {
          id: this.id
        }
      })
        .then(result => {
          this.$toast.clear();
          // console.log(result);

          if (result.data.code == 200) {
            this.setState(["url", result.data.data[0].url]);
          }
          this.getmusicdetail();
        })
        .catch(err => {
          this.$toast.clear();
          console.log(err);
        });
    },
    //获取音乐的详情信息
    getmusicdetail() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.$axios({
        method: "GET",
        url: "/song/detail",
        params: {
          ids: this.id
        }
      })
        .then(result => {
          this.$toast.clear();
          // console.log(result);
          if (result.data.code == 200) {
            this.bgurl = result.data.songs[0].al.picUrl;
          }
          // console.log(this.bgurl);
        })
        .catch(err => {
          this.$toast.clear();
          console.log(err);
        });
    },
    //获取音乐的歌词
    getlyric() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.$axios({
        method: "GET",
        url: "/lyric",
        params: {
          id: this.id
        }
      })
        .then(result => {
          this.$toast.clear();
          if (result.data.code == 200) {
            let arr = result.data.lrc.lyric.split("[");
            arr.forEach(element => {
              let newarr = element.split("]")[0].split(":");
              this.lyric[
                Number(newarr[0]) * 60 + Number(newarr[1])
              ] = element.split("]")[1];
              // console.log(newarr);
            });
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log(err);
        });
    },

    //滑动返回
    touchBack(e) {
      if (e.touches[0].clientX > 100 && e.touches[0].clientX < 150) {
        this.$router.go(-1);
      } else {
        // console.log("111");
        return;
      }
    }
  },

  //退出play页面的时候，显示小播放器
  destroyed() {
    this.setState(["isgo", true]);
  }
};
</script>

<style lang="less" scoped>
.songs-box {
  overflow: hidden;
}
</style>

<style lang ="css" scoped>
@keyframes myfirst /* Safari 与 Chrome */ {
  from {
    transform: rotate(0deg);
  }
  to {
   transform: rotate(360deg);
  }
}
.rotate {
  animation: myfirst 3s linear;
}
</style>
