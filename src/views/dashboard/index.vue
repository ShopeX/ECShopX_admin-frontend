<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div class="grid grid-cols-3 gap-4">
      <div v-for="(item, index) in realTimeData" :key="index">
        <div class="flex flex-col bg-white rounded-lg px-6">
          <div class="text-md text-card-foreground flex items-center py-4 gap-2 border-b">
            <SpIcon :name="item.icon" size="20" :fill="themeColor" />
            <span class="text-[16px]">{{ item.label }}</span>
          </div>
          <div class="py-6">
            <div class="text-[28px] text-[#333] leading-10 font-[roboto]">{{ item.today }}</div>
            <div class="text-[14px] mt-2 leading-5 text-[#999]">
              {{ $t('ac445cdb.23c9bc') }}：{{ item.yesterday }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 grid grid-cols-2 gap-4">
      <div class="bg-white rounded-lg p-6 notice-box">
        <div class="text-[18px] text-[#333]">{{ $t('ac445cdb.6b9290') }}</div>
        <div class="flex flex-col gap-6 py-6">
          <div class="rounded-[8px] bg-[#f5f5f5] p-6">
            <div class="text-[16px] text-[#333]">{{ $t('ac445cdb.7ecdf0') }}</div>
            <div class="flex gap-6 h-10 items-center">
              <div>
                <span class="text-[#718096]">{{ $t('ac445cdb.c8604e') }}</span>
                <span class="text-[#333] text-[20px]">{{ wait_delivery_count }}</span>
              </div>
              <div>
                <span class="text-[#718096]">{{ $t('ac445cdb.43e4e0') }}</span>
                <span class="text-[#333] text-[20px]">{{ aftersales_count }}</span>
              </div>
              <div>
                <span class="text-[#718096]">{{ $t('ac445cdb.9ec57b') }}</span>
                <span class="text-[#333] text-[20px]">{{ refund_errorlogs_count }}</span>
              </div>
            </div>
          </div>
          <div class="rounded-[8px] bg-[#f5f5f5] p-6">
            <div class="text-[16px] text-[#333]">{{ $t('ac445cdb.7e4c38') }}</div>
            <div class="flex gap-6 h-10 items-center">
              <div>
                <span class="text-[#718096]">{{ $t('ac445cdb.74f192') }}</span>
                <span class="text-[#333] text-[20px]">{{ warning_goods_count }}</span>
              </div>
            </div>
          </div>
          <div class="rounded-[8px] bg-[#f5f5f5] p-6">
            <div class="text-[16px] text-[#333]">{{ $t('ac445cdb.cf9587') }}</div>
            <div class="flex gap-6 h-10 items-center">
              <div>
                <span class="text-[#718096]">{{ $t('ac445cdb.200456') }}</span>
                <span class="text-[#333] text-[20px]">{{ started_seckill_count }}</span>
              </div>
              <div>
                <span class="text-[#718096]">{{ $t('ac445cdb.3e49ca') }}</span>
                <span class="text-[#333] text-[20px]">{{ started_gtoups_count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg p-6">
        <div class="flex justify-between items-center">
          <div class="text-[18px] text-[#333]">{{ $t('ac445cdb.c9b185') }}</div>
          <SpTabs :tab-list="tabList" v-model="activeTab" @change="handleTabChange" />
        </div>
        <div id="member-chart" class="h-[350px] mt-4" />
      </div>
    </div>
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
        atv: { icon: 'finance', label: '', today: 0, yesterday: 0 },
        refunded_fee: { icon: 'tag-one', label: '', today: 0, yesterday: 0 },
        payed_fee: { icon: 'expenses', label: '', today: 0, yesterday: 0 },
        payed_orders: { icon: 'shopping-cart-del', label: '', today: 0, yesterday: 0 },
        payed_members: { icon: 'light-member', label: '', today: 0, yesterday: 0 },
        aftersale_count: { icon: 'date-comes-back', label: '', today: 0, yesterday: 0 }
      },
      activeTab: 'new_user',
      tabList: [
        { name: 'new_user', label: '' },
        { name: 'new_vip', label: '' },
        { name: 'new_svip', label: '' }
      ],
      themeColor: Config.themeConfig.primaryColor,
      wait_delivery_count: 0,
      aftersales_count: 0,
      refund_errorlogs_count: 0,
      warning_goods_count: 0,
      started_seckill_count: 0,
      started_gtoups_count: 0
    }
  },
  mounted() {
    const t = this.$t.bind(this)
    this.realTimeData.atv.label = t('ac445cdb.53c7e7')
    this.realTimeData.refunded_fee.label = t('ac445cdb.a0cd4c')
    this.realTimeData.payed_fee.label = t('ac445cdb.94a7de')
    this.realTimeData.payed_orders.label = t('ac445cdb.a4517a')
    this.realTimeData.payed_members.label = t('ac445cdb.87491a')
    this.realTimeData.aftersale_count.label = t('ac445cdb.1ecebf')
    this.tabList[0].label = t('ac445cdb.5d4d77')
    this.tabList[1].label = t('ac445cdb.2f182e')
    this.tabList[2].label = t('ac445cdb.01f9b3')
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

      Object.keys(member_data).forEach((key) => {
        this.chartData['new_user'].push({
          type: key.replace(/^\d{4}(\d{2})(\d{2})$/, '$1/$2'),
          sales: member_data[key].newAddMember
        })
        this.chartData['new_vip'].push({
          type: key.replace(/^\d{4}(\d{2})(\d{2})$/, '$1/$2'),
          sales: member_data[key].vipMember
        })
        this.chartData['new_svip'].push({
          type: key.replace(/^\d{4}(\d{2})(\d{2})$/, '$1/$2'),
          sales: member_data[key].svipMember
        })
      })
      this.drawChart('new_user')

      this.wait_delivery_count = notice_data.wait_delivery_count
      this.aftersales_count = notice_data.aftersales_count
      this.refund_errorlogs_count = notice_data.refund_errorlogs_count
      this.warning_goods_count = notice_data.warning_goods_count
      this.started_seckill_count = notice_data.started_seckill_count
      this.started_gtoups_count = notice_data.started_gtoups_count
    },
    drawChart(tab) {
      this.columnPlot = new Column(document.getElementById('member-chart'), {
        data: this.chartData[tab],
        xField: 'type',
        yField: 'sales',
        color: `l(90) 0:${parsehslTohsla(Config.themeConfig.primaryColor, 1)} 1:${parsehslTohsla(
          Config.themeConfig.primaryColor,
          0.5
        )}`
      })
      this.columnPlot.render()
    },
    handleTabChange(tab) {
      this.columnPlot.changeData(this.chartData[tab])
    }
  }
}
</script>

<style lang="scss" scoped>
// .notice-box {
//   width: calc((100% - 32px) / 3);
// }
</style>
