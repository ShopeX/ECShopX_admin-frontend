<style lang="scss" scope>
.sp-filter-form {
  margin-bottom: 16px;
}
.sp-finder {
  .sp-finder-hd {
    margin-bottom: 0;
  }
}
</style>
<template>
  <div class="">
    <SpFilterForm :model="formData" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="keywords" label="店铺:">
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
    </SpFilterForm>

    <div class="action-container">
      <el-button type="primary" plain> 从店铺移除 </el-button>
      <el-button type="primary" plain> 变更状态 </el-button>
      <el-button type="primary" plain @click="handleBatchDownload"> 商品码下载 </el-button>
      <export-tip @exportHandle="handleExport">
        <el-button type="primary" plain> 导出 </el-button>
      </export-tip>
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
        beforeSearch: beforeSearch
        // afterSearch: afterSearch
      }"
      :data="finderData"
      :url="finderUrl"
      @selection-change="onSelectionChange"
    />
  </div>
</template>

<script>
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import { createSetting } from '@shopex/finder'
import { getFileBlob } from '@/api/common'
export default {
  data() {
    return {
      formData: {
        distributor_id: '',
        keywords: '',
        item_bn: '',
        barcode: ''
      },
      finderData: [],
      finderUrl: '',
      tabList: [{ name: '全部商品', value: 'all' }],
      activeTab: 'all',
      selectItems: [],
      setting: createSetting({
        actions: [
          {
            name: '设置SKU',
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                this.$router.push({
                  path: `${this.$route.path}/detail?id=${row.id}`
                })
              }
            }
          }
          // {
          //   name: this.IS_ADMIN ? '结算' : '确认',
          //   key: 'settlement',
          //   type: 'button',
          //   buttonType: 'text',
          //   visible: (row) => {
          //     if (this.IS_ADMIN && row.statement_status == 'confirmed') {
          //       return true
          //     }
          //     if (this.IS_DISTRIBUTOR && row.statement_status == 'ready') {
          //       return true
          //     }
          //     return false
          //   },
          //   action: {
          //     handler: async ([row]) => {
          //       await this.$confirm(`结算单号【${row.statement_no}】，确认是否结算？`, '提示', {
          //         confirmButtonText: '确定',
          //         cancelButtonText: '取消'
          //       })
          //       await this.$api.financial.confirmStatement(row.id)
          //       this.$message.success('操作成功')
          //       this.onSearch()
          //     }
          //   }
          // }
        ],
        columns: [
          {
            name: '上下架操作',
            // key: 'is_can_sale',
            render: (h, { row }) =>
              h('el-switch', {
                props: {
                  'value': row.is_can_sale,
                  'active-value': true,
                  'inactive-value': false
                },
                on: {
                  change: async (e) => {
                    await this.$api.marketing.updateDistributorItem({
                      distributor_id: this.formData.distributor_id,
                      item_id: row.item_id,
                      is_can_sale: e
                    })
                    row.is_can_sale = e
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
            name: '商品库存',
            key: 'store',
            width: 160
          },
          {
            name: '商品价格（¥）',
            key: 'price',
            render: (h, { row }) => h('span', {}, row.price / 100)
          },
          {
            name: '店铺库存',
            // key: 'order_num',
            render: (h, { row }) =>
              h('el-switch', {
                props: {
                  'value': !row.is_total_store,
                  'active-value': true,
                  'inactive-value': false
                },
                on: {
                  change: async (e) => {
                    await this.$api.marketing.updateDistributorItem({
                      distributor_id: this.formData.distributor_id,
                      item_id: row.item_id,
                      is_total_store: !e
                    })
                    row.is_total_store = !e
                  }
                }
              })
          },
          {
            name: '状态',
            key: 'approve_status',
            width: 120,
            render: (h, { row }) => h('span', {}, this.getApproveStatus(row.approve_status))
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
      console.log('this.$refs:', this.$refs)
      this.$refs.finder.refresh()
    },
    async getDefaultDistributor() {
      if (!this.formData.distributor_id) {
        const { distributor_id } = await this.$api.marketing.getDistributorInfo({
          distributor_id: 0
        })
        this.formData.distributor_id = distributor_id
        this.$refs.selectShop.setVal(distributor_id)
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
    onSelectionChange(val) {
      this.selectItems = val
    },
    getApproveStatus(status) {
      const approveStatus = {
        onsale: '前台可销售',
        offline_sale: '前台不展示'
      }
      return approveStatus[status] || '不可销售'
    },
    // 批量下载商品码
    handleBatchDownload(val) {
      if (this.selectItems.length == 0) {
        return this.$message.error('请至少选择一个商品')
      }
      const zip = new JSZip()
      const requests = []
      const { distributor_id } = this.formData
      this.selectItems.forEach((item) => {
        const url = `${this.BASE_API}/goods/distributionGoodsWxaCodeStream?item_id=${item.itemId}&distributor_id=${distributor_id}`
        requests.push(getFileBlob(url))
      })
      Promise.all(requests).then((res) => {
        res.forEach((file, index) => {
          zip.file(`${this.selectItems[index].itemName}.png`, file, { binary: true }) // 逐个添加文件
        })
        zip.generateAsync({ type: 'blob' }).then((content) => {
          FileSaver.saveAs(content, '店铺的商品小程序码(批量).zip') // 利用file-saver保存文件
        })
      })
    },
    // 导出
    async handleExport() {
      const exportParams = {
        ...this.formData,
        goods_ids: this.selectItems.map((item) => item.goods_id)
      }
      const { status } = await this.$api.marketing.exportDistributorItems(exportParams)
      if (status) {
        this.$message.success('已加入执行队列，请在设置-导出列表中下载')
      }
    }
  }
}
</script>
