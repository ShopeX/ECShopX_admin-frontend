<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <router-view v-if="isEditorRoute" :key="$route.fullPath" />
    <SpPage v-else>
      <div class="action-container">
        <el-button type="primary" icon="plus" @click="addTemplates">
          {{ $t('c8abf6d9.a8c029') }}
        </el-button>
      </div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane lazy :label="$t('c8abf6d9.882490')" name="first">
          <buyerTemplates ref="buyerTemplates" :get-status="buyerTemplates" />
        </el-tab-pane>
        <el-tab-pane lazy :label="$t('c8abf6d9.843135')" name="second">
          <weightTemplates ref="weightTemplates" :get-status="weightTemplates" />
        </el-tab-pane>
        <el-tab-pane lazy :label="$t('c8abf6d9.5555b9')" name="third">
          <numberTemplates ref="numberTemplates" :get-status="numberTemplates" />
        </el-tab-pane>
        <el-tab-pane lazy :label="$t('c8abf6d9.877ec9')" name="fourth">
          <priceTemplates ref="priceTemplates" :get-status="priceTemplates" />
        </el-tab-pane>
        <el-tab-pane lazy :label="$t('c8abf6d9.a95569')" name="fifth">
          <volumeTemplates ref="volumeTemplates" :get-status="volumeTemplates" />
        </el-tab-pane>
      </el-tabs>
    </SpPage>
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
  data() {
    return {
      loading: false,
      activeName: 'first',
      list: []
    }
  },
  computed: {
    isEditorRoute() {
      return /\/editor(?:\/|$)/.test(this.$route.path)
    }
  },
  mounted() {
    if ('undefined' != typeof this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
    this.$nextTick(() => this.getList())
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
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    handleClick() {
      this.$nextTick(() => this.getList())
    },
    getActiveTabRef() {
      const refMap = {
        first: 'buyerTemplates',
        second: 'weightTemplates',
        third: 'numberTemplates',
        fourth: 'priceTemplates',
        fifth: 'volumeTemplates'
      }
      const refName = refMap[this.activeName]
      return refName ? this.$refs[refName] : null
    },
    getActiveTabRef() {
      const refMap = {
        first: 'buyerTemplates',
        second: 'weightTemplates',
        third: 'numberTemplates',
        fourth: 'priceTemplates',
        fifth: 'volumeTemplates'
      }
      const refName = refMap[this.activeName]
      return refName ? this.$refs[refName] : null
    },
    getActiveTabRef() {
      const refMap = {
        first: 'buyerTemplates',
        second: 'weightTemplates',
        third: 'numberTemplates',
        fourth: 'priceTemplates',
        fifth: 'volumeTemplates'
      }
      const refName = refMap[this.activeName]
      return refName ? this.$refs[refName] : null
    },
    getList() {
      const ref = this.getActiveTabRef()
      if (ref && typeof ref.getShippingTemplatesList === 'function') {
        ref.getShippingTemplatesList()
      }
    }
  }
}
</script>

<style scoped></style>
