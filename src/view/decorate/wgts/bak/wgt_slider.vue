<style lang="scss" src="./wgt_slider.scss"></style>
<template>
  <div
    :class="{
      'wgt-slider': true,
      'padded': value.padded
    }"
  >
    <div class="wgt-hd">
      <span class="title">{{ value.title }}</span>
      <span class="sub-title">{{ value.subtitle }}</span>
    </div>
    <div
      class="wgt-bd"
      :class="{
        'spaced': value.spaced
      }"
    >
      <!-- {{JSON.stringify(value.data)}} -->
      <SpImage
        class="placeholder-item"
        :src="value.data.length > 1 ? value.data[0].url : null"
      />
      <el-carousel
        class="slider-container"
        arrow="never"
        indicator-position="none"
        :interval="value.interval"
        @change="
          (e) => {
            this.currentIndex = e
          }
        "
      >
        <el-carousel-item
          v-for="(item, index) in value.data.length > 0 ? value.data : [1]"
          :key="index"
          class="slider-item"
          :class="{
            'rounded': value.rounded
          }"
        >
          <SpImage
            :class="{
              'rounded': value.rounded
            }"
            :src="item.url"
          />
        </el-carousel-item>
      </el-carousel>
      <div :class="['slider-pagination', value.dotLocation, value.shape, value.dotColor, {}]">
        <template v-if="value.dot">
          <div class="dot-item">
            {{ `${currentIndex}/${value.data.length > 0 ? value.data.length : 1}` }}
          </div>
        </template>
        <template v-else>
          <div
            v-for="(item, index) in value.data.length > 0 ? value.data : [1]"
            :key="`pagination-item__${index}`"
            class="pagination-item"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WgtSlider',
  wgtName: '轮播',
  wgtIcon: 'wgt-slider',
  config: {
    name: 'slider',
    setting: [{ label: '标题', key: 'title', component: 'text', value: '' }]
    // base: [
    //   { title: '标题', key: 'title', type: 'text', value: '标题' },
    //   { title: '副标题', key: 'subtitle', type: 'text', value: '副标题' },
    //   {
    //     title: '组件间距',
    //     key: 'padded',
    //     type: 'radio-group',
    //     value: true,
    //     option: [
    //       { label: '宽', value: true },
    //       { label: '窄', value: false }
    //     ]
    //   }
    // ],
    // config: [
    //   { title: '轮播时间', key: 'interval', type: 'text', value: '3000' },
    //   {
    //     title: '图片圆角',
    //     key: 'rounded',
    //     type: 'radio-group',
    //     value: true,
    //     option: [
    //       { label: '是', value: true },
    //       { label: '否', value: false }
    //     ]
    //   },
    //   {
    //     title: '图片间隔',
    //     key: 'spaced',
    //     type: 'radio-group',
    //     value: true,
    //     option: [
    //       { label: '有', value: true },
    //       { label: '无', value: false }
    //     ]
    //   },
    //   {
    //     title: '指示点样式',
    //     key: 'dot',
    //     type: 'radio-group',
    //     value: true,
    //     option: [
    //       { label: '数字', value: true },
    //       { label: '点', value: false }
    //     ]
    //   },
    //   {
    //     title: '指示点形状',
    //     key: 'shape',
    //     type: 'radio-group',
    //     value: 'circle',
    //     disabled: () => {},
    //     option: [
    //       { label: '圆形', value: 'circle' },
    //       { label: '长方形', value: 'rectangle' }
    //     ]
    //   },
    //   {
    //     title: '指示点覆盖',
    //     key: 'dotCover',
    //     type: 'radio-group',
    //     value: true,
    //     option: [
    //       { label: '是', value: true },
    //       { label: '否', value: false }
    //     ]
    //   },
    //   {
    //     title: '指示点位置',
    //     key: 'dotLocation',
    //     type: 'radio-group',
    //     value: 'right',
    //     option: [
    //       { label: '居左', value: 'left' },
    //       { label: '居中', value: 'center' },
    //       { label: '居右', value: 'right' }
    //     ]
    //   },
    //   {
    //     title: '指示点颜色',
    //     key: 'dotColor',
    //     type: 'radio-group',
    //     value: 'dark',
    //     option: [
    //       { label: '深色', value: 'dark' },
    //       { label: '亮色', value: 'light' }
    //     ]
    //   }
    // ],
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
    // data: [
    // {
    //   content: '',
    //   id: '',
    //   imgUrl: '',
    //   linkPage: '',
    //   template: '',
    //   title: ''
    // },
    // {
    //   content: '',
    //   id: '',
    //   imgUrl: '',
    //   linkPage: '',
    //   template: '',
    //   title: ''
    // },
    // {
    //   content: '',
    //   id: '',
    //   imgUrl: '',
    //   linkPage: '',
    //   template: '',
    //   title: ''
    // }
    // ]
  },
  props: {
    value: [Object, Array]
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  computed: {
    sliderHeight() {}
  },
  created() {},
  methods: {}
}
</script>
