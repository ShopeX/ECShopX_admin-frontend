<template>
  <div>
    <div class="content-bottom-padded">
      <el-button
        type="primary"
        @click="handleBatchDownload"
      >
        二维码打包
      </el-button>
    </div>

    <el-tag
      style="width: 100%"
      type="warning"
    >
      选择商品
    </el-tag>
    <el-table
      ref="multipleItemsTable"
      v-loading="items.loading"
      :data="items.list"
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
          <span v-else-if="scope.row.approve_status == 'offline_sale'">前端不展示
</span>
          <span v-else>不可销售</span>
        </template>
      </el-table-column>
    </el-table>
    <div
      v-if="items.total_count > items.params.pageSize"
      class="content-center content-top-padded"
    >
      <el-pagination
        layout="prev, pager, next"
        :total="items.total_count"
        :page-size="items.params.pageSize"
        @current-change="handleItemsCurrentChange"
      />
    </div>

    <el-tag
      style="width: 100%; margin-top: 20px"
      type="warning"
    >
      选择分销商
    </el-tag>
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
      <el-table-column
        prop="name"
        label="姓名"
      />
      <el-table-column
        prop="mobile"
        label="手机号"
      />
      <el-table-column
        prop="address"
        label="地址"
      />
    </el-table>
    <div
      v-if="distributors.total_count > distributors.params.pageSize"
      class="content-padded content-center"
    >
      <el-pagination
        layout="prev, pager, next"
        :total="distributors.total_count"
        :page-size="distributors.params.pageSize"
        @current-change="handleDistributorsCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import store from '../../../store'
import { Message } from 'element-ui'
import {
  getItemsList,
  getItemsDetail,
  deleteItems,
  getDistributionGoodsWxaCode
} from '../../../api/goods'
import { getDistributorList, getDistributorCount } from '../../../api/marketing'
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
  props: ['getStatus'],
  data () {
    return {
      items: {
        list: [],
        params: {
          page: 1,
          pageSize: 20,
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
          pageSize: 20
        },
        total_count: 0,
        loading: false,
        distributorsChecked: []
      }
    }
  },
  watch: {
    getStatus (val) {
      if (val) {
        this.getItemsList()
      }
    }
  },
  mounted () {
    this.getItemsList()
    this.getDistributorsList()
  },
  methods: {
    // 工具部分代码

    // 商品部分代码
    handleItemsSelectionChange: function (val) {
      // 商品选择
      this.items.itemsChecked = val
      console.log(val)
    },
    handleItemsCurrentChange: function (page_num) {
      // 商品分页
      this.items.params.page = page_num
      this.getItemsList()
    },
    getItemsList: function () {
      // 分销商列表
      this.items.loading = true
      getItemsList(this.items.params).then((response) => {
        this.items.list = response.data.data.list
        this.items.total_count = response.data.data.total_count
        this.items.loading = false
      })
    },
    priceformatter: function (row, column) {
      return '￥' + row.price / 100
    },
    rebateformatter: function (row, column) {
      return '￥' + row.rebate / 100
    },
    // 分销商部分代码
    handleDistributorsSelectionChange: function (val) {
      // 分销商选择
      this.distributors.distributorsChecked = val
      console.log(val)
    },
    handleDistributorsCurrentChange: function (page_num) {
      // 分销商分页
      this.distributors.params.page = page_num
      this.getDistributorsList()
    },
    getDistributorsList: function () {
      // 分销商列表
      this.distributors.loading = true
      getDistributorList(this.distributors.params).then((response) => {
        this.distributors.list = response.data.data.list
        this.distributors.total_count = response.data.data.total_count
        this.distributors.loading = false
      })
    },
    // 公共部分代码
    handleBatchDownload: function () {
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
          message: '请至少选择一个分销商!'
        })
        return
      }
      if (this.distributors.distributorsChecked.length > 10) {
        this.$message({
          type: 'error',
          message: '每次最多可选择10个分销商!'
        })
        return
      }
      const zip = new JSZip()
      const cache = {}
      const promises = []
      var that = this
      that.items.itemsChecked.forEach((item1) => {
        that.distributors.distributorsChecked.forEach((item2) => {
          var url =
            this.BASE_API +
            '/goods/distributionGoodsWxaCodeStream?item_id=' +
            item1.itemId +
            '&distributor_id=' +
            item2.distributor_id
          const promise = getWxaCodeImg(url).then((result_file) => {
            // 下载文件, 并存成ArrayBuffer对象
            const file_name =
              item1.itemName +
              '(' +
              item1.itemId +
              ')-' +
              item2.name +
              '(' +
              item2.distributor_id +
              ')' +
              '.png' // 获取文件名
            zip.file(file_name, result_file, { binary: true }) // 逐个添加文件
            cache[file_name] = result_file
          })
          promises.push(promise)
        })
      })
      // 清空存储
      this.items.itemsChecked = []
      this.$refs.multipleItemsTable.clearSelection()
      this.distributors.distributorsChecked = []
      this.$refs.multipleDistributorsTable.clearSelection()
      Promise.all(promises).then(() => {
        zip.generateAsync({ type: 'blob' }).then((content) => {
          // 生成二进制流
          FileSaver.saveAs(content, '分销商品小程序码(批量).zip') // 利用file-saver保存文件
        })
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
