<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1 && $route.path.indexOf('editor') === -1">
      <el-row
        class="content-bottom-padded"
        :gutter="20"
      >
        <el-col :span="4">
          <el-button
            type="primary"
            icon="plus"
            @click="addTemplate"
          >
            添加模板
          </el-button>
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="params.tem_name"
            placeholder="模板名称"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchData"
            />
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="params.tem_type"
            placeholder="模板类型"
            style="width: 100%"
            @change="searchData"
          >
            <el-option
              key="basic_entry"
              label="基础录入"
              value="basic_entry"
            />
            <el-option
              key="ask_answer_paper"
              label="问卷调查"
              value="ask_answer_paper"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-tabs
        v-model="activeName"
        type="border-card"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.name"
          :name="item.activeName"
        >
          <el-table
            v-loading="loading"
            :data="ItemsList"
            :height="wheight - 280"
          >
            <el-table-column
              prop="id"
              label="ID"
              width="100"
            />
            <el-table-column
              prop="tem_name"
              label="模板名称"
              width="300"
            />
            <el-table-column
              prop="tem_type"
              label="模板类型"
              width="300"
            />
            <el-table-column
              prop="status"
              label="状态"
              width="100"
            />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <router-link
                  class="iconfont icon-edit1"
                  :to="{ path: matchHidePage('editor'), query: { id: scope.row.id } }"
                />
                <i
                  class="iconfont icon-search-plus"
                  @click="preview(scope.$index, scope.row)"
                />
                <i
                  v-if="scope.row.status == 1"
                  class="mark iconfont icon-trash-alt1"
                  @click="deleteAction(scope.$index, scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
          <div class="content-center content-top-padded">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next"
              :current-page.sync="params.page"
              :page-sizes="[10, 20, 50]"
              :total="total_count"
              :page-size="params.pageSize"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        :visible.sync="dialogVisible"
        :title="dialogTitle"
        width="50"
      >
        <el-alert
          v-if="headerTitle"
          :title="headerTitle"
          type="info"
          :closable="false"
        /><br>
        <el-card
          v-for="(carditem, index) in dialogContent"
          :key="index"
        >
          <div slot="header">
            {{ carditem.title }}
          </div>
          <el-form
            ref="carditem.formdata"
            label-width="100px"
            label-position="right"
            class="demo-ruleForm"
          >
            <el-form-item
              v-for="(item, index) in carditem.formdata"
              :key="index"
              :label="item.field_title"
            >
              <el-col
                v-if="item.form_element == 'text'"
                :span="12"
              >
                <el-input
                  placeholder="text预览"
                  disabled
                />
              </el-col>
              <el-col
                v-if="item.form_element == 'number'"
                :span="12"
              >
                <el-input
                  placeholder="1"
                  size="mini"
                  disabled
                  style="width: 120px"
                />
                <span class="frm-tips"> (只能是数字)</span>
              </el-col>
              <el-col
                v-if="item.form_element == 'textarea'"
                :span="12"
              >
                <el-input
                  type="textarea"
                  placeholder="textarea预览"
                  disabled
                  :rows="5"
                />
              </el-col>
              <el-col
                v-if="item.form_element == 'radio'"
                :span="12"
              >
                <el-radio-group disabled>
                  <el-radio
                    v-for="(item, index) in item.options"
                    :key="index"
                    :label="3"
                  >
                    {{
                      item.value
                    }}
                  </el-radio>
                </el-radio-group>
              </el-col>
              <el-col
                v-if="item.form_element == 'checkbox'"
                :span="12"
              >
                <el-checkbox-group disabled>
                  <el-checkbox
                    v-for="(item, index) in item.options"
                    :key="index"
                    label="item.value"
                  >
                    {{ item.value }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-col>
              <el-col
                v-if="item.form_element == 'select'"
                :span="12"
              >
                <el-select placeholder="请选择">
                  <el-option
                    v-for="(item, index) in item.options"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value"
                    disabled
                  />
                </el-select>
              </el-col>
            </el-form-item>
          </el-form>
        </el-card>
        <el-alert
          v-if="bottomTitle"
          :title="bottomTitle"
          type="info"
          :closable="false"
        />
        <el-button
          type="primary"
          disabled
        >
          确认提交
        </el-button>
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import {
  getTemplateInfo,
  getTemplateList,
  deleteTemplate,
  restoreTemplate
} from '../../../api/selfhelpform'
export default {
  provide () {
    return {
      refresh: this.getDataList
    }
  },
  data () {
    return {
      templateName: '',
      isEdit: false,
      tabList: [
        { name: '有效模板', value: '1', activeName: 'first' },
        { name: '弃用模板', value: '2', activeName: 'second' }
      ],
      activeName: 'first',
      ItemsList: [],
      ItemsDetailVisible: false,
      itemsDetailData: {},
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 10,
        tem_name: '',
        tem_type: '',
        is_valid: 1
      },
      dialogVisible: false,
      dialogContent: [],
      headerTitle: '',
      bottomTitle: '',
      dialogTitle: ''
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    getStatus (val) {
      if (val) {
        this.getDataList()
      }
    }
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getDataList()
    },
    handleSizeChange (pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getDataList()
    },
    addTemplate () {
      // 添加商品
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    editTemplateAction (index, row) {
      // 编辑商品弹框
      this.$router.push({ path: '/member/selfservice/formtemplateadd/' + row.id })
    },
    preview (index, row) {
      // 编辑商品弹框
      this.dialogVisible = true
      this.dialogTitle = row.tem_name + '( 预览模式 )'
      this.dialogContent = row.content
      this.headerTitle = row.header_title
      this.bottomTitle = row.bottom_title
    },
    searchData () {
      this.params.page = 1
      this.getDataList()
    },
    getDataList () {
      this.loading = true
      getTemplateList(this.params).then((response) => {
        this.ItemsList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    deleteAction (index, row) {
      this.$confirm('此操作将废弃该模板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteTemplate(row.id)
            .then((response) => {
              this.ItemsList.splice(index, 1)
              this.$message({
                message: '废弃成功',
                type: 'success',
                duration: 5 * 1000
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '废弃失败'
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
    getTaskTime (strDate) {
      let date = new Date(strDate)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let str = y + '-' + m + '-' + d
      return str
    },
    getTimeStr (date) {
      return this.getTaskTime(new Date(parseInt(date) * 1000))
    },
    handleClick (tab, event) {
      this.params.page = 1
      if (this.activeName == 'second') {
        this.params.is_valid = 2
      } else {
        this.params.is_valid = 1
      }
      this.getDataList()
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
  img {
    width: 90%;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 10px;
  img {
    width: 90%;
  }
}
.row-bg {
  padding: 10px 20px;
  background-color: #f9fafc;
}
.service-label .el-checkbox:first-child {
  margin-left: 15px;
}
.service-label .el-input:first-child {
  margin-left: 15px;
}
.grid-detail {
  max-height: 300px;
  overflow-y: scroll;
  margin-bottom: 20px;
}
.el-carousel {
  width: 375px;
}
.el-dialog {
  width: 30%;
}
</style>
<style lang="scss">
.grid-detail {
  table,
  .detail-content-wrap,
  .detail-content-item {
    width: 100% !important;
  }
  img {
    width: 100%;
  }
}
.grid-attribute {
  table {
    width: 100% !important;
  }
}
</style>
