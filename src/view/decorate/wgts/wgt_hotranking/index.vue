<style lang="scss" src="./index.scss" />

<template>
  <div class="wgt-hotranking" :style="outerStyle">
    <div class="wgt-hotranking-content flex gap-6">
      <HotRankingGoods
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
import HotRankingGoods from './comps/hotrankinggoods.vue'
import RowGoods from '../../comps/goods-layout/rowgoods.vue'
import ColumnGoods from '../../comps/goods-layout/columngoods.vue'
import GridGoods from '../../comps/goods-layout/gridgoods.vue'
import { getOuterStyle, getInnerStyle } from '../../comps/style-utils'
import saledata from './mock/saledata.json'

export default {
  name: 'hotranking',
  wgtName: '热销榜单',
  wgtDesc: '',
  wgtIcon: 'ranking-list',
  wgtType: 2,
  config: config,
  props: {
    value: [Object, Array]
  },
  components: {
    HotRankingGoods,
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
    'value.dataCount': {
      handler() {
        this.getHotRankingGoodsList()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 获取热销榜单商品列表（按销量排序）
    async getHotRankingGoodsList() {
      const effectiveDataCount = this.value?.dataCount ?? this.value?.base?.dataCount ?? 4
      let params = {
        data_type: 'sales',
        data_value: '',
        data_count: effectiveDataCount,
        distributor_id: ''
      }

      // 实际接口调用示例
      try {
        const data = await this.$api.template.getShelvesGoods(params)
        this.list = data.slice(0, effectiveDataCount) || []
      } catch (error) {
        console.error('获取热销榜单商品列表失败:', error)
        this.list = []
      }
    }
  },
  mounted() {
    this.getHotRankingGoodsList()
  },
  computed: {
    // 将 config.js 中的字段映射到 hotrankinggoods.vue 期望的字段
    mappedValue() {
      const {
        hotrankingTitleType,
        hotrankingTitleImage,
        hotrankingTitleText,
        hotrankingTitleColor,
        hotrankingShowMoreBtn,
        hotrankingMoreBtnColor,
        hotrankingMoreLink,
        ...rest
      } = this.value

      return {
        ...rest,
        // 映射标题相关字段
        titleText: {
          type: hotrankingTitleType || 'text',
          text: hotrankingTitleText,
          image: hotrankingTitleImage || ''
        },
        titleColor: hotrankingTitleColor || '',
        // 映射更多按钮相关字段
        moreBtn: {
          show: hotrankingShowMoreBtn !== undefined ? hotrankingShowMoreBtn : true,
          color: hotrankingMoreBtnColor || ''
        },
        moreLink: hotrankingMoreLink || {}
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
