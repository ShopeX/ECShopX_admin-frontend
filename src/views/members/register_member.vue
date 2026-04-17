<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane :label="$t('f7e8c15b.3a4128')" name="first">
        <div class="action-container">
          <el-button type="primary" plain @click="showAddDialog()">
            {{ $t('f7e8c15b.80e2ca') }}
          </el-button>
        </div>
        <SpFinder
          ref="configFinder"
          :setting="configFinderSetting"
          url="/espier/config/request_fields"
          no-selection
          :hooks="{
            beforeSearch: beforeConfigSearch,
            afterSearch: afterConfigSearch
          }"
        />
      </el-tab-pane>

      <el-tab-pane :label="$t('f7e8c15b.f33fb2')" name="second">
        <SpFormPlus
          ref="registerAgreementForm"
          v-model="registerAgreementData"
          :form-items="registerAgreementItems"
          form-type="form"
          @submit="savePrivacyForms"
        />
      </el-tab-pane>

      <el-tab-pane :label="$t('f7e8c15b.2d5360')" name="third">
        <SpFormPlus
          ref="medicineForm"
          class="mt-10"
          v-model="medicineData"
          :form-items="medicineFormItems"
          form-type="form"
          @submit="saveMedicineForm"
        />
      </el-tab-pane>
    </el-tabs>

    <!-- 编辑弹窗 -->
    <el-dialog
      :visible.sync="showEditDialog"
      :title="dialogTitleI18n"
      width="600px"
      @close="handleDialogClose"
    >
      <SpFormPlus
        ref="editForm"
        v-model="editData"
        :form-items="editFormItems"
        :show-default-actions="false"
        form-type="form"
        label-width="120px"
      />

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">{{ $t('f7e8c15b.625fb2') }}</el-button>
        <el-button type="primary" @click="handleDialogConfirm">{{
          $t('f7e8c15b.e83a25')
        }}</el-button>
      </span>
    </el-dialog>
  </SpPage>
</template>

<script>
import { createSetting } from '@shopex-ui/finder'
import { createRegForm, updateRegForm, deleteRegForm } from '@/api/member'
import { useForm } from '@/composables'

const typeList = [
  { name: '文本', type: 1 },
  { name: '数字', type: 2 },
  { name: '日期', type: 3 },
  { name: '单选', type: 4 },
  { name: '复选框', type: 5 },
  { name: '手机号', type: 6 }
]

