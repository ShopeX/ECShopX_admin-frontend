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
<style lang="scss" scope>
.form-block-head {
  .block-head-hd {
    font-weight: bold;
    color: #333;
    height: 40px;
    line-height: 40px;
  }
  border-bottom: 1px solid #efefef;
}
.width-full {
  width: 100%;
}
.form-block-body {
  padding: 20px;
  .el-form-item {
    margin-bottom: 0px;
  }
}
.goodsimages-hd {
  .tipinfo {
    color: #1480e3;
    margin-right: 10px;
  }
}
.goodspic-drag {
  &::after {
    display: block;
    content: '';
    clear: both;
  }
}
.goodspic {
  margin: 0 10px 10px 0;
  position: relative;
  float: left;
  text-align: center;
  .img-wrap {
    width: 120px;
    height: 120px;
    border: 1px solid #ddd;
    position: relative;
    &:hover {
      .goodspic-mask {
        display: block;
      }
    }
  }
  .goodspic-mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.2);
    cursor: pointer;
    display: none;
    .icon-trash-alt {
      font-size: 18px;
      color: #fff;
      float: left;
      margin-top: 40px;
      margin-left: 20px;
    }
    .icon-arrows-alt {
      font-size: 18px;
      color: #fff;
      float: left;
      margin-top: 40px;
      margin-left: 10px;
    }
    .icon-sousuo {
      font-size: 18px;
      color: #fff;
      float: left;
      margin-top: 40px;
      margin-left: 12px;
    }
  }
}
.upload-box {
  width: 120px;
  height: 120px;
  float: left;
  border: 1px dashed #ddd;
  border-radius: 6px;
  margin: 0 10px 10px 0;
  overflow: hidden;
  position: relative;
  .icon-camera {
    font-size: 28px;
    color: #ccc;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.vue-treeselect__multi-value {
  height: 38px;
}
.vue-treeselect__value-container,
.vue-treeselect__multi-value {
  vertical-align: initial;
}
.vue-treeselect__multi-value-item-container {
  padding-top: 2px;
}
.vue-treeselect__multi-value-item {
  height: 30px;
  line-height: 30px;
}
.vue-treeselect__multi-value {
  margin-bottom: 0 !important;
}
.vue-treeselect__placeholder {
  line-height: 40px;
  padding: 0 10px;
}
</style>
<template>
  <div class="comp-baseform">
    <div class="form-block-head clearfix">
      <div class="block-head-hd">基础信息</div>
    </div>
    <div class="form-block-body">
      <el-form :model="value" label-position="right" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="商品标题" required>
              <el-input v-model="value.itemName" :maxlength="100" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="副标题">
              <el-input v-model="value.brief" :maxlength="30" placeholder="" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="运费模板" required>
              <el-select v-model="value.templatesId" class="width-full" placeholder="请选择">
                <el-option
                  v-for="item in templatesList"
                  :key="item.template_id"
                  :label="item.name"
                  :value="item.template_id"
                />
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row :gutter="20">
          <!-- <el-col :span="8">
            <el-form-item label="品牌" required>
              <el-select
                v-model="value.brandId"
                class="width-full"
                remote
                filterable
                :remote-method="getBrandList"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in brandList"
                  :key="item.attribute_id"
                  :label="item.attribute_name"
                  :value="item.attribute_id"
                />
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="计量单位">
              <el-input v-model="value.itemUnit" :maxlength="60" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排序编号">
              <el-input v-model="value.sort" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="产地">
              <el-cascader
                v-model="value.regionsId"
                class="width-full"
                placeholder="选择地区"
                :options="regions"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品税率">
              <el-input v-model="value.taxRate" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <!-- <el-col :span='8'>
            <el-form-item label="开启分润">
              <el-switch
                v-model="value.isProfit"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span='8' v-if="!isCross">
            <el-form-item label="套装商品">
              <el-switch
                v-model="value.isPackageItems"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </el-col> -->
          <el-col v-if="!isCross" :span="8">
            <el-form-item label="赠品">
              <el-switch v-model="value.isGift" active-color="#13ce66" inactive-color="#ff4949" />
              <span>
                <i class="el-alert__icon el-icon-info" />
                开启后前台不可购买
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="商品图" required>
              <div class="goodsimages-hd">
                <span class="tipinfo">
                  <i class="el-alert__icon el-icon-info" />选中以下图片生成分享码
                </span>
                <el-checkbox :value="isAllCheck" @change="handleAllSelect"> 全选 </el-checkbox>
              </div>
              <div class="goodsimages-bd pics-box">
                <ul class="goodspic-wrap">
                  <draggable
                    v-model="value.pics"
                    class="goodspic-drag"
                    :options="dragIssuesOptions"
                    style="position: 'relative'"
                    @update="dragEnd"
                  >
                    <li v-for="(item, index) in value.pics" :key="index" class="goodspic">
                      <div class="img-wrap">
                        <el-image style="width: 100%; height: 100%" :src="item" fit="contain" />
                        <div class="goodspic-mask">
                          <div class="iconfont icon-trash-alt" @click="removePicsImg(index)" />
                          <div class="iconfont icon-arrows-alt" />
                          <div class="ecx-icon icon-sousuo" @click="previewSrcList" />
                        </div>
                        <el-image-viewer
                          v-if="showViewer"
                          :on-close="closeViewer"
                          :url-list="[item]"
                        />
                      </div>
                      <el-checkbox v-model="value.pics_create_qrcode[index]" class="checkBox" />
                    </li>
                    <li v-if="value.pics.length < 9" class="upload-box" @click="handlePicsChange">
                      <i class="iconfont icon-camera" />
                    </li>
                  </draggable>
                </ul>
              </div>
              <div class="goodsimages-ft frm-tips">
                <p>
                  1.
                  最多可上传9张图片，文件格式为bmp、png、jpeg、jpg或gif，大小不超过2M（建议尺寸：500px
                  * 500px）
                </p>
                <p>2. 拖动图片进行可排序</p>
                <p>3. 相册图朋友圈分享是否生成小程序码</p>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="上传视频">
              <videoPicker class="video-picker" :data="value.itemVideo" @change="pickVideo" />
              <el-button v-if="value.itemVideo.media_id" type="text" @click="deleteVideo">
                删除
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <imgPicker
        :dialog-visible="picsDialog"
        :sc-status="isGetPics"
        :is-most="multiple"
        @chooseImg="pickPics"
        @closeImgDialog="closePicsDialog"
      />
    </div>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import draggable from 'vuedraggable'
import imgPicker from '@/components/imageselect'
import videoPicker from '@/components/videoselect'
import { getShippingTemplatesList } from '@/api/shipping'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import {
  getItemsDetail,
  createItems,
  updateItems,
  getCategory,
  getGoodsAttr,
  getCategoryInfo
} from '@/api/goods'
import district from '@/common/district.json'
export default {
  name: 'CmBaseForm',
  components: {
    imgPicker,
    videoPicker,
    Treeselect,
    draggable,
    ElImageViewer
  },
  props: ['value', 'isCross'],
  data() {
    return {
      templatesList: [],
      brandList: [],
      categoryList: [],
      loading: true,
      regions: district,
      picsDialog: false,
      isGetPics: false,
      multiple: false,
      picsCurrent: -1,
      dragIssuesOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true,
        handle: '.icon-arrows-alt',
        draggable: '.goodspic'
      },
      showViewer: false
    }
  },
  computed: {
    isAllCheck() {
      const { pics_create_qrcode } = this.value
      const isNotAll = pics_create_qrcode.some(item => !item)
      return !isNotAll
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      const resTempList = await getShippingTemplatesList({
        page: 1,
        pageSize: 99
      })
      const tempList = resTempList.data.data.list
      if (tempList.length > 0) {
        this.templatesList = tempList
      } else {
        this.$message({
          type: 'error',
          message: '请先添加运费模板'
        })
      }

      // 商品分类
      const resCategory = await getCategory({ is_show: false })
      this.categoryList = resCategory.data.data
      this.getBrandList()
      this.loading = false
    },
    // 获取品牌列表
    async getBrandList(searchVal = '') {
      const resBrandList = await getGoodsAttr({
        page: 1,
        pageSize: 1000,
        attribute_type: 'brand',
        attribute_name: searchVal
      })
      this.brandList = resBrandList.data.data.list.map(({ attribute_id, attribute_name }) => {
        return {
          attribute_name: attribute_name,
          attribute_id: attribute_id
        }
      })
    },
    removePicsImg(index) {
      this.value.pics.splice(index, 1)
      this.value.pics_create_qrcode.splice(index, 1)
    },
    previewSrcList(index) {
      this.showViewer = true
    },
    closeViewer() {
      this.showViewer = false
    },
    pickVideo({ media_id, url }) {
      this.value.itemVideo = {
        media_id,
        url
      }
    },
    deleteVideo() {
      this.value.itemVideo.media_id = ''
      this.value.itemVideo.url = ''
    },
    pickPics(data) {
      if (this.value.pics.length + data.length >= 10) {
        this.$message.error('最多上传9张图片!')
        return false
      } else {
        if (data.length != 0) {
          data.forEach(data => {
            this.value.pics.push(data.url)
            this.value.pics_create_qrcode.push(false)
          })
        }
      }
      this.picsDialog = false
    },
    closePicsDialog() {
      this.picsDialog = false
    },
    handleAllSelect(e) {
      const { pics_create_qrcode } = this.value
      this.value.pics_create_qrcode = pics_create_qrcode.map(item => {
        return e
      })
    },
    // picsEnter (index) {
    //   this.picsCurrent  = index
    // },
    // picsLeave () {
    //   this.picsCurrent  = -1
    // },
    //上传商品图（9张）
    handlePicsChange: function () {
      this.picsDialog = true
      this.isGetPics = true
      this.multiple = true
    },
    dragEnd(e) {
      const { oldIndex, newIndex } = e
      const { pics_create_qrcode } = this.form
      const temp = pics_create_qrcode[oldIndex]
      pics_create_qrcode[oldIndex] = pics_create_qrcode[newIndex]
      pics_create_qrcode[newIndex] = temp
    }
  }
}
</script>
