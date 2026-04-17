<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog :visible.sync="dialogVisible" width="460px" :before-close="dialogBeforeClose">
    <div slot="title" class="clearfix">
      <span>{{ $t('fc463ac7.73f28a') }}</span>
      <span class="tips title-tips">{{ $t('fc463ac7.470b8b') }}</span>
    </div>
    <div>
      <div class="tips">{{ $t('fc463ac7.fed838') }}</div>
      <div class="upload" @dragover="fileDragover" @drop="fileDrop">
        <img class="upload-img" src="@/assets/img/upload.svg" alt="" />
        <div class="upload-text">
          <span>{{ $t('fc463ac7.1ef03f') }}</span>
          <el-upload
            action=""
            :on-change="uploadHandleChange"
            :auto-upload="false"
            :show-file-list="false"
          >
            <el-button type="text">{{ $t('fc463ac7.2c808b') }}</el-button>
          </el-upload>
        </div>
      </div>
      <div>
        EXCEL格式模板请<span class="download-temp" @click="uploadHandleTemplate()">{{
          $t('fc463ac7.1dc6d4')
        }}</span>
      </div>
    </div>
    <div slot="footer">
      <el-button @click="dialogBeforeClose">{{ $t('fc463ac7.c08ab9') }}</el-button>
      <el-button type="primary" @click="submitUpload">{{ $t('fc463ac7.e87cc2') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { handleUploadFile, exportUploadTemplate } from '@/api/common'
export default {
  model: {
    prop: 'dialogVisible',
    event: 'changeDialogVisible'
  },
  props: {
    dialogVisible: {
      type: Boolean,
      defalut: false
    }
  },
  data() {
    return {
      uploadList: []
    }
  },
  methods: {
    dialogBeforeClose() {
      this.$emit('changeDialogVisible', false)
    },
    /**
     * 下载模板
     * */
    uploadHandleTemplate() {
      let params = { file_type: 'discount_goods', file_name: '商品模板' }
      exportUploadTemplate(params).then((response) => {
        let { data } = response.data
        if (data.file) {
          var a = document.createElement('a')
          a.href = data.file
          a.download = data.name
          document.body.appendChild(a)
          a.click()
          a.remove()
        } else {
          this.$message({
            type: 'error',
            message: this.$t('fc463ac7.bfd8d5')
          })
        }
      })
    },
    // 拖拽上传
    fileDragover(e) {
      e.preventDefault()
    },
    fileDrop(e) {
      e.preventDefault()
      const file = e.dataTransfer.files[0] // 获取到第一个上传的文件对象

      if (!file) return
      this.batchFile = file
      this.fileName = file.name
      this.uploadHandleChange(file, 'drag')
    },

    // 批量上传
    uploadHandleChange(file, type) {
      let fileUpload = null
      if (type === 'drag') {
        fileUpload = file
      } else {
        fileUpload = file.raw
      }
      let params = { isUploadFile: true, file_type: 'discount_goods', file: fileUpload }
      handleUploadFile(params).then((response) => {
        this.$message({
          type: 'success',
          message: this.$t('fc463ac7.a7699b')
        })

        let { data } = response.data
        if (data.fail.length > 0) {
          let str = data.fail.map((item) => {
            return item.item_bn
          })
          setTimeout(() => {
            this.$alert(`【${str}】` + this.$t('fc463ac7.e6e637'), this.$t('fc463ac7.d1d4c3'))
          }, 1000)
        }
        if (data.succ.length <= 0) return
        this.uploadList = data.succ
      })
    },

    // 确认上传
    submitUpload() {
      this.$emit('uploadFile', this.uploadList)
    }
  }
}
</script>

<style lang="scss" scoped>
.tips {
  font-size: 12px;
  color: #999;
}
.title-tips {
  margin-left: 20px;
}
.upload {
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 20px 0;

  background-color: rgba(242, 242, 242, 1);
  box-sizing: border-box;
  border: 1px solid rgba(215, 215, 215, 1);
  .upload-img {
    width: 150px;
    height: 150px;
  }
  .upload-text {
    display: flex;
    align-items: center;
  }
}
.download-temp {
  color: #409eff;
  cursor: pointer;
}
</style>
