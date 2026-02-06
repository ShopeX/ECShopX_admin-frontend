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
      <el-button type="primary" @click="handleNew"> 新增品牌 </el-button>
    </div>

    <!-- <div class="action-container">
      <el-button
        type="primary"
        plain
        @click="syncBrand"
      >
        同步品牌
      </el-button>
    </div> -->
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
    <sideBar :visible.sync="show_sideBar" :title="'新增品牌'">
      <BrandForm :value="form" @submit="onFormSubmit" />
      <div slot="footer">
        <el-button type="primary" @click="handleFormSubmit"> 提交 </el-button>
      </div>
    </sideBar>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  getGoodsAttr,
  addGoodsAttr,
  updateGoodsAttr,
  deleteGoodsAttr,
  syncBrand
} from '../../../../api/goods'
import sideBar from '@/components/element/sideBar'
import { createSetting } from '@shopex-ui/finder'
import { useForm } from '@/composables'

const [BrandForm, BrandFormApi] = useForm({
  formType: 'normalForm',
  labelWidth: '80px',
  showDefaultActions: false,
  labelInline: true,
  formItems: [
    {
      fieldName: 'attribute_name',
      label: '品牌名',
      component: 'input',
      value: '',
      componentProps: {
        placeholder: '请输入品牌名称'
      },
      rules: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }]
    },
    {
      fieldName: 'image_url',
      label: '品牌logo',
      component: 'imagepicker',
      value: '',
      componentProps: {
        multiple: false,
        limit: 1
      },
      tip: '只能上传jpg/png文件，且不超过2M （建议尺寸：200px * 200px）'
    }
  ]
})

export default {
  components: {
    sideBar,
    BrandForm
  },
  data() {
    return {
      form: {
        attribute_type: 'brand',
        attribute_id: '',
        attribute_name: '',
        image_url: ''
      },
      searchParams: {
        attribute_type: 'brand',
        attribute_name: ''
      },
      brand_name: '',
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
    // handleCurrentChange(page_num) {
    //   this.page.pageIndex = page_num
    //   this.fetchList()
    // },
    // handleSizeChange(pageSize) {
    //   this.page.pageIndex = 1
    //   this.page.pageSize = pageSize
    //   this.fetchList()
    // },
    handleDelete(data) {
      this.$confirm('确认删除该品牌？')
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
        BrandFormApi.resetFields()
        BrandFormApi.setFieldsValue({
          attribute_name: '',
          image_url: ''
        })
      })
    },
    resetData() {
      this.form = {
        attribute_id: '',
        attribute_type: 'brand',
        attribute_name: '',
        image_url: ''
      }
    },
    handleEdit(data) {
      this.show_sideBar = true
      this.$nextTick(() => {
        BrandFormApi.setFieldsValue({
          attribute_name: data.attribute_name,
          image_url: data.image_url
        })
        this.form = {
          attribute_id: data.attribute_id,
          attribute_type: data.attribute_type,
          attribute_name: data.attribute_name,
          image_url: data.image_url
        }
      })
    },
    async handleFormSubmit() {
      try {
        await BrandFormApi.validate()
        const formData = BrandFormApi.getFieldsValue()
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
      // 如果没有id，则表示为新增
      if (!submitData.attribute_id) {
        addGoodsAttr(submitData).then((res) => {
          this.$message({ type: 'success', message: '操作成功' })
          this.resetData()
          this.show_sideBar = false
          this.$refs.finder.refresh(true)
        })
      } else {
        updateGoodsAttr(submitData.attribute_id, submitData).then((res) => {
          this.$message({ type: 'success', message: '操作成功' })
          this.show_sideBar = false
          this.$refs.finder.refresh()
        })
      }
    },
    syncBrand() {
      syncBrand().then((res) => {
        if (res.data.data.status == true) {
          this.$message({
            type: 'success',
            message: '已加入执行队列'
          })
        } else {
          this.$message({
            type: 'error',
            message: '同步失败'
          })
        }
      })
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    // 搜索表单配置
    searchFormItems() {
      return [
        {
          fieldName: 'attribute_name',
          label: '品牌名称',
          component: 'input',
          cellWidth: 1.3,
          componentProps: {
            clearable: true,
            placeholder: '请输入品牌名称'
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
            name: '品牌图片',
            key: 'image_url',
            width: 150,
            render: (h, scope) => {
              return h('el-image', {
                props: {
                  src: scope.row.image_url,
                  fit: 'cover'
                },
                style: {
                  width: '70px',
                  height: '70px'
                }
              })
            }
          },
          {
            name: '品牌名称',
            key: 'attribute_name'
          }
        ]
      })
    }
  }
}
</script>
<style scoped lang="scss">
.upload-box {
  width: 100px;
  height: 100px;
  .avatar-uploader-icon {
    line-height: 100px;
  }
}
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
