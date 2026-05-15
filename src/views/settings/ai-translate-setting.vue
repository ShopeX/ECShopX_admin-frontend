<!--
  AI翻译设置页（图5）
  当前改为只展示开关与接入说明：
  密钥/地址等配置由后端环境变量维护，不在 admin 暴露
-->
<template>
  <SpPage v-loading="loading">
    <div class="ai-translate-setting">
      <el-form ref="form" :model="formData" label-width="160px" class="setting-form">
        <el-form-item :label="$t('038c104d.10de12')">
          <el-switch
            v-model="formData.enabled"
            :active-text="$t('038c104d.cc42dd')"
            :inactive-text="$t('038c104d.b15d91')"
          />
        </el-form-item>

        <el-form-item :label="$t('038c104d.540ab1')" prop="location">
          <el-input
            v-model="formData.location"
            :placeholder="$t('038c104d.a6dc24')"
            clearable
            style="max-width: 480px"
          />
          <div class="form-tip">{{ $t('038c104d.517d25') }}</div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">{{ $t('038c104d.be5fbb') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </SpPage>
</template>

<script>
export default {
  name: 'AiTranslateSetting',
  data() {
    return {
      loading: false,
      submitting: false,
      formData: {
        enabled: false,
        location: ''
      }
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    async getConfig() {
      this.loading = true
      try {
        const data = await this.$api.translation.getTranslationConfig()
        if (data) {
          this.formData.enabled = !!data.enabled
          this.formData.location = data.location || ''
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    async handleSubmit() {
      this.submitting = true
      try {
        await this.$api.translation.saveTranslationConfig({
          enabled: this.formData.enabled,
          location: this.formData.location
        })
        this.$message.success(this.$t('038c104d.3b1083'))
        await this.getConfig()
      } catch (e) {
        this.$message.error(this.$t('038c104d.78d235') + (e.message || this.$t('038c104d.974e74')))
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
.ai-translate-setting {
  max-width: 720px;
  padding: 24px;
}
.setting-form .form-tip {
  color: #999;
  font-size: 12px;
  line-height: 1.4;
  margin-top: 4px;
}
</style>
