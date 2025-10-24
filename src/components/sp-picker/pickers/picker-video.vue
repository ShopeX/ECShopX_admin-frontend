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
<style lang="scss">
.picker-video {
  &-hd {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    .btn-actions {
      display: flex;
    }
    .btn-upload {
      margin-right: 10px;
    }
  }
  &-bd {
    display: flex;
    padding: 0 0 10px 10px;
    .lf-container {
      width: 220px;
      background: #f5f5f5;
      height: 500px;
      margin-right: 8px;
      padding: 8px;
    }
    .rg-container {
      flex: 1;
    }
  }
  .catgory-item {
    height: 30px;
    line-height: 30px;
    padding: 0 6px;
    &:hover {
      color: rgb(255, 255, 255);
      background-color: rgba(0, 0, 0, 0.4);
    }
    &.active {
      color: rgb(255, 255, 255);
      background-color: var(--primary);
    }
  }
  .image-item {
    &-wrap {
      display: inline-block;
      position: relative;
      margin-right: 8px;
      margin-bottom: 8px;
      font-size: 14px;
      vertical-align: middle;
      cursor: pointer;
    }

    // display: flex;
    // align-items: flex-end;
    width: 160px;
    height: 90px;
    position: relative;
    box-sizing: border-box;
    .image-modal {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      &:hover {
        .image-meta {
          display: block;
        }
        .icon-link {
          display: block;
        }
      }
    }

    .image-meta {
      height: 28px;
      width: 100%;
      line-height: 28px;
      text-align: center;
      color: rgb(255, 255, 255);
      background-color: rgba(0, 0, 0, 0.4);
      display: none;
    }
    .icon-link {
      position: absolute;
      top: 2px;
      left: 4px;
      display: none;
      color: #666;
    }
  }
  .image-title-wrap {
    width: 160px;
    &__title {
      font-size: 12px;
      @include text-overflow();
    }
  }
  .el-pagination {
    margin-top: 8px;
    text-align: right;
  }
  .image-box-selected {
    position: absolute;
    box-sizing: border-box;
    top: 0;
    left: 0;
    width: 160px;
    height: 90px;
    border: 2px solid var(--primary);
    color: #fff;
    overflow: hidden;
    pointer-events: none;
    &__right-angle {
      position: absolute;
      top: -21px;
      right: -21px;
      width: 42px;
      height: 42px;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
      background: var(--primary);
    }
    &__text {
      position: absolute;
      top: -2px;
      right: 3px;
    }
    .icon-check {
      position: relative;
      top: -2px;
      right: -2px;
    }
  }
  .image-list {
    height: 452px;
  }
  .cropper-container {
    width: 498px;
    height: 498px;
    position: relative;
    .cropper-actions {
      position: absolute;
      bottom: 0;
      left: 10px;
      .iconfont {
        font-size: 18px;
        color: #fff;
        margin-right: 6px;
      }
      .icon-search-minus,
      .icon-search-plus {
        font-size: 19px;
      }
    }
  }
  .picker-video-player {
    .vjs-big-play-button {
      display: none;
    }
  }
}
</style>
<template>
  <div class="picker-video">
    <div class="picker-video-hd">
      <div class="btn-actions">
        <el-upload
          class="btn-upload"
          action=""
          accept="video/mp4,.mov"
          :show-file-list="false"
          :http-request="handleUpload"
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
          :on-error="uploadError"
        >
          <el-button>上传视频</el-button>
        </el-upload>
      </div>
      <!-- <div>
        <el-input size="small" placeholder="请输入图片名称" suffix-icon="el-icon-search" />
      </div> -->
    </div>
    <div class="picker-video-bd">
      <div class="rg-container">
        <div v-loading="loading" class="image-list">
          <div
            v-for="(item, index) in list"
            :key="`image-item-wrap__${index}`"
            class="image-item-wrap"
          >
            <div class="image-item" :style="{ color: '#fff' }">
              <video-player
                class="picker-video-player"
                :options="{
                  // preload: 'auto',
                  aspectRatio: '16:9',
                  fluid: true,
                  sources: [
                    {
                      type: item.image_type,
                      src: item.url
                    }
                  ],
                  notSupportedMessage: '此视频暂无法播放，请稍后再试',
                  controlBar: false
                }"
              />
              <div class="image-modal" @click="handleClickItem(item)">
                <i class="iconfont icon-link" @click.stop="handleCopy(item.url)" />
              </div>
            </div>
            <div class="image-title-wrap" :title="item.image_name">
              <p class="image-title-wrap__title">
                {{ item.image_name }}
              </p>
            </div>
            <div
              v-show="multiple ? isActive(item) > -1 : isActive(item)"
              class="image-box-selected"
            >
              <div class="image-box-selected__right-angle" />
              <div class="image-box-selected__text">
                <span v-show="multiple">{{ isActive(item) + 1 }}</span>
                <i v-show="!multiple" class="iconfont icon-check" />
              </div>
            </div>
          </div>
          <el-empty v-if="list.length == 0" description="暂无数据" />
        </div>
        <el-pagination
          layout="total, prev, pager, next"
          :current-page.sync="pageCur"
          :page-size="pageSize"
          :total="pageCount"
          @current-change="goPage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UploadUtil from '@/utils/uploadUtil'
