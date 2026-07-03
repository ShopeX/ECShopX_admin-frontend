<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.marketing-employee-addgoods {
  .activity-goods-filter-wrap {
    position: relative;
    margin-bottom: 16px;

    .sp-filter-form {
      margin-bottom: 0;

      .extend-wrap {
        display: none;
      }
    }

    .activity-goods-filter.sp-filter-form.shouqi {
      max-height: 220px;
      overflow: hidden;
    }

    .activity-goods-filter.is-category-expanded.sp-filter-form.shouqi {
      max-height: none;
      overflow: visible;
    }

    .filter-row-break {
      flex-basis: 100%;
      width: 0;
      height: 0;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }

    .filter-category-toggle {
      position: absolute;
      right: 16px;
      bottom: 16px;

      .extend-icon.extend-active {
        transform: rotate(180deg);
      }
    }
  }

  .base-form {
    margin: 10px 0;

    &.sp-form .el-form-item,
    .el-form-item {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      margin-bottom: 0;
    }

    .el-form-item__label {
      float: none;
      flex: 0 0 auto;
      width: auto !important;
      min-width: 80px;
      padding-right: 12px;
      line-height: 32px;
      white-space: nowrap;
    }

    .el-form-item__content {
      float: none;
      flex: 0 1 auto;
      margin-left: 0 !important;
      line-height: 32px;
      white-space: nowrap;
    }

    .el-radio-group {
      white-space: nowrap;
      display: inline-block;
      vertical-align: middle;
    }

    .el-radio {
      margin-right: 20px;
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
.activity-page-subtitle {
  margin: -12px 0 12px;
  font-size: 13px;
  line-height: 1.5;
  color: #999;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0 12px;

  &__divider {
    color: #dcdfe6;
  }
}
</style>
<template>
  <SpPage :title="$t('2ff5650c.498c0f')">
    <p v-if="activityId" class="activity-page-subtitle">
      <span>{{ $t('39c20259.be3322') }}：{{ activityId }}</span>
      <span v-if="activityName" class="activity-page-subtitle__divider">|</span>
      <span v-if="activityName">{{ $t('39c20259.39834b') }}：{{ activityName }}</span>
    </p>
    <div class="marketing-employee-addgoods">
      <el-card class="el-card--normal" :header="$t('2ff5650c.42f9f7')">
        <SpForm
          ref="formBase"
          v-model="formBase"
          class="base-form"
          label-position="left"
          :label-width="'80px'"
          :form-list="formBaseList"
          :submit="false"
        />
        <!-- {{ queryForm }} -->
        <div class="activity-goods-filter-wrap">
          <SpFilterForm
            class="activity-goods-filter"
            :class="{ 'is-category-expanded': categoryFilterVisible }"
            :model="queryForm"
            @onSearch="onSearch"
            @onReset="onFilterReset"
          >
            <SpFilterFormItem prop="item_name" :label="$t('2ff5650c.752597')">
              <el-input v-model="queryForm.item_name" :placeholder="$t('2ff5650c.d83187')" />
            </SpFilterFormItem>
            <SpFilterFormItem prop="item_bn" :label="$t('2ff5650c.d1d3e6')">
              <el-input v-model="queryForm.item_bn" :placeholder="$t('2ff5650c.40a487')" />
            </SpFilterFormItem>
            <div class="filter-row-break" />
            <SpFilterFormItem prop="shelf_status" :label="$t('d41d8cd9.3fea7c')">
              <el-select
                v-model="queryForm.shelf_status"
                clearable
                :placeholder="$t('b7aea01d.a8b0c2')"
              >
                <el-option :label="$t('b7aea01d.4a5098')" :value="1" />
                <el-option :label="$t('b7aea01d.d2379a')" :value="0" />
              </el-select>
            </SpFilterFormItem>
            <SpFilterFormItem prop="category" :label="$t('2ff5650c.7ef1b3')">
              <el-cascader
                v-model="queryForm.category"
                :options="salesCategoryList"
                :props="{
                  checkStrictly: true,
                  label: 'category_name',
                  value: 'category_id',
                  emitPath: false
                }"
                clearable
              />
            </SpFilterFormItem>
            <div class="filter-row-break" />
            <template v-if="categoryFilterVisible">
              <SpFilterFormItem prop="main_cat_id" :label="$t('2ff5650c.e73602')">
                <el-cascader
                  v-model="queryForm.main_cat_id"
                  :options="categoryList"
                  :props="{ checkStrictly: true, label: 'category_name', value: 'category_id' }"
                  clearable
                />
              </SpFilterFormItem>
            </template>
          </SpFilterForm>
          <div class="filter-category-toggle">
            <el-button type="text" @click="toggleCategoryFilter">
              <div class="flex items-center">
                <span>{{ categoryFilterToggleText }}</span>
                <SpIcon
                  :class="{ 'extend-icon': true, 'extend-active': categoryFilterVisible }"
                  name="chevrons-down"
                />
              </div>
            </el-button>
          </div>
        </div>

        <div class="action-container">
          <!-- 平台端 来源店铺非平台则隐藏 -->
          <el-button type="primary" :disabled="adminDisabled" plain @click="handleImport">
            {{ $t('2ff5650c.6a4607') }}
          </el-button>
          <el-button type="primary" :disabled="adminDisabled" plain @click="onSelectGoods">
            {{ $t('2ff5650c.43d1e2') }}
          </el-button>
          <el-button type="primary" :disabled="adminDisabled" plain @click="handlePatchAction">
            {{ $t('2ff5650c.475dd0') }}
          </el-button>
          <el-button type="primary" :disabled="adminDisabled" plain @click="handleBatchShelfAction">
            {{ $t('2ff5650c.d8f1a2') }}
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
          <el-table-column prop="item_name" :label="$t('2ff5650c.07ec01')" width="380">
            <template slot-scope="scope">
              <div v-if="!scope.row.is_sku" class="item-info">
                <div>
                  <el-image class="item-image" :src="scope.row.pics[0]" fit="cover" />
                </div>
                <div>
                  <div class="item-name">{{ scope.row.item_name }}</div>
                  <div class="item-bn">
                    {{ $t('2ff5650c.4bb294') }}{{ scope.row.item_bn }}
                    <el-button
                      v-if="scope.row.nospec != 'true' && !adminDisabled"
                      style="margin-left: 4px"
                      type="text"
                      @click="onSelectSku(scope.row)"
                    >
                      {{ $t('2ff5650c.a0f99d') }}
                    </el-button>
                  </div>
                </div>
              </div>
              <div v-else>
                <div class="item-spec">{{ scope.row.item_spec_desc }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="store" :label="$t('2ff5650c.50b64f')">
            <template
              v-if="(scope.row.nospec == 'false' && scope.row.is_sku) || scope.row.nospec == 'true'"
              slot-scope="scope"
            >
              {{ scope.row.store }}
            </template>
          </el-table-column>
          <el-table-column prop="price" :label="$t('2ff5650c.3af230')" width="120">
            <template slot-scope="scope">
              {{ scope.row.price / 100 }}
            </template>
          </el-table-column>
          <el-table-column prop="price" :label="$t('2ff5650c.140b3a')" width="120">
            <template
              v-if="(scope.row.nospec == 'false' && scope.row.is_sku) || scope.row.nospec == 'true'"
              slot-scope="scope"
            >
              {{ scope.row.price / 100 }}
            </template>
          </el-table-column>
          <el-table-column prop="activity_price" :label="$t('2ff5650c.49e9e4')" width="120">
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
                    {{ $t('2ff5650c.38cf16') }}
                  </el-button>
                </div>
                <el-button slot="reference" type="text">
                  <i class="el-icon-edit" />
                </el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="activity_store" :label="$t('2ff5650c.a43d00')">
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
                    {{ $t('2ff5650c.38cf16') }}
                  </el-button>
                </div>
                <el-button slot="reference" :disabled="formBase.value == '1'" type="text">
                  <i class="el-icon-edit" />
                </el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="sort" :label="$t('2ff5650c.c360e9')">
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
                    {{ $t('2ff5650c.38cf16') }}
                  </el-button>
                </div>
                <el-button slot="reference" type="text">
                  <i class="el-icon-edit" />
                </el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="limit_num" :label="$t('2ff5650c.9542cd')" width="120">
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
                    {{ $t('2ff5650c.38cf16') }}
                  </el-button>
                </div>
                <el-button slot="reference" type="text">
                  <i class="el-icon-edit" />
                </el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="limit_fee" :label="$t('2ff5650c.0588d2')" width="120">
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
                    {{ $t('2ff5650c.38cf16') }}
                  </el-button>
                </div>
                <el-button slot="reference" type="text">
                  <i class="el-icon-edit" />
                </el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="shelf_status" :label="$t('d41d8cd9.3fea7c')" width="90">
            <template
              v-if="(scope.row.nospec == 'false' && scope.row.is_sku) || scope.row.nospec == 'true'"
              slot-scope="scope"
            >
              <span>{{
                Number(scope.row.shelf_status) === 1 ? $t('b7aea01d.4a5098') : $t('b7aea01d.d2379a')
              }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="left" :label="$t('2ff5650c.2b6bc0')" width="120px">
            <template slot-scope="scope">
              <el-button
                v-if="
                  !adminDisabled &&
                  ((scope.row.nospec == 'false' && scope.row.is_sku) || scope.row.nospec == 'true')
                "
                type="text"
                @click="toggleShelfStatus(scope.row)"
              >
                {{
                  Number(scope.row.shelf_status) === 1
                    ? $t('b7aea01d.d2379a')
                    : $t('b7aea01d.4a5098')
                }}
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

      <el-dialog
        :title="$t('2ff5650c.6a4607')"
        :visible.sync="importDialog"
        width="900px"
        append-to-body
        destroy-on-close
        :close-on-click-modal="false"
        @closed="onImportDialogClosed"
      >
        <related-upload
          v-if="importDialog"
          file-type="employee_purchase_activity_items"
          :related-id="$route.params.id"
          :file-name="$t('5f45d286.3dd83a')"
          :table-height="420"
          :extra-params="importExtraParams"
          :operation-tip="$t('2ff5650c.c7d8e9')"
        />
      </el-dialog>

      <SpDialog
        ref="patchDialogRef"
        v-model="patchDialog"
        :title="$t('2ff5650c.475dd0')"
        :form="patchForm"
        :form-list="patchFormList"
        @onSubmit="onPatchChangeSubmit"
      />

      <SpDialog
        ref="batchShelfDialogRef"
        v-model="batchShelfDialog"
        :title="$t('2ff5650c.d8f1a2')"
        :form="batchShelfForm"
        :form-list="batchShelfFormList"
        @onSubmit="onBatchShelfSubmit"
      />
    </div>
  </SpPage>
</template>

<script>
import Pages from '@/utils/pages'
import RelatedUpload from '@/components/related-upload'
export default {
  name: '',
  components: {
    RelatedUpload
  },
  data() {
    return {
      formBase: {
        value: '1'
      },
      distributor_id: null,
      importDialog: false,
      patchDialog: false,
      batchShelfDialog: false,
      batchShelfForm: {
        item_id: [],
        shelf_status: 1
      },
      patchForm: {
        item_id: [],
        activity_price: 0,
        activity_store: 0,
        sort: 0,
        limit_num: 0,
        limit_fee: 0
      },
      queryForm: {
        main_cat_id: [],
        category: '',
        item_name: '',
        item_bn: '',
        shelf_status: ''
      },
      categoryList: [],
      salesCategoryList: [],
      tableData: [],
      page: 1,
      pageSize: 20,
      total: 0,
      loading: false,
      activityName: '',
      activityId: '',
      categoryFilterVisible: false,
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
    },
    importExtraParams() {
      return {
        distributor_id: this.distributor_id || '0'
      }
    },
    formBaseList() {
      return [
        {
          label: this.$t('2ff5650c.24bc52'),
          key: 'value',
          type: 'radio',
          disabled: () => this.IS_ADMIN() && this.distributor_id != '0',
          options: [
            { name: this.$t('2ff5650c.32925f'), label: '1' },
            { name: this.$t('2ff5650c.97596e'), label: '2' }
          ],
          onChange: async () => {
            const { id } = this.$route.params
            await this.$api.marketing.setActivityShareStore({
              activity_id: id,
              if_share_store: this.formBase.value == '1' ? 1 : 0
            })
            this.$message.success(this.$t('2ff5650c.33130f'))
          }
        }
      ]
    },
    patchFormList() {
      return [
        { label: this.$t('2ff5650c.b5ad46'), key: 'activity_price', type: 'input' },
        { label: this.$t('2ff5650c.a43d00'), key: 'activity_store', type: 'input' },
        { label: this.$t('2ff5650c.c360e9'), key: 'sort', type: 'input' },
        { label: this.$t('2ff5650c.343488'), key: 'limit_num', type: 'input' },
        { label: this.$t('2ff5650c.8a34e8'), key: 'limit_fee', type: 'input' }
      ]
    },
    batchShelfFormList() {
      return [
        {
          label: this.$t('d41d8cd9.3fea7c'),
          key: 'shelf_status',
          type: 'radio',
          options: [
            { name: this.$t('b7aea01d.4a5098'), label: 1 },
            { name: this.$t('b7aea01d.d2379a'), label: 0 }
          ]
        }
      ]
    },
    categoryFilterToggleText() {
      const action = this.categoryFilterVisible
        ? this.$t('7a07d52e.def9e9')
        : this.$t('7a07d52e.e2edde')
      return `${action}${this.$t('1f1701db.d0771a')}`
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
    toggleCategoryFilter() {
      this.categoryFilterVisible = !this.categoryFilterVisible
    },
    onFilterReset() {
      if (!this.categoryFilterVisible) {
        this.queryForm.main_cat_id = []
      }
      this.categoryFilterVisible = false
      this.onSearch()
    },
    handleImport() {
      this.importDialog = true
    },
    onImportDialogClosed() {
      this.pagesQuery.refresh()
    },
    collectSelectedItemIds() {
      const selectItems = this.tableData.filter((item) => !!item.checked)
      if (!selectItems.length) {
        return []
      }
      const itemIds = []
      selectItems.forEach((item) => {
        if (item.nospec == 'true') {
          itemIds.push(item.item_id)
        } else if (typeof item.spec_items != 'undefined') {
          item.spec_items.forEach((sitem) => {
            itemIds.push(sitem.item_id)
          })
        }
      })
      return itemIds
    },
    handlePatchAction() {
      const itemIds = this.collectSelectedItemIds()
      if (itemIds.length > 0) {
        this.patchForm.item_id = itemIds
        this.patchDialog = true
      } else {
        this.$message.error(this.$t('2ff5650c.c5c5f2'))
      }
    },
    handleBatchShelfAction() {
      const itemIds = this.collectSelectedItemIds()
      if (itemIds.length > 0) {
        this.batchShelfForm = {
          item_id: itemIds,
          shelf_status: 1
        }
        this.batchShelfDialog = true
      } else {
        this.$message.error(this.$t('2ff5650c.c5c5f2'))
      }
    },
    async onBatchShelfSubmit() {
      const { id } = this.$route.params
      const { item_id, shelf_status } = this.batchShelfForm
      await this.$api.marketing.updateActivityItem({
        activity_id: id,
        item_id,
        shelf_status: Number(shelf_status)
      })
      this.batchShelfDialog = false
      this.$message.success(this.$t('2ff5650c.33130f'))
      this.pagesQuery.refresh()
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
        this.tableData.forEach((item) => {
          item['checked'] = true
        })
      } else {
        this.tableData.forEach((item) => {
          item['checked'] = false
        })
      }
    },
    onSearch() {
      this.pagesQuery.reset()
    },
    async getActivityItemDetail() {
      const { id } = this.$route.params
      const res = await this.$api.marketing.getActivityItemDetail(id)
      this.activityId = res.id || id
      this.activityName = res.name || ''
      this.formBase.value = res.if_share_store ? '1' : '2'
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
          item_id: value.map((item) => item.itemId)
        }
      } else if (type == 'category') {
        const main_cat_id = value.map((item) => item[item.length - 1])
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
      list.forEach((item) => {
        item['is_sku'] = false
        item['activity_price'] = item.activity_price / 100
        item['limit_fee'] = item.limit_fee / 100
        item['tid'] = ++tindex
        item['checked'] = false
        item['shelf_status'] =
          item.shelf_status === undefined || item.shelf_status === null
            ? 1
            : Number(item.shelf_status)
        if (typeof item.spec_items != 'undefined') {
          item.spec_items.forEach((sitem) => {
            sitem['is_sku'] = true
            sitem['activity_price'] = sitem.activity_price / 100
            sitem['limit_fee'] = sitem.limit_fee / 100
            sitem['tid'] = ++tindex
            sitem['shelf_status'] =
              sitem.shelf_status === undefined || sitem.shelf_status === null
                ? 1
                : Number(sitem.shelf_status)
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
        data: spec_items.map((item) => item.item_id),
        itemId: default_item_id,
        itemName: item_name,
        itemBn: item_bn
      })
      const { id } = this.$route.params
      await this.$api.marketing.selectSkuOfItems({
        activity_id: id,
        goods_id: goods_id,
        item_id: data.map((item) => item.itemId)
      })
      this.pagesQuery.reset()
    },
    async toggleShelfStatus({ item_id, is_sku, shelf_status }) {
      const { id } = this.$route.params
      const params = {
        activity_id: id,
        item_id,
        shelf_status: Number(shelf_status) === 1 ? 0 : 1
      }
      if (!is_sku) {
        params.all = 1
      }
      await this.$api.marketing.updateActivityItem(params)
      this.$message.success(this.$t('2ff5650c.33130f'))
      this.pagesQuery.refresh()
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
