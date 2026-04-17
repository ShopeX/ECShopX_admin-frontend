<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div v-if="$route.path.indexOf('editor') === -1">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-button type="primary" icon="plus" @click="addTemplates">
            {{ $t('75c2575f.a8c029') }}
          </el-button>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane :label="$t('75c2575f.882490')" name="first">
          <buyerTemplates ref="buyerTemplates" :get-status="buyerTemplates" />
        </el-tab-pane>
        <el-tab-pane :label="$t('75c2575f.843135')" name="second">
          <weightTemplates ref="weightTemplates" :get-status="weightTemplates" />
        </el-tab-pane>
        <el-tab-pane :label="$t('75c2575f.5555b9')" name="third">
          <numberTemplates ref="numberTemplates" :get-status="numberTemplates" />
        </el-tab-pane>
        <el-tab-pane :label="$t('75c2575f.877ec9')" name="fourth">
          <priceTemplates ref="priceTemplates" :get-status="priceTemplates" />
        </el-tab-pane>
        <el-tab-pane :label="$t('75c2575f.a95569')" name="fifth">
          <volumeTemplates ref="volumeTemplates" :get-status="volumeTemplates" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <router-view />
  </div>
</template>

<script>
import buyerTemplates from './templates/buyerTemplates'
import weightTemplates from './templates/weightTemplates'
import numberTemplates from './templates/numberTemplates'
import priceTemplates from './templates/priceTemplates'
import volumeTemplates from './templates/volumeTemplates'

export default {
  components: {
    buyerTemplates,
    weightTemplates,
    numberTemplates,
    priceTemplates,
    volumeTemplates
  },
  provide() {
    return {
      refresh: this.getList
    }
  },
  data() {
    return {
      loading: false,
      buyerTemplates: false,
      weightTemplates: false,
      numberTemplates: false,
      priceTemplates: false,
      volumeTemplates: false,
      activeName: 'first',
      list: []
    }
  },
  mounted() {
    if ('undefined' != typeof this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
  },
  watch: {
    $route(to, from) {
      if (from && from.path.includes('editor') && to && !to.path.includes('editor')) {
        this.$nextTick(() => this.getList())
      }
    }
  },
  methods: {
    addTemplates() {
      // 添加运费模板
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    handleClick(tab, event) {
      if (this.activeName === 'first') {
        this.buyerTemplates = true
      } else if (this.activeName === 'second') {
        this.weightTemplates = true
      } else if (this.activeName === 'third') {
        this.numberTemplates = true
      } else if (this.activeName === 'fourth') {
        this.priceTemplates = true
      } else if (this.activeName === 'fifth') {
        this.volumeTemplates = true
      }
    },
    getList() {
      const refs = [
        this.$refs.buyerTemplates,
        this.$refs.weightTemplates,
        this.$refs.numberTemplates,
        this.$refs.priceTemplates,
        this.$refs.volumeTemplates
      ]
      refs.forEach((ref) => {
        if (ref && typeof ref.getShippingTemplatesList === 'function') {
          ref.getShippingTemplatesList()
        }
      })
    }
  }
}
</script>

<style scoped></style>
