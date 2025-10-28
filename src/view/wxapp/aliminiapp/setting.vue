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
  <div>
    <el-card>
      <div style="width: 70%">
        <el-form v-loading="loading" label-width="180px" :model="form">
          <el-form-item label="小程序AppId">
            <el-input v-model="form.authorizer_appid" type="text" />
          </el-form-item>
          <el-form-item label="应用私钥">
            <el-input v-model="form.merchant_private_key" type="textarea" :rows="5" />
          </el-form-item>
          <el-form-item label="api加密类型">
            <div>
              <el-radio v-model="form.api_sign_method" label="key"> 密钥 </el-radio>
              <!-- <el-radio
                v-model="form.api_sign_method"
                label="cert"
              >
                证书
              </el-radio> -->
            </div>
          </el-form-item>
          <el-form-item v-if="form.api_sign_method === 'cert'" label="支付宝公钥证书文件">
            <el-input v-model="form.alipay_cert_path" type="textarea" :rows="5" />
          </el-form-item>
          <el-form-item v-if="form.api_sign_method === 'cert'" label="支付宝根证书文件">
            <el-input v-model="form.alipay_root_cert_path" type="textarea" :rows="5" />
          </el-form-item>
          <el-form-item v-if="form.api_sign_method === 'cert'" label="应用公钥证书文件">
            <el-input v-model="form.merchant_cert_path" type="textarea" :rows="5" />
          </el-form-item>
          <el-form-item v-if="form.api_sign_method === 'key'" label="支付宝公钥字符串">
            <el-input v-model="form.alipay_public_key" type="textarea" :rows="5" />
          </el-form-item>
          <!-- <el-form-item label="支付类异步通知地址">
            <el-input
              v-model="form.notify_url"
              type="text"
            />
          </el-form-item> -->
          <el-form-item label="AES密钥">
            <el-input v-model="form.encrypt_key" type="text" />
          </el-form-item>

          <el-form-item size="large">
            <el-button>取消</el-button>
            <el-button type="primary" @click="save"> 保存 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getAliMiniAppSetting, saveAliMiniAppSetting } from '../../../api/aliminiapp'

export default {
  components: {},

  data() {
    return {
      loading: false,
      form: {
        authorizer_appid: '',
        merchant_private_key: '',
        api_sign_method: 'key',
        alipay_cert_path: '',
        alipay_root_cert_path: '',
        merchant_cert_path: '',
        alipay_public_key: '',
        notify_url: '',
        encrypt_key: ''
      }
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    // 获取信息
    getInfo() {
      this.loading = true
      getAliMiniAppSetting(this.params).then(res => {
        this.form = res.data.data
        this.loading = false
      })
    },
    // 保存数据
    save() {
      saveAliMiniAppSetting(this.form).then(res => {
        this.$message({ type: 'success', message: '操作成功' })
        this.getInfo()
      })
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  }
}
</script>
<style scoped lang="scss">
.tip {
  font-size: 12px;
  color: #909399;
}
</style>
