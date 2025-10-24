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
    <el-dialog
      title="选择素材"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      :before-close="cancelAction"
    >
      <div class="appmsg_list media_dialog">
        <div
          v-for="(item, index) in newsList"
          class="appmsg_col"
          :class="{ checked: i === index }"
          @click="selcteItem(item, index)"
        >
          <div
            class="appmsg msg-item has-first-cover"
            :class="{ multi: item.content.news_item[1], single: !item.content.news_item[1] }"
          >
            <div class="msg-content">
              <div class="msg-info">
                <span>更新于 {{ item.update_time | datetime }}</span>
              </div>
              <div class="sub-msg-item" :class="{ coverMsgItem: item.content.news_item[1] }">
                <h4 class="msg-title">
                  <a>{{ item.content.news_item[0].title }}</a>
                </h4>
                <div
                  class="msg-thumb-wrap"
                  :style="{
                    backgroundImage: 'url(' + wximageurl + item.content.news_item[0].thumb_url + ')'
                  }"
                />
                <a :href="item.content.news_item[0].url" class="edit-mask preview-mask">
                  <div class="edit-mask-content">预览文章</div>
                </a>
              </div>
              <p v-if="!item.content.news_item[1]" class="msg-desc">
                {{ item.content.news_item[0].digest }}
              </p>
              <div v-for="n in item.content.news_item.length - 1" :key="">
                <div v-if="item.content.news_item[1]" class="article-msg-item has-cover clearfix">
                  <div
                    class="msg-thumb-wrap"
                    :style="{
                      backgroundImage:
                        'url(' + wximageurl + item.content.news_item[n].thumb_url + ')'
                    }"
                  />
                  <h4 class="msg-title">
                    <a>{{ item.content.news_item[n].title }}</a>
                  </h4>
                  <a :href="item.content.news_item[n].url" class="edit-mask preview-mask">
                    <div class="edit-mask-content">预览文章</div>
                  </a>
                </div>
              </div>
            </div>
            <div class="preview-mask-wrap appmsg_mask">
              <i class="el-icon-check" />
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAction"> 取 消 </el-button>
        <el-button type="primary" @click="saveAction"> 确 定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getWechatMaterial } from '../../api/wechat'
export default {
  props: ['scVisible', 'scStatus'],
  data() {
    return {
      i: -1,
      selectedItem: {},
      selectedHtml: '',
      newsList: []
    }
  },
  computed: {
    showDialog: {
      get: function () {
        return this.scVisible
      },
      set: function (v) {
        this.scVisible = v
      }
    }
  },
  watch: {
    scStatus(newV) {
      if (newV) {
        let data = { type: 'news' }
        this.getNewsList(data)
      }
    }
  },
  methods: {
    selcteItem(item, index) {
      this.i = index
      this.selectedItem = item
    },
    saveAction() {
      if (document.getElementsByClassName('checked').length > 0) {
        this.selectedHtml = document.getElementsByClassName('checked')[0].innerHTML
      }
      this.$emit('chooseSC', { selectedItem: this.selectedItem, html: this.selectedHtml })
    },
    cancelAction() {
      this.$emit('closeSCDialog')
    },
    getNewsList(data) {
      if (this.scStatus) {
        getWechatMaterial(data).then(response => {
          this.newsList = response.data.data.item
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
.msg-list {
  margin-top: 20px;
}
.sub-msg-item:hover,
.article-msg-item:hover {
  .preview-mask {
    display: flex;
  }
}
.msg-operate {
  background-color: #f4f4f4;
  border-top: 1px solid #e7e7eb;
  > div {
    height: 44px;
    line-height: 44px;
    text-align: center;
    cursor: pointer;
    font-size: 18px;
    a {
      display: block;
      border-right: 1px solid #e7e7eb;
    }
    i {
      color: #999;
    }
    i:hover {
      color: #333;
    }
  }
}
</style>
