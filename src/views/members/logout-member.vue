<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <SpPage class="closeAccount">
    <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="注销配置" name="first">
        <SpFormPlus
          ref="logoutConfigForm"
          class="mt-10"
          v-model="logoutConfigData"
          :form-items="logoutConfigItems"
          form-type="form"
          @submit="handleSubmitLogoutConfig"
        />
      </el-tab-pane>

      <el-tab-pane label="注销协议" name="second">
        <SpFormPlus
          ref="privacyForm"
          class="mt-10"
          v-model="privacyData"
          :form-items="privacyFormItems"
          form-type="form"
          @submit="handleSubmitPrivacy"
        />
      </el-tab-pane>
    </el-tabs>
  </SpPage>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      activeName: 'first',
      // 注销配置表单数据
      logoutConfigData: {
        title: '订单完成之前，无法注销会员。如有疑问，请联系客服',
        new_rights: '0'
      },
      // 注销协议表单数据
      privacyData: {
        update_date: '',
        take_effect_date: '',
        content: ''
      }
    }
  },
  computed: {
    // 注销配置表单配置
    logoutConfigItems() {
      return [
        {
          fieldName: 'title',
          formItemClass: 'w-2/3',
          label: '注销提示文案',
          component: 'input',
          componentProps: {
            type: 'textarea',
            placeholder: '请输入内容',
            maxlength: 50,
            showWordLimit: true,
            autosize: { minRows: 3 },
            style: { width: '500px' }
          },
          tip: `有未完成的订单用户点击注销会员时提示`
        },
        ...(this.VERSION_IN_PURCHASE()
          ? []
          : [
              {
                fieldName: 'new_rights',
                formItemClass: 'w-2/3',
                label: '享受新人权益',
                component: 'select',
                componentProps: {
                  placeholder: '请选择',
                  options: [
                    { label: '是', value: '1' },
                    { label: '否', value: '0' }
                  ]
                },
                tip: `用户注销会员后重新注册是否享受新人权益`
              }
            ])
      ]
    },
    // 注销协议表单配置
    privacyFormItems() {
      return [
        {
          formItemClass: 'w-2/3',
          component: () => (
            <el-alert
              class='leading-normal'
              title='注销协议内容修改后，提交后对线上客户生效；注销协议在客户注销账号时须同意才可继续注销。'
              type='warning'
              show-icon
              closable={false}
            />
          )
        },
        {
          fieldName: 'update_date',
          formItemClass: 'w-1/3',
          label: '更新日期',
          component: 'datepicker',
          componentProps: {
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            placeholder: '选择日期'
          }
        },
        {
          fieldName: 'take_effect_date',
          formItemClass: 'w-1/3',
          label: '生效日期',
          component: 'datepicker',
          componentProps: {
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            placeholder: '选择日期'
          }
        },
        {
          fieldName: 'content',
          label: '内容',
          component: ({ h, value, onInput }) => {
            return h('SpRichText', {
              props: {
                value: value,
                height: '400px'
              },
              on: {
                input: onInput
              }
            })
          },
          rules: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (!value || value.length === 0) {
                  callback(new Error('请填写内容'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ]
        }
      ]
    }
  },
  mounted() {
    this.getLogoutConfig()
  },
  methods: {
    // 获取注销配置
    async getLogoutConfig() {
      try {
        const { member_logout_config, member_logout } = await this.$api.members.getShopsProtocol()
        if (member_logout_config?.title) {
          this.logoutConfigData = {
            title: member_logout_config.title,
            new_rights: member_logout_config.new_rights || '0'
          }
        }

        if (member_logout?.content) {
          this.privacyData = {
            update_date: member_logout.update_date,
            take_effect_date: member_logout.take_effect_date,
            content: member_logout.content
          }
        }
      } catch (error) {
        console.error('获取注销配置失败:', error)
      }
    },
    // 保存注销配置
    async handleSubmitLogoutConfig() {
      await this.$api.members.updateShopsProtocol({
        data: [
          {
            type: 'member_logout_config',
            ...this.logoutConfigData
          }
        ]
      })
      this.$message.success('保存成功')
    },
    // 保存注销协议
    async handleSubmitPrivacy() {
      await this.$api.members.updateShopsProtocol({
        data: [
          {
            type: 'member_logout',
            update_date: moment(this.privacyData.update_date).format('YYYY-MM-DD'),
            take_effect_date: moment(this.privacyData.take_effect_date).format('YYYY-MM-DD'),
            content: this.privacyData.content
          }
        ]
      })
      this.$message.success('保存成功')
    },
    // 提交处理
    async handleSubmit(formName, type, status) {
      try {
        const formData = await this.$refs[formName].validate()

        let submitData
        if (type === 'member_logout_config') {
          submitData = {
            type,
            ...this.logoutConfigData
          }
          // 只在有status参数时才添加
          if (status !== undefined) {
            submitData.status = status
          }
        } else {
          if (!this.privacyData.content || this.privacyData.content.length === 0) {
            return this.$message.error('请填写内容')
          }
          submitData = {
            type,
            ...this.privacyData
          }
        }

        const result = await this.$api.closeAccount.saveInfo({
          data: [submitData]
        })

        this.$message.success('提交成功')
        console.log('提交结果:', result)
      } catch (error) {
        console.error('表单验证失败:', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-actions {
  margin-top: 100px;
  text-align: center;

  .el-button {
    margin: 0 5px;
  }
}

.tips {
  background: #f5f5f5;
  font-size: 10px;
  line-height: 3;
  padding: 0 10px;
}
</style>

<style lang="scss">
.closeAccount {
  .el-card__body {
    padding: 0;
  }

  .tips {
    background: #f5f5f5;
    font-size: 10px;
    line-height: 3;
    padding: 0 10px;
  }
}
</style>
