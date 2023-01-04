<template>
  <SpRouterView>
    <SpPlatformTip h5 app alipay />
    <div class="action-container">
      <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addElement">
        活动添加
      </el-button>
    </div>

    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
      <SpFilterFormItem prop="field_title" label="标题:">
        <el-input v-model="params.field_title" placeholder="标题" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="状态" label="标题:">
        <el-select v-model="params.status" placeholder="状态">
          <el-option key="waiting" label="未开始" value="waiting" />
          <el-option key="ongoing" label="进行中" value="ongoing" />
          <el-option key="end" label="已结束" value="end" />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="create_time" label="时间:">
        <el-date-picker
          v-model="params.create_time"
          type="daterange"
          value-format="yyyy/MM/dd"
          placeholder="根据添加时间筛选"
        />
      </SpFilterFormItem>
    </SpFilterForm>

    <el-table v-loading="loading" border :data="tableList">
      <el-table-column prop="activity_id" label="编号" width="50" />
      <el-table-column prop="activity_name" label="活动名称" width="300" />
      <el-table-column prop="start_time" label="活动有效期" width="300">
        <template slot-scope="scope">
          {{ scope.row.start_date }} ~ {{ scope.row.end_date }}
        </template>
      </el-table-column>
      <el-table-column prop="total_join_num" label="报名人数" width="100">
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
          <i class="iconfont icon-search-plus" @click="preview(scope.$index, scope.row)" />
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
        :current-page.sync="page.pageIndex"
        :page-sizes="[10, 20, 50]"
        :total="page.total"
        :page-size="page.pageSize"
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
      />
    </div>

    <el-dialog :visible.sync="dialogVisible">
      <el-form ref="dataInfo" label-width="200px" label-position="left" class="demo-ruleForm">
        <el-form-item :label="dataInfo.field_title">
          <el-col v-if="dataInfo.form_element == 'text'" :span="12">
            <el-input placeholder="text预览" />
          </el-col>
          <el-col v-if="dataInfo.form_element == 'textarea'" :span="12">
            <el-input type="textarea" placeholder="textarea预览" />
          </el-col>
          <el-col v-if="dataInfo.form_element == 'number'" :span="12">
            <el-input-number type="textarea" placeholder="55.55" />
          </el-col>
          <el-col v-if="dataInfo.form_element == 'image'" :span="12">
            <el-upload class="avatar-uploader" action="" :show-file-list="false">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-col>
          <el-col v-if="dataInfo.form_element == 'radio'" :span="12">
            <el-radio-group>
              <el-radio v-for="(item, index) in dataInfo.options" :key="index" :label="3">
                {{ item.value }}
              </el-radio>
            </el-radio-group>
          </el-col>
          <el-col v-if="dataInfo.form_element == 'checkbox'" :span="12">
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
          <el-col v-if="dataInfo.form_element == 'select'" :span="12">
            <el-select placeholder="请选择">
              <el-option
                v-for="item in dataInfo.options"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col v-if="dataInfo.form_element == 'date'" :span="12">
            <el-date-picker v-model="value1" type="date" placeholder="选择日期" />
          </el-col>
          <el-col v-if="dataInfo.form_element == 'time'" :span="12">
            <el-time-picker
              v-model="value2"
              arrow-control
              :picker-options="{
                selectableRange: '18:30:00 - 20:30:00'
              }"
              placeholder="任意时间点"
            />
          </el-col>
          <el-col v-if="dataInfo.form_element == 'area'" :span="12">
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
  </SpRouterView>
</template>
<script>
import { regActivityDel, regActivityInvalid } from '@/api/selfhelpform'
import mixin, { pageMixin } from '@/mixins'
export default {
  mixins: [mixin, pageMixin],
  provide() {
    return {
      refresh: this.fetchList
    }
  },
  data() {
    const initialParams = {
      field_title: undefined,
      status: 'ongoing',
      create_time: []
    }
    return {
      initialParams,
      params: {
        ...initialParams
      },
      imageUrl: '',
      loading: false,
      dialogVisible: false,
      dataInfo: {},
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
  watch: {
    getStatus(val) {
      if (val) {
        this.fetchList()
      }
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    addElement() {
      // 添加商品
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    delData(index, row) {
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
    invalidData(index, row) {
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
    preview(index, row) {
      // 预览弹框
      this.dialogVisible = true
      this.dataInfo = row
    },
    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    onReset() {
      this.params = { ...this.initialParams }
      this.onSearch()
    },
    getParams() {
      const time = {}
      const create_time = this.params.create_time
      if (create_time.length) {
        time.start_time = this.dateStrToTimeStamp(create_time[0] + ' 00:00:00')
        time.end_time = this.dateStrToTimeStamp(create_time[1] + ' 00:00:00')
      }
      let params = {
        ...this.params,
        create_time: [],
        ...time
      }
      return params
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.getParams()
      }
      const { list, total_count } = await this.$api.selfhelpform.regActivityList(params)
      this.tableList = list
      this.page.total = total_count
      this.loading = false
    },
    deleteAction(index, row) {
      this.$confirm('此操废弃该元素, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteSetting(row.activity_id)
            .then((response) => {
              this.tableList.splice(index, 1)
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
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
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
.sp-filter-form {
  margin-bottom: 16px;
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
