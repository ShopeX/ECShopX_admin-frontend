<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage :title="$t('e6c5776a.08894b')">
    <SpFormPlus
      ref="storeRulesForm"
      form-type="normalForm"
      v-model="formData"
      :form-items="formItems"
      label-width="60px"
      @submit="handleSubmit"
    />
  </SpPage>
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
      formItems: [
        {
          label: this.$t('e6c5776a.28a769'),
          component: 'group'
        },
        {
          component: ({ h, value, onInput }) => {
            return <RulesList value={value} on-change={onInput} />
          },
          fieldName: 'ruleList'
        },
        {
          label: this.$t('e6c5776a.4f3d59'),
          component: 'group'
        },
        {
          fieldName: 'safetyStrategy',
          label: '',
          component: ({ h, value, onInput, formData }) => {
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
                  <el-radio-button label='1'>{this.$t('e6c5776a.457ea5')}</el-radio-button>
                  <el-radio-button label='2'>{this.$t('e6c5776a.9ee9fb')}</el-radio-button>
                </el-radio-group>

                {value.type == 2 && (
                  <div class='mt-2 flex items-center'>
                    <el-button onClick={() => this.onSelectPage(formData)}>
                      {value.template_id
                        ? this.$t('e6c5776a.d32dd4') + value.template_name
                        : this.$t('e6c5776a.a4895e')}
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
                      {this.$t('e6c5776a.2f4aad')}
                    </el-button>
                  </div>
                )}
              </div>
            )
          },
          rules: [
            {
              validator: (rule, value, callback) => {
                if (value.type == 2 && !value.template_id) {
                  callback(new Error(this.$t('e6c5776a.11380d')))
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
    const res = await this.$api.store.fetchEntryStoreRules()
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
      const { page_name } = await this.$api.decortaion.fetchCustomPageInfo(res.intro_page)
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

    async handleSubmit(formData) {
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
        params[item.key].status = item.status
        params[item.key].sort = index + 1
        if (item.key === 'shop_assistant') {
          params[item.key].express_time = item.express_time
        }
      })
      params.shop_lbs = formData.ruleList.shop_lbs
      params.radio_type = formData.safetyStrategy.type
      params.intro_page = formData.safetyStrategy.template_id

      console.log('formData', JSON.stringify(params))

      try {
        await this.$api.store.saveEntryStoreRules(params)
        this.$message.success(this.$t('e6c5776a.3b1083'))
      } catch (error) {
        this.$message.error(this.$t('e6c5776a.6de920'))
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
