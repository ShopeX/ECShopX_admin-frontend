<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <section v-if="name === 'goodsGrid'" class="section">
    <div class="section-header with-border">{{ $t('37a3b709.e366cc') }}</div>
    <div class="section-body">
      <el-form label-width="100px" :label-position="usage == 'mobile' ? 'left' : 'top'">
        <el-form-item :label="$t('37a3b709.32c65d')">
          <el-input v-model="base.title" type="text" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item v-if="show_subtitle" :label="$t('37a3b709.72cf37')">
          <el-input v-model="base.subtitle" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item v-if="show_space" :label="$t('37a3b709.4707ba')">
          <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item v-if="usage == 'pc'" :label="$t('37a3b709.4707ba')">
          <el-input v-model="base.padded" type="number" />
        </el-form-item>
        <el-form-item v-if="show_style" :label="$t('37a3b709.390037')">
          <el-radio-group v-model="config.style" @change="styleChange">
            <el-radio :label="'grid'"> {{ $t('37a3b709.412d79') }} </el-radio>
            <el-radio :label="'grids'"> {{ $t('37a3b709.41061c') }} </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="show_price" :label="$t('37a3b709.ba302e')">
          <el-switch v-model="config.showPrice" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item v-if="config.style !== 'grids' && show_brand" :label="$t('37a3b709.02af2a')">
          <el-switch v-model="config.brand" active-color="#27cc6a" inactive-color="#efefef" />
          <span class="muted content-padded">{{ $t('37a3b709.248261') }}</span>
        </el-form-item>
        <el-form-item :label="$t('37a3b709.43d1e2')">
          <el-button
            v-if="!limit_num || items.length < limit_num"
            type="default"
            class="iconfont icon-cog banner-button-uploader"
            @click="setGoods"
          >
            {{ $t('37a3b709.7d3792') }}
          </el-button>
          <span
            v-if="!limit_num || items.length < limit_num"
            style="font-size: 12px; margin-left: 20px"
            >{{ $t('37a3b709.d58793') }}</span
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

          <span v-if="limit_num">
            * {{ $t('37a3b709.b48d2c') }}{{ limit_num }}{{ $t('37a3b709.35a7af') }}</span
          >
        </el-form-item>
        <el-form-item v-if="config.moreLink" :label="$t('37a3b709.c1a1e7')">
          <div class="goods-select" @click="handleMoreLink">
            <div v-if="config.moreLink.title" class="link-content">
              <template v-if="config.moreLink.linkPage === 'goods'">
                {{ $t('879af10c.10fe9c') }}
              </template>
              <template v-if="config.moreLink.linkPage === 'category'">
                {{ $t('879af10c.e7d2e8') }}
              </template>
              <template v-if="config.moreLink.linkPage === 'article'">
                {{ $t('879af10c.8cb9b8') }}
              </template>
              <template v-if="config.moreLink.linkPage === 'planting'">
                {{ $t('879af10c.9dcd91') }}
              </template>
              <template v-if="config.moreLink.linkPage === 'link'">
                {{ $t('879af10c.ffd741') }}
              </template>
              <template v-if="config.moreLink.linkPage === 'marketing'">
                {{ $t('879af10c.c78a2f') }}
              </template>
              <template v-if="config.moreLink.linkPage === 'custom_page'">
                {{ $t('879af10c.15ed03') }}
              </template>
              {{ config.moreLink.title }}
            </div>
            <div v-else class="content-center">
              <i class="el-icon-link" />{{ $t('37a3b709.4f2c29') }}
            </div>
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
