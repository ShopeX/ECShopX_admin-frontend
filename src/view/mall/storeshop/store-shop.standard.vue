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
    <SpFilterForm :model="formData" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="distributor_id" label="店铺:">
        <SpSelectShop
          ref="selectShop"
          v-model="formData.distributor_id"
          clearable
          placeholder="请选择"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="keywords" label="商品名称:">
        <el-input v-model="formData.keywords" placeholder="请输入商品名称" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="item_bn" label="商品货号:">
        <el-input v-model="formData.item_bn" placeholder="请输入商品货号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="barcode" label="商品条码:">
        <el-input v-model="formData.barcode" placeholder="请输入商品条码" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="supplier_name" label="所属供应商:">
        <el-input v-model="formData.supplier_name" placeholder="请输入所属供应商" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="approve_status" label="总部销售状态:">
        <el-select v-model="formData.approve_status" clearable placeholder="请选择">
          <el-option
            v-for="item in statusOption"
            :key="item.value"
            :label="item.title"
            size="mini"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
    </SpFilterForm>

    <div class="action-container">
      <el-button type="primary" @click="removeItemFromShop"> 从店铺移除 </el-button>
      <!-- <el-button type="primary" plain> 变更状态 </el-button> -->
      <el-button type="primary" @click="handleBatchDownload"> 商品码下载 </el-button>

      <el-button type="primary" @click="handleExport"> 导出 </el-button>

      <el-dropdown @command="onPatchAction">
        <el-button type="primary">
          批量操作<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="1">
            <span>批量上架</span>
          </el-dropdown-item>
          <el-dropdown-item command="2">
            <span>批量下架</span>
          </el-dropdown-item>
          <el-dropdown-item command="3">
            <span>总部库存</span>
          </el-dropdown-item>
          <el-dropdown-item command="4">
            <span>店铺库存</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="`tab-pane__${index}`"
        :label="item.name"
        :name="item.value"
      />
    </el-tabs>

    <SpFinder
      ref="finder"
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
      :title="`编辑商品【${itemSkuForm.itemName}】`"
      :form="itemSkuForm"
      :form-list="itemSkuFormList"
      @onSubmit="onItemSkuFormSubmit"
    />
  </SpPage>
</template>

