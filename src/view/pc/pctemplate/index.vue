<template>
  <div class="website-template">
    <div v-if="$route.path.indexOf('editor') === -1">
      <el-row>
        <el-button type="primary" @click="dialogVisible = true"> 添加页面 </el-button>
      </el-row>
      <el-row>
        <el-tabs v-model="page_type" type="border-card" @tab-click="handleTabClick">
          <el-tab-pane
            v-for="(item, index) of tabList"
            :key="index"
            :label="item.label"
            :disabled="loading"
            :name="item.name"
          />
          <el-table v-loading="loading" stripe style="width: 100%" :data="templateList">
            <el-table-column prop="theme_pc_template_id" label="页面id" />
            <el-table-column prop="template_title" label="页面名称" />
            <el-table-column prop="template_description" label="页面描述" />
            <el-table-column prop="page_type" label="页面类型">
              <template slot-scope="scope">
                <span>{{ scope.row.page_type === 'index' ? '首页' : '自定义页' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="是否启用">
              <template slot-scope="scope">
                <div>
                  <el-tag v-if="scope.row.status === '1'" type="success"> 启用 </el-tag>
                  <el-tag v-else type="info"> 未启用 </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="250px">
              <template slot-scope="scope">
                <div>
                  <el-button type="text" size="mini" @click="handleDisable(scope.row)">
                    {{ scope.row.status === '1' ? '禁用' : '启用' }}
                  </el-button>
                  <el-button type="text" size="mini" @click="handleDelete(scope.row)">
                    删除
                  </el-button>
                  <el-button type="text" size="mini" @click="handleEdit(scope.row)">
                    编辑
                  </el-button>
                  <el-button type="primary" round size="mini" @click="handleRenovation(scope.row)">
                    页面装修
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tabs>
      </el-row>
      <div class="content-center content-top-padded">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :current-page.sync="page.page_no"
          :page-sizes="[10, 20, 50]"
          :total="page.total"
          :page-size="page.page_size"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
      <el-dialog
        title="添加/编辑页面"
        :visible.sync="dialogVisible"
        width="500px"
        :before-close="handleDialogClose"
      >
        <el-form ref="myForm" :model="formData" :rules="formRule" label-width="80px">
          <el-form-item label="页面名称" prop="template_title">
            <el-input v-model="formData.template_title" clearable placeholder="请输入页面名称" />
          </el-form-item>
          <el-form-item label="页面描述" prop="template_description">
            <el-input
              v-model="formData.template_description"
              clearable
              placeholder="请输入页面描述"
            />
          </el-form-item>
          <el-form-item label="页面类型" prop="page_type">
            <el-select v-model="formData.page_type" style="width: 100%" clearable>
              <el-option
                v-for="(item, index) of tabList"
                :key="index"
                :value="item.name"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否启用" prop="status">
            <el-switch v-model="formData.status" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="loading" @click="submitForm('myForm')"
            >确认保存</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
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
    label: '首页',
    name: 'index'
  },
  {
    label: '自定义页',
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
        template_title: '', // 页面名称
        template_description: '', // 页面描述
        page_type: '', // 页面类型
        status: false // 是否开启状态
      },
      formRule: {
        template_title: [
          {
            required: true,
            message: '请输入页面名称',
            trigger: 'blur'
          }
        ],
        template_description: [
          {
            required: true,
            message: '请输入页面描述',
            trigger: 'blur'
          }
        ],
        page_type: [
          {
            required: true,
            message: '请输入页面类型',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    this.getTemplateList()
  },
  methods: {
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
        this.formData.status = row.status === '1'
      })
    },
    handleRenovation({ theme_pc_template_id }) {
      // this.$router.push({ path: `/pc/design?id=${theme_pc_template_id}` });
      this.$router.push({
        path: '/wxapp/pcmall/design?id=' + theme_pc_template_id
      })
    },
    async handleDisable({ status, created, updated, deleted_at, ...rest }) {
      try {
        this.loading = true
        const res = await editPageTemplate({
          status: status === '1' ? '2' : '1',
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
        const result = await this.$confirm('确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
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
