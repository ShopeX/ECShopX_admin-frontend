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
  <SpPage title="分享设置">
    <template slot="page-footer">
      <div class="text-center">
        <el-button type="primary" @click="saveShareSetting"> 保存 </el-button>
      </div>
    </template>
    <div>
      <div class="level-item">
        <div class="clearfix">
          <h3 class="f_l">
            <span>首页自定义分享</span>
          </h3>
        </div>
        <div class="flex">
          <div class="preview-box f_l">
            <div>
              <div class="upload-box" @click="handleImgChange('index')">
                <img
                  v-if="shareForm.index.imageUrl"
                  :src="wximageurl + shareForm.index.imageUrl"
                  class="avatar"
                >
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </div>
            </div>
            <imgPicker
              :dialog-visible="imgDialog"
              :sc-status="isGetImage"
              @chooseImg="pickImg"
              @closeImgDialog="closeImgDialog"
            />
            <p class="content-center">封面图片</p>
          </div>
          <div class="item-content f_l">
            <div>
              <span class="txt">标题</span>
              <el-input v-model="shareForm.index.title" />
            </div>
            <!-- <div>
              <span class="txt">副标题</span>
              <el-input v-model="shareForm.index.desc"></el-input>
            </div> -->
          </div>
        </div>
      </div>
      <div class="level-item">
        <div class="clearfix">
          <h3 class="f_l">
            <span>软文列表自定分享</span>
          </h3>
        </div>
        <div class="flex">
          <div class="preview-box f_l">
            <div>
              <div class="upload-box" @click="handleImgChange('planting')">
                <img
                  v-if="shareForm.planting.imageUrl"
                  :src="wximageurl + shareForm.planting.imageUrl"
                  class="avatar"
                >
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </div>
            </div>
            <p class="content-center">封面图片</p>
          </div>
          <div class="item-content f_l">
            <div>
              <span class="txt">标题</span>
              <el-input v-model="shareForm.planting.title" />
            </div>
            <!-- <div>
              <span class="txt">副标题</span>
              <el-input v-model="shareForm.planting.desc"></el-input>
            </div> -->
          </div>
        </div>
      </div>
      <div class="level-item">
        <div class="clearfix">
          <h3 class="f_l">
            <span>商品默认列表自定义分享</span>
          </h3>
        </div>
        <div class="flex">
          <div class="preview-box f_l">
            <div>
              <div class="upload-box" @click="handleImgChange('itemlist')">
                <img
                  v-if="shareForm.itemlist.imageUrl"
                  :src="wximageurl + shareForm.itemlist.imageUrl"
                  class="avatar"
                >
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </div>
            </div>
            <p class="content-center">封面图片</p>
          </div>
          <div class="item-content f_l">
            <div>
              <span class="txt">标题</span>
              <el-input v-model="shareForm.itemlist.title" />
            </div>
            <!-- <div>
              <span class="txt">副标题</span>
              <el-input v-model="shareForm.itemlist.desc"></el-input>
            </div> -->
          </div>
        </div>
      </div>
      <div class="level-item">
        <div class="clearfix">
          <h3 class="f_l">
            <span>拼团列表页自定义分享</span>
          </h3>
        </div>
        <div class="flex">
          <div class="preview-box f_l">
            <div>
              <div class="upload-box" @click="handleImgChange('group')">
                <img
                  v-if="shareForm.group.imageUrl"
                  :src="wximageurl + shareForm.group.imageUrl"
                  class="avatar"
                >
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </div>
            </div>
            <p class="content-center">封面图片</p>
          </div>
          <div class="item-content f_l">
            <div>
              <span class="txt">标题</span>
              <el-input v-model="shareForm.group.title" />
            </div>
            <!-- <div>
              <span class="txt">副标题</span>
              <el-input v-model="shareForm.group.desc"></el-input>
            </div> -->
          </div>
        </div>
      </div>
      <div class="level-item">
        <div class="clearfix">
          <h3 class="f_l">
            <span>秒杀列表页自定义分享</span>
          </h3>
        </div>
        <div class="flex">
          <div class="preview-box f_l">
            <div>
              <div class="upload-box" @click="handleImgChange('seckill')">
                <img
                  v-if="shareForm.seckill.imageUrl"
                  :src="wximageurl + shareForm.seckill.imageUrl"
                  class="avatar"
                >
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </div>
            </div>
            <p class="content-center">封面图片</p>
          </div>
          <div class="item-content f_l">
            <div>
              <span class="txt">标题</span>
              <el-input v-model="shareForm.seckill.title" />
            </div>
            <!-- <div>
              <span class="txt">副标题</span>
              <el-input v-model="shareForm.seckill.desc"></el-input>
            </div> -->
          </div>
        </div>
      </div>
      <div class="level-item">
        <div class="clearfix">
          <h3 class="f_l">
            <span>优惠券领取列表页自定义分享</span>
          </h3>
        </div>
        <div class="flex">
          <div class="preview-box f_l">
            <div>
              <div class="upload-box" @click="handleImgChange('coupon')">
                <img
                  v-if="shareForm.coupon.imageUrl"
                  :src="wximageurl + shareForm.coupon.imageUrl"
                  class="avatar"
                >
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </div>
            </div>
            <p class="content-center">封面图片</p>
          </div>
          <div class="item-content f_l">
            <div>
              <span class="txt">标题</span>
              <el-input v-model="shareForm.coupon.title" />
            </div>
            <!-- <div>
              <span class="txt">副标题</span>
              <el-input v-model="shareForm.coupon.desc"></el-input>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import { getShareSetting, setShareSetting } from '@/api/company'
