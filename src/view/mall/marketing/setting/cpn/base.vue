<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="baseSetting">
    <el-form ref="ruleForm" :model="form" label-width="150px" class="demo-ruleForm">
      <el-form-item :label="$t('e145241a.c4c576')">
        <el-radio-group v-model="form.status">
          <el-radio :label="true">{{ $t('e145241a.e6a5c3') }}</el-radio>
          <el-radio :label="false">{{ $t('e145241a.b15d91') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.settled_type" :label="$t('e145241a.e96664')">
        <el-checkbox-group v-model="form.settled_type">
          <el-checkbox label="enterprise">{{ $t('e145241a.04c9e3') }}</el-checkbox>
          <el-checkbox label="soletrader">{{ $t('e145241a.a41061') }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item :label="$t('e145241a.69d99f')">
        <span>{{ h5url }} </span>
        <a
          v-clipboard:copy="h5url"
          v-clipboard:success="onCopy"
          style="cursor: pointer; margin-left: 30px"
        >
          {{ $t('e145241a.879058') }}</a
        >
      </el-form-item>
      <div class="content">
        <p>{{ $t('e145241a.bff7f4') }}</p>
        <el-form-item :label="$t('e145241a.817ddd')" label-width="100px">
          <SpRichText v-model="form.content" />
        </el-form-item>
      </div>
      <el-form-item style="text-align: center; margin-top: 30px" label-width="0">
        <el-button type="primary" @click="submitForm">{{ $t('e145241a.be5fbb') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getShopConfig, saveShopConfig } from '@/api/mall/marketing.js'

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
  mounted() {
    this.getConfig()
  },
  methods: {
    async getConfig() {
      const result = await getShopConfig()
      this.form = result.data.data
      this.h5url = result.data.data.h5url
      delete this.form.h5url
    },
    updateContent(data) {
      this.form.content = data
    },
    async submitForm() {
      const result = await saveShopConfig(this.form)
      if (result.data.data.status) {
        this.$message.success(this.$t('e145241a.3b1083'))
        this.getConfig()
      }
    },
    onCopy() {
      this.$notify({
        message: this.$t('e145241a.20a495'),
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
