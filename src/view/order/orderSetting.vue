<style lang="scss"></style>
<template>
  <div class="page-order-order-setting">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基础设置" name="baseSetting">
        <base-setting v-if="activeName === 'baseSetting'" />
      </el-tab-pane>
      <el-tab-pane label="自动审批设置" name="afterSalesSetting">
        <auto-approval-setting v-if="activeName === 'afterSalesSetting'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import baseSetting from './components/baseSetting.vue'
import autoApprovalSetting from './components/autoApprovalSetting.vue'
export default {
  components: {
    baseSetting,
    autoApprovalSetting
  },
  data() {
    return {
      activeName: 'baseSetting'
    }
  }
}
</script>
