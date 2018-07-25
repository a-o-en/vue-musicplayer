<template>
  <div class="slider" ref="sliderh">
    <div class="tags-wrapper" ref="tagWrapper">
      <div class="tags" v-for="(item, index) in data" :key="index">
        <div class="fl">
          <a @click="selectTags" :class="{'select': tagIndex === index}" href="javascript:;"
            :index="index" :id="item.id">{{item.name}}</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  import {setStyle} from 'commom/js/dom'
  import {mapMutations} from 'vuex'

  export default {
    data () {
      return {
        tagIndex: 0,
        kind: ['index', 'area', 'sex', 'genre']
      }
    },
    props: {
      code: {
        type: Number,
        required: true
      },
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: false
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default: null
      },
      pullup: {
        type: Boolean,
        default: false
      },
      beforeScroll: {
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      }
    },
    created () {
    },
    mounted () {
      this._initWidth()
      this._initHScroll()
    },
    methods: {
      selectTags (e) {
        // console.log('scrollH') 发送了两次的调试
        // console.log(e) 用vue怎么获取 dom的 属性
        let id = parseInt(e.target.getAttribute('id'))
        this.tagIndex = parseInt(e.target.getAttribute('index'))
        console.log(id)
        this.setKinds({
          'index': this.code,
          'id': id
        })
        this.$emit('searchSinger')
        e.preventDefault()
      },
      _initWidth () {
        this.children = this.$refs.tagWrapper.children
        let child = this.children
        let width = 0
        // let childrenWidth = 0
        for (let i = 0; i < child.length; i++) {
          width += child[i].clientWidth
        }
        width += 10
        setStyle(this.$refs.tagWrapper, {
          width: width + 'px'
        })
      },
      _initHScroll () {
        this.scroll = new BScroll(this.$refs.sliderh, {
          scrollX: true,
          scrollY: false,
          click: true
        })
      },
      ...mapMutations({ // 映射
        setKinds: 'SET_KINDS'
      })
    }
  }
</script>

<style scoped lang="less">
  @import "../../commom/style/variable";

  .slider {
    min-height: 1px;
    width: 100%;
    overflow: hidden;
    padding: 10px 0 10px 0;
    box-sizing: border-box;
    background-color: #f4f4f4;
    border-bottom: solid 1px #dedede;
    .tags-wrapper {
      padding-left: 15px;
      &::after {
        content: '';
        display: block;
        clear: both;
      }
      .tags {
        float: left;
        box-sizing: border-box;
        .fl {
          margin-right: 12px;
          a {
            display: block;
            padding: 2px 8px;
            text-decoration: none;
            cursor: pointer;
            font-size: @font-size-medium;
            &.select {
              color: @color-theme;
            }
          }
        }
      }
    }
  }

</style>
