<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <section v-if="name === 'hotTopic' || name === 'banner'" class="section">
    <div class="section-header with-border">{{ $t('a1c933eb.e366cc') }}</div>
    <div class="section-body">
      <el-form label-width="100px">
        <template v-if="type == 'wxapp'">
          <el-form-item :label="$t('a1c933eb.32c65d')">
            <el-input v-model="base.title" />
          </el-form-item>

          <el-form-item :label="$t('a1c933eb.4707ba')">
            <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
        </template>

        <div v-for="(item, index) in data" :key="index" class="setting-item slider">
          <div class="setting-remove" @click="removeItem(index)">
            <i class="el-icon-delete" />
          </div>
          <template v-if="type === 'wxapp'">
            <div class="uploader-setting">
              <el-form-item :label="$t('a1c933eb.b00a65') + (index + 1)">
                <el-input v-model="item.topic" />
              </el-form-item>

              <el-form-item>
                <div class="goods-select" @click="handleGoodsChange(index)">
                  <div v-if="item.id" class="link-content">
                    <template v-if="item.linkPage === 'goods'">
                      {{ $t('a1c933eb.10fe9c') }}
                    </template>
                    <template v-if="item.linkPage === 'category'">
                      {{ $t('a1c933eb.e7d2e8') }}
                    </template>
                    <template v-if="item.linkPage === 'article'">
                      {{ $t('a1c933eb.8cb9b8') }}
                    </template>
                    <template v-if="item.linkPage === 'planting'">
                      {{ $t('a1c933eb.9dcd91') }}
                    </template>
                    <template v-if="item.linkPage === 'link'">
                      {{ $t('a1c933eb.ffd741') }}
                    </template>
                    <template v-if="item.linkPage === 'marketing'">
                      {{ $t('a1c933eb.c78a2f') }}
                    </template>
                    {{ item.title }}
                  </div>
                  <div v-else class="content-center">
                    <i class="el-icon-link" @click="handleGoodsChange(index)" />{{
                      $t('a1c933eb.4f2c29')
                    }}
                  </div>
                </div>
              </el-form-item>
            </div>
          </template>
        </div>
      </el-form>
      <div class="content-center">
        <el-button
          type="default"
          class="iconfont icon-plus-circle banner-button-uploader"
          @click="addItem"
        >
          {{ $t('a1c933eb.81a65b') }}
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
