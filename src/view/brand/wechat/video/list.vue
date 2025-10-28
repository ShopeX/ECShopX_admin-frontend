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
  <div class="video_pick_panel section-white">
    <el-button type="primary" icon="plus" @click="addVideo"> 上传视频 </el-button>
    <div v-loading="loading" class="video_pick">
      <ul class="clearfix">
        <li v-for="(videoitem, index) in videoList.item" :key="index" class="video_item">
          <div class="video_item_bd">
            <video class="video-html" :src="videoitem.url" controls="controls">
              您的浏览器不支持 video 标签。
            </video>
            <div class="check_content">
              <span class="video_name" :title="videoitem.name">{{ videoitem.name }}</span>
            </div>
          </div>
          <div class="msg_card">
            <el-row>
              <el-col :span="24">
                <div class="opr_item" @click="removeItem(videoitem, index)">
                  <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <i class="el-icon-delete" />
                  </el-tooltip>
                </div>
              </el-col>
            </el-row>
          </div>
        </li>
      </ul>
    </div>
    <div class="tc">
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
    <el-dialog title="上传视频文件" :visible.sync="uploadDialog" :before-close="handleCancel">
      <template>
        <el-form ref="form" :model="videoForm" class="demo-ruleForm" label-width="90px">
          <el-form-item label="视频标题">
            <el-col :span="14">
              <el-input v-model="videoForm.title" maxlength="20" />
            </el-col>
          </el-form-item>
          <el-form-item label="视频描述">
            <el-col :span="14">
              <el-input v-model="videoForm.description" maxlength="20" />
            </el-col>
          </el-form-item>
          <el-form-item label="视频文件">
            <el-col :span="14">
              <el-upload
                class="upload-demo"
                action=""
                :auto-upload="false"
                :show-file-list="false"
                :on-change="uploadVideo"
              >
                <el-button size="small" type="primary" :loading="isLoadData"> 上传视频 </el-button>
                <div slot="tip" class="el-upload__tip">只能上传MP4文件，且不超过15M</div>
              </el-upload>
            </el-col>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { validatUploadVideo } from '../../../../utils/validate'
import { getWechatMaterial, deleteWechatMaterial, uploadMaterial } from '../../../../api/wechat'
export default {
  props: ['activeName', 'getStatus'],
  data() {
    return {
      loading: false,
      isLoadData: false,
      videoList: {},
      total_count: 0,
      params: {
        type: 'video',
        page: 1,
        pageSize: 20
      },
      uploadDialog: false,
      videoForm: {
        title: '',
        description: ''
      }
    }
  },
  watch: {
    getStatus(newVal, oldVal) {
      if (newVal) {
        this.getList()
      }
    }
  },
  methods: {
    handleCurrentChange(page_num) {
      this.isLoadData = false
      this.params.page = page_num
      this.getList()
    },
    handleSizeChange(pageSize) {
      this.isLoadData = false
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getList()
    },
    uploadVideo(file, filelist) {
      if (this.videoForm.title.length <= 0) {
        this.$message({
          message: '视频标题必填',
          type: 'error'
        })
        return
      }
      if (this.videoForm.description.length <= 0) {
        this.$message({
          message: '视频描述必填',
          type: 'error'
        })
        return
      }

      let check = true //validatUploadVideo(file)
      if (check !== true) {
        this.$message({
          message: '请选择视频',
          type: 'error',
          duration: 5 * 1000
        })
        return
      }

      this.isLoadData = true
      this.videoForm.isUploadFile = true
      this.videoForm.file = file.raw
      this.videoForm.type = 'video'
      uploadMaterial(this.videoForm)
        .then(res => {
          this.isLoadData = false
          this.uploadDialog = false
          this.getList()
        })
        .catch(function (error) {
          this.isLoadData = false
        })
    },
    getList() {
      if (!this.isLoadData) {
        this.loading = true
        getWechatMaterial(this.params)
          .then(response => {
            this.videoList = response.data.data
            this.total_count = response.data.data.total_count
            this.isLoadData = false
            this.loading = false
          })
          .catch(function (error) {
            this.loading = false
          })
      }
    },
    removeItem(item, index) {
      this.$confirm('确定删除此视频吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteWechatMaterial({ media_id: item.media_id }).then(response => {
            this.videoList.item.splice(index, 1)
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 5 * 1000
            })
          })
          //删除操作
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    addVideo() {
      this.uploadDialog = true
    },
    handleCancel() {
      this.uploadDialog = false
    }
  }
}
</script>

<style scoped lang="scss">
.video_pick_panel {
  .video_pick {
    margin-right: -1%;
    margin-top: 10px;
    .video_item {
      margin-bottom: 20px;
      margin-right: 1%;
      border: 1px solid #e7e7eb;
      width: 19%;
    }
    .video_item_bd {
      position: relative;
    }
    .video-html {
      width: 100%;
      height: 169px;
      border-bottom: 1px solid #e7e7eb;
    }
    .check_content {
      width: 100%;
      padding: 0 5px;
    }
    .video_name {
      height: 34px;
      line-height: 34px;
      overflow: hidden;
      display: inline-block;
      width: 90%;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.video_pick {
  margin-right: -45px;
  .video_item {
    float: left;
    text-align: center;
    &:hover {
      -webkit-box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
      -moz-box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    }
  }
}
.msg_card {
  background-color: #f4f5f9;
  border-top: 1px solid #e7e7eb;
  width: 100%;
  .opr_item {
    height: 34px;
    line-height: 34px;
    cursor: pointer;
    color: #999;
    font-size: 16px;
    &:hover {
      color: #333;
    }
  }
}
</style>
