<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpFormPlus
      ref="form"
      v-model="form"
      form-type="form"
      :form-items="formItems"
      label-width="100px"
      :show-default-actions="false"
    />
    <div class="section-footer with-border content-center">
      <el-button v-loading="loading" type="primary" @click="onSubmit"> 保存 </el-button>
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
          label: '店铺消息推送',
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
                '点我复制'
              )
            ])
          }
        },
        {
          fieldName: 'shop_id',
          label: '店铺编号',
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
              formData && formData.access_token ? '更新授权' : '去授权'
            )
          },
          isShow: (value) => {
            return !!(vm.form && vm.form.oauth_url)
          }
        },
        {
          fieldName: 'is_open',
          label: '是否启用',
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
            message: '保存成功'
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
        message: '复制成功',
        showClose: true
      })
    }
  }
}
</script>
