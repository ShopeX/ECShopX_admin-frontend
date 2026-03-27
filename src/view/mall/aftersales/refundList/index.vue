<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.name"
          :name="item.activeName"
        >
          <order v-if="activeName == 'order'" />
          <orderlog v-if="activeName == 'orderlog'" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <router-view />
  </SpPage>
</template>
<script>
import { i18n } from '@/i18n'
import order from './components/order'
import orderlog from './components/orderlog'
export default {
  components: {
    order,
    orderlog
  },
  data() {
    return {
      activeName: 'order',
      tabList: [
        { name: i18n.t('05ee9c47.51e9e1'), activeName: 'order' },
        { name: i18n.t('05ee9c47.ea0ea2'), activeName: 'orderlog' }
      ]
    }
  },
  mounted() {},
  methods: {
    handleTabClick: function () {}
  }
}
</script>
