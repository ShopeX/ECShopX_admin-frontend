<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="wxalink">
    <div class="line">
      <div class="name">{{ $t('e4e3a61b.d34f1f') }}</div>
      <el-select v-model="app_id" :placeholder="$t('e4e3a61b.708c9d')" @change="selectChange">
        <el-option
          v-for="(item, index) in options"
          :key="`${item.value}${index}`"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="line">
      <div class="name">{{ $t('e4e3a61b.b78454') }}</div>
      <el-input v-model="route_name" />
    </div>
    <el-button type="primary" @click="search"> {{ $t('e4e3a61b.36343f') }} </el-button>
  </div>
</template>

<script>
import api from '@/api'

export default {
  data() {
    return {
      options: [],
      app_id: '',
      route_name: ''
    }
  },
  async mounted() {
    const { list } = await api.wxa.getWxLinkListSetting({
      page: 1
    })
    this.options = list.map((item) => {
      return {
        label: item.app_name,
        value: item.app_id
      }
    })
    this.app_id = this.options.length > 0 ? this.options[0].value : ''
    this.$emit('selectChange', this.app_id)
  },
  methods: {
    selectChange(val) {
      this.$emit('selectChange', val)
    },
    search() {
      this.$emit('onsearch', this.route_name)
    }
  }
}
</script>

<style lang="scss" scoped>
.wxalink {
  display: flex;
  align-items: center;
  .line {
    display: flex;
    align-items: center;
    .name {
      flex-shrink: 0;
      margin-right: 10px;
    }
    &:last-of-type {
      margin: 0 15px;
    }
  }
}
</style>
