<template>
  <div>
    <div v-if="$route.path.indexOf('editor') === -1">
      <el-row :gutter="20">
        <el-col :span="24">
          <shop-select
            style="width: 60%"
            distributors
            :shop-id-default="params.distributor_id"
            @update="storeSearch"
          />
          <!--distributors wxshops 需要哪个api传哪个-->
          <el-input v-model="goodsName" style="width: 20%" placeholder="商品名称" size="mini">
            <el-button slot="append" icon="el-icon-search" @click="goodsSearch" />
          </el-input>
          <el-select
            v-model="templates_id"
            size="mini"
            placeholder="运费模板"
            style="width: 20%"
            @change="handleChangeTemplates"
          >
            <el-option
              v-for="item in templatesList"
              :key="item.template_id"
              :label="item.name"
              :value="item.template_id"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row v-if="login_type == 'distributor'" :gutter="20">
        <el-col :span="12">
          <el-button-group>
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              style="display: inline-block"
              @click="addItems"
            >
              添加商品
            </el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              style="display: inline-block"
              @click="addCategory"
            >
              更改销售分类
            </el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              style="display: inline-block"
              @click="addTemplates"
            >
              更改运费模板
            </el-button>
          </el-button-group>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.name"
          :name="item.activeName"
        >
          <div v-if="activeName == 'second'" style="margin-bottom: 15px; width: 280px">
            <el-input v-model="warning_store" value="warning_store">
              <template slot="prepend">
预警数量
</template>
              <el-button slot="append" @click="setWarningStore">
保存
</el-button>
            </el-input>
          </div>
          <el-table
            v-loading="loading"
            :data="ItemsList"
            style="width: 100%"
            :height="wheight - 280"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" align="center" label="全选" />
            <el-table-column prop="goods_id" label="商品ID" min-width="80" />
            <el-table-column label="排序编号" min-width="100">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.sort"
                  size="mini"
                  @change="editItemsSort(scope.$index, scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="itemName" label="商品名称" min-width="240" />
            <el-table-column prop="price" label="价格" min-width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.itemId !== currentId">
                  ¥{{ scope.row.price }}
                  <i
                    class="el-input__icon el-icon-edit"
                    @click="editPrice(scope.row.itemId, scope.row.price)"
                  />
                </div>
                <el-input
                  v-else
                  :ref="'input_' + scope.row.itemId"
                  v-model="currentPrice"
                  size="mini"
                  @blur="handleBlur(scope.$index)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="store" label="库存" min-width="80" />
            <!--el-table-column prop="rebate" label="店铺佣金" :formatter="rebateformatter" width="100"></el-table-column-->
            <el-table-column label="状态" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.approve_status == 'onsale'">前台可销</span>
                <span v-else-if="scope.row.approve_status == 'offline_sale'">前台不展示 </span>
                <span v-else-if="scope.row.approve_status == 'only_show'">前台仅展示</span>
                <span v-else>不可销售</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="200">
              <template slot-scope="scope">
                <div class="operating-icons">
                  <el-button
                    size="mini"
                    icon="edit"
                    type="text"
                    class="btn-gap"
                    @click="itemsDetail(scope.$index, scope.row)"
                  >
                    查看
                  </el-button>
                  <el-button
                    size="mini"
                    icon="edit"
                    type="text"
                    class="btn-gap"
                    @click="editItemsAction(scope.$index, scope.row, false)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    size="mini"
                    icon="edit"
                    type="text"
                    class="btn-gap"
                    @click="deleteItemsAction(scope.$index, scope.row)"
                  >
                    删除
                  </el-button>
                  <!--el-button size="mini" icon="edit" type="text" @click="editItemsAction(scope.$index, scope.row, true)" class="btn-gap">添加相似</el-button-->
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="content-center content-top-padded">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next"
              :current-page.sync="params.page"
              :page-sizes="[10, 20, 50]"
              :total="total_count"
              :page-size="params.pageSize"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>

      <!-- 查看商品详情-开始 -->
      <el-dialog
        title="商品详情"
        :visible.sync="ItemsDetailVisible"
        :close-on-click-modal="false"
        class="good-detail-dialog"
      >
        <template>
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="grid-content">
商品名称
</div>
            </el-col>
            <el-col :span="21">
              <div class="grid-content">
                {{ itemsDetailData.item_name }}
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="grid-content">
简述
</div>
            </el-col>
            <el-col :span="21">
              <div class="grid-content">
                {{ itemsDetailData.brief }}
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="grid-content">
价格
</div>
            </el-col>
            <el-col :span="21">
              <div class="grid-content">
￥{{ itemsDetailData.price }}
</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="grid-content">
原价
</div>
            </el-col>
            <el-col :span="21">
              <div class="grid-content">
