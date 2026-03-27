<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

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
    <div class="tip">{{ $t('73f755c3.0e97ba') }}</div>
    <div class="refund-store">
      <el-button type="text" @click="onSelectShop">{{ $t('73f755c3.afa2e6') }}</el-button>
      <SpFinder
        ref="finder"
        no-selection
        row-actions-align="left"
        :show-pager="false"
        :data="finderData"
        :setting="setting"
      />
    </div>
  </div>
</template>

<script>
import { createSetting } from '@shopex-ui/finder'
export default {
  name: 'RefundGoodsStore',
  data() {
    return {
      finderData: [],
      setting: createSetting({
        actions: [
          {
            name: this.$t('73f755c3.86048b'),
            key: 'apply',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                const index = this.finderData.findIndex((item) => item.id == row.id)
                this.finderData.splice(index, 1)
                this.$nextTick(() => {
                  this.$refs['finder'].refresh()
                })
              }
            }
          }
        ],
        columns: [{ name: this.$t('73f755c3.0d4934'), key: 'name', width: '700px' }]
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
      const ids = this.finderData.map((item) => item.distributor_id)
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
