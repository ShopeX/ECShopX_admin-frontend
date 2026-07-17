<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpFormPlus
      ref="searchForm"
      v-model="searchParams"
      :form-items="searchFormItems"
      form-type="searchForm"
      @submit="onSearch"
    />

    <div class="action-container mt-4">
      <el-button type="primary" @click="addTemplate"> {{ $t('e1bd2c70.476f3e') }} </el-button>
    </div>

    <SpFinder
      ref="finder"
      url="/goods/tag"
      fixed-row-action
      row-actions-align="left"
      row-actions-fixed-align="left"
      row-actions-width="150px"
      :no-selection="true"
      :setting="tableSetting"
      :hooks="{
        beforeSearch: beforeSearch
      }"
    />
    <sideBar
      :visible.sync="show_sideBar"
      :title="editingTagId ? $t('e1bd2c70.9d98ce') : $t('e1bd2c70.01d3b0')"
    >
      <TagForm :value="form" @submit="onFormSubmit" />
      <div slot="footer">
        <el-button type="primary" @click="handleFormSubmit">
          {{ $t('e1bd2c70.b75381') }}
        </el-button>
      </div>
    </sideBar>

    <SpTranslatePopup
      ref="translatePopup"
      table-name="items_tags"
      :data-id="translateContext.dataId"
      :fields="translateContext.fields"
      :values="translateContext.values"
      :source-language="translateContext.sourceLang"
      @done="onTranslateDone"
      @save-only="onTranslateSaveOnly"
      @cancel="onTranslateCancel"
    />
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { saveTag, getTagList, getTagInfo, updateTag, deleteTag } from '../../../api/goods'
import sideBar from '@/components/element/sideBar'
import SpTranslatePopup from '@/components/sp-translate-popup'
import translateMixin from '@/mixins/translateMixin'
import { createSetting } from '@shopex-ui/finder'
import { useForm } from '@/composables'
import { i18n } from '@/i18n'

// 预定义颜色常量
const PREDEFINE_COLORS = [
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585'
]

const [TagForm, TagFormApi] = useForm({
  formType: 'normalForm',
  labelWidth: '100px',
  labelInline: true,
  showDefaultActions: false,
  formItems: [
    {
      fieldName: 'tag_name',
      label: i18n.t('e1bd2c70.341fe8'),
      component: 'input',
      value: '',
      componentProps: {
        placeholder: i18n.t('e1bd2c70.6f81f3')
      },
      rules: [{ required: true, message: i18n.t('e1bd2c70.6f81f3'), trigger: 'blur' }]
    },
    {
      fieldName: 'description',
      label: i18n.t('e1bd2c70.beff13'),
      component: 'textarea',
      value: '',
      componentProps: {
        placeholder: i18n.t('e1bd2c70.92f284'),
        rows: 3
      }
    },
    {
      fieldName: 'tag_color',
      label: i18n.t('e1bd2c70.0a6bfb'),
      component: ({ h, value, onInput }) => {
        return h('el-color-picker', {
          props: {
            value: value,
            showAlpha: true,
            predefine: PREDEFINE_COLORS
          },
          on: {
            input: (val) => {
              onInput(val)
            }
          }
        })
      },
      value: '#ff1939'
    },
    {
      fieldName: 'font_color',
      label: i18n.t('e1bd2c70.690660'),
      component: ({ h, value, onInput }) => {
        return h('el-color-picker', {
          props: {
            value: value,
            showAlpha: true,
            predefine: PREDEFINE_COLORS
          },
          on: {
            input: (val) => {
              onInput(val)
            }
          }
        })
      },
      value: '#ffffff'
    },
    {
      fieldName: 'front_show',
      label: i18n.t('e1bd2c70.1a7c7c'),
      component: 'radio',
      value: '0',
      componentProps: {
        options: [
          { label: i18n.t('e1bd2c70.4d775d'), value: '1' },
          { label: i18n.t('e1bd2c70.dce537'), value: '0' }
        ]
      }
    }
  ]
})

