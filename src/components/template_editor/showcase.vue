<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <section v-if="name === 'showcase'" class="section">
    <div class="section-header with-border">{{ $t('b6e9f291.e366cc') }}</div>
    <div class="section-body">
      <el-form label-width="100px">
        <el-form-item :label="$t('b6e9f291.32c65d')">
          <el-input v-model="base.title" />
        </el-form-item>
        <el-form-item :label="$t('b6e9f291.72cf37')">
          <el-input v-model="base.subtitle" />
        </el-form-item>
        <el-form-item :label="$t('b6e9f291.4707ba')">
          <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item :label="$t('b6e9f291.ce5bcc')">
          <el-radio-group v-model="config.style">
            <el-radio :label="1"> {{ $t('b6e9f291.f0cf4c') }} </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('b6e9f291.364e87')">
          <div v-for="(item, index) in data" :key="index" class="setting-item slider">
            <img
              v-if="item.imgUrl"
              :src="wximageurl + item.imgUrl"
              class="banner-uploader"
              @click="handleImgChange(index)"
            />
            <div v-else class="banner-uploader" @click="handleImgChange(index)">
              <div class="content-center">
                <i class="el-icon-camera" /><br />
                {{ $t('b6e9f291.ce6855') }}
              </div>
            </div>
            <div class="uploader-setting">
              <div class="goods-select" @click="handleGoodsChange(index)">
                <div v-if="item.id" class="link-content">
                  <template v-if="item.linkPage === 'goods'">
                    {{ $t('b6e9f291.10fe9c') }}
                  </template>
                  <template v-if="item.linkPage === 'category'">
                    {{ $t('b6e9f291.e7d2e8') }}
                  </template>
                  <template v-if="item.linkPage === 'article'">
                    {{ $t('b6e9f291.8cb9b8') }}
                  </template>
                  <template v-if="item.linkPage === 'planting'">
                    {{ $t('b6e9f291.9dcd91') }}
                  </template>
                  <template v-if="item.linkPage === 'link'"> {{ $t('b6e9f291.ffd741') }} </template>
                  <template v-if="item.linkPage === 'marketing'">
                    {{ $t('b6e9f291.c78a2f') }}
                  </template>
                  {{ item.title }}
                </div>
                <div v-else class="content-center">
                  <i class="el-icon-link" @click="handleGoodsChange(index)" />{{
                    $t('b6e9f291.4f2c29')
                  }}
                </div>
              </div>
            </div>
          </div>
          <div class="frm-tips">
            {{ $t('b6e9f291.e5e743') }}
          </div>
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
      default: {}
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
  img {
    width: 100%;
  }
}
</style>
