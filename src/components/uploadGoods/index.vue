<template>
  <el-dialog :visible.sync="dialogVisible" width="460px" :before-close="dialogBeforeClose">
    <div slot="title" class="clearfix">
      <span>数据导入</span>
      <span class="tips title-tips">请导入EXCEL数据表格</span>
    </div>
    <div>
      <div class="tips">商品数量不能超过两万，超过部分会被删除</div>
      <div class="upload" @dragover="fileDragover" @drop="fileDrop">
        <img class="upload-img" src="@/assets/img/upload.svg" alt="">
        <div class="upload-text">
          <span>将文件拖到此处，或</span>
          <el-upload
            action=""
            :on-change="uploadHandleChange"
            :auto-upload="false"
            :show-file-list="false"
          >
            <el-button type="text"> 点击上传 </el-button>
          </el-upload>
        </div>
      </div>
      <div>
        EXCEL格式模板请<span class="download-temp" @click="uploadHandleTemplate()"
          >下载系统提供模板</span
        >
      </div>
    </div>
    <div slot="footer">
      <el-button @click="dialogBeforeClose"> 取 消 </el-button>
      <el-button type="primary" @click="submitUpload"> 确认上传 </el-button>
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
      exportUploadTemplate(params).then(response => {
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
            message: '没有相关数据可导出'
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
      handleUploadFile(params).then(response => {
        this.$message({
          type: 'success',
          message: '上传成功'
        })

        let { data } = response.data
        if (data.fail.length > 0) {
          let str = data.fail.map(item => {
            return item.item_bn
          })
          setTimeout(() => {
            this.$alert(`【${str}】在系统中未查询到相关数据，请核对后再上传`, '消息通知')
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
