<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <section class="section section-white">
    <el-form ref="form" :model="form" label-width="100px" label-position="left" size="mini">
      <div class="section-header with-border">批次管理</div>
      <div class="section-body">
        <el-form-item label="物品名称">
          <el-row :gutter="20">
            <el-col :span="6">
              {{ things.thing_name }}
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="批次编号">
          <el-row :gutter="20">
            <el-col v-if="form.batch_id" :span="6">
              {{ form.batch_number }}
            </el-col>
            <el-col v-else :span="6">
              <el-input
                v-model="form.batch_number"
                type="text"
                placeholder="请输入批次编号，限20位"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="批次名称">
          <el-row :gutter="20">
            <el-col v-if="form.batch_id" :span="6">
              {{ form.batch_name }}
            </el-col>
            <el-col v-else :span="6">
              <el-input
                v-model="form.batch_name"
                type="text"
                placeholder="仅用于后台展示，便于维护"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="批次件数">
          <el-row :gutter="20">
            <el-col v-if="form.batch_id" :span="6">
              {{ form.batch_quantity }}
            </el-col>
            <el-col v-else :span="6">
              <el-input
                v-model="form.batch_quantity"
                type="number"
                placeholder="请输入该批次件数"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="流通信息">
          <el-row :gutter="20">
            <el-switch v-model="form.show_trace" />
          </el-row>
          <el-row :gutter="20">
            <template>
              <el-table :data="traceData" border style="width: 100%">
                <el-table-column prop="date" label="日期" width="250">
                  <template slot-scope="scope">
                    <span>
                      <el-date-picker
                        v-model="scope.row.date"
                        value-format="timestamp"
                        format="yyyy-MM-dd"
                        type="date"
                        placeholder="选择日期"
                      />
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="info" label="信息" width="300">
                  <template slot-scope="scope">
                    <span>
                      <el-input v-model="scope.row.info" placeholder="请输入信息" />
                    </span>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="300">
                  <template slot-scope="scope">
                    <el-button
                      type="danger"
                      size="mini"
                      @click.native.prevent="deleteRow(scope.$index, traceData)"
                    >
                      移除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button size="mini" type="success" circle @click="addTraceInfo"> 添加 </el-button>
            </template>
          </el-row>
        </el-form-item>
      </div>
      <div class="section-footer with-border content-center">
        <el-button type="default" @click.native="handleCancel"> 返回 </el-button>
        <el-button type="primary" @click="submitThingsAction"> 生成并下载二维码 </el-button>
      </div>
    </el-form>
    <el-dialog
      title="二维码打包下载"
      :visible.sync="codeDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleCancelDownloadDialog"
    >
      <template>
        <div
          v-for="(item, index) in dataSpan"
          class="code-span"
          :class="{ cur: index === codespanIndex }"
          @click="codeSpanChoose(index)"
        >
          <span>{{ item.start }} ~ {{ item.end }}</span>
          <span v-if="index === codespanIndex && !isdownloadOk" class="bg-waiting"
            ><i class="el-icon-loading"
          /></span>
          <span v-if="index === codespanIndex && isdownloadOk" class="download-ok"
            ><i class="el-icon-circle-check"
          /></span>
        </div>
      </template>
    </el-dialog>
  </section>
</template>

