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
  <el-table border :data="list">
    <el-table-column label="会员等级" prop="grade_name" width="300" />
    <el-table-column label="优惠券">
      <template #default="scope">
        <div>
          <div
            v-for="(coupon, index) in scope.row.coupons"
            :key="`coupon-item__${index}`"
            class="flex items-center"
          >
            <div class="coupon-name w-[300px]">{{ coupon.name }}</div>
            <div class="flex items-center">
              <span class="mr-1">数量</span>
              <el-input-number
                v-model="coupon.count"
                size="mini"
                controls-position="right"
                :min="1"
                :max="10"
                class="mr-2"
                style="width: 100px"
              />
            </div>
            <el-button type="text" @click="deleteCoupon(scope.row, index)">删除</el-button>
          </div>
          <div class="add-coupon">
            <el-button type="text" @click="addCoupon(scope.row)">添加优惠券</el-button>
          </div>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      list: []
    }
  },
  watch: {
    list: {
      handler(newVal) {
        this.$emit('change', newVal)
      }
    }
  },
  mounted() {
    this.getGradeLevel()
  },
  methods: {
    async getGradeLevel() {
      const res = await this.$api.membercard.getGradeList()
      const vipRes = await this.$api.cardticket.listVipGrade({ is_disabled: 'false' })
      const gradeList = res.map((item) => ({
        grade_id: item.grade_id,
        grade_name: item.grade_name,
        coupons: []
      }))
      const vipGradeList = vipRes.map((item) => ({
        grade_id: item.lv_type,
        grade_name: item.grade_name,
        coupons: []
      }))
      if (this.$route.params.type === 'member_upgrade') {
        // 会员升级
        this.list = gradeList
      } else if (this.$route.params.type === 'member_vip_upgrade') {
        // 付费会员升级
        this.list = vipGradeList
      } else {
        this.list = [...gradeList, ...vipGradeList]
      }
    },
    async addCoupon(row) {
      const { data } = await this.$picker.coupon()
      if (data.length > 0) {
        row.coupons = row.coupons.concat(
          data.map((item) => ({
            id: item.card_id,
            name: item.title,
            count: 1
          }))
        )
      }
    },
    deleteCoupon(row, index) {
      row.coupons.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.gift-coupon {
  &__header {
    background-color: #f0f2f5;
    padding: 4px 10px;
    border: 1px solid #ebeef5;
  }
}
</style>
