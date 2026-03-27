<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="links">
    <ul>
      <template v-for="item in linksTranslated">
        <li
          v-if="item.value !== 'store'"
          :key="item.value"
          class="links-item"
          :class="current === item.value && 'active'"
          @click="handleClick(item.value)"
        >
          {{ item.label }}
        </li>
        <li
          v-if="item.value === 'store' && VERSION_PLATFORM()"
          :key="item.value"
          class="links-item"
          :class="current === item.value && 'active'"
          @click="handleClick(item.value)"
        >
          {{ item.label }}
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import store from '@/store'
export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    showlinks: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data() {
    return {
      current: ''
    }
  },
  computed: {
    linksTranslated() {
      const t = this.$t.bind(this)
      let links = [
        { label: t('ce0d67f5.9897d8'), value: 'goods' },
        { label: t('ce0d67f5.295713'), value: 'store' },
        { label: t('4bbd5f74.d0771a'), value: 'category' },
        { label: t('ce0d67f5.e8f87a'), value: 'planting' },
        { label: t('ce0d67f5.cee6eb'), value: 'custom_page' }
      ]
      if (this.showlinks && this.showlinks.length) {
        links = links.filter((item) => this.showlinks.includes(item.value))
      }
      if (this.$route.path === '/store/storemanager/marketingdistributor') {
        links = links.filter((item) => item.value !== 'custom_page')
      }
      return links
    }
  },
  created() {},
  mounted() {
    this.current = this.type
  },
  methods: {
    handleClick(val) {
      this.$emit('onClick', val)
      this.current = val
    }
  }
}
</script>

<style scoped lang="scss">
.links {
  padding-right: 20px;
  width: 180px;
  border-right: 1px solid #efefef;
  .links-item {
    padding: 10px 0;
    text-align: center;
    cursor: pointer;
    &.active {
      background: #ecf5ff;
      border: 1px solid #b4d9fd;
      border-radius: 60px;
      color: #1f82e0;
    }
  }
}
</style>
