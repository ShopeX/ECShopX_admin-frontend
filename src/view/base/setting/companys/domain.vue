<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <SpPage>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="域名设置" name="domainSet">
        <el-form ref="form" label-width="180px" style="min-height: 200px">
          <!-- 
        <div class="clearfix">
          <h2 class="f_l">
            <span>PC域名设置：</span>
          </h2>
        </div>

        <el-form-item label="PC域名">
          <el-input v-model="form.pc_domain" style="width:300px">
            <template slot="prepend">Http://</template>
          </el-input>
        </el-form-item>

        <el-form-item label="是否审核">
          <el-switch v-model="form.pc_is_checked" active-color="#13ce66" inactive-color="#ff4949" disabled></el-switch>
        </el-form-item> -->

          <div class="clearfix">
            <h2 class="f_l view-flex">
              <div>H5域名：</div>
              <div class="margin_left-10">
                {{ form.h5_default_domain }}
              </div>
              <div class="margin_left-20">
                <el-tag v-clipboard:copy="form.h5_default_domain" v-clipboard:success="onCopy">
                  点我复制
                </el-tag>
              </div>
            </h2>
          </div>

          <el-input
            v-model="form.h5_domain"
            style="width: 200px"
            class="margin_left-84"
            size="small"
            placeholder="请输入绑定的独立域名"
          />

          <div class="clearfix">
            <h2 class="f_l view-flex">
              <div>PC域名：</div>
              <div class="margin_left-10">
                {{ form.pc_default_domain }}
              </div>
              <div class="margin_left-20">
                <el-tag v-clipboard:copy="form.pc_default_domain" v-clipboard:success="onCopy">
                  点我复制
                </el-tag>
              </div>
            </h2>
          </div>

          <el-input
            v-model="form.pc_domain"
            style="width: 200px"
            class="margin_left-84"
            size="small"
            placeholder="请输入绑定的独立域名"
          />
        </el-form>
        <div class="section-footer content-center">
          <el-button v-loading="loading" type="primary" @click="onSubmit"> 保存 </el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </SpPage>
</template>
<script>
import { getDomainH5Setting, setDomainSetting } from '@/api/company'
export default {
  data() {
    return {
      activeName: 'domainSet',
      loading: false,
      form: {
        pc_domain: '',
        h5_domain: '',
        pc_is_checked: false,
        h5_is_checked: true,
        h5_default_domain: '',
        pc_default_domain: ''
      }
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    onCopy() {
      this.$notify.success({
        message: '复制成功',
        showClose: true
      })
    },
    handleClick() {
      this.getConfig()
    },
    getConfig() {
      getDomainH5Setting().then(response => {
        this.form = response.data.data
      })
    },
    onSubmit() {
      this.loading = true

      setDomainSetting({
        pc_domain: this.form.pc_domain,
        h5_domain: this.form.h5_domain
      })
        .then(response => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.loading = false
        })
        .catch(error => {
          this.loading = false
        })
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 10px;
  .frm-tips {
    color: #ff0000;
  }
}
.margin_left-10 {
  margin-left: 10px;
}
.margin_left-20 {
  margin-left: 20px;
}
.margin_left-84 {
  margin-left: 84px;
}
.el-tag {
  background: #409eff;
  border-color: #409eff;
  color: white;
  height: 24px;
  line-height: 22px;
}
</style>
