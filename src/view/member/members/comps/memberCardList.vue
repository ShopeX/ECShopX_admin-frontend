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
<style lang="scss">
.member-card-list {
  .action-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    .el-button {
      margin: 0 0 0 20px !important;
    }

    .vip-item {
      display: flex;
      align-items: center;
      .el-input-number {
        margin: 0 10px;
      }
    }
  }
}
</style>

<template>
  <div class="member-card-list">
    <SpFinder
      ref="finder"
      url="/vipgrade/order"
      no-selection
      :fixed-row-action="true"
      :setting="setting"
      :hooks="{
        beforeSearch: beforeSearch
      }"
    >
      <template slot="tableTop">
        <div v-if="vipGradeIsOpen" class="action-container">
          <div v-for="(item, index) in userVipGrade" class="vip-item">
            {{ item.grade_name
            }}{{ item.is_had_vip ? `${item.end_time}到期，延期` : '未购买过该会员卡，当天延期' }}
            <el-input-number
              v-model="formData[item.lv_type].day"
              controls-position="right"
              style="width: 100px"
            />
            天<span v-if="index < userVipGrade.length - 1">，</span>
          </div>
          <el-button @click="addStoreValue">保存</el-button>
        </div>
      </template>
    </SpFinder>
  </div>
</template>

<script>
import { createSetting } from '@shopex/finder'
import moment from 'moment'
export default {
  props: ['info'],
  data() {
    return {
      vipGradeIsOpen: false,
      userVipGrade: [],
      setting: createSetting({
        columns: [
          { name: '订单号', key: 'order_id' },
          { name: '会员卡等级', key: 'lv_type' },
          { name: '会员卡名称', key: 'title' },
          {
            name: '会员卡类型',
            key: 'card_type',
            formatter: (value, row, col) => {
              return value.desc
            }
          },
          { name: '会员手机号', key: 'mobile' },
          {
            name: '购买金额',
            key: 'price',
            formatter: (value, row, col) => {
              return `￥${value / 100}`
            }
          },
          {
            name: '折扣值',
            key: 'discount',
            formatter: (value, row, col) => {
              return `${(100 - value) / 100}折`
            }
          },
          {
            name: '下单时间',
            key: 'created',
            width: '160px',
            formatter: (value, row, col) => {
              return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          {
            name: '来源',
            key: 'source_type',
            formatter: (value, row, col) => {
              const sourceTypes = {
                receive: '领取获得',
                sale: '购买获得',
                gift: '赠送获得',
                admin: '后台手动操作'
              }
              return sourceTypes[value]
            }
          }
        ]
      }),
      formData: {}
    }
  },
  created() {},
  mounted() {
    // 获取所有会员等级
    this.getAllUserVipGrade()
  },
  methods: {
    beforeSearch(params) {
      const { user_id } = this.$route.query
      params = {
        ...params,
        user_id,
        page: params.page,
        pageSize: params.pageSize
      }
      return params
    },
    async addStoreValue() {
      await this.$confirm('请确认是否延期会员日期?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      const { user_id } = this.$route.query
      await this.$api.cardticket.receiveMemberCard({
        user_id,
        mobile: this.info.mobile,
        vipGradeAddDay: JSON.stringify(this.formData)
      })
      this.$message.success('操作成功')
      this.$refs['finder'].refresh(true)
    },
    async getAllUserVipGrade() {
      const { user_id } = this.$route.query
      const { list, is_open } = await this.$api.cardticket.getAllUserVipGrade({ user_id })
      this.vipGradeIsOpen = is_open
      this.userVipGrade = list
      list.forEach(item => {
        this.$set(this.formData, item.lv_type, {
          day: 0,
          vip_grade_id: item.vip_grade_id
        })
      })
    },
    onSearch() {},
    async onChuZhiFormSubmit() {
      const { user_id } = this.$route.query
      await this.$api.deposit.rechargeDeposit({
        user_id,
        money: parseInt(this.chuzhiForm.money * 100)
      })
      this.$message.success('添加成功')
      this.chuzhiDialog = false
      this.$refs['finder'].refresh(true)
    }
  }
}
</script>
