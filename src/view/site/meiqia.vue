<style lang="scss">
.meiqia-config {
  .el-input {
    max-width: 600px;
  }
}
</style>

<template>
  <div>
    <SpPlatformTip h5 app aliapp />
    <SpForm
      ref="form"
      v-model="form"
      class="meiqia-config"
      :form-list="formList"
      :submit="false"
      @onSubmit="onSaveConfig"
    />
    <div class="footer-container">
      <el-button
        type="primary"
        @click="
          () => {
            this.$refs['form'].handleSubmit()
          }
        "
      >
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const validateLink = (rule, value, callback) => {
      const { channel, wxapp, h5, app, aliapp, pc } = this.form
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
      },
      formList: [
        {
          label: '美洽客服',
          type: 'group'
        },
        {
          label: '美洽客服',
          key: 'is_open',
          type: 'switch'
        },
        {
          label: '平台客服',
          type: 'group'
        },
        {
          label: '平台客服',
          key: 'channel',
          type: 'radio',
          options: [
            { label: 'single', name: '统一配置' },
            { label: 'multi', name: '按渠道配置' }
          ]
        },
        {
          label: '客服链接',
          key: 'common',
          type: 'input',
          tip: '如实际运营中有多个客服人员接待咨询，建议配置为美洽客服组链接，在美洽客服组内添加客服人员坐席。',
          validator: (rule, value, callback) => {
            const { channel, common } = this.form
            if (channel == 'single' && !common) {
              callback(new Error('客服链接不能为空'))
            } else {
              callback()
            }
          },
          isShow: () => {
            return this.form.channel == 'single'
          }
        },
        {
          label: '微信小程序',
          key: 'wxapp',
          type: 'input',
          validator: validateLink,
          isShow: () => this.form.channel == 'multi'
        },
        {
          label: 'H5商城',
          key: 'h5',
          type: 'input',
          validator: validateLink,
          isShow: () => this.form.channel == 'multi'
        },
        {
          label: 'APP商城',
          key: 'app',
          type: 'input',
          validator: validateLink,
          isShow: () => this.form.channel == 'multi'
        },
        {
          label: '支付宝小程序',
          key: 'aliapp',
          type: 'input',
          validator: validateLink,
          isShow: () => this.form.channel == 'multi'
        },
        {
          label: 'PC网页版',
          key: 'pc',
          type: 'input',
          validator: validateLink,
          isShow: () => this.form.channel == 'multi'
        },
        {
          label: '店铺客服',
          type: 'group'
        },
        {
          label: '店铺独立客服',
          key: 'is_distributor_open',
          type: 'radio',
          options: [
            { label: true, name: '允许' },
            { label: false, name: '不允许' }
          ],
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
    async onSaveConfig() {
      await this.$api.im.saveMeiqia(this.form)
      this.$message.success('保存成功')
    }
  }
}
</script>
