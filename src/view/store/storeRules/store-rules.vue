<template>
  <div>
    <h1>进店规则</h1>
    <SpForm
      ref="storeRulesForm"
      v-model="formData"
      :form-list="formList"
      label-width="60px"
      @onSubmit="handleSubmit"
    />
  </div>
</template>

<script>
import RulesList from './components/rules-list.vue'
export default {
  data() {
    return {
      formData: {
        ruleList: {
          list: [
            { key: 'distributor_code', status: false },
            { key: 'shop_assistant', status: false, express_time: 0 },
            { key: 'shop_white', status: false },
            { key: 'shop_assistant_pro', status: false }
          ],
          shop_lbs: false
        },
        safetyStrategy: {
          type: '1',
          template_id: '',
          template_name: ''
        }
      },
      formList: [
        {
          label: '规则配置',
          type: 'group'
        },
        {
          component: () => {
            return (
              <RulesList
                value={this.formData.ruleList}
                on-change={(e) => {
                  this.formData.ruleList = {
                    ...this.formData.ruleList,
                    ...e
                  }
                }}
              />
            )
          },
          key: 'ruleList'
        },
        {
          label: '兜底策略（店铺失效、导购离职、关闭LBS时落地场景）',
          type: 'group'
        },
        {
          key: 'safetyStrategy',
          label: '',
          component: () => {
            return (
              <div>
                <el-radio-group
                  v-model={this.formData.safetyStrategy.type}
                  onInput={(e) => {
                    this.formData.safetyStrategy.type = {
                      ...this.formData.safetyStrategy,
                      type: e.target.value
                    }
                  }}
                >
                  <el-radio-button label='1'>默认店</el-radio-button>
                  <el-radio-button label='2'>介绍页</el-radio-button>
                </el-radio-group>

                {this.formData.safetyStrategy.type == 2 && (
                  <div class='mt-2 flex items-center'>
                    <el-button onClick={() => this.onSelectPage(this.formData.safetyStrategy)}>
                      {this.formData.safetyStrategy.template_id
                        ? `引导页名称：${this.formData.safetyStrategy.template_name}`
                        : '选择页面'}
                    </el-button>
                    <el-button
                      type='text'
                      onClick={() => {
                        this.formData.safetyStrategy = {
                          ...this.formData.safetyStrategy,
                          template_id: '',
                          template_name: ''
                        }
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
                if (
                  this.formData.safetyStrategy.type == 2 &&
                  !this.formData.safetyStrategy.template_id
                ) {
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
  async mounted() {
    // 页面加载时获取现有配置
    const res = await this.$api.marketing.fetchEntryStoreRules()
    if (res?.length == 0) {
      return
    }
    const { distributor_code, shop_assistant, shop_white, shop_assistant_pro } = res

    this.formData.ruleList = {
      list: Object.entries({
        distributor_code: distributor_code,
        shop_assistant: shop_assistant,
        shop_white: shop_white,
        shop_assistant_pro: shop_assistant_pro
      })
        .map(([key, value]) => ({
          key,
          ...value
        }))
        .sort((a, b) => a.sort - b.sort),
      shop_lbs: res.shop_lbs
    }

    this.formData.safetyStrategy = {
      type: res.radio_type,
      template_id: res.intro_page,
      template_name: ''
    }

    if (res.intro_page) {
      const { page_name } = await this.$api.marketing.fetchCustomPageInfo(res.intro_page)
      this.formData.safetyStrategy.template_name = page_name
    }
  },
  methods: {
    async onSelectPage(formData) {
      const {
        data: [page]
      } = await this.$picker.pages({
        multiple: false,
        data: [formData.safetyStrategy.template_id]
      })

      formData.safetyStrategy.template_id = page.id
      formData.safetyStrategy.template_name = page.page_name
    },

    async handleSubmit() {
      const formData = this.formData
      const params = {
        distributor_code: {
          status: false,
          sort: 0
        },
        shop_assistant: {
          status: false,
          sort: 0,
          express_time: 0
        },
        shop_white: {
          status: false,
          sort: 0
        },
        shop_assistant_pro: {
          status: false,
          sort: 0
        }
      }
      formData.ruleList.list.forEach((item, index) => {
        params[item.key].status = item.status || false
        params[item.key].sort = index + 1
        if (item.key === 'shop_assistant') {
          params[item.key].express_time = item.express_time
        }
      })
      params.shop_lbs = formData.ruleList.shop_lbs
      params.radio_type = formData.safetyStrategy.type
      params.intro_page = formData.safetyStrategy.template_id

      console.log('params', params)
      try {
        await this.$api.marketing.saveEntryStoreRules(params)
        this.$message.success('保存成功')
      } catch (error) {
        this.$message.error('保存失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
