<template>
  <div class="loading">
    <img src="./loading.gif">
    <p>正在加载中</p>
  </div>
</template>
<script>
  export default {
    name: 'loading',
    data () {
      return {}
    }
  }
</script>

<style scoped lang="less">
  @import "../../commom/style/variable";
  .loading {
    width: 100%;
    text-align: center;
    img{
      width: 24px;
      height: 24px;
    }
    p{
      line-height: 20px;
      font-size: @font-size-small;
      color: @color-text-l
    }
  }
</style>
