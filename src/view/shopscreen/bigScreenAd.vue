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
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-button type="primary" icon="plus" @click="articleAdd"> 添加待机广告 </el-button>
      </el-col>
    </el-row>
    <section v-loading="loading" class="articles">
      <el-row :gutter="10">
        <el-col v-for="(item, index) in list" :key="index" :xs="12" :sm="8" :md="6" :lg="4">
          <div class="article-item">
            <div
              class="thumbnail"
              :style="
                'background: url(' +
                (item.thumb_img ||
                  'https://fakeimg.pl/200x180/EFEFEF/CCC/?text=image&font=lobster') +
                ') 0% 0% / cover no-repeat;'
              "
            />
            <div class="caption">
              <div class="title">
                {{ item.title }}
              </div>
              <!-- <div class="update-time">{{item.updated | datetime}}</div> -->
            </div>
            <!-- <div class="footer">
                <div class="footer-item copy-btn"
                  v-clipboard:copy="item.link"
                  v-clipboard:success="onCopy">
                  <input class="copy-link" type="text" v-model="item.link"></input>
                  <i class="iconfont icon-copy"></i> 复制文章链接
                </div>
              </div> -->
            <div class="footer">
              <div class="footer-item" @click="handlePublish(item.id, item.release_status)">
                <template v-if="item.release_status">
                  <i class="iconfont icon-undo-alt" /> 撤回
                </template>
                <template v-else> <i class="iconfont icon-broadcast-tower" /> 发布 </template>
              </div>
              <el-popover v-model="item.visible" class="footer-item" placement="top" width="160">
                <div class="content-bottom-padded">
                  <el-input v-model="item.sort" size="mini" placeholder="请输入排序" />
                </div>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="item.visible = false">
                    取消
                  </el-button>
                  <el-button type="primary" size="mini" @click="handleSort(item.id)">
                    确定
                  </el-button>
                </div>
                <div slot="reference"><i class="iconfont icon-sort-amount-up" /> 排序</div>
              </el-popover>
              <div class="footer-item" @click="articleDelete(item.id)">
                <i class="iconfont icon-trash-alt" /> 删除
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <dataPlaceholder :visible.sync="showPlaceholder" height="100%" />
      <el-pagination
        v-if="total_count > params.pageSize"
        class="mt-4 text-right"
        background
        layout="prev, pager, next"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="pageChange"
      />
    </section>
    <el-dialog :visible.sync="showDialog">
      <el-form label-width="100px">
        <!-- <el-form-item label="店铺">
          <el-select v-model="edit.distributor_id"  placeholder="请选择店铺" style="width: 100%">
            <el-option v-for="(item, index) in distributorList" :key="index" :label="item.name" :value="item.distributor_id"> </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="标题">
          <el-input v-model="edit.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="缩略图 ">
          <template>
            <img
              v-if="edit.thumb_img"
              :src="edit.thumb_img"
              class="banner-uploader"
              @click="handleImgChange('thumb_img')"
            >
            <div v-else class="banner-uploader" @click="handleImgChange('thumb_img')">
              <i class="iconfont icon-camera" />
              上传图片
            </div>
          </template>
        </el-form-item>
        <el-form-item label="广告图/视频">
          <el-select v-model="edit.media_type" placeholder="请选择类型" @change="changeType">
            <el-option label="图片" value="image" />
            <el-option label="视频" value="video" />
          </el-select>
          <div class="addImageVideo">
            <template v-if="edit.media_type == 'image'">
              <img
                v-if="edit.media_url"
                :src="edit.media_url"
                class="banner-uploader"
                @click="handleImgChange('media_url')"
              >
              <div v-else class="banner-uploader" @click="handleImgChange('media_url')">
                <i class="iconfont icon-camera" />
                上传图片
              </div>
            </template>
            <template v-else>
              <videoPicker :data="itemVideo" :multiple="false" @change="pickVideo" />
              <el-button v-if="itemVideo.media_id" type="text" @click="deleteVideo">
                删除
              </el-button>
            </template>
          </div>
        </el-form-item>
      </el-form>
      <div class="section-footer with-border content-center" style="width: 100%">
        <el-button type="primary" @click="sumbit"> 保存 </el-button>
      </div>
    </el-dialog>
    <imgPicker
      :dialog-visible="imgsVisible"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="
        () => {
          imgsVisible = false
        }
      "
    />
  </div>
</template>

<script>
import util from '@/common/js/util'
import imgPicker from '@/components/imageselect'
import videoPicker from '@/components/videoselect'

import {
  getShopScreenAd,
  delShopScreenAd,
  putShopScreenAd,
  postShopScreenAd
} from '@/api/shopScreen'
import { getDistributorList } from '@/api/marketing'

import DataPlaceholder from '@/components/element/dataPlaceholder'

