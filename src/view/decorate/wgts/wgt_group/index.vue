<style lang="scss" src="./index.scss" />

<template>
  <div class="wgt-group" :style="outerStyle">
    <div class="wgt-group-content flex gap-6">
      <GroupGoods
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
import GroupGoods from './comps/groupgoods.vue'
import RowGoods from '../../comps/goods-layout/rowgoods.vue'
import ColumnGoods from '../../comps/goods-layout/columngoods.vue'
import GridGoods from '../../comps/goods-layout/gridgoods.vue'
import { getOuterStyle, getInnerStyle } from '../../comps/style-utils'
import groupdata from './mock/group.json'
import { i18n } from '@/i18n'
export default {
  name: 'Group',
  wgtName: i18n.t('5141b31a.0dc5dc'),
  wgtDesc: '',
  wgtIcon: 'wgt-store',
  wgtType: 2,
  config: config,
  props: {
    value: [Object, Array]
  },
  components: {
    GroupGoods,
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
        this.getGroupGoodsList()
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
    // 获取拼团商品列表
    async getGroupGoodsList() {
      // 检查是否有 data 参数
      if (!this.hasDataParam()) {
        this.list = []
        return
      }

      let params = {
        data_type: 'group',
        data_value: this.value.data?.id || '',
        num: this.value.dataCount,
        distributor_id: this.value.data?.distributor_id || '',
        pages_template_id: this.$route.query.id
      }

      // 实际接口调用示例（注释掉）
      try {
        const data = await this.$api.template.getShelvesGoods(params)
        this.list = data || []
      } catch (error) {
        console.error('获取拼团商品列表失败:', error)
        this.list = []
      }
    }
  },
  mounted() {
    this.getGroupGoodsList()
  },
  computed: {
    // 将 config.js 中的字段映射到 groupgoods.vue 期望的字段
    mappedValue() {
      const {
        groupTitleType,
        groupTitleImage,
        groupTitleText,
        groupTitleColor,
        groupShowMoreBtn,
        groupMoreBtnColor,
        groupMoreLink,
        ...rest
      } = this.value

      return {
        ...rest,
        // 映射标题相关字段
        titleText: {
          type: groupTitleType || 'text',
          text: groupTitleText,
          image: groupTitleImage || ''
        },
        titleColor: groupTitleColor || '',
        // 映射更多按钮相关字段
        moreBtn: {
          show: groupShowMoreBtn !== undefined ? groupShowMoreBtn : true,
          color: groupMoreBtnColor || ''
        },
        moreLink: groupMoreLink || {}
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
