<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpRouterView>
    <SpPage>
      <div class="website-template">
        <div v-if="$route.path.indexOf('editor') === -1">
          <el-row class="mb-4">
            <el-button type="primary" @click="dialogVisible = true">
              {{ $t('8b0d1458.4c503b') }}
            </el-button>
          </el-row>
          <el-row>
            <el-tabs type="card" v-model="page_type" @tab-click="handleTabClick">
              <el-tab-pane v-for="(item, index) of tabList" :key="index" :label="$t(item.labelKey)" :disabled="loading"
                :name="item.name" />
              <el-table border v-loading="loading" stripe style="width: 100%" :data="templateList">
                <el-table-column prop="theme_pc_template_id" :label="$t('8b0d1458.6872c7')" />
                <el-table-column prop="template_title" :label="$t('8b0d1458.b78454')" />
                <el-table-column prop="template_description" :label="$t('8b0d1458.abf8f4')" />
                <el-table-column prop="page_type" :label="$t('8b0d1458.46f391')">
                  <template slot-scope="scope">
                    <span>{{
                      scope.row.page_type === 'index'
                        ? $t('8b0d1458.db1c89')
                        : $t('8b0d1458.ec20e4')
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="status" :label="$t('8b0d1458.53c3dd')">
                  <template slot-scope="scope">
                    <div>
                      <el-tag v-if="isTemplateEnabled(scope.row.status)" type="success">
                        {{
                          $t('8b0d1458.7854b5')
                        }}
                      </el-tag>
                      <el-tag v-else type="info">{{ $t('8b0d1458.463776') }}</el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('8b0d1458.2b6bc0')" width="250px">
                  <template slot-scope="scope">
                    <div>
                      <el-button type="text" size="mini" @click="handleDisable(scope.row)">
                        {{
                          isTemplateEnabled(scope.row.status)
                            ? $t('8b0d1458.710ad0')
                            : $t('8b0d1458.7854b5')
                        }}
                      </el-button>
                      <el-button type="text" size="mini" @click="handleDelete(scope.row)">
                        {{ $t('8b0d1458.2f4aad') }}
                      </el-button>
                      <el-button type="text" size="mini" @click="handleEdit(scope.row)">
                        {{ $t('8b0d1458.95b351') }}
                      </el-button>
                      <el-button type="primary" round size="mini" @click="handleRenovation(scope.row)">
                        {{ $t('8b0d1458.6343df') }}
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-tabs>
          </el-row>
          <div class="content-right mt-4 content-top-padded">
            <el-pagination background layout="total, sizes, prev, pager, next, jumper" :current-page.sync="page.page_no"
              :page-sizes="[10, 20, 50]" :total="page.total" :page-size="page.page_size"
              @current-change="handleCurrentChange" @size-change="handleSizeChange" />
          </div>
          <el-dialog :title="$t('8b0d1458.b73a0b')" :visible.sync="dialogVisible" width="500px"
            :before-close="handleDialogClose">
            <el-form ref="myForm" :model="formData" :rules="formRule" label-width="80px">
              <el-form-item :label="$t('8b0d1458.b78454')" prop="template_title">
                <el-input v-model="formData.template_title" clearable :placeholder="$t('8b0d1458.7d5cc3')" />
              </el-form-item>
              <el-form-item :label="$t('8b0d1458.abf8f4')" prop="template_description">
                <el-input v-model="formData.template_description" clearable :placeholder="$t('8b0d1458.9c5cf8')" />
              </el-form-item>
              <el-form-item :label="$t('8b0d1458.46f391')" prop="page_type">
                <el-select v-model="formData.page_type" style="width: 100%" clearable>
                  <el-option v-for="(item, index) of tabList" :key="index" :value="item.name"
                    :label="$t(item.labelKey)" />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('8b0d1458.53c3dd')" prop="status">
                <el-switch v-model="formData.status" />
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" :loading="loading" @click="submitForm('myForm')">{{
                $t('8b0d1458.babc8f')
                }}</el-button>
            </span>
          </el-dialog>
        </div>
      </div>
    </SpPage>
  </SpRouterView>
</template>

