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
  <section v-if="name === 'goodsGrid'" class="section">
    <div class="section-header with-border">设置</div>
    <div class="section-body">
      <el-form label-width="100px" :label-position="usage == 'mobile' ? 'left' : 'top'">
        <el-form-item label="标题">
          <el-input v-model="base.title" type="text" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item v-if="show_subtitle" label="副标题">
          <el-input v-model="base.subtitle" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item v-if="show_space" label="组件间距">
          <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item v-if="usage == 'pc'" label="组件间距">
          <el-input v-model="base.padded" type="number" />
        </el-form-item>
        <el-form-item v-if="show_style" label="样式">
          <el-radio-group v-model="config.style" @change="styleChange">
            <el-radio :label="'grid'"> 一行两个 </el-radio>
            <el-radio :label="'grids'"> 一行三个 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="show_price" label="显示价格">
          <el-switch v-model="config.showPrice" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item v-if="config.style !== 'grids' && show_brand" label="显示品牌">
          <el-switch v-model="config.brand" active-color="#27cc6a" inactive-color="#efefef" />
          <span class="muted content-padded">显示品牌需配置商品品牌logo</span>
        </el-form-item>
        <el-form-item label="选择商品">
          <el-button
            v-if="!limit_num || items.length < limit_num"
            type="default"
            class="iconfont icon-cog banner-button-uploader"
            @click="setGoods"
          >
            编辑商品
          </el-button>
          <span
            v-if="!limit_num || items.length < limit_num"
            style="font-size: 12px; margin-left: 20px"
            >最多可选择100件商品；左侧实时预览内仅展示前50件；下方商品拖动以排序。</span
          >
          <el-row
            v-if="items.length > 0"
            :gutter="20"
            class="content-bottom-padded"
            style="margin-left: 0px"
          >
            <draggable
              v-if="items.length > 0"
              v-model="items"
              :options="dragItemsOptions"
              @end="onEnd"
            >
              <!-- <div class="setting-item item-selected" v-for="(item, index) in items" :key="index"> -->
              <el-col
                v-for="(item, index) in items"
                :key="index"
                :span="6"
                class="setting-item item-selected"
                @mouseover.native="mouseoverHandle(index)"
                @mouseleave.native="mouseleaveHandle()"
              >
                <img class="thumbnail" :src="wximageurl + item.imgUrl" alt="">
                <div class="title">
                  {{ item.title }}
                </div>
                <div
                  :class="[{ active: index == activeIndex }, ' settingRemove']"
                  @click="removeItem(index)"
                >
                  <i class="iconfont el-icon-error" />
                </div>
              </el-col>
            </draggable>
          </el-row>

          <span v-if="limit_num"> * 最多上传{{ limit_num }}个商品</span>
        </el-form-item>
        <el-form-item v-if="config.moreLink" label="设置更多链接">
          <div class="goods-select" @click="handleMoreLink">
            <div v-if="config.moreLink.title" class="link-content">
              <template v-if="config.moreLink.linkPage === 'goods'"> 商品： </template>
              <template v-if="config.moreLink.linkPage === 'category'"> 分类： </template>
              <template v-if="config.moreLink.linkPage === 'article'"> 文章： </template>
              <template v-if="config.moreLink.linkPage === 'planting'"> 软文： </template>
              <template v-if="config.moreLink.linkPage === 'link'"> 页面： </template>
              <template v-if="config.moreLink.linkPage === 'marketing'"> 营销： </template>
              <template v-if="config.moreLink.linkPage === 'custom_page'"> 自定义页面： </template>
              {{ config.moreLink.title }}
            </div>
            <div v-else class="content-center"><i class="iconfont icon-link" />设置路径</div>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  props: {
    res: {
      type: Object,
      default: {}
    },
    show_space: {
      type: Boolean,
      default: true
    },
    show_style: {
      type: Boolean,
      default: true
    },
    show_brand: {
      type: Boolean,
      default: true
    },
    show_subtitle: {
      type: Boolean,
      default: true
    },
    show_price: {
      type: Boolean,
      default: true
    },
    limit_num: {
      // 限制上传商品的数量
      type: Number,
      default: 0
    },
    usage: {
      type: String,
      default: 'mobile'
    }
  },
  data() {
    return {
      name: '',
      base: {},
      config: {},
      data: [],

      items: [],
      temp: '',
      dragItemsOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true
      },
      activeIndex: null
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
    mouseoverHandle(index) {
      this.activeIndex = index
    },
    mouseleaveHandle() {
      this.activeIndex = null
    },
    setData(val) {
      this.name = val.name
      this.base = val.base
      this.config = val.config
      this.data = val.data
      this.items = val.data
    },

    removeItem(index) {
      this.data.splice(index, 1)
    },
    setGoods() {
      this.$emit('bindGoods')
    },
    styleChange(val) {
      if (val === 'grids') {
        this.config.brand = false
      }
    },
    onEnd(evt) {
      this.temp = this.data[evt.oldIndex]
      this.data.splice(evt.oldIndex, 1)
      this.data.splice(evt.newIndex, 0, this.temp)
    },
    handleMoreLink() {
      this.$emit('bindLinks')
    }
  }
}
</script>

<style scoped lang="scss">
.style-icon {
  font-size: 20px;
  color: #aeaeae;
  vertical-align: middle;
}
.tab-list {
  padding-right: 30px;
  display: flex;
  flex-direction: column;
}

.upload-boxs {
  height: 100px;
  width: 100px;
  border: 1px dashed #ccc;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-content: center;
  img {
    width: 100%;
  }
}
</style>
