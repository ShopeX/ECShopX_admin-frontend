<template>
  <el-form
    ref="form"
    label-width="200px"
  >
    <el-tabs type="border-card">
      <el-tab-pane label="导购分润设置">
        <el-form-item label="是否开启分润">
          <el-switch
            v-model="form.distributor.show"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="拉新店铺">
          <el-input
            v-model="form.distributor.distributor"
            class="input-m"
          >
            <i slot="suffix">%</i>
          </el-input>
          <span class="frm-tips">
            <i class="el-icon-warning-outline" /> 注：无拉新门店信息，则不作分润计算。
          </span>
        </el-form-item>
        <el-form-item label="拉新导购">
          <el-input
            v-model="form.distributor.seller"
            class="input-m"
          >
            <i slot="suffix">%</i>
          </el-input>
          <span class="frm-tips">
            <i class="el-icon-warning-outline" /> 注：无拉新导购信息，则不作分润计算。
          </span>
        </el-form-item>
        <el-form-item label="推广导购">
          <el-input
            v-model="form.distributor.popularize_seller"
            class="input-m"
          >
            <i slot="suffix">%</i>
          </el-input>
          <span class="frm-tips">
            <i class="el-icon-warning-outline" /> 注：无推广导购信息，则不作分润计算。
          </span>
        </el-form-item>
        <el-form-item label="门店开单">
          <el-input
            v-model="form.distributor.distributor_seller"
            class="input-m"
          >
            <i slot="suffix">%</i>
          </el-input>
          <span class="frm-tips">
            <i class="el-icon-warning-outline" /> 注：无门店开单导购信息，则不作分润计算。
          </span>
        </el-form-item>
        <el-form-item label="结算时间">
          订单售后完成<el-input
            v-model="form.distributor.plan_limit_time"
            class="input-m"
            style="width: 100px"
          />天后结算
          <span
            class="frm-tips"
          ><i class="el-icon-warning-outline" /> 注：分润时间从售后完成n天计算。</span>
        </el-form-item>
        <div class="section-footer with-border content-center">
          <el-button
            type="primary"
            @click="onSubmit"
          >
            保存
          </el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-form>
</template>
<script>
import { getDistributionConfig, setDistributionConfig } from '@/api/shop'

export default {
  data () {
    return {
      form: {
        distributor: {
          show: 0,
          distributor: 0,
          seller: 0,
          popularize_seller: 0,
          plan_limit_time: 0
        }
      }
    }
  },
  mounted () {
    this.getConfig()
  },
  methods: {
    getConfig () {
      getDistributionConfig().then((response) => {
        this.form = response.data.data
      })
    },
    onSubmit () {
      setDistributionConfig(this.form).then((response) => {
        this.form = response.data.data
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      })
    }
  }
}
</script>
<style scoped lang="scss"></style>
