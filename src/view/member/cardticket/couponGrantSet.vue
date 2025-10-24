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
  <div>
    <el-form ref="form" v-model="form_setting" label-width="250px">
      <el-form-item label="限制周期">
        <el-radio-group v-model="form_setting.limit_cycle">
          <el-radio-button key="month" label="month"> 月 </el-radio-button>
          <el-radio-button key="week" label="week"> 周 </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="导购可发放优惠券总数">
        <el-input v-model="form_setting.grant_total" class="formInput" />
      </el-form-item>
      <el-form-item label="导购可发放给单个客户的优惠券数">
        <el-input v-model="form_setting.grant_per_user_total" class="formInput" />
      </el-form-item>
    </el-form>
    <div>
      <el-row :gutter="20">
        <el-col :md="4" :lg="8">
          <el-button type="primary" icon="plus" @click="addCoupon"> 添加优惠券 </el-button>
        </el-col>
      </el-row>
      <el-table :data="coupon_list">
        <el-table-column prop="title" label="卡券名称" />
        <el-table-column label="卡券类型">
          <template slot-scope="card_type">
            {{ card_type.row.card_type | formatCardStr }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="卡券发放单一客户数量">
          <template slot-scope="scope">
            <el-input @change="changeCouponSendNum" v-model="scope.row.send_num" style="width: 75px"></el-input>
          </template>
        </el-table-column> -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteCoupon(scope.row)"> 移除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <couponSelect
        :dialog-visible="coupon_dialog_visible"
        :sc-status="coupon_sc_status"
        @chooseKQ="handleChooseKQ"
        @closeKQDialog="handleCloseKQDialog"
      />
    </div>
    <div style="text-align: center">
      <el-button type="primary" @click="saveCouponGrantSet"> 保存修改 </el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import couponSelect from '@/components/kqselect/coupon'
import {
  getSalepersonCouponList,
  createSalepersonCoupon,
  deleteSalepersonCoupon
} from '../../../api/cardticket.js'
export default {
  components: {
    couponSelect
  },
  data() {
    return {
      coupons: [],
      form_setting: {
        limit_cycle: 'month',
        grant_per_user_total: '',
        grant_total: '',
        coupons: []
      },
      params: {
        page: 1,
        page_size: 1000
      },
      loading: true,
      coupon_list: [],
      total_count: 0,
      coupon_dialog_visible: false,
      coupon_sc_status: false
    }
  },
  mounted() {
    this.getList()
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  methods: {
    getList() {
      this.loading = true
      getSalepersonCouponList(this.params).then(response => {
        this.total_count = response.data.data.total_count
        this.form_setting = response.data.data.coupon_setting
        this.coupon_list = response.data.data.list
        this.form_setting.coupons = []
        for (var i in this.coupon_list) {
          let arr = {
            coupon_id: this.coupon_list[i].card_id,
            send_num: this.coupon_list[i].send_num
          }
          this.form_setting.coupons.push(arr)
        }
        this.loading = false
      })
    },
    saveCouponGrantSet() {
      createSalepersonCoupon(this.form_setting).then(response => {
        if (response.data.data.status) {
          this.$message({
            message: '保存成功',
            type: 'success',
            duration: 5 * 1000
          })
        } else {
          this.$message({
            message: '保存失败',
            type: 'error',
            duration: 5 * 1000
          })
        }
        this.getList()
      })
    },
    addCoupon() {
      this.coupon_dialog_visible = true
      this.coupon_sc_status = true
    },
    deleteCoupon(row) {
      let that = this
      this.$confirm('是否移除可发放优惠券, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSalepersonCoupon(row.id)
          .then(response => {
            that.$message({
              type: 'success',
              message: '移除可发放优惠券成功'
            })
            that.getList()
          })
          .catch(() => {
            that.$message({
              type: 'info',
              message: '移除可发放优惠券失败'
            })
          })
      })
    },
    changeCouponSendNum() {
      this.form_setting.coupons = []
      for (var i in this.coupon_list) {
        let arr = {
          coupon_id: this.coupon_list[i].card_id,
          send_num: this.coupon_list[i].send_num
        }
        this.form_setting.coupons.push(arr)
      }
    },
    handleChooseKQ(selectedItem) {
      let table_coupon_data = JSON.parse(JSON.stringify(selectedItem))
      this.coupon_list = Array.from(new Set(this.coupon_list.concat(table_coupon_data)))
      this.form_setting.coupons = []
      for (var i in this.coupon_list) {
        let arr = {
          coupon_id: this.coupon_list[i].card_id,
          send_num: 1
        }
        this.form_setting.coupons.push(arr)
      }
      this.coupon_dialog_visible = false
    },
    handleCloseKQDialog() {
      this.coupon_dialog_visible = false
    }
  }
}
</script>

<style>
.formInput {
  width: 200px;
}
</style>
