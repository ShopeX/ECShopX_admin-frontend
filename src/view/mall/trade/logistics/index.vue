<template>
  <el-tabs
    v-model="activeName"
    type="card"
    @tab-click="handleClick"
  >
    <el-tab-pane
      label="普通快递"
      name="normal"
    >
      <Normal />
    </el-tab-pane>
    <el-tab-pane
      v-if="!isMicorMall"
      label="同城配"
      name="city"
    >
      <City />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import City from './city'
import Normal from './normal'
import { mapGetters } from 'vuex'
export default {
  components: {
    Normal,
    City
  },
  data () {
    return {
      activeName: 'normal'
    }
  },
  computed: {
    ...mapGetters(['isMicorMall'])
  },
  methods: {
    handleClick (tab) {
      this.activeName = tab.name
    }
  }
}
</script>

<style scoped></style>
