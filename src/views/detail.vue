<template>
  <div class="detail"  @touchmove ="touchBack" >
    <div class="header-bg"   >
      <div class="header-box clearfix" >
        <div class="sheet-img fl">
          <img :src="info.coverImgUrl" alt />
          <p class="num">180.3万</p>
          <p class="t">歌单</p>
        </div>
        <div class="sheet-right fl">
          <p class="korg">{{info.name}}</p>
          <div class="isthd">
            <div class="fl isthd-img">
              <img :src="info.avatarUrl" alt />
            </div>
            <div class="fl isthd-txt">{{info.nickname}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="brief-box">
      <div class="label">
        <span class="bq">标签：</span>
        <span class="sp" v-for="(item,index) in info.tags" :key="index">{{item}}</span>
      </div>
      <div class="brief">
        <span>简介：</span>
        <span>{{info.description}}</span>
      </div>
    </div>

    <div class="songsline">
      <span>歌曲列表</span>
    </div>

    <div class="b">
      <div
        class="hotsong-box2 clearfix"
        v-for="(item,index) in musicsong"
        :key="index"
        @click="onClickHander(item)"
      >
        <div class="fl hot-left ">{{(index+1) >=10 ? (index+1): "0"+(index+1) }}</div>
        <div class="fl hot-right2">
          <div class="fl hot-right2-left">
            <div class="songname">{{item.name}}</div>
            <div class="songzj">
              <div class="fl name">{{item.ar[0].name}}</div>
              <div class="fl zj"></div>
            </div>
          </div>
          <div class="fl hot-right-right">
            <img src="../assets/images/play.png" alt />
          </div>
        </div>
      </div>
    </div>

    <div class="songsline">
      <span>最新评论</span>
    </div>
    <div>
      <div class="comment-box" v-for="(item,index) in comments" :key="index">
        <div class="comment-tap">
          <div class="fl uimg">
            <img :src="item.user.avatarUrl" alt />
          </div>
          <div class="fl text-left">
            <div class="fl text-name">
              <div class="tname">{{item.user.nickname}}</div>
              <div class="tdate">{{item.time | formatDate}}</div>
            </div>
            <div class="fr fabulous">
              <span class="index">100</span>
              <span class="zan">
                <img src="../assets/images/zan.png" alt />
              </span>
            </div>
          </div>
        </div>
        <div class="content">
          <span>{{item.content}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// vuex
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("play");
import "../assets/js/until.js";
import "../assets/less/detail.less";
import { formatDate } from "../assets/js/until.js";
export default {
  //filter过滤器  将时间戳转换成年月日格式
  filters: {
    formatDate(time) {
      time = time * 1000; //若时间戳为10位数，则需要*1000
      let date = new Date(time);
      // console.log(new Date(time))
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
  },
  computed: {
    //vue取值
    ...mapState(["url", "id", "detail", "isgo"])
  },
  data() {
    return {
      playlist: null,
      info: {
        name: "",
        description: "",
        avatarUrl: "",
        coverImgUrl: "",
        nickname: "",
        tags: [],
        musicurl: []
      },
      musicsong: [],
      comments: [],
      nickname: [],
      sid: ""
    };
  },

  created() {
    this.sid = this.$route.query.id;
    // console.log(this.sid)
    this.getSongDanDetail();
  },

  methods: {
    //vuex的方法
    ...mapMutations(["setState", "setStatego"]),

    //点击歌曲，改变id
    onClickHander(item) {
      this.setState(["id", item.id]);
      this.setStatego("isgo", true);
    },

    //获取歌单详情
    getSongDanDetail() {
      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });
      this.$toast.clear();

      this.$axios({
        method: "GET",
        url: "/playlist/detail",
        params: {
          id: this.sid
        }
      })
        .then(result => {
          this.$toast.clear();
          // console.log("detail ==> ", result);
          if (result.data.code == 200) {
            // console.log(this.info)
            this.info.name = result.data.playlist.name;
            this.info.description = result.data.playlist.description;
            this.info.avatarUrl = result.data.playlist.creator.avatarUrl;
            this.info.coverImgUrl = result.data.playlist.coverImgUrl;
            this.info.nickname = result.data.playlist.creator.nickname;
            this.info.tags = result.data.playlist.tags;
            this.info.musicurl = result.data.privileges;
            //  console.log("musicurl",this.info.musicurl)
            this.getMusicDetail();
            this.getSongDanComment();
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },
    //获取音乐的详情信息
    getMusicDetail() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.info.musicurl.forEach(v => {
        // console.log(v.id);
        this.$axios({
          method: "GET",
          url: "/song/detail",
          params: {
            ids: v.id
          }
        })
          .then(result => {
            this.$toast.clear();
            // console.log("detail",result)
            if (result.data.code == 200) {
              this.musicsong.push(result.data.songs[0]);
              // console.log(result.data.songs)
            }
          })
          .catch(err => {
            // this.$toast.clear();
            console.log(err);
          });
      });
    },
    //获取歌单评论
    getSongDanComment() {
      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });
      this.$toast.clear();
      // console.log(this.playlistid);
      // let playlistid=this.playlistid
      this.$axios({
        method: "GET",
        url: "/comment/playlist",
        params: {
          id: this.sid,
          limit: 10
        }
      })
        .then(result => {
          this.$toast.clear();
          // console.log("comment ==> ", result);
          if (result.data.code == 200) {
            this.comments = result.data.comments;
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },
    
    //滑动返回
    touchBack(e) {
      if( e.touches[0].clientX > 100 && e.touches[0].clientX < 150 ){
        // console.log(e.touches[0].clientX)
         this.$router.go(-1);
      }else{
        // console.log("111");
        return;
      }
      
    }
  }
};
</script>

<style lang="less" scoped>
</style>