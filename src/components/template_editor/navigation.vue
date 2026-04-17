<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <section v-if="name === 'navigation'" class="section">
    <div class="section-header with-border">{{ $t('a0725930.e366cc') }}</div>
    <div class="section-body">
      <el-form label-width="100px">
        <el-form-item :label="$t('a0725930.4707ba')">
          <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item :label="$t('a0725930.ae5ff3')">
          <div v-for="(item, index) in data" :key="index" class="setting-item">
            <div class="setting-remove" @click="removeItem(index)">
              <i class="el-icon-delete" />
            </div>

            <img
              v-if="item.imgUrl"
              :src="wximageurl + item.imgUrl"
              class="banner-uploader square"
              @click="handleImgChange(index)"
            />
            <div v-else class="banner-uploader square" @click="handleImgChange(index)">
              <div class="content-center">
                <i class="el-icon-camera" /><br />
                {{ $t('a0725930.ce6855') }}
              </div>
            </div>
            <div class="uploader-setting">
              <el-input v-model="item.content" :placeholder="$t('a0725930.8585af')" />
              <div class="goods-select" @click="handleGoodsChange(index)">
                <div v-if="item.id" class="link-content">
                  <template v-if="item.linkPage === 'goods'">
                    {{ $t('a0725930.10fe9c') }}
                  </template>
                  <template v-if="item.linkPage === 'category'">
                    {{ $t('a0725930.e7d2e8') }}
                  </template>
                  <template v-if="item.linkPage === 'article'">
                    {{ $t('a0725930.8cb9b8') }}
                  </template>
                  <template v-if="item.linkPage === 'planting'">
                    {{ $t('a0725930.9dcd91') }}
                  </template>
                  <template v-if="item.linkPage === 'link'"> {{ $t('a0725930.ffd741') }} </template>
                  <template v-if="item.linkPage === 'marketing'">
                    {{ $t('a0725930.c78a2f') }}
                  </template>
                  {{ item.title }}
                </div>
                <div v-else class="content-center">
                  <i class="el-icon-link" @click="handleGoodsChange(index)" />{{
                    $t('a0725930.4f2c29')
                  }}
                </div>
              </div>
            </div>
          </div>
          <div class="frm-tips">{{ $t('a0725930.d5a0d5') }}</div>
          <el-button
            :disabled="data.length >= 5"
            type="default"
            class="iconfont icon-plus-circle banner-button-uploader"
            @click="addItem"
          >
            {{ $t('a0725930.49d57f') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    res: {
      type: Object,
      default: () => {
        return {}
      }
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
        id: ''
      }
      if (this.data.length > 4) {
        this.$message({
          message: this.$t('a0725930.1d1897'),
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
