<style lang="scss">
.wgt-hotTopic {
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
    padding: 0 8px;
    display: flex;
    flex-wrap: wrap;
    .topic-item {
      font-size: 12px;
      line-height: 26px;
      padding: 0 12px;
      color: #222;
      background: #f5f5f5;
      border-radius: 30px;
      border: 1px solid #bbbbbb;
      margin: 0 10px 10px 0;
    }
  }
}
</style>
<template>
  <div
    :class="{
      'wgt-hotTopic': true,
      padded: value.padded
    }"
  >
    <div v-if="value.title || value.subtitle" class="wgt-hd">
      <span class="title">{{ value.title }}</span>
      <span class="sub-title">{{ value.subtitle }}</span>
    </div>
    <div
      class="wgt-bd"
      :class="{
        spaced: value.spaced
      }"
    >
      <!-- 挂件自定义部分 -->
      <div v-for="(item, index) in value.data" :key="index" class="topic-item">
        <span>{{ item.topic }}</span>
      </div>
      <!-- 挂件自定义部分 -->
    </div>
  </div>
</template>
<script>
import config from './config'
export default {
  name: 'HotTopic',
  wgtName: '热点话题',
  wgtDesc: '',
  wgtIcon: 'wgt-hotTopic',
  config: config,
  props: {
    value: [Object, Array]
  }
}
</script>
