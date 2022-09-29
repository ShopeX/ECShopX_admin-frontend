<style lang="scss">
.sku-finder {
  .edittext-col {
    .edit-box {
      display: block;
    }
  }
}

.popover-edit {
  display: flex;
  .edit-input {
    margin-right: 10px;
  }
}
</style>
<template>
  <SpFinder
    ref="skuFinder"
    class="sku-finder"
    no-selection
    fixed-row-action
    url="/distributor/items"
    :hooks="{
      beforeSearch: beforeSearch
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
    distributorId: String
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
            // showType: 'editable',
            // componentProps: {
            //   change: async (v, row) => {
            //     await this.$api.marketing.updateDistributorItem({
            //       distributor_id: this.distributorId,
            //       item_id: row.item_id,
            //       store: v
            //     })
            //     this.$refs.skuFinder.refresh()
            //   }
            // },
            render: (h, { row }) => {
              if (row.is_total_store) {
                return <span>{row.store}</span>
              } else {
                return (
                  <div>
                    <span>{row.store}</span>
                    <el-popover
                      placement='top'
                      trigger='hover'
                      on-show={() => this.onShowPopover(row)}
                    >
                      <div class='popover-edit'>
                        <el-input
                          v-model={this.skuEditInput}
                          class='edit-input'
                          placeholder='请输入库存'
                        />
                        <el-button
                          type='primary'
                          size='mini'
                          on-click={this.onModifyItemSku.bind(this, row)}
                        >
                          确定
                        </el-button>
                      </div>

                      <el-button slot='reference' type='text'>
                        <i class='el-icon-edit' />
                      </el-button>
                    </el-popover>
                  </div>
                )
              }
            }
          },
          {
            name: '商品价格（¥）',
            key: 'price',
            width: 160,
            render: (h, { row }) => h('span', {}, row.price / 100)
          },
          {
            name: '状态',
            key: 'is_can_sale',
            render: (h, { row }) => h('span', {}, this.getApproveStatus(row.is_can_sale))
          }
          // {
          //   name: '上下架操作',
          //   render: (h, { row }) =>
          //     h('el-switch', {
          //       props: {
          //         'value': row.is_can_sale,
          //         'active-value': true,
          //         'inactive-value': false
          //       },
          //       on: {
          //         change: async (e) => {
          //           await this.$api.marketing.updateDistributorItem({
          //             distributor_id: this.distributorId,
          //             item_id: row.item_id,
          //             is_can_sale: e
          //           })
          //           row.is_can_sale = e
          //         }
          //       }
          //     })
          // }
        ]
      }),
      skuEditInput: ''
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
    getApproveStatus(status) {
      return status ? '前台可售' : '前台不可售'
      // const approveStatus = {
      //   onsale: '前台可销售',
      //   offline_sale: '前台不展示'
      // }
      // return approveStatus[status] || '不可销售'
    },
    onShowPopover({ store }) {
      this.skuEditInput = store
    },
    async onModifyItemSku({ item_id }) {
      await this.$api.marketing.updateDistributorItem({
        distributor_id: this.distributorId,
        item_id: item_id,
        store: this.skuEditInput
      })
      this.$refs.skuFinder.refresh()
    }
  }
}
</script>
