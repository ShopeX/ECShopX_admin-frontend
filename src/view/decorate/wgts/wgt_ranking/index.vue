<style lang="scss" src="./index.scss" />

<template>
  <div class="wgt-ranking" :style="outerStyle">
    <div class="wgt-ranking-content flex gap-6">
      <RankingGoods
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
import RankingGoods from './comps/rankinggoods.vue'
import RowGoods from '../../comps/goods-layout/rowgoods.vue'
import ColumnGoods from '../../comps/goods-layout/columngoods.vue'
import GridGoods from '../../comps/goods-layout/gridgoods.vue'
import { getOuterStyle, getInnerStyle } from '../../comps/style-utils'
import rankingdata from './mock/ranking.json'

export default {
  name: 'Ranking',
  wgtName: '品类榜单',
  wgtDesc: '',
  wgtIcon: 'wgt-store',
  wgtType: 2,
  config: config,
  props: {
    value: [Object, Array]
  },
  components: {
    RankingGoods,
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
    'value.data': {
      handler() {
        this.getRankingGoodsList()
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
    // 获取榜单商品列表
    async getRankingGoodsList() {
      // 检查是否有 data 参数
      if (!this.hasDataParam()) {
        this.list = []
        return
      }

      let params = {
        data_type: 'category_ranking',
        data_value: this.value.data?.id || '',
        data_count: this.value.dataCount,
        distributor_id: this.value.data?.distributor_id || '',
        pages_template_id: this.$route.query.id
      }

      // 实际接口调用示例（注释掉）
      try {
        const res = await this.$api.template.getShelvesGoods(params)
        this.list = res?.data?.data || []
      } catch (error) {
        console.error('获取榜单商品列表失败:', error)
        this.list = []
      }
    }
  },
  mounted() {
    this.getRankingGoodsList()
  },
  computed: {
    // 将 config.js 中的字段映射到 rankinggoods.vue 期望的字段
    mappedValue() {
      const {
        rankingTitleType,
        rankingTitleImage,
        rankingTitleText,
        rankingTitleColor,
        rankingShowMoreBtn,
        rankingMoreBtnColor,
        rankingMoreLink,
        ...rest
      } = this.value

      return {
        ...rest,
        // 映射标题相关字段
        titleText: {
          type: rankingTitleType || 'text',
          text: rankingTitleText,
          image: rankingTitleImage || ''
        },
        titleColor: rankingTitleColor || '',
        // 映射更多按钮相关字段
        moreBtn: {
          show: rankingShowMoreBtn !== undefined ? rankingShowMoreBtn : true,
          color: rankingMoreBtnColor || ''
        },
        moreLink: rankingMoreLink || {}
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
