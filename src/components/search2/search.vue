<template>
  <transition name="search">
    <div class="search">
      <search-result v-show="query" @select="saveSearch"></search-result>
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
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="deleteAll">
                <i class="iconfont icon-delete"></i>
              </span>
            </h1>
            <search-list
              :searches="searchHistory"
              @select="addQuery"
              @delete="deleteOne"
            >

            </search-list>
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
  import {mapMutations, mapGetters, mapActions} from 'vuex'
  import SearchResult from '@/components/search-result/search-result'
  import SearchList from 'base/search-list/search-list'

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
      saveSearch () {
        this.saveSearchHistory(this.query)
      },
      deleteOne (item) {
        this.deleteSearchHistory(item)
      },
      deleteAll () {
        this.clearSearchHistory()
      },
      ...mapMutations({
        'setQuery': 'SET_QUERY'
      }),
      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory',
        'clearSearchHistory',
        'searching'
      ])
    },
    computed: {
      ...mapGetters([
        'query',
        'searchHistory'
      ])
    },
    components: {
      SearchBox,
      SearchResult,
      SearchList
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
        .search-history {
          padding: 0 20px;
          .title {
            padding-bottom: 20px;
            display: flex;
            font-size: @font-size-medium-x;
            color: @color-text-black-d;
          }
          .text {
            flex: 1;
          }
          .clear {
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
