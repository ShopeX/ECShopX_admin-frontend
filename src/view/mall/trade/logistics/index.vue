<template>
  <SpRouterView>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="普通快递" name="normal">
        <Normal />
      </el-tab-pane>
      <el-tab-pane
        v-if="!IS_DISTRIBUTOR() && !VERSION_B2C && !IS_SUPPLIER()"
        label="同城配"
        name="city"
      >
        <Shansong v-if="VUE_APP_LOCAL_DELIVERY_DIRVER == 'shansong'" />
        <City v-else />
      </el-tab-pane>
      <el-tab-pane v-if="!IS_SUPPLIER()" label="到店自提" name="ziti">
        <ZitiList />
      </el-tab-pane>
      <el-tab-pane label="商家自配送" name="zipei">
        <ZiPeiList />
      </el-tab-pane>
    </el-tabs>
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
