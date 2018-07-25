<template>
  <scroll class="search-result"
          :click="click"
          :data="result"
          :pullup="pullup"
          @scrollToEnd="searchMore"
          ref="result">
      <div class="search-content">
        <div v-show="!searching"
             class="search-item"
             v-for="(item, index) in result"
             :key="index"
             @click="selectItem(item)"
        >
          <template v-if="index === 0 && item.type === 'singer'">
            <div class="avatar">
              <img :src="getUrl(item.singermid)">
            </div>
            <p class="main-title">{{item.singername}}</p>
            <p class="sub-title">单曲：{{item.songnum}} 专辑：{{item.albumnum}}</p>
          </template>
          <template v-else>
            <div class="icon">
              <i class="icon-image"></i>
            </div>
            <p class="main-title">{{item.songname}} - {{item.albumname}}</p>
            <p class="sub-title" v-html="item.singer"></p>
          </template>
        </div>
        <div class="loading-container">
          <loading v-show="hasMore"></loading>
        </div>
      </div>
  </scroll>
</template>
<script>
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import {createSong} from 'commom/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import Singer from 'commom/js/singer'

  const TYPE_SINGER = 'singer'
  export default {
    name: 'searchResult',
    data () {
      return {
        page: 1,
        perpage: 20,
        result: [],
        click: true,
        pullup: true,
        hasMore: true,
        searching: false
      }
    },
    props: {
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      // 选择项
      selectItem (item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            singerMid: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.singerMid}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
      },
      // 上拉刷新
      searchMore () {
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, this.perpage).then((res) => {
          this.result = this.result.concat(this._normalizeSearch(res.data))
          this._checkMore(res.data)
        })
      },
      // 获取歌手图片
      getUrl (mid) {
        return `https://y.gtimg.cn/music/photo_new/T001R68x68M000${mid}.jpg?max_age=2592000`
      },
      // 格式化歌手 不使用！
      getSinger (singer) {
        let ret = ''
        if (!singer) {
          return ret
        }
        // for(let item in singer)
        for (let i = 0; i < singer.length; i++) {
          ret += '/'
          ret += singer[i].name
        }
        return ret.substr(1)
      },
      // 搜索
      _search () {
        this.searching = true
        this.page = 1
        this.$refs.result.scrollTo(0, 0)
        this.hasMove = true
        search(this.query, this.page, this.showSinger, this.perpage).then((res) => {
          if (res.code === ERR_OK) {
            // console.log(res.data)
            this.result = this._normalizeSearch(res.data)
            this._checkMore(res.data)
            this.searching = false
          }
        })
      },
      // 检查是否有更多
      _checkMore (data) {
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * 20) > song.totalnum) {
          this.hasMore = false
        }
      },
      _normalizeSearch (data) {
        let ret = []
        if (this.page === 1 && data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      // songlist实例
      _normalizeSongs (list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      ...mapMutations({
        'setSinger': 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    computed: {
      ...mapGetters([
        'query'
      ])
    },
    watch: {
      query (newQuery) {
        if (newQuery.length > 0) {
          this._search()
        }
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="less">
  @import '../../commom/style/variable';

  .search-result {
    position: relative;
    height: 100%;
    overflow: hidden;
    .search-content {
      .search-item {
        position: relative;
        padding-left: 56px;
        height: 55px;
        overflow: hidden;
        .avatar {
          position: absolute;
          left: 8px;
          top: 8px;
          width: 40px;
          height: 40px;
          img {
            width: 100%;
            border-radius: 50%;
          }
        }
        .icon {
          position: absolute;
          left: 16px;
          top: 16px;
          .icon-image {
            display: block;
            background-image: url('./assets/search_sprite.png');
            background-size: cover;
            width: 22px;
            height: 22px;
          }
        }
        .main-title {
          color: @color-text-black;
          font-size: @font-size-medium;
          margin: 15px 0 5px 0;
          width: 100%;
          box-sizing: border-box;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .sub-title {
          color: @color-text-black-d;
          font-size: @font-size-small;
        }
      }
      .loading-container {
        transform: translate3d(-5px, 0, 0);
        padding-top: 16px;
      }
    }
  }
</style>
