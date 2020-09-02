<template>
  <div>
    
    <div class="head-bg">
      <div class="header">
        <div class="fl text-box">
          <div class="fl text-logo">
            <img src="../assets/images/small-logo.png" alt />
          </div>
          <div class="fl text">网抑云音乐</div>
        </div>
        <div class="fr btn-box">
          <div class="btn">下载App</div>
        </div>
      </div>
    </div>
    <div>
      <van-tabs v-model="active" sticky title-active-color="#1989FA"	>
        <van-tab title="推荐音乐">
          <div class="main">
            <div class="recommend">
              <h2>推荐歌单</h2>
              <div class="line"></div>

              <div class="fl songdan" v-for="(item,index) in playlists" :key="index" @click="gogedan(item)">
                <div class="fl song">
                  <div class="pic">
                    <img class="auto-img" :src="item.picUrl" alt />
                  </div>
                  <div class="er">
                    <span class="er-text">{{item.playCount}}</span>
                    <span class="auto-img mai">
                      <img src="../assets/images/er.png" alt />
                    </span>
                  </div>
                  <p>{{item.name}}</p>
                </div>
                <div class="fl"></div>
                <div class="fl"></div>
              </div>
            </div>

            <div class="new">
              <h2>最新音乐</h2>
              <div class="line"></div>
              <div class="songs" ref="songs" v-for="(item,index) in newsong" :key="index"  @click="goplay(item)">
                <div class="fl songs-box">
                  <div class="song-name">{{item.name}}</div>
                  <div class="song-sname-box">
                    <i class="fl icon"></i>
                    <span class="fl song-sname">{{item.song.album.artists[0].name}}</span>
                  </div>
                </div>
                <div class="fr play-box">
                  <i class="play"></i>
                </div>
              </div>
            </div>

            <div class="footer">
              <div class="footer-logo">
                <img class="auto-img" src="../assets/images/music.png" alt />
              </div>

              <div class="footer-btn">
                <div class="btn-txt">打开APP,发现更多好音乐 ></div>
              </div>
            </div>
          </div>
        </van-tab>

        <van-tab title="热歌榜">
          <div class="hotbang-box">
            <div class="hot-logo">
              <!-- <img src="" alt=""> -->
            </div>
            <div class="hot-txt">
              <span class="update">更新日期:</span>
              <span class="date">0{{month}}月{{dates}}日</span>
            </div>
          </div>

          <div class="hotsong-box clearfix"  v-for="(item,index) in newsong" :key="index"  @click="goplay(item)">
            <div class="fl hot-left ">{{(index>=9?'':'0')+(index+1)}}</div>
            <div class="fl hot-right">
              <div class="fl hot-right-left">
                <div class="songname">{{item.name}}</div>
                <div class="songzj">
                  <div class="fl name">{{item.song.album.name}}</div>
                  <div class="fl zj"></div>
                </div>
              </div>
              <div class="fr hot-right-right">
                <img src="../assets/images/play.png" alt />
              </div>
            </div>
          </div>
        </van-tab>

        <van-tab title="搜索">
          <div class="search-box">
            <div class="search-header">
              <div class="search-i fl" ref="search" >
                <i></i>
              </div>
              <div class="inp fl">
                <input type="text" ref="input" @keydown.enter="search()"  v-model="keywords"  placeholder="搜索歌曲、歌手、专辑"  />
              </div>
              <div class="x fr" @click="remove" v-if="!isnull">
                <i></i>
              </div>
            </div>
          </div>

          <div class="hotbox">

            <div v-if="isnull">
              <div class="hotmen">
                <div class="hotsearch">热门搜索</div>
              </div>

              <div class="hotsearch-box">
                <div class="search-x fl" v-for="(item,index) in hots" :key="index">
                  <span >{{item.first}}</span>
                </div>
              </div>
            </div>

            <div class="searchres-box" v-else>
              <div class="searchres-one clearfix">
                <div class="bluesearh fl">搜索</div>
                <div class="bluesearch-x fl">
                  <span>"{{keywords}}"</span>
                </div>
              </div>

              <div class="searchres-two clearfix"  v-for="(item,index) in searchData" :key="index" >
                <div class="searh-s fl"></div>
                <div class="search-res fl" @click="clickHandler(item)">
                  <span>{{item.name}}</span>
                </div>
              </div>
              
            </div>

          </div>
        </van-tab>

      </van-tabs>
    </div>
  </div>
</template>

<script>
import "../assets/less/home.less";
import "../assets/less/home-hot.less";
import "../assets/less/home-search.less";

import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("play");

