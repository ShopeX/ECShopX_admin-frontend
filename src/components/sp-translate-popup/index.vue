<template>
  <el-dialog
    :title="$t('41f42a3e.2f9acc')"
    :visible.sync="visible"
    width="520px"
    append-to-body
    @close="handleClose"
  >
    <div class="translate-popup-body">
      <p class="translate-popup-desc">
        {{ $t('41f42a3e.25dcbd') }}
      </p>
      <div class="translate-lang-box">
        <p class="translate-lang-label">{{ $t('41f42a3e.8085da') }}</p>
        <el-checkbox-group v-model="selectedLangs">
          <el-checkbox
            v-for="lang in availableLangs"
            :key="lang.key"
            :label="lang.key"
          >
            {{ lang.label }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>

    <span slot="footer">
      <el-button @click="handleCancel">{{ $t('2a2a72e5.625fb2') }}</el-button>
      <el-button @click="handleSaveOnly">{{ $t('41f42a3e.ee9938') }}</el-button>
      <el-button
        type="primary"
        :loading="translating"
        :disabled="selectedLangs.length === 0"
        @click="handleTranslate"
      >
        {{ $t('41f42a3e.fe6d9b') }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { syncTranslate } from '@/api/translation'
import { LANGUAGES, getCurrentCountryCode } from '@/i18n/index'

export default {
  name: 'SpTranslatePopup',
  props: {
    tableName: {
      type: String,
      required: true
    },
    dataId: {
      type: [String, Number],
      default: ''
    },
    fields: {
      type: Array,
      default: () => []
    },
    values: {
      type: Array,
      default: () => []
    },
    sourceLanguage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      translating: false,
      selectedLangs: []
    }
  },
  computed: {
    availableLangs() {
      const currentCode = this.sourceLanguage || getCurrentCountryCode()
      return Object.entries(LANGUAGES)
        .filter(([, cfg]) => cfg.countryCode !== currentCode)
        .map(([key, cfg]) => ({ key: cfg.countryCode, label: cfg.label }))
    }
  },
  methods: {
    open() {
      this.translating = false
      this.selectedLangs = this.availableLangs.map((l) => l.key)
      this.visible = true
    },
    handleCancel() {
      this.visible = false
      this.$emit('cancel')
    },
    handleSaveOnly() {
      this.visible = false
      this.$emit('save-only')
    },
    async handleTranslate() {
      if (!this.dataId) {
        this.$message.warning('数据ID不能为空')
        return
      }
      this.translating = true
      try {
        await syncTranslate({
          table_name: this.tableName,
          data_id: this.dataId,
          fields: this.fields,
          values: this.values,
          source_language: this.sourceLanguage || getCurrentCountryCode(),
          target_languages: this.selectedLangs
        })
        this.$message.success(this.$t('038c104d.a1b2c3'))
        this.visible = false
        this.$emit('done')
      } catch (e) {
        this.$message.error(e.message || '翻译失败')
      } finally {
        this.translating = false
      }
    },
    handleClose() {
      this.translating = false
    }
  }
}
</script>

<style scoped>
.translate-popup-desc {
  margin-bottom: 16px;
  color: #606266;
  font-size: 14px;
}
.translate-lang-box {
  background: #f7f8fa;
  border-radius: 4px;
  padding: 12px 16px;
}
.translate-lang-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 10px;
}
</style>
