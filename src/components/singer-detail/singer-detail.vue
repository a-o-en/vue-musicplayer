<template>
  <transition name="slider">
    <musicList :songs="songs" :title="title" :bgImage="bgImage"></musicList>
  </transition>
</template>
<script>
  import musicList from '@/components/music-list/music-list'
  import {createSong} from 'commom/js/song'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {mapGetters} from 'vuex'

  export default {
    data () {
      return {
        songs: []
      }
    },
    created () {
      // console.log(this.singer)
      // 根据vuex 里面的state 的 singer 属性， 如果存在，则在创建该组件时 执行this._getDetail()获取数据。
      this._getDetail(this.singer.singerMid)
    },
    methods: {
      _getDetail (id) {
        if (!this.singer.singerMid) {
          this.$router.push({
            path: '/singer'
          })
        }
        // 获取该歌手数据，初始化songs。
        getSingerDetail(id).then((res) => {
          if (res.code === ERR_OK) {
            // console.log(res)
            this.songs = this._normalizeSongs(res.data.list)
            // console.log(this.songs)
          }
        })
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((item, index) => {
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    computed: {
      title () {
        return this.singer.name
      },
      bgImage () {
        return this.singer.singerPic
      },
      ...mapGetters([
        'singer'
      ])
    },
    components: {
      musicList
    }
  }
</script>

<style scoped lang="less">
  @import "../../commom/style/variable";

  .singer-detail {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: @color-background;
  }

  .slider-enter-active, .slider-leave-active {
    transition: all 0.3s
  }

  .slider-enter, .slider-leave-to {
    transform: translate3d(100%, 0, 0)
  }
</style>
