<style lang="scss" scoped>
.wgt-hotTopic {
  .wgt-contnet {
    .topics {
      display: flex;
      .topic-item {
        display: inline-block;
        padding: 10px 20px;
        background: #000;
        color: #fff;
        border: 1px solid #000;
        margin-right: 10px;
        &:nth-child(2n) {
          background: #fff;
          color: #000;
        }
      }
    }
  }
}
</style>
<template>
  <div
    :class="{
      'wgt-hotTopic': true,
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
