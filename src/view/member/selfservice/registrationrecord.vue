<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
</style>

<template>
  <SpRouterView>
    <SpPage>
      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="activity_id" :label="$t('a0d7a294.f8f6a0')">
          <el-select v-model="params.activity_id" :placeholder="$t('a0d7a294.252fcb')">
            <el-option
              v-for="item in activity_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="mobile" :label="$t('6b57cb80.ce2bf3')">
          <el-input v-model="params.mobile" :placeholder="$t('6b57cb80.8098e2')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="create_time" :label="$t('a0d7a294.5ba072')">
          <el-date-picker
            v-model="params.create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            :placeholder="$t('6b57cb80.e08045')"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="is_white_list" :label="$t('a0d7a294.8cdc4f')">
          <el-select v-model="params.is_white_list" :placeholder="$t('a0d7a294.72f29d')">
            <el-option
              v-for="item in whiteOptions"
              :key="item.value"
              :label="$t(item.labelKey)"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="distributor" :label="$t('15ecc99b.295713')">
          <el-autocomplete
            v-model="params.distributor.name"
            :fetch-suggestions="queryStoreSearch"
            :placeholder="$t('6b57cb80.867738')"
            @select="handleSelectStore"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="true_name" :label="$t('a0d7a294.75d152')">
          <el-input v-model="params.true_name" :placeholder="$t('a0d7a294.60d045')" />
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" @click="editorLog()">{{ $t('a0d7a294.64dedc') }}</el-button>
        <el-button type="primary" @click="exportData()">{{ $t('a0d7a294.55405e') }}</el-button>
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
          :label="$t(item.labelKey)"
          :name="item.name"
        >
          <el-table
            v-loading="loading"
            border
            :data="tableList"
            :element-loading-text="$t('731b7d26.f09b12')"
          >
            <el-table-column prop="status" :label="$t('8da83775.2b6bc0')" width="150">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  v-if="scope.row.status == 'pending' && !IS_DISTRIBUTOR()"
                  @click="onLinkChange(scope.row)"
                >
                  {{ $t('a0d7a294.cf13b1') }}
                </el-button>
                <el-button type="text" @click="onLinkChange(scope.row)">
                  {{ $t('a0d7a294.f26225') }}
                </el-button>
                <el-button
                  type="text"
                  v-if="scope.row.status == 'passed'"
                  @click="onShowChange(scope.row)"
                >
                  {{ $t('a0d7a294.e7d31e') }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="record_no" :label="$t('6b57cb80.6c5f80')" />
            <el-table-column prop="group_no" width="140" :label="$t('a0d7a294.e234d2')" />
            <el-table-column prop="activity_name" :label="$t('6b57cb80.39834b')" />
            <el-table-column prop="tem_name" :label="$t('6b57cb80.112a9c')" />
            <el-table-column prop="mobile" :label="$t('6b57cb80.8098e2')" />
            <el-table-column prop="get_points" :label="$t('15ecc99b.c07abe')" />
            <el-table-column :label="$t('15ecc99b.ac7bd3')" width="120">
              <template slot-scope="scope">
                {{ scope.row.is_white_list == 1 ? $t('15ecc99b.0a60ac') : $t('15ecc99b.c9744f') }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('a0d7a294.2432b5')" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark" @blur="() => hanldeRemarkBlur(scope.row)" />
              </template>
            </el-table-column>

            <el-table-column prop="create_date" :label="$t('a0d7a294.5ba072')" />
            <el-table-column prop="status_name" :label="$t('d3f8464b.3fea7c')">
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
        :title="$t('a0d7a294.af87cc')"
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
        { labelKey: 'ac2a6290.a8b0c2', name: 'all' },
        { labelKey: 'a0d7a294.5cb424', name: 'pending' },
        { labelKey: 'a0d7a294.4166d8', name: 'passed' },
        { labelKey: 'a0d7a294.81233d', name: 'rejected' },
        { labelKey: 'a0d7a294.77af84', name: 'verified' },
        { labelKey: 'a0d7a294.2111cc', name: 'canceled' }
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
        { labelKey: 'ac2a6290.a8b0c2', value: '' },
        { labelKey: '15ecc99b.0a60ac', value: 1 },
        { labelKey: '15ecc99b.c9744f', value: 2 }
      ],
      dialogVisible: false,
      dialogForm: {
        record_id: '',
        verify_code: ''
      },
      dialogFormList: []
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
        // 结束日取 23:59:59，与列表列「申请时间」一致，且支持起止同一天
        time.end_time = this.dateStrToTimeStamp(create_time[1] + ' 23:59:59')
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
      regActivityEasylist(this.activityParams).then((response) => {
        response.data.data.list.map((item) => {
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
      var fileName = this.$t('a0d7a294.8d6cfb')
      let params = { file_type: 'selform_registration_record', file_name: fileName }
      exportUploadTemplate(params).then((response) => {
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
            message: this.$t('731b7d26.bfd8d5')
          })
        }
      })
    },
    uploadHandleChange(file, fileList) {
      let params = { isUploadFile: true, file_type: 'selform_registration_record', file: file.raw }
      handleUploadFile(params).then((response) => {
        this.$message({
          type: 'success',
          message: this.$t('731b7d26.7bbfaa')
        })
        this.$router.push({ path: this.matchRoutePath('editor') })
      })
    },
    editorLog() {
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    exportData() {
      recordExport(this.getParams()).then((response) => {
        if (response.data.data.status) {
          this.$message({
            type: 'success',
            message: this.$t('a0d7a294.3e1ddd')
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
            message: this.$t('a0d7a294.89ae53')
          })
          return
        }
      })
    },
    async getStoreList() {
      let params = { page: 1, pageSize: 500 }
      const { list } = await this.$api.marketing.getDistributorList(params)
      if (list) {
        list.forEach((row) => {
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
      return (restaurant) => {
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
    ...mapGetters(['wheight']),
    dialogFormList() {
      return [
        {
          label: this.$t('a0d7a294.d0edc9'),
          key: 'verify_code',
          type: 'input',
          placeholder: this.$t('a0d7a294.ba231e'),
          required: true,
          message: this.$t('a0d7a294.281bad')
        }
      ]
    }
  }
}
</script>
