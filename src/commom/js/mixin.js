import {mapGetters} from 'vuex'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted () {
    this.handlePlaylist(this.playlist)
  },
  activated () {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist (newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    // 外部定义， 外部覆盖，如果没有定义，则抛出错误。
    handlePlaylist () {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}
