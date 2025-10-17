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

    <div class="mt-4 grid grid-cols-2 gap-4">
      <div class="bg-white rounded-lg p-6 notice-box">
        <div class="text-[18px] text-[#333]">重要信息</div>
        <div class="flex flex-col gap-6 py-6">
          <div class="rounded-[8px] bg-[#f5f5f5] p-6">
            <div class="text-[16px] text-[#333]">订单相关</div>
            <div class="flex gap-6 h-10 items-center">
              <div>
                <span class="text-[#718096]">待发货订单：</span>
                <span class="text-[#333] text-[20px]">{{ wait_delivery_count }}</span>
              </div>
              <div>
                <span class="text-[#718096]">待处理退款：</span>
                <span class="text-[#333] text-[20px]">{{ aftersales_count }}</span>
              </div>
              <div>
                <span class="text-[#718096]">退款失败待处理：</span>
                <span class="text-[#333] text-[20px]">{{ refund_errorlogs_count }}</span>
              </div>
            </div>
          </div>
          <div class="rounded-[8px] bg-[#f5f5f5] p-6">
            <div class="text-[16px] text-[#333]">商品相关</div>
            <div class="flex gap-6 h-10 items-center">
              <div>
                <span class="text-[#718096]">库存预警商品：</span>
                <span class="text-[#333] text-[20px]">{{ warning_goods_count }}</span>
              </div>
            </div>
          </div>
          <div class="rounded-[8px] bg-[#f5f5f5] p-6">
            <div class="text-[16px] text-[#333]">营销相关</div>
            <div class="flex gap-6 h-10 items-center">
              <div>
                <span class="text-[#718096]">进行中的秒杀：</span>
                <span class="text-[#333] text-[20px]">{{ started_seckill_count }}</span>
              </div>
              <div>
                <span class="text-[#718096]">进行中的拼团：</span>
                <span class="text-[#333] text-[20px]">{{ started_gtoups_count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg p-6">
        <div class="flex justify-between items-center">
          <div class="text-[18px] text-[#333]">7天用户趋势</div>
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
    console.log(this.$store.state.user.accessMenus, '权限列表')
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

      Object.keys(member_data).forEach(key => {
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
