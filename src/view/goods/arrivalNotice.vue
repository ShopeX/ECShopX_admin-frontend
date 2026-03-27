<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpPlatformTip v-if="!VERSION_SHUYUN()" />

    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
      <SpFilterFormItem prop="create_time" :label="$t('7e3babaa.8d3bf9')">
        <el-date-picker
          v-model="params.create_time"
          type="daterange"
          value-format="yyyy/MM/dd"
          :start-placeholder="$t('7e3babaa.b44c0f')"
          :end-placeholder="$t('7e3babaa.1d468b')"
          @change="dateChange"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="rel_id" :label="$t('7e3babaa.bcd964')">
        <el-input v-model="params.rel_id" :placeholder="$t('7e3babaa.bc49b3')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="sub_status" :label="$t('7e3babaa.6c95c6')">
        <el-select v-model="params.sub_status" clearable :placeholder="$t('7e3babaa.6784cc')">
          <el-option
            v-for="(item, index) in noticeStatusList"
            :key="index"
            :label="$t(item.name)"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
    </SpFilterForm>

    <el-table
      v-loading="loading"
      border
      :data="list"
      style="width: 100%"
      :height="wheight - 140"
      :element-loading-text="$t('7e3babaa.f09b12')"
    >
      <el-table-column prop="star" min-width="150" :label="$t('7e3babaa.1fd02a')">
        <template slot-scope="scope">
          <div class="order-time" style="padding: 8px 0 2px 0">
            <span class="content-right-margin">
              <router-link
                target="_blank"
                :to="{
                  path: '/member/member/memberlist/detail',
                  query: { user_id: scope.row.user_id }
                }"
                >{{ scope.row.username }}</router-link
              >
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="order_id" width="200" :label="$t('7e3babaa.e91545')">
        <template slot-scope="scope">
          <div class="order-time">
            {{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="order_id" width="400" :label="$t('7e3babaa.9897d8')">
        <template slot-scope="scope">
          <div class="order-time">
            {{ scope.row.item_name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="is_reply" width="160" :label="$t('7e3babaa.8023ba')">
        <template slot-scope="scope">
          <span>
            <el-tag v-if="scope.row.sub_status == 'SUCCESS'" type="success" size="mini">{{
              $t('7e3babaa.917400')
            }}</el-tag>
            <el-tag v-else type="danger" size="mini">{{ $t('7e3babaa.d70c8c') }}</el-tag>
          </span>
          <el-tag v-if="scope.row.disabled" type="danger" size="mini">
            {{ $t('7e3babaa.5cc232') }}
          </el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column width="140" label="操作">-->
      <!--<template slot-scope="scope">-->
      <!--<el-button type="text" @click="detailsDialog(scope.row)">详情</el-button>-->
      <!--<el-button type="text" v-if="scope.row.disabled=== false" @click="noticeDelete(scope.row.rate_id)">删除</el-button>-->
      <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
    <div class="mt-4 text-right">
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

    <el-dialog
      :title="$t('7e3babaa.ae1bad')"
      width="45%"
      :visible.sync="detailsDialogVisible"
      :before-close="handleClose"
    >
      <el-dialog width="45%" :visible.sync="imgVisible" append-to-body>
        <img width="100%" :src="Dialogpic">
      </el-dialog>
      <div class="section-white">
        <div class="section-header with-border">
          <h3>{{ $t('7e3babaa.2233e4') }}</h3>
        </div>
        <div class="section-body">
          <el-row>
            <el-table :data="details.itemInfo" style="width: 100%">
              <el-table-column class="goods-img" prop="pic" :label="$t('7e3babaa.9b94b1')">
                <template slot-scope="scope">
                  <img :src="scope.row.pics[0]" :alt="scope.row.item_name" width="100">
                </template>
              </el-table-column>
              <el-table-column prop="item_name" :label="$t('7e3babaa.1fd1d5')" width="180" />
              <el-table-column :label="$t('7e3babaa.b5972b')">
                <template slot-scope="scope">
                  <span>￥{{ scope.row.total_fee / 100 }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </div>
        <div class="section-header with-border">
          <h3>{{ $t('7e3babaa.9c20b6') }}</h3>
        </div>
        <div class="section-body">
          <el-row>
            <el-col :span="4" class="col-3 content-right"> {{ $t('7e3babaa.d06931') }} </el-col>
            <el-col :span="20">
              <el-rate v-model="details.rateInfo.star" disabled />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class="col-3 content-right"> {{ $t('7e3babaa.2d0f2f') }} </el-col>
            <el-col :span="20">
              {{ details.rateInfo.content }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class="col-3 content-right"> {{ $t('7e3babaa.c6321f') }} </el-col>
            <el-col v-if="details.rateInfo.rate_pic" :span="20">
              <img
                v-for="pic in details.rateInfo.rate_pic"
                :src="pic"
                width="100"
                @click="showImg(pic)"
              >
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class="col-3 content-right"> {{ $t('7e3babaa.24bc89') }} </el-col>
            <el-col :span="20">
              <router-link
                target="_blank"
                :to="{
                  path: matchInternalRoute('member_detail'),
                  query: { user_id: details.rateInfo.user_id }
                }"
              >
                {{ details.rateInfo.username }}
              </router-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class="col-3 content-right"> {{ $t('7e3babaa.4738bc') }} </el-col>
            <el-col :span="20">
              {{ details.rateInfo.created | datetime('YYYY-MM-DD HH:mm:ss') }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class="col-3 content-right"> {{ $t('7e3babaa.c3fd30') }} </el-col>
            <el-col :span="20">
              <el-tag v-if="details.rateInfo.is_reply" type="success" size="mini">
                {{ $t('7e3babaa.4bea88') }}
              </el-tag>
              <el-tag v-else type="danger" size="mini"> {{ $t('7e3babaa.6231a2') }} </el-tag>
            </el-col>
          </el-row>
        </div>
        <div class="section-header with-border">
          <h3>{{ $t('7e3babaa.e60ff5') }}</h3>
        </div>
        <div v-if="details.replyInfo" class="section-body">
          <el-row>
            <el-col :span="4" class="col-3 content-right"> {{ $t('7e3babaa.c2747a') }} </el-col>
            <el-col :span="20">
              <el-tag type="success">
                {{ details.replyInfo.content }}
              </el-tag>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class="col-3 content-right"> {{ $t('7e3babaa.fcf518') }} </el-col>
            <el-col :span="20">
              {{ details.replyInfo.operator_name }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class="col-3 content-right"> {{ $t('7e3babaa.afdc52') }} </el-col>
            <el-col :span="20">
              {{ details.replyInfo.created | datetime('YYYY-MM-DD HH:mm:ss') }}
            </el-col>
          </el-row>
        </div>
        <div class="section-header with-border">
          <h3>{{ $t('7e3babaa.561c22') }}</h3>
        </div>
        <div class="section-body">
          <el-row>
            <el-table :data="details.userReply" style="width: 100%">
              <el-table-column prop="username" :label="$t('7e3babaa.84fed1')" width="120">
                <template slot-scope="scope">
                  <router-link
                    target="_blank"
                    :to="{
                      path: matchInternalRoute('member_detail'),
                      query: { user_id: scope.row.user_id }
                    }"
                  >
                    {{ scope.row.username }}
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column prop="content" :label="$t('7e3babaa.034484')" />
              <el-table-column prop="created" :label="$t('7e3babaa.a666ad')" width="160">
                <template slot-scope="scope">
                  <span>{{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import { getSubscribeList } from '@/api/member'
import { pageMixin } from '@/mixins'
export default {
  mixins: [pageMixin],
  data() {
    return {
      loading: false,
      create_time: '',
      form: {
        rate_id: '',
        content: ''
      },
      params: {
        create_time: '',
        rel_id: '',
        sub_status: '',
        time_start_begin: '',
        time_start_end: ''
      },
      noticeStatusList: [
        { name: '7e3babaa.d70c8c', value: 'NO' },
        { name: '7e3babaa.917400', value: 'SUCCESS' }
      ],

      total_count: 0,
      list: [],
      order_id: '',
      Dialogpic: '',
      details: {
        rateInfo: [],
        itemInfo: [],
        userReply: []
      },
      imgVisible: false,
      detailsDialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    onCopy() {
      this.$notify({
        message: this.$t('7e3babaa.20a495'),
        type: 'success'
      })
    },
    noticeDelete(id) {
      const _self = this
      this.$confirm(this.$t('7e3babaa.36b97b')).then((_) => {
        deleteRate(id).then((res) => {
          if (res.data.data.status) {
            this.$message({
              message: this.$t('7e3babaa.0007d1'),
              type: 'success'
            })
            _self.fetchList()
          }
        })
      })
    },
    showImg(pic) {
      this.imgVisible = true
      this.Dialogpic = pic
    },
    handleClose() {
      this.detailsDialogVisible = false
    },
    replyDialog(row) {
      this.form.rate_id = row.rate_id
    },
    detailsDialog(row) {
      getTradeRateDetails(row.rate_id).then((res) => {
        this.details = res.data.data
        console.log(this.details)
      })
      this.detailsDialogVisible = true
    },
    onReset() {
      this.dateChange()
      this.onSearch()
    },
    dateChange(val) {
      if (val != null && val.length > 0) {
        this.params.time_start_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.time_start_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.params.time_start_begin = ''
        this.params.time_start_end = ''
      }
    },

    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.params
      }
      getSubscribeList(params).then((response) => {
        this.list = response.data.data.list
        this.total_count = Number(response.data.data.total_count)
        this.loading = false
      })
    }
  }
}
</script>
<style scoped lang="scss">
img {
  margin-right: 5px;
}
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
