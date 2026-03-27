<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" scoped>
.sp-filter-form {
  margin-bottom: 16px;
}

.sp-finder {
  .sp-finder-hd {
    margin-bottom: 0;
  }
}
</style>
<style lang="scss">
.sku-dialog {
  .el-dialog__body {
    padding: 0;
  }

  .el-form {
    margin-right: 0 !important;
  }

  .el-form-item {
    margin-bottom: 0 !important;
  }

  .el-form-item__content {
    margin-left: 0 !important;
  }
}
</style>
<template>
  <SpPage class="">
    <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />
    <SpFormPlus
      ref="searchForm"
      v-model="searchParams"
      :form-items="searchFormItems"
      form-type="searchForm"
      @submit="onSearch"
    />

    <div class="action-container mt-4">
      <el-button type="primary" @click="removeItemFromShop">
        {{ $t('8c556aa3.28d855') }}
      </el-button>
      <!-- <el-button type="primary" plain> 变更状态 </el-button> -->
      <el-button type="primary" @click="handleBatchDownload">
        {{ $t('8c556aa3.1a40b3') }}
      </el-button>

      <el-button type="primary" @click="handleExport"> {{ $t('8c556aa3.55405e') }} </el-button>

      <el-dropdown @command="onPatchAction">
        <el-button type="primary">
          {{ $t('8c556aa3.7f7c62') }}<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="1">
            <span>{{ $t('8c556aa3.644c0d') }}</span>
          </el-dropdown-item>
          <el-dropdown-item command="2">
            <span>{{ $t('8c556aa3.d5e015') }}</span>
          </el-dropdown-item>
          <el-dropdown-item command="3">
            <span>{{ $t('8c556aa3.7fcc60') }}</span>
          </el-dropdown-item>
          <el-dropdown-item command="4">
            <span>{{ $t('8c556aa3.12e91b') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="`tab-pane__${index}`"
        :label="item.name"
        :name="item.value"
      />
    </el-tabs>

    <SpFinder
      ref="finder"
      v-loading="loading"
      fixed-row-action
      :setting="setting"
      :hooks="{
        beforeSearch: beforeSearch,
        afterSearch: afterSearch
      }"
      :data="finderData"
      :url="finderUrl"
      @selection-change="onSelectionChange"
      row-actions-fixed-align="left"
    />

    <!-- 商品sku配置 -->
    <SpDialog
      v-if="itemSkuDialog"
      ref="itemSkuRef"
      v-model="itemSkuDialog"
      class="sku-dialog"
      width="1100px"
      destroy-on-close
      :title="$t('8c556aa3.7d3792') + '【' + itemSkuForm.itemName + '】'"
      :form="itemSkuForm"
      :form-list="itemSkuFormList"
      @onSubmit="onItemSkuFormSubmit"
    />
  </SpPage>
</template>

<script>
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import { createSetting } from '@shopex-ui/finder'
import { getFileBlob } from '@/api/common'
import skuFinder from './comps/skuFinder'
import { mapGetters } from 'vuex'
export default {
  components: {
    skuFinder
  },
  data() {
    const loginType = this.$store.getters.login_type
    let statusOption
    let updateStatusOption = [
      { title: this.$t('8c556aa3.a8b0c2'), value: '' },
      { title: this.$t('8c556aa3.9b7481'), value: 'onsale' },
      { title: this.$t('8c556aa3.2c50a0'), value: 'offline_sale' },
      { title: this.$t('8c556aa3.acf86b'), value: 'only_show' },
      { title: this.$t('8c556aa3.ae83a3'), value: 'instock' }
    ]
    if (loginType == 'distributor') {
      statusOption = [
        { title: this.$t('8c556aa3.a8b0c2'), value: '' },
        { title: this.$t('8c556aa3.a77aa8'), value: 'rejected' },
        { title: this.$t('8c556aa3.f6324c'), value: 'processing' },
        { title: this.$t('8c556aa3.9b7481'), value: 'onsale' },
        { title: this.$t('8c556aa3.2c50a0'), value: 'offline_sale' },
        { title: this.$t('8c556aa3.acf86b'), value: 'only_show' },
        { title: this.$t('8c556aa3.ae83a3'), value: 'instock' }
      ]
    } else {
      statusOption = updateStatusOption
    }
    return {
      selectShopRef: null,
      searchParams: {
        distributor_id: '',
        keywords: '',
        item_bn: '',
        barcode: '',
        supplier_name: '',
        approve_status: '',
        brand_id: ''
      },
      goodsBranchList: [],
      goodsBranchParams: {
        page: 1,
        pageSize: 1000,
        attribute_type: 'brand',
        attribute_name: ''
      },
      statusOption: statusOption,
      finderData: [],
      finderUrl: '',
      tabList: [
        { name: this.$t('8c556aa3.794a4e'), value: 'first' },
        { name: this.$t('8c556aa3.2390fa'), value: 'second' },
        { name: this.$t('8c556aa3.25744b'), value: 'third' }
      ],
      activeTab: 'first',
      selectItems: [],
      itemSkuDialog: false,
      editPrice: null,
      editRow: {},
      itemSkuForm: {
        itemName: '',
        itemId: '',
        is_total_store: false
      },
      loading: false,
      itemSkuFormList: [
        {
          key: 'invitation_code',
          component: () => (
            <skuFinder
              itemId={this.itemSkuForm.itemId}
              isSuplier={this.editRow.supplier_id != '0'}
              isTotalStore={this.itemSkuForm.is_total_store}
              distributorId={this.searchParams.distributor_id}
            />
          )
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['login_type']),
    // 搜索表单配置
    searchFormItems() {
      return [
        {
          fieldName: 'distributor_id',
          label: this.$t('8c556aa3.295713'),
          component: ({ value, onInput, h }) => {
            return h('SpSelectShop', {
              props: {
                value: value,
                clearable: true,
                size: 'small',
                placeholder: this.$t('8c556aa3.708c9d'),
                queryParams: { is_valid: true }
              },
              ref: (vm) => {
                if (vm) {
                  this.selectShopRef = vm
                }
              },
              on: {
                input: onInput
              }
            })
          },
          cellWidth: 1.3
        },
        {
          fieldName: 'keywords',
          label: this.$t('8c556aa3.1fd1d5'),
          component: 'input',
          cellWidth: 1.3,
          componentProps: {
            placeholder: this.$t('8c556aa3.d83187')
          }
        },
        {
          fieldName: 'brand_id',
          label: this.$t('8c556aa3.09307c'),
          component: 'select',
          cellWidth: 1.3,
          componentProps: {
            placeholder: this.$t('8c556aa3.2dd7e1'),
            remote: true,
            filterable: true,
            clearable: true,
            remoteMethod: this.getGoodsBranchList,
            options: this.goodsBranchList.map((item) => ({
              label: item.attribute_name,
              value: item.attribute_id
            }))
          }
        },
        {
          fieldName: 'brand_id',
          label: '品牌',
          component: 'select',
          cellWidth: 1.3,
          componentProps: {
            placeholder: '商品/商标关键词',
            remote: true,
            filterable: true,
            clearable: true,
            remoteMethod: this.getGoodsBranchList,
            options: this.goodsBranchList.map((item) => ({
              label: item.attribute_name,
              value: item.attribute_id
            }))
          }
        },
        {
          fieldName: 'item_bn',
          label: this.$t('8c556aa3.e9de29'),
          component: 'input',
          cellWidth: 1.3,
          componentProps: {
            placeholder: this.$t('8c556aa3.35a59c')
          }
        },
        {
          fieldName: 'barcode',
          label: this.$t('8c556aa3.f64e95'),
          component: 'input',
          cellWidth: 1.3,
          componentProps: {
            placeholder: this.$t('8c556aa3.f17e38')
          }
        },
        {
          fieldName: 'supplier_name',
          label: this.$t('8c556aa3.40b1be'),
          component: 'input',
          cellWidth: 1.3,
          componentProps: {
            placeholder: this.$t('8c556aa3.5765f1')
          }
        },
        {
          fieldName: 'approve_status',
          label: this.$t('8c556aa3.889f3e'),
          component: 'select',
          cellWidth: 1.3,
          componentProps: {
            clearable: true,
            placeholder: this.$t('8c556aa3.708c9d'),
            options: this.statusOption.map((item) => ({
              label: item.title,
              value: item.value
            }))
          }
        }
      ]
    },
    setting() {
      return createSetting({
        actions: [
          {
            name: this.$t('8c556aa3.2b158b'),
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                this.itemSkuForm.itemName = row.itemName
                this.itemSkuForm.itemId = row.itemId
                this.itemSkuForm.is_total_store = row.is_total_store
                this.editRow = row
                this.itemSkuDialog = true
              }
            }
          }
        ],
        columns: [
          {
            name: this.$t('8c556aa3.c1e70a'),
            width: 120,
            render: (h, { row }) =>
              h('el-switch', {
                props: {
                  value: row.goods_can_sale,
                  'active-value': true,
                  'inactive-value': false
                  // 'disabled': this.IS_ADMIN() && row.is_market == '0'
                },
                on: {
                  change: async (e) => {
                    await this.$api.marketing.updateDistributorItem({
                      distributor_id: this.searchParams.distributor_id,
                      goods_id: row.goods_id,
                      is_can_sale: e
                    })
                    row.goods_can_sale = e
                    this.$message.success(this.$t('8c556aa3.33130f'))
                    this.$refs.finder.refresh()
                  }
                }
              })
          },
          {
            name: this.$t('8c556aa3.1fd1d5'),
            key: 'item_name',
            width: 160
          },
          {
            name: this.$t('8c556aa3.0888fc'),
            key: 'item_bn',
            width: 150
          },
          {
            name: this.$t('8c556aa3.24bc52'),
            key: 'store',
            width: 90
          },

          {
            name: this.$t('8c556aa3.12e91b'),
            // key: 'order_num',
            render: (h, { row }) =>
              h('el-switch', {
                props: {
                  value: !row.is_total_store,
                  'active-value': true,
                  'inactive-value': false,
                  disabled: this.IS_ADMIN() && this.VERSION_STANDARD() && row.supplier_id != '0'
                },
                on: {
                  change: async (e) => {
                    await this.$api.marketing.updateDistributorItem({
                      distributor_id: this.searchParams.distributor_id,
                      goods_id: row.goods_id,
                      is_total_store: !e
                    })
                    this.$refs.finder.refresh()
                  }
                }
              })
          },
          {
            name: this.$t('8c556aa3.19ff9d'),
            key: 'is_can_sale',
            width: 120,
            render: (h, { row }) =>
              h(
                'span',
                {},
                row.is_can_sale ? this.$t('8c556aa3.076778') : this.$t('8c556aa3.ae83a3')
              )
          },
          {
            name: this.$t('8c556aa3.889f3e'),
            width: 120,
            key: 'approve_status',
            formatter: (value, row, col) => {
              return this.statusOption.find((item) => item.value === value)?.title
            }
          },
          {
            name: this.$t('8c556aa3.5cd87e'),
            key: 'market_price',
            width: 120,
            render: (h, { row }) => h('span', {}, row.market_price / 100)
          },
          // {
          //   name: '销售价（¥）',
          //   key: 'price',
          //   width: 120,
          //   showType: this.login_type == 'admin'  ? 'editable' : '',
          //   componentProps: {
          //     change: async (v, row) => {
          //       await this.$api.marketing.updateDistributorItem({
          //         distributor_id: row.distributor_id,
          //         item_id: row.item_id,
          //         price: v * 100
          //       })
          //       this.$refs.finder.refresh()
          //     }
          //   }
          // },
          {
            name: this.$t('8c556aa3.cf0170'),
            key: 'price',
            width: 120,
            render: (h, { row }) => (
              <div>
                {row.price}
                {this.IS_ADMIN() && this.VERSION_STANDARD() && row.supplier_id == '0' && (
                  <el-popover
                    placement='top'
                    trigger='hover'
                    on-show={() => (this.editPrice = row.price)}
                  >
                    <div class='popover-edit flex'>
                      <el-input
                        v-model={this.editPrice}
                        class='edit-input'
                        placeholder={this.$t('8c556aa3.6f2838')}
                      />
                      <el-button
                        type='primary'
                        size='mini'
                        class='ml-1'
                        on-click={this.onModifyItemPrice.bind(this, row)}
                      >
                        {this.$t('8c556aa3.38cf16')}
                      </el-button>
                    </div>
                    <el-button slot='reference' type='text'>
                      <i class='el-icon-edit' />
                    </el-button>
                  </el-popover>
                )}
              </div>
            )
          },
          {
            name: this.$t('8c556aa3.066804'),
            key: 'cost_price',
            width: 120,
            render: (h, { row }) => h('span', {}, row.cost_price / 100)
          },
          {
            name: this.$t('8c556aa3.4d02c7'),
            key: 'gross_profit_rate',
            width: 100,
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: this.$t('8c556aa3.55c61d'),
            key: 'supplier_name',
            width: 100
          },
          { name: this.$t('8c556aa3.392d49'), key: 'itemCatName', minWidth: 120 },
          {
            name: this.$t('8c556aa3.14d342'),
            width: 120,
            key: 'tagList',
            render: (h, scope) => (
              <div style='white-space: normal;'>
                {scope.row.tagList?.map((item) => (
                  <span
                    style={{
                      color: item.font_color,
                      'background-color': item.tag_color,
                      'font-size': '12px',
                      padding: '2px 5px',
                      'border-radius': '2px',
                      margin: '0 8px 8px 0'
                    }}
                  >
                    {item.tag_name}
                  </span>
                ))}
              </div>
            )
          },
          {
            name: this.$t('8c556aa3.53cc55'),
            key: 'distributor_name',
            width: 160
          }
        ]
      })
    }
  },
  created() {
    this.getDefaultDistributor()
    this.getGoodsBranchList()
  },
  methods: {
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    async getDefaultDistributor() {
      if (!this.searchParams.distributor_id) {
        {
          /* const { distributor_id, name } = await this.$api.marketing.getDistributorInfo({
          distributor_id: 0
        }) */
        }

        // 获取店铺列表中第一个店铺
        const { list, total_count } = await this.$api.marketing.getDistributorList({
          page: 1,
          pageSize: 10,
          is_valid: true
        })
        if (list.length > 0) {
          const { distributor_id, name } = list[0]
          this.searchParams.distributor_id = distributor_id
          this.$nextTick(() => {
            if (this.selectShopRef) {
              // 使用 onChange 方法设置值，这样会同时更新 selectValue 和 value
              this.selectShopRef.onChange({ name, value: distributor_id })
            }
          })
        }
      }
      this.finderUrl = '/distributor/items'
      this.finderData = undefined
    },
    beforeSearch(params) {
      const searchParams = this.searchParams
      params = {
        ...params,
        ...searchParams,
        is_can_sale: this.activeTab == 'second' ? true : this.activeTab == 'third' ? false : '_all'
      }
      return params
    },
    afterSearch({ data }) {
      data.data.list.forEach((item) => {
        item.price = item.price / 100
      })
      return data
    },
    onSelectionChange(val) {
      this.selectItems = val
    },
    getApproveStatus(status) {
      const approveStatus = {
        1: this.$t('8c556aa3.434e17'),
        0: this.$t('8c556aa3.b37fb8')
      }
      return approveStatus[status] || this.$t('8c556aa3.b37fb8')
    },
    async removeItemFromShop() {
      if (this.selectItems.length == 0) {
        return this.$message.error(this.$t('8c556aa3.20e46f'))
      }
      await this.$confirm(this.$t('8c556aa3.44d6f7'), this.$t('8c556aa3.02d981'), {
        confirmButtonText: this.$t('8c556aa3.38cf16'),
        cancelButtonText: this.$t('8c556aa3.625fb2')
      })
      const { distributor_id } = this.searchParams
      await this.$api.marketing.deleteDistributorItems({
        distributor_id,
        item_ids: this.selectItems.map((item) => item.goods_id)
      })
      this.$message.success(this.$t('8c556aa3.a6cbc7'))
      this.$refs.finder.refresh(true)
    },
    handleBatchDownload(val) {
      if (this.selectItems.length == 0) {
        return this.$message.error(this.$t('8c556aa3.20e46f'))
      }
      const zip = new JSZip()
      const requests = []
      const { distributor_id } = this.searchParams
      this.selectItems.forEach((item) => {
        const url = `${this.BASE_API}/goods/distributionGoodsWxaCodeStream?item_id=${item.itemId}&distributor_id=${distributor_id}`
        requests.push(getFileBlob(url))
      })
      Promise.all(requests).then((res) => {
        res.forEach((file, index) => {
          zip.file(`${this.selectItems[index].itemName}.png`, file, { binary: true })
        })
        zip.generateAsync({ type: 'blob' }).then((content) => {
          FileSaver.saveAs(content, this.$t('8c556aa3.b9bca0'))
        })
      })
    },
    async handleExport() {
      const exportParams = {
        ...this.searchParams,
        goods_ids: this.selectItems.map((item) => item.goods_id)
      }
      const { status } = await this.$api.marketing.exportDistributorItems(exportParams)
      if (status) {
        this.$message.success(this.$t('8c556aa3.3e1ddd'))
        this.$export_open('distributor_items')
      }
    },
    async onModifyItemPrice(row) {
      await this.$api.marketing.updateDistributorItem({
        distributor_id: row.distributor_id,
        item_id: row.item_id,
        price: this.editPrice * 100
      })
      this.$refs.finder.refresh()
    },
    onItemSkuFormSubmit() {
      this.itemSkuDialog = false
      this.$refs.finder.refresh()
    },
    async onPatchAction(command) {
      if (this.selectItems.length == 0) {
        return this.$message.error(this.$t('8c556aa3.20e46f'))
      }
      if (command == '1' || command == '2') {
        this.loading = true
        try {
          await this.$api.marketing.updateDistributorItem({
            distributor_id: this.searchParams.distributor_id,
            goods_id: JSON.stringify(this.selectItems.map((item) => item.goods_id)),
            is_can_sale: command == '1'
          })
          this.$message.success(this.$t('8c556aa3.33130f'))
          this.$refs.finder.refresh()
        } catch (error) {
          this.$message.error(this.$t('8c556aa3.5fa802'))
        } finally {
          this.loading = false
        }
      } else if (command == '3' || command == '4') {
        this.loading = true
        let remainItems = []
        if (this.IS_ADMIN() && this.VERSION_STANDARD()) {
          remainItems = this.selectItems.filter((item) => item.supplier_id == '0')
        }
        if (!remainItems.length) {
          this.$refs.finder.refresh(true)
          return
        }
        try {
          await this.$api.marketing.updateDistributorItem({
            distributor_id: this.searchParams.distributor_id,
            goods_id: JSON.stringify(remainItems.map((item) => item.goods_id)),
            is_total_store: command == '3'
          })
          this.$message.success(this.$t('8c556aa3.33130f'))
          this.$refs.finder.refresh(true)
        } catch (error) {
          this.$message.error(this.$t('8c556aa3.5fa802'))
        } finally {
          this.loading = false
        }
      }
    },
    handleTabClick() {
      this.$refs.finder.refresh()
    },
    async getGoodsBranchList(searchVal = '') {
      this.goodsBranchParams.attribute_name = searchVal
      const { list } = await this.$api.goods.getGoodsAttr(this.goodsBranchParams)
      this.goodsBranchList = list
    }
  }
}
</script>
