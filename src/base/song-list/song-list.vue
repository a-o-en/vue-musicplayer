<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song,index)"
          v-for="(song, index) in songs" :key="index" class="song">
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)">{{getRankText(index)}}</span>
        </div>
        <div class="song-content">
          <h2 class="name">{{song.songname}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    data () {
      return {}
    },
    props: {
      songs: {
        type: Array,
        default: null
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      selectItem (item, index) {
        this.$emit('select', item, index)
      },
      getDesc (song) {
        return `${song.singer} - ${song.songalbum}`
      },
      getRankCls (index) {
        if (index <= 2) {
          return `icon icon${index}`
        } else {
          return 'text'
        }
      },
      getRankText (index) {
        if (index > 2) {
          return index + 1
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../commom/style/variable";

  .song-list {
    padding: 20px 30px;
    background-color: @color-background-l;
    .song {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 64px;
      font-size: @font-size-medium;
      .rank {
        flex: 0 0 25px;
        width: 25px;
        margin-right: 30px;
        text-align: center;
        .icon {
          display: inline-block;
          width: 25px;
          height: 24px;
          background-size: 25px 24px;
          &.icon0 {
            background-image: url("first@3x.png")
          }
          &.icon1 {
            background-image: url("second@3x.png")
          }
          &.icon2 {
            background-image: url("third@3x.png")
          }
        }
        .text {
          color: #333;
          font-size: @font-size-large;
        }
      }
      .song-content {
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          color: @color-text-black;
        }
        .desc {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          color: @color-text-black-d;
        }
      }
    }
  }
</style>
