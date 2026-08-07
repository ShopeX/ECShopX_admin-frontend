<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <SpPage>
      <div v-if="$route.path.indexOf('editor') === -1">
        <SpFormPlus
          ref="searchForm"
          v-model="params"
          form-type="searchForm"
          :inline="true"
          :form-items="searchFormItems"
          @submit="onSearch"
          @reset="onSearch"
        />

        <div class="action-container mt-4">
          <el-button type="primary" plain @click="Examine">{{ $t('c43c7afc.9fface') }}</el-button>
          <el-button type="primary" plain @click="batchItemsStatus('onsale')">
            {{ $t('c43c7afc.644c0d') }}
          </el-button>
          <el-button type="primary" plain @click="batchItemsStatus('instock')">
            {{ $t('c43c7afc.72aa38') }}
          </el-button>
          <el-dropdown @command="exportItemsWxappCode">
            <el-button type="primary" plain icon="iconfont icon-daorucaozuo-01">
              {{ $t('c43c7afc.55405e') }}<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="wxa">{{ $t('c43c7afc.b85b43') }}</el-dropdown-item>
              <el-dropdown-item command="h5">{{ $t('c43c7afc.cde87b') }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <el-tabs v-model="params.audit_status" type="card" @tab-click="onSearch">
          <el-tab-pane
            v-for="(item, index) in tabList"
            :key="index"
            :label="item.label"
            :name="item.name"
          >
            <el-table
              v-loading="loading"
              border
              :data="tableList"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" align="center" :label="$t('c43c7afc.66eeac')" />
              <el-table-column prop="goods_id" :label="$t('c43c7afc.858526')" />
              <el-table-column prop="itemName" :label="$t('c43c7afc.1fd1d5')" width="200">
                <template slot-scope="scope">
                  {{ scope.row.item_name }}
                  <el-tag v-if="scope.row.special_type == 'drug'" type="danger">
                    {{ $t('c43c7afc.e8b7e1') }}
                  </el-tag>

                  <div style="color: #888; font-size: 12px">
                    {{ $t('c43c7afc.2c8af9') }}{{ scope.row.goods_bn }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('c43c7afc.e8373a')">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.sort"
                    size="mini"
                    style="width: 60px"
                    @change="editItemsSort(scope.$index, scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="distributor_name" :label="$t('c43c7afc.53cc55')">
                <template slot-scope="scope">
                  {{ scope.row.distributor_name.name }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('c43c7afc.ea887b')">
                <template slot-scope="scope">
                  <el-tag v-if="!scope.row.nospec" effect="plain" size="mini" type="success">
                    {{ $t('c43c7afc.5d60de') }}
                  </el-tag>
                  <el-tag v-else effect="plain" size="mini">{{ $t('c43c7afc.048df4') }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="market_price" :label="$t('c43c7afc.5cd87e')">
                <template slot-scope="scope">
                  <span>{{ scope.row.market_price / 100 }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="price" :label="$t('c43c7afc.cf0170')" />
              <el-table-column prop="store" :label="$t('c43c7afc.0eac88')" />
              <el-table-column :label="$t('c43c7afc.3fea7c')">
                <template slot-scope="scope">
                  <span v-if="scope.row.audit_status == 'processing'">{{
                    $t('c43c7afc.f6324c')
                  }}</span>
                  <el-popover
                    v-else-if="scope.row.audit_status == 'rejected'"
                    placement="top-start"
                    width="200"
                    trigger="hover"
                    :content="scope.row.audit_reason"
                  >
                    <el-button slot="reference" type="text">{{ $t('c43c7afc.a77aa8') }}</el-button>
                  </el-popover>
                  <span v-else-if="scope.row.approve_status == 'onsale'">{{
                    $t('c43c7afc.959221')
                  }}</span>
                  <span v-else-if="scope.row.approve_status == 'offline_sale'">{{
                    $t('c43c7afc.2c50a0')
                  }}</span>
                  <span v-else-if="scope.row.approve_status == 'only_show'">{{
                    $t('c43c7afc.acf86b')
                  }}</span>
                  <span v-else>{{ $t('c43c7afc.ae83a3') }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('c43c7afc.2b6bc0')" width="200" fixed="left">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    class="btn-gap"
                    @click="editItemsAction(scope.$index, scope.row)"
                  >
                    {{ $t('c43c7afc.607e7a') }}
                  </el-button>
                  <el-button
                    v-if="scope.row.audit_status == 'processing'"
                    type="text"
                    class="btn-gap"
                    @click="batchItemsAudit(scope.row, scope.$index)"
                  >
                    {{ $t('c43c7afc.cf13b1') }}
                  </el-button>
                  <!-- <el-button
                  v-if="VERSION_PLATFORM()"
                  type="text"
                  @click="handleCommissionConf(scope.row)"
                  >
佣金配置
</el-button
                > -->
                </template>
              </el-table-column>
            </el-table>
            <div class="content-center content-top-padded">
              <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                :current-page.sync="page.pageIndex"
                :page-sizes="[10, 20, 50]"
                :total="page.total"
                :page-size="page.pageSize"
                @current-change="onCurrentChange"
                @size-change="onSizeChange"
              />
            </div>
          </el-tab-pane>
        </el-tabs>

        <el-dialog :title="$t('c43c7afc.ae3e26')" :visible.sync="dialogVisible" width="30%">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item :label="$t('c43c7afc.b6d0e9')">
              <el-radio-group v-model="form.audit_status">
                <el-radio label="approved">{{ $t('c43c7afc.23c1f3') }}</el-radio>
                <el-radio label="rejected">{{ $t('c43c7afc.7173f8') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.audit_status == 'rejected'" :label="$t('c43c7afc.f48f94')">
              <el-input v-model="form.audit_reason" type="textarea" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">{{ $t('c43c7afc.38cf16') }}</el-button>
              <el-button @click="dialogVisible = false">{{ $t('c43c7afc.625fb2') }}</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

        <SideBar :visible.sync="show_commission_sideBar" :title="$t('c43c7afc.dc620c')" width="60">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>
                <el-alert
                  :title="$t('c43c7afc.7032d4')"
                  :description="$t('c43c7afc.dfeb52')"
                  type="info"
                  close-text=" "
                  class="alert-text"
                  show-icon
                />
              </span>
              <span>
                <el-alert
                  :title="$t('c43c7afc.8f7886')"
                  :description="$t('c43c7afc.d0b560')"
                  type="info"
                  close-text=" "
                  class="alert-text"
                  show-icon
                />
              </span>
            </div>
            <el-form ref="form" label-width="120px">
              <el-form-item :label="$t('c43c7afc.1fd1d5')">
                {{ current.item_name }}
              </el-form-item>
              <el-form-item :label="$t('c43c7afc.670aaa')">
                <el-radio-group v-model="commissionSpecItems.commission_type">
                  <el-radio label="1">{{ $t('c43c7afc.81522a') }}</el-radio>
                  <el-radio label="2">{{ $t('c43c7afc.dbeaab') }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('c43c7afc.c26e4b')" :rules="[{ required: true }]">
                <el-input
                  v-model="commissionSpecItems.commission"
                  size="mini"
                  type="number"
                  style="width: 200px"
                >
                  <template v-if="1 == commissionSpecItems.commission_type" slot="append">
                    %
                  </template>
                </el-input>
                <div class="form-item-tip">{{ $t('c43c7afc.cd5ed3') }}</div>
              </el-form-item>
            </el-form>
            <el-table v-loading="skuLoading" :data="commissionSpecItems.sku_commission">
              <el-table-column :label="$t('c43c7afc.ea887b')" prop="item_spec_desc" min-width="120">
                <template slot-scope="scope">
                  <span v-if="scope.row.item_spec_desc">{{ scope.row.item_spec_desc }}</span
                  ><span v-else>{{ $t('c43c7afc.048df4') }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('c43c7afc.e29575')" min-width="80">
                <template slot-scope="scope"> ¥{{ scope.row.price / 100 }} </template>
              </el-table-column>
              <el-table-column :label="$t('c43c7afc.2e2ce2')" min-width="80">
                <template slot-scope="scope"> ¥{{ scope.row.cost_price / 100 }} </template>
              </el-table-column>
              <el-table-column :label="$t('c43c7afc.8dfe7b')">
                <template slot-scope="scope">
                  <div v-if="0 == commissionSpecItems.commission_type">
                    <el-input :disabled="true" size="mini" type="number" value="0" />
                  </div>
                  <div v-else>
                    <el-input v-model="scope.row.commission" size="mini" type="number">
                      <template v-if="1 == commissionSpecItems.commission_type" slot="append">
                        %
                      </template>
                    </el-input>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
          <div slot="footer">
            <el-button type="primary" :loading="submitLoading" @click="saveCommissionConf">
              {{ $t('c43c7afc.be5fbb') }}
            </el-button>
          </div>
        </SideBar>
      </div>
      <router-view />
    </SpPage>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import district from '@/common/district.json'
import SideBar from '@/components/element/sideBar'
import {
  getItemsList,
  auditItems,
  updateItemsStatus,
  getGoodsCommission,
  saveGoodsCommission
} from '@/api/goods'
import { pageMixin } from '@/mixins'
import { SALES_STATUS } from '@/consts'
import { isArray } from '@/utils'
import { setPaymentSetting, getPaymentSetting } from '@/api/trade'

export default {
  components: {
    SideBar
  },
  mixins: [pageMixin],
  provide() {
    return {
      refresh: this.fetchList
    }
  },
  props: ['getStatus'],
  data() {
    return {
      dialogVisible: false,
      regions: district,
      tabListData: [
        { labelKey: 'c43c7afc.794a4e', name: '' },
        { labelKey: 'c43c7afc.5cb424', name: 'processing' }
      ],
      form: {
        audit_status: 'approved',
        audit_reason: ''
      },
      activeName: 'first',
      ItemsList: [],
      goods_id: [],
      loading: false,
      itemCategoryList: [],
      params: {
        keywords: '',
        item_bn: '',
        goods_bn: '',
        regions_id: [],
        approve_status: '',
        distributor_id: 'all_distributor',
        audit_status: '',
        main_cat_id: ''
      },
      salesStatus: SALES_STATUS,
      submitLoading: false,
      show_commission_sideBar: false,
      skuLoading: false,
      commissionSpecItems: [],
      current: ''
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    tabList() {
      return this.tabListData.map((item) => ({ label: this.$t(item.labelKey), name: item.name }))
    },
    searchFormItems() {
      return [
        {
          fieldName: 'keywords',
          label: this.$t('c43c7afc.752597'),
          component: 'input',
          cellWidth: 1.3,
          componentProps: {
            placeholder: this.$t('c43c7afc.d83187')
          }
        },
        {
          fieldName: 'goods_bn',
          label: this.$t('c43c7afc.288587'),
          component: 'input',
          cellWidth: 1.3,
          componentProps: {
            placeholder: this.$t('c43c7afc.36438f')
          }
        },
        {
          fieldName: 'item_bn',
          label: this.$t('c43c7afc.8dd62f'),
          component: 'input',
          cellWidth: 1.3,
          componentProps: {
            placeholder: this.$t('c43c7afc.983e9f')
          }
        },
        {
          fieldName: 'regions_id',
          label: this.$t('c43c7afc.efcb2d'),
          component: 'cascader',
          cellWidth: 1.3,
          componentProps: {
            clearable: true,
            placeholder: this.$t('c43c7afc.708c9d'),
            options: this.regions
          }
        },
        {
          fieldName: 'approve_status',
          label: this.$t('c43c7afc.2253ba'),
          component: 'select',
          cellWidth: 1.3,
          componentProps: {
            clearable: true,
            placeholder: this.$t('c43c7afc.708c9d'),
            options: this.salesStatus.map((item) => ({
              label: item.title,
              value: item.value
            }))
          }
        },
        {
          fieldName: 'distributor_id',
          label: this.$t('c43c7afc.efa91f'),
          cellWidth: 1.3,
          component: ({ h, value, onInput }) => {
            return h('SpSelectShop', {
              props: {
                value,
                clearable: true,
                size: 'small',
                placeholder: this.$t('c43c7afc.708c9d')
              },
              on: {
                input: (val) => onInput(val || 'all_distributor')
              }
            })
          }
        },
        {
          fieldName: 'main_cat_id',
          label: this.$t('c43c7afc.e73602'),
          component: 'cascader',
          cellWidth: 1.3,
          componentProps: {
            clearable: true,
            placeholder: this.$t('c43c7afc.708c9d'),
            options: this.itemCategoryList,
            props: { value: 'category_id', label: 'category_name', checkStrictly: true }
          }
        }
      ]
    }
  },
  created() {
    this.getMainCategory()
  },
  mounted() {
    const { main_cat_id } = this.$route.query
    if (main_cat_id) {
      this.params.main_cat_id = main_cat_id
    }
    this.fetchList()
  },
  methods: {
    async getMainCategory() {
      //管理分类
      const res = await this.$api.goods.getCategory({ is_main_category: true })
      this.itemCategoryList = res
    },
    // 导出
    async exportItemsWxappCode(exportType) {
      let params
      if (this.goods_id.length) {
        params = {
          item_id: this.goods_id
        }
      } else {
        params = {
          ...this.params
        }
      }
      const { status } = await this.$api.goods.exportGoodsCode({
        ...params,
        item_source: 'distributor',
        export_type: exportType
      })
      if (status) {
        this.$message.success(this.$t('c43c7afc.3e1ddd'))
        this.$export_open('itemcode')
      } else {
        this.$message.error(this.$t('c43c7afc.dd51ab'))
      }
    },

    // 批量审批
    Examine() {
      if (this.goods_id.length === 0) {
        this.$message.error(this.$t('c43c7afc.ace302'))
        return false
      }

      this.dialogVisible = true
    },
    // 审核确定
    onSubmit() {
      this.form.goods_id = this.goods_id
      auditItems(this.form).then((res) => {
        this.$message.success(this.$t('c43c7afc.3b1083'))
        this.dialogVisible = false
        this.fetchList()
      })
    },

    batchItemsAudit(row, e) {
      console.log(row)
      this.goods_id = [row.goods_id]
      this.dialogVisible = true
    },

    handleSelectionChange(val) {
      let goods_id = []
      for (let i in val) {
        goods_id.push(val[i].goods_id)
      }
      this.goods_id = goods_id
    },

    editItemsAction(index, row) {
      // 编辑商品弹框
      var routeData = this.$router.push({
        path: this.matchRoutePath('editor/') + row.itemId
      })
    },

    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        item_type: 'normal',
        ...this.params
      }
      if (this.params.main_cat_id) {
        if (isArray(this.params.main_cat_id)) {
          params.main_cat_id = this.params.main_cat_id[this.params.main_cat_id.length - 1]
        } else {
          params.main_cat_id = this.params.main_cat_id
        }
      }

      const { list, total_count } = await this.$api.goods.getItemsList(params)
      list.forEach((item) => {
        item.price = item.price / 100
        item.link = `subpages/item/espier-detail?gid=${item.goods_id}&id=${item.item_id}`
      })
      this.tableList = list
      this.page.total = total_count
      this.loading = false
    },

    batchItemsStatus(status) {
      if (this.goods_id.length === 0) {
        this.$message.error(this.$t('c43c7afc.ace302'))
        return false
      }
      this.skuLoading = true
      let params = {}
      if (this.goods_id.length > 0) {
        let data = []
        this.goods_id.forEach((goods_id) => {
          data.push({ goods_id: goods_id })
        })
        params = {
          items: JSON.stringify(data),
          status: status
        }
      }
      this.submitLoading = true
      updateItemsStatus(params).then((res) => {
        if (res.data.data.status) {
          this.$message({
            message: this.$t('c43c7afc.69be67'),
            type: 'success',
            duration: 2 * 1000
          })
          this.fetchList()
        }
        this.submitLoading = false
        this.skuLoading = false
      })
    },
    handleCommissionConf(data) {
      this.show_commission_sideBar = true
      this.skuLoading = true
      this.current = data
      getGoodsCommission(data.item_id).then((res) => {
        var commissionSpecItems = res.data.data
        this.commissionSpecItems = commissionSpecItems
        this.skuLoading = false
      })
    },
    saveCommissionConf() {
      if (this.commissionSpecItems.commission == '') {
        this.$message({
          type: 'error',
          message: this.$t('c43c7afc.1a3595')
        })
        return false
      }
      var rebateConf = []
      let params = {
        item_id: this.current.item_id,
        goods_id: this.current.goods_id,
        commission_type: this.commissionSpecItems.commission_type
      }
      if (params.commission_type == '1') {
        params.commission = this.commissionSpecItems.commission
      } else {
        params.commission = this.commissionSpecItems.commission * 100
      }
      this.commissionSpecItems.sku_commission.forEach((item) => {
        var sku_commission = { item_id: item.item_id }
        if (this.commissionSpecItems.commission_type == '2') {
          sku_commission.commission = item.commission * 100
        } else {
          sku_commission.commission = item.commission
        }
        rebateConf.push(sku_commission)
      })
      params.sku_commission = JSON.stringify(rebateConf)
      saveGoodsCommission(params).then((res) => {
        this.$message({
          message: this.$t('c43c7afc.3b1083'),
          type: 'success',
          duration: 2 * 1000
        })
      })
    }
  }
  // watch: {
  //   $route() {
  //     this.getGoodsList();
  //   },
  // },
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
  img {
    width: 90%;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 10px;
  img {
    width: 90%;
  }
}
.row-bg {
  padding: 10px 20px;
  background-color: #f9fafc;
}
.service-label .el-checkbox:first-child {
  margin-left: 15px;
}
.service-label .el-input:first-child {
  margin-left: 15px;
}
.grid-detail {
  max-height: 300px;
  overflow-y: scroll;
  margin-bottom: 20px;
}
.el-carousel {
  width: 375px;
}
.tag-users {
  padding-bottom: 10px;
  line-height: 1.2;
  .icon-user-circle1 {
    margin-right: 10px;
    font-size: 24px;
    color: #ccc;
  }
}
.selected-tags {
  padding-top: 15px;
  margin-bottom: 15px;
  border-top: 1px solid #efefef;
  border-bottom: 1px solid #efefef;
  .label {
    margin-bottom: 15px;
  }
  .el-tag {
    margin-right: 10px;
    margin-bottom: 15px;
  }
}
.tag-item {
  cursor: pointer;
  color: #666;
  border-color: #dadadd;
  margin-right: 10px;
  margin-top: 10px;
}
.copy-btn {
  position: relative;
  [class^='copy-link'] {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    visibility: hidden;
  }
}
.form-item-tip {
  font-size: 13px;
  color: #999;
  line-height: initial;
}
</style>
<style lang="scss">
.grid-detail {
  table,
  .detail-content-wrap,
  .detail-content-item {
    width: 100% !important;
  }
  img {
    width: 100%;
  }
}
.grid-attribute {
  table {
    width: 100% !important;
  }
}
</style>
