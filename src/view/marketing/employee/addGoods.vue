<style lang="scss">
.marketing-employee-addgoods {
  .sp-filter-form {
    margin-bottom: 16px;
  }
  .base-form {
    margin: 10px 0;
    .el-form-item {
      margin: 0;
    }
  }
  .el-table__expand-icon {
    position: absolute;
  }
  .item-info {
    display: flex;
    margin-left: 30px;
  }
  .item-spec {
    margin-left: 64px;
  }
  .item-image {
    width: 64px;
    margin-right: 4px;
  }
  .item-bn {
    font-size: 13px;
    color: #666;
    display: flex;
  }

  .goods-table {
    .el-table__body-wrapper,
    .el-table__fixed-right {
      .el-table__row {
        .el-table__cell:nth-child(2) .cell {
          display: flex;
        }
      }
    }
    .el-table__fixed-body-wrapper {
      top: 36px !important;
    }
  }
}
.popover-table-edit {
  display: flex;
  .edit-input {
    margin-right: 6px;
  }
}
</style>
<template>
  <SpPage title="添加活动商品">
    <div class="marketing-employee-addgoods">
      <el-card class="el-card--normal" header="活动商品">
        <SpForm
          ref="formBase"
          v-model="formBase"
          class="base-form"
          :label-width="'80px'"
          :form-list="formBaseList"
          :submit="false"
        />
        <!-- {{ queryForm }} -->
        <SpFilterForm :model="queryForm" @onSearch="onSearch" @onReset="onSearch">
          <SpFilterFormItem prop="main_cat_id" label="管理分类:">
            <el-cascader
              v-model="queryForm.main_cat_id"
              :options="categoryList"
              :props="{ checkStrictly: true, label: 'category_name', value: 'category_id' }"
              clearable
            />
          </SpFilterFormItem>
          <SpFilterFormItem prop="cat_id" label="销售分类:">
            <el-cascader
              v-model="queryForm.cat_id"
              :options="salesCategoryList"
              :props="{ checkStrictly: true, label: 'category_name', value: 'category_id' }"
              clearable
            />
          </SpFilterFormItem>
          <SpFilterFormItem prop="item_name" label="商品名称:">
            <el-input v-model="queryForm.item_name" placeholder="请输入商品名称" />
          </SpFilterFormItem>
          <SpFilterFormItem prop="item_bn" label="货号:">
            <el-input v-model="queryForm.item_bn" placeholder="请输入货号" />
          </SpFilterFormItem>
        </SpFilterForm>

        <div class="action-container">
          <!-- 平台端 来源店铺非平台则隐藏 -->
          <el-button type="primary" :disabled="adminDisabled" plain @click="handleImport">
            导入商品
          </el-button>
          <el-button type="primary" :disabled="adminDisabled" plain @click="onSelectGoods">
            选择商品
          </el-button>
          <el-button type="primary" :disabled="adminDisabled" plain @click="handlePatchAction">
            批量设置
          </el-button>
        </div>

        <el-table
          v-loading="loading"
          class="goods-table"
          :data="tableData"
          row-key="tid"
          border
          default-expand-all
          :tree-props="{ children: 'spec_items' }"
          @select-all="onSelectAll"
        >
          <el-table-column type="selection" width="55">
            <template slot-scope="scope">
              <el-checkbox v-if="!scope.row.is_sku" v-model="scope.row.checked" />
            </template>
          </el-table-column>
          <el-table-column prop="item_name" label="商品标题" width="380">
            <template slot-scope="scope">
              <div v-if="!scope.row.is_sku" class="item-info">
                <div>
                  <el-image class="item-image" :src="scope.row.pics[0]" fit="cover" />
                </div>
                <div>
                  <div class="item-name">{{ scope.row.item_name }}</div>
                  <div class="item-bn">
                    货号：{{ scope.row.item_bn }}
                    <el-button
                      v-if="scope.row.nospec != 'true' && !adminDisabled"
                      style="margin-left: 4px"
                      type="text"
                      @click="onSelectSku(scope.row)"
                    >
                      选择规格
                    </el-button>
                  </div>
                </div>
              </div>
              <div v-else>
                <div class="item-spec">{{ scope.row.item_spec_desc }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="store" label="商城库存">
            <template
              v-if="(scope.row.nospec == 'false' && scope.row.is_sku) || scope.row.nospec == 'true'"
              slot-scope="scope"
            >
              {{ scope.row.store }}
            </template>
          </el-table-column>
          <el-table-column prop="price" label="销售价（元）" width="120">
            <template slot-scope="scope">
              {{ scope.row.price / 100 }}
            </template>
          </el-table-column>
          <el-table-column prop="price" label="商城价格（元）" width="120">
            <template
              v-if="(scope.row.nospec == 'false' && scope.row.is_sku) || scope.row.nospec == 'true'"
              slot-scope="scope"
            >
              {{ scope.row.price / 100 }}
            </template>
          </el-table-column>
          <el-table-column prop="activity_price" label="活动价格（元）" width="120">
            <template
              v-if="(scope.row.nospec == 'false' && scope.row.is_sku) || scope.row.nospec == 'true'"
              slot-scope="scope"
            >
              <span>{{ scope.row.activity_price }}</span>
              <el-popover
                v-if="!adminDisabled"
                placement="top"
                trigger="click"
                @show="
                  () => {
                    tempModify.activity_price = scope.row.activity_price
                  }
                "
              >
                <div class="popover-edit popover-table-edit">
                  <el-input v-model="tempModify.activity_price" class="edit-input" />
                  <el-button
                    type="primary"
                    size="mini"
                    @click="onModifyActivityItem(scope.row, 'activity_price')"
                  >
                    确定
                  </el-button>
                </div>
                <el-button slot="reference" type="text">
                  <i class="el-icon-edit" />
                </el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="activity_store" label="活动库存">
            <template
              v-if="(scope.row.nospec == 'false' && scope.row.is_sku) || scope.row.nospec == 'true'"
              slot-scope="scope"
            >
              <span>{{ formBase.value == '1' ? 0 : scope.row.activity_store }}</span>
              <el-popover
                v-if="!adminDisabled"
                placement="top"
                trigger="click"
                @show="
                  () => {
                    tempModify.activity_store = scope.row.activity_store
                  }
                "
              >
                <div class="popover-edit popover-table-edit">
                  <el-input v-model="tempModify.activity_store" class="edit-input" />
                  <el-button
                    type="primary"
                    size="mini"
                    @click="onModifyActivityItem(scope.row, 'activity_store')"
                  >
                    确定
                  </el-button>
                </div>
                <el-button slot="reference" :disabled="formBase.value == '1'" type="text">
                  <i class="el-icon-edit" />
                </el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序">
            <template slot-scope="scope">
              <span>{{ scope.row.sort }}</span>
              <el-popover
                v-if="!adminDisabled"
                placement="top"
                trigger="click"
                @show="
                  () => {
                    tempModify.sort = scope.row.sort
                  }
                "
              >
                <div class="popover-edit popover-table-edit">
                  <el-input v-model="tempModify.sort" class="edit-input" />
                  <el-button
                    type="primary"
                    size="mini"
                    @click="onModifyActivityItem(scope.row, 'sort')"
                  >
                    确定
                  </el-button>
                </div>
                <el-button slot="reference" type="text">
                  <i class="el-icon-edit" />
                </el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="limit_num" label="每人限购（件）" width="120">
            <template
              v-if="(scope.row.nospec == 'false' && scope.row.is_sku) || scope.row.nospec == 'true'"
              slot-scope="scope"
            >
              <span>{{ scope.row.limit_num }}</span>
              <el-popover
                v-if="!adminDisabled"
                placement="top"
                trigger="click"
                @show="
                  () => {
                    tempModify.limit_num = scope.row.limit_num
                  }
                "
              >
                <div class="popover-edit popover-table-edit">
                  <el-input v-model="tempModify.limit_num" class="edit-input" />
                  <el-button
                    type="primary"
                    size="mini"
                    @click="onModifyActivityItem(scope.row, 'limit_num')"
                  >
                    确定
                  </el-button>
                </div>
                <el-button slot="reference" type="text">
                  <i class="el-icon-edit" />
                </el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="limit_fee" label="每人限额（元）" width="120">
            <template
              v-if="(scope.row.nospec == 'false' && scope.row.is_sku) || scope.row.nospec == 'true'"
              slot-scope="scope"
            >
              <span>{{ scope.row.limit_fee }}</span>
              <el-popover
                v-if="!adminDisabled"
                placement="top"
                trigger="click"
                @show="
                  () => {
                    tempModify.limit_fee = scope.row.limit_fee
                  }
                "
              >
                <div class="popover-edit popover-table-edit">
                  <el-input v-model="tempModify.limit_fee" class="edit-input" />
                  <el-button
                    type="primary"
                    size="mini"
                    @click="onModifyActivityItem(scope.row, 'limit_fee')"
                  >
                    确定
                  </el-button>
                </div>
                <el-button slot="reference" type="text">
                  <i class="el-icon-edit" />
                </el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120px">
            <template slot-scope="scope">
              <!-- 平台端 来源店铺非平台则隐藏 -->
              <el-button v-if="!adminDisabled" type="text" @click="removeActivityItem(scope.row)">
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          style="text-align: center; margin-top: 10px"
          background
          :current-page="page"
          :page-sizes="[20, 30, 40]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-card>

      <SpDialog
        ref="patchDialogRef"
        v-model="patchDialog"
        :title="`批量设置`"
        :form="patchForm"
        :form-list="patchFormList"
        @onSubmit="onPatchChangeSubmit"
      />
    </div>
  </SpPage>
</template>

<script>
import Pages from '@/utils/pages'
export default {
  name: '',
  data() {
    return {
      formBase: {
        value: '1'
      },
      formBaseList: [
        {
          label: '商品库存',
          key: 'value',
          type: 'radio',
          disabled: () => this.IS_ADMIN() && this.distributor_id != '0',
          options: [
            { name: '共享商城库存', label: '1' },
            { name: '活动独立库存', label: '2' }
          ],
          onChange: async () => {
            const { id } = this.$route.params
            await this.$api.marketing.setActivityShareStore({
              activity_id: id,
              if_share_store: this.formBase.value == '1' ? 1 : 0
            })
            this.$message.success('操作成功')
          }
        }
      ],
      distributor_id: null,
      patchDialog: false,
      patchForm: {
        item_id: [],
        activity_price: 0,
        activity_store: 0,
        sort: 0,
        limit_num: 0,
        limit_fee: 0
      },
      patchFormList: [
        {
          label: '活动价格',
          key: 'activity_price',
          type: 'input'
        },
        {
          label: '活动库存',
          key: 'activity_store',
          type: 'input'
        },
        {
          label: '排序',
          key: 'sort',
          type: 'input'
        },
        {
          label: '每人限购',
          key: 'limit_num',
          type: 'input'
        },
        {
          label: '每人限额',
          key: 'limit_fee',
          type: 'input'
        }
      ],
      queryForm: {
        main_cat_id: [],
        cat_id: [],
        item_name: '',
        item_bn: ''
      },
      categoryList: [],
      salesCategoryList: [],
      tableData: [],
      page: 1,
      pageSize: 20,
      total: 0,
      loading: false,
      tempModify: {
        activity_price: 0,
        activity_store: 0,
        sort: 0,
        limit_num: 0,
        limit_fee: 0
      }
    }
  },
  computed: {
    adminDisabled() {
      return this.IS_ADMIN() && this.distributor_id != '0'
    }
  },
  async created() {
    this.getActivityItemDetail()
    // 管理分类
    const category = await this.$api.goods.getCategory({ is_main_category: true })
    // 销售分类
    const salesCategory = await this.$api.goods.getCategory()
    this.categoryList = category
    this.salesCategoryList = salesCategory
    this.distributor_id = this.$route.query.distributor_id || '0'
    this.pagesQuery = new Pages({
      pageSize: this.pageSize,
      fetch: this.getActivityItems
    }).nextPage()
  },
  methods: {
    handleImport() {
      let path
      if (this.IS_DISTRIBUTOR()) {
        path =
        '/shopadmin/products/store-product-manage/physicalupload?file_type=employee_purchase_activity_items'
          // '/shopadmin/products/product-import?file_type=employee_purchase_activity_items'
      } else {
        path =
          '/products/product-manage/self-products/product-import?file_type=employee_purchase_activity_items'
      }
      this.$router.push({ path })
    },
    handlePatchAction() {
      const selectItems = this.tableData.filter(item => !!item.checked)
      if (selectItems.length > 0) {
        let itemIds = []
        selectItems.forEach(item => {
          // 单规格
          if (item.nospec == 'true') {
            itemIds.push(item.item_id)
          } else if (typeof item.spec_items != 'undefined') {
            item.spec_items.forEach(sitem => {
              itemIds.push(sitem.item_id)
            })
          }
        })
        this.patchForm.item_id = itemIds
        this.patchDialog = true
      } else {
        this.$message.error('请选择商品')
      }
    },
    async onPatchChangeSubmit() {
      const { id } = this.$route.params
      const { item_id, activity_price, activity_store, sort, limit_num, limit_fee } = this.patchForm
      let params = {
        activity_id: id,
        item_id,
        activity_price: activity_price * 100,
        activity_store,
        sort,
        limit_num,
        limit_fee: limit_fee * 100
      }
      await this.$api.marketing.updateActivityItem(params)
      this.patchDialog = false
      this.pagesQuery.refresh()
    },
    onSelectAll(selection) {
      if (selection.length > 0) {
        this.tableData.forEach(item => {
          item['checked'] = true
        })
      } else {
        this.tableData.forEach(item => {
          item['checked'] = false
        })
      }
    },
    onSearch() {
      this.pagesQuery.reset()
    },
    async getActivityItemDetail() {
      const { id } = this.$route.params
      const { if_share_store } = await this.$api.marketing.getActivityItemDetail(id)
      this.formBase.value = if_share_store ? '1' : '2'
    },
    async onSelectGoods() {
      const {
        data: { type, value }
      } = await this.$picker.goodsList({
        // data: 100,
        // shopid: this.shopId
        distributor_id: this.distributor_id
      })

      const { id } = this.$route.params
      let params = {
        activity_id: id
      }
      if (type == 'goods') {
        params = {
          ...params,
          item_id: value.map(item => item.itemId)
        }
      } else if (type == 'category') {
        const main_cat_id = value.map(item => item[item.length - 1])
        params = {
          ...params,
          main_cat_id
        }
      } else if (type == 'salesCategory') {
        // const cat_id = value.map((item) => item[item.length - 1])
        const cat_id = value[value.length - 1]
        params = {
          ...params,
          cat_id
        }
      }
      await this.$api.marketing.addGoodsInActivity(params)
      this.pagesQuery.reset()
    },
    async getActivityItems({ page, pageSize }) {
      const { id } = this.$route.params
      this.loading = true
      const { list, total_count } = await this.$api.marketing.getActivityItems({
        activity_id: id,
        page,
        pageSize,
        ...this.queryForm
      })
      this.loading = false
      let tindex = 0
      list.forEach(item => {
        item['is_sku'] = false
        item['activity_price'] = item.activity_price / 100
        item['limit_fee'] = item.limit_fee / 100
        item['tid'] = ++tindex
        item['checked'] = false
        if (typeof item.spec_items != 'undefined') {
          item.spec_items.forEach(sitem => {
            sitem['is_sku'] = true
            sitem['activity_price'] = sitem.activity_price / 100
            sitem['limit_fee'] = sitem.limit_fee / 100
            sitem['tid'] = ++tindex
          })
        }
      })

      this.tableData = list
      this.page = page
      this.total = total_count
      this.pagesQuery.setTotal(total_count)
    },
    async onSelectSku({ goods_id, item_id, default_item_id, item_name, item_bn, spec_items = [] }) {
      const { data } = await this.$picker.goodsSku({
        data: spec_items.map(item => item.item_id),
        itemId: default_item_id,
        itemName: item_name,
        itemBn: item_bn
      })
      const { id } = this.$route.params
      await this.$api.marketing.selectSkuOfItems({
        activity_id: id,
        goods_id: goods_id,
        item_id: data.map(item => item.itemId)
      })
      this.pagesQuery.reset()
    },
    async removeActivityItem({ item_id, is_sku }) {
      const { id } = this.$route.params
      await this.$confirm(`确认删除？`, '提示')
      let params = {}
      if (!is_sku) {
        params['all'] = 1
      }
      await this.$api.marketing.deleteActivityItem(id, item_id, params)
      this.pagesQuery.reset()
    },
    async onModifyActivityItem(item, key) {
      const { id } = this.$route.params
      let params = {
        activity_id: id,
        item_id: item.item_id
      }
      if (key == 'activity_price' || key == 'limit_fee') {
        params[key] = this.tempModify[key] * 100
      } else {
        params[key] = this.tempModify[key]
      }
      await this.$api.marketing.updateActivityItem(params)
      this.pagesQuery.refresh()
    },
    handleSizeChange(val) {
      this.pagesQuery.setPageSize(val)
      this.pagesQuery.refresh()
    },
    handleCurrentChange(val) {
      this.pagesQuery.setPage(val)
      this.pagesQuery.refresh()
    }
  }
}
</script>