export default {
  components: {
    sideBar,
    TagForm,
    SpTranslatePopup
  },
  mixins: [translateMixin],
  data() {
    return {
      show_sideBar: false,
      isEdit: false,
      editingTagId: '',
      searchParams: {
        tag_name: '',
        tag_source: 'all'
      },
      options: [],
      form: {
        tag_id: '',
        tag_name: '',
        tag_color: '#ff1939',
        font_color: '#ffffff',
        description: '',
        front_show: '0'
      }
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    optionsWithLabel() {
      return [
        { value: 'all', label: this.$t('e1bd2c70.a8b0c2') },
        { value: 'distributor', label: this.$t('e1bd2c70.e86c4b') },
        { value: 'platform', label: this.$t('e1bd2c70.85d9b3') }
      ]
    },
    searchFormItems() {
      return [
        {
          fieldName: 'tag_name',
          label: this.$t('e1bd2c70.341fe8'),
          component: 'input',
          cellWidth: 1.3,
          componentProps: {
            clearable: true,
            placeholder: this.$t('e1bd2c70.6f81f3')
          }
        },
        {
          fieldName: 'tag_source',
          label: this.$t('e1bd2c70.200948'),
          component: 'select',
          cellWidth: 1.3,
          isShow: () => this.$store.getters.login_type != 'distributor',
          componentProps: {
            placeholder: this.$t('e1bd2c70.708c9d'),
            options: this.optionsWithLabel.map((item) => ({
              label: item.label,
              value: item.value
            }))
          }
        }
      ]
    },
    tableSetting() {
      return createSetting({
        actions: [
          {
            name: this.$t('e1bd2c70.95b351'),
            key: 'edit',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'link',
              handler: ([row]) => {
                this.editAction(0, row)
              }
            }
          },
          {
            name: this.$t('e1bd2c70.2f4aad'),
            key: 'delete',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'link',
              handler: ([row]) => {
                this.deleteAction(0, row)
              }
            }
          }
        ],
        columns: [
          {
            name: this.$t('e1bd2c70.341fe8'),
            key: 'tag_name',
            width: 250,
            render: (h, scope) => {
              return h(
                'span',
                {
                  class: 'tag',
                  style: {
                    color: scope.row.font_color,
                    background: scope.row.tag_color,
                    padding: '3px 5px',
                    borderRadius: '3px',
                    fontSize: '12px',
                    lineHeight: '1'
                  }
                },
                scope.row.tag_name
              )
            }
          },
          {
            name: this.$t('e1bd2c70.0d4934'),
            key: 'distributor_name'
          },
          {
            name: this.$t('e1bd2c70.da5bf4'),
            key: 'description'
          }
        ]
      })
    }
  },
  mounted() {
    if (this.$store.getters.login_type == 'distributor') {
      this.searchParams.tag_source = ''
    }
  },
  methods: {
    normalizeFrontShow(value) {
      if (value === true || value === 1 || value === '1') {
        return '1'
      }
      return '0'
    },
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    beforeSearch(params) {
      return {
        ...params,
        ...this.searchParams
      }
    },
    addTemplate() {
      this.resetData()
      if (TagFormApi.setFieldsValue) {
        TagFormApi.setFieldsValue({
          tag_id: '',
          tag_name: '',
          description: '',
          tag_color: '#ff1939',
          font_color: '#ffffff',
          front_show: '0'
        })
      }
      if (TagFormApi.resetFields) {
        TagFormApi.resetFields()
      }
      this.show_sideBar = true
    },
    resetData() {
      this.editingTagId = ''
      this.form = {
        tag_id: '',
        tag_name: '',
        tag_color: '#ff1939',
        font_color: '#ffffff',
        description: '',
        front_show: '0'
      }
    },
    editAction(index, row) {
      const frontShow = this.normalizeFrontShow(row.front_show)
      this.editingTagId = row.tag_id
      this.form = {
        tag_id: row.tag_id,
        tag_name: row.tag_name,
        tag_color: row.tag_color,
        font_color: row.font_color,
        description: row.description || '',
        front_show: frontShow
      }
      this.show_sideBar = true
      this.$nextTick(() => {
        TagFormApi.setFieldsValue({
          tag_id: row.tag_id,
          tag_name: row.tag_name,
          description: row.description || '',
          tag_color: row.tag_color,
          font_color: row.font_color,
          front_show: frontShow
        })
      })
    },
    preview(index, row) {
      // 预览弹框
      this.dialogVisible = true
      this.dataInfo = row
    },
    deleteAction(index, row) {
      this.$confirm(this.$t('e1bd2c70.38c88c'), this.$t('e1bd2c70.02d981'), {
        confirmButtonText: this.$t('e1bd2c70.38cf16'),
        cancelButtonText: this.$t('e1bd2c70.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deleteTag(row.tag_id)
            .then((response) => {
              this.$message({
                message: this.$t('e1bd2c70.0007d1'),
                type: 'success',
                duration: 5 * 1000
              })
              this.$refs.finder.refresh()
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$t('e1bd2c70.acf066')
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('e1bd2c70.2111cc')
          })
        })
    },
    getTaskTime(strDate) {
      let date = new Date(strDate)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let str = y + '-' + m + '-' + d
      return str
    },
    getTimeStr(date) {
      return this.getTaskTime(new Date(parseInt(date) * 1000))
    },
    async handleFormSubmit() {
      try {
        await TagFormApi.validate()
        const formData = TagFormApi.getFieldsValue()
        this.onFormSubmit(formData)
      } catch (error) {
        // 验证失败
      }
    },
    onFormSubmit(formData) {
      const tagId = this.editingTagId
      const submitData = {
        ...this.form,
        ...formData,
        tag_id: tagId,
        front_show: this.normalizeFrontShow(
          formData.front_show != null ? formData.front_show : this.form.front_show
        )
      }
      if (tagId) {
        updateTag(submitData).then((res) => {
          if (res.data.data) {
            this.$message({
              type: 'success',
              message: this.$t('e1bd2c70.3b1083')
            })
            this.show_sideBar = false
            this.$refs.finder.refresh()
            this.openTranslate(submitData.tag_id, ['tag_name'], [submitData.tag_name || ''])
          }
        })
      } else {
        saveTag(submitData).then((res) => {
          if (res.data.data) {
            this.$message({
              type: 'success',
              message: this.$t('e1bd2c70.3b1083')
            })
            this.show_sideBar = false
            this.$refs.finder.refresh()
            // 创建/编辑保持一致：弹「同步翻译」弹框
            const newTagId = (res.data.data && (res.data.data.tag_id || res.data.data.id)) || 0
            if (newTagId) {
              this.openTranslate(newTagId, ['tag_name'], [submitData.tag_name || ''])
            }
          }
        })
      }
    },
    onTranslateDone() {},
    // 列表页内嵌表单：仅保存/取消停留在当前列表页
    goBackTranslateList() {}
  }
}
</script>
<style scoped lang="scss">
.tag {
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 12px;
  line-height: 1;
}
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
