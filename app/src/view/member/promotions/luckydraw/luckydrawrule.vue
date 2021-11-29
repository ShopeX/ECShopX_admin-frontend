<template>
  <el-col class="section section-white" :span="12">
    <div class="section-header with-border">
      抽奖规则配置
    </div>
    <div class="section-white content-padded">
      <el-form ref="form_content" label-width="80px">
        <el-form-item label="抽奖规则" prop="content">
          <el-input type="textarea" v-model="form_content.content" :rows="18"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="section-footer content-center">
      <el-button type="primary" @click="saveContent">保存</el-button>
    </div>
    <br />
  </el-col>
</template>

<script>
import { setLuckydrawRules, getLuckydrawRules } from '../../../../api/promotions'
// 组件
import imgPicker from '@/components/imageselect'
export default {
  data() {
    return {
      form_content: {}
    }
  },
  methods: {
    saveContent() {
      setLuckydrawRules(this.form_content).then((res) => {
        this.$message({
          message: '保存成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    getLuckydrawRules() {
      getLuckydrawRules().then((res) => {
        this.form_content = res.data.data
      })
    }
  },
  mounted() {
    this.getLuckydrawRules()
  }
}
</script>

<style scoped></style>
