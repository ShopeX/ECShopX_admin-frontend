<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage class="map-setting">
    <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />

    <SpFormPlus
      class="mt-[60px]"
      ref="formEle"
      v-model="form"
      form-type="normalForm"
      :form-items="formItems"
      :submit-loading="loading"
      @submit="onSubmitChange"
    />
  </SpPage>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      showPassword: false,
      form: {
        app_key: '',
        app_secret: ''
      }
    }
  },
  computed: {
    formItems() {
      return [
        {
          component: () => {
            return (
              <div class='head-tips'>
                腾讯位置服务Key获取路径：
                <el-link
                  href='https://developer.amap.com/?ref=http%3A%2F%2Flbs.gaode.com%2Fdev%2F'
                  target='_blank'
                  type='primary'
                >
                  腾讯位置服务控制台
                </el-link>
                ，进入【应用管理】--【我的应用】--【创建应用】。
              </div>
            )
          }
        },
        {
          fieldName: 'app_key',
          label: '地图Key',
          component: 'input',
          formItemClass: 'w-1/2',
          rules: [{ required: true, message: '请输入', trigger: 'blur' }],
          tip: 'Key不填写或填写错误将导致该功能无法使用，请确保填写正确。',
          componentProps: {
            autocomplete: 'off'
          }
        },
        {
          fieldName: 'app_secret',
          label: '密钥',
          formItemClass: 'w-1/2',
          rules: [{ required: false, message: '请输入', trigger: 'blur' }],
          component: ({ value, onInput, h }) => {
            return (
              <el-input
                v-model={value}
                type={this.showPassword ? 'text' : 'password'}
                autocomplete='new-password'
                on-input={onInput}
              >
                <div
                  slot='suffix'
                  class="h-full w-[25px] flex items-center justify-center"
                  on-click={() => {
                    this.showPassword = !this.showPassword
                  }}
                >
                  <SpIcon name={this.showPassword ? 'preview-open' : 'preview-close'} size='16' />
                </div>
              </el-input>
            )
          }
        }
      ]
    }
  },
  async mounted() {
    const { list } = await this.$api.third.getMapSetting()
    this.form.app_key = list.find((item) => item.type === 'tencent')?.app_key || ''
    this.form.app_secret = list.find((item) => item.type === 'tencent')?.app_secret || ''
  },
  methods: {
    async onSubmitChange() {
      this.loading = true
      await this.$api.third.setMapSetting({
        app_key: this.form.app_key,
        app_secret: this.form.app_secret,
        map_type: 'tencent',
        is_default: 1
      })
      this.loading = false
      this.$message.success('保存成功')
    }
  }
}
</script>
<style lang="scss"></style>