const [Form, FormApi] = useForm({
  formItems: [
    {
      fieldName: 'label',
      formItemClass: 'w-2/3',
      label: '配置标题',
      component: 'input',
      componentProps: {
        maxlength: 9,
        showWordLimit: true
      },
      rules: [{ required: true, message: '请输入标题', trigger: 'blur' }]
    },
    {
      fieldName: 'field_type',
      formItemClass: 'w-2/3',
      label: '信息格式',
      component: 'select',
      componentProps: {
        options: typeList.map((item) => ({
          label: item.name,
          value: item.type
        })),
        onChange: (value, formData) => {
          debugger
        }
      },
      rules: [{ required: true, message: '请选择信息格式', trigger: 'change' }]
    },
    {
      fieldName: 'range',
      label: '数值范围',
      component: ({ h, value, onInput }) => {
        return h('div', { class: 'range-inputs' }, [
          h('el-input', {
            props: {
              value: value.start,
              type: 'number',
              placeholder: '最小值'
            },
            style: { width: '45%' },
            on: {
              input: (val) => onInput({ ...value, start: val })
            }
          }),
          h('span', { style: { margin: '0 10px' } }, ' - '),
          h('el-input', {
            props: {
              value: value.end,
              type: 'number',
              placeholder: '最大值'
            },
            style: { width: '45%' },
            on: {
              input: (val) => onInput({ ...value, end: val })
            }
          })
        ])
      },
      rules: [
        {
          required: true,
          validator: (rule, value, callback) => {
            if (!value.start || !value.end || value.start >= value.end) {
              callback(new Error('请输入正确的数字范围'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      isShow: (item, formData) => {
        debugger
        return formData.field_type === 2
      }
    },
    {
      fieldName: 'alert_required_message',
      formItemClass: 'w-2/3',
      label: '提示文案',
      component: 'input',
      componentProps: {
        maxlength: 15,
        showWordLimit: true
      },
      rules: [{ required: true, message: '请输入提示语', trigger: 'blur' }]
    }
  ],
  showDefaultActions: false
})

export default {
  data() {
    return {
      activeName: 'first',

      // 弹窗配置
      showEditDialog: false,
      dialogConfig: {
        title: 'edit' // 'edit' | 'add', use dialogTitleI18n for display
      },

      // 编辑表单数据
      editData: {
        module_type: 1,
        label: '',
        field_type: 1,
        alert_required_message: '',
        is_required: 0,
        is_edit: 1,
        range: { start: '', end: '' },
        radio_list: []
      },

      // 选项临时数据
      tempSelectOption: { label: '' },

      // 注册协议表单数据
      registerAgreementData: {
        register_title: '',
        register_content: '',
        privacy_title: '',
        privacy_content: ''
      },

      // 医疗表单数据
      medicineData: {
        title: '',
        content: ''
      }
    }
  },
  computed: {
    dialogTitleI18n() {
      return this.dialogConfig.title === 'add'
        ? this.$t('f7e8c15b.80e2ca')
        : this.$t('f7e8c15b.5117bc')
    },
    // 配置表格设置
    configFinderSetting() {
      return createSetting({
        columns: [
          { name: this.$t('f7e8c15b.d8c7e0'), key: 'label' },
          {
            name: this.$t('f7e8c15b.53c3dd'),
            key: 'is_open',
            width: 120,
            render: (h, { row }) => {
              return h('el-switch', {
                props: {
                  value: !!row.is_open,
                  disabled: !!row.is_must_start_required
                },
                on: {
                  change: () => this.toggleFieldStatus(row)
                }
              })
            }
          },
          {
            name: this.$t('f7e8c15b.aba785'),
            key: 'field_type',
            width: 120,
            render: (h, { row }) => {
              const type = typeList.find((item) => item.type === row.field_type)
              return h('span', type ? this.getTypeName(type.type) : this.$t('f7e8c15b.1622dc'))
            }
          },
          { name: this.$t('f7e8c15b.9df451'), key: 'alert_required_message' }
        ],
        actions: [
          {
            name: this.$t('f7e8c15b.95b351'),
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([row]) => this.showAddDialog(row)
            }
          },
          {
            name: this.$t('f7e8c15b.2f4aad'),
            type: 'button',
            buttonType: 'text',
            visible: (row) => !this.VERSION_SHUYUN() && row.is_default != 1, // 非默认字段才显示删除按钮
            action: {
              handler: ([row]) => this.deleteField(row)
            }
          }
        ]
      })
    },

    // 编辑表单配置
    editFormItems() {
      const items = [
        {
          fieldName: 'label',
          formItemClass: 'w-2/3',
          label: this.$t('f7e8c15b.9c6a53'),
          component: 'input',
          componentProps: {
            maxlength: 9,
            showWordLimit: true
          },
          rules: [{ required: true, message: this.$t('f7e8c15b.96641a'), trigger: 'blur' }]
        },
        {
          fieldName: 'field_type',
          formItemClass: 'w-2/3',
          label: this.$t('f7e8c15b.aba785'),
          component: 'select',
          componentProps: {
            options: typeList.map((item) => ({
              label: this.getTypeName(item.type),
              value: item.type
            }))
          },
          rules: [{ required: true, message: this.$t('f7e8c15b.8d77f8'), trigger: 'change' }]
        },
        {
          fieldName: 'range',
          label: this.$t('f7e8c15b.b7d43b'),
          component: ({ h, value, onInput }) => {
            return h('div', { class: 'range-inputs' }, [
              h('el-input', {
                props: {
                  value: value.start,
                  type: 'number',
                  placeholder: this.$t('f7e8c15b.c322ed')
                },
                style: { width: '45%' },
                on: {
                  input: (val) => onInput({ ...value, start: val })
                }
              }),
              h('span', { style: { margin: '0 10px' } }, ' - '),
              h('el-input', {
                props: {
                  value: value.end,
                  type: 'number',
                  placeholder: this.$t('f7e8c15b.5da893')
                },
                style: { width: '45%' },
                on: {
                  input: (val) => onInput({ ...value, end: val })
                }
              })
            ])
          },
          rules: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (!value.start || !value.end || value.start >= value.end) {
                  callback(new Error(this.$t('f7e8c15b.57ac99')))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ]
        },
        {
          fieldName: 'alert_required_message',
          formItemClass: 'w-2/3',
          label: this.$t('f7e8c15b.9df451'),
          component: 'input',
          componentProps: {
            maxlength: 15,
            showWordLimit: true
          },
          rules: [{ required: true, message: this.$t('f7e8c15b.b91aba'), trigger: 'blur' }]
        }
      ]

      // 单选/复选添加选项配置
      if (this.editData.field_type === 4 || this.editData.field_type === 5) {
        items.splice(-1, 0, {
          fieldName: 'radio_list',
          label: this.$t('f7e8c15b.e7f1b8'),
          component: ({ h, value, onInput }) => {
            return h('div', [
              h('div', { class: 'option-input', style: { marginBottom: '10px' } }, [
                h('el-input', {
                  props: {
                    value: this.tempSelectOption.label,
                    placeholder: this.$t('f7e8c15b.2d711b'),
                    maxlength: 10,
                    showWordLimit: true
                  },
                  style: { width: 'calc(100% - 80px)' },
                  on: {
                    input: (val) => {
                      this.tempSelectOption.label = val
                    }
                  }
                }),
                h(
                  'el-button',
                  {
                    props: {
                      type: 'primary',
                      disabled: !this.tempSelectOption.label
                    },
                    style: { marginLeft: '10px' },
                    on: {
                      click: () => this.addOption(onInput, value)
                    }
                  },
                  this.$t('f7e8c15b.e83a25')
                )
              ]),
              h(
                'div',
                { class: 'option-tags' },
                value.map((item, index) =>
                  h(
                    'el-tag',
                    {
                      key: item.key || index,
                      props: {
                        closable: true
                      },
                      style: { marginRight: '5px', marginBottom: '5px' },
                      on: {
                        close: () => this.removeOption(index, onInput, value)
                      }
                    },
                    item.label
                  )
                )
              )
            ])
          }
        })
      }

      return items
    },

    // 注册协议表单配置
    registerAgreementItems() {
      return [
        {
          label: this.$t('f7e8c15b.3c0397'),
          component: 'group'
        },
        {
          fieldName: 'register_title',
          label: this.$t('f7e8c15b.206057'),
          formItemClass: 'w-2/3',
          component: 'input',
          componentProps: {
            placeholder: this.$t('f7e8c15b.206057'),
            maxlength: 15,
            showWordLimit: true
          },
          rules: [{ required: true, message: this.$t('f7e8c15b.0c6dc4'), trigger: 'blur' }]
        },
        {
          fieldName: 'register_content',
          label: this.$t('f7e8c15b.3c0397'),
          component: ({ h, value, onInput }) => {
            return h('SpRichText', {
              props: { value },
              on: { input: onInput }
            })
          },
          rules: [{ required: true, message: this.$t('f7e8c15b.bb76f9'), trigger: 'blur' }]
        },
        {
          label: this.$t('f7e8c15b.b0d560'),
          component: 'group'
        },
        {
          fieldName: 'privacy_title',
          formItemClass: 'w-2/3',
          label: this.$t('f7e8c15b.f0002d'),
          component: 'input',
          componentProps: {
            placeholder: this.$t('f7e8c15b.f0002d'),
            maxlength: 15,
            showWordLimit: true
          },
          rules: [{ required: true, message: this.$t('f7e8c15b.0c6dc4'), trigger: 'blur' }]
        },
        {
          fieldName: 'privacy_content',
          label: this.$t('f7e8c15b.cc953a'),
          component: ({ h, value, onInput }) => {
            return h('SpRichText', {
              props: { value },
              on: { input: onInput }
            })
          },
          rules: [{ required: true, message: this.$t('f7e8c15b.77239a'), trigger: 'blur' }]
        }
      ]
    },

    // 医疗表单配置
    medicineFormItems() {
      return [
        {
          fieldName: 'title',
          formItemClass: 'w-1/3',
          label: this.$t('f7e8c15b.32c65d'),
          component: 'input',
          componentProps: {
            placeholder: this.$t('f7e8c15b.362bbb')
          },
          rules: [{ required: true, message: this.$t('f7e8c15b.96641a'), trigger: 'blur' }]
        },
        {
          fieldName: 'content',
          label: this.$t('f7e8c15b.2d711b'),
          component: ({ h, value, onInput }) => {
            return h('SpRichText', {
              props: { value },
              on: { input: onInput }
            })
          },
          rules: [{ required: true, message: this.$t('f7e8c15b.a11cc7'), trigger: 'blur' }]
        }
      ]
    }
  },

  mounted() {
    this.getShopRules()
  },

  methods: {
    getTypeName(typeNum) {
      const map = {
        1: 'f7e8c15b.97d076',
        2: 'f7e8c15b.55d479',
        3: 'f7e8c15b.4ff1e7',
        4: 'f7e8c15b.9fd1b7',
        5: 'f7e8c15b.db98f8',
        6: 'f7e8c15b.8098e2'
      }
      return this.$t(map[typeNum] || 'f7e8c15b.1622dc')
    },

    // 配置表格搜索前钩子
    beforeConfigSearch(params) {
      return {
        ...params,
        module_type: 1,
        id: -1
      }
    },

    // 配置表格搜索后钩子
    afterConfigSearch(result) {
      return result
    },

    // 切换字段状态
    async toggleFieldStatus(row) {
      await this.$api.member.toggleRegForm({
        id: row.id,
        type: 1,
        switch: row.is_open === 0 ? 1 : 0
      })
      this.$refs.configFinder.refresh()
    },

    // 显示添加/编辑弹窗
    async showAddDialog(item) {
      debugger
      await this.$dialog.open({
        title: item ? '编辑' : '新增',
        size: 'small',
        content: <Form />,
        confirmBefore: async () => {
          try {
            await this.$refs.changePasswordForm.onSubmit()
            setTimeout(async () => {
              this.handleLogout()
            }, 1000)
          } catch (error) {
            throw new Error(error)
          }
        }
      })

      // if (editInfo.id) {
      //   // 编辑模式
      //   this.editData = {
      //     id: editInfo.id,
      //     module_type: editInfo.module_type || 1,
      //     label: editInfo.label || '',
      //     field_type: editInfo.field_type || 1,
      //     alert_required_message: editInfo.alert_required_message || '',
      //     is_required: 0,
      //     is_edit: 1,
      //     range: editInfo.range || { start: '', end: '' },
      //     radio_list: [...(editInfo.validate_condition || [])]
      //   }
      //   this.dialogConfig.title = '编辑配置'
      // } else {
      //   // 新增模式
      //   this.editData = {
      //     module_type: 1,
      //     label: '',
      //     field_type: 1,
      //     alert_required_message: '',
      //     is_required: 0,
      //     is_edit: 1,
      //     range: { start: '', end: '' },
      //     radio_list: []
      //   }
      //   this.dialogConfig.title = '新增配置'
      // }
      // this.tempSelectOption = { label: '' }
      // this.showEditDialog = true
    },

    // 删除字段
    deleteField(row) {
      this.$confirm(this.$t('f7e8c15b.664d9f'), this.$t('f7e8c15b.02d981'), {
        confirmButtonText: this.$t('f7e8c15b.38cf16'),
        cancelButtonText: this.$t('f7e8c15b.625fb2'),
        type: 'warning'
      }).then(async () => {
        await deleteRegForm({ id: row.id })
        this.$message.success(this.$t('f7e8c15b.fc9bdd'))
        this.$refs.configFinder.refresh(true)
      })
    },

    // 添加选项
    addOption(onInput, value) {
      if (!this.tempSelectOption.label) {
        this.$message.warning(this.$t('f7e8c15b.4fa229'))
        return
      }
      const newOptions = [...value, { ...this.tempSelectOption }]
      onInput(newOptions)
      this.tempSelectOption = { label: '' }
    },

    // 移除选项
    removeOption(index, onInput, value) {
      const newOptions = [...value]
      newOptions.splice(index, 1)
      onInput(newOptions)
    },

    // 弹窗关闭
    handleDialogClose() {
      this.showEditDialog = false
    },

    // 弹窗确认
    async handleDialogConfirm() {
      try {
        const formData = await this.$refs.editForm.validate()

        if (!this.editData.id) {
          await createRegForm(this.editData)
        } else {
          await updateRegForm(this.editData)
        }

        this.$message.success(this.$t('f7e8c15b.3b1083'))
        this.$refs.configFinder.refresh(true)
        this.showEditDialog = false
      } catch (error) {
        console.error('表单验证失败:', error)
      }
    },

    // 获取商城协议
    async getShopRules() {
      try {
        const { member_register, privacy, ehospital_risk_informed } =
          await this.$api.members.getShopsProtocol()
        this.registerAgreementData = {
          register_title: member_register?.title,
          register_content: member_register?.content,
          privacy_title: privacy?.title,
          privacy_content: privacy?.content
        }
        // 医疗表单数据
        this.medicineData = {
          title: ehospital_risk_informed?.title,
          content: ehospital_risk_informed?.content
        }
      } catch (error) {
        console.error('获取协议失败:', error)
      }
    },

    // 保存隐私协议表单
    async savePrivacyForms() {
      try {
        await this.$api.members.updateShopsProtocol({
          data: [
            {
              type: 'member_register',
              title: this.registerAgreementData.register_title,
              content: this.registerAgreementData.register_content
            },
            {
              type: 'privacy',
              title: this.registerAgreementData.privacy_title,
              content: this.registerAgreementData.privacy_content
            }
          ]
        })
        this.$message.success(this.$t('f7e8c15b.3b1083'))
      } catch (error) {
        console.error('表单验证失败:', error)
      }
    },

    // 保存医疗表单
    async saveMedicineForm() {
      try {
        await this.$api.members.updateShopsProtocol({
          data: [
            {
              type: 'ehospital_risk_informed',
              ...this.medicineData
            }
          ]
        })
        this.$message.success(this.$t('f7e8c15b.3b1083'))
      } catch (error) {
        console.error('保存失败:', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
