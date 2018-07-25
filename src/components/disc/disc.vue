<template>
  <transition name="slide">
    <musicList :title="title" :bgImage="bgImage" :songs="songs"></musicList>
  </transition>
</template>
<script>
  import MusicList from '@/components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getDiscSongList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'commom/js/song'

  export default {
    data () {
      return {
        songs: []
      }
    },
    created () {
      this._getSongList()
    },
    methods: {
      _getSongList () {
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
          return
        }
        getDiscSongList(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            console.log(res)
            this.songs = this._normalizeSongs(res.cdlist[0].songlist)
          }
        })
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    computed: {
      title () {
        return this.disc.dissname
      },
      bgImage () {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="less">
  .slide-enter-active, .slide-leave-active {
    transition: all .6s
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0)
  }
</style>