￥{{ itemsDetailData.market_price / 100 }}
</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="grid-content">
库存
</div>
            </el-col>
            <el-col :span="21">
              <div class="grid-content">
                {{ itemsDetailData.store }}
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="grid-content">
状态
</div>
            </el-col>
            <el-col :span="21">
              <div v-if="itemsDetailData.approve_status === 'onsale'" class="grid-content">
                前台可销售
              </div>
              <div
                v-else-if="itemsDetailData.approve_status === 'offline_sale'"
                class="grid-content"
              >
                前台不展示
              </div>
              <div v-else class="grid-content">
不可销售
</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="grid-content">
图片
</div>
            </el-col>
            <el-col :span="21">
              <div class="grid-content">
                <div class="block">
                  <el-carousel
                    height="200px"
                    width="375px"
                    :autoplay="true"
                    indicator-position="outside"
                  >
                    <template v-if="itemsDetailData.pics">
                      <el-carousel-item
                        v-for="pic in itemsDetailData.pics"
                        :key="pic"
                        :style="{
                          backgroundImage: 'url(' + wximageurl + pic + ')',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat'
                        }"
                      />
                    </template>
                  </el-carousel>
                </div>
              </div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content">
详情
</div>
            </el-col>
            <el-col :span="21">
              <div class="grid-content grid-detail" v-html="itemsDetailData.intro" />
            </el-col>
          </el-row>
          <el-row v-if="itemsDetailData.enable_agreement">
            <el-col :span="3">
              <div class="grid-content">
