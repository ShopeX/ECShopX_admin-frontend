<style scoped lang="scss">
.categorize {
  margin-bottom: 24px;
}
</style>

<template>
  <div>
    <SpPlatformTip h5 app alipay />
    <div class="categorize">
      分类样式：
      <el-radio-group v-model="classify">
        <el-radio :label="true">直接加购</el-radio>
        <el-radio :label="false">平铺</el-radio>
      </el-radio-group>
    </div>
    <div v-if="!classify">
      是否开启自定义分类：
      <el-switch v-model="addCar" active-color="#13ce66" inactive-color="#ff4949" />
    </div>

    <addCartas v-if="classify" />
    <index v-if="!classify && addCar" />
  </div>
</template>

<script>
import addCartas from './addCartas.vue'
import index from './index.vue'
export default {
  components: {
    addCartas,
    index
  },
  data() {
    return {
      addCar: true,
      classify: true
    }
  },
  methods: {}
}
</script>
