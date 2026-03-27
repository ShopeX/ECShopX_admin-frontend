<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage class="section-white content-padded">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('20aac741.2b4d1f')" name="monito">
        <monito-list />
      </el-tab-pane>
      <el-tab-pane :label="$t('20aac741.658cdc')" name="source">
        <source-list />
      </el-tab-pane>
    </el-tabs>
  </SpPage>
</template>

<script>
import monitoList from './monito_list.vue'
import sourceList from './source_list.vue'

export default {
  components: {
    monitoList,
    sourceList
  },
  data() {
    return {
      activeName: 'monito'
    }
  },
  methods: {
    handleClick(tab, event) {}
  }
}
</script>
