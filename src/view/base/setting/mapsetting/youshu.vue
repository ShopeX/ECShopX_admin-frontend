<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-form ref="form" label-width="100px">
    <div class="tips">
      {{ $t('aa950d87.ad3038') }}
      <el-link
        href="https://youshu.tencent.com/portal-web/index.html?state=srdata"
        target="_blank"
        type="primary"
      >
        {{ $t('aa950d87.512c76') }}
      </el-link>
      平台，进入 「数据接入」-「 接入工具 」-「 密钥管理 」。
    </div>
    <el-form-item label="merchantID">
      <el-input v-model="form.merchant_id" style="width: 300px" />
      <div class="tip">{{ $t('aa950d87.0b1e38') }}</div>
    </el-form-item>

    <el-form-item label="APP ID">
      <el-form-item :label="$t('aa950d87.e12dbe')" style="margin-bottom: 10px">
        <el-input v-model="form.sandbox_app_id" style="width: 300px" />
      </el-form-item>
      <el-form-item :label="$t('aa950d87.3c07bb')">
        <el-input v-model="form.app_id" style="width: 300px" />
      </el-form-item>
      <el-form-item label="  ">
        <div class="tip">
          APP ID是前端SDK的token,区分环境，正式环境APP ID将在生产数据通过测试后提供
        </div>
      </el-form-item>
    </el-form-item>

    <el-form-item label="APP Secret">
      <el-form-item :label="$t('aa950d87.e12dbe')" style="margin-bottom: 10px">
        <el-input v-model="form.sandbox_app_secret" style="width: 300px" />
      </el-form-item>
      <el-form-item :label="$t('aa950d87.3c07bb')">
        <el-input v-model="form.app_secret" style="width: 300px" />
      </el-form-item>
      <el-form-item label="  ">
        <div class="tip">
          后端API需要使用appld + appSercet生成signature,区分环境，正式环境APP
          Secret将在生产数据通过测试后提供。
        </div>
      </el-form-item>
    </el-form-item>

    <el-form-item label="后端 API URL">
      <el-form-item :label="$t('aa950d87.e12dbe')" style="margin-bottom: 10px">
        <el-input v-model="form.sandbox_api_url" style="width: 300px" />
      </el-form-item>
      <el-form-item :label="$t('aa950d87.3c07bb')">
        <el-input v-model="form.api_url" style="width: 300px" />
      </el-form-item>
      <el-form-item label="  ">
        <div class="tip">
          <p>沙盒：https://test.zhls.qq.com/</p>
          <p>正式：https://zhls.qq.com/</p>
        </div>
      </el-form-item>
    </el-form-item>

    <el-form-item :label="$t('aa950d87.0ed510')">
      <el-form-item :label="$t('aa950d87.d7ec2d')" style="margin-bottom: 10px">
        <el-input v-model="form.weapp_name" style="width: 300px" />
      </el-form-item>
      <el-form-item label="AppId">
        <el-input
          v-model="form.weapp_app_id"
          style="width: 300px"
          :placeholder="$t('aa950d87.cc4e7b')"
        />
      </el-form-item>
      <el-form-item label="  ">
        <div class="tip">{{ $t('aa950d87.9cc2fd') }}</div>
      </el-form-item>
    </el-form-item>

    <el-input v-model="form.id" type="hidden" />

    <div class="section-footer with-border content-center">
      <el-button v-loading="loading" type="primary" @click="onSubmit">
        {{ $t('aa950d87.be5fbb') }}
      </el-button>
    </div>
  </el-form>
</template>
<script>
import { setSetting, getSetting } from '../../../../api/dataAnalysis'
export default {
  data() {
    return {
      activeName: 'youshu',
      loading: false,
      form: {
        id: '',
        merchant_id: '',
        app_id: '',
        app_secret: '',
        sandbox_app_id: '',
        sandbox_app_secret: '',
        sandbox_api_url: '',
        api_url: '',
        weapp_name: '',
        weapp_app_id: ''
      },
      back_API_URL_shahe: 'https://test.zhls.qq.com/',
      back_API_URL_zhengshi: 'https://zhls.qq.com/'
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    handleClick() {
      this.getConfig()
    },
    getConfig() {
      getSetting().then((response) => {
        if (response.status == 200) {
          this.form = response.data.data
        }
      })
    },
    onSubmit() {
      this.loading = true
      let query = {
        ...this.form
      }
      setSetting(query)
        .then((response) => {
          this.$message({
            type: 'success',
            message: this.$t('aa950d87.3b1083')
          })
          this.getConfig()
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
        })
    }
  }
}
</script>
<style scoped lang="scss">
.tips {
  margin: 10px 20px;
  background: #eef8fd;
  padding: 10px 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
}
.tip {
  font-size: 12px;
  color: #999;
  p {
    line-height: 10px;
    margin-top: 16px;
    &:last-child {
      margin: 10px 0;
      line-height: 10px;
    }
  }
}

.el-row {
  // margin-bottom: 10px;
  .frm-tips {
    color: #ff0000;
  }
}
</style>
