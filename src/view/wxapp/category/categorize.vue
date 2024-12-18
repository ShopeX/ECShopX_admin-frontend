<style scoped lang="scss">
.categorize {
  margin-bottom: 24px;
}

.btn-save {
  width: 200px;
  border-radius: 60px;
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
    <index v-if="!classify && addCar" ref="indexTile" />
    <section class="content-padded-s section-white content-center">
      <el-button class="btn-save" type="primary" @click="saveConfig"> 保存 </el-button>
    </section>
  </div>
</template>

<script>
import addCartas from './addCartas.vue'
import index from './index.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    addCartas,
    index
  },
  data() {
    return {
      addCar: true,
      classify: true,

    }
  },
  computed: {
    ...mapGetters(['wheight', 'template_name'])
  },
  mounted() {
    this.feath()
  },
  methods: {
    async feath() {
      let filter = { template_name: this.template_name, version: 'v1.0.1', page_name: 'category' }
      const res = await this.$api.wxa.getParamByTempName(filter)
      this.addCar = res.list[0].addCar || true
      this.classify = res.list[0].classify || true
      console.log(res.list[0], 'kkkkkfffff')
    },
    async saveConfig() {
      if (!this.classify && this.addCar) { //平铺开启自定义分类
        console.log('平铺要')
        this.$refs.indexTile.saveConfig()
      } else {
        let param = {
          template_name: this.template_name,
          config: JSON.stringify([]),
          page_name: 'category',
          addCar: this.addCar,
          classify: this.classify,
        }
        await this.$api.wxa.savePageParams(param)
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      }
    }
  }
}
</script>
