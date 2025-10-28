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
<!--
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 分账设置
 * @FilePath: /app/src/view/mall/fenzhang/setting.vue
 * @Date: 2020-09-21 17:50:26
 * @LastEditors: Arvin
 * @LastEditTime: 2020-09-22 11:46:35
-->
<template>
  <el-form label-width="200px" label-suffix="：" class="fenzhang">
    <el-form-item label="是否开启分账">
      <el-switch v-model="form.is_open" active-color="#13ce66" inactive-color="#ff4949" />
    </el-form-item>
    <el-form-item label="分账业务模式">
      <el-radio-group v-model="form.business_type" class="businessType">
        <el-radio class="radio" label="1"> 平台/总部统一收款后分账 </el-radio>
        <!-- <el-radio class="radio" label="2">店铺独立收款后分账（店铺未开通商户号则无法交易）</el-radio>
        <el-radio class="radio" label="3">混合模式（默认店铺收款，未开通则由平台统一收款）</el-radio> -->
      </el-radio-group>
    </el-form-item>
    <div class="itemTitle">
      <h3>分账参数</h3>
      <el-form-item label="平台服务费">
        <el-input-number
          v-model.lazy="form.rate"
          class="first"
          type="number"
          :min="0"
          :max="30"
          size="mini"
          controls-position="right"
        />%
        <span class="frm-tips">平台向商户收取的服务费率（0.00-30.00）</span>
      </el-form-item>
      <!-- <el-form-item label="分销员分账">
        <el-checkbox v-model="form.is_open_distributor" ></el-checkbox>
        <span class="frm-tips">分销员是否通过分账方式发放佣金</span>
      </el-form-item> -->

      <h4>分账功能说明：</h4>

      <div class="frm-tips">
        开启分账前确认已经与支付公司签约及开通相关权限，并在支付设置页面配置了相关信息
      </div>
    </div>
    <!-- <div class="itemTitle" v-if="form.business_type !== 1">
      <h3>代理商参数</h3>
      <el-form-item label="代理商商户号">
        <el-input type="text" v-model="form.agent_number" size="mini" />
        <span class="frm-tips">平台在汇付开立的代理商商户号</span>
      </el-form-item>
      <el-form-item label="服务商渠道号">
        <el-input type="text" v-model="form.provider_number" size="mini" />
        <span class="frm-tips">平台通过汇付开立的微信支付渠道号</span>
      </el-form-item>
      <el-form-item label="绑定的微信小程序APPID">
        <el-input type="text" v-model="form.app_id" size="mini" />
        <span class="frm-tips">商城小程序APPID</span>
      </el-form-item> 
    </div> -->
    <div class="section-footer with-border content-center">
      <el-button v-loading="loading" type="primary" @click="onSubmit"> 保存 </el-button>
    </div>
  </el-form>
</template>

<script>
import { getSetting, saveSetting } from '@/api/fenzhang'

export default {
  name: 'Fenzhang',
  data() {
    1
    return {
      form: {
        // 是否开启分账
        is_open: false,
        // 分账业务模式 1 平台；2 店铺
        business_type: '1',
        // 费率
        rate: '0.00',
        // 是否开启经销商分账
        is_open_distributor: false,
        // 代理商户号，business_type=2时必填
        agent_number: '',
        // 服务器渠道号，business_type=2时必填
        provider_number: '',
        // business_type=2时必填
        app_id: ''
      },
      loading: false
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    // 获取配置数据
    async getDetail() {
      const res = await getSetting()
      let data = res.data.data
      data.is_open_distributor = data.is_open_distributor == 'true' ? true : false
      data.is_open = data.is_open == 'true' ? true : false
      this.form = JSON.parse(JSON.stringify(data))
    },
    // 费率输入

    async onSubmit() {
      let { is_open, business_type, rate, is_open_distributor } = this.form
      let params = {
        is_open,
        business_type,
        rate,
        is_open_distributor
      }
      const res = await saveSetting(params)
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.fenzhang {
  width: 100%;
  .businessType {
    display: flex;
    flex-direction: column;
    .radio {
      margin-top: 25px;
      &:first-child {
        margin-top: 13px !important;
      }
    }
  }
  .el-input {
    width: 240px;
    &.first {
      width: 80px;
      margin-right: 10px;
    }
  }
  .frm-tips {
    display: block;
  }
  h3 {
    padding-left: 18px;
  }
}
</style>
