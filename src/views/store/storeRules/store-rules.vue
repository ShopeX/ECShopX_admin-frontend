<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <SpPage title="进店规则">
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
          label: '规则配置',
          component: 'group'
        },
        {
          component: ({ h, value, onInput }) => {
            return <RulesList value={value} on-change={onInput} />
          },
          fieldName: 'ruleList'
        },
        {
          label: '兜底策略（店铺失效、导购离职、关闭LBS时落地场景）',
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
                  <el-radio-button label='1'>虚拟店</el-radio-button>
                  <el-radio-button label='2'>介绍页</el-radio-button>
                </el-radio-group>

                {value.type == 2 && (
                  <div class='mt-2 flex items-center'>
                    <el-button onClick={() => this.onSelectPage(formData)}>
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
                if (value.type == 2 && !value.template_id) {
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
        this.$message.success('保存成功')
      } catch (error) {
        this.$message.error('保存失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
