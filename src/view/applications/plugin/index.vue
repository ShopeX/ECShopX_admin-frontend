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
<style scoped lang="scss">
.app-item {
  display: flex;
  border: 1px solid #e9e9e9;
  margin-bottom: 20px;
  padding: 16px;
}
.app-logo {
  width: 140px;
  height: 140px;
  margin-right: 10px;
}
.app-name {
  font-weight: 600;
}
.app-desc {
  font-size: 13px;
  height: 100px;
  color: #979797;
}
</style>

<template>
  <SpPage>
    <SpRouterView>
      <el-row v-if="!VERSION_IN_PURCHASE()" :gutter="20">
        <el-col v-for="(item, index) in appList" :key="`app-item__${index}`" :span="8">
          <div class="app-item">
            <div class="app-logo">
              <el-image :src="require(`@/assets/img/ectapp/${item.key}.png`)" />
            </div>
            <div>
              <div class="app-name">{{ item.title }}</div>
              <div class="app-desc">{{ item.desc }}</div>
              <div class="app-action">
                <el-button
                  v-if="!appStatus[item.key]"
                  type="primary"
                  plain
                  @click="onClickItem(item)"
                >
                  {{ item.button }}
                </el-button>
                <el-button v-else type="primary">已开通</el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </SpRouterView>
  </SpPage>
</template>

<script>
import { APPLICATION_LIST } from './consts'
export default {
  data() {
    return {
      appList: APPLICATION_LIST,
      appStatus: {
        adapay: false,
        point: false,
        neigou: false,
        yingxiao: false,
        miaosha: false,
        yinlian: false,
        yidongshouyin: false
      }
    }
  },
  created() {
    this.fetch()
  },
  mounted() {},
  methods: {
    clickChange(visible) {
      this.visible = visible
    },
    async fetch() {
      this.loading = true
      const { adapay, employee_purchase, marketing_center, mobile_cashier, pointsmall, seckill } =
        await this.$api.application.list()
      this.appStatus = {
        adapay,
        point: pointsmall,
        neigou: employee_purchase,
        yingxiao: marketing_center,
        miaosha: seckill,
        yinlian: false,
        yidongshouyin: mobile_cashier
      }
    },
    onClickItem({ key }) {
      this.$router.push({
        path: `/applications/appsgroup/extapp/detail/${key}`
      })
    }
  }
}
</script>