<script>
import {
  fetchTemplateList,
  addPageTemplate,
  editPageTemplate,
  deletePageTemplate,
  getTemplateContent,
  saveTemplateContent,
  saveHeaderOrFooter
} from '@/api/webtemplate'

const tabList = [
  {
    labelKey: '8b0d1458.db1c89',
    name: 'index'
  },
  {
    labelKey: '8b0d1458.ec20e4',
    name: 'custom'
  }
]

export default {
  data() {
    return {
      tabList,
      templateList: [],
      page_type: 'index',
      page: {
        page_no: 1,
        page_size: 20,
        total: 0
      },
      loading: false,
      dialogVisible: false,
      formData: {
        theme_pc_template_id: '',
        template_title: '',
        template_description: '',
        page_type: '',
        status: false
      }
    }
  },
  computed: {
    formRule() {
      return {
        template_title: [{ required: true, message: this.$t('8b0d1458.7d5cc3'), trigger: 'blur' }],
        template_description: [
          { required: true, message: this.$t('8b0d1458.9c5cf8'), trigger: 'blur' }
        ],
        page_type: [{ required: true, message: this.$t('8b0d1458.8dfcc4'), trigger: 'change' }]
      }
    }
  },
  created() {
    this.getTemplateList()
  },
  methods: {
    /** 接口可能返回 number 1 或 string '1' */
    isTemplateEnabled(status) {
      return status === 1 || status === '1' || status === true || status === 'true'
    },
    handleDialogClose() {
      this.dialogVisible = false
      this.resetForm('myForm')
    },
    handleTabClick() {
      this.page.page_no = 1
      this.loading = true
      this.getTemplateList()
    },
    handleEdit(row) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.formData.theme_pc_template_id = row.theme_pc_template_id
        this.formData.template_title = row.template_title
        this.formData.template_description = row.template_description
        this.formData.page_type = row.page_type
        this.formData.status = this.isTemplateEnabled(row.status)
      })
    },
    handleRenovation({ theme_pc_template_id }) {
      this.$router.push({ path: `/decoration/web/template/edit?id=${theme_pc_template_id}` })
    },
    async handleDisable({ status, created, updated, deleted_at, ...rest }) {
      try {
        this.loading = true
        const res = await editPageTemplate({
          status: this.isTemplateEnabled(status) ? '2' : '1',
          ...rest
        })
        this.loading = false
        this.getTemplateList()
      } catch (err) {
        this.loading = false
        console.log(err)
      }
    },
    async handleDelete({ theme_pc_template_id: id }) {
      try {
        const result = await this.$confirm(this.$t('8b0d1458.f9abac'), this.$t('8b0d1458.02d981'), {
          confirmButtonText: this.$t('8b0d1458.38cf16'),
          cancelButtonText: this.$t('8b0d1458.625fb2'),
          type: 'warning'
        })
        this.loading = true
        const res = await deletePageTemplate(id)
        this.loading = false
        this.getTemplateList()
      } catch (err) {
        this.loading = false
        console.log(err)
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { status, theme_pc_template_id, ...rest } = this.formData
          this.loading = true
          const formData = {
            status: status ? '1' : '2',
            version: 'v1.0.1', // 写死 万一后面界面要改版，可以区分新旧版本的界面
            ...rest
          }
          if (theme_pc_template_id !== '') formData.theme_pc_template_id = theme_pc_template_id
          try {
            if (theme_pc_template_id === '') {
              const { data } = await addPageTemplate(formData)
            } else {
              await editPageTemplate(formData)
            }
          } catch (err) {
            console.log(err)
          }
          this.dialogVisible = false
          this.loading = false
          this.resetForm('myForm')
          this.getTemplateList()
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.formData.theme_pc_template_id = ''
    },
    async getTemplateList() {
      const { page_no, page_size } = this.page
      const { page_type } = this
      this.loading = true
      const res = await fetchTemplateList({
        page_type,
        page_no,
        page_size
      })
      this.loading = false
      this.templateList = res.data.data.list
      this.page.total = res.data.data.total_count
    },
    handleCurrentChange(page_no) {
      this.page.page_no = page_no
      this.getTemplateList()
    },
    handleSizeChange(page_size) {
      this.page.page_size = page_size
      this.getTemplateList()
    }
  }
}
</script>
