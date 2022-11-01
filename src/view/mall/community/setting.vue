<style lang="scss" scoped>
.sp-form {
  margin-top: 24px;
}
.sp-finder {
  margin-top: 8px;
}
</style>
<template>
  <el-tabs type="card">
    <el-tab-pane label="社区团配置">
      <SpForm
        v-model="form"
        :form-list="formList"
        @onSubmit="onSaveConfig"
      />
    </el-tab-pane>
    <el-tab-pane label="团长注册项配置">
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
        :title="`${registerForm.id ? '编辑配置' : '添加配置'}`"
        :form="registerForm"
        :form-list="registerFormList"
        @onSubmit="onResisterSubmit"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { mapGetters } from 'vuex'
import { createSetting } from '@shopex/finder'
import invitationCode from './comps/invitationCode'
export default {
  components: {
    invitationCode
  },
  data () {
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
          label: '成团条件',
          key: 'condition_type',
          type: 'radio',
          options: [
            { label: 'num', name: '按商品数量' },
            { label: 'money', name: '按成团金额' }
          ],
          tip: '说明：按活动商品设置的起订量成团，0为不限制',
          onChange: (e) => {
            if (e == 'num') {
              this.formList[0].tip = '说明：按活动商品设置的起订量成团，0为不限制'
              this.formList[1].isShow = false
            } else {
              this.formList[0].tip = '说明：整团成团最低金额，0为不限制'
              this.formList[1].isShow = true
            }
          }
        },
        {
          label: '最低成团金额(元)',
          key: 'condition_money',
          type: 'input',
          placeholder: '请输入成团金额',
          required: true,
          message: '不能为空',
          isShow: false
        },
        {
          label: '团长邀请码',
          key: 'invitation_code',
          component: () => <invitationCode info={this.wxCode} />
          // component: () => import("./comps/invitationCode.vue")
        },
        {
          label: '团长申请页',
          key: 'chief_desc',
          type: 'text'
        },
        {
          label: '佣金设置',
          key: 'rebate_ratio',
          type: 'input',
          append: '%',
          placeholder: '佣金比列',
          tip: '团长根据成团金额按百分比例获取佣金，设置为0时则不计算佣金'
        },
        {
          label: '团长注册协议',
          key: 'aggrement',
          type: 'richText',
          required: true,
          message: '不能为空'
        },
        {
          label: '申请页说明',
          key: 'explanation',
          type: 'richText',
          required: true,
          message: '不能为空'
        }
      ],
      tableData: [],
      setting: createSetting({
        actions: [
          {
            name: '新增配置',
            key: 'detail',
            type: 'button',
            slot: 'header',
            buttonType: 'primary is-plain',
            action: {
              handler: async (val) => {
                this.registerForm.id = ''
                this.$refs.registerDialogRef.resetForm()
                this.registerDialog = true
              }
            }
          },
          {
            name: '编辑',
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
            name: '删除',
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                await this.$confirm('是否删除', '提示')
                await this.$api.community.deleteCommunityField(row.id)
                this.$refs.finder.refresh()
              }
            }
          }
        ],
        columns: [
          { name: '信息', key: 'label' },
          {
            name: '是否启用',
            key: 'is_open',
            render: (h, { row }) =>
              h('el-switch', {
                props: {
                  'value': row.is_open,
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
            name: '必填',
            key: 'is_required',
            render: (h, { row }) =>
              h('el-switch', {
                props: {
                  'value': row.is_required,
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
            name: '可修改',
            key: 'is_edit',
            render: (h, { row }) =>
              h('el-switch', {
                props: {
                  'value': row.is_edit,
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
          { name: '信息格式', key: 'field_type_desc' },
          { name: '提示文案', key: 'alert_required_message' }
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
          label: '配置标题:',
          key: 'label',
          type: 'input',
          placeholder: '请输入标题',
          required: true,
          message: '不能为空'
        },
        {
          label: '信息格式:',
          key: 'field_type',
          placeholder: '请选择信息格式',
          type: 'select',
          options: [
            { title: '文本', value: 1 },
            // { title: '数字', value: 2 },
            { title: '日期', value: 3 },
            // { title: '单选项', value: 4 },
            // { title: '复选框', value: 5 },
            { title: '手机号', value: 6 },
            { title: '图片', value: 7 }
          ],
          required: true,
          message: '不能为空',
          onChange: (e) => {
            if (e == 12) {
              this.cancelOrderFormList[1].isShow = true
            } else {
              this.cancelOrderFormList[1].isShow = false
            }
          }
        },
        {
          label: '提示文案:',
          key: 'alert_required_message',
          type: 'input',
          placeholder: '请输入提示文案',
          required: true,
          message: '不能为空'
        }
      ],
      wxCode: ''
    }
  },
  computed: {
    ...mapGetters(['shopId'])
  },
  created () {},
  mounted () {
    this.getActivitySetting()
    this.getCommunityChiefApplyFields()
    this.getChiefWxCode()
  },
  methods: {
    async onSaveConfig () {
      const { condition_type, condition_money, rebate_ratio, aggrement, explanation } = this.form
      await this.$api.community.modifyActivitySetting({
        condition_type,
        condition_money,
        rebate_ratio,
        aggrement,
        explanation
      })
      this.$message.success('修改成功')
    },
    async getActivitySetting () {
      const { condition_money, condition_type, aggrement, explanation, rebate_ratio } =
        await this.$api.community.getActivitySetting()
      this.form = {
        condition_type,
        condition_money,
        chief_desc:
          '您可在模板编辑-热区图组件-设置路径，选择团长申请页面路径供用户在店铺首页进入团长申请页面',
        rebate_ratio,
        aggrement,
        explanation
      }
      if (condition_type == 'money') {
        this.formList[0].tip = '说明：整团成团最低金额，0为不限制'
        this.formList[1].isShow = true
      }
    },
    async getCommunityChiefApplyFields () {
      const res = await this.$api.community.getActivitySetting()
    },
    async onResisterSubmit () {
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
    async getChiefWxCode () {
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