购买协议
</div>
            </el-col>
            <el-col :span="21">
              <div class="grid-content grid-detail" v-html="itemsDetailData.purchase_agreement" />
            </el-col>
          </el-row>
        </template>
        <div slot="footer" class="dialog-footer content-center">
          <el-button
            @click.native="
              ItemsDetailVisible = false
              itemsDetailData = {}
            "
          >
            取消
          </el-button>
        </div>
      </el-dialog>
      <!-- 查看商品详情-结束 -->
      <!-- 选择运费模板-开始 -->
      <el-dialog title="更改运费模板" :visible.sync="addTemplatesdialogVisible" width="30%">
        <el-select v-model="templates_new_id" placeholder="运费模板" style="width: 100%">
          <el-option
            v-for="item in templatesList"
            :key="item.template_id"
            :label="item.name"
            :value="item.template_id"
          />
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addTemplatesdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeTemplates">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 选择运费模板-结束 -->
      <!-- 选择商品分类-开始 -->
      <el-dialog title="更改销售分类" :visible.sync="addCategorydialogVisible" width="30%">
        <treeselect
          v-model="category_id"
          :options="categoryList"
          :multiple="true"
          :show-count="true"
          :disable-branch-nodes="true"
        />
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCategorydialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeCategory">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 选择商品分类-结束 -->
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { Message } from 'element-ui'
import { getShippingTemplatesList } from '@/api/shipping'
import shopSelect from '@/components/shopSelect'
import { getDefaultCurrency } from '@/api/company'
import { getDistributorInfo } from '../../../api/marketing'
import {
  getItemsList,
  getItemsDetail,
  setItemsTemplate,
  setItemsCategory,
  deleteItems,
  getItemWarningStore,
  getCategory,
  setItemsSort,
  updateGoodsInfo
} from '@/api/goods'
export default {
  components: {
    shopSelect,
    Treeselect
  },
  props: {
    distributorId: {
      type: String,
      default: ''
    },
    isLoad: {
      type: Boolean,
      default: false
    }
  },
  provide () {
    return {
      refresh: this.getGoodsList
    }
  },
  data () {
    return {
      currentId: '',
      currentPrice: '',
      tabList: [
        { name: '全部商品', value: null, activeName: 'first' },
        { name: '库存预警商品', value: 'true', activeName: 'second' }
      ],
      goodsName: '',
      isEdit: false,
      activeName: 'first',
      ItemsList: [],
      item_id: [],
      login_type: 'default',
      templates_id: '',
      templates_new_id: '',
      templatesList: [],
      category_id: [],
      categoryList: [],
      ItemsDetailVisible: false,
      itemsDetailData: {},
      loading: false,
      total_count: 0,
      warning_store: 5,
      templatesParams: {
        page: 1,
        pageSize: 1000,
        distributor_id: ''
      },
      params: {
        page: 1,
        pageSize: 20,
        item_source: 'distributor',
        item_type: 'normal',
        templates_id: '',
        keywords: '',
        category: 0,
        is_warning: false
      },
      start_date: '',
      end_date: '',
      addTemplatesdialogVisible: false,
      addCategorydialogVisible: false,
      currency: {},
      cursymbol: '￥'
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted () {
    this.login_type = this.$store.getters.login_type
    this.$nextTick(() => {
      if (this.isLoad) {
        if (!this.distributorId) {
          this.getDistributorItemList()
        } else {
          this.params.distributor_id = this.distributorId
          this.getDistributorItemList()
        }
        this.params.category = this.$route.query.category
        this.getShippingTemplatesList()
        this.getCategory()
        this.getCurrencyInfo()
      }
    })
  },
  methods: {
    storeSearch (val) {
      val && val.shop_id
      this.params.distributor_id = val.shop_id
      this.params.page = 1
      this.getGoodsList()
    },
    editPrice (id, price) {
      this.currentId = id
      this.currentPrice = price
      let self = this
      this.$nextTick(() => {
        self.$refs['input_' + id][0].focus()
      })
    },
    handleBlur (index) {
      if (this.currentPrice === this.ItemsList[index].price) {
        this.currentId = -1
        this.currentPrice = ''
        return
      }
      updateGoodsInfo({ item_id: this.currentId, price: this.currentPrice }).then((res) => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.ItemsList[index].price = this.currentPrice
        this.currentId = -1
        this.currentPrice = ''
      })
    },
    handleClick (tab, event) {
      this.params.page = 1
      if (this.activeName == 'second') {
        this.params.is_warning = true
      } else {
        this.params.is_warning = false
      }
      this.getGoodsList()
    },
    setWarningStore () {
      getItemWarningStore({ store: this.warning_store }).then((res) => {
        this.params.page = 1
        this.getGoodsList()
      })
    },
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getGoodsList()
    },
    handleSizeChange (pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getGoodsList()
    },
    handleChangeTemplates (val) {
      this.currentPage = 1
      this.params.templates_id = val
      this.getGoodsList()
    },
    handleSelectionChange (val) {
      let item_id = []
      for (let i in val) {
        item_id.push(val[i].itemId)
      }
      this.item_id = item_id
    },
    changeTemplates () {
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
    editItemsSort (index, row) {
      setItemsSort({ 'sort': row.sort, 'item_id': row.itemId }).then((response) => {
        this.getGoodsList()
      })
    },
    changeCategory () {
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
    addItems () {
      // 添加商品
      this.$router.push({
        path: this.matchInternalRoute('goodsphysical_editor'),
        query: { item_source: 'distributor' }
      })
    },
    addTemplates () {
      if (this.item_id.length) {
        this.addTemplatesdialogVisible = true
      } else {
        this.$message({
          type: 'error',
          message: '请选择至少一个商品'
        })
      }
    },
    addCategory () {
      if (this.item_id.length) {
        this.addCategorydialogVisible = true
      } else {
        this.$message({
          type: 'error',
          message: '请选择至少一个商品'
        })
      }
    },
    editItemsAction (index, row, isNew) {
      // 编辑商品弹框
      if (isNew) {
        var routeData = this.$router.push({
          path: this.matchInternalRoute('goodsphysical_editor') + '/' + row.itemId,
          query: { is_new: true, item_source: 'distributor' }
        })
      } else {
        var routeData = this.$router.push({
          path: this.matchInternalRoute('goodsphysical_editor') + '/' + row.itemId,
          query: { item_source: 'distributor' }
        })
      }
    },
    itemsDetail (index, row) {
      this.ItemsDetailVisible = true
      getItemsDetail(row.itemId).then((response) => {
        this.itemsDetailData = response.data.data
        this.start_date = this.getTimeStr(this.itemsDetailData.begin_date)
        this.end_date = this.getTimeStr(this.itemsDetailData.end_date)
      })
    },
    goodsSearch () {
      this.params.keywords = this.goodsName
      this.params.page = 1
      this.getGoodsList()
    },
    getGoodsList () {
      this.loading = true
      getItemsList(this.params).then((response) => {
        this.ItemsList = response.data.data.list
        this.ItemsList.forEach((item) => {
          item.price = item.price / 100
        })
        this.total_count = response.data.data.total_count
        this.warning_store = response.data.data.warning_store
        this.loading = false
      })
    },
    deleteItemsAction (index, row) {
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
              duration: 5 * 1000
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
    priceformatter (row, column) {
      return this.cursymbol + row.price / 100
    },
    rebateformatter (row, column) {
      return this.cursymbol + row.rebate / 100
    },
    getTaskTime (strDate) {
      let date = new Date(strDate)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let str = y + '-' + m + '-' + d
      return str
    },
    getTimeStr (date) {
      return this.getTaskTime(new Date(parseInt(date) * 1000))
    },
    getShippingTemplatesList () {
      this.loading = true
      getShippingTemplatesList(this.templatesParams).then((response) => {
        this.templatesList = response.data.data.list
      })
    },
    getCategory () {
      getCategory([]).then((response) => {
        this.categoryList = response.data.data
      })
    },
    getCurrencyInfo () {
      getDefaultCurrency().then((res) => {
        this.currency = res.data.data
        this.cursymbol = this.currency.symbol
      })
    },

    async getDefaultDistributor (id) {
      let params = { distributor_id: id ? id : 0 }
      let { data } = await getDistributorInfo(params)

      let distributor = data.data
      if (distributor) {
        return distributor
      } else {
        this.$router.go(-1)
      }
    },
    async getDistributorItemList () {
      let distributor = await this.getDefaultDistributor(this.params.distributor_id)
      if (!this.params.distributor_id && distributor) {
        this.params.distributor_id = distributor.distributor_id
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
