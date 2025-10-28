<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <div class="zipei-list">
    <div class="delivery-open">
      商家自配送是否开启：
      <el-switch v-model="is_open" active-color="#13ce66" inactive-color="#ff4949" />
    </div>
    <!-- <span class="delivery-open">平台自营店铺配送费用配置</span> -->
    <div>
      <div class="delivery-money">
        <span>起送：</span>
        <el-input-number v-model="min_amount" :precision="2" :step="0.1" :min="0" />
        <span>元，基础运费</span>
        <el-input-number v-model="freight_fee" :precision="2" :step="0.1" :min="0" />
        <span>元</span>
      </div>
      <div class="delivery-money">
        <el-radio v-model="selected" label="0">满：</el-radio>
        <el-input-number v-model="rule[0].full" :precision="2" :step="0.1" :min="0" />
        <span>元，实际运费</span>
        <el-input-number v-model="rule[0].freight_fee" :precision="2" :step="0.1" :min="0" />
        <span>元，输入0元时为免运费</span>
      </div>
      <div class="delivery-money">
        <el-radio v-model="selected" label="1">满：</el-radio>
        <el-input-number v-model="rule[1].full" :precision="2" :step="0.1" :min="0" />
        <span>元，实际运费</span>
        <el-input-number v-model="rule[1].freight_fee" :precision="2" :step="0.1" :min="0" />
        <span>元</span>
      </div>
    </div>
    <div class="footer-container">
      <el-button type="primary" @click="save"> 保存配置 </el-button>
    </div>
  </div>
</template>

<script>
/**
 * is_open  是否开启
 * min_amount  最小起配金额
 * freight_fee  基础运费
 * rule:  规则
 *  [{
 *   selected  是否选中
 *   full  满多少
 *   freight_fee  运费多少
 *  }]
 */
export default {
  name: 'ZiPeiList',
  data() {
    return {
      is_open: false,
      min_amount: 0,
      freight_fee: 0,
      selected: '0',
      rule: [
        {
          selected: true,
          full: 0,
          freight_fee: 0
        },
        {
          selected: false,
          full: 0,
          freight_fee: 0
        }
      ]
    }
  },
  mounted() {
    this.obtain()
  },
  methods: {
    async obtain() {
      let res = await this.$api.pickuplocation.getPickuplocationList()
      console.log('res.is_open', res?.is_open)
      this.is_open = res?.is_open
      ;(this.min_amount = Number(res.min_amount)),
        (this.freight_fee = Number(res.freight_fee)),
        (this.rule = res.rule)
      this.rule.forEach((item, index) => {
        item.freight_fee = Number(item.freight_fee)
        item.full = Number(item.full)
      })
      if (this.rule[0].selected == 'true') {
        this.selected = '0'
      } else {
        this.selected = '1'
      }
    },
    async save() {
      if (this.selected == 0) {
        this.rule[0].selected = true
        this.rule[1].selected = false
      } else {
        this.rule[0].selected = false
        this.rule[1].selected = true
      }
      let params = {
        is_open: this.is_open,
        min_amount: this.min_amount,
        freight_fee: this.freight_fee,
        rule: this.rule
      }
      await this.$api.pickuplocation.postPickuplocationList(params)
      this.$message.success('保存成功')
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input-number {
  margin: 0 14px;
  line-height: 34px;
}
.delivery-open {
  margin: 20px;
}
.delivery-money {
  display: flex;
  align-items: center;
  margin: 20px 60px;
}
</style>
