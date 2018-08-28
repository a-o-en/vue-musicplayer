<template>
  <div class="search-list" v-show="searches.length">
    <ul>
      <li :key="item" class="search-item" v-for="item in searches" @click="selectItem(item)">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="iconfont icon-shachu-xue"></i>
        </span>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    props: {
      searches: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    created () {
      console.log(this.searches)
    },
    methods: {
      selectItem (item) {
        this.$emit('select', item)
      },
      deleteOne (item) {
        this.$emit('delete', item)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../commom/style/variable";

  .search-list {
    .search-item {
      display: flex;
      align-items: center;
      height: 40px;
      overflow: hidden;
      &.list-enter-active, &.list-leave-active {
        transition: all 0.1s;
      }
      &.list-enter, &.list-leave-to {
        height: 0
      }
      .text {
        flex: 1;
        color: #000
      }
      .icon {
        position: relative;
        &:before {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
        }
        .icon-delete {
          font-size: @font-size-small;
          color: @color-text-d;
        }
      }

    }
  }

</style>
