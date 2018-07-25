<template>
  <div class="progress-bar" ref="progressBar" @click.stop="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="touchStart"
           @touchmove.prevent="touchMove"
           @touchend="touchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
  const progressBtnWidth = 16
  export default {
    data () {
      return {
        touch: {}
      }
    },
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    methods: {
      progressClick (e) {
        this._offsetWidth(e.offsetX)
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent)
      },
      touchStart (e) {
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        this.touch.progressWidth = this.$refs.progress.clientWidth
      },
      touchMove (e) {
        if (!this.touch.initiated) {
          return
        }
        let width = e.touches[0].pageX - this.touch.startX
        let maxOffsetWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        let offsetWidth = Math.min(maxOffsetWidth, Math.max(0, this.touch.progressWidth + width))
        this._offsetWidth(offsetWidth)
      },
      touchEnd (e) {
        this.touch.initiated = false
        this._triggerPercent()
      },
      _triggerPercent () {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent)
      },
      _offsetWidth (offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style['transform'] = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.progressBtn.style['webkitTransform'] = `translate3d(${offsetWidth}px, 0, 0)`
      }
    },
    watch: {
      percent (newPercent) {
        if (newPercent >= 0 && !this.touch.initiated) {
          let barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          let offsetWidth = newPercent * barWidth
          this.$refs.progress.style.width = `${offsetWidth}px`
          this._offsetWidth(offsetWidth)
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../commom/style/variable";

  .progress-bar {
    height: 30px;
    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, .3);
      .progress {
        position: absolute;
        height: 100%;
        background: @color-theme;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid @color-text;
          border-radius: 50%;
          background: @color-theme
        }
      }
    }
  }
</style>
