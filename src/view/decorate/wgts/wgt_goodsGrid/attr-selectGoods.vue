<style lang="scss"></style>
<template>
  <div>
    <el-button plain size="small" @click="onSelectGoods">选择商品</el-button>

    <SpDialog
      ref="dialogRef"
      v-model="dialog"
      title="选择商品"
      form="dialogForm"
      form-list="dialogFormList"
      @onSubmit="onDialogSubmit"
    />
  </div>
</template>

<script>
export default {
  name: 'AttrSelectGoods',
  data() {
    return {
      dialog: false,
      dialogForm: {},
      dialogFormList: [
        {
          label: ''
        }
      ]
    }
  },
  created() {},
  methods: {
    onSelectGoods() {
      this.dialog = true
    },
    onDialogSubmit() {}
  }
}
</script>
