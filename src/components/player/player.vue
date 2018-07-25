<template>
  <div class="player" v-show="playlist.length > 0">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.songImage">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="iconfont icon-houtui"></i>
          </div>
          <h1 class="title" v-html="currentSong.songname"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper">
              <div class="cd" :class="xuanzhuan">
                <img :src="currentSong.songImage" class="image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text" :key="index"
                   :class="{'current': currentLineNum ===index}"
                   v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.interval)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="iconfont" :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev"
                 class="iconfont icon-shangyishou-yuanshijituantubiao"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" class="iconfont" :class="playBtn"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next"
                 class="iconfont icon-xiayishou-yuanshijituantubiao"></i>
            </div>
            <div class="icon i-right">
              <i class="iconfont icon-shoucang" id="icon-shoucang"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="openFullScreen">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.songImage" :class="xuanzhuan">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.songname"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i @click.stop="togglePlaying" class="iconfont" :class="playIcon"></i>
        </div>
        <div class="control">
          <i class="iconfont icon-liebiao"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio" @canplay="ready" @error="error"
           @timeupdate="updateTime"
           @ended="playEnd"></audio>
  </div>
</template>
<script>
  import {shuffle} from 'commom/js/util'
  import {playMode} from 'commom/js/config'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import {mapGetters, mapMutations} from 'vuex'
  import {getVKey} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Lyric from 'lyric-parser'
  import Scroll from 'base/scroll/scroll'

  export default {
    data () {
      return {
        url: '',
        songReady: false,
        currentTime: 0,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: ''
      }
    },
    computed: {
      iconMode () {
        let mode
        if (this.mode === playMode.sequence) {
          mode = 'icon-shunxubofang'
        } else if (this.mode === playMode.loop) {
          mode = 'icon-danquxunhuan'
        } else if (this.mode === playMode.random) {
          mode = 'icon-suijibofang'
        } else {
          mode = 'icon-danquxunhuan'
        }
        return mode
      },
      percent () {
        return this.currentTime / this.currentSong.interval
      },
      xuanzhuan () {
        return this.playing ? 'play' : 'play pause'
      },
      playBtn () {
        return this.playing ? 'icon-zanting-yuanshijituantubiao' : 'icon-bofang-yuanshijituantubiao'
      },
      playIcon () {
        return this.playing ? 'icon-zanting' : 'icon-bofang'
      },
      disableCls () {
        return this.songReady ? '' : 'disable'
      },
      ...mapGetters([
        'fullScreen',
        'playlist',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'
      ])
    },
    created () {
      this.touch = {}
    },
    methods: {
      // 滑动切换cd和lyric
      middleTouchStart (e) {
        this.touch.initiated = true
        // 用来判断是否是一次移动
        this.touch.moved = false
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove (e) {
        if (!this.touch.initiated) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        if (!this.touch.moved) {
          this.touch.moved = true
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style['transitionDuration'] = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style['transitionDuration'] = 0
      },
      middleTouchEnd () {
        if (!this.touch.moved) {
          return
        }
        let offsetWidth
        let opacity
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            this.currentShow = 'cd'
            opacity = 1
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        const time = 300
        this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style['transitionDuration'] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style['transitionDuration'] = `${time}ms`
        this.touch.initiated = false
      },
      getLyric () {
        this.currentSong.getLyric().then((lyric) => {
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        }).catch(() => {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
      },
      // 播放歌词的回调函数
      handleLyric ({lineNum, txt}) {
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },
      // 播放结束
      playEnd () {
        if (this.mode === playMode.loop) {
          setTimeout(() => {
            this.loop()
          }, 500)
        } else {
          setTimeout(() => {
            this.next()
          }, 500)
        }
      },
      // 循环播放
      loop () {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      // 改变播放模式
      changeMode () {
        let mode = this.mode + 1
        if (mode > 2) {
          mode = 0
        }
        this.setPlayingMode(mode)
        let list = null
        if (mode === playMode.random) {
          // 教程存在 this.currentSong.url 改变当前正在播放的歌曲的问题， 我的并没有。因为我的url是独立获取的。
          console.log(this.currentIndex)
          list = shuffle(this.sequenceList)
        } else {
          list = this.sequenceList
        }
        this.resetCurrentIndex(list)
        this.setPlayList(list)
        console.log(this.currentIndex)
      },
      resetCurrentIndex (list) {
        let index = list.findIndex((item) => {
          return item.songid === this.currentSong.songid
        })
        this.setCurrentIndex(index)
      },
      // 进度条拖动播放
      onProgressBarChange (percent) {
        console.log('拖动播放')
        const currentTime = this.currentSong.interval * percent
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.togglePlaying()
        }
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      // 格式化时间
      pad (num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      // 转换时间
      format (interval) {
        interval = interval | 0
        const minute = interval / 60 | 0
        const second = this.pad(interval % 60)
        return `${minute}:${second}`
      },
      // 实时改变
      updateTime (e) {
        this.currentTime = e.target.currentTime
      },
      ready () {
        this.songReady = true
      },
      error () {
        this.songReady = true
      },
      // 上一首
      prev () {
        if (!this.songReady) {
          return
        }
        if (this.playlist.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex - 1
          if (index === -1) {
            index = this.playlist.length - 1
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.songReady = false
      },
      // 下一首
      next () {
        if (!this.songReady) {
          return
        }
        if (this.playlist.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex + 1
          if (index === this.playlist.length) {
            index = 0
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.songReady = false
      },
      back () {
        this.setFullScreen(false)
      },
      openFullScreen () {
        this.setFullScreen(true)
      },
      togglePlaying () {
        if (!this.songReady) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
        this.setPlayingState(!this.playing)
      },
      getSongUrl (item) {
        this.url = `http://dl.stream.qqmusic.qq.com/${item.filename}?vkey=${item.vkey}&guid=3185011594&uin=0&fromtag=66`
      },
      _getVkey (mid) {
        getVKey(mid).then((res) => {
          if (res.code === ERR_OK) {
            this.getSongUrl(res.data.items[0])
          }
        })
      },
      ...mapMutations({
        'setFullScreen': 'SET_FULL_SCREEN',
        'setPlayingState': 'SET_PLAYING_STATE',
        'setCurrentIndex': 'SET_CURRENT_INDEX',
        'setPlayingMode': 'SET_PLAY_MODE',
        'setPlayList': 'SET_PLAYLIST'
      })
    },
    watch: {
      currentSong (newSong, oldSong) {
        if (!newSong.songid) {
          return
        }
        if (newSong.songid === oldSong.songid) {
          return
        }
        // console.log('getvkey2')
        // console.log(newSong)
        this._getVkey(newSong.songmid)
      },
      playing (newPlaying) {
        // console.log('newPlaying' + newPlaying)
        const audio = this.$refs.audio
        if (newPlaying) {
          audio.play()
        } else {
          audio.pause()
        }
      },
      url (newURL) {
        if (!newURL) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.stop()
        }
        this.$refs.audio.src = newURL
        this.$nextTick(() => {
          console.log('播放音乐')
          this.$refs.audio.play()
          this.getLyric()
        })
      }
    },
    components: {
      ProgressBar,
      Scroll
    }
  }
</script>

<style scoped lang="less">
  @import "../../commom/style/variable";

  .player {
    .normal-player {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: #333;
      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
      }
      .top {
        position: relative;
        margin-bottom: 25px;
        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
          .icon-houtui {
            display: block;
            padding: 9px;
            font-size: @font-size-large-x;
            color: @color-text-ll;
            transform: rotate(-90deg);
          }
        }
        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: @font-size-large;
          color: @color-text
        }
        .subtitle {
          line-height: 20px;
          text-align: center;
          font-size: @font-size-medium;
          color: @color-text;
        }
      }
      .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            height: 100%;
            .cd {
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border: 10px solid rgba(255, 255, 255, 0.1);
              border-radius: 50%;
              &.play {
                animation: rotate 20s linear infinite;
              }
              &.pause {
                animation-play-state: paused
              }
              .image {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
          }
          .playing-lyric-wrapper {
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: @font-size-medium;
              color: @color-text;
            }
          }
        }
        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text {
              line-height: 32px;
              color: @color-text-l;
              font-size: @font-size-medium;
              &.current {
                color: @color-text;
              }
            }
          }
        }
      }
      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: @color-text-l;
            &.active {
              width: 20px;
              border-radius: 5px;
              background: @color-text-ll;
            }
          }
        }
        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0 auto;
          padding: 10px 0;
          .time {
            color: @color-text;
            font-size: @font-size-small;
            flex: 0 0 30px;
            line-height: 30px;
            width: 30px;
            &.time-l {
              text-align: left
            }
            &.time-r {
              text-align: right
            }
          }
          .progress-bar-wrapper {
            flex: 1
          }
        }
        .operators {
          display: flex;
          align-items: center;
          .icon {
            flex: 1;
            color: @color-text-ll;
            &.disable {
              color: @color-text-ll;
            }
            i {
              font-size: 30px;
            }
          }
          .i-left {
            text-align: right;
          }
          .i-center {
            padding: 0 20px;
            text-align: center;
            i {
              font-size: 40px;
            }
          }
          .i-right {
            text-align: left
          }
          #icon-shoucang {
            font-size: 26px
          }
        }
      }
      &.normal-enter-active, &.normal-leave-active {
        transition: all .6s;
        .top, .bottom {
          transition: all .6s linear
        }
      }
      &.normal-enter, &.normal-leave-to {
        opacity: 0;
        .top {
          transform: translate3d(0, -50px, 0);
        }
        .bottom {
          transform: translate3d(0, 100px, 0);
        }
      }
    }
    .mini-player {
      display: flex;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 180;
      width: 100%;
      height: 60px;
      background: #fff;
      box-shadow: -5px 0 5px #dedede;
      &.mini-enter-active, .mini-leave-active {
        transition: all .4s;
      }
      &.mini-enter, &.mini-leave-to {
        opacity: 0;
      }
      .icon {
        flex: 0 0 40px;
        width: 40px;
        padding: 0 10px 0 20px;
        img {
          border-radius: 50%;
          &.play {
            animation: rotate 10s linear infinite;
          }
          &.pause {
            animation-play-state: paused;
          }
        }
      }
      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name {
          margin-bottom: 2px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: @font-size-medium;
          color: @color-text-black;
        }
        .desc {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: @font-size-small;
          color: @color-theme;
        }
      }
      .control {
        flex: 0 0 30px;
        width: 30px;
        padding: 0 10px;
        .icon-bofang, .icon-zanting, .icon-liebiao {
          font-size: 30px;
          color: @color-theme;
        }
        .icon-mini {
          font-size: 32px;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0)
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
