<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <section v-if="name === 'slider'" class="section">
    <div class="section-header with-border">{{ $t('5d2e0269.e366cc') }}</div>
    <div class="section-body">
      <el-form label-width="100px">
        <template v-if="type == 'wxapp'">
          <el-form-item :label="$t('5d2e0269.32c65d')">
            <el-input v-model="base.title" />
          </el-form-item>
          <el-form-item :label="$t('5d2e0269.72cf37')">
            <el-input v-model="base.subtitle" />
          </el-form-item>
          <el-form-item :label="$t('5d2e0269.690660')">
            <el-color-picker v-model="base.WordColor" />
          </el-form-item>

          <el-form-item :label="$t('5d2e0269.8695d8')">
            <el-input-number v-model="config.interval" :min="3000" :step="1000" label="" />
          </el-form-item>
          <el-form-item :label="$t('5d2e0269.4707ba')">
            <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
          <el-form-item :label="$t('5d2e0269.2e70e6')">
            <el-switch v-model="config.rounded" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
          <el-form-item :label="$t('5d2e0269.822ac9')">
            <el-switch v-model="config.padded" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
          <el-form-item :label="$t('5d2e0269.9a9056')">
            <el-switch
              v-model="config.dot"
              :active-text="$t('5d2e0269.be604f')"
              :inactive-text="$t('5d2e0269.55d479')"
              active-color="#27cc6a"
              inactive-color="#ffa100"
            />
          </el-form-item>
          <el-form-item :label="$t('5d2e0269.175553')">
            <el-switch v-model="config.dotCover" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
          <el-form-item :label="$t('5d2e0269.a8a94d')">
            <el-radio-group v-model="config.dotLocation">
              <el-radio label="left">{{ $t('5d2e0269.316a63') }}</el-radio>
              <el-radio label="center">{{ $t('5d2e0269.0bbc2e') }}</el-radio>
              <el-radio label="right">{{ $t('5d2e0269.e2aaec') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('5d2e0269.11333d')">
            <el-radio-group v-model="config.shape">
              <el-radio label="circle">{{ $t('5d2e0269.2db0fc') }}</el-radio>
              <el-radio label="rectangle">{{ $t('5d2e0269.2fce58') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('5d2e0269.14db62')">
            <el-radio-group v-model="config.dotColor">
              <el-radio label="dark">{{ $t('5d2e0269.41e8e8') }}</el-radio>
              <el-radio label="light">{{ $t('5d2e0269.a32b3b') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('5d2e0269.817dc9')">
            <el-switch v-model="config.padded" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
          <el-form-item :label="$t('5d2e0269.774334')">
            <el-switch v-model="config.content" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
        </template>

        <el-form-item :label="$t('5d2e0269.3db933')">
          <div v-for="(item, index) in data" :key="index" class="setting-item slider">
            <div class="setting-remove" @click="removeItem(index)">
              <i class="el-icon-delete" />
            </div>
            <template v-if="type === 'wxapp'">
              <div v-if="item.imgUrl" class="upload-box">
                <img
                  :src="wximageurl + item.imgUrl"
                  class="banner-uploader"
                  @click="handleImgChange(index)"
                />
              </div>
              <div v-else class="banner-uploader" @click="handleImgChange(index)">
                <i class="el-icon-camera" />
                {{ $t('5d2e0269.ce6855') }}
              </div>
              <div class="uploader-setting">
                <el-input
                  v-if="config.content"
                  v-model="item.content"
                  type="textarea"
                  :placeholder="$t('5d2e0269.191be5')"
                />
                <el-form-item :label="$t('5d2e0269.32c65d')">
                  <el-input v-model="item.mainTitle" />
                </el-form-item>
                <el-form-item :label="$t('5d2e0269.72cf37')">
                  <el-input v-model="item.subtitle" />
                </el-form-item>
                <el-form-item v-if="item.template != 'four'" :label="$t('5d2e0269.e8c9ac')">
                  <el-input v-model="item.subtitleTow" />
                </el-form-item>
                <el-form-item :label="$t('5d2e0269.fa9663')">
                  <el-input v-model="item.button" />
                </el-form-item>
                <el-form-item :label="$t('5d2e0269.df0ebf')">
                  <el-radio-group v-model="item.template">
                    <el-radio label="one">{{ $t('5d2e0269.411958') }}</el-radio>
                    <el-radio label="two">{{ $t('5d2e0269.c6b070') }}</el-radio>
                    <el-radio label="three">{{ $t('5d2e0269.a4daaf') }}</el-radio>
                    <el-radio label="four">{{ $t('5d2e0269.deb234') }}</el-radio>
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
                    <i class="el-icon-link" @click="handleGoodsChange(index)" />设置路径
                  </div>
                </div>
              </div>
            </template>
            <template v-if="type === 'pc'">
              <div v-if="item.url" class="upload-box">
                <img :src="item.url" class="banner-uploader" @click="handleImgChange(index)" />
              </div>
              <div v-else class="banner-uploader" @click="handleImgChange(index)">
                <i class="el-icon-camera" />
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
                    <i class="el-icon-link" @click="handleGoodsChange(index)" />设置路径
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
