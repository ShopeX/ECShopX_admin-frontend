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
  <SpRouterView>
    <SpPage>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="普通快递" name="normal">
          <Normal />
        </el-tab-pane>
        <el-tab-pane
          v-if="!IS_DISTRIBUTOR() && !VERSION_B2C() && !IS_SUPPLIER()"
          label="同城配"
          name="city"
        >
          <Shansong v-if="VUE_APP_LOCAL_DELIVERY_DIRVER == 'shansong'" />
          <City v-else />
        </el-tab-pane>
        <el-tab-pane
          v-if="!(VERSION_SHUYUN() || VERSION_B2C()) && !IS_SUPPLIER()"
          label="到店自提"
          name="ziti"
        >
          <ZitiList />
        </el-tab-pane>
        <el-tab-pane label="商家自配送" name="zipei">
          <ZiPeiList />
        </el-tab-pane>
      </el-tabs>
    </SpPage>
  </SpRouterView>
</template>

<script>
import City from './city'
import Shansong from './shansong'
import Normal from './normal'
import ZitiList from './comps/ziti-list'
import ZiPeiList from './comps/zipei-list'
import { mapGetters } from 'vuex'
import { VERSION_B2C } from '@/utils'
export default {
  components: {
    Normal,
    City,
    Shansong,
    ZitiList,
    ZiPeiList
  },
  data() {
    return {
      activeName: 'normal'
    }
  },
  computed: {
    ...mapGetters(['isMicorMall'])
  },
  methods: {
    handleClick(tab) {
      this.activeName = tab.name
    }
  }
}
</script>

<style scoped></style>
