<template>
  <section v-if="name === 'goodsScroll'" class="section">
    <div class="section-header with-border">设置</div>
    <div class="section-body">
      <el-form label-width="150px" label-position="left">
        <el-form-item label="标题">
          <el-input v-model="base.title" type="text" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="base.subtitle" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="组件间距">
          <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item label="商品类型">
          <el-radio-group v-model="config.type" @change="changeType">
            <el-radio :label="'goods'"> 单商品 </el-radio>
            <el-radio :label="'seckill'"> 秒杀活动 </el-radio>
            <el-radio :label="'limitTimeSale'"> 限时特惠 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="config.type === 'goods'" label="开启排行榜">
          <el-switch v-model="config.leaderboard" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item label="显示价格">
          <el-switch v-model="config.showPrice" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item v-if="config.type === 'goods'" label="选择商品">
          <el-button
            type="default"
            class="iconfont icon-cog banner-button-uploader"
            @click="setGoods"
          >
            编辑商品
          </el-button>
          <span style="font-size: 12px; margin-left: 20px"
            >最多可选择100件商品；左侧实时预览内仅展示前50件；下方商品拖动以排序。</span
          >
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
              <!-- <div class="setting-item item-selected" v-for="(item, index) in items" :key="index"> -->
              <el-col
                v-for="(item, index) in data"
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
        </el-form-item>
        <el-form-item v-if="config.type === 'seckill'" label="选择活动">
          <el-select v-model="config.seckillId" placeholder="请选择" @change="selectSeckill">
            <el-option
              v-for="(item, index) in seckill"
              :key="item.seckill_id"
              :label="item.activity_name"
              :value="item.seckill_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="config.type === 'limitTimeSale'" label="选择活动">
          <el-select v-model="config.seckillId" placeholder="请选择" @change="selectLimitTimeSale">
            <el-option
              v-for="(item, index) in limitTimeSale"
              :key="item.seckill_id"
              :label="item.activity_name"
              :value="item.seckill_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="config.moreLink" label="设置「更多」链接" label-width="150px">
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
        <el-form-item label="设置「更多」图片">
          <img
            v-if="base.backgroundImg"
            :src="wximageurl + base.backgroundImg"
            class="banner-uploader"
            @click="handleImgChange('backImg')"
          >
          <div v-else class="banner-uploader" @click="handleImgChange('backImg')">
            <i class="iconfont icon-camera" />
            上传图片
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
            }).then(response => {
              this.seckill = response.data.data.list
              const id = this.res.config.seckillId
              const isHaveSeckill = this.seckill.findIndex(item => item.seckill_id == id) > -1
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
            }).then(response => {
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
