<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpRouterView>
    <SpPage>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model="params.title" :placeholder="$t('145d1eab.39834b')">
            <el-button slot="append" icon="el-icon-search" @click="dataSearch" />
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="params.activity_status"
            :placeholder="$t('145d1eab.1181a5')"
            clearable
            style="width: 100%"
            @change="dataSearch"
          >
            <el-option :label="$t('145d1eab.a8b0c2')" value="0" />
            <el-option :label="$t('145d1eab.dd4e55')" value="waiting" />
            <el-option :label="$t('145d1eab.fb852f')" value="ongoing" />
            <el-option :label="$t('145d1eab.047fab')" value="it_has_ended" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-date-picker
            v-model="create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            :placeholder="$t('145d1eab.5d92ab')"
            style="width: 100%"
            @change="dateChange"
          />
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="plus" @click="addActivityData">
            {{ $t('145d1eab.23b46b') }}
          </el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="activityLists" :height="wheight - 150">
        <el-table-column prop="activity_id" label="ID" width="50" />
        <el-table-column :label="$t('145d1eab.39834b')" width="150">
          <template slot-scope="scope"> {{ scope.row.title }}<br> </template>
        </el-table-column>
        <el-table-column :label="$t('145d1eab.c799f5')" width="190">
          <template slot-scope="scope">
            {{ scope.row.begin_date }} <span class="text-muted">~</span> {{ scope.row.end_date }}
            <span class="text-muted" />
          </template>
        </el-table-column>
        <el-table-column prop="activity_status" :label="$t('145d1eab.1181a5')" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.activity_status == 'waiting'">{{ $t('145d1eab.dd4e55') }}</span>
            <span v-else-if="scope.row.activity_status == 'ongoing'">{{
              $t('145d1eab.fb852f')
            }}</span>
            <span v-else-if="scope.row.activity_status == 'it_has_ended'">{{
              $t('145d1eab.047fab')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('145d1eab.2b6bc0')" width="200">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.activity_status !== 'it_has_ended'"
              type="text"
              @click="editCommunityAction(scope.$index, scope.row)"
            >
              {{ $t('145d1eab.9bd915') }}
            </el-button>
            <el-button
              v-if="scope.row.activity_status == 'ongoing'"
              type="text"
              @click="updateStatusCommunityAction(scope.row)"
            >
              {{ $t('145d1eab.6489ff') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="total_count > params.pageSize" class="content-center content-top-padded">
        <el-pagination
          layout="prev, pager, next"
          :current-page.sync="params.page"
          :total="total_count"
          :page-size="params.pageSize"
          @current-change="handleCurrentChange"
        />
      </div>
    </SpPage>
  </SpRouterView>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { getPointupvaluationList, pointupvaluationUpdateStatus } from '../../../../api/promotions'
export default {
  provide() {
    return {
      refresh: this.refresh
    }
  },
  props: ['getStatus'],
  data() {
    return {
      create_time: '',
      activeName: 'first',
      activityLists: [],
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20,
        status: '',
        activity_name: '',
        time_start_begin: '',
        time_start_end: ''
      },
      communityVisible: false,
      couponVisible: false,
      goodsVisible: false,
      goodsList: [],
      goodsCount: 0,
      goodsPageSize: 10,
      goodsPage: 1,
      nowActivity: ''
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    getStatus(val) {
      if (val) {
        this.getList(this.params)
      }
    }
  },
  mounted() {
    if (this.$route.query.status) {
      this.params.status = this.$route.query.status
    }
    this.getList(this.params)
  },
  methods: {
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getList(this.params)
    },
    addActivityData() {
      // 添加物料弹框
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    editCommunityAction(index, row) {
      // 编辑物料弹框
      this.$router.push({ path: this.matchRoutePath('editor/') + row.activity_id })
    },
    dataSearch() {
      this.params.begin_time = ''
      this.params.end_time = ''
      this.create_time = ''
      this.params.page = 1
      this.getList(this.params)
    },
    getList(params) {
      this.loading = true
      getPointupvaluationList(params).then((response) => {
        this.activityLists = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    updateStatusCommunityAction(row) {
      const msg = this.$t('145d1eab.01be42')
      this.$confirm(msg, this.$t('145d1eab.02d981'), {
        cancelButtonText: this.$t('145d1eab.625fb2'),
        confirmButtonText: this.$t('145d1eab.38cf16'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            pointupvaluationUpdateStatus({ activity_id: row.activity_id }).then((response) => {
              this.getList()
              this.$message({
                message: this.$t('145d1eab.b69694'),
                type: 'success',
                duration: 5 * 1000
              })
            })
          }
          done()
        }
      })
    },
    dateChange(val) {
      this.params.status = ''
      if (val && val.length > 0) {
        this.params.begin_time = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.end_time = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.params.begin_time = ''
        this.params.end_time = ''
      }
      this.params.page = 1
      this.getList(this.params)
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    viewCouponList(ids) {
      this.couponVisible = true
    },
    handleCancel() {
      this.communityVisible = false
      this.couponVisible = false
      this.goodsVisible = false
    },
    updateActivityData(params) {
      updateActivityItemData(params).then((res) => {})
    },
    editItemPrice(row) {
      let form = {
        id: row.id,
        item_id: row.item_id,
        activity_price: row.activity_price,
        vip_price: row.vip_price,
        svip_price: row.svip_price,
        activity_store: row.activity_store,
        points: row.points
      }
      this.updateActivityData(form)
    },
    refresh() {
      this.getList(this.params)
    }
  }
}
</script>
