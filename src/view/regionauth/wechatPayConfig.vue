<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="微信支付配置" name="wxpay" />
      <el-tab-pane label="支付宝支付配置" name="alipay" />
    </el-tabs>
    <WxPay
      v-if="activeName === 'wxpay'"
    />

    <Alipay
      v-if="activeName === 'alipay'"
      ref="formBase"
    />
  </div>
</template>

<script>
import WxPay from './comps/wxpay'
import Alipay from './comps/alipay'
export default {
  components: {
    WxPay,
    Alipay
  },
  data() {
    return {
      activeName: 'wxpay'
    }
  },
  mounted() {
  },
  methods: { }
}
</script>

<style scoped lang="scss"></style>