<script>
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import { createSetting } from '@shopex/finder'
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
      { title: '全部', value: '' },
      { title: '前台可销售', value: 'onsale' },
      { title: '前台不展示', value: 'offline_sale' },
      { title: '前台仅展示', value: 'only_show' },
      { title: '不可销售', value: 'instock' }
    ]
    if (loginType == 'distributor') {
      statusOption = [
        { title: '全部', value: '' },
        { title: '审核驳回', value: 'rejected' },
        { title: '等待审核', value: 'processing' },
        { title: '前台可销售', value: 'onsale' },
        { title: '前台不展示', value: 'offline_sale' },
        { title: '前台仅展示', value: 'only_show' },
        { title: '不可销售', value: 'instock' }
      ]
    } else {
      statusOption = updateStatusOption
    }
    return {
      formData: {
        distributor_id: '',
        keywords: '',
        item_bn: '',
        barcode: '',
        supplier_name: '',
        approve_status: ''
      },
      statusOption: statusOption,
      finderData: [],
      finderUrl: '',
      tabList: [{ name: '全部商品', value: 'all' }],
      activeTab: 'all',
      selectItems: [],
      itemSkuDialog: false,
      itemSkuForm: {
        itemName: '',
        itemId: '',
        is_total_store:false
      },
      itemSkuFormList: [
        {
          key: 'invitation_code',
          component: () => (
            <skuFinder
              itemId={this.itemSkuForm.itemId}
              isTotalStore={this.itemSkuForm.is_total_store}
              distributorId={this.formData.distributor_id}
            />
          )
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['login_type']),
    setting() {
      return createSetting({
        actions: [
          {
            name: '设置SKU',
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                this.itemSkuForm.itemName = row.itemName
                this.itemSkuForm.itemId = row.itemId
                this.itemSkuForm.is_total_store = row.is_total_store
                this.itemSkuDialog = true
              }
            }
          }
        ],
        columns: [
          {
            name: '上下架操作',
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
                  change: async e => {
                    await this.$api.marketing.updateDistributorItem({
                      distributor_id: this.formData.distributor_id,
                      goods_id: row.goods_id,
                      is_can_sale: e
                    })
                    row.goods_can_sale = e
                  }
                }
              })
          },
          {
            name: '商品名称',
            key: 'item_name',
            width: 160
          },
          {
            name: 'sku编码',
            key: 'item_bn',
            width: 150,
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: '商品库存',
            key: 'store',
            width: 90
          },

          {
            name: '店铺库存',
            // key: 'order_num',
            render: (h, { row }) =>
              h('el-switch', {
                props: {
                  value: !row.is_total_store,
                  'active-value': true,
                  'inactive-value': false
                },
                on: {
                  change: async e => {
                    await this.$api.marketing.updateDistributorItem({
                      distributor_id: this.formData.distributor_id,
                      goods_id: row.goods_id,
                      is_total_store: !e
                    })
                    this.$refs.finder.refresh(true)
                  }
                }
              })
          },
          {
            name: '店铺销售状态',
            key: 'is_can_sale',
            width: 120,
            render: (h, { row }) => h('span', {}, row.is_can_sale ? '可销售' : '不可销售')
          },
          {
            name: '总部销售状态',
            width: 120,
            key: 'approve_status',
            formatter: (value, row, col) => {
              return this.statusOption.find(item => item.value === value)?.title
            }
          },
          {
            name: '市场价（¥）',
            key: 'market_price',
            width: 120,
            render: (h, { row }) => h('span', {}, row.market_price / 100)
          },
          {
            name: '销售价（¥）',
            key: 'price',
            width: 120,
            showType: this.login_type == 'admin' ? 'editable' : '',
            componentProps: {
              change: async (v, row) => {
                await this.$api.marketing.updateDistributorItem({
                  distributor_id: row.distributor_id,
                  item_id: row.item_id,
                  price: v * 100
                })
                this.$refs.finder.refresh()
              }
            }
          },
          {
            name: '成本价（¥）',
            key: 'cost_price',
            width: 120,
            render: (h, { row }) => h('span', {}, row.cost_price / 100)
          },
          {
            name: '毛利率（%)',
            key: 'gross_profit_rate',
            width: 100,
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: '来源供应商',
            key: 'supplier_name',
            width: 100
          },
          { name: '销售分类', key: 'itemCatName', minWidth: 120 },
          {
            name: '标签',
            width: 120,
            key: 'tagList',
            render: (h, scope) => (
              <div style="white-space: normal;">
                {scope.row.tagList?.map(item => (
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
            name: '来源店铺',
            key: 'distributor_name',
            width: 160
          }
        ]
      })
    }
  },
  created() {
    this.getDefaultDistributor()
  },
  methods: {
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    async getDefaultDistributor() {
      if (!this.formData.distributor_id) {
        const { distributor_id, name } = await this.$api.marketing.getDistributorInfo({
          distributor_id: 0
        })
        this.formData.distributor_id = distributor_id
        if (this.$refs.selectShop) {
          this.$refs.selectShop.selectValue = name
        }
      }
      this.finderUrl = '/distributor/items'
      this.finderData = undefined
    },
    beforeSearch(params) {
      const formData = this.formData
      params = {
        ...params,
        ...formData,
        is_can_sale: '_all'
      }
      return params
    },
    afterSearch({ data }) {
      data.data.list.forEach(item => {
        item.price = item.price / 100
      })
      return data
    },
    onSelectionChange(val) {
      this.selectItems = val
    },
    getApproveStatus(status) {
      const approveStatus = {
        1: '可售',
        0: '不可售'
      }
      return approveStatus[status] || '不可售'
    },
    // 删除商品
    async removeItemFromShop() {
      if (this.selectItems.length == 0) {
        return this.$message.error('请至少选择一个商品')
      }
      await this.$confirm('请确认是否删除商品', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      const { distributor_id } = this.formData
      await this.$api.marketing.deleteDistributorItems({
        distributor_id,
        item_ids: this.selectItems.map(item => item.goods_id)
      })
      this.$message.success('商品删除成功')
      this.$refs.finder.refresh(true)
    },
    // 批量下载商品码
    handleBatchDownload(val) {
      if (this.selectItems.length == 0) {
        return this.$message.error('请至少选择一个商品')
      }
      const zip = new JSZip()
      const requests = []
      const { distributor_id } = this.formData
      this.selectItems.forEach(item => {
        const url = `${this.BASE_API}/goods/distributionGoodsWxaCodeStream?item_id=${item.itemId}&distributor_id=${distributor_id}`
        requests.push(getFileBlob(url))
      })
      Promise.all(requests).then(res => {
        res.forEach((file, index) => {
          zip.file(`${this.selectItems[index].itemName}.png`, file, { binary: true }) // 逐个添加文件
        })
        zip.generateAsync({ type: 'blob' }).then(content => {
          FileSaver.saveAs(content, '店铺的商品小程序码(批量).zip') // 利用file-saver保存文件
        })
      })
    },
    // 导出
    async handleExport() {
      const exportParams = {
        ...this.formData,
        goods_ids: this.selectItems.map(item => item.goods_id)
      }
      const { status } = await this.$api.marketing.exportDistributorItems(exportParams)
      if (status) {
        this.$message.success('已加入执行队列，请在设置-导出列表中下载')
        this.$export_open('distributor_items')
      }
    },
    onItemSkuFormSubmit() {
      this.itemSkuDialog = false
      this.$refs.finder.refresh(true)
    },
    async onPatchAction(command) {
      if (this.selectItems.length == 0) {
        return this.$message.error('请至少选择一个商品')
      }
      if (command == '1' || command == '2') {
        await this.$api.marketing.updateDistributorItem({
          distributor_id: this.formData.distributor_id,
          goods_id: JSON.stringify(this.selectItems.map(item => item.goods_id)),
          is_can_sale: command == '1'
        })
        this.$refs.finder.refresh()
      } else if (command == '3' || command == '4') {
        await this.$api.marketing.updateDistributorItem({
          distributor_id: this.formData.distributor_id,
          goods_id: JSON.stringify(this.selectItems.map(item => item.goods_id)),
          is_total_store: command == '3'
        })
        this.$refs.finder.refresh(true)
      }
    }
  }
}
</script>
