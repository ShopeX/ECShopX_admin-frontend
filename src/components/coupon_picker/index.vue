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
  <el-dialog
    title="选择优惠券"
    class="select-goods-box select-boxs"
    :append-to-body="true"
    :modal-append-to-body="false"
    :visible="couponsVisible"
    width="1000px"
    @close="closeDialog"
  >
    <template>
      <el-transfer
        v-model="selectedCoupons"
        v-loading="loading"
        :titles="['优惠券列表', '已选中']"
        :button-texts="['移除选择', '添加选择']"
        :data="couponList"
        @change="couponsSelector"
      >
        <div slot="left-footer" class="transfer-footer">
          <el-pagination
            v-if="total_count > params.page_size"
            small
            layout="prev, pager, next"
            :total="total_count"
            :page-size="params.page_size"
            @current-change="pageChange"
          />
        </div>
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="couponsComfirm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { getCardList } from '@/api/cardticket'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      couponsVisible: false,
      loading: false,
      params: {
        page_no: 1,
        page_size: 10,
        end_date: 1
      },
      total_count: 0,
      couponList: [],
      selectedCoupons: [],

      selectList: []
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.couponsVisible = val
        this.getCouponList()
      }
    },
    selectedCoupons(val) {
      if (val.length) {
        let list = []
        this.couponList.forEach(item => {
          val.forEach(key => {
            if (item.key == key) {
              list.push(item)
            }
          })
        })
        this.selectList = list
      } else {
      }
    }
  },
  mounted() {},
  methods: {
    //选择商品分页
    pageChange(val) {
      this.params.page_no = val
      this.getCouponList()
    },
    //选择商品触发事件
    couponsSelector(value, direction, movedKeys) {
      if (value.length > 3) {
        this.$message({
          message: '最多选择三张优惠券',
          type: 'error',
          duration: 5 * 1000
        })
        this.selectedCoupons.splice(3)
      }
    },
    //选择商品确认
    couponsComfirm() {
      let values = []
      if (this.selectedCoupons.length > 0) {
        this.couponList.forEach(item => {
          this.selectedCoupons.forEach(key => {
            if (item.key == key) {
              let obj = {
                imgUrl: item.imgUrl,
                title: item.label,
                id: item.key,
                desc: item.desc,
                amount: item.amount,
                type: item.type
              }
              values.push(obj)
            }
          })
        })
      } else {
        this.$message({
          message: '请选择优惠券',
          type: 'error'
        })
        return
      }
      this.selectedCoupons = []
      this.couponsVisible = false
      this.$emit('pickCoupon', values)
    },
    getCouponList() {
      this.loading = true
      getCardList({ ...this.params, from: 'btn' })
        .then(res => {
          let list = []
          res.data.data.list.forEach(item => {
            list.push({
              type: item.card_type,
              key: item.card_id,
              label: item.title,
              imgUrl: '',
              desc: item.description,
              amount:
                item.card_type === 'discount' ? (100 - item.discount) / 10 : item.reduce_cost / 100
            })
          })

          let arr = list.filter(item => {
            let xx = this.selectList.find(row => {
              return row.key === item.key
            })
            if (!xx) {
              return item
            }
          })

          this.couponList = arr.concat(this.selectList)
          this.total_count = res.data.data.pagers.total
          this.loading = false
        })
        .catch(error => {
          this.loading = false
        })
    },
    closeDialog() {
      this.couponsVisible = false
      this.$emit('closeDialog', 'coupon')
    }
  }
}
</script>

<style lang="scss">
.select-boxs {
  .el-dialog__body {
    padding: 20px;
    padding-bottom: 10px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .el-transfer-panel__footer {
      height: 30px;
    }
  }
}
</style>
