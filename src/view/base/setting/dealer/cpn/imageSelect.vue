<template>
  <el-dialog
    class="img_dialog"
    title="选择图片"
    :visible="showDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancelAction"
    append-to-body
  >
    <div class="img_pick_panel inner_container_box">
      <el-row>
        <el-col>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane
              v-if="$store.getters.login_type != 'distributor'"
              label="微信上传"
              name="wechatimages"
            >
              <div v-loading="loading" class="inner_main">
                <div class="img_pick_area">
                  <div class="sub_title_bar in_dialog">
                    <div class="upload_box">
                      <el-upload
                        class="upload-demo"
                        action=""
                        :auto-upload="false"
                        :show-file-list="false"
                        :on-change="uploadImage"
                        :multiple="true"
                      >
                        <el-button type="primary"> 微信上传 </el-button>
                      </el-upload>
                    </div>
                  </div>

                  <div class="img_pick_area_inner">
                    <div class="img_pick">
                      <div class="img_list">
                        <div
                          v-for="(item, index) in imgList"
                          :key="index"
                          class="img_item"
                          @click="checkedImg(item, index)"
                        >
                          <div
                            class="frm_checkbox_label img_item_bd"
                            :class="
                              isMost ? { selected: item.selected } : { 'selected': i == index }
                            "
                          >
                            <div class="pic_box">
                              <img :src="wximageurl + item.url" class="pic">
                            </div>
                            <span class="lbl_content">{{ item.name }}</span>
                            <div class="selected_mask">
                              <div class="selected_mask_inner" />
                              <div class="selected_mask_icon el-icon-check" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="imgData.total_count > params.pageSize" class="pager-wrap tc">
                  <el-pagination
                    layout="total, sizes, prev, pager, next"
                    :current-page.sync="params.page"
                    :page-sizes="[params.pageSize]"
                    :total="imgData.total_count"
                    :page-size="params.pageSize"
                    @current-change="handleCurrentChange"
                  />
                </div>

                <div slot="footer" class="dialog-footer">
                  <el-button @click="cancelAction"> 取 消 </el-button>
                  <el-button type="primary" @click="saveAction"> 确 定 </el-button>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="本地上传" name="localimages">
              <div v-loading="loading" class="inner_main">
                <div class="img_pick_area">
                  <div class="sub_title_bar in_dialog">
                    <div class="upload_box">
                      <el-upload
                        class="upload-demo"
                        action=""
                        accept="image/jpeg,image/png,image/gif"
                        :show-file-list="false"
                        :data="localpostData"
                        :http-request="handleUpload"
                        :before-upload="beforeAvatarUpload"
                        :on-success="handleAvatarSuccess"
                        :on-error="uploadError"
                      >
                        <el-button type="primary"> 本地上传 </el-button>
                      </el-upload>
                    </div>
                  </div>

                  <div class="img_pick_area_inner">
                    <div class="img_pick">
                      <div class="img_list">
                        <div
                          v-for="(item, index) in localimgList"
                          :key="index"
                          class="img_item"
                          @click="localcheckedImg(item, index)"
                        >
                          <div
                            class="frm_checkbox_label img_item_bd"
                            :class="
                              isMost ? { selected: item.selected } : { 'selected': locali == index }
                            "
                          >
                            <div class="pic_box">
                              <img :src="item.image_full_url" class="pic">
                            </div>
                            <span class="lbl_content">{{ item.image_name }}</span>
                            <div class="selected_mask">
                              <div class="selected_mask_inner" />
                              <div class="selected_mask_icon el-icon-check" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="localimgData.total_count > localparams.pageSize" class="pager-wrap tc">
                  <el-pagination
                    layout="total, sizes, prev, pager, next"
                    :current-page.sync="localparams.page"
                    :page-sizes="[localparams.pageSize]"
                    :total="localimgData.total_count"
                    :page-size="localparams.pageSize"
                    @current-change="localhandleCurrentChange"
                  />
                </div>

                <div slot="footer" class="dialog-footer">
                  <el-button @click="cancelAction"> 取 消 </el-button>
                  <el-button type="primary" @click="localsaveAction"> 确 定 </el-button>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
