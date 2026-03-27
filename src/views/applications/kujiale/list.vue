<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->
<template>
  <SpPage>
    <SpRouterView>
      <!-- 搜索表单 -->
      <SpFormPlus
        ref="searchForm"
        v-model="searchParams"
        form-type="searchForm"
        :inline="true"
        label-width="100px"
        :form-items="searchFormItems"
        @submit="handleSearch"
        @reset="handleReset"
      />

      <!-- 操作按钮 -->
      <div class="action-container mt-4">
        <el-button type="primary" @click="handleSelectProduct">
{{
          $t('b6d1901c.ea9246')
        }}
</el-button>
      </div>

      <!-- 商品列表 -->
      <SpFinder
        ref="finder"
        :setting="finderSetting"
        :row-key="getRowKey"
        row-actions-fixed-align="left"
        url="/kujiale/designer-works/items"
        fixed-row-action
        :hooks="{
          beforeSearch: beforeSearch,
          afterRequest: afterRequest
        }"
        @selection-change="handleSelectionChange"
      />

      <!-- 选品关联弹框 -->
      <el-dialog
        :visible.sync="selectProductVisible"
        :title="$t('b6d1901c.f10bf0')"
        width="900px"
        :close-on-click-modal="false"
        @close="handleDialogClose"
      >
        <div class="dialog-section">
          <div class="section-header">
            <h3 class="section-title">{{ $t('b6d1901c.fe6829') }}</h3>
            <div class="section-actions">
              <el-select
                v-model="design_id"
                :placeholder="$t('b6d1901c.6fd283')"
                filterable
                clearable
                style="width: 300px; margin-right: 10px; margin-left: 30px"
                @change="handleSelecteChange"
              >
                <el-option
                  v-for="item in allCaseList"
                  :key="item.design_id"
                  :label="item.design_name"
                  :value="item.design_id"
                >
                  <span>{{ item.design_id }} - {{ item.design_name }}</span>
                </el-option>
              </el-select>
            </div>
          </div>
        </div>

        <!-- 第二部分：选择酷家乐案例关联商品 -->
        <div class="dialog-section" style="margin-top: 24px">
          <div class="section-header">
            <h3 class="section-title">{{ $t('b6d1901c.fe100c') }}</h3>
          </div>
          <div style="margin-top: 16px; margin-left: 40px">
            <SkuSelector
              :key="skuSelectorKey"
              :data="relItems"
              :is-hiden-sku="true"
              @change="handleGoodsChange"
            />
          </div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="handleDialogClose">{{ $t('b6d1901c.625fb2') }}</el-button>
          <el-button type="primary" :loading="confirmLoading" @click="handleConfirm">{{
            $t('b6d1901c.e83a25')
          }}</el-button>
        </span>
      </el-dialog>
    </SpRouterView>
  </SpPage>
</template>

<script>
import { createSetting } from '@shopex-ui/finder'
import SkuSelector from '@/components/function/skuSelector'

