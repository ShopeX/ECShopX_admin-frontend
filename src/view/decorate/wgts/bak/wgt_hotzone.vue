<style lang="scss" src="./wgt_hotzone.scss"></style>
<template>
  <div class="wgt-hotzone">
    <div class="wgt-hd">
      <span class="title">{{ value.title }}</span>
      <span class="sub-title">{{ value.subtitle }}</span>
    </div>
    <div class="wgt-bd">
      <SpImage :width="375" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'WgtHotzone',
  wgtName: '热区图',
  wgtIcon: 'wgt-hotzone',
  config: {
    name: 'hotzone',
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
    config: [{ title: '图片', key: 'imgUrl', type: 'text', value: '' }],
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
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>
