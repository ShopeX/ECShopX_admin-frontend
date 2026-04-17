<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <section v-if="name === 'goodsScroll'" class="section">
    <div class="section-header with-border">{{ $t('9e916548.e366cc') }}</div>
    <div class="section-body">
      <el-form label-width="150px" label-position="left">
        <el-form-item :label="$t('9e916548.32c65d')">
          <el-input v-model="base.title" type="text" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item :label="$t('9e916548.72cf37')">
          <el-input v-model="base.subtitle" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item :label="$t('9e916548.4707ba')">
          <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item :label="$t('9e916548.2af133')">
          <el-radio-group v-model="config.type" @change="changeType">
            <el-radio :label="'goods'"> {{ $t('9e916548.bcf481') }} </el-radio>
            <el-radio :label="'seckill'"> {{ $t('9e916548.dbe208') }} </el-radio>
            <el-radio :label="'limitTimeSale'"> {{ $t('9e916548.a0aaca') }} </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="config.type === 'goods'" :label="$t('9e916548.aaa49b')">
          <el-switch v-model="config.leaderboard" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item :label="$t('9e916548.ba302e')">
          <el-switch v-model="config.showPrice" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item v-if="config.type === 'goods'" :label="$t('9e916548.43d1e2')">
          <div>
            <el-button
              type="default"
              class="iconfont icon-cog banner-button-uploader"
              @click="setGoods"
            >
              {{ $t('9e916548.7d3792') }}
            </el-button>
            <span style="font-size: 12px; margin-left: 20px">{{ $t('9e916548.d58793') }}</span>
            <el-row
              v-if="items.length > 0 && items[0].imgUrl"
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
                <el-col
                  v-for="(item, index) in data"
                  :key="index"
                  :span="6"
                  class="setting-item item-selected"
                  @mouseover.native="mouseoverHandle(index)"
                  @mouseleave.native="mouseleaveHandle()"
                >
                  <img class="thumbnail" :src="wximageurl + item.imgUrl" alt="" />
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
          </div>
        </el-form-item>
        <el-form-item v-if="config.type === 'seckill'" :label="$t('9e916548.a05f05')">
          <el-select
            v-model="config.seckillId"
            :placeholder="$t('9e916548.708c9d')"
            @change="selectSeckill"
          >
            <el-option
              v-for="item in seckill"
              :key="item.seckill_id"
              :label="item.activity_name"
              :value="item.seckill_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="config.type === 'limitTimeSale'" :label="$t('9e916548.a05f05')">
          <el-select
            v-model="config.seckillId"
            :placeholder="$t('9e916548.708c9d')"
            @change="selectLimitTimeSale"
          >
            <el-option
              v-for="item in limitTimeSale"
              :key="item.seckill_id"
              :label="item.activity_name"
              :value="item.seckill_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="config.moreLink" :label="$t('9e916548.45520d')" label-width="150px">
          <div class="goods-select" @click="handleMoreLink">
            <div v-if="config.moreLink.title" class="link-content">
              <template v-if="config.moreLink.linkPage === 'goods'">
                {{ $t('9e916548.10fe9c') }}
              </template>
              <template v-if="config.moreLink.linkPage === 'category'">
                {{ $t('9e916548.e7d2e8') }}
              </template>
              <template v-if="config.moreLink.linkPage === 'article'">
                {{ $t('9e916548.8cb9b8') }}
              </template>
              <template v-if="config.moreLink.linkPage === 'planting'">
                {{ $t('9e916548.9dcd91') }}
              </template>
              <template v-if="config.moreLink.linkPage === 'link'">
                {{ $t('9e916548.ffd741') }}
              </template>
              <template v-if="config.moreLink.linkPage === 'marketing'">
                {{ $t('9e916548.c78a2f') }}
              </template>
              <template v-if="config.moreLink.linkPage === 'custom_page'">
                {{ $t('9e916548.15ed03') }}
              </template>
              {{ config.moreLink.title }}
            </div>
            <div v-else class="content-center">
              <i class="el-icon-link" />{{ $t('9e916548.4f2c29') }}
            </div>
          </div>
        </el-form-item>
        <el-form-item :label="$t('9e916548.060573')">
          <img
            v-if="base.backgroundImg"
            :src="wximageurl + base.backgroundImg"
            class="banner-uploader"
            @click="handleImgChange('backImg')"
          />
          <div v-else class="banner-uploader" @click="handleImgChange('backImg')">
            <i class="el-icon-camera" />
            {{ $t('9e916548.ce6855') }}
          </div>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
import draggable from 'vuedraggable'
import { seckillActivityGetList } from '@/api/promotions'

export default {
  components: {
    draggable
  },
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
      data: [],
      seckill: [],
      limitTimeSale: [],
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
      handler(value, oldValue) {
        console.log('--value--', value, oldValue)
        if (value || value.name === 'navigation') {
          this.setData(value)
          if (!value.config) return
          if (value.config.type === 'seckill' && this.seckill.length === 0) {
            seckillActivityGetList({
              page: 1,
              pageSize: 20,
              status: 'not_end'
            }).then((response) => {
              this.seckill = response.data.data.list
              const id = this.res.config.seckillId
              const isHaveSeckill = this.seckill.findIndex((item) => item.seckill_id == id) > -1
              console.log('--seckill-', this.seckill, id, isHaveSeckill)
              if (!isHaveSeckill) {
                this.config.seckillId = ''
              }
            })
          }
          if (value.config.type === 'limitTimeSale' && this.limitTimeSale.length === 0) {
            seckillActivityGetList({
              page: 1,
              pageSize: 20,
              status: 'valid',
              seckill_type: 'limited_time_sale'
            }).then((response) => {
              this.limitTimeSale = response.data.data.list
            })
          }
        }
      },
      immediate: true
    },
    seckill: {
      deep: true,
      handler(value) {},
      immediate: true
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
    changeType(data) {
      if (data !== 'goods') {
        this.config.leaderboard = false
      } else {
        this.seckill = []
        this.limitTimeSale = []
      }
      this.data.splice(0)
      this.config.seckillId = ''
      this.config.type = data
    },
    selectLimitTimeSale(data) {
      this.config.seckillId = data
    },
    selectSeckill(data) {
      this.config.seckillId = data
    },
    removeItem(index) {
      this.data.splice(index, 1)
    },
    setGoods() {
      this.$emit('bindGoods')
    },
    onEnd(evt) {
      this.temp = this.data[evt.oldIndex]
      this.data.splice(evt.oldIndex, 1)
      this.data.splice(evt.newIndex, 0, this.temp)
    },
    handleMoreLink() {
      this.$emit('bindLinks')
    },
    handleImgChange(index) {
      this.$emit('bindImgs', index)
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
