<template>
  <SpPage title="进店规则">
    <SpFormPlus
      ref="storeRulesForm"
      form-type="normalForm"
      :form-items="formItems"
      v-model="formData"
      label-width="180px"
      @submit="handleSubmit"
    />
  </SpPage>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        enterStoreByshopCode: false,
        enterStoreByGuideMaterial: false,
        enterStoreByGuide: false,
        enterStoreByLbs: false,
        safetyStrategy: '1',
        template: {
          id: '',
          name: ''
        }
      },
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
            <div class="text-sm text-[#999]">
              <p>通过带门店参小程序码扫码进入对应店铺</p>
              <p>通过分享小程序卡片进入对应店铺</p>
            </div>
          )
        },
        {
          fieldName: 'enterStoreByGuideMaterial',
          label: '导购物料进店',
          component: 'switch',
          tip: () => (
            <div class="text-sm text-[#999]">
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
          fieldName: 'enterStoreByGuide',
          label: '进入专属导购所属店',
          component: 'switch',
          tip: () => (
            <div class="text-sm text-[#999]">
              <p>通过扫导购企业微信码加好友、进入导购归属店铺</p>
              <p>通过导购商城分享的小程序海报、小程序卡片进店</p>
            </div>
          )
        },
        {
          fieldName: 'enterStoreByLbs',
          label: 'LBS就近进店',
          component: 'switch',
          tip: () => (
            <div class="text-sm text-[#999]">
              <p>通过扫导购企业微信码加好友、进入导购归属店铺</p>
            </div>
          )
        },
        {
          label: '兜底策略',
          component: 'group'
        },
        {
          fieldName: 'safetyStrategy',
          label: '',
          component: ({ h, value, onInput }) => {
            return (
              <div>
                <el-radio-group v-model={value} onInput={onInput}>
                  <el-radio-button label="1">默认店</el-radio-button>
                  <el-radio-button label="2">介绍页</el-radio-button>
                </el-radio-group>

                {value === '2' && (
                  <div class="mt-2 flex items-center">
                    <el-button onClick={this.onSelectPage}>
                      {this.formData.template.id
                        ? `引导页名称：${this.formData.template.name}`
                        : '选择页面'}
                    </el-button>
                    <el-button type="text" onClick={this.onClearPage}>
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
                if (value === '2' && !this.formData.template.id) {
                  callback(new Error('请选择引导页'))
                } else {
                  callback()
                }
              }
            }
          ]
        }
      ]
    }
  },
  methods: {
    async onSelectPage() {
      const {
        data: [page]
      } = await this.$picker.pages({
        multiple: false,
        data: [this.formData.template.id]
      })

      this.formData.template.id = page.id
      this.formData.template.name = page.page_name
    },

    onClearPage() {
      this.formData.template.id = ''
      this.formData.template.name = ''
    },

    handleSubmit(formData) {
      console.log('提交店铺规则配置:', formData)
      debugger
      // 这里可以调用API保存配置
      this.saveStoreRules(formData)
    },

    async saveStoreRules(formData) {
      try {
        // 模拟API调用
        const response = await this.$api.store.saveRules(formData)

        if (response.success) {
          this.$message.success('店铺规则配置保存成功')
        } else {
          this.$message.error('保存失败：' + response.message)
        }
      } catch (error) {
        console.error('保存店铺规则失败:', error)
        this.$message.error('保存失败，请重试')
      }
    }
  },

  mounted() {
    // 页面加载时获取现有配置
    // this.loadStoreRules()
  }
}
</script>

<style lang="scss" scoped></style>
