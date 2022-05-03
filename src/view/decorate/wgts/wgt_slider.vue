<style lang="scss" src="./wgt_slider.scss"></style>
<template>
  <div class="wgt-slider">
    <div class="wgt-hd">
      <span class="title">{{ value.title }}</span>
      <span class="sub-title">{{ value.subtitle }}</span>
    </div>
    <div class="wgt-bd">
      <el-carousel
        class="sliderimg"
        arrow="never"
        height="375px"
        indicator-position="none"
        :interval="100000"
      >
        <el-carousel-item
          v-for="(item, index) in [1, 2, 3]"
          :key="index"
          class="slider-item"
        >
          <SpImage />
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WgtSlider',
  wgtName: '轮播',
  wgtIcon: 'icon-slider',
  config: {
    name: 'slider',
    base: [
      { title: '标题', key: 'title', type: 'text', value: '标题' },
      { title: '副标题', key: 'subtitle', type: 'text', value: '副标题' },
      {
        title: '组件间距',
        key: 'padded',
        type: 'radio-group',
        value: true,
        option: [
          { label: '宽', value: true },
          { label: '窄', value: false }
        ]
      }
    ],
    config: [
      { title: '轮播时间', key: 'interval', type: 'text', value: '3000' },
      {
        title: '图片圆角',
        key: 'rounded',
        type: 'radio-group',
        value: true,
        option: [
          { label: '是', value: true },
          { label: '否', value: false }
        ]
      },
      {
        title: '图片间隔',
        key: 'rounded',
        type: 'radio-group',
        value: true,
        option: [
          { label: '有', value: true },
          { label: '无', value: false }
        ]
      },
      {
        title: '指示点样式',
        key: 'rounded',
        type: 'radio-group',
        value: true,
        option: [
          { label: '数字', value: true },
          { label: '点', value: false }
        ]
      },
      {
        title: '指示点覆盖',
        key: 'rounded',
        type: 'radio-group',
        value: true,
        option: [
          { label: '是', value: true },
          { label: '否', value: false }
        ]
      },
      {
        title: '指示点位置',
        key: 'rounded',
        type: 'radio-group',
        value: 'right',
        option: [
          { label: '居左', value: 'left' },
          { label: '居中', value: 'center' },
          { label: '居右', value: 'right' }
        ]
      },
      {
        title: '指示点形状',
        key: 'rounded',
        type: 'radio-group',
        value: true,
        option: [
          { label: '圆形', value: true },
          { label: '长方形', value: false }
        ]
      },
      {
        title: '指示点颜色',
        key: 'rounded',
        type: 'radio-group',
        value: true,
        option: [
          { label: '深色', value: true },
          { label: '亮色', value: false }
        ]
      }
    ],
    // config: {
    //   current: 0,
    //   interval: 3000,
    //   spacing: 0,
    //   dot: 'true', // 是否显示导航
    //   dotLocation: 'right', // 导航位置
    //   dotColor: 'dark', // 导航颜色
    //   shape: 'circle', // 导航形状 circle rectangle dot-size-switch
    //   numNavShape: 'rect', // 'circle' 'rectangle' 数字导航的形状
    //   dotCover: true, // 导航是否覆盖轮播
    //   rounded: false, // 轮播是否有圆角
    //   padded: false, // 轮播的内间距
    //   content: true
    // },
    data: []
  },
  props: {
    value: [Object, Array]
  },
  created () {},
  methods: {}
}
</script>
