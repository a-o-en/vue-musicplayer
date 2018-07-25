<template>
  <transition name="slide">
    <musicList :title="title" :bg-image="bgImage" :songs="songs" :rank="rank"></musicList>
  </transition>
</template>
<script>
  import MusicList from '@/components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {ERR_OK} from 'api/config'
  import {getMusicList} from 'api/rank'
  import {createSong} from 'commom/js/song'

  export default {
    data () {
      return {
        songs: [],
        rank: true
      }
    },
    created () {
      this._getMusicList()
    },
    methods: {
      _getMusicList () {
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }
        getMusicList(this.topList.id).then((res) => {
          if (res.code === ERR_OK) {
            // console.log(res)
            this.songs = this._normalizeSongs(res.songlist)
          }
        })
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((item) => {
          const musicData = item.data
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    computed: {
      title () {
        return this.topList.topTitle
      },
      bgImage () {
        if (this.songs.length) {
          // console.log(this.songs)
          return this.songs[0].songImage
        }
        return ''
      },
      ...mapGetters([
        'topList'
      ])
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="less">
  .slide-enter-active, .slide-leave-active {
    transition: all .6s ease
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0)
  }
</style>
