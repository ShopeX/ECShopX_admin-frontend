<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <div class="content-bottom-padded">
        <el-alert
          type="info"
          title="上架总部商品说明"
          show-icon
        >
          <div>通过选择店铺和选择商品，则会将选择的总部商品上架到店铺</div>
        </el-alert>
      </div>
      <el-card class="box-card">
        <div
          slot="header"
          class="clearfix"
        >
          <span>选择店铺</span>
        </div>
        <el-row
          class="content-bottom-padded"
          :gutter="20"
        >
          <el-col :span="6">
            <el-input
              v-model="distributors.params.name"
              placeholder="店铺姓名"
            />
          </el-col>
          <el-col :span="6">
            <el-input
              v-model="distributors.params.mobile"
              placeholder="店铺手机号"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="numberSearch"
              />
            </el-input>
          </el-col>
        </el-row>
        <el-table
          ref="multipleDistributorsTable"
          v-loading="distributors.loading"
          :data="distributors.list"
          border
          @selection-change="handleDistributorsSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column label="商品操作">
            <template slot-scope="scope">
              <router-link
                :to="{
                  path: matchHidePage('detail'),
                  query: {
                    distributor_id: scope.row.distributor_id,
                    distributor_name: scope.row.name,
                    parentPath: '/mall/marketing/distributor/rel_items'
                  }
                }"
              >
                商品管理
              </router-link>
              <el-button
                type="text"
                @click="handleRelItem('_all', scope.row.distributor_id)"
              >
                上架全部商品
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="店铺名称"
          />
          <el-table-column
            prop="contact"
            label="联系人"
          />
          <el-table-column
            prop="mobile"
            label="联系方式"
          />
        </el-table>
        <div
          v-if="distributors.total_count > distributors.params.pageSize"
          class="content-padded content-center"
        >
          <el-pagination
            background
            layout="prev, pager, next"
            :current-page.sync="distributors.params.page"
            :total="distributors.total_count"
            :page-size="distributors.params.pageSize"
            @current-change="handleDistributorsCurrentChange"
          />
        </div>
      </el-card>
      <el-card
        class="box-card"
        style="margin-top: 20px"
      >
        <div
          slot="header"
          class="clearfix"
        >
          <span>选择商品</span>
        </div>
        <el-row
          class="content-bottom-padded"
          :gutter="20"
        >
          <el-col :span="6">
            <el-input
              v-model="items.params.keywords"
              placeholder="商品名称"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="goodsNumberSearch"
              />
            </el-input>
          </el-col>
        </el-row>
        <el-table
          ref="multipleItemsTable"
          v-loading="items.loading"
          :data="items.list"
          height="400"
          style="width: 100%"
          border
          @selection-change="handleItemsSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="itemName"
            label="商品名称"
          />
          <el-table-column
            prop="price"
            label="价格"
            :formatter="priceformatter"
            width="120"
          />
          <el-table-column
            prop="store"
            label="库存"
            width="100"
          />
          <el-table-column
            prop="rebate"
            label="店铺佣金"
            :formatter="rebateformatter"
            width="100"
          />
          <el-table-column
            label="状态"
            width="120"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.approve_status == 'onsale'">前台可销售</span>
              <span v-else-if="scope.row.approve_status == 'offline_sale'">可线下销售</span>
              <span v-else>不可销售</span>
            </template>
          </el-table-column>
        </el-table>
        <div
          v-if="items.total_count > items.params.pageSize"
          class="content-center content-top-padded"
        >
          <el-pagination
            background
            layout="prev, pager, next"
            :current-page.sync="items.params.page"
            :total="items.total_count"
            :page-size="items.params.pageSize"
            @current-change="handleItemsCurrentChange"
          />
        </div>
      </el-card>
      <div
        class="content-bottom-padded"
        style="margin-top: 20px"
      >
        <el-button
          type="primary"
          @click="handleRelItem()"
        >
          上架总部商品
        </el-button>
      </div>
    </div>
    <router-view />
  </div>
</template>
<script>
import axios from 'axios'
import { Message } from 'element-ui'
import { getDefaultCurrency } from '../../../api/company'
import {
  getItemsList,
  getItemsDetail,
  deleteItems,
  getDistributionGoodsWxaCode
} from '../../../api/goods'
import {
  getDistributorList,
  getDistributorCount,
  saveDistributorItems
} from '../../../api/marketing'

