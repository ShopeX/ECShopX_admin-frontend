<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" src="./index.scss"></style>
<template>
  <div
    :class="{
      'wgt-slider': true
    }"
    :style="outerStyle"
  >
    <div
      ref="sliderWrap"
      class="wgt-bd"
      :class="{
        spaced: value.spaced
      }"
      :style="bdStyle"
    >
      <!-- 第一屏为图片时用占位图撑开高度并测量；使用 el-image 以正确触发 @load，换图后能拿到新图尺寸 -->
      <el-image
        v-if="!isFirstVideo"
        class="placeholder-item"
        :src="value.data.length > 0 ? value.data[0].imgUrl : ''"
        fit="contain"
        @load="onPlaceholderImageLoad"
      />
      <template v-else>
        <!-- 视频第一屏：占位撑开 9:16 高度 -->
        <div class="placeholder-item placeholder-video-ratio" />
      </template>
      <!-- <img class="placeholder-item" style="display: block;" :src="value.data.length > 0 ? value.data[0].imgUrl : null" width="100%" /> -->
      <el-carousel
        class="slider-container"
        arrow="never"
        indicator-position="none"
        :interval="value.interval"
        :autoplay="value.autoplay"
        @change="changeSlider"
      >
        <el-carousel-item
          v-for="(item, index) in value.data"
          :key="index"
          class="slider-item"
          :class="{
            rounded: value.rounded
          }"
        >
          <div class="slider-item-content">
            <SpImage
              :src="item.imgUrl"
              fit="contain"
              v-if="!item.videoUrl || item.media_type !== 'video'"
              class="image-item-img"
            />
            <video
              :ref="`swiperVideo_${index}`"
              :poster="item.imgUrl"
              :src="item.videoUrl"
              v-if="item.media_type == 'video' && item.videoUrl"
              class="image-item-video"
              muted="muted"
              objectFit="cover"
            >
              <source :src="item.videoUrl" />
            </video>
            <SpImage
              :src="item.overlay"
              class="overlay-item"
              fit="contain"
              v-if="item.overlay"
              :style="overlayStyle(item, index)"
            />
          </div>
          <!-- 叠层内容区域（用于热区交互） -->
          <div v-if="item.overlay" class="overlay-content" :style="overlayStyle(item, index)">
            <SpImage
              :class="{
                'transparent-transition': currentIndex !== index,
                'transparent-transition-active': currentIndex == index
              }"
              :src="item.overlay"
              class="over-lay"
              fit="contain"
            />
          </div>
        </el-carousel-item>
      </el-carousel>
      <div
        :class="[
          'slider-pagination',
          value.dotLocation,
          value.shape,
          value.dotColor,
          {
            cover: value.dotCover
          }
        ]"
      >
        <template v-if="value.dot">
          <div
            v-for="(item, index) in value.data.length > 0 ? value.data : [1]"
            :key="`dot-item__${index}`"
            :class="['dot-item', { active: currentIndex == index }]"
          />
        </template>
        <template v-else>
          <div class="pagination-count">
            {{ `${currentIndex + 1}/${value.data.length > 0 ? value.data.length : 1}` }}
          </div>
        </template>
      </div>
      <!-- 挂件自定义部分 -->
    </div>
  </div>
</template>

