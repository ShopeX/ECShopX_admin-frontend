<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.meiqia-config {
  .el-input {
    max-width: 600px;
  }
}
</style>

<template>
  <SpPage>
    <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />
    <SpFormPlus
      ref="form"
      v-model="form"
      class="meiqia-config"
      :form-items="formItems"
      form-type="form"
      label-width="120px"
      :show-default-actions="false"
    />
    <div class="footer-container">
      <el-button type="primary" @click="onSubmit">{{ $t('3fbbe844.be5fbb') }}</el-button>
    </div>
  </SpPage>
</template>

<script>
export default {
  data() {
    return {
      form: {
        is_open: false,
        channel: 'single', // single、multi
        common: '',
        wxapp: '',
        h5: '',
        app: '',
        aliapp: '',
        pc: '',
        is_distributor_open: false
      }
    }
  },
  computed: {
    formItems() {
      const vm = this

      const validateLink = (rule, value, callback) => {
        const { channel, wxapp, h5, app, aliapp, pc } = vm.form
        if (channel == 'multi') {
          if (wxapp || h5 || app || aliapp || pc) {
            callback()
          } else {
            callback(new Error(vm.$t('3fbbe844.d94839')))
          }
        } else {
          callback()
        }
      }

      const validateCommon = (rule, value, callback) => {
        const { channel, common } = vm.form
        if (channel == 'single' && !common) {
          callback(new Error(vm.$t('3fbbe844.96c134')))
        } else {
          callback()
        }
      }

      return [
        {
          fieldName: '__group_meiqia',
          component: 'group',
          label: vm.$t('3fbbe844.7ef177')
        },
        {
          fieldName: 'is_open',
          label: vm.$t('3fbbe844.7ef177'),
          component: 'switch'
        },
        {
          label: vm.$t('3fbbe844.0c4ef7'),
          fieldName: '__group_platform',
          component: 'group'
        },
        {
          fieldName: 'channel',
          label: vm.$t('3fbbe844.0c4ef7'),
          component: 'radio',
          componentProps: {
            options: [
              { label: vm.$t('3fbbe844.b240a2'), value: 'single' },
              { label: vm.$t('3fbbe844.102471'), value: 'multi' }
            ]
          }
        },
        {
          fieldName: 'common',
          label: vm.$t('3fbbe844.c3c135'),
          component: 'input',
          componentProps: {
            placeholder: vm.$t('3fbbe844.a11cc7')
          },
          tip: vm.$t('3fbbe844.9f3289'),
          rules: [{ validator: validateCommon }],
          isShow: () => {
            return vm.form.channel == 'single'
          }
        },
        {
          fieldName: 'wxapp',
          label: vm.$t('3fbbe844.439845'),
          component: 'input',
          componentProps: {
            style: { maxWidth: '600px' },
            placeholder: vm.$t('3fbbe844.a11cc7')
          },
          rules: [{ validator: validateLink }],
          isShow: () => vm.form.channel == 'multi'
        },
        {
          fieldName: 'h5',
          label: vm.$t('3fbbe844.715f06'),
          component: 'input',
          componentProps: {
            placeholder: vm.$t('3fbbe844.a11cc7')
          },
          rules: [{ validator: validateLink }],
          isShow: () => vm.form.channel == 'multi'
        },
        {
          fieldName: 'app',
          label: vm.$t('3fbbe844.df708d'),
          component: 'input',
          componentProps: {
            placeholder: vm.$t('3fbbe844.a11cc7')
          },
          rules: [{ validator: validateLink }],
          isShow: () => vm.form.channel == 'multi'
        },
        {
          fieldName: 'aliapp',
          label: vm.$t('3fbbe844.42d922'),
          component: 'input',
          componentProps: {
            placeholder: vm.$t('3fbbe844.a11cc7')
          },
          rules: [{ validator: validateLink }],
          isShow: () => vm.form.channel == 'multi'
        },
        {
          fieldName: 'pc',
          label: vm.$t('3fbbe844.f0497f'),
          component: 'input',
          componentProps: {
            placeholder: vm.$t('3fbbe844.a11cc7')
          },
          rules: [{ validator: validateLink }],
          isShow: () => vm.form.channel == 'multi'
        },
        {
          fieldName: '__group_distributor',
          component: 'group',
          label: vm.$t('3fbbe844.3161fb')
        },
        {
          fieldName: 'is_distributor_open',
          label: vm.$t('3fbbe844.2a4375'),
          component: 'radio',
          componentProps: {
            options: [
              { label: vm.$t('3fbbe844.e6a5c3'), value: true },
              { label: vm.$t('3fbbe844.e06828'), value: false }
            ]
          },
          tip: vm.$t('3fbbe844.55343f')
        }
      ]
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      const { channel, is_distributor_open, meiqia_url, is_open } =
        await this.$api.im.getMeiqiaInfo()
      const { common, wxapp, h5, app, aliapp, pc } = meiqia_url
      this.form = {
        is_open,
        channel,
        common,
        wxapp,
        h5,
        app,
        aliapp,
        pc,
        is_distributor_open
      }
    },
    async onSubmit() {
      await this.$refs.form.validate()
      await this.$api.im.saveMeiqia(this.form)
      this.$message.success(this.$t('3fbbe844.3b1083'))
    }
  }
}
</script>
