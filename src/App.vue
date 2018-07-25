<template>
  <div id="app">
    <div class="tabs-wrapper" ref="tabsWrapper">
      <tabs></tabs>
      <div class="search-box-wrapper">
        <searchbox @enterSearch="enterSearch" @leaveSearch="leaveSearch"></searchbox>
      </div>
    </div>
    <div class="routerView-wrapper">
      <keep-alive>
        <router-view ref="view"></router-view>
      </keep-alive>
    </div>
    <player></player>
  </div>
</template>
<script>
  import Player from '@/components/player/player'
  import Tabs from '@/components/tabs/tabs'
  import Searchbox from 'base/search-box/search-box'
  import {mapMutations} from 'vuex'
  export default {
    data () {
      return {
        searching: false,
        query: ''
      }
    },
    name: 'App',
    methods: {
      enterSearch () {
        this.searching = true
        setTimeout(() => {
          this.$refs.tabsWrapper.style['transform'] = `translate3d(0, ${-44}px, 0)`
          this.$refs.view.$el.style['top'] = '56px'
        }, 200)
      },
      leaveSearch () {
        this.$refs.tabsWrapper.style['transform'] = ''
        this.$refs.view.$el.style['top'] = '90px'
        this.setQuery('') // 清空 state.query
        setTimeout(() => {
          this.searching = false
        }, 200)
      },
      ...mapMutations({
        'setQuery': 'SET_QUERY'
      })
    },
    components: {
      Tabs,
      Player,
      Searchbox
    }
  }
</script>

<style lang="less">
  .tabs-wrapper {
    transition: transform .3s;
    .search-box-wrapper {
      position: relative;
      padding: 0 5px;
      top: -18px;
    }
  }
</style>
