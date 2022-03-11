<template>
  <div>
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="概况"
        name="indexPage"
      />
      <el-tab-pane
        label="访问分析"
        name="accessPage"
      />
      <el-tab-pane
        label="用户画像"
        name="userPage"
      />
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'indexPage'
    }
  },
  methods: {
    handleClick (tab, event) {}
  }
}
</script>
