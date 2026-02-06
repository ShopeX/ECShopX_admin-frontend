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
      <el-button type="primary" @click="onSubmit"> 保存 </el-button>
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
            callback(new Error('至少一项不能为空'))
          }
        } else {
          callback()
        }
      }

      const validateCommon = (rule, value, callback) => {
        const { channel, common } = vm.form
        if (channel == 'single' && !common) {
          callback(new Error('客服链接不能为空'))
        } else {
          callback()
        }
      }

      return [
        {
          fieldName: '__group_meiqia',
          component: 'group',
          label: '美洽客服'
        },
        {
          fieldName: 'is_open',
          label: '美洽客服',
          component: 'switch'
        },
        {
          label: '平台客服',
          fieldName: '__group_platform',
          component: 'group'
        },
        {
          fieldName: 'channel',
          label: '平台客服',
          component: 'radio',
          componentProps: {
            options: [
              { label: '统一配置', value: 'single' },
              { label: '按渠道配置', value: 'multi' }
            ]
          }
        },
        {
          fieldName: 'common',
          label: '客服链接',
          component: 'input',
          componentProps: {
            placeholder: '请输入内容'
          },
          tip: '如实际运营中有多个客服人员接待咨询，建议配置为美洽客服组链接，在美洽客服组内添加客服人员坐席。',
          rules: [{ validator: validateCommon }],
          isShow: () => {
            return vm.form.channel == 'single'
          }
        },
        {
          fieldName: 'wxapp',
          label: '微信小程序',
          component: 'input',
          componentProps: {
            style: { maxWidth: '600px' },
            placeholder: '请输入内容'
          },
          rules: [{ validator: validateLink }],
          isShow: () => vm.form.channel == 'multi'
        },
        {
          fieldName: 'h5',
          label: 'H5商城',
          component: 'input',
          componentProps: {
            placeholder: '请输入内容'
          },
          rules: [{ validator: validateLink }],
          isShow: () => vm.form.channel == 'multi'
        },
        {
          fieldName: 'app',
          label: 'APP商城',
          component: 'input',
          componentProps: {
            placeholder: '请输入内容'
          },
          rules: [{ validator: validateLink }],
          isShow: () => vm.form.channel == 'multi'
        },
        {
          fieldName: 'aliapp',
          label: '支付宝小程序',
          component: 'input',
          componentProps: {
            placeholder: '请输入内容'
          },
          rules: [{ validator: validateLink }],
          isShow: () => vm.form.channel == 'multi'
        },
        {
          fieldName: 'pc',
          label: 'PC网页版',
          component: 'input',
          componentProps: {
            placeholder: '请输入内容'
          },
          rules: [{ validator: validateLink }],
          isShow: () => vm.form.channel == 'multi'
        },
        {
          fieldName: '__group_distributor',
          component: 'group',
          label: '店铺客服'
        },
        {
          fieldName: 'is_distributor_open',
          label: '店铺独立客服',
          component: 'radio',
          componentProps: {
            options: [
              { label: '允许', value: true },
              { label: '不允许', value: false }
            ]
          },
          tip: '允许店铺配置独立客服时，请前往店铺管理中为店铺配置客服链接；如店铺未配置客服链接，则消费者咨询时将由平台客服接待。不允许店铺配置独立客服时，店铺里的消费者咨询将全部由平台客服接待。'
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
      this.$message.success('保存成功')
    }
  }
}
</script>
