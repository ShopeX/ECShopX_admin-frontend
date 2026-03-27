<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpRouterView>
    <SpPage>
      <div>
        <div class="action-container">
          <el-button type="primary" icon="plus" @click="addTemplates">
            {{ $t('c8abf6d9.a8c029') }}
          </el-button>
        </div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane :label="$t('c8abf6d9.882490')" name="first">
            <buyerTemplates ref="buyerTemplates" :get-status="buyerTemplates" />
          </el-tab-pane>
          <el-tab-pane :label="$t('c8abf6d9.843135')" name="second">
            <weightTemplates ref="weightTemplates" :get-status="weightTemplates" />
          </el-tab-pane>
          <el-tab-pane :label="$t('c8abf6d9.5555b9')" name="third">
            <numberTemplates ref="numberTemplates" :get-status="numberTemplates" />
          </el-tab-pane>
          <el-tab-pane :label="$t('c8abf6d9.877ec9')" name="fourth">
            <priceTemplates ref="priceTemplates" :get-status="priceTemplates" />
          </el-tab-pane>
          <el-tab-pane :label="$t('c8abf6d9.a95569')" name="fifth">
            <volumeTemplates ref="volumeTemplates" :get-status="volumeTemplates" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </SpPage>
  </SpRouterView>
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
