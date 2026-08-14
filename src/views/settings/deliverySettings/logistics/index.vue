<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <router-view v-if="isEditorRoute" :key="$route.fullPath" />
    <SpPage v-else>
      <el-tabs v-model="activeName" type="card" lazy @tab-click="handleClick">
        <el-tab-pane :label="$t('73136f25.249bfe')" name="normal">
          <Normal />
        </el-tab-pane>
        <el-tab-pane
          v-if="!IS_DISTRIBUTOR() && !VERSION_B2C() && !IS_SUPPLIER()"
          :label="$t('73136f25.583dcd')"
          name="city"
        >
          <Shansong v-if="VUE_APP_LOCAL_DELIVERY_DIRVER == 'shansong'" />
          <City v-else />
        </el-tab-pane>
        <el-tab-pane
          v-if="!(VERSION_SHUYUN() || VERSION_B2C()) && !IS_SUPPLIER()"
          :label="$t('73136f25.93ab28')"
          name="ziti"
        >
          <ZitiList />
        </el-tab-pane>
        <el-tab-pane :label="$t('73136f25.0e903e')" name="zipei">
          <ZiPeiList />
        </el-tab-pane>
      </el-tabs>
    </SpPage>
  </div>
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
    ...mapGetters(['isMicorMall']),
    isEditorRoute() {
      return /\/editor(?:\/|$)/.test(this.$route.path)
    }
  },
  watch: {
    $route(to, from) {
      if (from && from.path.includes('/editor') && to && !to.path.includes('/editor')) {
        this.$nextTick(() => {
          this.$EventBus.$emit('event.zitilist.refresh')
        })
      }
    }
  },
  methods: {
    handleClick(tab) {
      this.activeName = tab.name
    }
  }
}
</script>

<style scoped></style>