export default {
  name: 'KuJiaLeList',
  components: {
    SkuSelector
  },
  data() {
    return {
      searchParams: {
        keywords: '', // 商品标题
        goods_bn: '', // SPU编码
        design_id: '', // 方案ID
        plan_name: '', // 方案名称
        approve_status: '', // 商品状态
        main_cat_id: '' // 管理分类
      },
      // 选品关联弹框相关
      selectProductVisible: false,
      allCaseList: [], // 所有案例列表（用于下拉选项）
      design_id: '', // 选中的案例ID（单选）
      relItems: [], // SkuSelector 组件使用的商品列表
      selectedSkus: [], // 最终选中的SKU列表（从SkuSelector的change事件获取）
      confirmLoading: false,
      skuSelectorKey: 0, // SkuSelector 组件的 key，用于强制重新渲染
      searchFormItems: [],
      finderSetting: null,
      selectedRows: []
    }
  },
  created() {
    const t = this.$t.bind(this)
    this.searchFormItems = [
      {
        cellWidth: 1.3,
        component: 'input',
        componentProps: {
          placeholder: t('b6d1901c.90795d'),
          clearable: true,
          size: 'medium'
        },
        fieldName: 'keywords',
        label: t('b6d1901c.07ec01')
      },
      {
        cellWidth: 1.3,
        component: 'input',
        componentProps: {
          placeholder: t('b6d1901c.36438f'),
          clearable: true
        },
        fieldName: 'goods_bn',
        label: t('b6d1901c.18ea2a')
      },
      {
        cellWidth: 1.3,
        component: 'input',
        componentProps: {
          placeholder: t('b6d1901c.54f81d'),
          clearable: true
        },
        fieldName: 'design_id',
        label: t('b6d1901c.95e7dd')
      },
      {
        cellWidth: 1.3,
        component: 'input',
        componentProps: {
          placeholder: t('b6d1901c.9e93f1'),
          clearable: true
        },
        fieldName: 'design_name',
        label: t('b6d1901c.1b0b23')
      },
      {
        cellWidth: 1.3,
        component: 'select',
        componentProps: {
          placeholder: t('b6d1901c.708c9d'),
          clearable: true,
          options: [
            { label: t('b6d1901c.a8b0c2'), value: '' },
            { label: t('b6d1901c.9b7481'), value: 'onsale' },
            { label: t('b6d1901c.ae83a3'), value: 'instock' },
            { label: t('b6d1901c.acf86b'), value: 'only_show' },
            { label: t('b6d1901c.2c50a0'), value: 'offline_sale' }
          ]
        },
        fieldName: 'approve_status',
        label: t('b6d1901c.ce0008')
      },
      {
        cellWidth: 1.3,
        component: ({ h, value, onInput, props: componentProps }) => {
          return h('el-cascader', {
            attrs: {
              size: 'small',
              style: 'width:100%'
            },
            props: {
              value: value,
              placeholder: t('b6d1901c.708c9d'),
              clearable: true,
              options: componentProps.options || [],
              props: {
                value: 'category_id',
                label: 'category_name',
                checkStrictly: true
              }
            },
            on: {
              input: onInput
            }
          })
        },
        componentProps: {
          options: []
        },
        fieldName: 'main_cat_id',
        label: t('b6d1901c.b3ed9f')
      }
    ]
  },
  mounted() {
    this.initFinderSetting()
    this.getCategory()
  },
  methods: {
    initFinderSetting() {
      const vm = this
      const t = vm.$t.bind(vm)
      this.finderSetting = createSetting({
        columns: [
          {
            name: t('b6d1901c.858526'),
            key: 'item_id',
            width: 100
          },
          {
            name: t('b6d1901c.07ec01'),
            key: 'item_name',
            minWidth: 200,
            showOverflowTooltip: true
          },
          {
            name: t('b6d1901c.18ea2a'),
            key: 'goods_bn',
            width: 150
          },
          {
            name: t('b6d1901c.95e7dd'),
            key: 'design_id',
            width: 120,
            render: (h, { row }) => {
              return h('span', row.design.design_id)
            }
          },
          {
            name: t('b6d1901c.1b0b23'),
            key: 'design_name',
            minWidth: 150,
            showOverflowTooltip: true,
            render: (h, { row }) => {
              return h('span', row.design.design_name)
            }
          },
          {
            name: t('b6d1901c.14d342'),
            width: 150,
            key: 'tagList',
            render: (h, { row }) => (
              <div style='white-space: normal;'>
                {row.tagList?.map((item) => (
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
            name: t('b6d1901c.0eac88'),
            key: 'stock',
            width: 100,
            formatterType: 'number'
          },
          {
            name: t('b6d1901c.e29575'),
            key: 'price',
            width: 100,
            formatter: (value, row, col) => {
              return (value / 100).toFixed(2)
            }
          },
          {
            name: t('b6d1901c.818fc4'),
            key: 'market_price',
            width: 100,
            formatter: (value, row, col) => {
              return (value / 100).toFixed(2)
            }
          },
          {
            name: t('b6d1901c.2e2ce2'),
            key: 'cost_price',
            width: 100,
            formatter: (value, row, col) => {
              return (value / 100).toFixed(2)
            }
          },
          {
            name: t('b6d1901c.ce0008'),
            key: 'approve_status',
            width: 100,
            render: (h, { row }) => {
              const statusMap = {
                onsale: { text: t('b6d1901c.9b7481'), type: 'success' },
                instock: { text: t('b6d1901c.ae83a3'), type: 'info' },
                only_show: { text: t('b6d1901c.acf86b'), type: 'info' },
                offline_sale: { text: t('b6d1901c.2c50a0'), type: 'warning' }
              }
              const status = statusMap[row.approve_status] || { text: '-', type: 'info' }
              return h(
                'el-tag',
                {
                  props: {
                    type: status.type,
                    size: 'small'
                  }
                },
                status.text
              )
            }
          },
          {
            name: t('b6d1901c.392d49'),
            key: 'itemCatName',
            minWidth: 150,
            showOverflowTooltip: true
          }
        ],
        actions: [
          {
            name: t('b6d1901c.663393'),
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([row]) => vm.handleUnbind(row)
            }
          }
        ]
      })
    },
    getRowKey(row) {
      return row.goods_id || row.item_id || row.id
    },
    beforeSearch(params) {
      // 合并搜索参数
      return {
        ...params,
        ...this.searchParams
      }
    },
    afterRequest(response) {
      const data = response.data.data || response.data
      const { list, total_count, count } = data
      return {
        list: list || [],
        count: total_count || count || 0
      }
    },
    handleSearch() {
      this.$refs.finder.refresh(true)
    },
    handleReset() {
      this.searchParams = {
        keywords: '',
        goods_bn: '',
        design_id: '',
        design_name: '',
        approve_status: '',
        main_cat_id: ''
      }
      this.$nextTick(() => {
        this.$refs.finder.refresh(true)
      })
    },
    // 获取管理分类
    async getCategory() {
      try {
        const itemCategoryList = await this.$api.goods.getCategory({ is_main_category: true })
        // 更新搜索表单中的选项
        const categoryItem = this.searchFormItems.find((item) => item.fieldName === 'main_cat_id')
        if (categoryItem) {
          categoryItem.componentProps.options = itemCategoryList
        }
      } catch (error) {
        console.log(error, '加载管理分类失败')
      }
    },
    handleSelectionChange(selection) {
      this.selectedRows = selection
    },
    handleSelectProduct() {
      // 打开弹框前先清空之前的数据
      this.design_id = ''
      this.relItems = []
      this.selectedSkus = []
      // 强制 SkuSelector 组件重新渲染
      this.skuSelectorKey = Date.now()
      // 打开弹框
      this.selectProductVisible = true
      // 加载案例列表
      this.loadCaseList()
    },
    // 加载案例列表
    async loadCaseList() {
      try {
        const params = {}
        const res = await this.$api.goods.getKjlList(params)
        const list = res.list || (res.data && res.data.list) || []
        this.allCaseList = list
      } catch (error) {
        this.$message.error(this.$t('b6d1901c.282b62'))
      }
    },
    handleSelecteChange(value) {
      if (value) {
        this.design_id = value
      } else {
        // 清空案例选择时，同时清空商品选择
        this.design_id = ''
        this.relItems = []
        this.selectedSkus = []
      }
    },
    handleGoodsChange(data) {
      // 更新选中的商品SKU列表
      this.selectedSkus = data || []
    },
    // 确认关联
    async handleConfirm() {
      if (!this.design_id) {
        this.$message.warning(this.$t('b6d1901c.625973'))
        return
      }
      if (this.selectedSkus.length === 0) {
        this.$message.warning(this.$t('b6d1901c.9bfb08'))
        return
      }
      this.confirmLoading = true
      try {
        const goodsIds = [...new Set(this.selectedSkus.map((item) => item.goods_id))]
        await this.$api.goods.kjlBindItem({
          design_id: this.design_id,
          item_id: goodsIds
        })
        this.$message.success(this.$t('b6d1901c.55828c'))
        this.handleDialogClose()
        this.$refs.finder.refresh(true)
      } catch (error) {
        this.$message.error(error.message || this.$t('b6d1901c.6d973d'))
      } finally {
        this.confirmLoading = false
      }
    },
    // 关闭弹框
    handleDialogClose() {
      // 清空酷家乐案例选择
      this.design_id = ''
      // 清空商品选择
      this.relItems = []
      this.selectedSkus = []
      // 重置案例列表
      this.allCaseList = []
      // 重置加载状态
      this.confirmLoading = false
      // 更新 SkuSelector 的 key，强制组件重新渲染
      this.skuSelectorKey = Date.now()
      // 关闭弹框
      this.selectProductVisible = false
    },
    // 解绑商品和方案
    async handleUnbind(row) {
      this.$confirm(this.$t('b6d1901c.a2cb15'), this.$t('b6d1901c.02d981'), {
        confirmButtonText: this.$t('b6d1901c.38cf16'),
        cancelButtonText: this.$t('b6d1901c.625fb2')
      })
        .then(async () => {
          try {
            await this.$api.goods.kjlUnBindItem({
              design_id: row.design.design_id,
              item_id: row.item_id
            })
            this.$message.success(this.$t('b6d1901c.1c4385'))
            this.$refs.finder.refresh(true)
          } catch (error) {
            this.$message.error(error.message || this.$t('b6d1901c.913643'))
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('b6d1901c.2111cc')
          })
        })
    }
  }
}
</script>
<style scoped lang="scss">
.dialog-section {
  .section-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    margin-left: 30px;

    .section-title {
      font-size: 16px;
      font-weight: bold;
      margin: 0;
      color: #333;
    }

    .section-actions {
      display: flex;
      align-items: center;
    }
  }
}
</style>
