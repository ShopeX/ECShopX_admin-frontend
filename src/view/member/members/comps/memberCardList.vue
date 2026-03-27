<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
          <div v-for="(item, index) in userVipGrade" :key="item.lv_type" class="vip-item">
            {{ item.grade_name
            }}{{ item.is_had_vip ? item.end_time + $t('188e1819.15b382') : $t('188e1819.6bbb6c') }}
            <el-input-number
              v-model="formData[item.lv_type].day"
              controls-position="right"
              style="width: 100px"
            />
            {{ $t('188e1819.249aba') }}<span v-if="index < userVipGrade.length - 1">，</span>
          </div>
          <el-button @click="addStoreValue">{{ $t('188e1819.be5fbb') }}</el-button>
        </div>
      </template>
    </SpFinder>
  </div>
</template>

<script>
import { createSetting } from '@shopex-ui/finder'
import moment from 'moment'
export default {
  props: ['info'],
  data() {
    return {
      vipGradeIsOpen: false,
      userVipGrade: [],
      formData: {}
    }
  },
  computed: {
    setting() {
      const vm = this
      return createSetting({
        columns: [
          { name: vm.$t('188e1819.1e8dc2'), key: 'order_id' },
          { name: vm.$t('188e1819.f512e9'), key: 'lv_type' },
          { name: vm.$t('188e1819.73b3a0'), key: 'title' },
          {
            name: vm.$t('188e1819.f73da2'),
            key: 'card_type',
            formatter: (value, row, col) => {
              return value.desc
            }
          },
          { name: vm.$t('188e1819.6a52ee'), key: 'mobile' },
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
      })
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
      list.forEach((item) => {
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
