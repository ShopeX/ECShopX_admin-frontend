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
  <div class="map-setting">
    <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="item.name"
        :name="item.activeName"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <div class="head-tips">
            高德地图Key获取路径：
            <el-link
              href="https://developer.amap.com/?ref=http%3A%2F%2Flbs.gaode.com%2Fdev%2F"
              target="_blank"
              type="primary"
            >
              高德地图控制台
            </el-link>
            ，进入 「我的应用」-「 创建新应用 」-「 添加新Key 」。
          </div>

          <el-form-item label="Key" prop="app_key" style="margin-bottom: 10px">
            <el-input v-model="form.app_key" style="width: 60%" type="textarea" :rows="6" />
          </el-form-item>
          <el-form-item label="">
            <div class="row-tip">Key 不填写或填写错误将导致该功能无法使用，请确保填写正确。</div>
          </el-form-item>

          <el-form-item label="密钥" prop="app_secret" class="passwords">
            <el-input v-model="form.app_secret" style="width: 60%" :type="pass_type" :rows="6" />
            <i
              v-if="pass_type == 'textarea'"
              title="隐藏密码"
              class="iconfont icon-eye1 icons-class"
              @click="onChangePassIcon('password')"
            />
            <i
              v-else
              title="隐藏密码"
              class="iconfont icon-eye-slash1 icons-class"
              @click="onChangePassIcon('textarea')"
            />
          </el-form-item>

          <div class="section-footer with-border content-center">
            <el-button v-loading="loading" type="primary" @click="onSubmitChange"> 保存 </el-button>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { setMapSetting, getMapSetting } from '@/api/third'
export default {
  data() {
    return {
      loading: false,
      activeName: 'first',
      pass_type: 'password',
      form: {
        app_key: '',
        app_secret: ''
      },
      rules: {
        app_key: { required: true, message: '请输入', trigger: 'blur' },
        app_secret: { required: false, message: '请输入', trigger: 'blur' }
      },
      tabList: [{ name: '高德地图配置', activeName: 'first' }]
    }
  },
  mounted() {
    this.onGetConfig()
  },
  methods: {
    onGetConfig() {
      getMapSetting().then(response => {
        this.form = response.data.data.list[0]
      })
    },
    onSubmitChange() {
      this.loading = true
      let query = {
        app_key: this.form.app_key,
        app_secret: this.form.app_secret,
        map_type: 'amap',
        is_default: 1
      }
      setMapSetting(query)
        .then(response => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.pass_type = 'password'
          this.onGetConfig()
          this.loading = false
        })
        .catch(error => {
          this.loading = false
        })
    },
    onChangePassIcon(type) {
      this.pass_type = type
    }
  }
}
</script>
<style lang="scss">
.map-setting {
  .icons-class {
    position: absolute;
    top: 35%;
    left: 63%;
    font-size: 16px;
    cursor: pointer;
  }
  .passwords {
    .el-input {
      width: 50%;
      position: relative;
      height: 138px;
    }
    .el-input__inner {
      height: 138px;
    }
  }
  .el-row {
    margin-bottom: 10px;
  }
  .head-tips {
    margin: 10px 20px 20px 20px;
    background: #eef8fd;
    padding: 10px 10px;
    font-size: 14px;
  }
  .row-tip {
    font-size: 12px;
    color: #999;
  }
}
</style>
