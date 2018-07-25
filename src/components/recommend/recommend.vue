<template>
  <transition name="recommend">
    <div class="recommend" ref="recommend">
      <scroll ref="scroll" class="recommend-content" :data="discList" :click="click">
        <div>
          <div v-if="recommends.length" class="slider-recommend" ref="sliderWrapper">
            <slider>
              <div v-for="(item,index) in recommends" :key="index">
                <a :href="item.linkUrl">
                  <img @load="loadImg" :src="item.picUrl">
                </a>
              </div>
            </slider>
          </div>
          <div class="recommend-list" v-show="discList.length">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul>
              <li @click="selectItem(item)"
                  v-for="(item, index) in discList" class="item" :key="index">
                <div class="icon">
                  <img width="60" height="60" v-lazy="item.imgurl">
                </div>
                <div class="text">
                  <h2 class="name" v-html="item.creator.name"></h2>
                  <p class="desc" v-html="item.dissname"></p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="loading-container">
          <loading v-show="!discList.length"></loading>
        </div>
      </scroll>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import Loading from 'base/loading/loading'
  import Scroll from 'base/scroll/scroll'
  import Slider from 'base/slider/slider'
  import {getRecommend, getDiscList1} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from 'commom/js/mixin'

  export default {
    mixins: [playlistMixin],
    data () {
      return {
        recommends: [],
        discList: [],
        click: true
      }
    },
    created () {
      this._getRecommend()
      setTimeout(() => {
        this._getDistList()
      }, 300)
    },
    methods: {
      // 重新计算滚动Scroll
      handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.recommend.style['bottom'] = bottom
        this.$refs.scroll.refresh()
      },
      selectItem (item) {
        this.setDisc(item)
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
      },
      _getRecommend () {
        // getRecommend() 返回Promise对象。
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
          }
        })
      },
      _getDistList () {
        getDiscList1().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
          console.log('获取数据')
          console.log(res)
          // 成功获得数据， 还需要知道 设置 :authority //未知？
        })
      },
      loadImg () {
        if (!this.imgLoaded) {
          this.imgLoaded = true
          this.$refs.scroll.refresh()
        }
      },
      ...mapMutations({
        'setDisc': 'SET_DISC'
      })
    },
    components: {
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style lang="less" scoped>
  @import "../../commom/style/variable";

  .recommend {
    position: fixed;
    width: 100%;
    top: 90px;
    bottom: 0;
    .recommend-content {
      height: 100%;
      overflow: hidden;
      .slider-recommend {
        position: relative;
        width: 100%;
        overflow: hidden;
      }
      .recommend-list {
        background-color: @color-background-l;
        .list-title {
          height: 55px;
          line-height: 55px;
          text-align: center;
          font-size: @font-size-medium-x;
          color: @color-text-black;
        }
        .item {
          display: flex;
          box-sizing: border-box;
          align-items: center;
          padding: 0 20px 20px 20px;
          .icon {
            flex: 0 0 60px;
            width: 60px;
            padding-right: 20px;
          }
          .text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            font-size: @font-size-medium;
            .name {
              margin-bottom: 10px;
              color: @color-text-black;
            }
            .desc {
              color: @color-text-black-d;
            }
          }
        }
      }
      .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
    }

  }
  .recommend-enter-active, .recommend-leave-active {
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }
  .recommend-enter, .recommend-leave-to {
    opacity: 0;
  }
</style>
