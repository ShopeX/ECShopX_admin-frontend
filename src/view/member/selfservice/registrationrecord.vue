<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
</style>

<template>
  <SpRouterView>
    <SpPage>
      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="activity_id" label="活动:">
          <el-select v-model="params.activity_id" placeholder="请选择活动">
            <el-option
              v-for="item in activity_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="mobile" label="手机号:">
          <el-input v-model="params.mobile" placeholder="手机号" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="create_time" label="时间:">
          <el-date-picker
            v-model="params.create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            placeholder="根据添加时间筛选"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="is_white_list" label="进白名单:">
          <el-select v-model="params.is_white_list" placeholder="请选择白名单">
            <el-option
              v-for="item in whiteOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="distributor" label="店铺:">
          <el-autocomplete
            v-model="params.distributor.name"
            :fetch-suggestions="queryStoreSearch"
            placeholder="请输入店铺名称"
            @select="handleSelectStore"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="true_name" label="姓名:">
          <el-input v-model="params.true_name" placeholder="姓名" />
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" @click="editorLog()"> 上传日志 </el-button>
        <el-button type="primary" @click="exportData"> 导出 </el-button>
      </div>

      <!-- <div class="action-container"> -->
      <!-- <el-button
          plain
          type="primary"
          @click="uploadHandleTemplate()"
        >
          下载模版
        </el-button> -->

      <!-- <el-upload
          class="fl"
          action=""
          :on-change="uploadHandleChange"
          :auto-upload="false"
          :show-file-list="false"
        >
          <el-button
            type="primary"
            plain
          >
            点击上传
          </el-button>
        </el-upload> -->
      <!-- </div> -->

      <el-tabs v-model="params.status" type="card" @tab-click="onSearch">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.label"
          :name="item.name"
        >
          <el-table v-loading="loading" border :data="tableList" element-loading-text="数据加载中">
            <el-table-column prop="status" label="操作" width="150">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  v-if="scope.row.status == 'pending' && !IS_DISTRIBUTOR()"
                  @click="onLinkChange(scope.row)"
                >
                  审核
                </el-button>
                <el-button type="text" @click="onLinkChange(scope.row)">详情</el-button>
                <el-button
                  type="text"
                  v-if="scope.row.status == 'passed'"
                  @click="onShowChange(scope.row)"
                >
                  核销
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="record_no" label="报名编号" />
            <el-table-column prop="group_no" width="140" label="活动群组编号" />
            <el-table-column prop="activity_name" label="活动名称" />
            <el-table-column prop="tem_name" label="报名表单" />
            <el-table-column prop="mobile" label="手机号" />
            <el-table-column prop="get_points" label="获取积分" />
            <el-table-column label="进白名单" width="120">
              <template slot-scope="scope">
                {{ scope.row.is_white_list == 1 ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column label="备注" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark" @blur="() => hanldeRemarkBlur(scope.row)" />
              </template>
            </el-table-column>

            <el-table-column prop="create_date" label="申请时间" />
            <el-table-column prop="status_name" label="状态">
              <!-- <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.status == 'pending'"
                  type="warning"
                  size="mini"
                >
                  待审核
                </el-tag>
                <el-tag
                  v-if="scope.row.status == 'passed'"
                  type="success"
                  size="mini"
                >
                  已报名
                </el-tag>
                <el-tag
                  v-if="scope.row.status == 'rejected'"
                  type="danger"
                  size="mini"
                >
                  已拒绝
                </el-tag>
                <el-tag
                  v-if="scope.row.status == 'verified'"
                  type="danger"
                  size="mini"
                >
                  已核销
                </el-tag>
                <el-tag
                  v-if="scope.row.status == 'canceled'"
                  type="danger"
                  size="mini"
                >
                  已取消
                </el-tag>
              </template> -->
            </el-table-column>
          </el-table>
          <div class="mt-4 text-right">
            <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              :current-page.sync="page.pageIndex"
              :page-sizes="[10, 20, 50]"
              :total="page.total"
              :page-size="page.pageSize"
              @current-change="onCurrentChange"
              @size-change="onSizeChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
      <SpDialog
        ref="dialogRef"
        v-model="dialogVisible"
        title="报名核销"
        :modal="false"
        width="500px"
        :form="dialogForm"
        :form-list="dialogFormList"
        @onSubmit="onDialogFormSubmit"
      />
    </SpPage>
  </SpRouterView>
</template>
<script>
import { mapGetters } from 'vuex'
import { regActivityEasylist, recordExport } from '@/api/selfhelpform'
import { handleUploadFile, exportUploadTemplate } from '@/api/common'
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
      activity_id: undefined,
      mobile: undefined,
      status: 'all',
      create_time: [],
      true_name: undefined,
      distributor_id: '',
      distributor: {
        name: undefined,
        id: undefined
      },
      is_white_list: ''
    }
    return {
      initialParams,
      params: {
        ...initialParams
      },
      tabList: [
        { label: '全部', name: 'all' },
        { label: '待审核', name: 'pending' },
        { label: '已报名', name: 'passed' },
        { label: '已拒绝', name: 'rejected' },
        { label: '已核销', name: 'verified' },
        { label: '已取消', name: 'canceled' }
      ],
      activityParams: {
        page: 1,
        pageSize: 10
        // is_valid: true
      },
      loading: false,
      activity_options: [],
      shopList: [],
      whiteOptions: [
        { label: '全部', value: '' },
        { label: '是', value: 1 },
        { label: '否', value: 2 }
      ],
      dialogVisible: false,
      dialogForm: {
        record_id: '',
        verify_code: ''
      },
      dialogFormList: [
        {
          label: '提货码',
          key: 'verify_code',
          type: 'input',
          placeholder: '请输入提货码',
          required: true,
          message: '不能为空'
        }
      ]
    }
  },
  mounted() {
    if (this.$route.query.id) {
      // this.params.record_id = this.$route.query.id
      this.params.activity_id = this.$route.query.id
    }
    this.regActivityEasylists()
    this.fetchList()
    this.getStoreList()
  },
  methods: {
    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    onReset() {
      this.params = { ...this.initialParams }
      this.params = {
        ...this.params,
        distributor: {
          id: undefined,
          name: undefined
        }
      }
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
        status: this.params.status === 'all' ? '' : this.params.status,
        ...time
      }
      delete params.distributor
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
      const { list, total_count } = await this.$api.selfhelpform.regActivityRecordlist(params)

      this.tableList = list
      this.page.total = total_count
      this.loading = false
    },
    async hanldeRemarkBlur({ record_id, remark }) {
      console.log(record_id, remark)
      await this.$api.marketing.updateRegistrationRecord({ record_id, remark })
      this.fetchList()
    },
    // 切换tab
    handleClick(tab, event) {
      this.params.status = tab.name == 'all' ? '' : tab.name
      this.onSearch()
    },
    regActivityEasylists() {
      this.loading = true
      regActivityEasylist(this.activityParams).then(response => {
        response.data.data.list.map(item => {
          this.activity_options.push({
            label: item.activity_name,
            value: item.activity_id
          })
        })
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    uploadHandleTemplate() {
      var fileName = '报名批量审核'
      let params = { file_type: 'selform_registration_record', file_name: fileName }
      exportUploadTemplate(params).then(response => {
        if (response.data.data.file) {
          var a = document.createElement('a')
          a.href = response.data.data.file
          a.download = response.data.data.name
          document.body.appendChild(a)
          a.click()
          a.remove()
        } else {
          this.$message({
            type: 'error',
            message: '没有相关数据可导出'
          })
        }
      })
    },
    uploadHandleChange(file, fileList) {
      let params = { isUploadFile: true, file_type: 'selform_registration_record', file: file.raw }
      handleUploadFile(params).then(response => {
        this.$message({
          type: 'success',
          message: '上传成功，等待处理'
        })
        this.$router.push({ path: this.matchRoutePath('editor') })
      })
    },
    editorLog() {
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    exportData() {
      this.currentPage = 1
      recordExport(this.params).then(response => {
        if (response.data.data.status) {
          this.$message({
            type: 'success',
            message: '已加入执行队列，请在设置-导出列表中下载'
          })
          this.$export_open('selform_registration_record')
          return
        } else if (response.data.data.url) {
          this.downloadUrl = response.data.data.url
          this.downloadName = response.data.data.filename
          this.downloadView = true
        } else {
          this.$message({
            type: 'error',
            message: '无内容可导出 或 执行失败，请检查重试'
          })
          return
        }
      })
    },
    async getStoreList() {
      let params = { page: 1, pageSize: 500 }
      const { list } = await this.$api.marketing.getDistributorList(params)
      if (list) {
        list.forEach(row => {
          this.shopList.push({ value: row.name, distributor_id: row.distributor_id })
        })
      }
    },
    queryStoreSearch(queryString, cb) {
      var restaurants = this.shopList
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    handleSelectStore(storeItem) {
      this.params.distributor_id = storeItem.distributor_id
      this.params.distributor.id = storeItem.distributor_id
    },
    createFilter(queryString) {
      return restaurant => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    async onDialogFormSubmit() {
      await this.$api.selfhelpform.registrationVerify(this.dialogForm)
      this.dialogVisible = false
      this.dialogForm = {}
      this.fetchList()
    },
    onShowChange(row) {
      this.dialogForm.record_id = row.record_id
      this.dialogVisible = true
    },
    onLinkChange(row) {
      this.$router.push({
        path: this.matchRoutePath('detail'),
        query: { id: row.record_id, activity_id: row.activity_id }
      })
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  }
}
</script>
