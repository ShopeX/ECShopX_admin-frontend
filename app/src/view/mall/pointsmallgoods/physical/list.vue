<style scoped lang="scss">
.goods-title {
  padding-bottom: 5px;
}
.goods-code {
  color: #888;
  font-size: 13px;
  i {
    cursor: pointer;
  }
}
</style>
<template>
  <div>
    <div v-if="$route.path.indexOf('editor') === -1">
      <el-row class="filter-header" :gutter="20">
        <el-col>
          <el-input class="input-m" placeholder="商品名称" v-model="params.keywords">
            <el-button slot="append" icon="el-icon-search" @click="goodsSearch"></el-button>
          </el-input>
          <el-input class="input-m" placeholder="商品编号" v-model="params.item_bn">
            <el-button slot="append" icon="el-icon-search" @click="goodsSearch"></el-button>
          </el-input>
          <el-select
            v-model="templates_id"
            @change="handleChangeTemplates"
            placeholder="运费模板"
            clearable
          >
            <el-option
              v-for="item in templatesList"
              :key="item.template_id"
              :label="item.name"
              :value="item.template_id"
            ></el-option>
          </el-select>
          <el-cascader
            placeholder="商品产地"
            :options="regions"
            v-model="select_regions_value"
            clearable
            @change="searchAction"
          >
          </el-cascader>
          <el-select
            v-model="params.approve_status"
            clearable
            placeholder="商品状态"
            @change="goodsSearch"
          >
            <el-option
              v-if="login_type != 'distributor'"
              v-for="item in statusOption"
              :key="item.value"
              :label="item.title"
              size="mini"
              :value="item.value"
            ></el-option>
            <el-option
              v-if="login_type == 'distributor'"
              v-for="item in shopStatusOption"
              :key="item.value"
              :label="item.title"
              size="mini"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            placeholder="选择品牌"
            remote
            filterable
            :remote-method="getGoodsBranchList"
            clearable
            v-model="select_branch_value"
            @change="searchAction"
          >
            <el-option
              v-for="item in goodsBranchList"
              :key="item.attribute_id"
              :label="item.attribute_name"
              :value="item.attribute_id"
            ></el-option>
          </el-select>
          <el-cascader
            placeholder="商品分类"
            :options="categoryList"
            :props="{ value: 'category_id', checkStrictly: true }"
            v-model="select_category_value"
            clearable
            @change="searchAction"
          >
          </el-cascader>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col>
          <el-button-group>
            <el-button type="primary" @click="addCategory">更改商品分类</el-button>
            <el-button type="primary" @click="addTemplates">更改运费模板</el-button>
            <el-button type="primary" @click="batchItemsStore">统一库存</el-button>
            <el-button type="primary" @click="batchItemsStatus('onsale')">批量上架</el-button>
            <el-button type="primary" @click="batchItemsStatus('instock')">批量下架</el-button>
             <export-tip @exportHandle='exportItemsData()'>
              <el-button type="primary">导出商品信息</el-button>
             </export-tip>
          </el-button-group>
          <el-button type="primary" icon="el-icon-circle-plus" plain @click="addItems"
            >添加商品</el-button
          >
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.name"
          :name="item.activeName"
        >
          <div v-if="activeName == 'second'" style="margin-bottom: 15px; width:280px;">
            <el-input v-model="warning_store" value="warning_store">
              <template slot="prepend">预警数量</template>
              <el-button slot="append" @click="setWarningStore">保存</el-button>
            </el-input>
          </div>
          <el-table :data="ItemsList" @selection-change="handleSelectionChange" v-loading="loading">
            <el-table-column type="selection" align="center" label="全选"></el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="editItemsAction(scope.$index, scope.row, false)"
                  class="btn-gap"
                  >编辑</el-button
                >
                <el-popover placement="right" width="450" trigger="hover">
                  <div class="operating-icons">
                    <el-button
                      type="text"
                      @click="deleteItemsAction(scope.$index, scope.row)"
                      class="btn-gap"
                      >删除</el-button
                    >
                    <el-button
                      type="text"
                      @click="editItemsAction(scope.$index, scope.row, true)"
                      class="btn-gap"
                      >添加相似</el-button
                    >
                    <el-button type="text" @click="updateItemsStore(scope.row)" class="btn-gap"
                      >更改库存</el-button
                    >
                    <!-- <el-button class="copy-btn"
                    type="text"
                    v-clipboard:copy="scope.row.link"
                    v-clipboard:success="onCopy">
                    <input class="copy-link" type="text" v-model="scope.row.link"></input>复制链接
                  </el-button> -->
                    <el-button
                      type="text"
                      v-if="scope.row.approve_status == 'onsale'"
                      @click="updateItemStatus(scope.row)"
                      class="btn-gap"
                      >下架</el-button
                    >
                    <el-button
                      type="text"
                      v-if="scope.row.approve_status == 'instock'"
                      @click="updateItemStatus(scope.row)"
                      class="btn-gap"
                      >上架</el-button
                    >
                  </div>
                  <el-button type="text" slot="reference"
                    ><i class="iconfont icon-angle-double-right"></i
                  ></el-button>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="goods_id" label="商品ID" width="80"></el-table-column>
            <el-table-column prop="itemName" label="商品">
              <template slot-scope="scope">
                <div class="goods-title">
                  {{ scope.row.item_name }}
                  <el-tag size="mini" effect="plain" type="primary" v-if="!scope.row.nospec"
                    >多规格</el-tag
                  >
                </div>
                <div class="goods-code">
                  货号：{{ scope.row.itemBn }}
                  <el-tooltip effect="dark" content="复制" placement="top-start">
                    <i
                      v-clipboard:copy="scope.row.itemBn"
                      v-clipboard:success="onCopy"
                      class="el-icon-document-copy"
                    ></i>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="排序编号" width="90">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.sort"
                  @change="editItemsSort(scope.$index, scope.row)"
                  size="mini"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="store" label="库存" width="80"></el-table-column>
            <el-table-column label="市场价" width="80">
              <template slot-scope="scope"> ¥{{ scope.row.market_price }} </template>
            </el-table-column>
            <el-table-column label="积分价格" width="150">
              <template slot-scope="scope">
                {{ scope.row.point }}积分<span v-if="scope.row.price > 0">
                  + ¥{{ scope.row.price }}</span
                >
              </template>
            </el-table-column>
            <el-table-column label="状态" width="80">
              <template slot-scope="scope">
                <span v-if="scope.row.audit_status == 'processing'">等待审核</span>
                <el-popover
                  v-else-if="scope.row.audit_status == 'rejected'"
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  :content="scope.row.audit_reason"
                >
                  <el-button type="text" slot="reference">审核驳回</el-button>
                </el-popover>
                <span v-else-if="scope.row.approve_status == 'onsale'">前台可销</span>
                <span v-else-if="scope.row.approve_status == 'offline_sale'">可线下销售</span>
                <span v-else-if="scope.row.approve_status == 'only_show'">前台仅展示</span>
                <span v-else>不可销售</span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="itemMainCatName" label="主类目" width="150"></el-table-column> -->
            <el-table-column prop="itemCatName" label="商品分类" width="150"></el-table-column>
          </el-table>
          <div class="content-center content-top-padded">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              :current-page.sync="params.page"
              :page-sizes="[10, 20, 50]"
              :total="total_count"
              :page-size="params.pageSize"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- 选择运费模板-开始 -->
      <el-dialog title="更改运费模板" :visible.sync="addTemplatesdialogVisible" width="30%">
        <el-select v-model="templates_new_id" placeholder="运费模板" style="width: 100%;">
          <el-option
            v-for="item in templatesList"
            :key="item.template_id"
            :label="item.name"
            :value="item.template_id"
          ></el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addTemplatesdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeTemplates">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 选择运费模板-结束 -->
      <!-- 选择商品分类-开始 -->
      <el-dialog title="更改商品分类" :visible.sync="addCategorydialogVisible" width="30%">
        <treeselect
          :options="categoryList"
          :multiple="true"
          :show-count="true"
          :disable-branch-nodes="true"
          v-model="category_id"
        >
        </treeselect>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCategorydialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeCategory">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 选择商品分类-结束 -->
      <SideBar :visible.sync="show_itemStore" title="设置商品库存" width="60">
        <slot>
          <el-table :data="storeItemsList" v-loading="skuLoading" height="100%">
            <el-table-column label="规格" prop="item_spec_desc" min-width="120"> </el-table-column>
            <el-table-column label="库存">
              <template slot-scope="scope">
                <el-input v-model="scope.row.store" size="mini" type="number"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </slot>
        <div slot="footer">
          <el-button type="primary" @click="saveItemsStore" :loading="submitLoading"
            >保存</el-button
          >
        </div>
      </SideBar>
      <el-dialog title="批量修改库存" :visible.sync="storeUpdate" width="30%">
        统一库存：<el-input v-model="itemstore" size="mini" type="number"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="storeUpdate = false">取 消</el-button>
          <el-button type="primary" @click="saveItemsStore">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Treeselect from '@riophae/vue-treeselect'
