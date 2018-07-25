<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(intm, index) in dots" :class="{ active: currentPageIndex === index }"
            :key="index"></span>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {addClass} from 'commom/js/dom'
  import BScroll from 'better-scroll'

  export default {
    name: 'slider',
    data () {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      },
      speed: {
        type: Number,
        default: 400
      },
      threshold: {
        type: Number,
        default: 0.3
      }
    },
    mounted () {
      this.$nextTick(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()

        if (this.autoPlay) {
          this._play()
        }
      })
      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }
        this._setSliderWidth(true)
        this.slider.refresh()
      })
    },
    activated () {
      if (this.autoPlay) {
        this._play()
      }
    },
    deactivated () {
      clearTimeout(this.timer)
    },
    beforeDestroyed () {
      clearTimeout(this.timer)
    },
    methods: {
      _setSliderWidth (isResize) {
        this.children = this.$refs.sliderGroup.children

        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        // console.log(sliderWidth)
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')

          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initSlider () {
        // 新的用法
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: this.threshold,
            speed: this.speed
          },
          bounce: false,
          stopPropagation: true,
          click: true
        })
        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX
          // console.log('scrollEnd-pageIndex' + pageIndex) 第一次输出为1， 说明新版这里改成以1为底的了
          // if (this.loop) {
          //   pageIndex -= 1
          // }
          this.currentPageIndex = pageIndex
          // console.log('this.currentPageIndex' + this.currentPageIndex) // 为什么第一次滑动结束之后会是0呢, 新版本修改了
          if (this.autoPlay) {
            this._play()
          }
        })

        this.slider.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer)
          }
        })
      },
      _play () {
        // let pageIndex = this.currentPageIndex + 1
        // if (this.loop) {
        //   pageIndex += 1
        // }
        // console.log('pageIndex' + pageIndex)
        // 这里我一开始用的 goToPage方法。 但是pageIndex一直是递增，而没有判断过界之后重新计算pageIndex。
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.slider.next(400)
        }, this.interval)
      },
      _initDots () {
        this.dots = new Array(this.children.length)
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../commom/style/variable";

  .slider {
    min-height: 1px;
    .slider-group {
      position: relative;
      white-space: nowrap;
      .slider-item {
        float: left;
        overflow: hidden;
        box-sizing: border-box;
        text-align: center;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        a {
          display: block;
          width: 100%;
          overflow: hidden;
          text-decoration: none;
          img {
            display: block;
            width: 100%;
          }
        }
      }
    }
    .dots {
      position: absolute;
      right: 0;
      left: 0;
      bottom: 12px;
      text-align: center;
      font-size: 0;
      .dot {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin: 0 4px;
        background-color: @color-text-l;
        &.active {
          width: 20px;
          border-radius: 5px;
          background-color: @color-text-ll;
        }
      }
    }
  }
</style>
