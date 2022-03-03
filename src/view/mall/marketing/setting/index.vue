<template>
  <div class="merchantsClassification">
    <el-tabs
      v-model="activeName"
      type="card"
    >
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="item.name"
        :name="item.activeName"
      >
        <Classify v-if="activeName == 'class'" />
        <Base-cpn v-if="activeName == 'base'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Classify from './cpn/classify.vue'
import BaseCpn from './cpn/base.vue'

export default {
  components: { Classify, BaseCpn },
  data () {
    return {
      activeName: 'class',
      tabList: [
        { name: '商家分类', activeName: 'class' },
        { name: '基础配置', activeName: 'base' }
      ]
    }
  }
}
</script>

<style></style>