import SideBar from '@/components/element/sideBar'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { Message } from 'element-ui'
import { getShippingTemplatesList } from '@/api/shipping'
import { getDefaultCurrency } from '@/api/company'
import district from '@/common/district.json'
import {
  getItemsList,
  setItemsTemplate,
  setItemsCategory,
  deleteItems,
  getItemWarningStore,
  getCategory,
  setItemsSort,
  updateGoodsInfo,
  updateGoodsPrice,
  tagSearchItem,
  updateItemsStore,
  updateItemsStatus,
  getGoodsAttr,
  getGoodsExport,
  exportItemsData
} from '@/api/pointsmall'

export default {
  components: {
    Treeselect,
    SideBar
  },
  props: ['getStatus'],
  provide() {
    return {
      refresh: this.getGoodsList
    }
  },
  data() {
    return {
      login_type: 'default',
      select_regions_value: [],
      select_category_value: [],
      select_branch_value: [],
      special_type_list: [
        { value: 'normal', name: '普通商品' },
        { value: 'drug', name: '处方药' }
      ],
      regions: district,
      current: '',
      currentId: '',
      currentPrice: '',
      tabList: [
        { name: '全部商品', value: null, activeName: 'first' }
        // {name: "库存预警商品", value: 'true', activeName: 'second'},
      ],
      goodsName: '',
      isEdit: false,
      activeName: 'first',
      ItemsList: [],
      item_id: [],
      goods_id: [],
      templates_id: '',
      templates_new_id: '',
      templatesList: [],
      category_id: [],
      categoryList: [],
      loading: false,
      skuLoading: false,
      submitLoading: false,
      total_count: 0,
      warning_store: 5,
      templatesParams: {
        page: 1,
        pageSize: 1000
      },
      goodsBranchList: [],
      goodsBranchParams: {
        page: 1,
        pageSize: 1000,
        attribute_type: 'brand',
        attribute_name: ''
      },
      params: {
        page: 1,
        pageSize: 20,
        item_type: 'normal',
        templates_id: '',
        keywords: '',
        category: 0,
        is_warning: false,
        tag_id: '',
        type: 0
      },
      start_date: '',
      end_date: '',
      addTemplatesdialogVisible: false,
      addCategorydialogVisible: false,
      currency: {},
      cursymbol: '￥',
      form: {},
      exportData: {},
      specItems: [],
      statusOption: [
        { title: '前台可销售', value: 'onsale' },
        { title: '可线下销售', value: 'offline_sale' },
        { title: '前台仅展示', value: 'only_show' },
        { title: '不可销售', value: 'instock' }
      ],
      shopStatusOption: [
        { title: '审核驳回', value: 'rejected' },
        { title: '等待审核', value: 'processing' },
        { title: '前台可销售', value: 'onsale' },
        { title: '可线下销售', value: 'offline_sale' },
        { title: '前台仅展示', value: 'only_show' },
        { title: '不可销售', value: 'instock' }
      ],
      storeUpdate: false,
      storeItemsList: [],
      show_itemStore: false,
      itemstore: 0
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  methods: {
    init() {
      if (this.$route.path.split('/')[2] === 'godsphysicalkj') {
        console.log('跨境商品列表')
        this.params.type = 1
      } else {
        console.log('普通商品列表')
        this.params.type = 0
      }
      this.login_type = this.$store.getters.login_type
      if (this.$route.query.category) {
        this.params.category = this.$route.query.category
      }
      this.params.main_cat_id = this.$route.query.main_cat_id
      if (this.$route.query.tab) {
        this.activeName = this.$route.query.tab
        this.params.is_warning = true
      }
      this.getGoodsList()
      this.getShippingTemplatesList()
      this.getCategory()
      this.getCurrencyInfo()
      this.getGoodsBranchList()
    },
    exportItemsData() {
      if (this.item_id.length) {
        this.exportData.item_id = Object.assign({}, this.item_id)
        exportItemsData(this.exportData).then((res) => {
          if (res.data.data.status == true) {
            this.$message({
              type: 'success',
              message: '已加入执行队列，请在设置-导出列表中下载'
            })
          } else {
            this.$message({
              type: 'error',
              message: '导出失败'
            })
          }
        })
      } else {
        this.exportData = Object.assign({}, this.params)
        exportItemsData(this.exportData).then((res) => {
          if (res.data.data.status == true) {
            this.$message({
              type: 'success',
              message: '已加入执行队列，请在设置-导出列表中下载'
            })
          } else {
            this.$message({
              type: 'error',
              message: '导出失败'
            })
          }
        })
      }
    },
    searchAction() {
      this.params.page = 1
      if (this.select_regions_value) {
        this.params.regions_id = this.select_regions_value
      }
      this.params.category =  this.select_category_value && this.select_category_value.pop()
      this.params.brand_id = this.select_branch_value
      this.getGoodsList()
    },
    onCopy() {
      this.$notify.success({
        message: '复制成功',
        showClose: true
      })
    },
    handleClick(tab, event) {
      this.params.page = 1
      if (this.activeName == 'second') {
        this.params.is_warning = true
      } else {
        this.params.is_warning = false
      }
      this.getGoodsList()
    },
    setWarningStore() {
      getItemWarningStore({ store: this.warning_store }).then((res) => {
        this.params.page = 1
        this.getGoodsList()
      })
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getGoodsList()
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getGoodsList()
    },
    handleChangeTemplates(val) {
      this.currentPage = 1
      this.params.templates_id = val
      this.getGoodsList()
    },
    handleSelectionChange(val) {
      let item_id = []
      for (let i in val) {
        item_id.push(val[i].itemId)
      }
      this.item_id = item_id
      let goods_id = []
      for (let i in val) {
        goods_id.push(val[i].goods_id)
      }
      this.goods_id = goods_id
    },
    changeTemplates() {
      if (this.item_id.length) {
        if (!this.templates_new_id) {
          this.$message({
            type: 'error',
            message: '请选择运费模板'
          })
          return false
        }
        this.addTemplatesdialogVisible = false
        setItemsTemplate({ 'templates_id': this.templates_new_id, 'item_id': this.item_id }).then(
          (response) => {
            this.getGoodsList()
          }
        )
      } else {
        this.$message({
          type: 'error',
          message: '请选择至少一个商品'
        })
      }
    },
    editItemsSort(index, row) {
      setItemsSort({ 'sort': row.sort, 'item_id': row.itemId }).then((response) => {
        this.getGoodsList()
      })
    },
    changeCategory() {
      if (this.item_id.length) {
        if (!this.category_id) {
          this.$message({
            type: 'error',
            message: '请选择商品分类'
          })
          return false
        }
        this.addCategorydialogVisible = false
        setItemsCategory({ 'category_id': this.category_id, 'item_id': this.item_id }).then(
          (response) => {
            this.getGoodsList()
            this.category_id = []
          }
        )
      } else {
        this.$message({
          type: 'error',
          message: '请选择至少一个商品'
        })
      }
    },
    addItems() {
      // 添加商品
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    addTemplates() {
      if (this.item_id.length) {
        this.addTemplatesdialogVisible = true
      } else {
        this.$message({
          type: 'error',
          message: '请选择至少一个商品'
        })
      }
    },
    addCategory() {
      if (this.item_id.length) {
        this.addCategorydialogVisible = true
      } else {
        this.$message({
          type: 'error',
          message: '请选择至少一个商品'
        })
      }
    },
    editItemsAction(index, row, isNew) {
      // 编辑商品弹框
      this.show_itemStore = false
      if (isNew) {
        var routeData = this.$router.push({
          path: this.matchHidePage('editor/') + row.itemId,
          query: { is_new: true }
        })
      } else {
        var routeData = this.$router.push({ path: this.matchHidePage('editor/') + row.itemId })
      }
    },

    goodsSearch() {
      this.params.page = 1
      this.getGoodsList()
    },
    getGoodsList() {
      this.loading = true
      let params = JSON.parse(JSON.stringify(this.params))
      if (params.is_gift == 'all') {
        this.$delete(params, 'is_gift')
      }
      getItemsList(params).then((response) => {
        this.ItemsList = response.data.data.list
        this.ItemsList.forEach((item) => {
          item.price = item.price / 100
          item.market_price = item.market_price / 100
          item.link = `pages/item/espier-detail?gid=${item.goods_id}&id=${item.item_id}`
        })
        this.total_count = response.data.data.total_count
        this.warning_store = response.data.data.warning_store
        this.loading = false
        this.templates_new_id='';
        this.itemstore=0;
      })
    },
    deleteItemsAction(index, row) {
      this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteItems(row.itemId).then((response) => {
            this.ItemsList.splice(index, 1)
            this.$message({
              message: '删除商品成功',
              type: 'success',
              duration: 2 * 1000
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    getTaskTime(strDate) {
      let date = new Date(strDate)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let str = y + '-' + m + '-' + d
      return str
    },
    getTimeStr(date) {
      return this.getTaskTime(new Date(parseInt(date) * 1000))
    },
    getShippingTemplatesList() {
      this.loading = true
      getShippingTemplatesList(this.templatesParams).then((response) => {
        this.templatesList = response.data.data.list
      })
    },
    getGoodsBranchList(searchVal = '') {
      this.goodsBranchParams.attribute_name = searchVal
      getGoodsAttr(this.goodsBranchParams).then((response) => {
        this.goodsBranchList = response.data.data.list
      })
    },
    getCategory() {
      getCategory({ is_show: false }).then((response) => {
        this.categoryList = response.data.data
      })
    },
    getCurrencyInfo() {
      getDefaultCurrency().then((res) => {
        this.currency = res.data.data
        this.cursymbol = this.currency.symbol
      })
    },
    batchItemsStore() {
      this.storeItemsList = []
      if (this.item_id.length) {
        this.storeUpdate = true
      } else {
        this.$message({
          type: 'error',
          message: '请选择至少一个商品'
        })
      }
    },
    batchItemsStatus(status) {
      if (this.goods_id.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择至少一个商品'
        })
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
          'items': JSON.stringify(data),
          'status': status
        }
      }
      this.submitLoading = true
      updateItemsStatus(params).then((res) => {
        if (res.data.data.status) {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 2 * 1000
          })
          this.getGoodsList()
        }
        this.submitLoading = false
        this.skuLoading = false
      })
    },
    updateItemStatus(items) {
      this.loading = true
      let params = {}
      params = {
        'items': [{ 'goods_id': items.goods_id }],
        'status': items.approve_status === 'instock' ? 'onsale' : 'instock'
      }
      updateItemsStatus(params).then((res) => {
        if (res.data.data.status) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 2 * 1000
          })
          this.getGoodsList()
        }
      })
      this.loading = false
    },
    updateItemsStore(items) {
      this.skuLoading = true
      this.item_id = []
      let param = JSON.parse(JSON.stringify(this.params))
      param.item_id = items.item_id
      param.is_sku = true
      this.storeItemsList = []
      getItemsList(param).then((response) => {
        let list = response.data.data.list
        let data = {}
        list.forEach((item) => {
          let data = {
            item_id: item.item_id,
            store: item.store,
            item_spec_desc: item.item_spec_desc ? item.item_spec_desc : item.item_name
          }
          this.storeItemsList.push(data)
        })
        this.skuLoading = false
      })
      this.show_itemStore = true
    },
    saveItemsStore() {
      this.skuLoading = true
      let params = {}
      if (this.storeItemsList.length > 0) {
        params = {
          'items': JSON.stringify(this.storeItemsList)
        }
      } else if (this.item_id.length > 0) {
        let data = []
        this.item_id.forEach((itemid) => {
          data.push({ item_id: itemid, store: this.itemstore, is_default: true })
        })
        params = {
          'items': JSON.stringify(data)
        }
      }
      this.submitLoading = true
      const _self = this
      updateItemsStore(params).then((res) => {
        if (res.data.data.status) {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 2 * 1000
          })
          this.getGoodsList();
        }
        this.submitLoading = false
        this.skuLoading = false
        this.storeUpdate = false
      })
    }
  },
  mounted() {
    this.form.category = this.$route.query.category
    this.select_category_value = this.$route.query.category
    this.init()
  },
  watch: {
    '$route'(to, from) {
      this.init()
    },
    getStatus(val) {
      if (val) {
        this.getGoodsList()
      }
    }
  }
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
