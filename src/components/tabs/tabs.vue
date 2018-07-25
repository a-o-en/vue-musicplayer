<template>
  <div class="tab-wrapper">
    <div class="tab">
      <router-link tag="div" class="tab-item" :class="{'link-active': index===0}" to="/singer">
        <span class="tab-link" @click="handle(0)">歌手</span>
      </router-link>
      <router-link tag="div" class="tab-item" :class="{'link-active': index===1}" to="/recommend">
        <span class="tab-link" @click="handle(1)">推荐</span>
      </router-link>
      <router-link tag="div" class="tab-item" :class="{'link-active': index===2}" to="/rank">
        <span class="tab-link" @click="handle(2)">排行</span>
      </router-link>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        index: 1
      }
    },
    methods: {
      handle (index) {
        this.index = index
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../commom/style/variable.less";

  .tab-wrapper {
    background: @color-theme;
    padding-bottom: 36px;
    .tab {
      display: flex;
      width: 60%;
      margin: 0 auto;
      height: 54px;
      line-height: 54px;
      .tab-item {
        flex: 1;
        text-align: center;
        font-size: @font-size-large;
        .tab-link {
          padding-bottom: 5px;
          color: @color-text-ll
        }
        &.link-active {
          .tab-link {
            color: @color-text;
            border-bottom: 2px solid @color-theme;
            font-size: @font-size-large-x;
          }
        }
      }
    }
  }
</style>
