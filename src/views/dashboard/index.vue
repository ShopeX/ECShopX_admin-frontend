<template>
  <SpPage>
    <div class="grid grid-cols-3 gap-4">
      <div v-for="(item, index) in realTimeData" :key="index">
        <div class="flex flex-col bg-white rounded-lg border">
          <div class="p-5 text-md text-card-foreground">{{ item.label }}</div>
          <div class="flex items-end px-5 pb-5">
            <div class="text-2xl">{{ item.today }}</div>
            <div class="text-sm text-muted-foreground ml-2 relative bottom-1">
              昨日:{{ item.yesterday }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 flex gap-4">
      <div class="bg-white rounded-lg border p-4 flex-1">
        <SpTabs :tab-list="tabList" v-model="activeTab" @change="handleTabChange" />
        <div id="member-chart" class="h-[300px] mt-4" />
      </div>
      <div class="bg-white rounded-lg border p-4 notice-box">1</div>
    </div>
  </SpPage>
</template>

<script>
import { Column } from '@antv/g2plot'
import { formatPrice } from '@/utils'
export default {
  data() {
    return {
      realTimeData: {
        payed_fee: {
          label: '实付金额',
          today: 0,
          yesterday: 0
        },
        atv: {
          label: '客单价',
          today: 0,
          yesterday: 0
        },
        refunded_fee: {
          label: '退款金额',
          today: 0,
          yesterday: 0
        },
        payed_orders: {
          label: '实付订单数',
          today: 0,
          yesterday: 0
        },
        payed_members: {
          label: '实付会员数',
          today: 0,
          yesterday: 0
        },
        aftersale_count: {
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
      chartData: {
        new_user: [],
        new_vip: [],
        new_svip: []
      }
    }
  },
  mounted() {
    this.getCompanyStatistics()
  },
  methods: {
    async getCompanyStatistics() {
      const { member_data, notice_data, today_data, yesterday_data } =
        await this.$api.company.getCompanyStatistics()
      this.realTimeData.payed_fee.today = formatPrice(today_data.real_payed_fee)
      this.realTimeData.payed_fee.yesterday = formatPrice(yesterday_data.real_payed_fee)
      this.realTimeData.payed_orders.today = today_data.real_payed_orders
      this.realTimeData.payed_orders.yesterday = yesterday_data.real_payed_orders
      this.realTimeData.payed_members.today = today_data.real_payed_members
      this.realTimeData.payed_members.yesterday = yesterday_data.real_payed_members
      this.realTimeData.atv.today = formatPrice(today_data.real_atv)
      this.realTimeData.atv.yesterday = formatPrice(yesterday_data.real_atv)
      this.realTimeData.refunded_fee.today = formatPrice(today_data.real_refunded_fee)
      this.realTimeData.refunded_fee.yesterday = formatPrice(yesterday_data.real_refunded_fee)
      this.realTimeData.aftersale_count.today = today_data.real_aftersale_count
      this.realTimeData.aftersale_count.yesterday = yesterday_data.real_aftersale_count

      Object.keys(member_data).forEach(key => {
        this.chartData['new_user'].push({
          type: key.replace(/^\d{4}(\d{2})(\d{2})$/, '$1月$2日'),
          sales: member_data[key].newAddMember
        })
        this.chartData['new_vip'].push({
          type: key.replace(/^\d{4}(\d{2})(\d{2})$/, '$1月$2日'),
          sales: member_data[key].vipMember
        })
        this.chartData['new_svip'].push({
          type: key.replace(/^\d{4}(\d{2})(\d{2})$/, '$1月$2日'),
          sales: member_data[key].svipMember
        })
      })
      this.drawChart('new_user')
    },
    drawChart(tab) {
      this.columnPlot = new Column(document.getElementById('member-chart'), {
        data: this.chartData[tab],
        xField: 'type',
        yField: 'sales'
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
.notice-box {
  width: calc((100% - 32px) / 3);
}
</style>