export default {
  data() {
    return {
      active: 0,
      //判断是否有搜索
      isnull: true,

      //用户id
      uid: "",
      
      //歌曲id数据
      iddata: [],
      //歌曲id
      // id:'',
      //相关歌单参数，限制多少条
      limit: 6,

      //推荐歌单数据
      playlists: [],

      //最新音乐数据
      newsong: [],

      //热门歌单数据
      hotplaylist: [],

      //热门歌曲
      hotsongs:[],

      //热门歌单id
      playlistid: "",

      //登录状态
      status: "",
      //搜索关键词
      hots:[],

      //搜索关键词
      keywords:'',

      //搜索词数据
      searchData:[],
      //当前日期
      dates:"",
      //当月
      month:'',

      //跳转页面
      isgo:'',


    };
  },

  computed: {
    //vuex
    ...mapState(['url','id'])
    
  },
  methods: {
    ...mapMutations(["MUSE_LOGOUT","setState","setStates","setStatego"]),
    clickHandler(item){
      console.log(item.id)
      this.setState(["id", item.id]);
      this.setStatego('this.isgo',true)
    },
    // onclickHandler() {
    //   // this.MUSE_LOGOUT();
    //   this.$axios(this.url).then(d => console.log(d));
    // },
    //获取用户信息-->无
    getUser() {
      this.$axios(this.url)
        .then(d => {
          console.log("userId==", d);

          if (d.data.code == 200) {
            this.uid = d.data.account.id;
          }
          this.status = d.status;
          // console.log('uid==>',this.uid)
          
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取相关歌单
    getsongsdan() {
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
        url: "/personalized",
        params: {
          limit: this.limit
        }
      })
        .then(result => {
          this.$toast.clear();
          // console.log("songsdan ==> ", result);
          // console.log('sonsuid===>',this.id)
          if (result.data.code == 200) {
            this.playlists = result.data.result;
          }

          // console.log(this.playlists)
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },
    //获取最新音乐
    getNewMusic() {
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
        url: "/personalized/newsong"
      }).then(result => {
          this.$toast.clear();
          // console.log("newsong ==> ", result);
          // console.log('sonsuid===>',this.id)
          if (result.data.code == 200) {
            this.newsong = result.data.result;
           
            for(let i = 0;i<result.data.result.length;i++){
              // console.log(result.data.result[i]);
              this.iddata.push(result.data.result[i])
               
            }
             
              // console.log(this.iddata)
          }
         
        
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },
    //获取热门歌单分类 -->无
    gethot() {
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
        url: "/playlist/hot"
      })
        .then(result => {
          this.$toast.clear();
          // console.log("hotdan ==> ", result);
          let hotplaylist = [];
          if (result.data.code == 200) {
            //获取热门歌单
            hotplaylist = result.data.tags;
          }
          //赋值
          this.hotplaylist = hotplaylist;

          // console.log(this.hotplaylist)
          //遍历热门歌单
          for (let i = 0; i < this.hotplaylist.length; i++) {
            //获取热门歌单的Id
            this.playlistid = this.hotplaylist[i].id;
          }

          // console.log("this.playlistid", this.playlistid);
          // cb()
          this.getsngdandetail();
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    //获取歌单详情 --无
    getsngdandetail() {
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
        url: "/playlist/detail",
        params: {
          id: this.playlistid
        }
      })
        .then(result => {
          this.$toast.clear();
          console.log("detail ==> ", result);
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    //获取每日推荐歌曲 --无
    geteverday() {
      console.log(this.status);
      // let tokenString = localStorage.getItem("__tk")
      // console.log(this.loginType)
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
        url: "/recommend/songs",
        params: {
          status: this.status
        }
      })
        .then(result => {
          this.$toast.clear();
          console.log("detail ==> ", result);
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    //热门搜索列表
    gethotsearch(){
       this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });

      this.$toast.clear();
      this.$axios({
        method: "GET",
        url: "/search/hot",
        // params: {
        //   status: this.status
        // }
      })
        .then(result => {
          this.$toast.clear();
          // console.log("search ==> ", result);
        if(result.data.code == 200){
          this.hots = result.data.result.hots;
        }
        // console.log(this.hots)
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    //输入关键词搜索
    getsearch(){
        this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      }); 
      // 网络请求
      this.$axios({
        method: "GET",
        url: "/search",
        params: {
          keywords:this.keywords,
          // type:this.type
        }
      })
        .then(result => {
          //关闭加载提示
          this.$toast.clear();
          // console.log("search ==> ", result);
        if(result.data.code==200){
          //赋值
            this.searchData = result.data.result.songs;
        }

          // console.log('searchdata',this.searchData)
        })
        .catch(err => {
           //关闭加载提示
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    //键盘搜索 进行搜索
    search(){
      
        //判断输入框的是否有值
        if(this.$refs.input.value==''){
          //判断是否显示热搜框 
          this.isnull = true;
          return;
        }
       
        this.getsearch();
        this.isnull = false;
    },

    //清除搜索框
    remove(){
      // console.log( this.$refs.input.value)
      this.keywords = '';
      this.isnull = true;
    },

  //点击传Id
    goplay(item){
      this.setStates(item.id);
      // this.getmusicurl()
      this.setStatego("isgo",true);
      
    },
  

    //更新日期
    getdate(){
      let date = new Date();
      // console.log(date)
      this.dates = date.getDate();
      this.month = date.getMonth()+1;
      
    },

    //点击去歌单详情
    gogedan(item){
    
      this.$router.push({name:'detail',query:{id:item.id}})
    
    }

  },
  created() {
    // this.$store.commit("setState", ["tabbar", true]);

    //获取用户信息
    // this.getUser();

    //获取推荐歌单
    this.getsongsdan();

    //获取最新音乐
    this.getNewMusic();

    //获取热门歌单
    // this.gethot();

    //获取热门搜索
    this.gethotsearch();

    //获取日期
    this.getdate();

  
  }
};
</script>

<style lang="less" scoped>

/deep/.van-tabs__line {
  background-color: #1989fa;
}
</style>