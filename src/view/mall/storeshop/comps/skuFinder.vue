<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

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
import { createSetting } from '@shopex-ui/finder'
export default {
  name: '',
  props: {
    itemId: String,
    distributorId: String,
    isTotalStore: Boolean,
    isSuplier: Boolean
  },
  data() {
    return {
      setting: createSetting({
        columns: [
          {
            name: this.$t('9d6614b0.f9d8b1'),
            key: 'item_bn',
            width: 160
          },
          {
            name: this.$t('9d6614b0.ea887b'),
            key: 'item_spec_desc'
          },
          {
            name: this.$t('9d6614b0.0eac88'),
            key: 'store',
            width: 100,
            showType: !this.isTotalStore ? 'editable' : '',
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
            name: this.$t('9d6614b0.cf187a'),
            key: 'price',
            width: 160,
            // render: (h, { row }) => h('span', {}, row.price / 100),
            showType: !this.isTotalStore ? 'editable' : '',
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
            name: this.$t('9d6614b0.19ff9d'),
            key: 'is_can_sale',
            render: (h, { row }) =>
              h(
                'span',
                {},
                row.is_can_sale ? this.$t('9d6614b0.076778') : this.$t('9d6614b0.ae83a3')
              )
          },
          {
            name: this.$t('9d6614b0.c1e70a'),
            render: (h, { row }) =>
              h('el-switch', {
                props: {
                  value: row.is_can_sale,
                  'active-value': true,
                  'inactive-value': false,
                  'disabled': this.IS_ADMIN() && this.VERSION_STANDARD() && this.isSuplier
                },
                on: {
                  change: async (e) => {
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

      list.forEach((item) => {
        item.price = item.price / 100
      })
      return list
    },
    getApproveStatus(status) {
      const approveStatus = {
        1: this.$t('9d6614b0.434e17'),
        0: this.$t('9d6614b0.b37fb8')
      }
      return approveStatus[status] || this.$t('9d6614b0.b37fb8')
    }
  }
}
</script>