<script>
import config from './config'
import { getOuterStyle } from '../../comps/style-utils'
export default {
  name: 'Slider',
  wgtName: '轮播',
  wgtDesc: '',
  wgtIcon: 'multi-picture-carousel',
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  computed: {
    outerStyle() {
      return getOuterStyle(this.value)
    },
    /** 第一屏是否为视频 */
    isFirstVideo() {
      const first = this.value?.data?.[0]
      return !!(first?.media_type === 'video' && first?.videoUrl)
    },
    /** 第一屏为视频时固定 9:16 比例的高度（宽 375） */
    firstScreenVideoHeight() {
      return Math.round((375 * 16) / 9)
    },
    /** 第一屏为视频时给 .wgt-bd 固定高度，保证 9:16 比例 */
    bdStyle() {
      if (!this.isFirstVideo) return {}
      return { minHeight: `${this.firstScreenVideoHeight}px` }
    }
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        if (newVal.data.length > 0) {
          if (
            newVal.data[0].media_type == 'video' &&
            newVal.data[0].videoUrl &&
            newVal.data[0].autoplay
          ) {
            this.$nextTick(() => {
              this.$refs['swiperVideo_0'] && this.$refs['swiperVideo_0'][0].play()
            })
          }
        }
      },
      deep: true,
      immediate: true
    },
    isFirstVideo() {
      this.measureFirstScreenHeight()
    }
  },
  created() {},
  mounted() {
    this.measureFirstScreenHeight()
  },
  updated() {
    this.$nextTick(this.measureFirstScreenHeight)
  },
  methods: {
    /** 占位图加载完成：用图片真实宽高计算第一屏高度，换图后能拿到准确高度 */
    onPlaceholderImageLoad(e) {
      if (!this.value || this.isFirstVideo) return
      const img = e?.target
      if (!img || !img.naturalWidth || !img.naturalHeight) {
        this.measureFirstScreenHeight()
        return
      }
      const outer = this.value.outerMargin || {}
      const paddedt = Number(outer.paddedt) || 0
      const paddedb = Number(outer.paddedb) || 0
      const contentHeight = Math.round((375 * img.naturalHeight) / img.naturalWidth)
      const totalHeight = contentHeight + paddedt + paddedb
      this.$set(this.value, 'firstScreenWidth', 375)
      this.$set(this.value, 'firstScreenHeight', totalHeight)
    },
    /** 测量第一屏高度并写入 value，宽固定 375；高度 = 内容高 + 上边距(paddedt) + 下边距(paddedb)；第一屏为视频时内容高按 9:16 计算；第一屏为图时仅在有有效高度或视频时更新，避免换图瞬间被旧高覆盖 */
    measureFirstScreenHeight() {
      this.$nextTick(() => {
        if (!this.value) return
        const outer = this.value.outerMargin || {}
        const paddedt = Number(outer.paddedt) || 0
        const paddedb = Number(outer.paddedb) || 0
        let contentHeight
        if (this.isFirstVideo) {
          contentHeight = this.firstScreenVideoHeight
        } else {
          const el = this.$refs.sliderWrap
          if (!el) return
          contentHeight = el.clientHeight || el.offsetHeight
          if (contentHeight <= 0) return
        }
        const totalHeight = contentHeight + paddedt + paddedb
        this.$set(this.value, 'firstScreenWidth', 375)
        this.$set(this.value, 'firstScreenHeight', totalHeight)
      })
    },
    overlayStyle(item, index) {
      const { overlaybuttom, overlayLeft, overlayWidth } = item
      return {
        bottom: `${overlaybuttom}%`,
        left: `${overlayLeft}%`,
        width: `${overlayWidth}%`
      }
    },
    changeSlider(e) {
      const preIndex = this.currentIndex
      const ref = `swiperVideo_${e}`
      const preref = `swiperVideo_${preIndex}`
      this.currentIndex = e
      if (
        this.value.data[preIndex] &&
        this.value.data[preIndex].media_type == 'video' &&
        this.value.data[preIndex].autoplay
      ) {
        this.$refs[preref] && this.$refs[preref][0].pause()
        if (this.value.data[preIndex].interact == 'reset') {
          this.$refs[preref][0].currentTime = 0
        }
      }
      if (this.value.data[e] && this.value.data[e].media_type == 'video') {
        this.value.data[e].autoplay
          ? this.$refs[ref] && this.$refs[ref][0].play()
          : this.$refs[ref] && this.$refs[ref][0].pause()
      }
    }
  }
}
</script>
