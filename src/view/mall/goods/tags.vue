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
      <el-button type="primary" @click="addTemplate"> 添加商品标签 </el-button>
    </div>

    <SpFinder
      ref="finder"
      url="/goods/tag"
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
    <sideBar :visible.sync="show_sideBar" :title="form.tag_id ? '编辑商品标签' : '新增商品标签'">
      <TagForm :value="form" @submit="onFormSubmit" />
      <div slot="footer">
        <el-button type="primary" @click="handleFormSubmit"> 确定保存 </el-button>
      </div>
    </sideBar>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { saveTag, getTagList, getTagInfo, updateTag, deleteTag } from '../../../api/goods'
import sideBar from '@/components/element/sideBar'
import { createSetting } from '@shopex-ui/finder'
import { useForm } from '@/composables'

// 预定义颜色常量
const PREDEFINE_COLORS = ['#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585']

const [TagForm, TagFormApi] = useForm({
  formType: 'normalForm',
  labelWidth: '100px',
  labelInline: true,
  showDefaultActions: false,
  formItems: [
    {
      fieldName: 'tag_name',
      label: '标签名称',
      component: 'input',
      value: '',
      componentProps: {
        placeholder: '请输入标签名称'
      },
      rules: [{ required: true, message: '请输入标签名称', trigger: 'blur' }]
    },
    {
      fieldName: 'description',
      label: '标签说明',
      component: 'textarea',
      value: '',
      componentProps: {
        placeholder: '请输入标签说明',
        rows: 3
      }
    },
    {
      fieldName: 'tag_color',
      label: '标签颜色',
      component: ({ h, value, onInput }) => {
        return h('el-color-picker', {
          props: {
            value: value,
            showAlpha: true,
            predefine: PREDEFINE_COLORS
          },
          on: {
            input: (val) => {
              onInput(val)
            }
          }
        })
      },
      value: '#ff1939'
    },
    {
      fieldName: 'font_color',
      label: '字体颜色',
      component: ({ h, value, onInput }) => {
        return h('el-color-picker', {
          props: {
            value: value,
            showAlpha: true,
            predefine: PREDEFINE_COLORS
          },
          on: {
            input: (val) => {
              onInput(val)
            }
          }
        })
      },
      value: '#ffffff'
    },
    {
      fieldName: 'front_show',
      label: '前台显示',
      component: 'radio',
      value: '0',
      componentProps: {
        options: [
          { label: '显示', value: '1' },
          { label: '隐藏', value: '0' }
        ]
      }
    }
  ]
})

export default {
  components: {
    sideBar,
    TagForm
  },
  data() {
    return {
      show_sideBar: false,
      isEdit: false,
      searchParams: {
        tag_name: '',
        tag_source: 'all' //全部就是 all  店铺 distributor 平台 platform
      },
      options: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 'distributor',
          label: '店铺标签'
        },
        {
          value: 'platform',
          label: '平台标签'
        }
      ],
      form: {
        tag_id: '',
        tag_name: '',
        tag_color: '#ff1939',
        font_color: '#ffffff',
        description: '',
        front_show: '0'
      }
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    // 搜索表单配置
    searchFormItems() {
      return [
        {
          fieldName: 'tag_name',
          label: '标签名称',
          component: 'input',
          cellWidth: 1.3,
          componentProps: {
            clearable: true,
            placeholder: '请输入标签名称'
          }
        },
        {
          fieldName: 'tag_source',
          label: '标签类型',
          component: 'select',
          cellWidth: 1.3,
          isShow: () => this.$store.getters.login_type != 'distributor',
          componentProps: {
            placeholder: '请选择',
            options: this.options.map((item) => ({
              label: item.label,
              value: item.value
            }))
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
                this.editAction(0, row)
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
                this.deleteAction(0, row)
              }
            }
          }
        ],
        columns: [
          {
            name: '标签名称',
            key: 'tag_name',
            width: 250,
            render: (h, scope) => {
              return h('span', {
                class: 'tag',
                style: {
                  color: scope.row.font_color,
                  background: scope.row.tag_color,
                  padding: '3px 5px',
                  borderRadius: '3px',
                  fontSize: '12px',
                  lineHeight: '1'
                }
              }, scope.row.tag_name)
            }
          },
          {
            name: '店铺名称',
            key: 'distributor_name'
          },
          {
            name: '标签描述',
            key: 'description'
          }
        ]
      })
    }
  },
  mounted() {
    if (this.$store.getters.login_type == 'distributor') {
      this.searchParams.tag_source = ''
    }
  },
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
    addTemplate() {
      // 添加商品
      this.show_sideBar = true
      this.resetData()
      this.$nextTick(() => {
        if (TagFormApi.resetFields) {
          TagFormApi.resetFields()
        }
        if (TagFormApi.setFieldsValue) {
          TagFormApi.setFieldsValue({
            tag_name: '',
            description: '',
            tag_color: '#ff1939',
            font_color: '#ffffff',
            front_show: '0'
          })
        }
      })
    },
    resetData() {
      this.form = {
        tag_id: '',
        tag_name: '',
        tag_color: '#ff1939',
        font_color: '#ffffff',
        description: '',
        front_show: '0'
      }
    },
    editAction(index, row) {
      // 编辑商品弹框
      this.show_sideBar = true
      this.$nextTick(() => {
        TagFormApi.setFieldsValue({
          tag_name: row.tag_name,
          description: row.description,
          tag_color: row.tag_color,
          font_color: row.font_color,
          front_show: row.front_show
        })
        this.form = { ...row }
      })
    },
    preview(index, row) {
      // 预览弹框
      this.dialogVisible = true
      this.dataInfo = row
    },
    deleteAction(index, row) {
      this.$confirm('此操作将删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteTag(row.tag_id)
            .then((response) => {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 5 * 1000
              })
              this.$refs.finder.refresh()
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    getTaskTime(strDate) {
      let date = new Date(strDate)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let str = y + '-' + m + '-' + d
      return str
    },
    getTimeStr(date) {
      return this.getTaskTime(new Date(parseInt(date) * 1000))
    },
    async handleFormSubmit() {
      try {
        await TagFormApi.validate()
        const formData = TagFormApi.getFieldsValue()
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
      if (submitData.tag_id) {
        updateTag(submitData).then((res) => {
          if (res.data.data) {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.show_sideBar = false
            this.$refs.finder.refresh()
          }
        })
      } else {
        saveTag(submitData).then((res) => {
          if (res.data.data) {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.show_sideBar = false
            this.$refs.finder.refresh()
          }
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
.tag {
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 12px;
  line-height: 1;
}
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
