import { getCurrentCountryCode } from '@/i18n/index'

/**
 * 翻译同步混入：
 *
 * 设计变更（图3）：
 *  - 创建/编辑保存成功后一律弹「同步翻译弹框」，由用户决定翻译哪些目标语言；
 *    弹框内部已自动过滤掉当前语言（source = 当前界面语言），不再做「当前 == 默认才弹」之类条件。
 *  - 弹框内的「仅保存」「取消」按钮：默认行为均为返回上一页（列表页）。
 *    页面如需自定义，可覆写 `onTranslateSaveOnly` / `onTranslateCancel` 或 `goBackTranslateList`。
 *  - 翻译完成（done）：默认仅给一个全局 toast，不强制跳页（保留页面可继续编辑的可能性）。
 */
export default {
  data() {
    return {
      translateContext: {
        dataId: '',
        fields: [],
        values: [],
        sourceLang: getCurrentCountryCode()
      }
    }
  },
  methods: {
    openTranslate(dataId, fields, values) {
      this.translateContext = {
        dataId,
        fields,
        values,
        sourceLang: getCurrentCountryCode()
      }
      this.$nextTick(() => {
        if (this.$refs.translatePopup) {
          this.$refs.translatePopup.open()
        }
      })
      return true
    },
    onTranslateDone() {
      this.$message.success(this.$t('038c104d.a1b2c3') || '翻译完成')
    },
    onTranslateSaveOnly() {
      this.goBackTranslateList()
    },
    onTranslateCancel() {
      this.goBackTranslateList()
    },
    goBackTranslateList() {
      if (this.$router) {
        this.$router.go(-1)
      }
    }
  }
}
