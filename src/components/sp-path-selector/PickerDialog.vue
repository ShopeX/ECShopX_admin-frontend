<template>
  <div class="sp-path-selector-dialog">
    <component
      :is="currentComponent"
      v-if="currentComponent"
      :ref="tabValue"
      v-bind="currentPickerProps"
      @close="handlePickerClose"
    />
  </div>
</template>

<script>
import { pickBy } from '@/utils'
import GoodsPicker from '@/components/sp-picker-plus/GoodsPicker.vue'
import WebCustomPagePicker from '@/components/sp-picker-plus/WebCustomPagePicker.vue'
import PickerSaleCategory from '@/components/sp-picker/pickers/picker-saleCategory'
import PickerCategory from '@/components/sp-picker/pickers/picker-category'
import PickerTag from '@/components/sp-picker/pickers/picker-tag'
import PickerArticle from '@/components/sp-picker/pickers/picker-article'
import PickerPlanting from '@/components/sp-picker/pickers/picker-planting'
import PickerPages from '@/components/sp-picker/pickers/picker-pages'
import PickerRegactivity from '@/components/sp-picker/pickers/picker-regactivity'
import PickerPurchaseActivity from '@/components/sp-picker/pickers/picker-purchaseActivity'
import PickerLive from '@/components/sp-picker/pickers/picker-live'
import PickerWxApp from '@/components/sp-picker/pickers/picker-wxapp'
import PickerLottery from '@/components/sp-picker/pickers/picker-lottery'
import PickerSharePage from '@/components/sp-picker/pickers/picker-share-page'
import PickerCustomerService from '@/components/sp-picker/pickers/picker-customer-service'
import PickerLink from '@/components/sp-picker/pickers/picker-link'
import { PATH_SELECTOR_TYPES } from './config'

const GOODS_TAB_NAME = 'goods'

const SUBMIT_MODE = {
  EMIT_CLOSE: 'emit-close',
  GET_VAL: 'get-val'
}

const RESULT_NORMALIZERS = {
  goods: (data) =>
    pickBy(data, {
      id: ({ item_id, itemId }) => item_id || itemId,
      title: ({ item_name, itemName }) => item_name || itemName
    }),
  sale_category: (data) =>
    pickBy(data, {
      id: 'id',
      title: 'title'
    }),
  category: (data) =>
    pickBy(data, {
      id: 'id',
      title: 'title'
    }),
  tag: (data) =>
    pickBy(data, {
      id: 'tag_id',
      title: 'tag_name'
    }),
  article: (data) =>
    pickBy(data, {
      id: 'article_id',
      title: 'title'
    }),
  planting: (data) =>
    pickBy(data, {
      id: 'article_id',
      title: 'title'
    }),
  link: (data) =>
    pickBy(data, {
      id: 'id',
      title: 'title'
    }),
  customer_service: (data) =>
    pickBy(data, {
      id: 'id',
      title: 'title'
    }),
  regactivity: (data) =>
    pickBy(data, {
      id: 'activity_id',
      title: 'activity_name'
    }),
  purchase_activity: (data) =>
    pickBy(data, {
      id: 'id',
      title: 'name'
    }),
  custom_page: (data) =>
    pickBy(data, {
      id: 'id',
      title: 'page_name'
    }),
  live: (data) =>
    pickBy(data, {
      id: 'roomid',
      title: 'name'
    }),
  other_wxapp: (data) =>
    pickBy(data, {
      id: 'wx_external_routes_id',
      title: ({ app_name, route_name }) => `${app_name} - ${route_name}`,
      extra: ({ app_id, route_info }) => ({
        appid: app_id,
        path: route_info
      })
    }),
  lottery: (data) =>
    pickBy(data, {
      id: 'id',
      title: 'activity_name'
    }),
  share_page: (data) =>
    pickBy(data, {
      id: 'id',
      title: 'page_name'
    })
}

const PICKER_ADAPTERS = {
  goods: {
    component: GoodsPicker,
    submitMode: SUBMIT_MODE.EMIT_CLOSE,
    getProps(vm) {
      return {
        multiple: false,
        initialSelected: vm.createGoodsInitialSelected()
      }
    },
    normalizeClose(row) {
      return row
        ? {
            id: row.item_id,
            title: row.item_name || '',
            extra: {}
          }
        : null
    }
  },
  sale_category: { component: PickerSaleCategory },
  category: { component: PickerCategory },
  tag: { component: PickerTag },
  article: { component: PickerArticle },
  planting: { component: PickerPlanting },
  custom_page: {
    component: PickerPages,
    platforms: {
      web: {
        component: WebCustomPagePicker,
        submitMode: SUBMIT_MODE.EMIT_CLOSE,
        getProps(vm) {
          return {
            initialSelected: vm.createIdTitleInitialSelected()
          }
        },
        normalizeClose(row) {
          return row
            ? {
                id: row.id,
                title: row.title || '',
                extra: {}
              }
            : null
        }
      }
    }
  },
  regactivity: { component: PickerRegactivity },
  purchase_activity: { component: PickerPurchaseActivity },
  live: { component: PickerLive },
  other_wxapp: { component: PickerWxApp },
  lottery: { component: PickerLottery },
  share_page: { component: PickerSharePage },
  customer_service: { component: PickerCustomerService },
  link: { component: PickerLink }
}

