<template>
  <div class="img_pick_panel section-white">
    <el-upload
      class="upload-demo"
      action=""
      :auto-upload="false"
      :show-file-list="false"
      :on-change="uploadImage"
    >
      <el-button type="primary"> 上传图片 </el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
    </el-upload>
    <div v-loading="loading" class="img_pick">
      <ul class="clearfix">
        <li v-for="(imageitem, index) in imageList.item" :key="index" class="img_item">
          <div class="img_item_bd">
            <div
              class="pic"
              :style="{ backgroundImage: 'url(' + (wximageurl + imageitem.url) + ')' }"
            />
            <div class="check_content">
              <span class="img_name" :title="imageitem.name">{{ imageitem.name }}</span>
            </div>
          </div>
          <div class="msg_card">
            <el-row>
              <el-col :span="24">
                <div class="opr_item" @click="removeItem(imageitem, index)">
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
  </div>
</template>

<script>
import { validatUploadImage } from '../../../../utils/validate'
import { getWechatMaterial, deleteWechatMaterial, uploadMaterial } from '../../../../api/wechat'
export default {
  props: ['activeName', 'getStatus'],
  data() {
    return {
      loading: false,
      isLoadData: false,
      imageList: {},
      total_count: 0,
      params: {
        type: 'image',
        page: 1,
        pageSize: 20
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
    uploadImage(file, filelist) {
      let check = validatUploadImage(file)
      if (check !== true) {
        this.$message({
          message: check,
          type: 'error',
          duration: 5 * 1000
        })
        return
      }
      let params = { isUploadFile: true, file: file.raw, type: 'image' }
      uploadMaterial(params).then(res => {
        this.isLoadData = false
        this.getList()
      })
    },
    getList() {
      if (!this.isLoadData) {
        this.loading = true
        getWechatMaterial(this.params)
          .then(response => {
            this.imageList = response.data.data
            this.total_count = response.data.data.total_count
            this.isLoadData = true
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    removeItem(item, index) {
      this.$confirm('确定删除此图片吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteWechatMaterial({ media_id: item.media_id }).then(response => {
            this.imageList.item.splice(index, 1)
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
    }
  }
}
</script>

<style scoped lang="scss">
.upload-demo {
  margin-bottom: 10px;
}
.img_pick_panel {
  .img_pick {
    margin-right: -1%;
    .img_item {
      margin-bottom: 20px;
      margin-right: 1%;
      border: 1px solid #e7e7eb;
      width: 19%;
    }
    .img_item_bd {
      position: relative;
    }
    .pic {
      width: 100%;
      height: 169px;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
      border-bottom: 1px solid #e7e7eb;
    }
    .check_content {
      width: 100%;
      padding: 0 5px;
    }
    .img_name {
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
.img_pick {
  margin-right: -45px;
  .img_item {
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
