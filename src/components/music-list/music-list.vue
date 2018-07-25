<template>
  <div class="music-list">
    <div>
      <div class="back" @click="back">
        <i class="iconfont icon-houtui"></i>
      </div>
      <h1 class="title" v-html="title"></h1>
      <div class="bg-image" :style="bgStyle" ref="bgImage">
        <div class="filter" ref="filter">
          <div class="subFilter"></div>
        </div>
      </div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll" :probe-type="probeType" :click="click"
            :listen-scroll="listenScroll" :data="songs"
            class="list" ref="list">
      <song-list @select="selectItem" :rank="rank"
                 :songs="songs" class="song-list-wrapper"></song-list>
      <div v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script>
  import {mapActions} from 'vuex'
  import Loading from 'base/loading/loading'
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import {playlistMixin} from 'commom/js/mixin'

  const RESERVED_HEIGHT = 40
  export default {
    mixins: [playlistMixin],
    data () {
      return {
        scrollY: 0,
        click: true
      }
    },
    props: {
      bgImage: {
        type: String,
        default: '',
        required: true
      },
      title: {
        type: String,
        default: '',
        required: true
      },
      songs: {
        type: Array,
        default: null,
        required: true
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    mounted () {
      // console.log(this.$refs.list.$el)
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
      this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
    },
    created () {
      this.probeType = 3
      this.listenScroll = true
    },
    methods: {
      // 重新计算滚动Scroll
      handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.list.$el.style['bottom'] = bottom
        this.$refs.list.refresh()
      },
      scroll (pos) {
        this.scrollY = pos.y
      },
      back () {
        this.$router.back()
      },
      selectItem (item, index) {
        this.selectPlay({
          list: this.songs,
          index: index
        })
      },
      ...mapActions([
        'selectPlay'
      ])
    },
    watch: {
      scrollY (newY) {
        let translateY = Math.max(this.minTranslateY, newY)
        let zIndex = 0
        let scale = 1
        let blur = 0
        this.$refs.layer.style['transform'] = `translate3d(0, ${translateY}px, 0)`
        this.$refs.layer.style['webkitTransform'] = `translate3d(0, ${translateY}px, 0)`

        const percent = Math.abs(newY / this.imageHeight)
        if (newY > 0) {
          scale = 1 + percent
          zIndex = 10
        } else {
          blur = Math.min(8 * percent, 8)
        }
        this.$refs.filter.style['filter'] = `blur(${blur}px)`
        if (newY < this.minTranslateY) {
          zIndex = 10
          this.$refs.bgImage.style['height'] = RESERVED_HEIGHT + 'px'
          this.$refs.bgImage.style['padding-top'] = 0
          this.$refs.playBtn.style['display'] = 'none'
        } else {
          this.$refs.bgImage.style['height'] = 0
          this.$refs.bgImage.style['padding-top'] = '70%'
          this.$refs.playBtn.style['display'] = ''
        }
        this.$refs.bgImage.style['zIndex'] = zIndex
        this.$refs.bgImage.style['transform'] = `scale(${scale})`
        this.$refs.bgImage.style['webkitTransform'] = `scale(${scale})`
      }
    },
    computed: {
      bgStyle () {
        return `background-image: url(${this.bgImage})`
      }
    },
    components: {
      Scroll,
      SongList,
      Loading
    }
  }
</script>

<style scoped lang="less">
  @import "../../commom/style/variable";

  .music-list {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    background-color: @color-background;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;
      .icon-houtui {
        display: block;
        padding: 10px;
        font-size: @font-size-large-x;
        color: @color-text-black-d;
      }
    }
    .title {
      position: absolute;
      top: 0;
      left: 10%;
      z-index: 40;
      width: 80%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      text-align: center;
      line-height: 40px;
      font-size: @font-size-large;
      color: @color-text;
    }
    .bg-image {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 70%;
      transform-origin: top;
      -webkit-background-size: cover;
      background-size: cover;
      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: inherit;
      }
    }
    .bg-layer {
      position: relative;
      height: 100%;
      background: @color-background;
    }
    .list {
      position: fixed;
      top: 0;
      bottom: 0;
      width: 100%;
      background: @color-background;
    }
  }
</style>
