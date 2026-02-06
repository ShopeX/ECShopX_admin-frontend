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
      <el-button type="primary" @click="handleNew"> 新增参数 </el-button>
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
    <sideBar :visible.sync="show_sideBar" :title="form.attribute_id ? '编辑参数' : '新增参数'">
      <ParamsForm :value="form" @submit="onFormSubmit" />
      <div slot="footer">
        <el-button type="primary" @click="handleFormSubmit"> 提交 </el-button>
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

const [ParamsForm, ParamsFormApi] = useForm({
  formType: 'normalForm',
  labelWidth: '80px',
  labelInline: true,
  showDefaultActions: false,
  formItems: [
    {
      fieldName: 'attribute_name',
      label: '参数名称',
      component: 'input',
      value: '',
      componentProps: {
        placeholder: '请输入参数名称'
      },
      rules: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
    },
    {
      fieldName: 'attribute_memo',
      label: '参数备注',
      component: 'input',
      value: '',
      componentProps: {
        placeholder: '请输入参数备注'
      }
    },
    {
      fieldName: 'is_show',
      label: '参数类型',
      component: 'radio',
      value: true,
      componentProps: {
        options: [
          { label: '支持商品高级筛选', value: true },
          { label: '仅用于商品详情展示', value: false }
        ]
      }
    },
    {
      fieldName: 'attribute_values',
      label: '参数值',
      component: ({ h, value, onInput, formData }) => {
        return (
          <div>
            {value.map((item, index) => (
              <div key={index} class='flex items-center mb-2 bg-gray-50 rounded'>
                <div class='flex-1 mr-2.5'>
                  <el-input
                    value={item.attribute_value}
                    placeholder='参数值名称'
                    on-input={(val) => {
                      const newValues = [...value]
                      newValues[index].attribute_value = val
                      onInput(newValues)
                    }}
                  />
                </div>
                <div
                  class='cursor-pointer flex items-center text-gray-500 p-1 rounded'
                  onClick={async () => {
                    try {
                      await Vue.prototype.$confirm('确认删除当前值？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                      })
                      const newValues = [...value]
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
                  if (value.length >= 50) {
                    Vue.prototype.$message({ type: 'warning', message: '最多添加50项' })
                    return
                  }
                  const newValues = [...value, { attribute_value: '' }]
                  onInput(newValues)
                }}
              >
                添加参数值
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
      this.$confirm('确认删除该参数？')
        .then((_) => {
          deleteGoodsAttr(data.row.attribute_id).then((res) => {
            this.$message({ type: 'success', message: '操作成功' })
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
        // 安全地解析 is_show
        let isShow = data.is_show
        if (typeof data.is_show === 'string') {
          try {
            if (data.is_show.trim() === '') {
              isShow = false
            } else {
              isShow = JSON.parse(data.is_show)
            }
          } catch (e) {
            // 如果解析失败，尝试直接比较字符串
            isShow = data.is_show === 'true' || data.is_show === true
          }
        }

        // 安全地处理 attribute_values
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
        this.$message({ type: 'error', message: '参数类型为高级筛选类型，参数值不能为空' })
        return
      }
      const params = JSON.parse(JSON.stringify(submitData))
      params.attribute_values = JSON.stringify(params.attribute_values)
      // 如果没有id，则表示为新增
      if (!submitData.attribute_id) {
        addGoodsAttr(params).then((res) => {
          this.$message({ type: 'success', message: '操作成功' })
          this.resetData()
          this.show_sideBar = false
          this.$refs.finder.refresh(true)
        })
      } else {
        updateGoodsAttr(params.attribute_id, params).then((res) => {
          this.$message({ type: 'success', message: '操作成功' })
          this.show_sideBar = false
          this.$refs.finder.refresh()
        })
      }
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    // 搜索表单配置
    searchFormItems() {
      return [
        {
          fieldName: 'attribute_name',
          label: '参数名称',
          component: 'input',
          cellWidth: 1.3,
          componentProps: {
            clearable: true,
            placeholder: '请输入参数名称'
          }
        }
      ]
    },
    // 表格配置
    tableSetting() {
      return createSetting({
        actions: [
          {
            name: '编辑',
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
            name: '删除',
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
            name: '参数类型',
            key: 'is_show',
            formatter: (value) => {
              if (value == null || value === '') {
                return '纯显示'
              }
              let isShow = value
              if (typeof value === 'string') {
                try {
                  isShow = JSON.parse(value)
                } catch (e) {
                  // 如果解析失败，尝试直接比较字符串
                  isShow = value === 'true' || value === true
                }
              }
              return isShow ? '高级筛选' : '纯显示'
            }
          },
          {
            name: '参数名称',
            key: 'attribute_name',
            width: 200
          },
          {
            name: '参数备注',
            key: 'attribute_memo'
          },
          {
            name: '参数值',
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
