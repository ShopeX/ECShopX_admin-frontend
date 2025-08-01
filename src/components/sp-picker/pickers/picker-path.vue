<style lang="scss">
.picker-path {
  .el-tabs--left .el-tabs__header.is-left {
    margin-right: 0;
  }
  .sp-finder {
    margin-left: 1px;
  }
}
</style>
<template>
  <div class="picker-path">
    <!-- {{ value }} -->
    <el-tabs v-if="value.guide" v-model="tabValue" :tab-position="'left'">
      <el-tab-pane label="商品" name="goods">
        <PickerGoods v-if="tabValue == 'goods'" ref="goods" :value="value" />
      </el-tab-pane>
      <el-tab-pane label="管理分类" name="category">
        <PickerCategory v-if="tabValue == 'category'" ref="category" :value="value" />
      </el-tab-pane>
      <el-tab-pane label="软文" name="planting">
        <PickerPlanting v-if="tabValue == 'planting'" ref="planting" :value="value" />
      </el-tab-pane>
      <el-tab-pane label="自定义页面" name="custom_page">
        <PickerPages v-if="tabValue == 'custom_page'" ref="custom_page" :value="value" />
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-else v-model="tabValue" :tab-position="'left'">
      <el-tab-pane label="商品" name="goods">
        <PickerGoods v-if="tabValue == 'goods'" ref="goods" :value="value" />
      </el-tab-pane>
      <el-tab-pane v-if="VERSION_PLATFORM()" label="店铺" name="store">
        <PickerShop v-if="tabValue == 'store'" ref="store" :value="value" />
      </el-tab-pane>
      <el-tab-pane label="销售分类" name="sale_category">
        <PickerSaleCategory v-if="tabValue == 'sale_category'" ref="sale_category" :value="value" />
      </el-tab-pane>
      <el-tab-pane label="管理分类" name="category">
        <PickerCategory v-if="tabValue == 'category'" ref="category" :value="value" />
      </el-tab-pane>
      <el-tab-pane label="商品标签" name="tag">
        <PickerTag v-if="tabValue == 'tag'" ref="tag" :value="value" />
      </el-tab-pane>
      <el-tab-pane label="文章" name="article">
        <PickerArticle v-if="tabValue == 'article'" ref="article" :value="value" />
      </el-tab-pane>
      <el-tab-pane label="软文" name="planting">
        <PickerPlanting v-if="tabValue == 'planting'" ref="planting" :value="value" />
      </el-tab-pane>
      <el-tab-pane label="页面" name="link">
        <PickerLink v-if="tabValue == 'link'" ref="link" :value="value" />
      </el-tab-pane>
      <!-- <el-tab-pane label="营销" name="marketing">
        <PickerMarketing v-if="tabValue == 'marketing'" ref="marketing" :value="value" />
      </el-tab-pane> -->
      <el-tab-pane label="活动报名" name="regactivity">
        <PickerRegactivity v-if="tabValue == 'regactivity'" ref="regactivity" :value="value" />
      </el-tab-pane>
      <el-tab-pane label="内购活动" name="purchase_activity">
        <PickerPurchaseActivity
          v-if="tabValue == 'purchase_activity'"
          ref="purchase_activity"
          :value="value"
        />
      </el-tab-pane>
      <el-tab-pane label="秒杀" name="seckill">
        <PickerSeckill v-if="tabValue == 'seckill'" ref="seckill" :value="value" />
      </el-tab-pane>
      <el-tab-pane label="自定义页面" name="custom_page">
        <PickerPages v-if="tabValue == 'custom_page'" ref="custom_page" :value="value" />
      </el-tab-pane>
      <el-tab-pane label="直播" name="live">
        <PickerLive v-if="tabValue == 'live'" ref="live" :value="value" />
      </el-tab-pane>
      <el-tab-pane label="外部小程序" name="other_wxapp">
        <PickerWxApp v-if="tabValue == 'other_wxapp'" ref="other_wxapp" :value="value" />
      </el-tab-pane>
      <el-tab-pane label="抽奖活动" name="lottery">
        <PickerLottery v-if="tabValue == 'lottery'" ref="lottery" :value="value" />
      </el-tab-pane>
      <!-- <el-tab-pane label="商家" name="shop_tag">
        <PickerShopTag v-if="tabValue == 'shop_tag'" ref="shop_tag" :value="value" />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { pickBy } from '@/utils'