import imgPicker from '@/components/imageselect'

export default {
  components: {
    imgPicker
  },
  data() {
    return {
      imgDialog: false,
      isGetImage: false,
      shareForm: {
        index: {
          title: '',
          desc: '',
          imageUrl: ''
        },
        planting: {
          title: '',
          desc: '',
          imageUrl: ''
        },
        itemlist: {
          title: '',
          desc: '',
          imageUrl: ''
        },
        group: {
          title: '',
          desc: '',
          imageUrl: ''
        },
        seckill: {
          title: '',
          desc: '',
          imageUrl: ''
        },
        coupon: {
          title: '',
          desc: '',
          imageUrl: ''
        }
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    getShareSetting().then(res => {
      this.shareForm = res.data.data
    })
  },
  methods: {
    saveShareSetting() {
      this.$confirm('是否保存分享设置', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setShareSetting(this.shareForm)
            .then(res => {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '保存失败'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    //上传卡封面
    handleImgChange(index) {
      this.imgDialog = true
      this.isGetImage = true
      this.curIndex = index
    },
    pickImg(data) {
      this.shareForm[this.curIndex].imageUrl = data.url
      this.imgDialog = false
    },
    closeImgDialog() {
      this.imgDialog = false
    }
  }
}
</script>
<style scoped lang="scss">
.section-box {
  padding: 15px;
}
.avatar-uploader {
  margin-bottom: 15px;
  width: 200px;
  height: 125px;
  &.disabled {
    border-color: #999;
    .avatar-uploader-icon {
      color: #999;
      cursor: not-allowed;
    }
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #ff5000;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #ff5000;
}
.avatar-uploader-icon {
  display: block;
  font-size: 28px;
  width: 200px;
  height: 125px;
  line-height: 125px;
  font-size: 38px;
  color: #ccc;
  text-align: center;
}
.avatar {
  width: 200px;
  height: 125px;
  display: block;
}
.item-box {
  padding-top: 10px;
}
.level-item {
  margin: 20px 40px;
  .el-icon-close {
    cursor: pointer;
  }
}
.preview-box {
  width: 200px;
  margin-top: 15px;
  margin: 15px 20px 0 0;
}
.item-content {
  width: 500px;
  .txt {
    width: 80px;
    display: inline-block;
    text-align: right;
    margin-right: 10px;
    line-height: 36px;
  }
  .txt-none {
    line-height: 36px;
  }
  > div {
    margin-top: 10px;
  }
}
.section-footer {
  margin-top: 20px;
}
.noborder {
  border: 0;
}
.item-content .el-input {
  width: 65%;
}
.item-content .el-checkbox {
  color: inherit;
}
.upload-box {
  display: inline-block;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  width: 200px;
  height: 125px;
  .avatar {
    max-width: 100%;
    max-height: 100%;
  }
  .avatar-uploader-icon {
    width: 100%;
    height: 100%;
    line-height: 125px;
  }
  .avatar-uploader-icon {
    font-size: 38px;
  }
}
</style>
