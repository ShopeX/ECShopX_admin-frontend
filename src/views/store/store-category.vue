<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpFilterForm :model="searchParams" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem :label="$t('9a30bc45.04d7d8')" prop="category_name">
        <el-input
          v-model="searchParams.category_name"
          :placeholder="$t('9a30bc45.68363f')"
          clearable
        />
      </SpFilterFormItem>
    </SpFilterForm>

    <div class="action-container">
      <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd">
        {{ $t('9a30bc45.66ab5e') }}
      </el-button>
    </div>

    <SpFinder
      ref="finder"
      no-selection
      url="/distributor/category"
      :fixed-row-action="true"
      :page-size="20"
      :setting="finderSetting"
      row-actions-fixed-align="left"
      :hooks="{
        beforeSearch: beforeSearch
      }"
    />

    <SpDialog
      ref="categoryDialogRef"
      v-model="categoryDialog"
      :title="categoryForm.category_id ? $t('9a30bc45.55d793') : $t('9a30bc45.b6cb2b')"
      :form="categoryForm"
      :form-list="categoryFormList"
      @onSubmit="onCategoryFormSubmit"
      @input="onDialogInputChange"
    />

    <SpTranslatePopup
      ref="translatePopup"
      table-name="distribution_distributor_category"
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
import { createSetting } from '@shopex-ui/finder'
import SpTranslatePopup from '@/components/sp-translate-popup'
import translateMixin from '@/mixins/translateMixin'

export default {
  name: 'StoreCategory',
  components: { SpTranslatePopup },
  mixins: [translateMixin],
  data() {
    return {
      searchParams: {
        category_name: ''
      },
      finderSetting: createSetting({
        columns: [{ name: this.$t('9a30bc45.04d7d8'), key: 'category_name' }],
        actions: [
          {
            name: this.$t('9a30bc45.95b351'),
            key: 'edit',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'link',
              handler: ([row]) => {
                this.categoryForm.category_id = row.category_id
                this.categoryForm.category_code = row.category_code
                this.categoryForm.category_name = row.category_name
                this.categoryDialog = true
              }
            }
          },
          {
            name: this.$t('9a30bc45.2f4aad'),
            key: 'delete',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'link',
              handler: ([row]) => {
                this.handleDelete(row)
              }
            }
          }
        ]
      }),
      categoryDialog: false,
      categoryForm: {
        category_id: '',
        category_code: '',
        category_name: ''
      },
      categoryFormList: [
        {
          label: this.$t('9a30bc45.04d7d8'),
          key: 'category_name',
          type: 'input',
          required: true,
          message: this.$t('9a30bc45.68363f')
        }
      ]
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
    handleAdd() {
      this.categoryForm = {
        category_id: '',
        category_code: '',
        category_name: ''
      }
      this.categoryDialog = true
    },
    onDialogInputChange() {
      // 弹框关闭时的处理
    },
    async onCategoryFormSubmit() {
      const { category_id, category_code, category_name } = this.categoryForm

      try {
        let translateCategoryId = category_id
        if (category_id) {
          // 编辑
          await this.$api.store.updateStoreCategory(category_id, { category_code, category_name })
          this.$message.success(this.$t('9a30bc45.55aa63'))
        } else {
          // 新增
          const res = await this.$api.store.createStoreCategory({ category_name })
          translateCategoryId = (res && res.data && res.data.data && (res.data.data.category_id || res.data.data.id)) || 0
          this.$message.success(this.$t('9a30bc45.3fdaea'))
        }
        this.categoryDialog = false
        this.$refs.finder.refresh(true)
        // 创建/编辑保持一致：弹「同步翻译」弹框
        if (translateCategoryId) {
          this.openTranslate(translateCategoryId, ['category_name'], [category_name || ''])
        }
      } catch (error) {
        // 错误已在拦截器中处理
        console.error('保存失败:', error)
      }
    },
    onTranslateDone() {},
    // 列表页内嵌表单：仅保存/取消停留在当前列表页
    goBackTranslateList() {},
    async handleDelete(row) {
      try {
        await this.$confirm(this.$t('9a30bc45.442ecc'), this.$t('9a30bc45.02d981'), {
          confirmButtonText: this.$t('9a30bc45.38cf16'),
          cancelButtonText: this.$t('9a30bc45.625fb2'),
          type: 'warning'
        })

        await this.$api.store.deleteStoreCategory(row.category_id)
        this.$message.success(this.$t('9a30bc45.0007d1'))
        this.$refs.finder.refresh(true)
      } catch (error) {
        if (error !== 'cancel') {
          // 错误已在拦截器中处理
          console.error('删除失败:', error)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}

.action-container {
  margin-bottom: 16px;
}

::v-deep(.sp-finder-actions__wrap) {
  justify-content: center !important;
}
</style>