function resolvePickerAdapter(tabValue, platform) {
  const baseAdapter = PICKER_ADAPTERS[tabValue] || PICKER_ADAPTERS[GOODS_TAB_NAME]
  return baseAdapter.platforms?.[platform] || baseAdapter
}

export default {
  name: 'SpPathSelectorDialog',
  components: {
    GoodsPicker,
    WebCustomPagePicker,
    PickerSaleCategory,
    PickerCategory,
    PickerTag,
    PickerArticle,
    PickerPlanting,
    PickerPages,
    PickerRegactivity,
    PickerPurchaseActivity,
    PickerLive,
    PickerWxApp,
    PickerLottery,
    PickerSharePage,
    PickerCustomerService,
    PickerLink
  },
  props: {
    initialValue: {
      type: Object,
      default: () => ({})
    },
    pathType: {
      type: String,
      default: GOODS_TAB_NAME
    },
    pathTypes: {
      type: Array,
      default: () => PATH_SELECTOR_TYPES
    },
    platform: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      pickerValue: {
        data: [],
        multiple: false
      },
      tabValue: 'goods'
    }
  },
  computed: {
    currentAdapter() {
      return resolvePickerAdapter(this.tabValue, this.platform)
    },
    currentComponent() {
      return this.currentAdapter?.component || null
    },
    currentPickerProps() {
      if (typeof this.currentAdapter?.getProps === 'function') {
        return this.currentAdapter.getProps(this)
      }
      return {
        value: this.pickerValue
      }
    }
  },
  created() {
    this.syncValue()
  },
  methods: {
    syncValue() {
      const iv = this.initialValue || {}
      const availableType = this.pathTypes.find((item) => item.name === this.pathType)?.name
      this.tabValue = availableType || iv.linkPage || iv.tab || GOODS_TAB_NAME
      const rawId = iv.id != null && iv.id !== '' ? iv.id : ''
      const normalizedData = rawId === '' ? [] : [rawId]
      this.pickerValue = {
        type: 'pickerPath',
        data: normalizedData,
        multiple: false,
        linkPage: this.tabValue,
        tab: this.tabValue,
        id: rawId,
        title: iv.title || '',
        linkType: iv.linkType != null ? iv.linkType : 0,
        linkUrl: iv.linkUrl || '',
        linkPageValue: this.tabValue,
        trackingParams: iv.trackingParams || '',
        ...iv,
        ...(iv.extra || {})
      }
    },
    createGoodsInitialSelected() {
      const id = this.initialValue?.id
      if (id == null || id === '') return null

      return {
        item_id: id,
        item_name: this.initialValue?.title || '',
        pics: this.initialValue?.extra?.pics || [],
        price: this.initialValue?.extra?.price || 0
      }
    },
    createIdTitleInitialSelected() {
      const id = this.initialValue?.id
      if (id == null || id === '') return null
      return {
        id,
        title: this.initialValue?.title || ''
      }
    },
    submit() {
      const ref = this.$refs[this.tabValue]
      const pickerVm = Array.isArray(ref) ? ref[0] : ref

      if (this.currentAdapter?.submitMode === SUBMIT_MODE.EMIT_CLOSE) {
        pickerVm?.submit?.()
        return
      }

      const { data = [] } = pickerVm?.getVal?.() || {}
      if (!data.length) {
        this.$emit('close', null)
        return
      }
      const [{ id, title, extra }] = this.resolveData(data)
      this.$emit('close', {
        linkPage: this.tabValue,
        title,
        id,
        extra: extra || {}
      })
    },
    handlePickerClose(row) {
      const result = this.currentAdapter?.normalizeClose
        ? this.currentAdapter.normalizeClose(row)
        : row
      if (!result) {
        this.$emit('close', null)
        return
      }

      this.$emit('close', {
        linkPage: this.tabValue,
        title: result.title || '',
        id: result.id,
        extra: result.extra || {}
      })
    },
    resolveData(data) {
      const normalize = RESULT_NORMALIZERS[this.tabValue] || RESULT_NORMALIZERS[GOODS_TAB_NAME]
      return normalize(data)
    }
  }
}
</script>

<style scoped lang="scss">
.sp-path-selector-dialog {
  min-height: 480px;
}
</style>
