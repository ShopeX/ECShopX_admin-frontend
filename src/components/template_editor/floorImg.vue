<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <section v-if="name === 'floorImg' || name === 'banner'" class="section">
    <div class="section-header with-border">{{ $t('7def7648.e366cc') }}</div>
    <div class="section-body">
      <el-form label-width="100px">
        <template v-if="type == 'wxapp'">
          <el-form-item :label="$t('7def7648.32c65d')">
            <el-input v-model="base.title" />
          </el-form-item>
          <el-form-item :label="$t('7def7648.72cf37')">
            <el-input v-model="base.subtitle" />
          </el-form-item>
          <el-form-item :label="$t('7def7648.4707ba')">
            <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
          <el-form-item :label="$t('7def7648.690660')">
            <el-color-picker v-model="base.WordColor" />
          </el-form-item>
          <el-form-item :label="$t('7def7648.b7e88c')">
            <el-switch v-model="base.openBackImg" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
          <template v-if="base.openBackImg">
            <el-form-item :label="$t('7def7648.d74849')">
              <img
                v-if="base.backgroundImg"
                :src="wximageurl + base.backgroundImg"
                class="banner-uploader"
                @click="handleImgChange('backImg')"
              />
              <div v-else class="banner-uploader" @click="handleImgChange('backImg')">
                <i class="el-icon-camera" />
                {{ $t('7def7648.ce6855') }}
              </div>
            </el-form-item>
          </template>
        </template>
        <el-form-item :label="$t('7def7648.d98b3f')">
          <div v-for="(item, index) in data" :key="index" class="setting-item slider">
            <div class="setting-remove" @click="removeItem(index)">
              <i class="el-icon-delete" />
            </div>
            <template v-if="type === 'wxapp'">
              <el-form-item label="">
                <img
                  v-if="item.imgUrl"
                  :src="wximageurl + item.imgUrl"
                  class="banner-uploader"
                  @click="handleImgChange(index)"
                />
                <div v-else class="banner-uploader" @click="handleImgChange(index)">
                  <i class="el-icon-camera" />
                  {{ $t('7def7648.ce6855') }}
                </div>
              </el-form-item>
              <el-form-item label="">
                <div class="uploader-setting">
                  <el-form-item :label="$t('7def7648.c6c745')">
                    <el-input v-model="item.ImgTitle" />
                  </el-form-item>
                  <!-- <el-form-item label="字体颜色">
                    <el-color-picker v-model="item.WordColor"></el-color-picker>
                  </el-form-item> -->
                </div>
              </el-form-item>
              <el-form-item label="">
                <div class="goods-select" @click="handleGoodsChange(index)">
                  <div v-if="item.id" class="link-content">
                    <template v-if="item.linkPage === 'goods'">
                      {{ $t('7def7648.10fe9c') }}
                    </template>
                    <template v-if="item.linkPage === 'category'">
                      {{ $t('7def7648.e7d2e8') }}
                    </template>
                    <template v-if="item.linkPage === 'article'">
                      {{ $t('7def7648.8cb9b8') }}
                    </template>
                    <template v-if="item.linkPage === 'planting'">
                      {{ $t('7def7648.9dcd91') }}
                    </template>
                    <template v-if="item.linkPage === 'link'">
                      {{ $t('7def7648.ffd741') }}
                    </template>
                    <template v-if="item.linkPage === 'marketing'">
                      {{ $t('7def7648.c78a2f') }}
                    </template>
                    {{ item.title }}
                  </div>
                  <div v-else class="content-center">
                    <i class="el-icon-link" @click="handleGoodsChange(index)" />{{
                      $t('7def7648.4f2c29')
                    }}
                  </div>
                </div>
              </el-form-item>
            </template>
          </div>
        </el-form-item>
      </el-form>
      <div class="content-center">
        <div v-if="base.openBackImg" class="frm-tips">
          {{ $t('7def7648.c9571f') }}
        </div>
        <div v-else class="frm-tips">
          {{ $t('7def7648.31897e') }}
        </div>
        <el-button
          type="default"
          class="iconfont icon-plus-circle banner-button-uploader"
          @click="addItem"
        >
          {{ $t('7def7648.b89fb3') }}
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
      data: []
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
      this.data = val.data
    },
    handleImgChange(index) {
      this.$emit('bindImgs', index)
    },
    addItem() {
      let item = {
        imgUrl: '',
        title: '',
        id: ''
      }
      this.data.push(item)
    },
    removeItem(index) {
      this.data.splice(index, 1)
    },
    handleGoodsChange(index) {
      this.$emit('bindLinks', index)
    }
  }
}
</script>