import BasePicker from './base'
import PickerGoods from './picker-goods'
import PickerSaleCategory from './picker-saleCategory'
import PickerCategory from './picker-category'
import PickerTag from './picker-tag'
import PickerArticle from './picker-article'
import PickerPlanting from './picker-planting'
import PickerLink from './picker-link'
import PickerMarketing from './picker-marketing'
import PickerShop from './picker-shop'
import PickerSeckill from './picker-seckill'
import PickerRegactivity from './picker-regactivity'
import PickerSupplier from './picker-supplier'
import PickerPurchaseActivity from './picker-purchaseActivity'
import PickerPages from './picker-pages'
import PickerLive from './picker-live'
import PickerWxApp from './picker-wxapp'
import PickerShopTag from './picker-shoptag'
import PickerLottery from './picker-lottery'
export default {
  name: 'PickerPath',
  components: {
    PickerGoods,
    PickerSaleCategory,
    PickerCategory,
    PickerTag,
    PickerArticle,
    PickerPlanting,
    PickerLink,
    PickerMarketing,
    PickerShop,
    PickerSeckill,
    PickerSupplier,
    PickerRegactivity,
    PickerPurchaseActivity,
    PickerPages,
    PickerLive,
    PickerWxApp,
    PickerShopTag,
    PickerLottery
  },
  // extends: BasePicker,
  config: {
    title: '设置路径'
  },
  props: ['value'],
  data() {
    const { tab } = this.value
    return {
      pathValue: null,
      tabValue: tab || 'goods'
    }
  },
  created() {
    this.pathValue = this.value
  },
  methods: {
    getVal() {
      const { data } = this.$refs[this.tabValue].getVal()
      if (data.length > 0) {
        const [{ id, title, extra }] = this.resolveData(data)
        return {
          linkPage: this.tabValue,
          title,
          id,
          extra
        }
      } else {
        return {
          linkPage: '',
          title: '',
          id: '',
          extra: {}
        }
      }
    },
    resolveData(data) {
      const doc = {
        goods: () => {
          return pickBy(data, {
            id: 'itemId',
            title: 'itemName'
          })
        },
        store: () => {
          return pickBy(data, {
            id: 'distributor_id',
            title: 'name'
          })
        },
        sale_category: () => {
          return pickBy(data, {
            id: 'id',
            title: 'title'
          })
        },
        category: () => {
          return pickBy(data, {
            id: 'id',
            title: 'title'
          })
        },
        tag: () => {
          return pickBy(data, {
            id: 'tag_id',
            title: 'tag_name'
          })
        },
        article: () => {
          return pickBy(data, {
            id: 'article_id',
            title: 'title'
          })
        },
        planting: () => {
          return pickBy(data, {
            id: 'article_id',
            title: 'title'
          })
        },
        link: () => {
          return pickBy(data, {
            id: 'id',
            title: 'title'
          })
        },
        marketing: () => {
          return pickBy(data, {
            id: 'id',
            title: 'title'
          })
        },
        regactivity: () => {
          return pickBy(data, {
            id: 'activity_id',
            title: 'activity_name'
          })
        },
        purchase_activity: () => {
          return pickBy(data, {
            id: 'id',
            title: 'name'
          })
        },
        seckill: () => {
          return pickBy(data, {
            id: 'seckill_id',
            title: 'activity_name'
          })
        },
        custom_page: () => {
          return pickBy(data, {
            id: 'id',
            title: 'page_name'
          })
        },
        live: () => {
          return pickBy(data, {
            id: 'roomid',
            title: 'name'
          })
        },
        other_wxapp: () => {
          if (this.VERSION_SHUYUN()) {
            return pickBy(data, {
              id: 'app_id', //数云修改
              title: ({ app_name, route_name }) => `${app_name} - ${route_name}`,
              extra: ({ app_id, route_info }) => {
                return {
                  appid: app_id,
                  path: route_info
                }
              }
            })
          } else {
            return pickBy(data, {
              id: 'wx_external_routes_id',
              title: ({ app_name, route_name }) => `${app_name} - ${route_name}`,
              extra: ({ app_id, route_info }) => {
                return {
                  appid: app_id,
                  path: route_info
                }
              }
            })
          }
        },
        shop_tag: () => {
          return pickBy(data, {
            id: 'tag_id',
            title: 'tag_name'
          })
        },
        lottery: () => {
          return pickBy(data, {
            id: 'id',
            title: 'activity_name'
          })
        }
      }
      return doc[this.tabValue]()
    }
  }
}
</script>
