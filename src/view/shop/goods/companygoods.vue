<template>
  <div>
    <div class="content-bottom-padded">
      <el-row class="content-bottom-padded" :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="params.keywords"
            style="width: 100%"
            size="mini"
            placeholder="请输入商品名称"
          >
            <el-button slot="append" icon="el-icon-search" @click="goodsNumberSearch" />
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-button-group>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-upload"
              @click="handleBatchOnline(true)"
            >
              批量上架
            </el-button>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-download"
              @click="handleBatchOnline(false)"
            >
              批量下架
            </el-button>
            <el-button type="primary" size="mini" @click="handleBatchDownload">
              商品码下载
            </el-button>
          </el-button-group>
        </el-col>
      </el-row>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
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
          <el-table-column type="selection" width="55" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handleSkuEdit(scope.row)"> 设置SKU </el-button>
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
          <el-table-column prop="item_name" label="商品名称" min-width="300" />
          <el-table-column prop="price" label="商品价格" min-width="120">
            <template slot-scope="scope"> {{ scope.row.price }}元 </template>
          </el-table-column>
          <el-table-column prop="approve_status" label="状态" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.approve_status === 'onsale'" class="grid-content">
                前台可销售
              </div>
              <div v-else-if="scope.row.approve_status === 'offline_sale'" class="grid-content">
                前台不展示
              </div>
              <div v-else class="grid-content">不可销售</div>
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
    <sideBar :visible.sync="show_sideBar" title="编辑店铺sku配置" width="60">
      <slot>
        <el-table v-loading="loading" :data="itemSkuList" style="width: 100%">
          <el-table-column prop="item_id" width="55" />
          <el-table-column prop="item_name" label="商品名称" width="200" />
          <el-table-column prop="item_spec_desc" label="规格" width="200" />
          <el-table-column prop="store" label="库存" width="120">
            <template slot-scope="scope">
              <el-input v-if="editStore" v-model="scope.row.store">
                <i slot="suffix" class="el-input__icon el-icon-edit" />
              </el-input>
              <el-input v-else v-model="scope.row.store" disabled />
            </template>
          </el-table-column>
          <el-table-column prop="approve_status" label="状态" width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.approve_status === 'onsale'" class="grid-content">
                前台可销售
              </div>
              <div v-else-if="scope.row.approve_status === 'offline_sale'" class="grid-content">
                前台不展示
              </div>
              <div v-else class="grid-content">不可销售</div>
            </template>
          </el-table-column>
          <el-table-column label="上下架操作" width="180">
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
  data() {
    return {
      show_sideBar: false,
      activeName: 'first',
      total_count: 0,
      loading: false,
      params: {
        page: 1,
        pageSize: 10,
        keywords: '',
        is_can_sale: '_all'
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
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleBatchOnline(goods_can_sale) {
      if (this.itemsChecked.length <= 0) {
        this.$message({ type: 'error', message: '请至少选择一个商品' })
        return
      }

      var goodsIds = []
      this.itemsChecked.forEach((item) => {
        goodsIds.push(item.goods_id)
      })

      var form = {
        'distributor_id': this.itemsChecked[0].distributor_id,
        'goods_id': JSON.stringify(goodsIds),
        'is_can_sale': goods_can_sale
      }
      this.updateDistributorItem(form)
    },
    handleSkuEdit(row) {
      if (row.is_total_store === false) {
        this.editStore = true
      } else {
        this.editStore = false
      }
      this.show_sideBar = true
      this.itemSkuParam.item_id = row.item_id
      this.itemSkuParam.distributor_id = row.distributor_id
      getDistributorItems(this.itemSkuParam).then((res) => {
        this.itemSkuList = res.data.data.list
      })
    },
    handleClick(tab, event) {
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
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getList()
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getList()
    },
    getList() {
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
    handleItemsSelectionChange(val) {
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
        var url =
          process.env.VUE_APP_BASE_API +
          '/goods/distributionGoodsWxaCodeStream?item_id=' +
          item.itemId +
          '&distributor_id=' +
          item.distributor_id
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
    updateDistributorItem(params) {
      updateDistributorItem(params).then((res) => {
        this.getList()
        this.$message({
          type: 'success',
          message: '修改成功',
          duration: 1000
        })
      })
    },
    switchStatusChange(index, row, isDefault) {
      let form = {}
      if (isDefault) {
        form = {
          'distributor_id': row.distributor_id,
          'goods_id': row.goods_id,
          'is_can_sale': row.goods_can_sale
        }
      } else {
        form = {
          'distributor_id': row.distributor_id,
          'item_id': row.item_id,
          'is_can_sale': row.is_can_sale
        }
      }
      this.updateDistributorItem(form)
    },
    goodsNumberSearch() {
      this.params.page = 1
      this.getList()
    }
  }
}
</script>
