<template>
  <div class="merchantsClassification">
    <el-tabs type="border-card">
      <el-tab-pane label="商家分类">
          <Classify></Classify>
      </el-tab-pane>
      <el-tab-pane label="基础配置">
          <Base-cpn></Base-cpn>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import Classify from './cpn/classify.vue'
import BaseCpn from './cpn/base.vue'

export default {
  components: { Classify,BaseCpn },
    data(){
        return{

        }
    }
}
</script>

<style>
</style>