<style lang="scss" src="./index.scss" />

<template>
  <div class="wgt-goods" :style="outerStyle">
    <div class="wgt-goods-content flex gap-6">
      <GoodsGoods
        v-if="goodsLayout === 'default' || !goodsLayout"
        :value="mappedValue"
        :goods-list="list"
        :custom-style="innerStyle"
      />
      <RowGoods
        v-if="goodsLayout === 'one'"
        :value="mappedValue"
        :goods-list="list"
        :custom-style="innerStyle"
      />
      <ColumnGoods
        v-if="goodsLayout === 'two'"
        :value="mappedValue"
        :goods-list="list"
        :custom-style="innerStyle"
      />
      <GridGoods
        v-if="goodsLayout === 'three'"
        :value="mappedValue"
        :goods-list="list"
        :custom-style="innerStyle"
      />
    </div>
  </div>
</template>

<script>
import config from './config'
import GoodsGoods from './comps/goodsgoods.vue'
import RowGoods from '../../comps/goods-layout/rowgoods.vue'
import ColumnGoods from '../../comps/goods-layout/columngoods.vue'
import GridGoods from '../../comps/goods-layout/gridgoods.vue'
import { getOuterStyle, getInnerStyle } from '../../comps/style-utils'
import saledata from './mock/saledata.json'
import { i18n } from '@/i18n'
export default {
  name: 'Goods',
  wgtName: i18n.t('8865eba5.9897d8'),
  wgtDesc: '',
  wgtIcon: 'waterfalls-h',
  wgtType: 2,
  config: config,
  props: {
    value: [Object, Array]
  },
  components: {
    GoodsGoods,
    RowGoods,
    ColumnGoods,
    GridGoods
  },
  data() {
    return {
      list: []
    }
  },
  watch: {
    'value.dataType': {
      handler() {
        this.getGoodsList()
      },
      immediate: true,
      deep: true
    },
    'value.data': {
      handler() {
        if (
          ['price', 'items', 'pointsmall_items', 'main_category', 'category', 'history'].includes(
            this.value.dataType
          )
        ) {
          this.getGoodsList()
        }
      },
      deep: true
    },
    'value.dataCount': {
      handler() {
        this.getGoodsList()
      },
      deep: true
    }
  },
  methods: {
    // 检查 data 是否有参数
    hasDataParam() {
      const data = this.value.data
      if (!data) return false
      if (data.id !== undefined && data.id !== null && data.id !== '') {
        return true
      }
      return false
    },
    // 获取商品列表
    async getGoodsList() {
      const dataType = this.value.dataType

      // 对于需要 data 参数的类型，检查是否有参数
      if (['price', 'items', 'pointsmall_items', 'main_category', 'category'].includes(dataType)) {
        if (!this.hasDataParam()) {
          this.list = []
          return
        }
      }

      const effectiveDataCount = this.value?.dataCount ?? 4
      let params = {
        data_type: dataType,
        data_value: this.value.data?.id || '',
        data_count: effectiveDataCount,
        distributor_id: this.value.data?.distributor_id || '',
        pages_template_id: this.$route.query.id
      }

      switch (dataType) {
        case 'price':
          params.data_value = this.value?.data.id.split(',')
          break
        case 'items':
        case 'pointsmall_items':
          params.data_value = this.value?.data.id.split(',')
          break
      }
      try {
        const data = await this.$api.template.getShelvesGoods(params)
        this.list = data.slice(0, effectiveDataCount) || []
      } catch (error) {
        console.error('获取商品列表失败:', error)
        this.list = []
      }
    }
  },
  mounted() {
    this.getGoodsList()
  },
  computed: {
    // 将 config.js 中的字段映射到 goodsgoods.vue 期望的字段
    mappedValue() {
      const {
        goodsTitleType,
        goodsTitleImage,
        goodsTitleText,
        goodsTitleColor,
        goodsShowMoreBtn,
        goodsMoreBtnColor,
        goodsMoreLink,
        ...rest
      } = this.value

      return {
        ...rest,
        // 映射标题相关字段
        titleText: {
          type: goodsTitleType || 'text',
          text: goodsTitleText,
          image: goodsTitleImage || ''
        },
        titleColor: goodsTitleColor || '',
        // 映射更多按钮相关字段
        moreBtn: {
          show: goodsShowMoreBtn !== undefined ? goodsShowMoreBtn : true,
          color: goodsMoreBtnColor || ''
        },
        moreLink: goodsMoreLink || {}
      }
    },
    outerStyle() {
      return getOuterStyle(this.value)
    },
    goodsLayout() {
      return this.value?.goodsLayout || 'default'
    },
    innerStyle() {
      return getInnerStyle(this.value)
    }
  }
}
</script>
