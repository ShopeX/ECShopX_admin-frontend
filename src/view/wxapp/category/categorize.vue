<style scoped lang="scss">
.categorize {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.btn-save {
  width: 200px;
  border-radius: 60px;
}
</style>

<template>
  <SpPage>
    <SpPlatformTip h5 app alipay />
    <div class="categorize ">
      <div> 分类样式：
        <el-radio-group v-model="classify">
          <el-radio :label="true">直接加购</el-radio>
          <el-radio :label="false">平铺</el-radio>
        </el-radio-group>
      </div>
      <section class="content-padded-s section-white content-center">
        <el-button class="btn-save" type="primary" @click="saveConfig"> 保存 </el-button>
      </section>
    </div>
    <div v-if="!classify">
      是否开启自定义分类：
      <el-switch v-model="addCar" active-color="#13ce66" inactive-color="#ff4949" />
    </div>

    <addCartas v-if="classify" />
    <index v-if="!classify && addCar" ref="indexTile" />

  </SpPage>
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
    ...mapGetters([ 'template_name'])
  },
  mounted() {
    this.feath()
  },
  methods: {
    async feath() {
      let filter = { template_name: this.template_name, version: 'v1.0.1', page_name: 'category' }
      const res = await this.$api.wxa.getParamByTempName(filter)
      if (typeof res.list[0].params.addCar == 'boolean') {
        this.addCar = res.list[0].params.addCar
        this.classify = res.list[0].params.classify
      }
    },
    async saveConfig() {
      if (!this.classify && this.addCar) { //平铺开启自定义分类
        this.$refs.indexTile.saveConfig()
      } else {
        let param = {
          template_name: this.template_name,
          config: JSON.stringify([{
            name: 'base',
            hasSeries: false,
            data: [],
            is_open: true,
            addCar: this.addCar,
            classify: this.classify
          }]),
          page_name: 'category',
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
