<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpPlatformTip
      v-if="!VERSION_SHUYUN()"
      h5
      app
      alipay
      :text-val="$t('20f6ad88.c5d4d8')"
    />
    <SpFormPlus
      ref="form"
      v-model="form"
      form-type="form"
      :form-items="formItems"
      label-width="100px"
      :show-default-actions="false"
    />
    <div class="section-footer with-border content-center">
      <el-button v-loading="loading" type="primary" @click="onSubmit">
        {{ $t('20f6ad88.be5fbb') }}
      </el-button>
    </div>
  </SpPage>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      form: {
        app_key: '',
        app_secret: '',
        access_token: '',
        shop_id: '',
        shop_callback_url: '',
        oauth_url: '',
        is_open: true
      }
    }
  },
  computed: {
    formItems() {
      const vm = this
      return [
        {
          fieldName: 'shop_callback_url',
          label: vm.$t('20f6ad88.3a8461'),
          component: ({ value, h, formData }) => {
            return h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } }, [
              h('span', value || ''),
              h(
                'el-tag',
                {
                  style: { cursor: 'pointer' },
                  on: {
                    click: () => {
                      if (value) {
                        const textarea = document.createElement('textarea')
                        textarea.value = value
                        textarea.style.position = 'fixed'
                        textarea.style.opacity = '0'
                        document.body.appendChild(textarea)
                        textarea.select()
                        try {
                          const successful = document.execCommand('copy')
                          if (successful) {
                            vm.onCopy()
                          }
                        } catch (err) {
                          console.error('复制失败', err)
                        }
                        document.body.removeChild(textarea)
                      }
                    }
                  }
                },
                vm.$t('20f6ad88.9d1e84')
              )
            ])
          }
        },
        {
          fieldName: 'shop_id',
          label: vm.$t('20f6ad88.a3068b'),
          component: 'input',
          componentProps: {
            style: { width: '300px' }
          }
        },
        {
          fieldName: 'access_token',
          label: 'accessToken',
          component: ({ value, h, formData }) => {
            return h(
              'el-button',
              {
                props: {
                  type: 'flex'
                },
                on: {
                  click: () => vm.handleBind()
                }
              },
              formData && formData.access_token
                ? vm.$t('20f6ad88.af3ef9')
                : vm.$t('20f6ad88.4a1c90')
            )
          },
          isShow: (value) => {
            return !!(vm.form && vm.form.oauth_url)
          }
        },
        {
          fieldName: 'is_open',
          label: vm.$t('20f6ad88.53c3dd'),
          component: 'switch',
          componentProps: {
            activeColor: '#13ce66',
            inactiveColor: '#ff4949'
          }
        }
      ]
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    handleClick() {
      this.getConfig()
    },
    getConfig() {
      this.$api.third.getJstErpSetting().then((response) => {
        this.form = response
      })
    },
    onSubmit() {
      this.loading = true
      this.$api.third
        .setJstErpSetting(this.form)
        .then((response) => {
          this.$message({
            type: 'success',
            message: this.$t('20f6ad88.3b1083')
          })
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
        })
    },
    handleBind() {
      if (this.form.oauth_url) {
        window.open(this.form.oauth_url, '_blank')
      }
    },
    onCopy() {
      this.$notify.success({
        message: this.$t('20f6ad88.20a495'),
        showClose: true
      })
    }
  }
}
</script>