<script>
import axios from 'axios'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import store from '../../../store'
import { Message } from 'element-ui'
import { getThingsDetail, getBatchsDetail, createBatchs, updateBatchs } from '../../../api/onecode'
import { uploadMaterial } from '../../../api/wechat'
const getWxaCodeImg = url => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url,
      responseType: 'arraybuffer',
      headers: { Authorization: 'bearer ' + store.getters.token }
    })
      .then(data => {
        resolve(data.data)
      })
      .catch(error => {
        reject(error.toString())
      })
  })
}
export default {
  data() {
    return {
      things: {},
      form: {
        batch_id: '',
        thing_id: '',
        batch_name: '',
        batch_number: '',
        batch_quantity: '',
        show_trace: true,
        trace_info: ''
      },
      traceData: [
        {
          date: Date.now(),
          info: ''
        }
      ],

      downloadnumber: 10,
      codeDialogVisible: false,
      dataSpan: [],
      codeInterval: 10,
      codeLeft: false,
      codespanIndex: -1,
      isdownloadOk: false,
      downParams: {
        batch_number: '',
        thing_id: '',
        batch_id: '',
        start: '',
        end: ''
      }
    }
  },
  mounted() {
    if (this.$route.query.thing_id) {
      this.form.thing_id = this.$route.query.thing_id
      // 获取物品信息
      getThingsDetail(this.$route.query.thing_id)
        .then(response => {
          this.things = response.data.data
        })
        .catch(error => {
          this.$router.push({ path: '/brand/onecode' })
        })
    }
    if (this.$route.query.batch_id) {
      this.form.batch_id = this.$route.query.batch_id
      // 获取物品信息
      getBatchsDetail(this.$route.query.batch_id)
        .then(response => {
          this.form = response.data.data
          this.traceData = response.data.data.trace_info
        })
        .catch(error => {
          this.$router.push({ path: '/brand/onecode' })
        })
    }
  },
  methods: {
    submitThingsAction: function () {
      // 提交商品
      // return
      this.form.trace_info = []
      if (this.traceData) {
        this.form.trace_info = this.traceData
      }
      if (this.form.batch_id) {
        updateBatchs(this.form.batch_id, this.form)
          .then(response => {
            this.$message({
              type: 'success',
              message: '更新批次信息成功'
            })
            this.handleCodeDownload(response.data.data)
            // this.$router.push({path: '/brand/onecode'})
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '更新批次信息出错'
            })
          })
      } else {
        createBatchs(this.form)
          .then(response => {
            this.$message({
              type: 'success',
              message: '添加批次信息成功'
            })
            this.handleCodeDownload(response.data.data)
            // this.$router.push({path: '/brand/onecode'})
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '添加批次信息出错'
            })
          })
      }
    },
    handleCancel: function () {
      this.$router.push({ path: '/brand/onecode' })
    },
    addTraceInfo: function () {
      this.traceData.push({
        date: Date.now(),
        info: ''
      })
    },
    deleteRow: function (index, rows) {
      rows.splice(index, 1)
    },
    handleCancelDownloadDialog: function () {
      this.codeDialogVisible = false
      this.downParams = {}
    },
    handleCodeDownload: function (row) {
      this.codeDialogVisible = true
      this.codespanIndex = -1
      this.isdownloadOk = false
      this.downParams.thing_id = row.thing_id
      this.downParams.batch_id = row.batch_id
      this.downParams.batch_number = row.batch_number

      // 生成分批下载按钮的数据
      let batch_number = row.batch_quantity
      var codeSpan = (batch_number / this.codeInterval + '').indexOf('.')
      var totalSpan = 0
      if (codeSpan >= 0) {
        totalSpan = parseInt(batch_number / this.codeInterval)
        this.codeLeft = true
      } else {
        totalSpan = batch_number / this.codeInterval
      }
      var preNumber = 0
      if (totalSpan == 0) {
        this.dataSpan.push({ start: 0, end: batch_number })
      }
      for (var i = 0; i < totalSpan; i++) {
        if (i === 0) {
          this.dataSpan.push({ start: i + 1, end: (i + 1) * this.codeInterval })
        } else {
          this.dataSpan.push({ start: preNumber + 1, end: (i + 1) * this.codeInterval })
        }
        preNumber = (i + 1) * this.codeInterval
      }
      if (totalSpan > 0 && this.codeLeft) {
        this.dataSpan.push({ start: totalSpan * this.codeInterval + 1, end: batch_number })
      }
    },
    codeSpanChoose: function (index) {
      this.isdownloadOk = false
      this.codespanIndex = index
      var arry = this.dataSpan[index]
      this.downParams.start = Number(arry['start'])
      this.downParams.end = Number(arry['end'])

      this.handleBatchDownload()
    },
    handleBatchDownload: function () {
      const zip = new JSZip()
      const cache = {}
      const promises = []
      var that = this
      for (var i = that.downParams.start; i <= that.downParams.end; i++) {
        var url =
          this.BASE_API +
          '/onecode/wxaOneCodeStream?batch_id=' +
          that.downParams.batch_id +
          '&num=' +
          i
        const num = i
        const promise = getWxaCodeImg(url).then(result_file => {
          // 下载文件, 并存成ArrayBuffer对象
          const file_name = that.downParams.batch_number + '(' + num + ')' + '.png' // 获取文件名
          zip.file(file_name, result_file, { binary: true }) // 逐个添加文件
          cache[file_name] = result_file
        })
        promises.push(promise)
      }
      Promise.all(promises).then(() => {
        zip.generateAsync({ type: 'blob' }).then(content => {
          // 生成二进制流
          FileSaver.saveAs(content, '一物一码小程序码(批量).zip') // 利用file-saver保存文件
          that.isdownloadOk = true
          that.downParams.start = ''
          that.downParams.end = ''
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.code-span {
  position: relative;
  display: inline-block;
  margin: 0 5px 10px;
  padding: 5px 20px;
  border: 1px solid #ddd;
  color: #666;
  border-radius: 5px;
  cursor: pointer;
  &:hover,
  &.cur {
    background: #ff5000;
    color: #fff;
  }
}
.bg-waiting {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  text-align: center;
  color: #fff;
  i {
    font-size: 18px;
    line-height: 34px;
  }
}
.download-ok {
  position: absolute;
  top: -4px;
  right: 2px;
  color: #fff;
  i {
    font-size: 12px;
  }
}
</style>
