<style lang="scss"></style>
<template>
  <SpFinder
    ref="skuFinder"
    no-selection
    fixed-row-action
    url="/distributor/items"
    :hooks="{
      beforeSearch: beforeSearch,
      afterSearch: afterSearch
    }"
    :setting="setting"
  />
</template>

<script>
import { createSetting } from '@shopex/finder'
export default {
  name: '',
  props: {
    itemId: String,
    distributorId: String,
    isTotalStore:Boolean,
    isSuplier:Boolean
  },
  data() {
    return {
      setting: createSetting({
        columns: [
          {
            name: '商品编码',
            key: 'item_bn',
            width: 160
          },
          {
            name: '规格',
            key: 'item_spec_desc'
          },
          {
            name: '库存',
            key: 'store',
            width: 100,
            showType: !this.isTotalStore?'editable':"",
            componentProps: {
              change: async (v, row) => {
                await this.$api.marketing.updateDistributorItem({
                  distributor_id: this.distributorId,
                  item_id: row.item_id,
                  store: v
                })
                this.$refs.skuFinder.refresh()
              }
            }
          },
          {
            name: '商品价格（¥）',
            key: 'price',
            width: 160,
            // render: (h, { row }) => h('span', {}, row.price / 100),
            showType: !this.isTotalStore?'editable':"",
            componentProps: {
              change: async (v, row) => {
                await this.$api.marketing.updateDistributorItem({
                  distributor_id: this.distributorId,
                  item_id: row.item_id,
                  price: v * 100
                })
                this.$refs.skuFinder.refresh()
              }
            }
          },
          {
            name: '店铺销售状态',
            key: 'is_can_sale',
            render: (h, { row }) => h('span', {}, row.is_can_sale ? '可销售' : '不可销售')
          },
          {
            name: '上下架操作',
            render: (h, { row }) =>
              h('el-switch', {
                props: {
                  value: row.is_can_sale,
                  'active-value': true,
                  'inactive-value': false,
                  'disabled':this.IS_ADMIN() && this.VERSION_STANDARD() && this.isSuplier
                },
                on: {
                  change: async e => {
                    await this.$api.marketing.updateDistributorItem({
                      distributor_id: this.distributorId,
                      item_id: row.item_id,
                      is_can_sale: e
                    })
                    row.is_can_sale = e
                  }
                }
              })
          }
        ]
      })
    }
  },
  created() {},
  methods: {
    beforeSearch(params) {
      params = {
        ...params,
        is_sku: true,
        item_id: this.itemId,
        distributor_id: this.distributorId
      }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data

      list.forEach(item => {
        item.price = item.price / 100
      })
      return list
    },
    getApproveStatus(status) {
      const approveStatus = {
        1: '可售',
        0: '不可售'
      }
      return approveStatus[status] || '不可售'
    }
  }
}
</script>
