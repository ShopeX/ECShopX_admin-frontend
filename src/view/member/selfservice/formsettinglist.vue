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
            @click="addElement"
          >
            表单元素添加
          </el-button>
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="params.form_element"
            placeholder="请选择表单元素"
            style="width: 100%"
            @change="searchData"
          >
            <el-option
              v-for="(item, key) in formElement"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="params.field_title"
            placeholder="标题"
            style="width: 100%"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchData"
            />
          </el-input>
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
              width="50"
            />
            <el-table-column
              prop="field_title"
              label="标题"
              width="250"
            />
            <el-table-column
              prop="field_name"
              label="唯一标示(纯字母)"
              width="200"
            />
            <el-table-column
              prop="form_element"
              label="元素类型"
              width="100"
            />
            <el-table-column label="元素选择项">
              <template slot-scope="scope">
                <span
                  v-for="(item, index) in scope.row.options"
                  :key="index"
                >
                  {{ item.value }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="100"
            >
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
      <el-dialog :visible.sync="dialogVisible">
        <el-form
          ref="dataInfo"
          label-width="200px"
          label-position="left"
          class="demo-ruleForm"
        >
          <el-form-item :label="dataInfo.field_title">
            <el-col
              v-if="dataInfo.form_element == 'text'"
              :span="12"
            >
              <el-input placeholder="text预览" />
            </el-col>
            <el-col
              v-if="dataInfo.form_element == 'textarea'"
              :span="12"
            >
              <el-input
                type="textarea"
                placeholder="textarea预览"
              />
            </el-col>
            <el-col
              v-if="dataInfo.form_element == 'number'"
              :span="12"
            >
              <el-input-number
                type="textarea"
                placeholder="55.55"
              />
            </el-col>
            <el-col
              v-if="dataInfo.form_element == 'image'"
              :span="12"
            >
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
              >
                <img
                  v-if="imageUrl"
                  :src="imageUrl"
                  class="avatar"
                >
                <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
                />
              </el-upload>
            </el-col>
            <el-col
              v-if="dataInfo.form_element == 'radio'"
              :span="12"
            >
              <el-radio-group>
                <el-radio
                  v-for="(item, index) in dataInfo.options"
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
              v-if="dataInfo.form_element == 'checkbox'"
              :span="12"
            >
              <el-checkbox-group>
                <el-checkbox
                  v-for="(item, index) in dataInfo.options"
                  :key="index"
                  label="item.value"
                >
                  {{ item.value }}
                </el-checkbox>
              </el-checkbox-group>
            </el-col>
            <el-col
              v-if="dataInfo.form_element == 'select'"
              :span="12"
            >
              <el-select placeholder="请选择">
                <el-option
                  v-for="(item, key) in dataInfo.options"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col
              v-if="dataInfo.form_element == 'date'"
              :span="12"
            >
              <el-date-picker
                v-model="value1"
                type="date"
                placeholder="选择日期"
              />
            </el-col>
            <el-col
              v-if="dataInfo.form_element == 'time'"
              :span="12"
            >
              <el-time-picker
                v-model="value2"
                arrow-control
                :picker-options="{
                  selectableRange: '18:30:00 - 20:30:00'
                }"
                placeholder="任意时间点"
              />
            </el-col>
            <el-col
              v-if="dataInfo.form_element == 'area'"
              :span="12"
            >
              <el-cascader
                v-model="value"
                :options="options"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange"
              />
            </el-col>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import {
  saveSetting,
  getSettingList,
  getSettingInfo,
  updateSetting,
  deleteSetting,
  restoreSetting
} from '../../../api/selfhelpform'
export default {
  provide () {
    return {
      refresh: this.getDataList
    }
  },
  data () {
    return {
      fieldTitle: '',
      isEdit: false,
      imageUrl: '',
      tabList: [
        { name: '有效元素', value: '1', activeName: 'first' },
        { name: '弃用元素', value: '2', activeName: 'second' }
      ],
      activeName: 'first',
      ItemsList: [],
      ItemsDetailVisible: false,
      itemsDetailData: {},
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 8,
        field_title: '',
        form_element: '',
        is_valid: 1
      },
      dialogVisible: false,
      dataInfo: {},
      formElement: [
        { name: '文本框', value: 'text' },
        { name: '文本域', value: 'textarea' },
        { name: '单选按钮', value: 'radio' },
        { name: '复选框', value: 'checkbox' },
        { name: '下拉选择框', value: 'select' },
        { name: '日期选择', value: 'date' },
        { name: '地区地址选择', value: 'area' },
        { name: '数字', value: 'number' }
      ],
      options: [
        {
          value: 'ziyuan',
          label: '资源',
          children: [
            {
              value: 'axure',
              label: 'Axure Components'
            },
            {
              value: 'sketch',
              label: 'Sketch Templates'
            },
            {
              value: 'jiaohu',
              label: '组件交互文档'
            }
          ]
        }
      ]
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
    addElement () {
      // 添加商品
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    editAction (index, row) {
      // 编辑商品弹框
      this.$router.push({ path: '/member/selfservice/formsettingadd/' + row.id })
    },
    preview (index, row) {
      // 预览弹框
      this.dialogVisible = true
      this.dataInfo = row
    },
    searchData () {
      this.params.page = 1
      this.getDataList()
    },
    getDataList () {
      this.loading = true
      getSettingList(this.params)
        .then((response) => {
          this.ItemsList = response.data.data.list
          this.total_count = response.data.data.total_count
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: '获取列表信息出错'
          })
        })
    },
    deleteAction (index, row) {
      this.$confirm('此操废弃该元素, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteSetting(row.id)
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
