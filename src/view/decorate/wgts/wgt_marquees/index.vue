<style lang="scss">
.wgt-marquees {
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
  }

  .medium {
    padding: 0 16px;
    line-height: 32px;
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
<template>
  <div
    :class="{
      'wgt-marquees': true,
      'padded': value.padded
    }"
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
      :style="{
        'background': value.bgcolor
      }"
    >
      <!-- 挂件自定义部分 -->
      <el-carousel height="30px" direction="vertical" :autoplay="true" indicator-position="none">
        <el-carousel-item v-for="(item, index) in value.data" :key="index">
          <div
            :style="{
              'color': value.fontcolor
            }"
            class="medium"
          >
            {{ item.title }}
          </div>
        </el-carousel-item>
      </el-carousel>
      <!-- 挂件自定义部分 -->
    </div>
  </div>
</template>

<script>
import config from './config'
export default {
  name: 'Marquees',
  wgtName: '文字轮播',
  wgtDesc: '',
  wgtIcon: 'wgt-marquees',
  config: config,
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
