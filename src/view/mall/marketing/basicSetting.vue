<template>
  <div class="section section-white">
    <el-form ref="form" :label-position="'left'" :model="form" label-width="160px">
      <div v-loading="loading" class="section-body">
        <!--
        <el-form-item label="购买限制">
          <el-radio-group v-model="form.is_buy">
            <el-radio :label="true"  :key="true">店铺自身可购买</el-radio>
            <el-radio :label="false" :key="false">店铺自身不可购买</el-radio>
          </el-radio-group>
        </el-form-item>
        -->
        <el-form-item label="提现限制">
          用户最少申请提现
          <el-input v-model="form.limit_rebate" placeholder="多少" style="width: 80px" /> 元
        </el-form-item>
        <el-form-item label="结算限制">
          订单完成
          <el-input v-model="form.limit_time" placeholder="多少" style="width: 80px" /> 天后结算
        </el-form-item>
        <el-form-item label="退换货收货人或单位">
          <el-input
            v-model="form.return_name"
            placeholder="退换货收货人或单位"
            style="width: 280px"
          />
        </el-form-item>
        <el-form-item label="退换货地址">
          <el-input
            v-model="form.return_address"
            placeholder="配置退换货地址"
            style="width: 280px"
          />
        </el-form-item>
        <el-form-item label="退换货联系方式">
          <el-input
            v-model="form.return_phone"
            placeholder="配置退换货联系方式"
            style="width: 280px"
          />
        </el-form-item>
      </div>
      <div class="section-footer with-border content-center">
        <el-button type="primary" @click="save"> 保存 </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { getBasicConfig, saveBasicConfig } from '../../../api/marketing'
export default {
  data() {
    return {
      loading: false,
      form: {
        is_buy: true,
        limit_rebate: '',
        limit_time: '',
        return_name: '',
        return_address: '',
        return_phone: ''
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    save() {
      saveBasicConfig(this.form).then(res => {
        if (res.data.data) {
          this.$message({
            type: 'success',
            message: '保存配置成功'
          })
        }
        this.getData()
      })
    },
    getData() {
      this.loading = true
      getBasicConfig().then(res => {
        if (res.data.data) {
          this.form = res.data.data
          if (this.form.limit_rebate) {
            this.form.limit_rebate = this.form.limit_rebate / 100
          }
        }
        this.loading = false
      })
    }
  }
}
</script>
