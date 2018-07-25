<template>
  <transition name="search">
    <div class="search">
      <search-result v-show="query"></search-result>
      <div class="shortcut-wrapper" v-show="!query">
        <div class="shortcut">
          <div class="hot-key">
            <div class="title">热门搜索</div>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="(item, index) in hotKey" :key="index">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import SearchBox from 'base/search-box/search-box'
  import {getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {mapMutations, mapGetters} from 'vuex'
  import SearchResult from '@/components/search-result/search-result'

  export default {
    data () {
      return {
        hotKey: []
      }
    },
    created () {
      this._getHotKey()
    },
    methods: {
      // 设置 state.query
      addQuery (query) {
        this.setQuery(query)
      },
      _getHotKey () {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
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
    components: {
      SearchBox,
      SearchResult
    }
  }
</script>

<style scoped lang="less">
  @import "../../commom/style/variable";

  .search {
    position: fixed;
    width: 100%;
    top: 90px;
    bottom: 0;
    transition: transform .2s, top .2s;
    .shortcut-wrapper {
      .shortcut {
        height: 100%;
        overflow: hidden;
        .hot-key {
          margin: 0 20px 20px 20px;
          .title {
            margin-bottom: 20px;
            font-size: @font-size-medium-x;
            color: @color-text-black-d;
          }
          .item {
            display: inline-block;
            padding: 8px 10px;
            margin: 0 14px 10px 0;
            border-radius: 20px;
            background: @color-background-l;
            font-size: @font-size-medium;
            color: @color-text-black;
            border: 1px solid @color-text-black-d;
          }
        }
      }
    }
  }

  .search-enter-active, .search-leave-active {
    transition: all .3s;
  }

  .search-enter, .search-leave-to {
    opacity: 0;
  }
</style>
