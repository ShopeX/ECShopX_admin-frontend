<template>
  <el-card>
    <div slot="header"><div>店铺介绍</div></div>
    <el-row>
      <el-col>
        <el-form-item label-width="0">
          <el-input
            style="width: 100%"
            type="textarea"
            :rows="8"
            placeholder="请输入内容"
            v-model="form.introduce"
            maxlength="1000"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  props: ['externalForm'],
  watch: {
    externalForm: {
      handler(val) {
        if (val.introduce) {
          this.form.introduce = val.introduce
        }
      },
      deep: true
    }
  },
  data() {
    return {
      form: {
        introduce: ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
.flex {
  div {
    display: flex;
    align-items: center;
    height: 40px;
    margin-left: 10px;
  }
}
</style>