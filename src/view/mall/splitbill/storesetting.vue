<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    label-width="200px"
    label-suffix="："
    class="fenzhang"
  >
    <el-form-item label="提现方式">
      <el-radio-group
        v-model="form.withdraw_method"
        @change="onChange"
      >
        <el-radio :label="1">
          自动提现
        </el-radio>
        <el-radio :label="2">
          手动提现
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      label="提现限额"
      prop="distributor_money"
    >
      满
      <el-input
        v-model="form.distributor_money"
        size="mini"
        :precision="2"
        @input="oninput"
      />元，可提现
    </el-form-item>
    <el-form-item
      v-if="withdraw_method === 1"
      label="提现设置说明"
    >
      <div
        style="width: 40%"
        class="content-box"
      >
        <p class="frm-tips">
          1、提现限额为0时，表示不限制提现底限，如提现限额大于0时，表示可提现金额大于或等于该金额才可进行全额提现；
        </p>
        <p class="frm-tips">
          2、自动提现每日18时系统会自动进行全额提现(仅可提现金额大于或等于提现限额)；
        </p>
        <p class="frm-tips">
          3、根据支付公司逻辑，申请提现后一个工作日到账，节假日顺延具体提现信息请查询提现记录。
        </p>
      </div>
      <el-button
        v-loading="loading"
        type="primary"
        size="medium"
        class="footer-btn"
        @click="onSubmit"
      >
        保存配置
      </el-button>
    </el-form-item>
    <el-form-item
      v-else
      label="提现设置说明"
    >
      <div
        style="width: 40%"
        class="content-box"
      >
        <p class="frm-tips">
          1、提现限额为0时，表示不限制提现底限，如提现限额大于0时，表示可提现金额大于或等于该金额才可进行全额提现；
        </p>
        <p class="frm-tips">
          2、手动提现：拥有店铺权限人员可在店铺后台手动进行提现，提现操作请在10:00:00-23:59:59进行(仅可提现金额大于或等于提现限额)；
        </p>
        <p class="frm-tips">
          3、根据支付公司逻辑，申请提现后一个工作日到账，节假日顺延具体提现信息请查询提现记录。
        </p>
      </div>
      <el-button
        v-loading="loading"
        type="primary"
        size="medium"
        class="footer-btn"
        @click="onSubmit"
      >
        保存配置
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getWithdrawset, saveWithdrawset } from '@/api/fenzhang'

export default {
  name: 'Fenzhang',
  data () {
    return {
      form: {
        // 费率
        distributor_money: '0.00',
        withdraw_method: 1
      },
      rules: {
        distributor_money: [
          { type: 'string', message: '请输入金额', required: false, trigger: 'blur' },
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '请输入正确格式,可保留两位小数'
          }
        ]
      },
      loading: false,
      withdraw_method: 1
    }
  },
  created () {
    this.getDetail()
  },
  methods: {
    oninput (e) {
      // 过滤小数点后两位
      e.replace(/[^0-9.]/g, '')
    },
    onChange (val) {
      this.withdraw_method = val
    },
    // 获取配置数据
    async getDetail () {
      const res = await getWithdrawset()
      let data = res.data.data
      this.withdraw_method = data.withdraw_method
      this.form.distributor_money = data.distributor_money
      this.form.withdraw_method = data.withdraw_method
    },
    // 费率输入

    async onSubmit () {
      let { distributor_money, withdraw_method } = this.form
      let params = {
        distributor_money,
        withdraw_method
      }
      const res = await saveWithdrawset(params)
      this.$message({
        type: 'success',
        message: '保存成功'
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