import { validatUploadImage } from '@/utils/validate'
import { getWechatMaterial, uploadMaterial } from '@/api/wechat'
import UploadUtil from '@/utils/uploadUtil'
import {
  getUploadQiniuPicToken,
  uploadQiniuPic,
  getUploadPic,
  getQiniuPicList,
  deleteImage
} from '@/api/qiniu'
export default {
  props: ['dialogVisible', 'scStatus', 'isMost', 'pickerImgType'],
  data() {
    return {
      name: 'ImgSelect',
      checkedItem: [],
      imgData: {},
      imgList: [],
      i: -1,
      loading: false,
      params: {
        type: 'image',
        page: 1,
        pageSize: 20
      },
      showDialog: false,
      frontItem: [],
      activeName: 'wechatimages',
      actionPath: 'https://upload-z2.qiniup.com',
      localimage_prefix: '',
      localpostData: {
        token: '',
        key: '',
        fname: ''
      },
      localloading: false,
      localisLoadData: false,
      localimagesList: {},
      localparams: {
        type: 'image',
        page: 1,
        pageSize: 20
      },
      localcheckedItem: [],
      localimgData: {},
      localimgList: [],
      locali: -1
    }
  },
  watch: {
    scStatus(newV, oldV) {
      if (newV) {
        this.params.page = 1
        if (this.$store.getters.login_type != 'distributor') {
          this.getImageList()
        } else {
          this.activeName = 'localimages'
        }
        this.localparams.page = 1
        this.getLocalImageList()
      }
    },
    dialogVisible(newV, oldV) {
      this.showDialog = newV
      this.checkedItem = []
    }
  },
  methods: {
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getImageList()
    },
    checkedImg(item, index) {
      if (this.isMost) {
        item.selected = !item.selected
        item.selected ? this.checkedItem.push(item) : this.checkedItem.pop(item)
      } else {
        this.checkedItem = item
      }
      this.i = index
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
      uploadMaterial(params).then((res) => {
        this.getImageList()
      })
    },
    saveAction() {
      this.$emit('chooseImg', this.checkedItem)
      if (this.isMost) {
        this.checkedItem = []
        this.imgList.forEach((v) => {
          v.selected = false
        })
      }
    },
    cancelAction() {
      this.$emit('closeImgDialog')
    },
    getImageList() {
      let that = this
      that.loading = true
      getWechatMaterial(this.params)
        .then((response) => {
          that.imgData = response.data.data
          that.imgList = response.data.data.item
          if (that.isMost) {
            that.imgList.forEach((v) => {
              that.$set(v, 'selected', false)
            })
          }
          that.loading = false
        })
        .catch(function (error) {
          that.loading = false
        })
    },
    handleClick(tab, event) {},
    //本地上传
    localhandleCurrentChange(page_num) {
      this.localparams.page = page_num
      this.localisLoadData = false
      this.getLocalImageList()
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGIF = file.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 5

      if (!isJPG && !isPNG && !isGIF) {
        this.$message.error('上传图片只能是 JPG 或者 PNG 格式!')
        return
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 5MB!')
        return
      }

      this.localpostData.fname = file.name

      // let tokenParams = { filename: file.name, filesystem: 'qiniu' }
      // return getUploadQiniuPicToken(tokenParams).then(response => {
      //   this.localpostData.token = response.data.data.token
      //   this.localpostData.key = response.data.data.key
      //   this.localimage_prefix = response.data.data.domain
      //   this.actionPath  = `https://upload-${!response.data.data.region ? 'z2' : response.data.data.region}.qiniup.com`
      // })
    },
    handleAvatarSuccess(res, file) {
      let uploadParams = {
        image_cat_id: 2, //图片分类必填,必须为整数
        image_name: file.name, //图片名称必填,不能超过50个字符
        image_url: res.key, //图片链接必填
        image_type: file.raw.type, //图片分类长度不能超过20个字符
        storage: 'image' //图片id必填
      }
      // if (res.key) {
      uploadQiniuPic(uploadParams).then((res) => {
        const obj = {
          file_type: this.pickerImgType,
          file_url: res.data.data.image_full_url
        }
        this.$api.adapay.uploadPic(obj).then((res) => {
          // console.log(res);
          // debugger
          this.$message({
            message: '上传成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.localisLoadData = false
          this.getLocalImageList()
        })
        this.localcheckedItem = res.data.data
      })
      // }
    },
    getLocalImageList() {
      let that = this
      if (!this.localisLoadData) {
        that.localloading = true
        getQiniuPicList(that.localparams)
          .then((response) => {
            that.localimgData = response.data.data
            this.localimgList = response.data.data.list
            if (that.isMost) {
              that.localimgList.forEach((v) => {
                that.$set(v, 'selected', false)
              })
            }
            that.localisLoadData = true
            that.localloading = false
          })
          .catch(function (error) {
            that.localloading = false
          })
      }
    },
    localcheckedImg(item, index) {
      if (this.isMost && this.localcheckedItem && this.localcheckedItem.url) {
        this.localcheckedItem = []
      }
      if (this.isMost) {
        item.selected = !item.selected
        item.selected ? this.localcheckedItem.push(item) : this.localcheckedItem.pop(item)
      } else {
        this.localcheckedItem = item
      }
      this.locali = index
    },
    localsaveAction() {
      this.$emit('chooseImg', this.localcheckedItem)
      if (this.isMost) {
        this.localcheckedItem = []
        this.localimgList.forEach((v) => {
          v.selected = false
        })
      }
    },
    // 自定义上传
    handleUpload: function (e) {
      const upload = new UploadUtil()
      // 上传
      upload
        .uploadImg(e.file, e.file.name)
        .then(
          (res) => e.onSuccess(res),
          (err) => e.onError(err)
        )
        .catch((err) => e.onError(err))
    },
    // 上传错误回调
    uploadError: function (e) {
      console.error(e)
    }
  }
}
</script>

<style scoped lang="scss">
//图片选择器
.inner_container_box {
  background-color: #fff;
  /*border-top: 1px solid #e7e7eb;*/
  margin: -10px 0;
}
.img_pick_panel {
  .inner_side {
    max-width: 240px;
    vertical-align: top;
    word-break: break-all;
    word-wrap: break-word;
  }
  .inner_menu_link {
    padding-left: 1.5em;
    text-align: left;
    strong {
      max-width: 86px;
    }
    i {
      color: #999;
    }
  }
  .num {
    display: inline-block;
    padding-left: 3px;
    font-style: normal;
    color: #8d8d8d;
  }
  .img_pick_area {
    position: relative;
    overflow-x: hidden;
    overflow-y: hidden;
  }
  .img_pick_area_inner {
    position: relative;
    .img_pick {
      /*min-height: 332px;*/
    }
  }
}
.inner_menu_item {
  position: relative;
  line-height: 36px;
  &:hover,
  &.checked {
    background-color: #f4f5f9;
  }
}
.inner_menu_link {
  display: block;
  color: #222;
  text-decoration: none;
  padding-left: 1em;
  cursor: pointer;
  strong {
    display: inline-block;
    margin-top: -2px;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    max-width: 80px;
    font-weight: 400;
    font-style: normal;
    vertical-align: middle;
  }
}
.sub_title_bar {
  line-height: 36px;
  margin-bottom: 10px;
  text-align: left;
  border-bottom: 1px solid #e7e7eb;
  background-color: #fff;
  &.in_dialog {
    padding: 0 0 15px;
  }
}
.img_pick {
  padding: 20px 0 5px;
  .img_list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .img_item {
    position: relative;
    margin: 0 8px 10px 8px;
    text-align: center;
    .pic_box {
      width: 117px;
      height: 117px;
      position: relative;
      overflow: hidden;
      background: #f8f8f8;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .pic {
      width: 100%;
      max-height: 117px;
    }
  }
  .frm_checkbox_label {
    display: inline-block;
    text-align: left;
    cursor: pointer;
    margin-right: 1em;
  }
  .img_item_bd {
    position: relative;
    margin: 0;
    width: 117px;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    .selected_mask {
      display: none;
    }
    &.selected {
      .selected_mask,
      .selected_mask_icon {
        position: absolute;
        top: 0;
        left: 0;
      }
      .selected_mask {
        display: block;
        width: 100%;
        height: 100%;
      }
      .selected_mask_inner {
        width: 117px;
        height: 117px;
        background-color: rgba(0, 0, 0, 0.6);
      }
      .selected_mask_icon {
        /*width: 117px;
          height: 117px;*/
        color: #fff;
        font-size: 32px;
        top: 26%;
        left: 34%;
      }
    }
  }
  .lbl_content {
    display: block;
    padding: 0 10px;
    height: 36px;
    line-height: 36px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.dialog-footer {
  border-top: 1px solid #e7e7eb;
  padding: 20px 20px 15px;
  text-align: center;
  box-sizing: border-box;
}
.pager-wrap {
  padding: 10px 20px;
}
.el-tabs__header {
  margin: 0 15px 15px !important;
}
</style>