export default {
  data () {
    return {
      distributor_ids: [],
      item_ids: [],
      items: {
        list: [],
        params: {
          page: 1,
          pageSize: 20,
          keywords: '',
          item_type: 'normal',
          is_distribution: true
        },
        total_count: 0,
        loading: false,
        itemsChecked: []
      },
      distributors: {
        list: [],
        params: {
          page: 1,
          pageSize: 5,
          name: '',
          mobile: '',
          is_valid: 'true'
        },
        total_count: 0,
        loading: false,
        distributorsChecked: []
      },
      currency: {},
      cursymbol: '￥'
    }
  },
  mounted () {
    this.getItemsList()
    this.getDistributorsList()
    this.getCurrencyInfo()
  },
  methods: {
    numberSearch () {
      if (1 == this.distributors.params.page) {
        this.getDistributorsList()
      } else {
        this.distributors.params.page = 1
      }
    },
    goodsNumberSearch () {
      if (1 == this.items.params.page) {
        this.getItemsList()
      } else {
        this.items.params.page = 1
      }
    },
    // 工具部分代码

    // 商品部分代码
    handleItemsSelectionChange: function (val) {
      // 商品选择
      this.items.itemsChecked = val
    },
    handleItemsCurrentChange: function (page_num) {
      // 商品分页
      this.items.params.page = page_num
      this.getItemsList()
    },
    getItemsList: function () {
      // 店铺列表
      this.items.loading = true
      getItemsList(this.items.params).then((response) => {
        this.items.list = response.data.data.list
        this.items.total_count = response.data.data.total_count
        this.items.loading = false
      })
    },
    priceformatter: function (row, column) {
      return this.cursymbol + row.price / 100
    },
    rebateformatter: function (row, column) {
      return this.cursymbol + row.rebate / 100
    },
    // 店铺部分代码
    handleDistributorsSelectionChange: function (val) {
      // 店铺选择
      this.distributors.distributorsChecked = val
    },
    handleDistributorsCurrentChange: function (page_num) {
      // 店铺分页
      this.distributors.params.page = page_num
      this.getDistributorsList()
    },
    getDistributorsList: function () {
      // 店铺列表
      this.distributors.loading = true
      getDistributorList(this.distributors.params).then((response) => {
        this.distributors.list = response.data.data.list
        this.distributors.total_count = response.data.data.total_count
        this.distributors.loading = false
      })
    },
    // 公共部分代码
    handleRelItem: function (isAll = false, distributor_ids) {
      if (isAll) {
        this.$confirm('当前店铺将上架所有总部商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            saveDistributorItems({ item_ids: isAll, distributor_ids: [distributor_ids] }).then(
              (response) => {
                this.distributor_ids = []
                this.item_ids = []
                this.$message({
                  type: 'success',
                  message: '已加入队列，请稍后查看'
                })
              }
            )
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        return
      }

      if (this.items.itemsChecked.length <= 0) {
        this.$message({
          type: 'error',
          message: '请至少选择一个商品!'
        })
        return
      }
      if (this.items.itemsChecked.length > 10) {
        this.$message({
          type: 'error',
          message: '每次最多可选择10个商品!'
        })
        return
      }
      if (this.distributors.distributorsChecked.length <= 0) {
        this.$message({
          type: 'error',
          message: '请至少选择一个店铺!'
        })
        return
      }
      if (this.distributors.distributorsChecked.length > 10) {
        this.$message({
          type: 'error',
          message: '每次最多可选择10个店铺!'
        })
        return
      }

      this.items.itemsChecked.forEach((item) => {
        this.item_ids.push(item.itemId)
      })
      this.distributors.distributorsChecked.forEach((item) => {
        this.distributor_ids.push(item.distributor_id)
      })

      saveDistributorItems({ item_ids: this.item_ids, distributor_ids: this.distributor_ids }).then(
        (response) => {
          this.distributor_ids = []
          this.item_ids = []
          this.$message({
            type: 'success',
            message: '保存成功'
          })
        }
      )
    },
    getCurrencyInfo () {
      getDefaultCurrency().then((res) => {
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
