<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage class="closeAccount">
    <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane :label="$t('8f1ab541.e5bdf5')" name="first">
        <SpFormPlus
          ref="logoutConfigForm"
          class="mt-10"
          v-model="logoutConfigData"
          :form-items="logoutConfigItems"
          form-type="form"
          @submit="handleSubmitLogoutConfig"
        />
      </el-tab-pane>

      <el-tab-pane :label="$t('8f1ab541.c67871')" name="second">
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
        title: '',
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
      const t = this.$t.bind(this)
      return [
        {
          fieldName: 'title',
          formItemClass: 'w-2/3',
          label: t('8f1ab541.57409a'),
          component: 'input',
          componentProps: {
            type: 'textarea',
            placeholder: t('8f1ab541.a11cc7'),
            maxlength: 50,
            showWordLimit: true,
            autosize: { minRows: 3 },
            style: { width: '500px' }
          },
          tip: t('8f1ab541.480c4d')
        },
        ...(this.VERSION_IN_PURCHASE()
          ? []
          : [
              {
                fieldName: 'new_rights',
                formItemClass: 'w-2/3',
                label: t('8f1ab541.d1001e'),
                component: 'select',
                componentProps: {
                  placeholder: t('8f1ab541.708c9d'),
                  options: [
                    { label: t('8f1ab541.0a60ac'), value: '1' },
                    { label: t('8f1ab541.c9744f'), value: '0' }
                  ]
                },
                tip: t('8f1ab541.1b0b6a')
              }
            ])
      ]
    },
    // 注销协议表单配置
    privacyFormItems() {
      const t = this.$t.bind(this)
      return [
        {
          formItemClass: 'w-2/3',
          component: () => (
            <el-alert
              class='leading-normal'
              title={t('8f1ab541.1b5a56')}
              type='warning'
              show-icon
              closable={false}
            />
          )
        },
        {
          fieldName: 'update_date',
          formItemClass: 'w-1/3',
          label: t('8f1ab541.a5de87'),
          component: 'datepicker',
          componentProps: {
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            placeholder: t('8f1ab541.2bebdd')
          }
        },
        {
          fieldName: 'take_effect_date',
          formItemClass: 'w-1/3',
          label: t('8f1ab541.0d53fa'),
          component: 'datepicker',
          componentProps: {
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            placeholder: t('8f1ab541.2bebdd')
          }
        },
        {
          fieldName: 'content',
          label: t('8f1ab541.2d711b'),
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
                  callback(new Error(t('8f1ab541.ad9c40')))
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
        } else {
          this.logoutConfigData.title = this.$t('8f1ab541.99ad59')
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
      this.$message.success(this.$t('8f1ab541.3b1083'))
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
      this.$message.success(this.$t('8f1ab541.3b1083'))
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
            return this.$message.error(this.$t('8f1ab541.ad9c40'))
          }
          submitData = {
            type,
            ...this.privacyData
          }
        }

        const result = await this.$api.closeAccount.saveInfo({
          data: [submitData]
        })

        this.$message.success(this.$t('8f1ab541.23b62e'))
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
