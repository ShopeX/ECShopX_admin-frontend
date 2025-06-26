<template>
  <div class="p-4">
    <div class="grid grid-cols-3 gap-4">
      <div v-for="(item, index) in realTimeData" :key="index">
        <div class="flex flex-col bg-white rounded-lg px-6">
          <div class="text-md text-card-foreground flex items-center py-4 gap-2 border-b">
            <SpIcon :name="item.icon" size="20" :fill="themeColor" />
            <span class="text-[16px]">{{ item.label }}</span>
          </div>
          <div class="py-6">
            <div class="text-[28px] text-[#333] leading-10 font-[roboto]">{{ item.today }}</div>
            <div class="text-[14px] mt-2 leading-5 text-[#999]">昨日：{{ item.yesterday }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="mt-4 grid grid-cols-2 gap-4">
      <div class="bg-white rounded-lg p-6 notice-box">
        <div>重要信息</div>
      </div>

    </div> -->
  </div>
</template>

<script>
import { Column } from '@antv/g2plot'
import { formatPrice, parsehslTohsla } from '@/utils'
import Config from '@/config'
export default {
  data() {
    return {
      chartData: {
        new_user: [],
        new_vip: [],
        new_svip: []
      },
      realTimeData: {
        atv: {
          icon: 'finance',
          label: '客单价',
          today: 0,
          yesterday: 0
        },
        refunded_fee: {
          icon: 'tag-one',
          label: '退款金额',
          today: 0,
          yesterday: 0
        },
        payed_fee: {
          icon: 'expenses',
          label: '实付金额',
          today: 0,
          yesterday: 0
        },
        payed_orders: {
          icon: 'shopping-cart-del',
          label: '实付订单数',
          today: 0,
          yesterday: 0
        },
        payed_members: {
          icon: 'light-member',
          label: '实付会员数',
          today: 0,
          yesterday: 0
        },
        aftersale_count: {
          icon: 'date-comes-back',
          label: '售后订单数',
          today: 0,
          yesterday: 0
        }
      },
      activeTab: 'new_user',
      tabList: [
        { name: 'new_user', label: '新增人数' },
        { name: 'new_vip', label: '新增VIP' },
        { name: 'new_svip', label: '新增SVIP' }
      ],
      themeColor: Config.themeConfig.primaryColor
    }
  },
  mounted() {
    this.getCompanyStatistics()
  },
  methods: {
    async getCompanyStatistics() {
      const { member_data, notice_data, today_data, yesterday_data } =
        await this.$api.company.getCompanyStatistics()
      this.realTimeData.payed_fee.today = formatPrice(today_data.real_payed_fee, true, '')
      this.realTimeData.payed_fee.yesterday = formatPrice(yesterday_data.real_payed_fee, true, '')
      this.realTimeData.payed_orders.today = today_data.real_payed_orders
      this.realTimeData.payed_orders.yesterday = yesterday_data.real_payed_orders
      this.realTimeData.payed_members.today = today_data.real_payed_members
      this.realTimeData.payed_members.yesterday = yesterday_data.real_payed_members
      this.realTimeData.atv.today = formatPrice(today_data.real_atv, true, '')
      this.realTimeData.atv.yesterday = formatPrice(yesterday_data.real_atv, true, '')
      this.realTimeData.refunded_fee.today = formatPrice(today_data.real_refunded_fee, true, '')
      this.realTimeData.refunded_fee.yesterday = formatPrice(
        yesterday_data.real_refunded_fee,
        true,
        ''
      )
      this.realTimeData.aftersale_count.today = today_data.real_aftersale_count
      this.realTimeData.aftersale_count.yesterday = yesterday_data.real_aftersale_count
    }
  }
}
</script>

<style lang="scss" scoped></style>
