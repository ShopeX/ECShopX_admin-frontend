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
  <section v-if="name === 'slider'" class="section">
    <div class="section-header with-border">设置</div>
    <div class="section-body">
      <el-form label-width="100px">
        <template v-if="type == 'wxapp'">
          <el-form-item label="标题">
            <el-input v-model="base.title" />
          </el-form-item>
          <el-form-item label="副标题">
            <el-input v-model="base.subtitle" />
          </el-form-item>
          <el-form-item label="字体颜色">
            <el-color-picker v-model="base.WordColor" />
          </el-form-item>

          <el-form-item label="轮播时间">
            <el-input-number v-model="config.interval" :min="3000" :step="1000" label="" />
          </el-form-item>
          <el-form-item label="组件间距">
            <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
          <el-form-item label="圆角图片">
            <el-switch v-model="config.rounded" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
          <el-form-item label="图片间隔">
            <el-switch v-model="config.padded" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
          <el-form-item label="指示点样式">
            <el-switch
              v-model="config.dot"
              active-text="点"
              inactive-text="数字"
              active-color="#27cc6a"
              inactive-color="#ffa100"
            />
          </el-form-item>
          <el-form-item label="指示点覆盖">
            <el-switch v-model="config.dotCover" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
          <el-form-item label="指示点位置">
            <el-radio-group v-model="config.dotLocation">
              <el-radio label="left"> 居左 </el-radio>
              <el-radio label="center"> 居中 </el-radio>
              <el-radio label="right"> 居右 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="指示点形状">
            <el-radio-group v-model="config.shape">
              <el-radio label="circle"> 圆形 </el-radio>
              <el-radio label="rectangle"> 长方型 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="指示点颜色">
            <el-radio-group v-model="config.dotColor">
              <el-radio label="dark"> 深色 </el-radio>
              <el-radio label="light"> 亮色 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="轮播项间距">
            <el-switch v-model="config.padded" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
          <el-form-item label="开启图片描述">
            <el-switch v-model="config.content" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
        </template>

        <el-form-item label="轮播项">
          <div v-for="(item, index) in data" :key="index" class="setting-item slider">
            <div class="setting-remove" @click="removeItem(index)">
              <i class="iconfont icon-trash-alt" />
            </div>
            <template v-if="type === 'wxapp'">
              <div v-if="item.imgUrl" class="upload-box">
                <img
                  :src="wximageurl + item.imgUrl"
                  class="banner-uploader"
                  @click="handleImgChange(index)"
                >
              </div>
              <div v-else class="banner-uploader" @click="handleImgChange(index)">
                <i class="iconfont icon-camera" />
                上传图片
              </div>
              <div class="uploader-setting">
                <el-input
                  v-if="config.content"
                  v-model="item.content"
                  type="textarea"
                  placeholder="文字描述"
                />
                <el-form-item label="标题">
                  <el-input v-model="item.mainTitle" />
                </el-form-item>
                <el-form-item label="副标题">
                  <el-input v-model="item.subtitle" />
                </el-form-item>
                <el-form-item v-if="item.template != 'four'" label="副标题2">
                  <el-input v-model="item.subtitleTow" />
                </el-form-item>
                <el-form-item label="按钮">
                  <el-input v-model="item.button" />
                </el-form-item>
                <el-form-item label="标题模板选择">
                  <el-radio-group v-model="item.template">
                    <el-radio label="one"> 模板一 </el-radio>
                    <el-radio label="two"> 模板二 </el-radio>
                    <el-radio label="three"> 模板三 </el-radio>
                    <el-radio label="four"> 模板四 </el-radio>
                  </el-radio-group>
                </el-form-item>
                <!-- <el-form-item label="字体颜色">
                  <el-color-picker v-model="item.WordColor"></el-color-picker>
                </el-form-item> -->

                <div class="goods-select" @click="handleGoodsChange(index)">
                  <div v-if="item.id" class="link-content">
                    <template v-if="item.linkPage === 'goods'"> 商品： </template>
                    <template v-if="item.linkPage === 'category'"> 分类： </template>
                    <template v-if="item.linkPage === 'article'"> 文章： </template>
                    <template v-if="item.linkPage === 'planting'"> 软文： </template>
                    <template v-if="item.linkPage === 'link'"> 页面： </template>
                    <template v-if="item.linkPage === 'marketing'"> 营销： </template>
                    {{ item.title }}
                  </div>
                  <div v-else class="content-center">
                    <i class="iconfont icon-link" @click="handleGoodsChange(index)" />设置路径
                  </div>
                </div>
              </div>
            </template>
            <template v-if="type === 'pc'">
              <div v-if="item.url" class="upload-box">
                <img :src="item.url" class="banner-uploader" @click="handleImgChange(index)">
              </div>
              <div v-else class="banner-uploader" @click="handleImgChange(index)">
                <i class="iconfont icon-camera" />
                上传图片
              </div>
              <div class="uploader-setting">
                <el-input
                  v-if="config.content"
                  v-model="item.content"
                  type="textarea"
                  placeholder="文字描述"
                />
                <div class="goods-select" @click="handleGoodsChange(index)">
                  <div v-if="item.goodsId" class="link-content">商品：{{ item.title }}</div>
                  <div v-else class="content-center">
                    <i class="iconfont icon-link" @click="handleGoodsChange(index)" />设置路径
                  </div>
                </div>
              </div>
            </template>
          </div>
        </el-form-item>
      </el-form>
      <div class="content-center">
        <div class="frm-tips">只能上传jpg/png文件，且不超过2M （建议尺寸：375px * 200px）</div>
        <el-button
          :disabled="data.length >= 5"
          type="default"
          class="iconfont icon-plus-circle banner-button-uploader"
          @click="addItem"
        >
          添加轮播图
        </el-button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    res: {
      type: Object,
      default: {}
    },
    type: {
      type: String, // pc 传'pc'即可
      default: 'wxapp'
    }
  },
  data() {
    return {
      name: '',
      base: {},
      config: {},
      data: []
    }
  },
  watch: {
    res: {
      deep: true,
      immediate: true,
      handler(value) {
        if (value) {
          this.setData(value)
        }
      }
    }
  },
  methods: {
    setData(val) {
      this.name = val.name
      this.base = val.base
      this.config = val.config
      this.data = val.data
    },
    removeItem(index) {
      this.data.splice(index, 1)
    },
    addItem() {
      if (!this.data) {
        this.data = []
      }
      let item = {
        imgUrl: '',
        linkPage: '',
        content: '',
        id: '',
        template: 'one'
      }
      if (this.data.length > 4) {
        this.$message({
          message: '轮播图最多添加5个图片',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        this.data.push(item)
      }
    },
    handleImgChange(index) {
      this.$emit('bindImgs', index)
    },
    handleGoodsChange(index) {
      this.$emit('bindLinks', index)
    }
  }
}
</script>
<style scoped lang="scss">
.section {
  height: 100%;
  overflow-y: scroll;
}
.upload-box {
  height: 100px;
  width: 100px;
  border: 1px dashed #ccc;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-content: center;
  margin-bottom: 10px;
  img {
    width: 100%;
  }
}
</style>
