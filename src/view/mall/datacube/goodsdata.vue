<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="选择日期范围">
        <el-col :span="12">
          <el-date-picker
            v-model="vdate"
            type="daterange"
            alue-format="yyyy-MM-dd"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%;"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            @change="dateChange"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="12">
          <export-tip @exportHandle='exportData' >
            <el-button type="primary" v-loading="exportloading">导出</el-button>
          </export-tip>
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            content="导出任务会以队列执行，点击导出后，请至‘设置-导出列表’页面中查看及下载数据"
          >
            <i class="el-icon-question" slot="reference"></i>
          </el-popover>
        </el-col>
      </el-form-item>
    </el-form>
    <el-tabs
      v-if="$route.path.indexOf('editor') === -1"
      v-model="activeName"
      type="border-card"
      @tab-click="handleClick"
    >
      <el-tab-pane label="商品统计" name="goods_count" v-loading="loading">
        <template>
          <el-table :data="allListData" stripe border style="width: 100%" :height="wheight - 230">
            <el-table-column prop="no" label="No"></el-table-column>
            <el-table-column prop="sap_code" label="商品编号"></el-table-column>
            <el-table-column prop="top_level" label="分类"></el-table-column>
            <el-table-column prop="product" label="商品名称"></el-table-column>
            <el-table-column prop="quantity" label="销量"></el-table-column>
            <el-table-column prop="fix_price" label="销售额"></el-table-column>
            <el-table-column prop="settle_price" label="实付额"></el-table-column>
          </el-table>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import json2csv from 'json2csv'
import { getGoodsData } from '../../../api/datacube'
export default {
  data() {
    return {
      vdate: '',
      loading: true,
      exportloading: false,
      activeName: 'goods_count',
      params: {
        start: '',
        end: ''
      },
      allListData: [],
      // fields: ['item_bn', 'category_name', 'item_name', 'sales_count', 'fixed_amount_count', 'settle_amount_count'],
      fields: ['no', 'sap_code', 'top_level', 'product', 'quantity', 'fix_price', 'settle_price'],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一天',
            onClick(picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  methods: {
    exportData() {
      this.exportloading = true
      this.params.export = 1
      getGoodsData(this.params)
        .then((res) => {
          this.exportloading = false
          if (res.data.data.status) {
            this.$message({
              type: 'success',
              message: '已加入执行队列，请在设置-导出列表中下载'
            })
            this.$export_open('goods_data');
            return
          } else if (res.data.data.url) {
            this.downloadUrl = res.data.data.url
            this.downloadName = res.data.data.filename
            this.downloadView = true
          } else {
            this.$message({
              type: 'error',
              message: '无内容可导出 或 执行失败，请检查重试'
            })
            return
          }

          // var exportdata = res.data.data.list
          // exportdata.unshift()
          // this.exportloading = false
          // var fileName = '商品数据'
          // try {
          //   const result = json2csv.parse(exportdata, {
          //     fields: this.fields
          //     // excelStrings: true,
          //   });
          //   if (this.MyBrowserIsIE()) {
          //     // IE10以及Edge浏览器
          //     var BOM = "\uFEFF";
          //     // 文件转Blob格式
          //     var csvData = new Blob([BOM + result], { type: "text/csv" });
          //     navigator.msSaveBlob(csvData, `${fileName}.csv`);
          //   } else {
          //     let csvContent = "data:text/csv;charset=utf-8,\uFEFF" + result;
          //     // 非ie 浏览器
          //     this.createDownLoadClick(csvContent, `${fileName}.csv`);
          //   }
          // } catch (err) {
          //   this.exportloading = false
          //   alert(err);
          // }
        })
        .catch((error) => {
          this.exportloading = false
        })
    },
    createDownLoadClick(content, fileName) {
      const link = document.createElement('a')
      link.href = encodeURI(content)
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    MyBrowserIsIE() {
      let isIE = false
      if (
        navigator.userAgent.indexOf('compatible') > -1 &&
        navigator.userAgent.indexOf('MSIE') > -1
      ) {
        // ie浏览器
        isIE = true
      }
      if (navigator.userAgent.indexOf('Trident') > -1) {
        // edge 浏览器
        isIE = true
      }
      return isIE
    },
    handleClick(tab, event) {},
    dateChange(val) {
      if (!val) {
        return false
      }
      this.params.start = val[0]
      this.params.end = val[1]
      this.getGoodsDataList()
    },
    getGoodsDataList() {
      this.loading = true
      getGoodsData(this.params)
        .then((res) => {
          this.allListData = res.data.data.list
          this.loading = false
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: '获取统计信息出错'
          })
        })
    }
  },
  mounted() {
    var start = new Date()
    var end = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
    end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
    this.vdate = [start, end]
    this.getGoodsDataList()
  }
}
</script>
