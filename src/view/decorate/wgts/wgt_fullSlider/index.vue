<style lang="scss" src="./index.scss"></style>
<template>
  <div :class="{
    'wgt-full-slider': true,
    'padded': value.padded,
  }" ref="fullSlider">
    <div v-if="refresh" class="wgt-bd" :class="{ 'spaced': value.spaced }" :style="setCarouselHeight">
      <!-- 固定位置的叠层 -->
      <el-carousel class="slider-container" arrow="never" direction="vertical" indicator-position="none" :interval="value.interval"
        @change="changeSlider" :autoplay="value.autoplay">
        <el-carousel-item v-for="(item, index) in value.data" :key="`carousel_${index}`">
          <div class="slider-item">
            <SpImage :src="item.imgUrl" fit="contain" v-if="!item.videoUrl || item.media_type !== 'video'"
              class="image-item-img" />
            <video :ref="`swiperVideo_${index}`" :poster="item.imgUrl" :src="item.videoUrl"
              v-if="item.media_type == 'video' && item.videoUrl" class="image-item-video"
              muted="muted" objectFit="cover">
              <source :src="item.videoUrl" />
            </video>
            <!-- <video-player
              v-if="item.media_type == 'video' && item.videoUrl"
              :options="{
                aspectRatio: '16:9',
                // aspectRatio: aspectRatio,
                sources: [
                  {
                    type: 'video/mp4',
                    src: item.videoUrl
                  }
                ],
                notSupportedMessage: '添加视频源',
                suppressNotSupportedError: true,
                controlBar: false
              }"
            /> -->
            <!-- :class="{
              'transparent-transition': currentIndex !== index,
              'transparent-transition-active': currentIndex == index
            }"  -->
            <SpImage :src="item.overlay" class="overlay-item" fit="contain" v-if="item.overlay"
              :style='overlayStyle(item, index)' />
          </div>

          <!-- <div>{{ value.indicatorText }}</div> -->
          <div v-for="(item, index) in value.data" :key="`overlay_${index}`" class='overlay-content'
            v-if="item.overlay" :style='overlayStyle(item, index)'>
            <SpImage :class="{
              'transparent-transition': currentIndex !== index,
              'transparent-transition-active': currentIndex == index
            }" :src="item.overlay" class="over-lay" fit="contain" />
          </div>
        </el-carousel-item>
      </el-carousel>
      </div>
    <div class="indicator-item" :style="`bottom: ${value.dotbottom}px;color: ${value.indicatorColor};font-size: ${value.indicatorFontSize}px`">
      <div>
        <span :style="`font-size: ${value.indicatorFontSize + 2}px`">{{ value.data.length < 10 ? '0' + (currentIndex + 1) : currentIndex + 1 }}</span>
        <span> / </span>
        <span>{{ value.data.length < 10 ? '0' + value.data.length : value.data.length }}</span>
      </div>
      <div>{{ value.indicatorText }}</div>
    </div>
  </div>
</template>

<script>
import config from './config'

export default {
  name: 'FullSlider',
  wgtName: '整屏滑动',
  wgtDesc: '',
  wgtIcon: 'wgt-full-slider',
  wgtType: 1,
  wgtTem: 1, //0代表微信和抖音小程序都可以配置,1代表只能配置微信
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {
      currentIndex: 0,
      h: '0px',
      refresh: true,
      offsetWidth: 375
    }
  },
  created() { },
  mounted() {
    this.$nextTick(() => {
      const ref = this.$refs.fullSlider
      this.offsetWidth = ref.offsetWidth
    })
  },
  methods: {
    setLeft() {
      let left = null
      if (this.value.dotleft == 0) {
        return { left: '0px' }
      } else if (this.value.dotleft == 100) {
        return { right: '0px' }
      } else {
        return { left: this.value.dotleft + '%', transform: `translateX(-${this.value.dotleft}%)` }
      }
    },
    setBgColor(item, index) {
      if (item.isCustomSlider) {
        return { background: this.currentIndex >= index ? item.dot_cover : item.dot_noCover }
      } else {
        return { background: this.currentIndex >= index ? this.value.pilot.dot_cover : this.value.pilot.dot_noCover }
      }
    },
    setDefaultColor(item) {
      if (item.isCustomSlider) {
        return { background: item.dot_noCover }
      } else {
        return { background: this.value.pilot.dot_noCover }
      }
    },

    overlayStyle(item, index) {
      const { overlaybuttom, overlayLeft, overlayWidth } = item
      return {
        bottom: `${overlaybuttom}%`,
        left: `${overlayLeft}%`,
        width: `${overlayWidth}%`,
        transition: `opacity ${this.value.trans}s ease-in-out`
      }
    },
    changeSlider(e) {
      const preIndex = this.currentIndex
      const ref = `swiperVideo_${e}`
      const preref = `swiperVideo_${preIndex}`
      this.currentIndex = e
      if (this.value.data[preIndex].media_type == 'video' && this.value.data[preIndex].autoplay) {
        this.$refs[preref] && this.$refs[preref][0].pause()
        if (this.value.data[preIndex].interact == 'reset') {
          this.$refs[preref][0].currentTime = 0
        }
      }
      if (this.value.data[e].media_type == 'video') {
        this.value.data[e].autoplay ? this.$refs[ref] && this.$refs[ref][0].play() : this.$refs[ref] && this.$refs[ref][0].pause()
      }
    },
    setdotPosition() {
      return { ...this.setLeft(), bottom: `${this.value.dotbottom || 0}px` }
    }
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        this.refresh = false
        this.refresh = true
        if (newVal.data.length > 0) {
          if (newVal.data[0].media_type == 'video' && newVal.data[0].videoUrl && newVal.data[0].autoplay) {
            this.$nextTick(() => {
              this.$refs['swiperVideo_0'] && this.$refs['swiperVideo_0'][0].play()
            })
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    setCarouselHeight() {
      const h = this.value.height * this.offsetWidth / 375
      return { height: `${h}px` }
    }
  }
}
</script>
