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
      <el-button type="primary" @click="handleNew"> {{ i18n.t('5db1387d.ac469a') }} </el-button>
    </div>
    <!-- <div class="action-container">
      <el-button
        type="primary"
        plain
        @click="syncItemSpec"
      >
        同步规格
      </el-button>
    </div> -->
    <el-table
      v-loading="loading"
      border
      :data="list"
      :height="wheight - 170"
      :element-loading-text="$t('5db1387d.f09b12')"
      :default-sort="{ prop: 'bind_date', order: 'descending' }"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <span
            v-for="(item, index) in props.row.attribute_values.list"
            :key="index"
            class="sku-value"
            ><img v-if="item.image_url" class="sku-img" :src="item.image_url" />{{
              item.attribute_value
            }}</span
          >
        </template>
      </el-table-column>
      <el-table-column :label="i18n.t('5db1387d.2b6bc0')" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row)">
            {{ i18n.t('5db1387d.95b351') }}
          </el-button>
          <el-button type="text" @click="handleDelete(scope)">
            {{ i18n.t('5db1387d.2f4aad') }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :label="i18n.t('5db1387d.226b09')" width="150">
        <template slot-scope="props">
          {{
            normalizeIsImage(props.row.is_image)
              ? i18n.t('5db1387d.20def7')
              : i18n.t('5db1387d.ca746b')
          }}
        </template>
      </el-table-column>
      <el-table-column prop="attribute_name" :label="i18n.t('5db1387d.023809')" width="200" />
      <el-table-column prop="attribute_memo" :label="i18n.t('5db1387d.bfe414')" />
    </el-table>
    <div class="mt-4 text-right">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :current-page.sync="page.pageIndex"
        :page-sizes="[10, 20, 50]"
        :total="total_count"
        :page-size="page.pageSize"
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
      />
    </div>
    <imgPicker
      :dialog-visible="imgDialog"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeImgDialog"
    />
    <sideBar
      :visible.sync="show_sideBar"
      :title="form.attribute_id ? i18n.t('5db1387d.6dccdf') : i18n.t('5db1387d.ac469a')"
    >
      <component :is="SpecForm" :value="form" @submit="onFormSubmit" />
      <div slot="footer">
        <el-button type="primary" @click="handleFormSubmit">
          {{ i18n.t('5db1387d.939d53') }}
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
import imgPicker from '@/components/imageselect'
import {
  getGoodsAttr,
  addGoodsAttr,
  updateGoodsAttr,
  deleteGoodsAttr,
  syncItemSpec
} from '../../../../api/goods'
import { pageMixin } from '@/mixins'
import sideBar from '@/components/element/sideBar'
import { useForm } from '@/composables'
import Vue from 'vue'
import { i18n } from '@/i18n'
import SpTranslatePopup from '@/components/sp-translate-popup'
import translateMixin from '@/mixins/translateMixin'

let SpecFormApi = null

export default {
  components: {
    sideBar,
    imgPicker,
    SpTranslatePopup
  },
  mixins: [pageMixin, translateMixin],
  data() {
    // 创建表单组件和 API
    const [SpecForm, SpecFormApiInstance] = useForm({
      formType: 'normalForm',
      labelWidth: '80px',
      labelInline: true,
      showDefaultActions: false,
      i18n: i18n,
      formItems: [
        {
          fieldName: 'attribute_name',
          label: i18n.t('5db1387d.023809'),
          component: 'input',
          value: '',
          componentProps: {
            placeholder: i18n.t('5db1387d.1b54dd')
          },
          rules: [{ required: true, message: i18n.t('5db1387d.1b54dd'), trigger: 'blur' }]
        },
        {
          fieldName: 'attribute_memo',
          label: i18n.t('5db1387d.bfe414'),
          component: 'input',
          value: '',
          componentProps: {
            placeholder: i18n.t('5db1387d.82edac')
          }
        },
        {
          fieldName: 'is_image',
          label: i18n.t('5db1387d.1ca8f1'),
          component: 'radio',
          value: false,
          componentProps: {
            options: [
              { label: i18n.t('5db1387d.ca746b'), value: false },
              { label: i18n.t('5db1387d.20def7'), value: true }
            ]
          }
        },
        {
          fieldName: 'attribute_values',
          label: i18n.t('5db1387d.94d502'),
          component: ({ h, value, onInput, formData }) => {
            const isImage = formData.is_image
            const vm = this // 访问组件实例
            return (
              <div>
                {value.map((item, index) => (
                  <div key={index} class='flex items-center mb-2 bg-gray-50 rounde'>
                    {isImage && (
                      <div
                        class='w-12 h-12 flex justify-center items-center cursor-pointer border border-gray-200 rounded mr-2'
                        onClick={() => {
                          vm.handleImgPicker(index)
                        }}
                      >
                        {item.image_url ? (
                          <img src={item.image_url} class='w-12 h-12 object-cover rounded' />
                        ) : (
                          <SpIcon size={22} name='camera' />
                        )}
                      </div>
                    )}
                    <div class='flex-1 mr-2'>
                      <el-input
                        value={item.attribute_value}
                        placeholder={vm.$t('5db1387d.2690c2')}
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
                          await Vue.prototype.$confirm(
                            vm.$t('5db1387d.167628'),
                            vm.$t('5db1387d.02d981'),
                            {
                              confirmButtonText: vm.$t('5db1387d.38cf16'),
                              cancelButtonText: vm.$t('5db1387d.625fb2'),
                              type: 'warning'
                            }
                          )
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
                        Vue.prototype.$message({
                          type: 'warning',
                          message: vm.$t('5db1387d.94360c')
                        })
                        return
                      }
                      const newValues = [...value, { attribute_value: '', image_url: '' }]
                      onInput(newValues)
                    }}
                  >
                    {vm.$t('5db1387d.cfa46a')}
                  </el-button>
                </div>
              </div>
            )
          },
          value: [{ attribute_value: '', image_url: '' }]
        }
      ]
    })

    // 将 API 保存到组件实例
    SpecFormApi = SpecFormApiInstance

    return {
      i18n,
      SpecForm,
      currentIndex: '',
      form: {
        is_image: false,
        attribute_type: 'item_spec',
        attribute_id: '',
        attribute_name: '',
        attribute_memo: '',
        attribute_values: [{ attribute_value: '', image_url: '' }]
      },
      searchParams: {
        attribute_type: 'item_spec',
        attribute_name: ''
      },
      list: [],
      loading: false,
      imgDialog: false,
      isGetImage: false,
      imgIndex: 0,
      brand_name: '',
      total_count: 0,
      show_sideBar: false
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    // 统一转换 is_image 为布尔值
    normalizeIsImage(value) {
      return value == true || value == 1 || value == 'true'
    },
    handleDelete(data) {
      this.$confirm(this.$t('5db1387d.67d5b6'))
        .then((_) => {
          deleteGoodsAttr(data.row.attribute_id).then((res) => {
            this.list.splice(data.$index, 1)
            this.$message({ type: 'success', message: this.$t('5db1387d.33130f') })
          })
        })
        .catch((_) => {})
    },
    handleNew() {
      this.show_sideBar = true
      this.resetData()
      this.$nextTick(() => {
        if (SpecFormApi.resetFields) {
          SpecFormApi.resetFields()
        }
        if (SpecFormApi.setFieldsValue) {
          SpecFormApi.setFieldsValue({
            attribute_name: '',
            attribute_memo: '',
            is_image: false,
            attribute_values: [{ attribute_value: '', image_url: '' }]
          })
        }
      })
    },
    resetData() {
      this.form = {
        is_image: false,
        attribute_type: 'item_spec',
        attribute_id: '',
        attribute_name: '',
        attribute_memo: '',
        attribute_values: [{ attribute_value: '', image_url: '' }]
      }
    },
    handleEdit(data) {
      this.show_sideBar = true
      this.$nextTick(() => {
        const isImage = this.normalizeIsImage(data.is_image)
        let attributeValues = (data.attribute_values && data.attribute_values.list) || []
        // 如果为空，设置默认值
        if (attributeValues.length === 0) {
          attributeValues = [{ attribute_value: '', image_url: '' }]
        }

        SpecFormApi.setFieldsValue({
          attribute_name: data.attribute_name,
          attribute_memo: data.attribute_memo,
          is_image: isImage,
          attribute_values: attributeValues
        })
        this.form = {
          is_image: isImage,
          attribute_id: data.attribute_id,
          attribute_type: data.attribute_type,
          attribute_name: data.attribute_name,
          attribute_memo: data.attribute_memo,
          attribute_values: attributeValues
        }
      })
    },
    async handleFormSubmit() {
      try {
        await SpecFormApi.validate()
        const formData = SpecFormApi.getFieldsValue()
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
      const params = JSON.parse(JSON.stringify(submitData))
      params.attribute_values = JSON.stringify(params.attribute_values)
      // 如果没有id，则表示为新增
      if (!submitData.attribute_id) {
        addGoodsAttr(params).then((res) => {
          this.$message({ type: 'success', message: this.$t('5db1387d.33130f') })
          this.page.pageIndex = 1
          this.resetData()
          this.show_sideBar = false
          this.fetchList()
          // 创建/编辑保持一致：弹「同步翻译」弹框
          const newAttrId = (res && res.data && res.data.data && (res.data.data.attribute_id || res.data.data.id)) || 0
          if (newAttrId) {
            this.openTranslate(newAttrId, ['attribute_name', 'attribute_memo'], [submitData.attribute_name || '', submitData.attribute_memo || ''])
          }
        })
      } else {
        updateGoodsAttr(params.attribute_id, params).then((res) => {
          this.$message({ type: 'success', message: this.$t('5db1387d.33130f') })
          this.show_sideBar = false
          this.fetchList()
          this.openTranslate(params.attribute_id, ['attribute_name', 'attribute_memo'], [submitData.attribute_name || '', submitData.attribute_memo || ''])
        })
      }
    },
    onTranslateDone() {},
    // 列表页内嵌表单：仅保存/取消停留在当前列表页
    goBackTranslateList() {},
    onSearch() {
      this.page.pageIndex = 1
      this.fetchList()
    },
    fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.searchParams
      }
      getGoodsAttr(params).then((res) => {
        // 统一转换 is_image 为布尔值
        this.list = res.data.data.list.map((item) => ({
          ...item,
          is_image: this.normalizeIsImage(item.is_image)
        }))
        this.total_count = res.data.data.total_count
        this.loading = false
      })
    },
    handleImgChange(data) {
      this.imgDialog = true
      this.isGetImage = true
      this.imgIndex = data.$index
    },
    handleImgPicker(index) {
      this.currentIndex = index
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg(data) {
      if (SpecFormApi && SpecFormApi.getFieldsValue) {
        const formData = SpecFormApi.getFieldsValue()
        const attributeValues = [...(formData.attribute_values || [])]
        if (attributeValues[this.currentIndex]) {
          attributeValues[this.currentIndex].image_url = data.url
          SpecFormApi.setFieldsValue({
            attribute_values: attributeValues
          })
          // 同时更新 form 数据
          this.form.attribute_values = attributeValues
        }
      } else {
        // 降级处理
        if (this.form.attribute_values[this.currentIndex]) {
          this.form.attribute_values[this.currentIndex].image_url = data.url
        }
      }
      this.imgDialog = false
    },
    closeImgDialog() {
      this.imgDialog = false
      this.isGetImage = false
    },
    syncItemSpec() {
      syncItemSpec().then((res) => {
        if (res.data.data.status == true) {
          this.$message({
            type: 'success',
            message: this.$t('5db1387d.bbdee9')
          })
        } else {
          this.$message({
            type: 'error',
            message: this.$t('5db1387d.d61036')
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
          label: this.$t('5db1387d.023809'),
          component: 'input',
          cellWidth: 1.3,
          componentProps: {
            clearable: true,
            placeholder: this.$t('5db1387d.1b54dd')
          }
        }
      ]
    }
  }
}
</script>
<style scoped lang="scss">
.sku-value {
  margin-right: 10px;
}
.sp-filter-form {
  margin-bottom: 16px;
}
.sku-img {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-right: 5px;
  vertical-align: middle;
}
.key-item {
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  &-input {
    flex: 1;
    margin: 0 10px;
  }

  .iconfont {
    color: #999;
  }
}
.upload-box {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  .avatar {
    width: 50px;
    height: 50px;
  }
  .avatar-uploader-icon {
    line-height: 50px;
    font-size: 20px;
  }
}
</style>
