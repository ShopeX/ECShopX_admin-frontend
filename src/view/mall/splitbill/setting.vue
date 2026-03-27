<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-form label-width="200px" label-suffix="：" class="fenzhang">
    <el-form-item :label="$t('f11d0f32.bfdeb8')">
      <el-switch v-model="form.is_open" active-color="#13ce66" inactive-color="#ff4949" />
    </el-form-item>
    <el-form-item :label="$t('f11d0f32.e5848a')">
      <el-radio-group v-model="form.business_type" class="businessType">
        <el-radio class="radio" label="1"> {{ $t('f11d0f32.3c4deb') }} </el-radio>
        <!-- <el-radio class="radio" label="2">店铺独立收款后分账（店铺未开通商户号则无法交易）</el-radio>
        <el-radio class="radio" label="3">混合模式（默认店铺收款，未开通则由平台统一收款）</el-radio> -->
      </el-radio-group>
    </el-form-item>
    <div class="itemTitle">
      <h3>{{ $t('f11d0f32.1b9324') }}</h3>
      <el-form-item :label="$t('f11d0f32.0b9237')">
        <el-input-number
          v-model.lazy="form.rate"
          class="first"
          type="number"
          :min="0"
          :max="30"
          size="mini"
          controls-position="right"
        />%
        <span class="frm-tips">{{ $t('f11d0f32.2c173b') }}</span>
      </el-form-item>
      <!-- <el-form-item label="分销员分账">
        <el-checkbox v-model="form.is_open_distributor" ></el-checkbox>
        <span class="frm-tips">分销员是否通过分账方式发放佣金</span>
      </el-form-item> -->

      <h4>{{ $t('f11d0f32.822224') }}</h4>

      <div class="frm-tips">
        {{ $t('f11d0f32.b618fc') }}
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
      <el-button v-loading="loading" type="primary" @click="onSubmit">
        {{ $t('f11d0f32.be5fbb') }}
      </el-button>
    </div>
  </el-form>
</template>

<script>
import { getSetting, saveSetting } from '@/api/fenzhang'

export default {
  name: 'Fenzhang',
  data() {
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
        message: this.$t('f11d0f32.3b1083')
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
