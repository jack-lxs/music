<template>
  <div id="app">
    <router-view></router-view>

    <div class="mi-play-box clearfix" v-show="isgo" >
      <div class="fl mi-play-left clearfix" >
        <div class="mi-play-img fl" @click="goplay">
          <img class="auto-img" :src="musicpic" alt />
        </div>
        <div class="fl mi-play-songs">
          <div class="ge">
            <span class="gepople">{{musciname}} -</span>
            <span class="gename">{{musciczj}}</span>
          </div>
          <div class="bar-box">
            <div class="fl startmin">{{startmin}}</div>
            <div class="fl croll">
              <audio
                ref="audio"
                @pause="isplay = true"
                @canplay="$refs.audio.play()"
                @timeupdate="updateTime"
                @play="pal"
                :src="url"
              ></audio>
              <div class="bar-long"></div>
              <div class="bar-small" :style="{width}"></div>
              <div class="ball" :style="{left}" ref="ball"></div>
            </div>
            <div class="fl endmin">{{endmin}}</div>
          </div>
        </div>
      </div>
      <div class="mi-play-right fl">
        <div class="p" v-if="isplay" @click="isplayer">
          <img src="./assets/images/testplay.png" alt />
        </div>
        <div class="s" @click="isplayer" v-if="!isplay">
          <img src="./assets/images/teststop.png" alt />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import "./assets/less/mi-play.less";
// vuex
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("play");

export default {
  data() {
    return {
      active: 0,
      //播放键的判断
      isplay: true,

      //音乐名
      musciname: "",
      //音乐的图片
      musicpic: "",

      //音乐的专辑
      musciczj: "",

      //音乐的时长
      endmin: "",

      //音乐的当前时长
      startmin: "",

      //小球的位置
      left: "",

      //进度条的位置
      width: ""
    };
  },

  computed: {
    //vue取值
    ...mapState(["url", "id", "isgo", "isOpen"])
  },
  watch: {
    //监听isOpen状态
    isOpen() {
      if (this.isOpen) {
        
        this.$refs.audio.play();
       
      } else {
        this.$refs.audio.pause();
      }
    },
  //监听音乐id
    id() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      //根据音乐id 获取音乐url
      this.$axios({
        method: "GET",
        url: "/song/url",
        params: {
          id: this.id
        }
      })
        .then(result => {
          this.$toast.clear();

          if (result.data.code == 200) {
            this.setState(["url", result.data.data[0].url]);
              
            this.$refs.audio.oncanplay = () => {
              this.$refs.audio.play();
              this.setState(['isOpen',true])
              // console.log(this.isOpen)
            };

            this.$refs.audio.onpause = () => {
              this.isplay = true;
            };
          }
          
          this.getmusicdetail();
        })
        .catch(err => {
          this.$toast.clear();
          console.log(err);
        });
    }
  },
  methods: {
    //vuex的方法
    ...mapMutations(["setState", "setStatego","setStateOpen"]),

    //Mi点击播放音乐
    isplayer() {
      this.getmusicurl();
      //根据isplay的值来判断是否播放
      if (this.isplay == true) {
        //如果为true,就播放
        this.$refs.audio.play();
        //并将isplay的值为false
        this.isplay = false;
        //判断play页 的播放键是否显示
         this.setState(['isOpen',true])
      } else if (this.isplay == false) {
        //如果为false
        this.$refs.audio.pause(); //就暂停
        this.isplay = true; //并赋值为true
        //判断play页 的播放键是否隐藏
        this.setState(['isOpen',false])
      }
    },
    //点击执行play方法
    pal() {
      //音乐总长度
      this.endmin = parseFloat(this.$refs.audio.duration / 60).toFixed(2);
    },
    //监听音乐时长
    updateTime() {
      this.isplay = false;

      //当前时长
      this.startmin = parseFloat(this.$refs.audio.currentTime / 60).toFixed(2);

      // 当前宽度 = 当前时长/总时长 * 总长度

      //当前宽度
      this.left = this.$refs.audio.currentTime + "px";

      this.left = (this.startmin / this.endmin) * 150 + "px";
      this.width = this.left;

      // console.log(this.$refs.audio.currentTime)
      this.setState(["currentTime", this.$refs.audio.currentTime]);
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
          // console.log(result)
          if (result.data.code == 200) {
            // this.url = result.data.data[0].url;
            this.setState(["url", result.data.data[0].url]);
            // console.log(this.$refs.audio)
            // this.$refs.audio.play()
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
          // console.log("detail",result)
          if (result.data.code == 200) {
            this.musciname = result.data.songs[0].al.name;
            this.musicpic = result.data.songs[0].al.picUrl;
            this.musciczj = result.data.songs[0].ar[0].name;
            this.setState(["detail", result.data]);
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log(err);
        });
    },
    //点击到play页
    goplay() {
      this.$router.push({ path: "./play", query: { id: this.id } });
      
      this.setStatego("this.isgo", false);
      
      this.setState("isOpen",false)
      
    }
  }
};
</script>

<style lang="scss">
#app {
  background-color: 0#e8e8e8e8;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}

.auto-img {
  width: 100%;
  height: 100%;
}
</style>
