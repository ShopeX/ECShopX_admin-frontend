<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-button type="primary" icon="plus" size="mini" @click="addItems"> 添加商品 </el-button>
      </el-col>
      <el-col :span="12">
        <el-input v-model="goodsName" placeholder="商品名称" size="mini">
          <el-button slot="append" icon="el-icon-search" @click="goodsSearch" />
        </el-input>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="ItemsList" :height="wheight - 220">
      <el-table-column prop="itemId" label="商品ID" width="70" />
      <el-table-column label="排序编号" width="100">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.sort"
            placeholder=""
            @change="editItemsSort(scope.$index, scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="itemName" label="商品名称" />
      <el-table-column width="120" prop="price" label="价格" :formatter="priceformatter" />
      <el-table-column width="120" label="核销类型">
        <template slot-scope="scope">
          <span v-if="scope.row.consumeType == 'all'">团购券类型</span>
          <span v-else-if="scope.row.consumeType == 'every'">次卡类型</span>
          <span v-else>充值记录</span>
        </template>
      </el-table-column>
      <el-table-column width="120" label="操作">
        <template slot-scope="scope">
          <div class="operating-icons">
            <i class="iconfont icon-search-plus" @click="itemsDetail(scope.$index, scope.row)" />
            <i class="iconfont icon-edit1" @click="editItemsAction(scope.$index, scope.row)" />
            <i
              class="mark iconfont icon-trash-alt1"
              @click="deleteItemsAction(scope.$index, scope.row)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total_count > params.pageSize" class="content-center content-top-padded">
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
    <!-- 查看商品详情-开始 -->
    <el-dialog
      title="商品详情"
      :visible.sync="ItemsDetailVisible"
      :close-on-click-modal="false"
      class="good-detail-dialog"
    >
      <template>
        <el-row class="row-bg">
          <el-col :span="3">
            <div class="grid-content">核销类型</div>
          </el-col>
          <el-col :span="21">
            <div v-if="itemsDetailData.consume_type == 'every'" class="grid-content">次卡类型</div>
            <div v-if="itemsDetailData.consume_type == 'all'" class="grid-content">团购券类型</div>
          </el-col>
        </el-row>

        <el-row class="row-bg">
          <el-col :span="3">
            <div class="grid-content">商品名称</div>
          </el-col>
          <el-col :span="21">
            <div class="grid-content">
              {{ itemsDetailData.item_name }}
            </div>
          </el-col>
        </el-row>
        <el-row class="row-bg">
          <el-col :span="3">
            <div class="grid-content">简述</div>
          </el-col>
          <el-col :span="21">
            <div class="grid-content">
              {{ itemsDetailData.brief }}
            </div>
          </el-col>
        </el-row>
        <el-row class="row-bg">
          <el-col :span="3">
            <div class="grid-content">价格</div>
          </el-col>
          <el-col :span="21">
            <div class="grid-content">￥{{ itemsDetailData.price / 100 }}&nbsp;</div>
          </el-col>
        </el-row>
        <el-row class="row-bg">
          <el-col :span="3">
            <div class="grid-content">原价</div>
          </el-col>
          <el-col :span="21">
            <div class="grid-content">￥{{ itemsDetailData.market_price / 100 }}&nbsp;</div>
          </el-col>
        </el-row>
        <el-row class="row-bg">
          <el-col :span="3">
            <div class="grid-content">图片</div>
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
        </el-row>
        <el-row class="row-bg">
          <el-col :span="3">
            <div class="grid-content">基础物料</div>
          </el-col>
          <el-col :span="21">
            <div v-show="itemsDetailData.consume_type == 'all'" class="grid-content grid-attribute">
              <el-table :data="itemsDetailData.type_labels" style="width: 100%">
                <el-table-column prop="labelName" label="物料名称" />
                <el-table-column label="单价(元)">
                  <template slot-scope="scope">
                    <span>￥{{ scope.row.labelPrice / 100 }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="num" label="数量" />
              </el-table>
            </div>
            <div
              v-show="itemsDetailData.consume_type == 'every'"
              class="grid-content grid-attribute"
            >
              <el-table :data="itemsDetailData.type_labels" style="width: 100%">
                <el-table-column prop="labelName" label="物料名称" />
                <el-table-column label="单价(元)">
                  <template slot-scope="scope">
                    <span>￥{{ scope.row.labelPrice / 100 }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="limitTime" label="有效期" />
                <el-table-column prop="num" label="数量" />
              </el-table>
            </div>
          </el-col>
        </el-row>
        <el-row class="row-bg">
          <el-col :span="3">
            <div class="grid-content">有效期</div>
          </el-col>
          <el-col :span="21">
            <div
              v-show="itemsDetailData.date_type == 'DATE_TYPE_FIX_TIME_RANGE'"
              class="grid-content grid-detail"
            >
              固定日期范围 {{ start_date }}&nbsp;~&nbsp;{{ end_date }}
            </div>
            <div
              v-show="itemsDetailData.date_type == 'DATE_TYPE_FIX_TERM'"
              class="grid-content grid-detail"
            >
              领取后&nbsp;{{ itemsDetailData.fixed_term }}&nbsp;天内有效
            </div>
          </el-col>
        </el-row>
        <el-row class="row-bg">
          <el-col :span="3">
            <div class="grid-content">详情</div>
          </el-col>
          <el-col :span="21">
            <div class="grid-content grid-detail" v-html="itemsDetailData.intro" />
          </el-col>
        </el-row>
        <el-row v-if="itemsDetailData.enable_agreement" class="row-bg">
          <el-col :span="3">
            <div class="grid-content">购买协议</div>
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
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { getDefaultCurrency } from '../../../../../api/company'
import { getItemsList, getItemsDetail, deleteItems, setItemsSort } from '../../../../../api/goods'
export default {
  props: ['getStatus'],
  data() {
    return {
      goodsName: '',
      isEdit: false,
      activeName: 'first',
      ItemsList: [],
      ItemsDetailVisible: false,
      itemsDetailData: {},
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20
      },
      start_date: '',
      end_date: '',
      currency: {},
      cursymbol: '￥'
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    getStatus(val) {
      if (val) {
        this.getGoodsList()
      }
    }
  },
  mounted() {
    this.getGoodsList()
    //this.getCurrencyInfo()
  },
  methods: {
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getGoodsList()
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getGoodsList()
    },
    addItems() {
      // 添加商品
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    editItemsSort(index, row) {
      setItemsSort({ sort: row.sort, item_id: row.itemId }).then(response => {
        this.getGoodsList()
      })
    },
    editItemsAction(index, row) {
      // 编辑商品弹框
      this.$router.push({ path: this.matchRoutePath('editor/') + row.itemId })
    },
    itemsDetail(index, row) {
      this.ItemsDetailVisible = true
      getItemsDetail(row.itemId).then(response => {
        this.itemsDetailData = response.data.data
        this.start_date = this.getTimeStr(this.itemsDetailData.begin_date)
        this.end_date = this.getTimeStr(this.itemsDetailData.end_date)
      })
    },
    goodsSearch() {
      this.params.keywords = this.goodsName
      this.params.page = 1
      this.getGoodsList()
    },
    getGoodsList() {
      this.loading = true
      getItemsList(this.params).then(response => {
        this.ItemsList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    deleteItemsAction(index, row) {
      this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteItems(row.itemId).then(response => {
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
    priceformatter(row, column) {
      return this.cursymbol + row.price / 100
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
    getCurrencyInfo() {
      getDefaultCurrency().then(res => {
        this.currency = res.data.data
        this.cursymbol = this.currency.symbol
      })
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
