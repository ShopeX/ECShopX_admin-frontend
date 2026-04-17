<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpFormPlus
      ref="searchForm"
      v-model="searchParams"
      :form-items="searchFormItems"
      form-type="searchForm"
      @submit="onSearch"
    />

    <div class="action-container mt-4">
      <el-button type="primary" @click="handleNew">{{ $t('07504bf6.4c0eea') }}</el-button>
    </div>

    <SpFinder
      ref="finder"
      url="/goods/attributes"
      fixed-row-action
      row-actions-align="left"
      row-actions-fixed-align="left"
      row-actions-width="150px"
      :no-selection="true"
      :setting="tableSetting"
      :hooks="{
        beforeSearch: beforeSearch
      }"
    />
    <sideBar
      :visible.sync="show_sideBar"
      :title="form.attribute_id ? $t('07504bf6.b51408') : $t('07504bf6.4c0eea')"
    >
      <ParamsForm :value="form" @submit="onFormSubmit" />
      <div slot="footer">
        <el-button type="primary" @click="handleFormSubmit">{{ $t('07504bf6.939d53') }}</el-button>
      </div>
    </sideBar>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import { getGoodsAttr, addGoodsAttr, updateGoodsAttr, deleteGoodsAttr } from '../../../../api/goods'
import sideBar from '@/components/element/sideBar'
import { createSetting } from '@shopex-ui/finder'
import { useForm } from '@/composables'
import Vue from 'vue'
import { i18n } from '@/i18n'

const [ParamsForm, ParamsFormApi] = useForm({
  formType: 'normalForm',
  labelWidth: '80px',
  labelInline: true,
  showDefaultActions: false,
  formItems: [
    {
      fieldName: 'attribute_name',
      label: i18n.t('07504bf6.5f49be'),
      component: 'input',
      value: '',
      componentProps: {
        placeholder: i18n.t('07504bf6.0e7839')
      },
      rules: [{ required: true, message: i18n.t('07504bf6.0e7839'), trigger: 'blur' }]
    },
    {
      fieldName: 'attribute_memo',
      label: i18n.t('07504bf6.dc14a1'),
      component: 'input',
      value: '',
      componentProps: {
        placeholder: i18n.t('07504bf6.50261b')
      }
    },
    {
      fieldName: 'is_show',
      label: i18n.t('07504bf6.91bb21'),
      component: 'radio',
      value: true,
      componentProps: {
        options: [
          { label: i18n.t('07504bf6.159985'), value: true },
          { label: i18n.t('07504bf6.ae6d82'), value: false }
        ]
      }
    },
    {
      fieldName: 'attribute_values',
      label: i18n.t('07504bf6.bfed49'),
      component: ({ h, value, onInput, formData }) => {
        const list = Array.isArray(value) ? value : []
        return (
          <div>
            {list.map((item, index) => (
              <div key={index} class='flex items-center mb-2 bg-gray-50 rounded'>
                <div class='flex-1 mr-2.5'>
                  <el-input
                    value={item.attribute_value}
                    placeholder={i18n.t('07504bf6.a0386a')}
                    on-input={(val) => {
                      const newValues = [...list]
                      newValues[index] = { ...item, attribute_value: val }
                      onInput(newValues)
                    }}
                  />
                </div>
                <div
                  class='cursor-pointer flex items-center text-gray-500 p-1 rounded'
                  onClick={async () => {
                    try {
                      await Vue.prototype.$confirm(
                        i18n.t('07504bf6.167628'),
                        i18n.t('07504bf6.02d981'),
                        {
                          confirmButtonText: i18n.t('07504bf6.38cf16'),
                          cancelButtonText: i18n.t('07504bf6.625fb2'),
                          type: 'warning'
                        }
                      )
                      const newValues = [...list]
                      newValues.splice(index, 1)
                      onInput(newValues)
                    } catch (e) {
                      // 用户取消
                    }
                  }}
                >
                  <SpIcon name='delete' size={22} />
                </div>
              </div>
            ))}
            <div class='w-[110px] ml-0.8 border-gray-200'>
              <el-button
                type='default'
                size='small'
                class='border-dashed'
                onClick={() => {
                  if (list.length >= 50) {
                    Vue.prototype.$message({
                      type: 'warning',
                      message: i18n.t('07504bf6.94360c')
                    })
                    return
                  }
                  const newValues = [...list, { attribute_value: '' }]
                  onInput(newValues)
                }}
              >
                {i18n.t('07504bf6.308c56')}
              </el-button>
            </div>
          </div>
        )
      },
      value: []
    }
  ]
})