export default {
  provide() {
    return {
      refresh: this.fetchList
    }
  },
  components: {
    dataPlaceholder: DataPlaceholder,
    imgPicker,
    videoPicker
  },
  data() {
    return {
      loading: false,
      showDialog: false,
      imgsVisible: false,
      isGetImage: false,
      searchTitle: '',
      edit: {
        media_type: 'image'
      },
      itemVideo: {},
      distributorList: [],
      editType: '',
      list: [],
      showPlaceholder: false,
      params: {
        page: 1,
        pageSize: 20
      },
      total_count: 0
    }
  },
  mounted() {
    this.fetchList()
    this.getDistributor()
  },
  methods: {
    getDistributor() {
      var params = { page: 1, pageSize: 500 }
      getDistributorList(params).then(response => {
        if (response.data.data.list) {
          this.distributorList = response.data.data.list
        }
      })
    },
    articleAdd(id) {
      this.showDialog = true
      //   this.imgsVisible = true
    },
    handleImgChange(type) {
      // 图片选择器绑定事件
      this.imgsVisible = true
      this.isGetImage = true
      this.editType = type
    },
    pickImg(data) {
      this.edit[this.editType] = data.url
      this.imgsVisible = false
    },
    pickVideo(data, type) {
      this.itemVideo = data
      this.edit.media_url = data.url
    },
    deleteVideo() {
      this.itemVideo = {}
      this.edit.media_url = data.url
    },
    changeType() {
      this.edit.media_url = ''
      this.itemVideo = {}
    },
    sumbit() {
      let obj = JSON.parse(JSON.stringify(this.edit))
      postShopScreenAd(obj).then(res => {
        this.showDialog = false
        this.edit = {}
        this.fetchList()
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      })
    },
    articleDelete(id) {
      const _self = this
      this.$confirm('确认删除当前选项？').then(_ => {
        delShopScreenAd(id).then(res => {
          if (res.data.data.status) {
            this.$message({
              message: '删除成功',
              type: 'success',
              onClose() {
                _self.fetchList()
              }
            })
          }
        })
      })
    },

    handleSort(id) {
      const _self = this
      let index = this.list.findIndex(item => item.id === id)
      this.list[index].visible = false
      let param = {
        inputdata: [
          {
            id: id,
            sort: this.list[index].sort
          }
        ]
      }
      putShopScreenAd(param).then(res => {
        _self.fetchList()
      })
    },
    handlePublish(id, status) {
      let msg = ''
      if (status) {
        msg = '确定撤吗？'
      } else {
        msg = '确定发布吗？'
      }
      const _self = this
      this.$confirm(msg)
        .then(res => {
          let param = {
            inputdata: [
              {
                id: id,
                release_status: !status
              }
            ]
          }
          putShopScreenAd(param).then(res => {
            _self.fetchList()
          })
        })
        .catch(() => {
          return
        })
    },
    pageChange(val) {
      this.params.page = val
      this.fetchList()
    },
    fetchList() {
      this.loading = true
      getShopScreenAd(this.params).then(res => {
        if (res.data.data.total_count === 0) {
          this.showPlaceholder = true
        }

        this.list = res.data.data.list
        this.total_count = res.data.data.total_count
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
.articles {
  height: 500px;
  .article-item {
    position: relative;
    margin-bottom: 10px;
    border-radius: 5px;
    background: #fff;
    overflow: hidden;
    border: 1px solid #efefef;
    .copy-btn {
      position: relative;
      font-size: 12px;
      cursor: pointer;
      [class^='copy-link'] {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        visibility: hidden;
      }
      .iconfont {
        font-size: 10px;
        line-height: 1;
      }
    }
    .thumbnail {
      height: 160px;
      background: #efefef;
    }
    .caption {
      height: 55px;
      padding: 10px;
      overflow: hidden;
      .title {
        display: -webkit-box;
        margin-bottom: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        line-clamp: 2;
        box-orient: vertical;
        line-height: 1.3;
        height: 35px;
        font-size: 14px;
        color: #666;
        font-weight: normal;
      }
      .update-time {
        font-size: 11px;
        color: #ccc;
        text-align: right;
      }
      .attention-count {
        padding-right: 15px;
        font-size: 11px;
        color: #999;
        .iconfont {
          margin-right: 5px;
          font-size: 10px;
          vertical-align: middle;
          line-height: 1;
          color: #ccc;
        }
      }
    }
    .footer {
      display: flex;
      height: 35px;
      border-top: 1px solid #f8f8f8;
      .footer-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 12px;
        color: #999;
        &::after {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 1px;
          background: #f8f8f8;
          content: '';
        }
        &:last-child::after {
          content: none;
        }
        &:hover {
          color: $dominant_hue;
        }
        i {
          margin-right: 3px;
          vertical-align: middle;
          line-height: 1;
          font-size: 10px;
        }
      }
    }
  }
}
.addImageVideo {
  margin-top: 10px;
  // width: 300px;
  // display: inline-block;
  // vertical-align: top;
  // margin-left: 10px;
}
.banner-uploader {
  width: 200px;
}
</style>
