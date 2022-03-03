<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1 && $route.path.indexOf('editor') === -1">
      <el-row :gutter="20">
        <el-col>
          <el-input
            v-model="params.field_title"
            class="input-m"
            placeholder="标题"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchData"
            />
          </el-input>
          <el-select
            v-model="params.status"
            placeholder="状态"
            @change="searchData"
          >
            <el-option
              key="waiting"
              label="未开始"
              value="waiting"
            />
            <el-option
              key="ongoing"
              label="进行中"
              value="ongoing"
            />
            <el-option
              key="end"
              label="已结束"
              value="end"
            />
          </el-select>
          <el-date-picker
            v-model="create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            placeholder="根据添加时间筛选"
            @change="dateChange"
          />
          <el-button
            type="primary"
            icon="el-icon-circle-plus"
            @click="addElement"
          >
            活动添加
          </el-button>
        </el-col>
      </el-row>
      <el-card>
        <el-table
          v-loading="loading"
          :data="ItemsList"
        >
          <el-table-column
            prop="activity_id"
            label="编号"
            width="50"
          />
          <el-table-column
            prop="activity_name"
            label="活动名称"
            width="300"
          />
          <el-table-column
            prop="start_time"
            label="活动有效期"
            width="300"
          >
            <template slot-scope="scope">
              {{ scope.row.start_date }} ~ {{ scope.row.end_date }}
            </template>
          </el-table-column>
          <el-table-column
            prop="total_join_num"
            label="报名人数"
            width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.total_join_num || 0 }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <router-link
                class="iconfont icon-edit1"
                :to="{ path: matchHidePage('editor'), query: { id: scope.row.activity_id } }"
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
            layout="total, sizes, prev, pager, next, jumper"
            :current-page.sync="params.page"
            :page-sizes="[10, 20, 50]"
            :total="total_count"
            :page-size="params.pageSize"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </div>
      </el-card>
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
import { regActivityList, regActivityDel, regActivityInvalid } from '../../../api/selfhelpform'
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
        status: 'ongoing'
      },
      dialogVisible: false,
      dataInfo: {},
      create_time: [],
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
    delData (index, row) {
      var msg = '此操作将删除该活动, 是否继续?'
      this.$confirm(msg, '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            regActivityDel({ activity_id: row.activity_id }).then((response) => {
              this.getDataList()
              this.$message({
                message: '删除完成',
                type: 'success',
                duration: 5 * 1000
              })
            })
          }
          done()
        }
      })
    },
    invalidData (index, row) {
      var msg = '此操作将永久终止该活动, 是否继续?'
      this.$confirm(msg, '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            regActivityInvalid({ activity_id: row.activity_id }).then((response) => {
              this.getDataList()
              this.$message({
                message: '终止该活动成功',
                type: 'success',
                duration: 5 * 1000
              })
            })
          }
          done()
        }
      })
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
      regActivityList(this.params)
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
          deleteSetting(row.activity_id)
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
    },
    dateStrToTimeStamp (str) {
      return Date.parse(new Date(str)) / 1000
    },
    dateChange (val) {
      if (val.length > 0) {
        this.params.start_time = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.end_time = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      }
      this.params.page = 1
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
