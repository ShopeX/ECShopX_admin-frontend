<style lang="scss" src="./index.scss"></style>
<template>
  <div
    :class="{
      'wgt-store': true,
      'padded': value.padded
    }"
  >
    <div v-if="value.title || value.subtitle" class="wgt-hd">
      <span class="title">{{ value.title }}</span>
      <span class="sub-title">{{ value.subtitle }}</span>
    </div>
    <div class="wgt-bd">
      <div class="wgt-block" :style="blockStyle">
        <div class="store-info">
          <SpImage :src="value.distributor.logo" :width="40" :height="40" :circle="8" />
          <div>
            <div class="name">{{ value.distributor.name || '店铺名称' }}</div>
            <div class="tags">
              <div v-for="(item, index) in value.tags" :key="`tag__${index}`" class="tag">
                {{ item.tag_name }}
              </div>
            </div>
          </div>
        </div>
        <div class="activity-goods">
          <div class="activity-img">
            <SpImage :src="value.imgUrl" :height="value.imgUrl ? '' : 160" />
          </div>
          <div v-if="value.items.length > 0" class="goods-list">
            <div
              v-for="(item, index) in value.items"
              :key="`goods-item__${index}`"
              class="goods-item"
            >
              <SpImage :src="item.imgUrl" :width="96" :height="96" />
              <div>123</div>
            </div>
          </div>
          <div v-else class="goods-list">
            <div
              v-for="(item, index) in [1, 2, 3, 4]"
              :key="`goods-item__${index}`"
              class="goods-item"
            >
              <SpImage :width="96" :height="96" />
              <div>123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from './config'
export default {
  name: 'Store',
  wgtName: '推荐店铺',
  wgtDesc: '',
  wgtIcon: 'wgt-store',
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {
      currentIndex: 1
    }
  },
  computed: {
    blockStyle() {
      const { backgroundColor = '' } = this.value
      return {
        backgroundColor
      }
    }
  },
  created() {},
  methods: {}
}
</script>