import { isObject, isArray } from '@/utils'
import BasePicker from './base'
import PageMixin from '../mixins/page'
export default {
  name: 'PickerVideo',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '我的视频'
  },
  props: ['value'],
  data() {
    const { multiple = false, data } = this.value
    return {
      pageSize: 20,
      multiple,
      list: [],
      selected: data,
      catgoryList: [],
      selectCatgory: -1,
      localpostData: {
        token: '',
        key: '',
        fname: ''
      },
      option: {
        img: '',
        size: 1,
        autoCrop: true
      }
    }
  },
  mounted() {
    this.nextPage()
  },
  methods: {
    isActive({ image_id, url }) {
      if (this.multiple) {
        return isArray(this.selected) ? this.selected.findIndex(item => item.url == url) : false
      } else {
        // return this.selected ? this.selected.image_id == image_id : false
        if (this.selected) {
          const handleRegExp = str => {
            const regExp = /^(http|https):\/\/(.*)/g
            const [p1, p2, p3] = regExp.exec(str)
            return p3
          }
          if (isObject(this.selected)) {
            return handleRegExp(this.selected.url) == handleRegExp(url)
          } else {
            return handleRegExp(this.selected) == handleRegExp(url)
          }
        } else {
          return false
        }
      }
    },
    async fetch({ page_no, page_size }) {
      let params = {
        storage: 'videos',
        page: page_no,
        pageSize: page_size
      }
      const { list, total_count } = await this.$api.picker.getImageList(params)

      // const demolist = [
      //   {
      //     image_name: 'demo1.m3u8',
      //     image_type: 'application/x-mpegURL',
      //     url: 'https://d2zihajmogu5jn.cloudfront.net/elephantsdream/hls/ed_hd.m3u8'
      //   }
      //   // {
      //   //   image_name: 'demo2.mp4',
      //   //   image_type: 'video/mp4',
      //   //   url: 'https://vjs.zencdn.net/v/oceans.mp4'
      //   // },
      //   // {
      //   //   image_name: 'demo3.flv',
      //   //   image_type: 'video/x-flv',
      //   //   url: 'http://fms.cntv.lxdns.com/live/flv/channel96.flv'
      //   // }
      // ]
      this.list = list
      return { count: total_count }
    },
    handleClickItem(item) {
      const { image_id, url } = item
      const _item = {
        image_id,
        url
      }
      if (this.multiple) {
        const fdx = this.selected.findIndex(s => s.image_id == item.image_id)
        if (fdx > -1) {
          this.selected.splice(fdx, 1)
        } else {
          // 默认最多可选20
          const { num = 20 } = this.value
          if (this.selected.length < num) {
            this.selected.push(_item)
          } else {
            return
          }
        }
      } else {
        this.selected = _item
      }
      this.updateVal(this.selected)
    },
    beforeAvatarUpload(file) {
      const isMP4 = file.type === 'video/mp4'
      const isLt5M = file.size / 1024 / 1024 < 50
      if (!isMP4) {
        this.$message.error('上传视频只能是 mp4 格式!')
        return
      }
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 50MB!')
        return
      }
      this.localpostData.fname = file.name
    },
    async handleAvatarSuccess(res, file) {
      const uploadParams = {
        image_cat_id: 2, //图片分类必填,必须为整数
        image_name: file.name, //图片名称必填,不能超过50个字符
        brief: '视频本地上传',
        image_url: res.key, //图片链接必填
        image_type: file.raw.type, //图片分类长度不能超过20个字符
        storage: 'videos' //图片id必填
      }
      await this.$api.qiniu.uploadQiniuPic(uploadParams)
      this.$message.success('上传成功')
      this.refresh(true)
    },
    // 自定义上传
    handleUpload: function (e) {
      const upload = new UploadUtil('videos')
      // 上传
      upload
        .uploadImg(e.file, e.file.name)
        .then(
          res => e.onSuccess(res),
          err => e.onError(err)
        )
        .catch(err => e.onError(err))
    },
    // 上传错误回调
    uploadError: function (e) {
      console.error(e)
    },
    async handleCopy(url) {
      await this.$copyText(url)
      this.$notify.success({
        message: '链接复制成功',
        showClose: true
      })
    }
  }
}
</script>
