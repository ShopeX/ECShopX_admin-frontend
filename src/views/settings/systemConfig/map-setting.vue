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
      form-type="form"
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
                {this.$t('caf9668f.626669')}
                <el-link
                  href='https://lbs.qq.com'
                  target='_blank'
                  type='primary'
                >
                  {this.$t('caf9668f.e4f07d')}
                </el-link>
                {this.$t('caf9668f.654d54')}
              </div>
            )
          }
        },
        {
          fieldName: 'app_key',
          label: this.$t('caf9668f.2c2f75'),
          component: 'input',
          formItemClass: 'w-1/2',
          rules: [{ required: true, message: this.$t('caf9668f.02cc4f'), trigger: 'blur' }],
          tip: this.$t('caf9668f.fcdf2b'),
          componentProps: {
            type: 'text',
            autocomplete: 'off'
          }
        },
        {
          fieldName: 'app_secret',
          label: this.$t('caf9668f.cdb81c'),
          formItemClass: 'w-1/2',
          rules: [{ required: false, message: this.$t('caf9668f.02cc4f'), trigger: 'blur' }],
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
                  class='h-full w-[25px] flex items-center justify-center'
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
      this.$message.success(this.$t('caf9668f.3b1083'))
    }
  }
}
</script>
<style lang="scss"></style>
