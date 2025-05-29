<style scoped lang="scss">
.categorize {
  margin-bottom: 24px;
  border-bottom: 1px solid #E4E7ED;
  padding-bottom: 10px;
}

.categorize-title {
  margin-right: 10px;
  font-size: 14px;
  color: #606266;
}

.btn-save {
  border-radius: 60px;
  margin-left: 20px;
}

.custom_classify {
  display: inline-block;
  margin-left: 20px;
}
</style>

<template>
  <div>
    <SpPlatformTip h5 app alipay />
    <div class="categorize">
      <span class="categorize-title">分类页业务模式:</span>
      <el-radio-group v-model="classify">
        <el-radio :label="false">自定义</el-radio>
        <el-radio :label="true">生鲜外卖</el-radio>
      </el-radio-group>
      <el-button class="btn-save" type="primary" size="mini" @click="saveConfig"> 保存 </el-button>
      <!-- <div v-if="!classify" class="custom_classify">
        是否开启自定义分类：
        <el-switch v-model="addCar" active-color="#13ce66" inactive-color="#ff4949" />
      </div> -->
    </div>

    <addCartas v-if="classify" />
    <List v-else />
    <!-- <section v-if="classify" class="content-padded-s section-white content-center">
      <el-button class="btn-save" type="primary" @click="saveConfig"> 保存 </el-button>
    </section> -->
  </div>
</template>

<script>
import addCartas from './addCartas.vue'
import index from './index.vue'
import List from './list.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    addCartas,
    List
  },
  data() {
    return {
      addCar: true,
      classify: false,

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
      if (typeof res.list[0].params.addCar == 'boolean') {
        this.addCar = res.list[0].params.addCar
        this.classify = res.list[0].params.classify
      }
    },
    async saveConfig() {
        let param = {
          template_name: this.template_name,
          config: JSON.stringify([{
            name: 'base',
            hasSeries: false,
            data: [],
            is_open: true,
          addCar: true, //默认开启
            classify: this.classify
          }]),
          page_name: 'category',
        }
        await this.$api.wxa.savePageParams(param)
      // if (!this.classify) { //平铺开启自定义分类
      //   this.$refs.indexTile.saveConfig()
      // } else {
      //   let param = {
      //     template_name: this.template_name,
      //     config: JSON.stringify([{
      //       name: 'base',
      //       hasSeries: false,
      //       data: [],
      //       is_open: true,
      //       addCar: this.addCar,
      //       classify: this.classify
      //     }]),
      //     page_name: 'category',
      //   }
      //   await this.$api.wxa.savePageParams(param)
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      // }
    }
  }
}
</script>