export default {
  components: {
    sideBar,
    ParamsForm
  },
  data() {
    return {
      form: {
        attribute_type: 'item_params',
        attribute_id: '',
        attribute_name: '',
        attribute_memo: '',
        is_show: true,
        attribute_values: []
      },
      searchParams: {
        attribute_type: 'item_params',
        attribute_name: ''
      },
      show_sideBar: false
    }
  },
  mounted() {},
  methods: {
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    beforeSearch(params) {
      return {
        ...params,
        ...this.searchParams
      }
    },
    handleDelete(data) {
      this.$confirm(this.$t('07504bf6.67d5b6'))
        .then((_) => {
          deleteGoodsAttr(data.row.attribute_id).then((res) => {
            this.$message({ type: 'success', message: this.$t('07504bf6.33130f') })
            this.$refs.finder.refresh()
          })
        })
        .catch((_) => {})
    },
    handleNew() {
      this.show_sideBar = true
      this.resetData()
      this.$nextTick(() => {
        if (ParamsFormApi.resetFields) {
          ParamsFormApi.resetFields()
        }
        if (ParamsFormApi.setFieldsValue) {
          ParamsFormApi.setFieldsValue({
            attribute_name: '',
            attribute_memo: '',
            is_show: true,
            attribute_values: []
          })
        }
      })
    },
    resetData() {
      this.form = {
        attribute_type: 'item_params',
        attribute_id: '',
        attribute_name: '',
        attribute_memo: '',
        is_show: true,
        attribute_values: []
      }
    },
    handleEdit(data) {
      this.show_sideBar = true
      this.$nextTick(() => {
        let isShow = data.is_show
        if (typeof data.is_show === 'string') {
          try {
            if (data.is_show.trim() === '') {
              isShow = false
            } else {
              isShow = JSON.parse(data.is_show)
            }
          } catch (e) {
            isShow = data.is_show === 'true' || data.is_show === true
          }
        }

        let attributeValues = []
        if (data.attribute_values) {
          if (typeof data.attribute_values === 'string') {
            try {
              const parsed = JSON.parse(data.attribute_values)
              attributeValues = parsed.list || parsed || []
            } catch (e) {
              attributeValues = []
            }
          } else if (data.attribute_values.list) {
            attributeValues = data.attribute_values.list
          } else if (Array.isArray(data.attribute_values)) {
            attributeValues = data.attribute_values
          }
        }

        ParamsFormApi.setFieldsValue({
          attribute_name: data.attribute_name,
          attribute_memo: data.attribute_memo,
          is_show: isShow,
          attribute_values: attributeValues
        })
        this.form = {
          attribute_id: data.attribute_id,
          attribute_type: data.attribute_type,
          attribute_name: data.attribute_name,
          attribute_memo: data.attribute_memo,
          is_show: isShow,
          attribute_values: attributeValues
        }
      })
    },
    async handleFormSubmit() {
      try {
        await ParamsFormApi.validate()
        const formData = ParamsFormApi.getFieldsValue()
        this.onFormSubmit(formData)
      } catch (error) {
        // 验证失败
      }
    },
    onFormSubmit(formData) {
      const submitData = {
        ...this.form,
        ...formData
      }
      if (submitData.attribute_values.length === 0 && submitData.is_show == true) {
        this.$message({ type: 'error', message: this.$t('07504bf6.ad4589') })
        return
      }
      const params = JSON.parse(JSON.stringify(submitData))
      params.attribute_values = JSON.stringify(params.attribute_values)
      if (!submitData.attribute_id) {
        addGoodsAttr(params).then((res) => {
          this.$message({ type: 'success', message: this.$t('07504bf6.33130f') })
          this.resetData()
          this.show_sideBar = false
          this.$refs.finder.refresh(true)
        })
      } else {
        updateGoodsAttr(params.attribute_id, params).then((res) => {
          this.$message({ type: 'success', message: this.$t('07504bf6.33130f') })
          this.show_sideBar = false
          this.$refs.finder.refresh()
        })
      }
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    searchFormItems() {
      return [
        {
          fieldName: 'attribute_name',
          label: this.$t('07504bf6.5f49be'),
          component: 'input',
          cellWidth: 1.3,
          componentProps: {
            clearable: true,
            placeholder: this.$t('07504bf6.0e7839')
          }
        }
      ]
    },
    tableSetting() {
      return createSetting({
        actions: [
          {
            name: this.$t('07504bf6.95b351'),
            key: 'edit',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'link',
              handler: ([row]) => {
                this.handleEdit(row)
              }
            }
          },
          {
            name: this.$t('07504bf6.2f4aad'),
            key: 'delete',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'link',
              handler: ([row]) => {
                this.handleDelete({ row, $index: 0 })
              }
            }
          }
        ],
        columns: [
          {
            name: this.$t('07504bf6.91bb21'),
            key: 'is_show',
            formatter: (value) => {
              if (value == null || value === '') {
                return this.$t('07504bf6.26ab96')
              }
              let isShow = value
              if (typeof value === 'string') {
                try {
                  isShow = JSON.parse(value)
                } catch (e) {
                  isShow = value === 'true' || value === true
                }
              }
              return isShow ? this.$t('07504bf6.df2f0a') : this.$t('07504bf6.26ab96')
            }
          },
          {
            name: this.$t('07504bf6.5f49be'),
            key: 'attribute_name',
            width: 200
          },
          {
            name: this.$t('07504bf6.dc14a1'),
            key: 'attribute_memo'
          },
          {
            name: this.$t('07504bf6.bfed49'),
            key: 'attribute_values',
            render: (h, scope) => {
              const attributeValues = scope.row.attribute_values
              const values = (attributeValues && attributeValues.list) || []
              return h(
                'div',
                {
                  class: 'whitespace-normal'
                },
                values.map((item, index) =>
                  h(
                    'span',
                    {
                      key: index,
                      class: 'mr-2.5'
                    },
                    item.attribute_value
                  )
                )
              )
            }
          }
        ]
      })
    }
  }
}
</script>
<style scoped lang="scss">
.sku-img {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-right: 5px;
  vertical-align: middle;
}
</style>
