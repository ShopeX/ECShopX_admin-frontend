<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.name"
          :name="item.activeName"
        >
          <transfer v-if="activeName == 'transfer'" />
          <transferdetail v-if="activeName == 'transferdetail'" />
          <transferlog v-if="activeName == 'transferlog'" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <router-view />
  </div>
</template>
<script>
import transfer from './components/transfer'
import transferdetail from './components/transferdetail'
import transferlog from './components/transferlog'
import { i18n } from '@/i18n'
export default {
  components: {
    transfer,
    transferdetail,
    transferlog
  },
  data() {
    return {
      activeName: 'transfer',
      tabList: [
        { name: i18n.t('a4a3c890.6c9cac'), activeName: 'transfer' },
        { name: i18n.t('a4a3c890.362f6d'), activeName: 'transferdetail' },
        { name: i18n.t('a4a3c890.e2e8fe'), activeName: 'transferlog' }
      ]
    }
  },
  mounted() {},
  methods: {
    handleTabClick: function () {}
  }
}
</script>
