<template>
  <transition name="rank">
    <div class="rank" ref="rank">
      <Scroll :data="topList" class="toplist" ref="toplist" :click="click">
        <ul>
          <li class="item" v-for="(item, index) in topList" :key="index" @click="selectItem(item)">
            <div class="icon">
              <img width="100" height="100" v-lazy="item.picUrl">
            </div>
            <ul class="songlist">
              <li class="song" v-for="(song, index) in item.songList" :key="index">
                <span>{{index + 1}}</span>
                <span>{{song.songname}}-{{song.singername}}</span>
              </li>
            </ul>
          </li>
        </ul>
        <div class="loading-container">
          <loading v-show="!topList.length"></loading>
        </div>
      </Scroll>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import {getTopList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {playlistMixin} from 'commom/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    mixins: [playlistMixin],
    data () {
      return {
        topList: [],
        click: true
      }
    },
    created () {
      this._getTopList()
    },
    methods: {
      selectItem (item) {
        this.$router.push({
          path: `/rank/${item.id}`
        })
        this.setTopList(item)
      },
      _getTopList () {
        getTopList().then((res) => {
          if (res.code === ERR_OK) {
            // console.log(res)
            this.topList = res.data.topList
          }
        })
      },
      handlePlaylist (playlist) {
        const bottom = playlist.length ? '60px' : ''
        this.$refs.rank.style.bottom = bottom
        this.$refs.toplist.refresh()
      },
      ...mapMutations({
        'setTopList': 'SET_TOP_LIST'
      })
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="less">
  @import "../../commom/style/variable";

  .rank {
    position: fixed;
    width: 100%;
    top: 90px;
    bottom: 0;
    background-color: @color-background-l;
    .toplist {
      height: 100%;
      overflow: hidden;
      .item {
        display: flex;
        margin: 0 20px;
        padding-top: 20px;
        height: 100px;
        &:last-child {
          padding-bottom: 20px;
        }
        .icon {
          flex: 0 0 100px;
          width: 100px;
          height: 100px;
        }
        .songlist {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 20px;
          height: 100px;
          overflow: hidden;
          background: @color-background;
          color: @color-text-black;
          font-size: @font-size-medium;
          .song {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            line-height: 26px;
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
  .rank-enter-active, .rank-leave-active {
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }
  .rank-enter, .rank-leave-to {
    opacity: 0;
  }
</style>
