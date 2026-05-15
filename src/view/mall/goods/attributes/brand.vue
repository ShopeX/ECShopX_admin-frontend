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
      <el-button type="primary" @click="handleNew"> {{ $t('6ec569f9.1c1a1f') }} </el-button>
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
    <sideBar :visible.sync="show_sideBar" :title="$t('6ec569f9.1c1a1f')">
      <BrandForm :value="form" @submit="onFormSubmit" />
      <div slot="footer">
        <el-button type="primary" @click="handleFormSubmit">
          {{ $t('6ec569f9.939d53') }}
        </el-button>
      </div>
    </sideBar>

    <SpTranslatePopup
      ref="translatePopup"
      table-name="items_attributes"
      :data-id="translateContext.dataId"
      :fields="translateContext.fields"
      :values="translateContext.values"
      :source-language="translateContext.sourceLang"
      @done="onTranslateDone"
      @save-only="onTranslateSaveOnly"
      @cancel="onTranslateCancel"
    />
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
import { i18n } from '@/i18n'
import SpTranslatePopup from '@/components/sp-translate-popup'
import translateMixin from '@/mixins/translateMixin'

const [BrandForm, BrandFormApi] = useForm({
  formType: 'normalForm',
  labelWidth: '80px',
  showDefaultActions: false,
  labelInline: true,
  formItems: [
    {
      fieldName: 'attribute_name',
      label: i18n.t('6ec569f9.fc4a05'),
      component: 'input',
      value: '',
      componentProps: {
        placeholder: i18n.t('6ec569f9.492918')
      },
      rules: [{ required: true, message: i18n.t('6ec569f9.492918'), trigger: 'blur' }]
    },
    {
      fieldName: 'image_url',
      label: i18n.t('6ec569f9.8bfb27'),
      component: 'imagepicker',
      value: '',
      componentProps: {
        multiple: false,
        limit: 1
      },
      tip: i18n.t('6ec569f9.876be1')
    }
  ]
})

export default {
  components: {
    sideBar,
    BrandForm,
    SpTranslatePopup
  },
  mixins: [translateMixin],
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
      this.$confirm(this.$t('6ec569f9.3051cf'))
        .then((_) => {
          deleteGoodsAttr(data.row.attribute_id).then((res) => {
            this.$message({ type: 'success', message: this.$t('6ec569f9.33130f') })
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
          this.$message({ type: 'success', message: this.$t('6ec569f9.33130f') })
          this.resetData()
          this.show_sideBar = false
          this.$refs.finder.refresh(true)
          // 创建/编辑保持一致：弹「同步翻译」弹框
          const newAttrId = (res && res.data && res.data.data && (res.data.data.attribute_id || res.data.data.id)) || 0
          if (newAttrId) {
            this.openTranslate(newAttrId, ['attribute_name'], [submitData.attribute_name || ''])
          }
        })
      } else {
        updateGoodsAttr(submitData.attribute_id, submitData).then((res) => {
          this.$message({ type: 'success', message: this.$t('6ec569f9.33130f') })
          this.show_sideBar = false
          this.$refs.finder.refresh()
          this.openTranslate(submitData.attribute_id, ['attribute_name'], [submitData.attribute_name || ''])
        })
      }
    },
    onTranslateDone() {},
    // 列表页内嵌表单：仅保存/取消停留在当前列表页
    goBackTranslateList() {},
    syncBrand() {
      syncBrand().then((res) => {
        if (res.data.data.status == true) {
          this.$message({
            type: 'success',
            message: this.$t('6ec569f9.bbdee9')
          })
        } else {
          this.$message({
            type: 'error',
            message: this.$t('6ec569f9.d61036')
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
          label: this.$t('6ec569f9.4e8713'),
          component: 'input',
          cellWidth: 1.3,
          componentProps: {
            clearable: true,
            placeholder: this.$t('6ec569f9.492918')
          }
        }
      ]
    },
    // 表格配置
    tableSetting() {
      return createSetting({
        actions: [
          {
            name: this.$t('6ec569f9.95b351'),
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
            name: this.$t('6ec569f9.2f4aad'),
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
            name: this.$t('6ec569f9.60fe0b'),
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
            name: this.$t('6ec569f9.4e8713'),
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
