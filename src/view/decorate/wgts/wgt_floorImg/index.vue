<style lang="scss">
.wgt-floorImg {
  &.padded {
    padding: 10px 0;
  }
  .wgt-hd {
    padding: 10px;
    .title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    .sub-title {
      color: #666;
      margin-left: 4px;
    }
  }
  .wgt-bd {
    position: relative;
    display: flex;
    &.spaced {
      padding: 0 10px;
      .img-item{
        flex: 1;
      }
    }
  }
}
</style>
<template>
  <div
    :class="{
      'wgt-floorImg': true,
      'padded': value.padded
    }"
    :style="{backgroundImage: `url(${value.pageBackgroundImage})`}"
  >
    <div v-if="value.title || value.subtitle" class="wgt-hd">
      <span class="title">{{ value.title }}</span>
      <span class="sub-title">{{ value.subtitle }}</span>
    </div>
    <div
      class="wgt-bd"
      :class="{
        'spaced': value.spaced
      }"
    >
    <div v-for="(item,index) in value.data" :key="index" class="img-item">
      <div>
        <el-image :src="item.url" :width="'100%'" />
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<script>
import config from './config'
export default {
  name: 'FloorImg',
  wgtName: '楼层图片',
  wgtDesc: '',
  wgtIcon: 'wgt-floorImg',
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {
    }
  },
  computed: {
    sliderHeight() {}
  },
  created() {},
  methods: {}
}
</script>
