<template>
  <section class="section section-white">
    <h3 class="title">物品及批次详情</h3>
    <div class="section-header with-border">
      <h4>物品信息</h4>
    </div>
    <div class="section-body">
      <div class="list-item view-flex">
        <div class="view-flex view-flex-item">
          <div class="thumbnail">
            <img :src="wximageurl + thingInfo.pic">
          </div>
          <div>
            <div class="item-title">
              {{ thingInfo.thing_name }}
            </div>
            <div class="item-date">
              {{ thingInfo.created | datetime('YYYY-MM-DD HH:mm:ss') }}
            </div>
            <div class="item-batch">
              共 {{ thingInfo.batch_total_count }} 个批次 合计
              {{ thingInfo.batch_total_quantity }} 件
            </div>
          </div>
        </div>
        <div class="">
          <router-link
            :to="{ path: '/brand/onecode/things', query: { thing_id: thingInfo.thing_id } }"
          >
            <el-button class="iconfont icon-edit1" type="text"> 编辑 </el-button>
          </router-link>
        </div>
      </div>
    </div>
    <div class="section-header with-border">
      <h4>批次信息</h4>
    </div>
    <div class="section-body">
      <el-table
        v-loading="loading"
        :data="batchsList"
        style="width: 100%"
        border
        element-loading-text="数据加载中"
      >
        <el-table-column prop="batch_number" width="150" label="批次编号" />
        <el-table-column prop="batch_name" width="150" label="批次名称" />
        <el-table-column prop="batch_quantity" width="150" label="批次数量" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleCodeDownload(scope.row)"> 下载 </el-button>
            <router-link
              :to="{
                path: '/brand/onecode/batchs',
                query: { batch_id: scope.row.batch_id, thing_id: scope.row.thing_id }
              }"
            >
              编辑
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
import imgPicker from '../../../components/imageselect'
import { getThingsDetail, createThings, updateThings, getBatchsList } from '../../../api/onecode'
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
  components: {
    imgPicker
  },
  data() {
    return {
      loading: false,

      imgDialog: false,
      isGetImage: false,

      thumbDialog: false,
      isGetThumb: false,

      thingInfo: {
        batch_total_count: 0,
        batch_total_quantity: 0,
        intro: '',
        pic: '',
        thing_name: '',
        created: ''
      },
      batchsList: [],

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
      // 初始化物品数据
      getThingsDetail(this.$route.query.thing_id)
        .then(response => {
          this.thingInfo = response.data.data
        })
        .catch(error => {
          this.$router.push({ path: '/brand/onecode' })
        })

      // 初始化批次列表信息
      let params = {
        thing_id: this.$route.query.thing_id,
        page: 1,
        pageSize: 100
      }
      getBatchsList(params)
        .then(response => {
          this.batchsList = response.data.data.list
        })
        .catch(error => {
          this.$router.push({ path: '/brand/onecode' })
        })
    }
  },
  methods: {
    // 物品图片
    handleImgChange: function () {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg: function (data) {
      this.form.pic = data.url
      this.imgDialog = false
    },
    closeImgDialog: function () {
      this.imgDialog = false
    },
    // 图文详情中的图片
    addImgPreview: function () {
      this.thumbDialog = true
      this.isGetThumb = true
    },
    addImgPreview: function () {
      this.thumbDialog = true
      this.isGetThumb = true
    },
    pickThumb: function (data) {
      if (data && data.url !== '') {
        this.thumbDialog = false
        var index = this.$refs.editor.$el.id
        var loc = this.$refs.editor
        var img = new Image()
        img.src = this.wximageurl + data.url
        if (loc.range) {
          loc.range.insertNode(img)
        } else {
          loc.$refs.content.appendChild(img)
          loc.focus()
          loc.restoreSelection()
        }
        this.form.intro = loc.$refs.content.innerHTML
      }
    },
    closeThumbDialog: function () {
      this.thumbDialog = false
    },
    updateContent: function (data) {
      this.form.intro = data
    },
    handlePicChange: function (file, fileList) {
      let that = this
      if (file && file.raw) {
        if (file.raw.type !== 'image/jpeg' && file.raw.type !== 'image/png') {
          that.$message.error('上传图片只能是 JPG 或者 PNG 格式!')
        }
        if (file.raw.size / 1024 / 1024 > 5) {
          that.$message.error('上传图片大小不能超过 5MB!')
        }
      }

      let params = { isUploadFile: true, file: file.raw, type: 'image' }
      uploadMaterial(params).then(res => {
        file.url = this.wximageurl + res.data.data.url
        that.form.pic = res.data.data.url
      })
    },
    submitThingsAction: function () {
      // 提交商品
      if (this.form.thing_id) {
        updateThings(this.form.thing_id, this.form)
          .then(response => {
            this.$router.push({ path: '/brand/onecode' })
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '更新物品信息出错'
            })
          })
      } else {
        createThings(this.form)
          .then(response => {
            this.$router.push({ path: '/brand/onecode' })
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '保存物品信息出错'
            })
          })
      }
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
.list-item {
  padding: 15px;
  background: #fff;
  margin-bottom: 15px;
  .thumbnail {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    margin-right: 15px;
    background: #f8f8f8;
    &::after {
      display: block;
      padding-top: 100%;
      content: '';
    }
    img {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
    }
  }
  .item-title {
    margin-bottom: 6px;
    font-size: 18px;
    color: #333;
  }
  .item-date {
    font-size: 13px;
    color: #ccc;
  }
  .item-batch {
    font-size: 14px;
    color: #999;
  }
}

h3.title {
  padding: 20px;
  font-size: 18px;
  color: #ff5000;
}
.col-3 {
  width: 120px;
  margin-right: 10px;
}
.detail-info {
  margin: 0 10px;
}
.el-row {
  margin-bottom: 10px;
}

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
