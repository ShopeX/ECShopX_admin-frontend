<style lang="scss" scope>
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
<template>
  <div class="page-mall-communitygoods">
    <div class="action-container">
      <el-button type="primary" @click="handleAddGoods"> 选择活动商品 </el-button>
    </div>

    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="keywords" label="商品名称:">
        <el-input v-model="params.keywords" placeholder="请输入商品名称" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="item_bn" label="商品编号:">
        <el-input v-model="params.item_bn" placeholder="请输入商品编号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="barcode" label="条形码:">
        <el-input v-model="params.barcode" placeholder="请输入商品编号条形码" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="approve_status" label="商品状态:">
        <el-select v-model="params.approve_status" clearable placeholder="请选择">
          <el-option
            v-for="item in statusOption"
            :key="item.value"
            :label="item.title"
            size="mini"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="brand_id" label="品牌:">
        <el-select
          v-model="params.brand_id"
          placeholder="请选择"
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
      <SpFilterFormItem prop="category" label="商品分类:">
        <el-cascader
          v-model="params.category"
          placeholder="请选择"
          clearable
          :options="categoryList"
          :props="{ value: 'category_id', checkStrictly: true }"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="activity_name" label="活动:">
        <el-input v-model="params.activity_name" placeholder="请输入商品名称" />
      </SpFilterFormItem>
    </SpFilterForm>

    <el-tabs v-model="params.activity_status" type="card" @tab-click="onSearch">
      <el-tab-pane
        v-for="item in activity_status"
        :key="item.value"
        :label="item.title"
        :name="item.value"
      />

      <el-table v-loading="loading" border :data="tableList">
        <!-- <el-table-column type="selection" align="center" label="全选" /> -->
        <el-table-column prop="goods_id" label="商品ID" />
        <el-table-column prop="itemName" label="商品" width="300">
          <template slot-scope="scope">
            <div class="goods-title">
              {{ scope.row.item_name }}
              <el-tag v-if="!scope.row.nospec" size="mini" effect="plain" type="primary">
                多规格
              </el-tag>
            </div>
            <div class="goods-code">
              货号：{{ scope.row.item_bn }}
              <el-tooltip effect="dark" content="复制" placement="top-start">
                <i
                  v-clipboard:copy="scope.row.item_bn"
                  v-clipboard:success="onCopySuccess"
                  class="el-icon-document-copy"
                />
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="起送量" prop="min_delivery_num" />
        <el-table-column label="标签">
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
        <el-table-column label="排序编号" width="100">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.sort"
              size="mini"
              style="width: 60px"
              @change="editItemsSort(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="store" label="库存" width="80" />
        <el-table-column prop="market_price" label="原价（¥）" width="100">
          <template slot-scope="scope">
            {{ scope.row.market_price / 100 }}
          </template>
        </el-table-column>
        <el-table-column prop="price" label="销售价（¥）" width="100">
          <template slot-scope="scope">
            {{ scope.row.price / 100 }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.audit_status == 'processing'">等待审核</span>
            <el-popover
              v-else-if="scope.row.audit_status == 'rejected'"
              placement="top-start"
              width="200"
              trigger="hover"
              :content="scope.row.audit_reason"
            >
              <el-button slot="reference" type="text"> 审核驳回 </el-button>
            </el-popover>
            <span v-else-if="scope.row.approve_status == 'onsale'">前台可销</span>
            <span v-else-if="scope.row.approve_status == 'offline_sale'">前台不展示 </span>
            <span v-else-if="scope.row.approve_status == 'only_show'">前台仅展示</span>
            <span v-else>不可销售</span>
          </template>
        </el-table-column>
        <el-table-column prop="itemCatName" label="商品分类" width="150" />

        <el-table-column fixed="left" label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteItem(scope.row)"> 删除 </el-button>
            <el-button type="text" class="btn-gap" @click="modifyItem(scope.row)">
              设置起送量
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="content-padded content-center">
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
      title="设置起送量"
      :form="sendNumForm"
      :form-list="sendNumFormList"
      @onSubmit="onSendNumSubmit"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import mixin from '@/mixins'
import moment from 'moment'
import { pageMixin } from '@/mixins'
import { VERSION_STANDARD, isArray, VERSION_B2C, VERSION_IN_PURCHASE } from '@/utils'
import { getCommunityActivity, communityDeliver, communityOrderExport } from '@/api/promotions'
import { SALES_STATUS, ORDER_STATUS, PICKER_DATE_OPTIONS } from '@/consts'

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
          title: '全部商品',
          value: 'all'
        },
        {
          title: '活动中的商品',
          value: 'activing'
        }
      ],
      sendNumDialog: false,
      sendNumFormList: [
        {
          label: '起送量',
          key: 'num',
          type: 'input',
          placeholder: '留空则不做起送量限制',
          required: true,
          message: '不能为空'
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
        data: 100,
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
      await this.$confirm('请确认是否删除商品', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
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
