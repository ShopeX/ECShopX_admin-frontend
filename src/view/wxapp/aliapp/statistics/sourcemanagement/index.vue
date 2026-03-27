<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section-white content-padded">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('51ec2adb.2b4d1f')" name="monito">
        <monito-list />
      </el-tab-pane>
      <el-tab-pane :label="$t('51ec2adb.658cdc')" name="source">
        <source-list />
      </el-tab-pane>
    </el-tabs>
  </div>
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
