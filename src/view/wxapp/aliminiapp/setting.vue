<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-card>
      <div style="width: 70%">
        <el-form v-loading="loading" label-width="180px" :model="form">
          <el-form-item :label="$t('30fdcc72.d08e12')">
            <el-input v-model="form.authorizer_appid" type="text" />
          </el-form-item>
          <el-form-item :label="$t('30fdcc72.7e99e0')">
            <el-input v-model="form.merchant_private_key" type="textarea" :rows="5" />
          </el-form-item>
          <el-form-item :label="$t('30fdcc72.040758')">
            <div>
              <el-radio v-model="form.api_sign_method" label="key">
                {{ $t('30fdcc72.cdb81c') }}
              </el-radio>
              <!-- <el-radio
                v-model="form.api_sign_method"
                label="cert"
              >
                证书
              </el-radio> -->
            </div>
          </el-form-item>
          <el-form-item v-if="form.api_sign_method === 'cert'" :label="$t('30fdcc72.817fd2')">
            <el-input v-model="form.alipay_cert_path" type="textarea" :rows="5" />
          </el-form-item>
          <el-form-item v-if="form.api_sign_method === 'cert'" :label="$t('30fdcc72.6c836d')">
            <el-input v-model="form.alipay_root_cert_path" type="textarea" :rows="5" />
          </el-form-item>
          <el-form-item v-if="form.api_sign_method === 'cert'" :label="$t('30fdcc72.0993ef')">
            <el-input v-model="form.merchant_cert_path" type="textarea" :rows="5" />
          </el-form-item>
          <el-form-item v-if="form.api_sign_method === 'key'" :label="$t('30fdcc72.38f620')">
            <el-input v-model="form.alipay_public_key" type="textarea" :rows="5" />
          </el-form-item>
          <!-- <el-form-item label="支付类异步通知地址">
            <el-input
              v-model="form.notify_url"
              type="text"
            />
          </el-form-item> -->
          <el-form-item :label="$t('30fdcc72.2c0930')">
            <el-input v-model="form.encrypt_key" type="text" />
          </el-form-item>

          <el-form-item size="large">
            <el-button>{{ $t('30fdcc72.625fb2') }}</el-button>
            <el-button type="primary" @click="save">{{ $t('30fdcc72.be5fbb') }}</el-button>
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
      getAliMiniAppSetting(this.params).then((res) => {
        this.form = res.data.data
        this.loading = false
      })
    },
    // 保存数据
    save() {
      saveAliMiniAppSetting(this.form).then((res) => {
        this.$message({ type: 'success', message: this.$t('30fdcc72.33130f') })
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
