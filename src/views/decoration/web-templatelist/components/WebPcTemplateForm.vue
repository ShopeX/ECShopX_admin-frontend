<!--
  PC 模板新增/编辑 — $dialog.open 内容区（整表 SpFormPlus）
  脚本文案 i18n.t()；页面类型下拉用 FormField 的 component 函数 + ctx.h 渲染 el-select
-->
<template>
  <div class="web-pc-template-form w-full max-w-[600px]">
    <SpFormPlus
      ref="formPlusRef"
      v-model="form"
      form-type="form"
      label-width="180px"
      class="w-full"
      :show-default-actions="false"
      :form-items="formItems"
    />
  </div>
</template>

<script>
import SpFormPlus from '@/components/sp-form-plus'
import { i18n } from '@/i18n'

const DEFAULT_TAB_LIST = [
  { name: 'index', labelKey: '8b0d1458.db1c89' },
  { name: 'custom', labelKey: '8b0d1458.ec20e4' },
  { name: 'product_list', labelKey: '895a87f9.d35756' }
]

export default {
  name: 'WebPcTemplateForm',
  components: { SpFormPlus },
  props: {
    initialValue: {
      type: Object,
      default: () => ({})
    },
    tabList: {
      type: Array,
      default: () => [...DEFAULT_TAB_LIST]
    }
  },
  data() {
    return {
      form: {
        theme_pc_template_id: '',
        template_title: '',
        template_description: '',
        page_type: '',
        distributor_id: undefined,
        status: true
      }
    }
  },
  computed: {
    tabListResolved() {
      return this.tabList && this.tabList.length ? this.tabList : DEFAULT_TAB_LIST
    },
    pageTypeOptions() {
      return this.tabListResolved.map((row) => ({
        value: row.name,
        label: row.labelKey ? i18n.t(row.labelKey) : row.label || ''
      }))
    },
    formItems() {
      return [
        {
          fieldName: 'template_title',
          label: i18n.t('8b0d1458.b78454'),
          component: 'input',
          formItemClass: 'w-full',
          rules: [{ required: true, message: i18n.t('8b0d1458.7d5cc3'), trigger: 'blur' }],
          componentProps: {
            clearable: true,
            placeholder: i18n.t('8b0d1458.7d5cc3')
          }
        },
        {
          fieldName: 'template_description',
          label: i18n.t('8b0d1458.abf8f4'),
          component: 'input',
          formItemClass: 'w-full',
          rules: [{ required: true, message: i18n.t('8b0d1458.9c5cf8'), trigger: 'blur' }],
          componentProps: {
            clearable: true,
            placeholder: i18n.t('8b0d1458.9c5cf8')
          }
        },
        {
          fieldName: 'page_type',
          label: i18n.t('8b0d1458.46f391'),
          component: (ctx) => this.renderPageTypeSelect(ctx),
          formItemClass: 'w-full',
          rules: [{ required: true, message: i18n.t('8b0d1458.8dfcc4'), trigger: 'change' }],
          componentProps: {
            filterable: true,
            clearable: true,
            placeholder: i18n.t('8b0d1458.8dfcc4'),
            options: this.pageTypeOptions
          }
        },
        {
          fieldName: 'status',
          label: i18n.t('8b0d1458.53c3dd'),
          component: 'switch',
          componentProps: {}
        }
      ]
    }
  },
  watch: {
    initialValue: {
      deep: true,
      handler() {
        this.syncForm()
      }
    }
  },
  created() {
    this.syncForm()
  },
  methods: {
    renderPageTypeSelect(ctx) {
      const { h, value, onInput, props } = ctx
      const {
        options: rawOptions = [],
        filterable = true,
        clearable = true,
        placeholder = ''
      } = props || {}
      const children = (rawOptions || []).map((opt, idx) =>
        h('el-option', {
          key: opt.value != null ? String(opt.value) : `pt-${idx}`,
          props: {
            label: opt.label,
            value: opt.value,
            disabled: opt.disabled
          }
        })
      )
      return h(
        'el-select',
        {
          class: 'w-full',
          style: { width: '100%' },
          props: {
            value,
            filterable,
            clearable,
            placeholder,
            popperAppendToBody: true
          },
          on: {
            input: onInput
          }
        },
        children
      )
    },
    validate() {
      return this.$refs.formPlusRef.validate()
    },
    syncForm() {
      const iv = this.initialValue || {}
      this.form = {
        theme_pc_template_id:
          iv.theme_pc_template_id != null ? String(iv.theme_pc_template_id) : '',
        template_title: iv.template_title != null ? String(iv.template_title) : '',
        template_description:
          iv.template_description != null ? String(iv.template_description) : '',
        page_type: iv.page_type != null ? String(iv.page_type) : '',
        distributor_id: iv.distributor_id !== undefined ? Number(iv.distributor_id) : undefined,
        status: iv.status === true || iv.status === '1' || iv.status === 1
      }
    },
    async buildApiParams() {
      await this.validate()
      const {
        theme_pc_template_id,
        template_title,
        template_description,
        page_type,
        distributor_id,
        status
      } = this.form
      const params = {
        template_title,
        template_description,
        page_type,
        status: status ? '1' : '2',
        version: 'v1.0.1'
      }
      if (theme_pc_template_id !== '') {
        params.theme_pc_template_id = theme_pc_template_id
      }
      if (distributor_id !== undefined) {
        params.distributor_id = distributor_id
      }
      return params
    }
  }
}
</script>

<style scoped>
.web-pc-template-form ::v-deep .el-select {
  width: 100%;
}
</style>
