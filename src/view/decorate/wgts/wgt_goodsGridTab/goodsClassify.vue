<style lang="scss">
.goods-classify {
  padding: 0 10px 0 0;
}
</style>
<template>
  <div>
    <el-button type="text" @click="handleEdit">修改</el-button>
    <classifyDialog ref="classify" :value="value" @submit="handleSubmit" />
  </div>
</template>

<script>
import { useDialog } from "@shopex/finder"
import classifyDialog from "./classifyDialog.vue"
export default {
  name: 'GoodsClassify',
  components: { classifyDialog },
  props: ['value'],
  data() {
    return {
      dialogVisible: false
    }
  },
  created() {
  },
  methods: {
    handleEdit() {
      this.$refs.classify.dialogVisible = true
    },
    handleSubmit(e) {
      this.$emit('input', e)
      this.dialogVisible = false
    }
  }
}
</script>
