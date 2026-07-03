<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage :title="$t('9d1e03c7.e8a301')">
    <div v-loading="loading" class="shuyun-crm-settings">
      <section class="settings-section">
        <div class="settings-row">
          <div class="settings-row__main">
            <div class="settings-label">{{ $t('8b2c4d1e.e001') }}</div>
            <div class="settings-desc">{{ $t('8b2c4d1e.e002') }}</div>
          </div>
          <el-switch v-model="form.is_enabled" />
        </div>
      </section>

      <div class="settings-divider" />

      <form
        v-if="credentialsRendered"
        class="shuyun-crm-credentials"
        autocomplete="off"
        @submit.prevent
      >
        <section class="settings-section">
          <div class="settings-label settings-label--block">{{ $t('8b2c4d1e.e005') }}</div>
          <el-input
            :key="credentialInputKey"
            v-model="form.app_id"
            class="settings-input"
            name="shuyun_open_platform_app_id"
            autocomplete="off"
            :placeholder="$t('8b2c4d1e.e006')"
            clearable
          />
          <div class="settings-hint">{{ $t('8b2c4d1e.e007') }}</div>
        </section>

        <div class="settings-divider" />

        <section class="settings-section">
          <div class="settings-label settings-label--block">{{ $t('8b2c4d1e.e008') }}</div>
          <el-input
            :key="credentialInputKey + '-s'"
            v-model="form.app_secret"
            class="settings-input"
            name="shuyun_open_platform_app_secret"
            autocomplete="new-password"
            :placeholder="$t('8b2c4d1e.e009')"
            clearable
            show-password
          />
          <div class="settings-hint">{{ $t('8b2c4d1e.e00a') }}</div>
        </section>

        <div class="settings-divider" />

        <el-button
          type="primary"
          class="settings-save"
          native-type="button"
          :loading="saveLoading"
          @click="handleSave"
        >
          {{ $t('8b2c4d1e.e00b') }}
        </el-button>
      </form>
    </div>
  </SpPage>
</template>

<script>
export default {
  name: 'ShuyunCrmSetting',
  data() {
    return {
      loading: false,
      saveLoading: false,
      credentialsRendered: false,
      credentialInputKey: 0,
      appSecretMaskedSnapshot: '',
      form: {
        is_enabled: false,
        app_id: '',
        app_secret: ''
      }
    }
  },
  mounted() {
    this.loadConfig()
  },
  methods: {
    applyConfigPayload(data) {
      if (!data || typeof data !== 'object') {
        return
      }
      this.form.is_enabled = Boolean(data.is_enabled)
      const id =
        data.app_id != null && data.app_id !== ''
          ? data.app_id
          : data.app_key != null && data.app_key !== ''
          ? data.app_key
          : ''
      this.form.app_id = id == null ? '' : String(id)
      const masked =
        data.app_secret_masked != null && String(data.app_secret_masked).trim() !== ''
          ? String(data.app_secret_masked)
          : ''
      this.appSecretMaskedSnapshot = masked
      if (masked !== '') {
        this.form.app_secret = masked
      } else if (data.app_secret != null && data.app_secret !== '') {
        this.form.app_secret = String(data.app_secret)
      } else {
        this.form.app_secret = ''
      }
    },
    async loadConfig() {
      this.loading = true
      try {
        const data = await this.$api.third.getShuyunCrmSetting()
        this.applyConfigPayload(data)
      } catch (e) {
        const msg = e?.data?.message || e?.data?.error || this.$t('8b2c4d1e.e00c')
        this.$message.error(msg)
      } finally {
        this.loading = false
        this.$nextTick(() => {
          this.credentialsRendered = true
        })
      }
    },
    async handleSave() {
      this.saveLoading = true
      try {
        const payload = {
          is_enabled: this.form.is_enabled,
          app_id: this.form.app_id
        }
        const secretUnchanged =
          this.appSecretMaskedSnapshot !== '' &&
          this.form.app_secret === this.appSecretMaskedSnapshot
        if (!secretUnchanged) {
          payload.app_secret = this.form.app_secret
        }
        await this.$api.third.setShuyunCrmSetting(payload)
        this.$message.success(this.$t('ac4d83f6.b374d9'))
        await this.loadConfig()
        this.$nextTick(() => {
          this.credentialInputKey += 1
        })
      } catch (e) {
        const msg = e?.data?.message || e?.data?.error || this.$t('8b2c4d1e.e00f')
        this.$message.error(msg)
      } finally {
        this.saveLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.shuyun-crm-settings {
  max-width: 720px;
  padding-bottom: 48px;
}

.shuyun-crm-credentials {
  margin: 0;
  padding: 0;
  border: 0;
  display: block;
}

.settings-section {
  padding: 24px 0;
}

.settings-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.settings-row__main {
  flex: 1;
  min-width: 0;
}

.settings-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  line-height: 22px;
}

.settings-label--block {
  margin-bottom: 12px;
}

.settings-desc {
  margin-top: 4px;
  font-size: 13px;
  line-height: 20px;
  color: #999;
}

.settings-divider {
  height: 1px;
  background: #ebeef5;
}

.settings-hint {
  margin-top: 8px;
  font-size: 13px;
  line-height: 20px;
  color: #999;
}

.settings-input {
  max-width: 480px;

  ::v-deep .el-input__inner {
    border-radius: 8px;
    background-color: #f5f7fa;
  }
}

.settings-save {
  margin-top: 8px;
  border-radius: 6px;
}
</style>
