<template>
  <div>
    <div>
      <el-row :gutter="20">
        <el-col>
          <shop-select
            distributors
            :shop-id-default="params.distributor_id"
            @update="storeSearch"
          />
          <!--distributors wxshops 需要哪个api传哪个-->
          <el-input
            v-model="params.keywords"
            class="input-m"
            placeholder="请输入商品名称"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="goodsNumberSearch"
            />
          </el-input>
          <el-input
            v-model="params.item_bn"
            class="input-m"
            placeholder="请输入商品货号"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="goodsNumberSearch"
            />
          </el-input>
          <el-input
            v-model="params.barcode"
            class="input-m"
            placeholder="请输入商品条码"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="goodsNumberSearch"
            />
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col>
          <el-button-group>
            <el-button
              type="primary"
              icon="el-icon-upload"
              @click="handleBatchOnline(true)"
            >
              批量上架
            </el-button>
            <el-button
              type="primary"
              icon="el-icon-download"
              @click="handleBatchOnline(false)"
            >
              批量下架
            </el-button>
            <el-button
              type="primary"
              @click="handleBatchIsTotalStore(true)"
            >
              开启总部发货
            </el-button>
            <el-button
              type="primary"
              @click="handleBatchIsTotalStore(false)"
            >
              关闭总部发货
            </el-button>
            <el-button
              type="primary"
              @click="handleBatchDownload"
            >
              商品码下载
            </el-button>
            <export-tip @exportHandle="exportList">
              <el-button type="primary">
                导出
              </el-button>
            </export-tip>
          </el-button-group>
        </el-col>
      </el-row>
    </div>
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="item.name"
        :name="item.activeName"
      >
        <el-table
          ref="multipleItemsTable"
          v-loading="loading"
          :data="list"
          style="width: 100%"
          :height="wheight - 240"
          @selection-change="handleItemsSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleSkuEdit(scope.row)"
              >
                设置SKU
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="上下架操作">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.goods_can_sale"
                @change="switchStatusChange(scope.$index, scope.row, true)"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="item_name"
            label="商品名称"
            min-width="300"
          />
          <el-table-column
            prop="store"
            label="商品库存"
            min-width="120"
          />
          <el-table-column
            prop="price"
            label="商品价格"
            min-width="120"
          >
            <template slot-scope="scope">
              {{ scope.row.price }}元
            </template>
          </el-table-column>
          <el-table-column
            prop="is_total_store"
            label="总部发货"
            width="80"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.is_total_store"
                :disabled="scope.row.distributor_id == 0"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="switchChange(scope.$index, scope.row, 'true')"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="approve_status"
            label="状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <div
                v-if="scope.row.approve_status === 'onsale'"
                class="grid-content"
              >
                前台可销售
              </div>
              <div
                v-else-if="scope.row.approve_status === 'offline_sale'"
                class="grid-content"
              >
                可线下销售
              </div>
              <div
                v-else
                class="grid-content"
              >
                不可销售
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="content-padded content-center">
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
    <sideBar
      :visible.sync="show_sideBar"
      title="编辑店铺sku配置"
      width="60"
    >
      <slot>
        <h3 class="content-padded">
          {{ itemSkuParam.name }}
        </h3>
        <el-table
          v-loading="loading"
          :data="itemSku.list"
          :height="wheight - 240"
        >
          <el-table-column
            prop="item_bn"
            label="SKU"
            width="140"
          />
          <el-table-column
            prop="item_spec_desc"
            label="规格"
          />
          <el-table-column
            prop="store"
            label="库存"
            width="120"
          >
            <template slot-scope="scope">
              <el-input
                v-if="editStore"
                v-model="scope.row.store"
                @change="editItemsStore(scope.$index, scope.row)"
              >
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-edit"
                />
              </el-input>
              <span v-else>{{ scope.row.store }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="price"
            label="商品价格"
            width="120"
          >
            <template slot-scope="scope">
              <el-input
                v-if="editStore"
                v-model="scope.row.price"
                @change="editItemsPrice(scope.$index, scope.row)"
              >
                <i
                  slot="prefix"
                  class="el-input__icon el-icon-edit"
                /><i
                  slot="suffix"
                  class="el-input__icon"
                >元</i>
              </el-input>
              <span v-else>{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="approve_status"
            label="状态"
            width="100"
          >
            <template slot-scope="scope">
              <div
                v-if="scope.row.approve_status === 'onsale'"
                class="grid-content"
              >
                前台可销售
              </div>
              <div
                v-else-if="scope.row.approve_status === 'offline_sale'"
                class="grid-content"
              >
                可线下销售
              </div>
              <div
                v-else
                class="grid-content"
              >
                不可销售
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="上下架操作"
            width="180"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.is_can_sale"
                active-text="已上架"
                inactive-text="已下架"
                @change="switchStatusChange(scope.$index, scope.row, false)"
              />
            </template>
          </el-table-column>
        </el-table>
        <div class="content-padded content-center">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next"
            :current-page.sync="itemSku.page"
            :page-sizes="[10, 20, 50]"
            :total="itemSku.total"
            :page-size="itemSku.pageSize"
            @current-change="handleSkuCurrentChange"
            @size-change="handleSkuSizeChange"
          />
        </div>
      </slot>
    </sideBar>
  </div>
</template>
<script>
import axios from 'axios'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import store from '../../../store'
import { mapGetters } from 'vuex'
import shopSelect from '@/components/shopSelect'
import {
  getDistributorItems,
  exportDistributorItems,
  delDistributorItems,
  updateDistributorItem,
  getDistributorInfo
} from '../../../api/marketing'
import sideBar from '@/components/element/sideBar'
const getWxaCodeImg = (url) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url,
      responseType: 'arraybuffer',
      headers: { 'Authorization': 'bearer ' + store.getters.token }
    })
      .then((data) => {
        resolve(data.data)
      })
      .catch((error) => {
        reject(error.toString())
      })
  })
}
export default {
  components: {
    shopSelect,
    sideBar
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
  data () {
    return {
      show_sideBar: false,
      activeName: 'first',
      total_count: 0,
      loading: false,
      params: {
        page: 1,
        pageSize: 10,
        distributor_id: '',
        keywords: '',
        is_can_sale: '_all',
        item_bn: '',
        barcode: ''
      },
      list: [],
      itemsChecked: [],
      tabList: [
        { name: '全部商品', value: null, activeName: 'first' },
        { name: '已上架', value: 'true', activeName: 'second' },
        { name: '未上架', value: 'true', activeName: 'third' }
      ],
      editStore: false,
      itemSkuList: [],
      itemSkuParam: {
        is_sku: 'true'
      },
      itemSku: {
        list: [],
        page: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted () {
    this.$nextTick(() => {
      if (this.isLoad) {
        if (!this.distributorId) {
          this.getDistributorItemList()
        } else {
          this.params.distributor_id = this.distributorId
          this.getDistributorItemList()
        }
      }
    })
  },
  methods: {
    //设置总部发货
    switchChange (index, row, isDefault) {
      if (row.is_total_store === true) {
        let form = {
          'distributor_id': row.distributor_id,
          'item_id': row.item_id,
          'is_total_store': row.is_total_store,
          'is_default': isDefault
        }
        this.updateDistributorItem(form)
      } else {
        // if (row.store=='' || row.store <= 0) {
        //   this.$message({
        //     type: 'error',
        //     message: '非总部发货时，库存不能小于等于0!'
        //   })
        //   return;
        // }
        let form = {
          'distributor_id': row.distributor_id,
          'item_id': row.item_id,
          'is_total_store': row.is_total_store,
          'store': row.distributor_store < 0 ? row.item_store : row.distributor_store,
          'is_default': isDefault
        }
        this.updateDistributorItem(form)
      }
    },
    //变更店铺商品库存
    editItemsStore (index, row) {
      // if (row.is_total_store === false && (row.store=='' || row.store <= 0) ) {
      //   this.$message({
      //     type: 'error',
      //     message: '非总部发货时，库存不能小于等于0!'
      //   })
      //   return;
      // }
      let form = {
        'distributor_id': row.distributor_id,
        'item_id': row.item_id,
        'is_total_store': row.is_total_store,
        'store': row.store
      }
      this.updateDistributorItem(form)
    },
    //变更店铺商品价格
    editItemsPrice (index, row) {
      let form = { 'distributor_id': row.distributor_id, 'item_id': row.itemId, 'price': row.price }
      this.updateDistributorItem(form)
    },
    storeSearch (val) {
      val && val.shop_id
      this.params.distributor_id = val.shop_id
      this.params.page = 1
      this.getList()
    },
    handleBatchOnline (goods_can_sale) {
      if (this.itemsChecked.length <= 0) {
        this.$message({ type: 'error', message: '请至少选择一个商品' })
        return
      }

      var goodsIds = []
      this.itemsChecked.forEach((item) => {
        goodsIds.push(item.goods_id)
      })

      var form = {
        'distributor_id': this.params.distributor_id,
        'goods_id': JSON.stringify(goodsIds),
        'is_can_sale': goods_can_sale
      }
      this.updateDistributorItem(form)
    },
    handleSkuEdit (row) {
      if (row.is_total_store === false) {
        this.editStore = true
      } else {
        this.editStore = false
      }
      this.show_sideBar = true
      this.itemSkuParam.item_id = row.item_id
      this.itemSkuParam.distributor_id = this.params.distributor_id
      this.itemSkuParam.name = row.item_name
      this.getSkuList()
    },
    getSkuList () {
      const { list, ...restParams } = this.itemSku
      getDistributorItems({ ...this.itemSkuParam, ...restParams }).then((res) => {
        this.itemSku.list = res.data.data.list
        this.itemSku.total = res.data.data.total_count
        for (var i = 0; i < this.itemSku.list.length; i++) {
          this.itemSku.list[i].price = this.itemSku.list[i].price / 100
          // this.itemSkuList[i].is_total_store = row.is_total_store
        }
      })
    },
    handleClick (tab, event) {
      if (tab.name == 'second') {
        this.params.is_can_sale = true
      } else if (tab.name == 'third') {
        this.params.is_can_sale = false
      } else {
        this.params.is_can_sale = '_all'
      }
      this.params.page = 1
      this.getList()
    },
    handleSizeChange (pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getList()
    },
    handleSkuSizeChange (pageSize) {
      this.itemSku.page = 1
      this.itemSku.pageSize = pageSize
      this.getSkuList()
    },
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getList()
    },
    handleSkuCurrentChange (page_num) {
      this.itemSku.page = page_num
      this.getSkuList()
    },
    // 导出数据
    exportList () {
      let post_date = this.params
      let goods_ids = []
      this.itemsChecked.forEach((item) => {
        goods_ids.push(item.goods_id)
      })
      post_date.goods_ids = goods_ids
      exportDistributorItems(post_date).then((response) => {
        console.log('导出', response)
        if (response.data.data.status) {
          this.$message({
            type: 'success',
            message: '已加入执行队列，请在设置-导出列表中下载'
          })
          return
        }
      })
    },
    getList () {
      getDistributorItems(this.params).then((response) => {
        if (response.data.data.list) {
          this.list = response.data.data.list
          for (var i = 0; i < this.list.length; i++) {
            this.list[i].price = this.list[i].price / 100
          }
          this.total_count = parseInt(response.data.data.total_count)
        }
        this.loading = false
      })
    },
    handleItemsSelectionChange (val) {
      // 商品选择
      this.itemsChecked = val
    },
    handleBatchDownload: function () {
      if (this.itemsChecked.length <= 0) {
        this.$message({
          type: 'error',
          message: '请至少选择一个商品!'
        })
        return
      }
      const zip = new JSZip()
      const cache = {}
      const promises = []
      var that = this
      that.itemsChecked.forEach((item) => {
        const url =
          this.BASE_API +
          '/goods/distributionGoodsWxaCodeStream?item_id=' +
          item.itemId +
          '&distributor_id=' +
          this.params.distributor_id
        const promise = getWxaCodeImg(url).then((result_file) => {
          // 下载文件, 并存成ArrayBuffer对象
          const file_name = item.itemName + '.png' // 获取文件名
          zip.file(file_name, result_file, { binary: true }) // 逐个添加文件
          cache[file_name] = result_file
        })
        promises.push(promise)
      })
      Promise.all(promises).then(() => {
        zip.generateAsync({ type: 'blob' }).then((content) => {
          // 生成二进制流
          FileSaver.saveAs(content, '店铺的商品小程序码(批量).zip') // 利用file-saver保存文件
        })
      })
    },
    updateDistributorItem (params) {
      console.log(params)
      updateDistributorItem(params).then((res) => {
        this.getList()
        this.$message({
          type: 'success',
          message: '修改成功',
          duration: 1000
        })
      })
    },
    switchStatusChange (index, row, isDefault) {
      let form = {}
      if (isDefault) {
        form = {
          'distributor_id': this.params.distributor_id,
          'goods_id': row.goods_id,
          'is_can_sale': row.goods_can_sale
        }
      } else {
        form = {
          'distributor_id': this.params.distributor_id,
          'item_id': row.item_id,
          'is_can_sale': row.is_can_sale
        }
      }
      this.updateDistributorItem(form)
    },
    goodsNumberSearch () {
      this.params.page = 1
      this.getList()
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
    },
    handleBatchIsTotalStore (is_total_store) {
      if (this.itemsChecked.length <= 0) {
        this.$message({ type: 'error', message: '请至少选择一个商品' })
        return
      }

      var goodsIds = []
      this.itemsChecked.forEach((item) => {
        goodsIds.push(item.goods_id)
      })

      var form = {
        'distributor_id': this.params.distributor_id,
        'goods_id': JSON.stringify(goodsIds),
        'is_total_store': is_total_store
      }
      this.updateDistributorItem(form)
    }
  }
}
</script>
