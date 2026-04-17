<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" scope>
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
<template>
  <SpPage>
    <div class="page-mall-communitygoods">
      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="keywords" :label="$t('7ee70716.752597')">
          <el-input v-model="params.keywords" :placeholder="$t('7ee70716.d83187')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="item_bn" :label="$t('7ee70716.479f77')">
          <el-input v-model="params.item_bn" :placeholder="$t('7ee70716.800b66')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="barcode" :label="$t('7ee70716.e2bbdf')">
          <el-input v-model="params.barcode" :placeholder="$t('7ee70716.363c4a')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="approve_status" :label="$t('7ee70716.2253ba')">
          <el-select v-model="params.approve_status" clearable :placeholder="$t('7ee70716.708c9d')">
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="$t(item.title)"
              size="mini"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="brand_id" :label="$t('7ee70716.dab469')">
          <el-select
            v-model="params.brand_id"
            :placeholder="$t('7ee70716.708c9d')"
            remote
            filterable
            clearable
            :remote-method="getGoodsBranchList"
          >
            <el-option
              v-for="item in goodsBranchList"
              :key="item.attribute_id"
              :label="item.attribute_name"
              :value="item.attribute_id"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="category" :label="$t('7ee70716.6a8fda')">
          <el-cascader
            v-model="params.category"
            :placeholder="$t('7ee70716.708c9d')"
            clearable
            :options="categoryList"
            :props="{ value: 'category_id', checkStrictly: true }"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="activity_name" :label="$t('7ee70716.f8f6a0')">
          <el-input v-model="params.activity_name" :placeholder="$t('7ee70716.d83187')" />
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" @click="handleAddGoods">{{ $t('7ee70716.2fba25') }}</el-button>
      </div>

      <el-tabs v-model="params.activity_status" type="card" @tab-click="onSearch">
        <el-tab-pane
          v-for="item in activity_status"
          :key="item.value"
          :label="$t(item.title)"
          :name="item.value"
        />

        <el-table v-loading="loading" border :data="tableList">
          <!-- <el-table-column type="selection" align="center" label="全选" /> -->
          <el-table-column prop="goods_id" :label="$t('7ee70716.858526')" />
          <el-table-column prop="itemName" :label="$t('7ee70716.9897d8')" width="300">
            <template slot-scope="scope">
              <div class="goods-title">
                {{ scope.row.item_name }}
                <el-tag v-if="!scope.row.nospec" size="mini" effect="plain" type="primary">
                  {{ $t('7ee70716.5d60de') }}
                </el-tag>
              </div>
              <div class="goods-code">
                {{ $t('7ee70716.4bb294') }}{{ scope.row.item_bn }}
                <el-tooltip effect="dark" :content="$t('7ee70716.79d3ab')" placement="top-start">
                  <i
                    v-clipboard:copy="scope.row.item_bn"
                    v-clipboard:success="onCopySuccess"
                    class="el-icon-document-copy"
                  />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('7ee70716.bfaf7d')" prop="min_delivery_num" />
          <el-table-column :label="$t('7ee70716.14d342')">
            <template slot-scope="scope">
              <template>
                <el-tag
                  v-for="taglist in scope.row.tagList"
                  :key="taglist.index"
                  :color="taglist.tag_color"
                  size="mini"
                  :style="'color:' + taglist.font_color"
                  style="display: inline-block; margin-right: 3px"
                >
                  {{ taglist.tag_name }}
                </el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column :label="$t('7ee70716.e8373a')" width="100">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.sort"
                size="mini"
                style="width: 60px"
                @change="editItemsSort(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="store" :label="$t('7ee70716.0eac88')" width="80" />
          <el-table-column prop="market_price" :label="$t('7ee70716.ae2748')" width="100">
            <template slot-scope="scope">
              {{ scope.row.market_price / 100 }}
            </template>
          </el-table-column>
          <el-table-column prop="price" :label="$t('7ee70716.cf0170')" width="100">
            <template slot-scope="scope">
              {{ scope.row.price / 100 }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('7ee70716.3fea7c')">
            <template slot-scope="scope">
              <span v-if="scope.row.audit_status == 'processing'">{{ $t('7ee70716.f6324c') }}</span>
              <el-popover
                v-else-if="scope.row.audit_status == 'rejected'"
                placement="top-start"
                width="200"
                trigger="hover"
                :content="scope.row.audit_reason"
              >
                <el-button slot="reference" type="text">{{ $t('7ee70716.a77aa8') }}</el-button>
              </el-popover>
              <span v-else-if="scope.row.approve_status == 'onsale'">{{
                $t('7ee70716.959221')
              }}</span>
              <span v-else-if="scope.row.approve_status == 'offline_sale'">{{
                $t('7ee70716.2c50a0')
              }}</span>
              <span v-else-if="scope.row.approve_status == 'only_show'">{{
                $t('7ee70716.acf86b')
              }}</span>
              <span v-else>{{ $t('7ee70716.ae83a3') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="itemCatName" :label="$t('7ee70716.c3ece5')" width="150" />

          <el-table-column fixed="left" :label="$t('7ee70716.2b6bc0')" width="160">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteItem(scope.row)">
                {{ $t('7ee70716.2f4aad') }}
              </el-button>
              <el-button type="text" class="btn-gap" @click="modifyItem(scope.row)">
                {{ $t('7ee70716.85d8be') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="mt-4 text-right">
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
      </el-tabs>

      <!-- 设置起送量 -->
      <SpDialog
        ref="sendNumDialogRef"
        v-model="sendNumDialog"
        :title="$t('7ee70716.85d8be')"
        :form="sendNumForm"
        :form-list="sendNumFormList"
        @onSubmit="onSendNumSubmit"
      />
    </div>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import mixin from '@/mixins'
import moment from 'moment'
import { pageMixin } from '@/mixins'
import { VERSION_STANDARD, isArray, VERSION_B2C, VERSION_IN_PURCHASE } from '@/utils'
import { getCommunityActivity, communityDeliver, communityOrderExport } from '@/api/promotions'
import { SALES_STATUS, ORDER_STATUS, PICKER_DATE_OPTIONS } from '@/consts'
import { i18n } from '@/i18n'

export default {
  mixins: [mixin, pageMixin],
  data() {
    return {
      loading: false,
      tableList: [],
      params: {
        item_type: 'normal',
        keywords: '',
        item_bn: '',
        barcode: '',
        approve_status: '',
        brand_id: '',
        category: 0,
        activity_name: '',
        activity_status: 'all'
      },
      statusOption: SALES_STATUS,
      goodsBranchList: [],
      goodsBranchParams: {
        page: 1,
        pageSize: 1000,
        attribute_type: 'brand',
        attribute_name: ''
      },
      categoryList: [],
      activity_status: [
        {
          title: i18n.t('7ee70716.794a4e'),
          value: 'all'
        },
        {
          title: i18n.t('7ee70716.91f239'),
          value: 'activing'
        }
      ],
      sendNumDialog: false,
      sendNumFormList: [
        {
          label: i18n.t('7ee70716.bfaf7d'),
          key: 'num',
          type: 'input',
          placeholder: i18n.t('7ee70716.7e7d8d'),
          required: true,
          message: i18n.t('7ee70716.281bad')
        }
      ],
      sendNumForm: {
        item_id: '',
        num: ''
      }
    }
  },
  computed: {
    ...mapGetters(['shopId'])
  },
  mounted() {
    this.getCategory()
    this.onSearch()
  },
  methods: {
    async handleAddGoods() {
      const { data } = await this.$picker.goods({
        data: [100],
        shopid: this.shopId
      })
      const goods_id = data.map((item) => item.item_id)
      await this.$api.community.addActivityGoods({
        goods_id
      })
      this.onSearch()
    },
    async fetchList({ pageIndex, pageSize }) {
      this.loading = true
      let query = {
        page: pageIndex,
        pageSize,
        ...this.params
      }
      if (query.activity_status == 'activing') {
        query['in_activity'] = true
      }
      delete query.activity_status

      const { list, total_count } = await this.$api.community.getActivityGoods(query)
      this.tableList = list
      this.page.total = total_count
      this.loading = false
    },
    async getGoodsBranchList(searchVal = '') {
      this.goodsBranchParams.attribute_name = searchVal
      const { list } = await this.$api.goods.getGoodsAttr(this.goodsBranchParams)
      this.goodsBranchList = list
    },
    async getCategory() {
      const res = await this.$api.goods.getCategory({ is_show: false })
      this.categoryList = res
    },
    async deleteItem({ item_id }) {
      await this.$confirm(this.$t('7ee70716.44d6f7'), this.$t('7ee70716.02d981'), {
        confirmButtonText: this.$t('7ee70716.38cf16'),
        cancelButtonText: this.$t('7ee70716.625fb2')
      })
      await this.$api.community.deleteActivityGoods(item_id)
      this.onSearch()
    },
    modifyItem({ item_id }) {
      this.sendNumForm.item_id = item_id
      this.sendNumDialog = true
    },
    async onSendNumSubmit() {
      const { item_id, num } = this.sendNumForm
      await this.$api.community.modifyGoodsDeliverNum({
        goods_id: item_id,
        min_delivery_num: num
      })
      this.$refs.sendNumDialogRef.resetForm()
      this.sendNumDialog = false
      this.onRefresh()
    },
    async editItemsSort({ item_id, sort }) {
      await this.$api.community.modifyGoodsSort({
        goods_id: item_id,
        sort
      })
      this.onRefresh()
    }
  }
}
</script>
