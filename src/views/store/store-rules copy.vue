<template>
  <SpPage title="进店规则">
    <SpFormPlus
      ref="storeRulesForm"
      form-type="normalForm"
      :form-items="formItems"
      v-model="formData"
      label-width="180px"
      @change="handleChange"
      @submit="handleSubmit"
    />
  </SpPage>
</template>

<script>
export default {
  data() {
    return {
      formData: {},
      formItems: [
        {
          label: '非自然流量（带参）',
          component: 'group'
        },
        {
          fieldName: 'enterStoreByshopCode',
          label: '店铺码进店',
          component: 'switch',
          value: false,
          tip: () => (
            <div class='text-sm text-[#999]'>
              <p>通过带门店参小程序码扫码进入对应店铺</p>
              <p>通过分享小程序卡片进入对应店铺</p>
            </div>
          )
        },
        {
          fieldName: 'enterStoreByGuideMaterial',
          label: '导购物料进店',
          component: 'switch',
          value: false,
          tip: () => (
            <div class='text-sm text-[#999]'>
              <p>通过扫企微码添加导购加好友的欢迎语推送的小程序卡片进店</p>
              <p>通过导购商城分享的小程序海报、小程序卡片进店</p>
            </div>
          )
        },
        {
          label: '自然流量（不带参）',
          component: 'group'
        },
        {
          fieldName: 'enterWhiteListStore',
          label: '进入白名单会员店',
          component: 'switch',
          componentProps: {
            disabled: (form) => form.enterStoreByGuide
          },
          value: false,
          tip: () => (
            <div class='text-sm text-[#999]'>
              <p>需要开启店铺白名单</p>
              <p>进入用户绑定白名单的店铺</p>
            </div>
          )
        },
        {
          fieldName: 'enterStoreByGuide',
          label: '进入专属导购所属店',
          component: 'switch',
          componentProps: {
            disabled: (form) => form.enterWhiteListStore
          },
          value: false,
          tip: () => (
            <div class='text-sm text-[#999]'>
              <p>需要开通导购应用</p>
              <p>通过扫导购企业微信码加好友、进入导购归属店铺</p>
            </div>
          )
        },
        {
          fieldName: 'enterStoreByLbs',
          label: 'LBS就近进店',
          component: 'switch',
          value: false,
          tip: () => (
            <div class='text-sm text-[#999]'>
              <p>通过用户的LBS定位，进入用户附近的店铺</p>
            </div>
          )
        },
        {
          label: '兜底策略（店铺失效、导购离职、关闭LBS时落地场景）',
          component: 'group'
        },
        {
          fieldName: 'safetyStrategy',
          label: '',
          component: ({ h, value, onInput }) => {
            return (
              <div>
                <el-radio-group
                  v-model={value.type}
                  onInput={(e) => {
                    onInput({
                      ...value,
                      type: e
                    })
                  }}
                >
                  <el-radio-button label='1'>默认店</el-radio-button>
                  <el-radio-button label='2'>介绍页</el-radio-button>
                </el-radio-group>

                {value.type == 2 && (
                  <div class='mt-2 flex items-center'>
                    <el-button onClick={this.onSelectPage}>
                      {value.template_id ? `引导页名称：${value.template_name}` : '选择页面'}
                    </el-button>
                    <el-button
                      type='text'
                      onClick={() => {
                        onInput({
                          ...value,
                          template_id: '',
                          template_name: ''
                        })
                      }}
                    >
                      删除
                    </el-button>
                  </div>
                )}
              </div>
            )
          },
          rules: [
            {
              validator: (rule, value, callback) => {
                if (value.type === '2' && !value.template_id) {
                  callback(new Error('请选择引导页'))
                } else {
                  callback()
                }
              }
            }
          ],
          value: {
            type: '1',
            template_id: '',
            template_name: ''
          }
        }
      ]
    }
  },
  async mounted() {
    // 页面加载时获取现有配置
    const res = await this.$api.store.fetchEntryStoreRules()
    if (res?.length == 0) {
      return
    }
    this.formData.enterStoreByshopCode = res.distributor_code
    this.formData.enterStoreByGuideMaterial = res.shop_assistant
    this.formData.enterWhiteListStore = res.shop_white
    this.formData.enterStoreByGuide = res.shop_assistant_pro
    this.formData.enterStoreByLbs = res.shop_lbs
    this.formData.safetyStrategy = {
      type: res.radio_type,
      template_id: res.intro_page,
      template_name: ''
    }
    if (res.intro_page) {
      const { page_name } = await this.$api.decortaion.fetchCustomPageInfo(res.intro_page)
      this.formData.safetyStrategy.template_name = page_name
    }
  },
  methods: {
    handleChange(formData) {
      this.formData = formData
    },
    async onSelectPage() {
      const {
        data: [page]
      } = await this.$picker.pages({
        multiple: false,
        data: [this.formData.safetyStrategy.template_id]
      })

      this.formData.safetyStrategy.template_id = page.id
      this.formData.safetyStrategy.template_name = page.page_name
    },

    async handleSubmit(formData) {
      const params = {
        distributor_code: formData.enterStoreByshopCode,
        shop_assistant: formData.enterStoreByGuideMaterial,
        shop_white: formData.enterWhiteListStore,
        shop_assistant_pro: formData.enterStoreByGuide,
        shop_lbs: formData.enterStoreByLbs,
        radio_type: formData.safetyStrategy.type,
        intro_page: formData.safetyStrategy.template_id
      }
      try {
        await this.$api.store.saveEntryStoreRules(params)
        this.$message.success('保存成功')
      } catch (error) {
        this.$message.error('保存失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
