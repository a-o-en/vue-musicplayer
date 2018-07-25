<template>
  <transition name="singer">
    <div class="singer" ref="singer">
      <scroll class="singer-scroll" :click="click" ref="singerScroll">
        <div>
          <div class="tags-content">
            <hscroll @searchSinger="changeSinger" :data="area" :code="1"></hscroll>
            <hscroll @searchSinger="changeSinger" :data="sex" :code="2"></hscroll>
            <hscroll @searchSinger="changeSinger" :data="genre" :code="3"></hscroll>
          </div>
          <div>
            <div class="loading-container">
              <loading v-show="loading"></loading>
            </div>
            <ul v-show="!loading" class="singer-content">
              <li v-for="(group,index) in singers" :key="index" class="list-group">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                  <li @click="selectSinger(item)" v-for="(item, index) in group.items"
                      :key="index" class="list-group-item">
                    <img class="avatar" v-lazy="item.singerPic">
                    <div class="item-right">
                      <span class="name">{{item.name}}</span>
                      <i class="iconfont icon-xiayishou icon"></i>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </scroll>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import Singer from 'commom/js/singer'
  import Hscroll from 'base/scroll-h/scrollh'
  import {getSingerList1} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {mapGetters, mapMutations} from 'vuex'
  import {playlistMixin} from 'commom/js/mixin'

  const HOT_NAME = '热门'
  export default {
    mixins: [playlistMixin],
    data () {
      return {
        click: true,
        loading: true,
        singers: [],
        index: [
          {id: -100, name: '热门'},
          {id: 1, name: 'A'},
          {id: 2, name: 'B'},
          {id: 3, name: 'C'},
          {id: 4, name: 'D'},
          {id: 5, name: 'E'},
          {id: 6, name: 'F'},
          {id: 7, name: 'G'},
          {id: 8, name: 'H'},
          {id: 9, name: 'I'},
          {id: 10, name: 'J'},
          {id: 11, name: 'K'},
          {id: 12, name: 'L'},
          {id: 13, name: 'M'},
          {id: 14, name: 'N'},
          {id: 15, name: 'O'},
          {id: 16, name: 'P'},
          {id: 17, name: 'Q'},
          {id: 18, name: 'R'},
          {id: 19, name: 'S'},
          {id: 20, name: 'T'},
          {id: 21, name: 'U'},
          {id: 22, name: 'V'},
          {id: 23, name: 'W'},
          {id: 24, name: 'X'},
          {id: 25, name: 'Y'},
          {id: 26, name: 'Z'},
          {id: 27, name: '#'}
        ],
        area: [
          {id: -100, name: '全部'},
          {id: 200, name: '内地'},
          {id: 2, name: '港台'},
          {id: 5, name: '欧美'},
          {id: 4, name: '日本'},
          {id: 3, name: '韩国'},
          {id: 6, name: '其他'}
        ],
        genre: [
          {id: -100, name: '全部'},
          {id: 1, name: '流行'},
          {id: 6, name: '嘻哈'},
          {id: 2, name: '摇滚'},
          {id: 4, name: '电子'},
          {id: 3, name: '民谣'},
          {id: 8, name: 'R&B'},
          {id: 10, name: '民歌'},
          {id: 9, name: '轻音乐'},
          {id: 5, name: '爵士'},
          {id: 14, name: '古典'},
          {id: 25, name: '乡村'},
          {id: 20, name: '蓝调'}
        ],
        sex: [
          {id: -100, name: '全部'},
          {id: 0, name: '男'},
          {id: 1, name: '女'},
          {id: 2, name: '组合'}
        ],
        params: {
          index: -100,
          area: -100,
          genre: -100,
          sex: -100
        }
      }
    },
    mounted () {
      this._getSingerList(this.params)
    },
    methods: {
      // 重新计算滚动Scroll
      handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singer.style['bottom'] = bottom
        this.$refs.singerScroll.refresh()
      },
      selectSinger (singer) {
        this.$router.push({
          path: `/singer/${singer.singerMid}`
        })
        this.setSinger(singer)
      },
      // 根据标签改变singerlist
      changeSinger () {
        this.loading = true
        let params = {
          index: this.kinds[0],
          area: this.kinds[1],
          genre: this.kinds[3],
          sex: this.kinds[2]
        }
        this._getSingerList(params)
      },
      _getSingerList (params) {
        getSingerList1(params).then((res) => {
          if (res.code === ERR_OK) {
            this.loading = false
            this.singers = this._normalizeSinger(res.singerList.data.singerlist)
            console.log(this.singers)
          }
        })
      },
      _normalizeSinger (list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          map.hot.items.push(new Singer({
            name: item.singer_name,
            singerMid: item.singer_mid
          }))
        })
        return map
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    computed: {
      ...mapGetters([
        'kinds'
      ])
    },
    components: {
      Hscroll,
      Loading,
      Scroll
    }
  }
</script>

<style scoped lang="less">
  @import "../../commom/style/variable";

  .singer {
    position: fixed;
    top: 90px;
    bottom: 0;
    width: 100%;
    .singer-scroll {
      height: 100%;
      overflow: hidden;
      .tags-content {
        position: relative;
        .tags-wrapper {
          width: 1200px;
          .tags {
            width: 100%;
            overflow: hidden;
            &::after {
              content: '';
              display: block;
              clear: both;
            }
            li {
              float: left;
              margin: 0 12px 14px 0;
              a {
                display: block;
                padding: 2px 8px;
                text-decoration: none;
                cursor: pointer;
                &.select {
                  background-color: #0080FF;
                  color: #fff;
                }
              }
            }
          }
        }
      }
      .loading-container {
        position: absolute;
        width: 100%;
        top: 200px;
      }
      .singer-content {
        .list-group {
          padding-bottom: 30px;
          .list-group-title {
            height: 30px;
            line-height: 30px;
            padding-left: 20px;
            font-size: @font-size-medium;
            color: @color-text-black-d;
          }
          .list-group-item {
            position: relative;
            display: flex;
            align-items: center;
            margin: 15px 0 0 30px;
            .avatar {
              width: 50px;
              height: 50px;
              border-radius: 50%;
              margin-right: 10px;
            }
            .item-right {
              box-sizing: border-box;
              height: 50px;
              flex: 1;
              border-bottom: solid 1px @color-bottom-line;
              .name {
                display: inline-block;
                height: 50px;
                line-height: 50px;
                margin-left: 20px;
                color: @color-text-black;
                font-size: @font-size-medium;
              }
              .icon {
                color: @color-text-black-d;
                position: absolute;
                top: 50%;
                right: 10px;
                transform: translateY(-10px);
              }
            }
          }
        }
      }
    }
  }
  .singer-enter-active, .singer-leave-active {
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }
  .singer-enter, .singer-leave-to {
    opacity: 0;
  }
</style>
