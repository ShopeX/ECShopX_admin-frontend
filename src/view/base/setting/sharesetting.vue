<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage :title="$t('901267f6.b3cec2')">
    <template slot="page-footer">
      <div class="text-center">
        <el-button type="primary" @click="saveShareSetting">{{ $t('901267f6.be5fbb') }}</el-button>
      </div>
    </template>
    <div>
      <div class="level-item">
        <div class="clearfix">
          <h3 class="f_l">
            <span>{{ $t('901267f6.39dd6e') }}</span>
          </h3>
        </div>
        <div class="flex">
          <div class="preview-box f_l">
            <div>
              <div class="upload-box" @click="handleImgChange('index')">
                <SpImagePicker v-model="shareForm.index.imageUrl" />
                <!-- <img v-if="shareForm.index.imageUrl" :src="wximageurl + shareForm.index.imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon" /> -->
              </div>
            </div>

            <!-- <imgPicker
              :dialog-visible="imgDialog"
              :sc-status="isGetImage"
              @chooseImg="pickImg"
              @closeImgDialog="closeImgDialog"
            /> -->
            <p class="content-center">{{ $t('901267f6.9cbbc8') }}</p>
          </div>
          <div class="item-content f_l">
            <div>
              <span class="txt">{{ $t('901267f6.32c65d') }}</span>
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
            <span>{{ $t('901267f6.f8c56b') }}</span>
          </h3>
        </div>
        <div class="flex">
          <div class="preview-box f_l">
            <div>
              <div class="upload-box" @click="handleImgChange('planting')">
                <SpImagePicker v-model="shareForm.planting.imageUrl" />
                <!-- <img v-if="shareForm.planting.imageUrl" :src="wximageurl + shareForm.planting.imageUrl"
                  class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon" /> -->
              </div>
            </div>
            <p class="content-center">{{ $t('901267f6.9cbbc8') }}</p>
          </div>
          <div class="item-content f_l">
            <div>
              <span class="txt">{{ $t('901267f6.32c65d') }}</span>
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
            <span>{{ $t('901267f6.9e0fa2') }}</span>
          </h3>
        </div>
        <div class="flex">
          <div class="preview-box f_l">
            <div>
              <div class="upload-box" @click="handleImgChange('itemlist')">
                <SpImagePicker v-model="shareForm.itemlist.imageUrl" />
                <!-- <img v-if="shareForm.itemlist.imageUrl" :src="wximageurl + shareForm.itemlist.imageUrl"
                  class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon" /> -->
              </div>
            </div>
            <p class="content-center">{{ $t('901267f6.9cbbc8') }}</p>
          </div>
          <div class="item-content f_l">
            <div>
              <span class="txt">{{ $t('901267f6.32c65d') }}</span>
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
            <span>{{ $t('901267f6.3c6bb9') }}</span>
          </h3>
        </div>
        <div class="flex">
          <div class="preview-box f_l">
            <div>
              <div class="upload-box" @click="handleImgChange('group')">
                <SpImagePicker v-model="shareForm.group.imageUrl" />
                <!-- <img v-if="shareForm.group.imageUrl" :src="wximageurl + shareForm.group.imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon" /> -->
              </div>
            </div>
            <p class="content-center">{{ $t('901267f6.9cbbc8') }}</p>
          </div>
          <div class="item-content f_l">
            <div>
              <span class="txt">{{ $t('901267f6.32c65d') }}</span>
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
            <span>{{ $t('901267f6.271ccd') }}</span>
          </h3>
        </div>
        <div class="flex">
          <div class="preview-box f_l">
            <div>
              <div class="upload-box" @click="handleImgChange('seckill')">
                <SpImagePicker v-model="shareForm.seckill.imageUrl" />
                <!-- <img v-if="shareForm.seckill.imageUrl" :src="wximageurl + shareForm.seckill.imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon" /> -->
              </div>
            </div>
            <p class="content-center">{{ $t('901267f6.9cbbc8') }}</p>
          </div>
          <div class="item-content f_l">
            <div>
              <span class="txt">{{ $t('901267f6.32c65d') }}</span>
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
            <span>{{ $t('901267f6.d3eceb') }}</span>
          </h3>
        </div>
        <div class="flex">
          <div class="preview-box f_l">
            <div>
              <div class="upload-box" @click="handleImgChange('coupon')">
                <SpImagePicker v-model="shareForm.coupon.imageUrl" />
                <!-- <img v-if="shareForm.coupon.imageUrl" :src="wximageurl + shareForm.coupon.imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon" /> -->
              </div>
            </div>
            <p class="content-center">{{ $t('901267f6.9cbbc8') }}</p>
          </div>
          <div class="item-content f_l">
            <div>
              <span class="txt">{{ $t('901267f6.32c65d') }}</span>
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
    getShareSetting().then((res) => {
      this.shareForm = res.data.data
    })
  },
  methods: {
    saveShareSetting() {
      this.$confirm(this.$t('901267f6.f29435'), this.$t('901267f6.02d981'), {
        confirmButtonText: this.$t('901267f6.38cf16'),
        cancelButtonText: this.$t('901267f6.625fb2'),
        type: 'warning'
      })
        .then(() => {
          setShareSetting(this.shareForm)
            .then((res) => {
              this.$message({
                type: 'success',
                message: this.$t('901267f6.3b1083')
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$t('901267f6.6de920')
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('901267f6.2111cc')
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
  .sp-image-picker {
    display: inline-block;
    border-radius: 6px;
    width: 200px;
    height: 125px;
  }

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
<style lang="scss">
.upload-box {
  .sp-image-picker {
    .image-item {
      width: 100% !important;
      height: 100% !important;
      border: 1px dashed #c0ccda !important;
      .img-content {
        cursor: default !important;
      }
      .image-meta {
        cursor: pointer !important;
      }
    }
  }
}
</style>
