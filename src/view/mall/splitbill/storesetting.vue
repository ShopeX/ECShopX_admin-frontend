<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    label-width="200px"
    label-suffix="："
    class="fenzhang"
  >
    <el-form-item :label="$t('367c9506.e5bd6e')">
      <el-radio-group v-model="form.withdraw_method" @change="onChange">
        <el-radio :label="1"> {{ $t('d41d8cd9.t2u3v4a') }} </el-radio>
        <el-radio :label="2"> {{ $t('d41d8cd9.w5x6y7a') }} </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="$t('367c9506.0089a2')" prop="distributor_money">
      {{ $t('d41d8cd9.z8a9b0a') }}
      <el-input v-model="form.distributor_money" size="mini" :precision="2" @input="oninput" />{{
        $t('d41d8cd9.c1d2e3')
      }}
    </el-form-item>
    <el-form-item v-if="withdraw_method === 1" :label="$t('367c9506.dcd763')">
      <div style="width: 40%" class="content-box">
        <p class="frm-tips">
          {{ $t('d41d8cd9.f4g5h6a') }}
        </p>
        <p class="frm-tips">
          {{ $t('d41d8cd9.i7j8k9') }}
        </p>
        <p class="frm-tips">
          {{ $t('d41d8cd9.l0m1n2') }}
        </p>
      </div>
      <el-button
        v-loading="loading"
        type="primary"
        size="medium"
        class="footer-btn"
        @click="onSubmit"
      >
        {{ $t('d41d8cd9.o3p4q5') }}
      </el-button>
    </el-form-item>
    <el-form-item v-else :label="$t('367c9506.dcd763')">
      <div style="width: 40%" class="content-box">
        <p class="frm-tips">
          {{ $t('d41d8cd9.f4g5h6a') }}
        </p>
        <p class="frm-tips">
          {{ $t('d41d8cd9.r6s7t8') }}
        </p>
        <p class="frm-tips">
          {{ $t('d41d8cd9.l0m1n2') }}
        </p>
      </div>
      <el-button
        v-loading="loading"
        type="primary"
        size="medium"
        class="footer-btn"
        @click="onSubmit"
      >
        {{ $t('d41d8cd9.o3p4q5') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getWithdrawset, saveWithdrawset } from '@/api/fenzhang'

export default {
  name: 'Fenzhang',
  data() {
    return {
      form: {
        // 费率
        distributor_money: '0.00',
        withdraw_method: 1
      },
      rules: {
        distributor_money: [
          { type: 'string', message: this.$t('367c9506.d594b7'), required: false, trigger: 'blur' },
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: this.$t('367c9506.00db3d')
          }
        ]
      },
      loading: false,
      withdraw_method: 1
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    oninput(e) {
      // 过滤小数点后两位
      e.replace(/[^0-9.]/g, '')
    },
    onChange(val) {
      this.withdraw_method = val
    },
    // 获取配置数据
    async getDetail() {
      const res = await getWithdrawset()
      let data = res.data.data
      this.withdraw_method = data.withdraw_method
      this.form.distributor_money = data.distributor_money
      this.form.withdraw_method = data.withdraw_method
    },
    // 费率输入

    async onSubmit() {
      let { distributor_money, withdraw_method } = this.form
      let params = {
        distributor_money,
        withdraw_method
      }
      const res = await saveWithdrawset(params)
      this.$message({
        type: 'success',
        message: this.$t('367c9506.3b1083')
      })
      this.getDetail()
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
  .content-box {
    width: 40%;
    background: #eee;
    padding: 0px 13px;
  }
  .footer-btn {
    margin-top: 50px;
  }
}
</style>
