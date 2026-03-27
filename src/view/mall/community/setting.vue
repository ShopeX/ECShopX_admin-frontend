<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" scoped>
.sp-form {
  margin-top: 24px;
}
.sp-finder {
  margin-top: 8px;
}
</style>
<template>
  <SpPage>
    <el-tabs type="card">
      <el-tab-pane :label="$t('580ee024.9f50b5')">
        <SpForm v-model="form" :form-list="formList" @onSubmit="onSaveConfig" />
      </el-tab-pane>
      <el-tab-pane :label="$t('580ee024.44f092')">
        <SpFinder
          ref="finder"
          no-selection
          :setting="setting"
          url="/community/chief/apply_fields"
        />

        <!-- 团长注册配置 -->
        <SpDialog
          ref="registerDialogRef"
          v-model="registerDialog"
          :title="registerForm.id ? $t('580ee024.5117bc') : $t('580ee024.11e5e6')"
          :form="registerForm"
          :form-list="registerFormList"
          @onSubmit="onResisterSubmit"
        />
      </el-tab-pane>
    </el-tabs>
  </SpPage>
</template>

<script>
import { mapGetters } from 'vuex'
import { createSetting } from '@shopex-ui/finder'
import invitationCode from './comps/invitationCode'
import { i18n } from '@/i18n'
export default {
  components: {
    invitationCode
  },
  data() {
    return {
      form: {
        condition_type: 'num',
        condition_money: '',
        chief_desc: '',
        rebate_ratio: 0,
        aggrement: '',
        explanation: ''
      },
      formList: [
        {
          label: i18n.t('580ee024.f19a0a'),
          key: 'condition_type',
          type: 'radio',
          options: [
            { label: 'num', name: i18n.t('580ee024.ddab8f') },
            { label: 'money', name: i18n.t('580ee024.88a7bd') }
          ],
          tip: i18n.t('580ee024.ad18f6'),
          onChange: (e) => {
            if (e == 'num') {
              this.formList[0].tip = i18n.t('580ee024.ad18f6')
              this.formList[1].isShow = false
            } else {
              this.formList[0].tip = i18n.t('580ee024.26ddc2')
              this.formList[1].isShow = true
            }
          }
        },
        {
          label: i18n.t('580ee024.bedf3a'),
          key: 'condition_money',
          type: 'input',
          placeholder: i18n.t('580ee024.dec47c'),
          required: true,
          message: i18n.t('580ee024.281bad'),
          isShow: false
        },
        {
          label: i18n.t('580ee024.b144d3'),
          key: 'invitation_code',
          component: () => <invitationCode info={this.wxCode} />
          // component: () => import("./comps/invitationCode.vue")
        },
        {
          label: i18n.t('580ee024.ddc682'),
          key: 'chief_desc',
          type: 'text'
        },
        {
          label: i18n.t('580ee024.d7564d'),
          key: 'rebate_ratio',
          type: 'input',
          append: '%',
          placeholder: i18n.t('580ee024.127fb3'),
          tip: i18n.t('580ee024.e0b288')
        },
        {
          label: i18n.t('580ee024.dd530f'),
          key: 'aggrement',
          type: 'richText',
          required: true,
          message: i18n.t('580ee024.281bad')
        },
        {
          label: i18n.t('580ee024.11a242'),
          key: 'explanation',
          type: 'richText',
          required: true,
          message: i18n.t('580ee024.281bad')
        }
      ],
      tableData: [],
      setting: createSetting({
        actions: [
          {
            name: i18n.t('580ee024.80e2ca'),
            key: 'detail',
            type: 'button',
            slot: 'header',
            buttonType: 'primary is-plain',
            action: {
              handler: async (val) => {
                this.registerForm = {
                  id: '',
                  label: '',
                  field_type: 1,
                  alert_required_message: ''
                }
                this.$refs.registerDialogRef.resetForm()
                this.registerDialog = true
              }
            }
          },
          {
            name: i18n.t('580ee024.95b351'),
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                this.registerForm.id = row.id
                this.registerForm.label = row.label
                this.registerForm.field_type = row.field_type
                this.registerForm.alert_required_message = row.alert_required_message
                this.registerDialog = true
              }
            }
          },
          {
            name: i18n.t('580ee024.2f4aad'),
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                await this.$confirm(this.$t('580ee024.247048'), this.$t('580ee024.02d981'))
                await this.$api.community.deleteCommunityField(row.id)
                this.$refs.finder.refresh()
              }
            }
          }
        ],
        columns: [
          { name: i18n.t('580ee024.d8c7e0'), key: 'label' },
          {
            name: i18n.t('580ee024.53c3dd'),
            key: 'is_open',
            render: (h, { row }) =>
              h('el-switch', {
                props: {
                  value: row.is_open,
                  'active-value': 1,
                  'inactive-value': 0
                },
                on: {
                  change: async (e) => {
                    await this.$api.community.modifyFieldSwitch(row.id, {
                      type: 1,
                      switch: e
                    })
                    row.is_open = e
                  }
                }
              })
          },
          {
            name: i18n.t('580ee024.537b39'),
            key: 'is_required',
            render: (h, { row }) =>
              h('el-switch', {
                props: {
                  value: row.is_required,
                  'active-value': 1,
                  'inactive-value': 0
                },
                on: {
                  change: async (e) => {
                    await this.$api.community.modifyFieldSwitch(row.id, {
                      type: 2,
                      switch: e
                    })
                    row.is_required = e
                  }
                }
              })
          },
          {
            name: i18n.t('580ee024.60d801'),
            key: 'is_edit',
            render: (h, { row }) =>
              h('el-switch', {
                props: {
                  value: row.is_edit,
                  'active-value': 1,
                  'inactive-value': 0
                },
                on: {
                  change: async (e) => {
                    await this.$api.community.modifyFieldSwitch(row.id, {
                      type: 3,
                      switch: e
                    })
                    row.is_edit = e
                  }
                }
              })
          },
          { name: i18n.t('580ee024.aba785'), key: 'field_type_desc' },
          { name: i18n.t('580ee024.9df451'), key: 'alert_required_message' }
        ]
      }),
      registerDialog: false,
      registerForm: {
        id: '',
        label: '',
        field_type: 1,
        alert_required_message: ''
      },
      registerFormList: [
        {
          label: i18n.t('580ee024.9c6a53'),
          key: 'label',
          type: 'input',
          placeholder: i18n.t('580ee024.96641a'),
          required: true,
          message: i18n.t('580ee024.281bad')
        },
        {
          label: i18n.t('580ee024.aba785'),
          key: 'field_type',
          placeholder: i18n.t('580ee024.8d77f8'),
          type: 'select',
          options: [
            { title: i18n.t('580ee024.97d076'), value: 1 },
            // { title: '数字', value: 2 },
            { title: i18n.t('580ee024.4ff1e7'), value: 3 },
            // { title: '单选项', value: 4 },
            // { title: '复选框', value: 5 },
            { title: i18n.t('580ee024.8098e2'), value: 6 },
            { title: i18n.t('580ee024.20def7'), value: 7 }
          ],
          required: true,
          message: i18n.t('580ee024.281bad'),
          onChange: (e) => {
            if (e == 12) {
              this.cancelOrderFormList[1].isShow = true
            } else {
              this.cancelOrderFormList[1].isShow = false
            }
          }
        },
        {
          label: i18n.t('580ee024.9df451'),
          key: 'alert_required_message',
          type: 'input',
          placeholder: i18n.t('580ee024.eb7d66'),
          required: true,
          message: i18n.t('580ee024.281bad')
        }
      ],
      wxCode: ''
    }
  },
  computed: {
    ...mapGetters(['shopId'])
  },
  created() {},
  mounted() {
    this.getActivitySetting()
    this.getCommunityChiefApplyFields()
    this.getChiefWxCode()
  },
  methods: {
    async onSaveConfig() {
      const { condition_type, condition_money, rebate_ratio, aggrement, explanation } = this.form
      await this.$api.community.modifyActivitySetting({
        condition_type,
        condition_money,
        rebate_ratio,
        aggrement,
        explanation
      })
      this.$message.success(this.$t('580ee024.69be67'))
    },
    async getActivitySetting() {
      const { condition_money, condition_type, aggrement, explanation, rebate_ratio } =
        await this.$api.community.getActivitySetting()
      this.form = {
        condition_type,
        condition_money,
        chief_desc: this.$t('580ee024.7e29e8'),
        rebate_ratio,
        aggrement,
        explanation
      }
      if (condition_type == 'money') {
        this.formList[0].tip = i18n.t('580ee024.26ddc2')
        this.formList[1].isShow = true
      }
    },
    async getCommunityChiefApplyFields() {
      const res = await this.$api.community.getActivitySetting()
    },
    async onResisterSubmit() {
      const params = {
        ...this.registerForm
      }
      if (this.registerForm.id) {
        await this.$api.community.modifyCommunityField(params)
      } else {
        await this.$api.community.createCommunityChiefApplyFields(params)
      }
      this.registerDialog = false
      this.$refs.finder.refresh()
    },
    async getChiefWxCode() {
      const params = {
        // wxaAppId: 'wx3e1c17c88abf3e45',
        distributor_id: this.shopId,
        path: 'subpages/community/apply-chief'
      }
      const { base64Image } = await this.$api.community.getChiefWxCode(params)
      this.wxCode = base64Image
    }
  }
}
</script>
