<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'

  export default {
    data () {
      return {}
    },
    props: {
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
      // 上啦
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
      // console.log('输出pullup' + this.pullup)
    },
    mounted () {
      this.$nextTick(() => {
        this._initScroll()
      })
    },
    methods: {
      _initScroll () {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })

        if (this.listenScroll) {
          let me = this
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos)
          })
        }
        // 监听scrollEnd
        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            // console.log(this.scroll.y)
            // console.log(this.scroll.maxScrollY)
            let me = this
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              me.$emit('scrollToEnd')
            }
          })
        }
      },
      // 代理 better-scroll 的方法
      enable () {
        this.scroll && this.scroll.enable()
      },
      disbale () {
        this.scroll && this.scroll.disable()
      },
      refresh () {
        this.scroll && this.scroll.refresh()
      },
      scrollTo () {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement () {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      data () {
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      }
    }
  }
</script>

<style>
</style>
