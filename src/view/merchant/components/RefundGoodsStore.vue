<style lang="scss">
.refund-goods-store {
  margin-top: 12px;
  line-height: initial;
  .tip {
    font-size: 13px;
    color: #999;
  }
  .refund-store {
    margin-top: 8px;
  }
}
</style>
<template>
  <div class="refund-goods-store">
    <div class="tip">本店订单买家发起退货退款申请时可选择此列表店铺的退货点完成到店退货。</div>
    <div class="refund-store">
      <el-button type="text" @click="onSelectShop">选择店铺</el-button>
      <SpFinder
        ref="finder"
        no-selection
        :show-pager="false"
        :data="finderData"
        :setting="setting"
      />
    </div>
  </div>
</template>

<script>
import { createSetting } from '@shopex/finder'
export default {
  name: 'RefundGoodsStore',
  data() {
    return {
      finderData: [],
      setting: createSetting({
        actions: [
          {
            name: '移除',
            key: 'apply',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                const index = this.finderData.findIndex(item => item.id == row.id)
                this.finderData.splice(index, 1)
                this.$nextTick(() => {
                  this.$refs['finder'].refresh()
                })
              }
            }
          }
        ],
        columns: [{ name: '店铺名称', key: 'name', width: '700px' }]
      })
    }
  },
  created() {},
  mounted() {
    const { distributor_id } = this.$route.query
    if (distributor_id) {
      this.fetchData()
    }
  },
  methods: {
    async fetchData() {
      const { distributor_id } = this.$route.query
      const { list } = await this.$api.marketing.getAftersales({
        distributor_id: distributor_id,
        is_selected: 1
      })
      this.finderData = list
      this.$nextTick(() => {
        this.$refs['finder'].refresh()
      })
    },
    async onSelectShop() {
      const { distributor_id } = this.$route.query
      const ids = this.finderData.map(item => item.distributor_id)
      const { data } = await this.$picker.afterSalesList({
        data: ids,
        distributor_id: distributor_id
        // merchant_id: this.content.baseForm.merchant_id
      })
      this.finderData = data
      this.$nextTick(() => {
        this.$refs['finder'].refresh()
      })
    }
  }
}
</script>
