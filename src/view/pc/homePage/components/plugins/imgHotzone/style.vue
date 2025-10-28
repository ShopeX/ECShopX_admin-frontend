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
  <section class="section">
    <div class="section-header with-border">热区图</div>
    <div class="section-body">
      <el-form label-position="top">
        <el-form-item label="标题">
          <el-input v-model="base.title" />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="base.subtitle" />
        </el-form-item>
        <el-form-item label="组件间距">
          <el-input v-model="base.padded" type="number" />
        </el-form-item>
        <el-form-item label="全屏宽">
          <el-switch v-model="config.fullscreen" />
        </el-form-item>
        <el-form-item label="展示图">
          <div class="setting-item slider">
            <img
              v-if="config.imgUrl"
              :src="config.imgUrl"
              class="banner-uploader"
              @click="handleImgChange"
            >
            <div v-else class="banner-uploader" @click="handleImgChange">
              <i class="iconfont icon-camera" />上传图片
            </div>
          </div>
        </el-form-item>
        <el-form-item label="热区">
          <hotzone
            v-if="config.imgUrl"
            class="hotzone"
            :image="config.imgUrl"
            :zones-init="data"
            @add="handleAdd"
            @change="handleChange"
            @remove="handleRemove"
          />
          <template v-if="data.length > 0">
            <div v-for="(item, index) in data" class="setting-item slider">
              <div class="uploader-setting">
                <div class="goods-select" @click="handleGoodsChange(index)">
                  <div v-if="item.id" class="link-content">
                    <template v-if="item.linkPage === 'goods'"> 商品： </template>
                    <template v-if="item.linkPage === 'category'"> 分类： </template>
                    <template v-if="item.linkPage === 'article'"> 文章： </template>
                    <!--template v-if="item.linkPage === 'planting'">种草：</template-->
                    <template v-if="item.linkPage === 'link'"> 页面： </template>
                    <template v-if="item.linkPage === 'marketing'"> 营销： </template>
                    <template v-if="item.linkPage === 'custom_page'"> 自定义页： </template>
                    {{ item.title }}
                  </div>
                  <div v-else class="content-center">
                    <i class="iconfont icon-link" @click="handleGoodsChange(index)" />设置路径
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-form-item>
      </el-form>
    </div>
    <imgPicker
      :dialog-visible="imgsVisible"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeimgsVisible"
    />
    <linkSetter
      :links="linksArr"
      :visible="linksVisible"
      :show_article="false"
      :show_planting="false"
      :show_page="false"
      :show_marketing="false"
      :show_store="false"
      @setLink="setLink"
      @closeDialog="closeDialog"
    />
  </section>
</template>
<script>
import hotzone from 'vue-hotzone'
import imgPicker from '@/components/imageselect'
import linkSetter from '@/components/template_links'
export default {
  name: 'ImgHotzoneStyle',
  components: {
    hotzone,
    imgPicker,
    linkSetter
  },
  props: {
    res: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {
      name: '',
      base: {},
      config: {},
      data: [],
      isGetImage: false,
      imgsVisible: false,
      linksArr: ['goods', 'store', 'custom_page', 'category'],
      linksVisible: false, // 路径设置组件
      cur_index: null,
      zonesList: []
    }
  },
  watch: {
    res: {
      deep: true,
      handler(value) {
        if (value) {
          this.setData(value)
        }
      }
    }
  },
  mounted() {
    this.setData(this.res)
  },
  methods: {
    setData(val) {
      this.name = val.name
      this.base = val.base
      this.config = val.config
      this.data = val.data
    },
    handleAdd(zone) {
      let item = {
        linkPage: '',
        title: '',
        id: ''
      }
      this.data.push(item)
    },
    handleChange(zone) {
      setTimeout(() => {
        zone.forEach((item, index) => {
          if (item.leftPer) {
            let obj = {
              heightPer: item.heightPer,
              leftPer: item.leftPer,
              topPer: item.topPer,
              widthPer: item.widthPer
            }
            Object.assign(this.data[index], obj)
          }
        })
      }, 500)
      //   console.log('handleChange', this.t_data.data)
    },
    handleRemove(index) {
      this.data.splice(index, 1)
    },
    // 图片选择器绑定事件
    handleImgChange(index) {
      this.imgsVisible = true
      this.isGetImage = true
      //   if (typeof index !== undefined) {
      //     this.cur_index = index
      //   }
    },
    handleGoodsChange(index) {
      this.linksVisible = true
      this.cur_index = index
    },
    setLink(data, type) {
      let obj = Object.assign(data, { linkPage: type })
      Object.assign(this.data[this.cur_index], obj)
    },
    pickImg(data) {
      this.config.imgUrl = data.url
      this.imgsVisible = false
    },
    closeimgsVisible() {
      this.imgsVisible = false
    },
    closeDialog() {
      this.linksVisible = false
    }
  }
}
</script>
<style scoped lang="scss">
.hotzone {
  max-width: 500px;
  margin-bottom: 10px;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
}
.uploader-setting {
  padding: 0;
}
</style>
