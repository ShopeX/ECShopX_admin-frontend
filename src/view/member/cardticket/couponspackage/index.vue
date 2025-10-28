<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <SpPage class="zyk_coupon">
    <SpRouterView>
      <!-- <div class="top">
        <div class="btn">
          <el-button type="primary" size="small" icon="el-icon-circle-plus" @click="createCoupon">
            创建劵包
          </el-button>
        </div>
        <div class="search">
          <el-input v-model="title" placeholder="请入劵包标题" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="queryCoupon" />
          </el-input>
        </div>
      </div> -->

      <SpFilterForm :model="params" @onSearch="queryCoupon" @onReset="queryCoupon">
        <SpFilterFormItem prop="title" label="劵包标题:">
          <el-input v-model="params.title" placeholder="请入劵包标题" />
        </SpFilterFormItem>
      </SpFilterForm>

      <el-button type="primary" @click="createCoupon"> 创建劵包 </el-button>

      <SpFinder
        ref="finder"
        :split-count="4"
        :fixed-row-action="true"
        :setting="setting"
        no-selection
        :hooks="{ beforeSearch: beforeSearch }"
        row-actions-fixed-align="left"
        url="/voucher/package/list"
      />
    </SpRouterView>
  </SpPage>
</template>

<script>
import setting_ from './setting/pageage'
export default {
  data() {
    return {
      params: {
        title: ''
      }
    }
  },
  computed: {
    setting() {
      return setting_(this)
    }
  },
  mounted() {},
  methods: {
    createCoupon() {
      this.$router.push({
        path: `${this.$route.path}/editor`,
        query: {
          type: 'create'
        }
      })
    },
    beforeSearch(params) {
      params.title = this.params.title
      return { ...params }
    },
    queryCoupon() {
      this.$refs.finder.refresh(true)
    }
  }
}
</script>

<style lang="scss" scoped>
.zyk_coupon {
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .search {
      width: 500px;
    }
  }
}
</style>

<style lang="scss">
.zyk_coupon {
  .sp-finder-bd {
    padding: 16px 0px;
  }
}
</style>
