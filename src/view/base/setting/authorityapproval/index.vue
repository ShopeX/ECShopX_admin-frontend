<template>
  <div class="authory-box">
    <div v-if="$route.path.indexOf('approve') === -1">
      <SpFilterForm
        :model="params"
        @onSearch="onSearch"
        @onReset="onReset"
      >
        <SpFilterFormItem
          prop="status"
          label="审批状态:"
        >
          <el-select
            v-model="params.status"
            placeholder="请选择审批状态"
          >
            <el-option
              v-for="(item, index) in approveStatusList"
              :key="index"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem
          prop="login_name"
          label="账户名称:"
        >
          <el-input
            v-model="params.login_name"
            placeholder="请输入账户名称"
          />
        </SpFilterFormItem>
        <SpFilterFormItem
          prop="create_time"
          label="申请日期:"
        >
          <el-date-picker
            v-model="params.create_time"
            style="width: 270px"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dateChange"
          />
        </SpFilterFormItem>
      </SpFilterForm>

      <el-card>
        <div
          v-for="item in list"
          :key="item.pass_id"
          class="cus-list"
        >
          <el-row class="cus-row">
            <el-col :span="3">
              <img
                class="cus-row-img"
                src="@/assets/img/adapay/authory_avater.png"
                alt=""
              >
            </el-col>
            <el-col :span="13">
              <div class="row-title">
                <router-link
                  :to="{
                    path: matchHidePage('approve'),
                    query: { pass_id: item.pass_id, operator_id: item.operator_id }
                  }"
                >
                  <span class="cus-row-name">{{ item.login_name || '---' }}</span>
                </router-link>
                <el-tag
                  :type="item.operator_type === 'staff' ? 'success' : 'warning'"
                  size="medium"
                  style="margin-left: 25px"
                >
                  {{ item.operator_type === 'staff' ? '平台管理员' : '店铺管理员' }}
                </el-tag>
              </div>
              <div class="cus-row-time">
                <span>申请时间：{{ item.create_time ? createTimeFilter(item.create_time) : '-' }}</span>
              </div>
            </el-col>
            <el-col :span="5">
              <img
                v-if="item.status == '1'"
                src="@/assets/img/adapay/pass.png"
                alt=""
                style="width: 80px; height: 64px"
              >
              <img
                v-if="item.status == '2'"
                src="@/assets/img/adapay/reject.png"
                alt=""
                style="width: 70px; height: 69px"
              >
            </el-col>
            <el-col
              class="cus-row-btn"
              :span="3"
            >
              <router-link
                v-if="item.status === '0'"
                :to="{
                  path: matchHidePage('approve'),
                  query: { pass_id: item.pass_id, operator_id: item.operator_id }
                }"
              >
                <el-button
                  size="medium"
                  type="primary"
                >
                  审批
                </el-button>
              </router-link>
              <el-button
                v-else
                size="medium"
                type="info"
                plain
                disabled
              >
                已审批
              </el-button>
            </el-col>
          </el-row>
        </div>
        <div class="content-padded content-center">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :current-page.sync="page.pageIndex"
            :page-sizes="[10, 20, 50]"
            :total="total_count"
            :page-size="page.pageSize"
            @current-change="onCurrentChange"
            @size-change="onSizeChange"
          />
        </div>
      </el-card>
    </div>
    <router-view />
  </div>
</template>
<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import { encryptList } from '@/api/encrypt'
import { pageMixin } from '@/mixins'
import {
  getAftersalesList,
  exportList,
  getAftersalesRemind,
  setAftersalesRemind
} from '@/api/aftersales'
export default {
  mixins: [pageMixin],
  data () {
    return {
      loading: true,

      params: {
        login_name: undefined,
        status: undefined,
        start_time: undefined,
        end_time: undefined,
        create_time: ''
      },
      approveStatusList: [
        { name: '全部', value: undefined },
        { name: '待审批', value: '0' },
        { name: '已通过', value: '1' },
        { name: '未通过', value: '2' }
      ],
      total_count: 0,
      list: []
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted () {
    this.fetchList()
  },
  methods: {
    dateStrToTimeStamp (str) {
      return Date.parse(new Date(str)) / 1000
    },
    dateChange (val) {
      if (val) {
        this.params.start_time = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.end_time = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.params.start_time = ''
        this.params.end_time = ''
      }
      this.page.pageIndex = 1
    },
    onReset () {
      this.params.start_time = ''
      this.params.end_time = ''
      this.onSearch()
    },

    fetchList () {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.params
      }
      encryptList(params).then((response) => {
        this.list = response.data.data.list
        this.total_count = Number(response.data.data.count)
        this.loading = false
      })
    },

    // resetForm(formName) {
    //   this.create_time = ''
    //   this.params = {
    //     page: 1,
    //     pageSize: 10,
    //     login_name: undefined,
    //     status: undefined,
    //     start_time: undefined,
    //     end_time: undefined
    //   }
    //   this.getAftersalesList()
    // },
    createTimeFilter (time) {
      return moment(time * 1000).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>
<style lang="scss">
.authory-box {
  .cus-list {
    .row-title {
      display: flex;
      align-items: center;
    }
    .cus-row {
      border: 1px solid #ccc;
      padding: 5px 10px;
      color: #222;
      margin-bottom: 15px !important;
      display: flex;
      align-items: center;
      justify-content: center;
      &-img {
        width: 70px;
        height: 70px;
      }
      &-name {
        font-size: 22px;
        font-weight: bold;
      }
      &-time {
        margin-top: 15px;
        :nth-child(2) {
          margin-left: 60px;
        }
      }
      &-btn {
        // height: 90px;
        // line-height: 90px;
      }
    }
  }
  .cus-card {
    .el-row {
      margin-bottom: 0 !important;
    }
    .el-card__body {
      padding-bottom: 0px;
    }
  }
  .sp-filter-form {
    margin-bottom: 16px;
  }
}
</style>
