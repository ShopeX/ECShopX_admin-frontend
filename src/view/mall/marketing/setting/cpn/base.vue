<template>
  <div class="baseSetting">
    <el-form :model="form" ref="ruleForm" label-width="150px" class="demo-ruleForm">
      <el-form-item label="是否允许加盟商入驻">
        <el-radio-group v-model="form.status">
          <el-radio :label="true">允许</el-radio>
          <el-radio :label="false">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="允许加盟商入驻类型" v-if="form.status">
        <el-checkbox-group v-model="form.settled_type">
          <el-checkbox label="enterprise">企业</el-checkbox>
          <el-checkbox label="soletrader">个体户</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="商户入驻链接（H5）">
        <span>{{ h5url }} </span>
        <a style="cursor:pointer;margin-left:30px" v-clipboard:copy="h5url" v-clipboard:success="onCopy"> 复制链接</a>
      </el-form-item>
      <div class="content">
        <p>
          入驻协议内容修改后，提交后对线上客户生效。
        </p>
        <el-form-item label="入驻协议内容" label-width="100px">
          <vue-html5-editor
            style="width: 94%"
            :content="form.content"
            @change="updateContent"
            :height="360"
          ></vue-html5-editor>
        </el-form-item>
      </div>
      <el-form-item style="text-align: center; margin-top: 30px" label-width="0">
        <el-button type="primary" @click="submitForm">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {  getShopConfig,saveShopConfig } from '@/api/mall/marketing.js'

export default {
  data() {
    return {
      form: {
        status: true,
        settled_type: [],
        content: ''
      },
      h5url: 'www.baidu.com'
    }
  },
  mounted(){
    this.getConfig()
  },
  methods: {
    async getConfig(){
      const result = await getShopConfig();
      this.form = result.data.data;
      this.h5url = result.data.data.h5url;
      delete this.form.h5url;
    },
    updateContent(data) {
      this.form.content =data
    },
    async submitForm() {
      const result = await saveShopConfig(this.form);
      if (result.data.data.status) {
        this.$message.success('保存成功')
        this.getConfig()
      }
    },
    onCopy() {
      this.$notify({
        message: '复制成功',
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.baseSetting {
  padding: 30px;
  .content {
    border: 1px solid #ccc;
    p {
      padding: 6px;
      background: #f5f5f5;
      margin-bottom: 10px;
    }
  }
}
</style>