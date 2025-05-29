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
    <el-tabs v-model="tabValue" tab-position="left">
      <el-tab-pane v-for="item in filteredTabs" :key="item.name" :label="item.label" :name="item.name">
        <component :is="getPickerComponent(item.name)" v-if="tabValue === item.name" ref="picker" :value="value" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { pickBy } from '@/utils'

const baseTabs = [
  { label: '商品', name: 'goods' },
  { label: '店铺', name: 'store' },
  { label: '销售分类', name: 'sale_category' },
  { label: '管理分类', name: 'category' },
  { label: '商品标签', name: 'tag' },
  { label: '文章', name: 'article' },
  { label: '软文', name: 'planting' },
  { label: '页面', name: 'link' },
  { label: '营销', name: 'marketing' },
  { label: '活动报名', name: 'regactivity' },
  { label: '内购活动', name: 'purchase_activity' },
  { label: '秒杀', name: 'seckill' },
  { label: '自定义页面', name: 'custom_page' },
  { label: '直播', name: 'live' },
  { label: '外部小程序', name: 'other_wxapp' }
]

const PICKER_COMPONENTS = {
  goods: () => import('./picker-goods'),
  store: () => import('./picker-shop'),
  sale_category: () => import('./picker-saleCategory'),
  category: () => import('./picker-category'),
  tag: () => import('./picker-tag'),
  article: () => import('./picker-article'),
  planting: () => import('./picker-planting'),
  link: () => import('./picker-link'),
  marketing: () => import('./picker-marketing'),
  regactivity: () => import('./picker-regactivity'),
  purchase_activity: () => import('./picker-purchaseActivity'),
  seckill: () => import('./picker-seckill'),
  custom_page: () => import('./picker-pages'),
  live: () => import('./picker-live'),
  other_wxapp: () => import('./picker-wxapp')
}

const DATA_RESOLVERS = {
  goods: data => pickBy(data, {
    id: 'itemId',
    title: 'itemName'
  }),
  store: data => pickBy(data, {
    id: 'distributor_id',
    title: 'name'
  }),
  sale_category: data => pickBy(data, {
    id: 'id',
    title: 'title'
  })
  ,
  category: data => pickBy(data, {
    id: 'id',
    title: 'title'
  }),
  tag: data => pickBy(data, {
    id: 'tag_id',
    title: 'tag_name'
  }),
  article: data => pickBy(data, {
    id: 'article_id',
    title: 'title'
  }),
  planting: data => pickBy(data, {
    id: 'article_id',
    title: 'title'
  }),
  link: data => pickBy(data, {
    id: 'id',
    title: 'title'
  }),
  marketing: data => pickBy(data, {
    id: 'id',
    title: 'title'
  }),
  regactivity: data => pickBy(data, {
    id: 'activity_id',
    title: 'activity_name'
  }),
  purchase_activity: data => pickBy(data, {
    id: 'id',
    title: 'name'
  }),
  seckill: data => pickBy(data, {
    id: 'seckill_id',
    title: 'activity_name'
  }),
  custom_page: data => pickBy(data, {
    id: 'id',
    title: 'page_name'
  }),
  live: data => pickBy(data, {
    id: 'roomid',
    title: 'name'
  }),
  other_wxapp: data => pickBy(data, {
    id: 'wx_external_routes_id',
    title: ({ app_name, route_name }) => `${app_name} - ${route_name}`,
    extra: ({ app_id, route_info }) => {
      return {
        appid: app_id,
        path: route_info
      }
    }
  }),
  shop_tag: data => pickBy(data, {
    id: 'tag_id',
    title: 'tag_name'
  })
}

export default {
  name: 'PickerPath',

  config: {
    title: '设置路径'
  },

  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data() {
    const { tab, tabs } = this.value
    const _tabs = tabs || baseTabs
    return {
      pathValue: null,
      tabValue: tab || _tabs?.[0]?.name || 'goods',
      tabs: _tabs
    }
  },

  computed: {
    filteredTabs() {
      return this.tabs.filter(item =>
        this.VERSION_PLATFORM || item.name !== 'store'
      )
    }
  },

  methods: {
    getPickerComponent(name) {
      return PICKER_COMPONENTS[name]
    },

    getVal() {
      const { multiple } = this.value
      const picker = this.$refs.picker?.[0]
      if (!picker) return this.getEmptyValue()

      const { data } = picker.getVal()
      if (!data.length) return this.getEmptyValue()

      return multiple ? this.getMultipleValue(data) : this.getSingleValue(data)
    },

    getEmptyValue() {
      return {
        linkPage: '',
        title: '',
        id: '',
        extra: {}
      }
    },

    getSingleValue(data) {
      const [{ id, title, extra }] = this.resolveData(data)
      return {
        linkPage: this.tabValue,
        title,
        id,
        extra
      }
    },

    getMultipleValue(data) {
      return this.resolveData(data)?.map(el => ({
        ...el,
        linkPage: this.tabValue
      }))
    },

    resolveData(data) {
      const resolver = DATA_RESOLVERS[this.tabValue]
      return resolver ? resolver(data) : []
    }
  }
}
</script>
