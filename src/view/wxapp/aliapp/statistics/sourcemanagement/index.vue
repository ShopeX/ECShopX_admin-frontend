<template>
  <div class="section-white content-padded">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="监控列表" name="monito">
        <monito-list />
      </el-tab-pane>
      <el-tab-pane label="来源列表" name="source">
        <source-list />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import monitoList from './monito_list.vue'
import sourceList from './source_list.vue'

export default {
  components: {
    monitoList,
    sourceList
  },
  data() {
    return {
      activeName: 'monito'
    }
  },
  methods: {
    handleClick(tab, event) {}
  }
}
</script>
