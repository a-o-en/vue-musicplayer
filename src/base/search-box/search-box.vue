<template>
  <div class="search-box-wrapper">
    <i @click="leaveSearch" class="iconfont icon-houtui icon" ref="houtui"></i>
    <div class="search-box" ref="searchBox" @click="onSearch">
      <div class="placeholder" v-show="!searching">
        <i class="iconfont icon-sousuo icon"></i>
        <div class="text">搜索</div>
      </div>
      <input type="text" ref="query" v-model="inputQuery" class="box" :placeholder="placeholder">
      <i @click="clear" v-show="inputQuery" class="iconfont icon-shachu-xue icon"></i>
    </div>
  </div>
</template>

<script>
  import {debounce} from 'commom/js/util'
  import {mapMutations, mapGetters} from 'vuex'

  export default {
    data () {
      return {
        inputQuery: '',
        placeholder: '',
        searching: false
      }
    },
    methods: {
      onSearch () {
        this.placeholder = '搜索歌曲、歌手'
        this.$refs.query.style['background'] = '#31c27c'
        this.searching = true
        this.$emit('enterSearch')
        this.$refs.houtui.style['width'] = '24px'
        this.$router.push({
          path: '/search'
        })
      },
      leaveSearch () {
        this.placeholder = ''
        this.searching = false
        this.$emit('leaveSearch')
        this.$refs.query.style['background-color'] = '#2faf72'
        this.$refs.houtui.style['width'] = '0'
        this.clear()
        setTimeout(() => {
          this.$router.back()
        }, 200)
      },
      clear () {
        this.inputQuery = ''
      },
      ...mapMutations({
        'setQuery': 'SET_QUERY'
      })
    },
    computed: {
      ...mapGetters([
        'query'
      ])
    },
    created () {
      this.$watch('inputQuery', debounce((newQuery) => {
        this.setQuery(newQuery)
      }, 300))
    },
    watch: {
      query (newQuery, oldQuery) {
        if (newQuery.length > 0 && newQuery !== oldQuery) {
          this.inputQuery = this.query
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../commom/style/variable";

  .search-box-wrapper {
    display: flex;
    align-items: center;
    .icon-houtui {
      box-sizing: border-box;
      width: 0;
      color: @color-text-ll;
      overflow: hidden;
      transition: width .3s;
    }
    .search-box {
      display: flex;
      flex: 1;
      box-sizing: border-box;
      height: 26px;
      align-items: center;
      background: @color-theme;
      position: relative;
      .placeholder {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        .text {
          display: inline-block;
          color: @color-text-ll;
          font-size: @font-size-medium;
        }
      }
      .icon {
        color: @color-text-ll;
      }
      .icon-search {
        font-size: 24px;
        color: @color-background;
      }
      .box {
        flex: 1;
        margin: 0 2px;
        line-height: 24px;
        background: @color-theme-search;
        color: @color-text;
        font-size: @font-size-medium;
        outline: none;
        box-sizing: border-box;
        -webkit-appearance: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        transition: background .3s;
        &::placeholder {
          color: @color-text-ll;
        }
        .icon-dismiss {
          font-size: 16px;
          color: @color-background;
        }
      }
      .cancel {
        height: 24px;
        line-height: 24px;
        font-size: @font-size-medium;
        color: @color-text;
      }
    }
    .cancel {
      flex: 0 0 40px;
      width: 40px;
      text-align: center;
      height: 24px;
      line-height: 24px;
      color: @color-text;
    }
  }

</style>
