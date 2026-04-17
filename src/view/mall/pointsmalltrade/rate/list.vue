<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-row class="filter-header" :gutter="20">
        <el-col>
          <el-date-picker
            v-model="create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            :placeholder="$t('20af59f4.4b8cb9')"
            @change="dateChange"
          />
          <el-input
            v-model="item_id"
            class="input-m"
            type="number"
            :placeholder="$t('20af59f4.858526')"
            mini="1"
          >
            <el-button slot="append" icon="el-icon-search" @click="search" />
          </el-input>
          <el-input v-model="order_id" class="input-m" :placeholder="$t('20af59f4.1e8dc2')">
            <el-button slot="append" icon="el-icon-search" @click="search" />
          </el-input>
          <el-select
            v-model="rate_status"
            :placeholder="$t('20af59f4.a6656e')"
            @change="rateStatusSelectHandle"
          >
            <el-option
              v-for="(item, index) in rateStatusList"
              :key="index"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-card>
        <el-table
          v-loading="loading"
          :data="list"
          style="width: 100%"
          :height="wheight - 140"
          :element-loading-text="$t('20af59f4.f09b12')"
        >
          <el-table-column prop="star" min-width="250" :label="$t('20af59f4.606120')">
            <template slot-scope="scope">
              <el-rate v-model="scope.row.star" disabled />
              <div class="order-time" style="padding: 8px 0 2px 0">
                <span class="content-right-margin">
                  <el-tooltip effect="dark" :content="$t('20af59f4.bbe772')" placement="top-start">
                    <i class="el-icon-user" />
                  </el-tooltip>
                  <router-link
                    target="_blank"
                    :to="{
                      path: matchInternalRoute('member_detail'),
                      query: { user_id: scope.row.user_id }
                    }"
                    >{{ scope.row.username }}</router-link
                  >
                </span>
                <el-tooltip effect="dark" :content="$t('20af59f4.607ef9')" placement="top-start">
                  <i class="el-icon-time" />
                </el-tooltip>
                {{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}
              </div>
              <div class="view-flex">
                <div class="order-time">
                  <el-tooltip effect="dark" :content="$t('20af59f4.bc0d27')" placement="top-start">
                    <i class="el-icon-chat-line-square" />
                  </el-tooltip>
                </div>
                <div class="view-flex-item" style="padding-left: 4px">
                  {{ scope.row.content }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="order_id" width="220" :label="$t('20af59f4.4c117f')">
            <template slot-scope="scope">
              <div class="order-num">
                <router-link
                  target="_blank"
                  :to="{
                    path: '/order/order-manage/order-list/detail',
                    query: { orderId: scope.row.order_id }
                  }"
                >
                  {{ scope.row.order_id }}
                </router-link>
                <el-tooltip effect="dark" :content="$t('20af59f4.79d3ab')" placement="top-start">
                  <i
                    v-clipboard:copy="scope.row.order_id"
                    v-clipboard:success="onCopy"
                    class="el-icon-document-copy"
                  />
                </el-tooltip>
              </div>
              <div class="order-time">{{ $t('d41d8cd9.g7h8i9') }}{{ scope.row.item_name }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="is_reply" width="160" :label="$t('20af59f4.ccc283')">
            <template slot-scope="scope">
              <!-- 订单状态 -->
              <span>
                <el-tag v-if="scope.row.is_reply == 1" type="success" size="mini">{{
                  $t('d41d8cd9.j0k1l2')
                }}</el-tag>
                <el-tag v-else type="danger" size="mini">{{ $t('d41d8cd9.m3n4o5') }}</el-tag>
              </span>
              <el-tag v-if="scope.row.disabled == 1" type="danger" size="mini">
                {{ $t('d41d8cd9.p6q7r8') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column width="140" :label="$t('20af59f4.2b6bc0')">
            <template slot-scope="scope">
              <el-button type="text" @click="detailsDialog(scope.row)">
                {{ $t('d41d8cd9.l9m0n1') }}
              </el-button>
              <el-button v-if="scope.row.is_reply == 0" type="text" @click="replyDialog(scope.row)">
                {{ $t('d41d8cd9.s9t0u1') }}
              </el-button>
              <el-button
                v-if="scope.row.disabled == 0"
                type="text"
                @click="rateDelete(scope.row.rate_id)"
              >
                {{ $t('d41d8cd9.g9h0i1') }}
              </el-button>
              <!--            <el-button  type="text"  @click="rateAdd">测试</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <div class="mt-4 text-right">
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
      <el-dialog
        :title="$t('20af59f4.ee0294')"
        :visible.sync="replyDialogVisible"
        width="35%"
        :before-close="handleClose"
      >
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="3"
          :placeholder="$t('20af59f4.a11cc7')"
        />
        <span slot="footer" class="dialog-footer">
          <el-button @click="replyDialogVisible = false">{{ $t('d41d8cd9.a1b2c3') }}</el-button>
          <el-button type="primary" @click="replySubmit">{{ $t('d41d8cd9.d4e5f6') }}</el-button>
        </span>
      </el-dialog>

      <el-dialog
        :title="$t('20af59f4.ae1bad')"
        width="45%"
        :visible.sync="detailsDialogVisible"
        :before-close="handleClose"
      >
        <el-dialog width="45%" :visible.sync="imgVisible" append-to-body>
          <img width="100%" :src="Dialogpic" />
        </el-dialog>
        <div class="section-white">
          <div class="section-header with-border">
            <h3>{{ $t('d41d8cd9.v2w3x4') }}</h3>
          </div>
          <div class="section-body">
            <el-row>
              <el-table :data="details.itemInfo" style="width: 100%">
                <el-table-column class="goods-img" prop="pic" :label="$t('20af59f4.9b94b1')">
                  <template slot-scope="scope">
                    <img :src="scope.row.pics[0]" :alt="scope.row.item_name" width="100" />
                  </template>
                </el-table-column>
                <el-table-column prop="item_name" :label="$t('20af59f4.1fd1d5')" width="180" />
                <el-table-column :label="$t('20af59f4.eefb46')">
                  <template slot-scope="scope">
                    <span>{{ scope.row.total_point }}{{ $t('d41d8cd9.y5z6a7') }}</span
                    ><span v-if="scope.row.total_fee > 0">
                      + ￥{{ scope.row.total_fee / 100 }}</span
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </div>
          <div class="section-header with-border">
            <h3>{{ $t('d41d8cd9.b8c9d0') }}</h3>
          </div>
          <div class="section-body">
            <el-row>
              <el-col :span="4" class="col-3 content-right"> {{ $t('d41d8cd9.e1f2g3') }} </el-col>
              <el-col :span="20">
                <el-rate v-model="details.rateInfo.star" disabled />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="col-3 content-right"> {{ $t('d41d8cd9.h4i5j6') }} </el-col>
              <el-col :span="20">
                {{ details.rateInfo.content }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="col-3 content-right"> {{ $t('d41d8cd9.k7l8m9') }} </el-col>
              <el-col v-if="details.rateInfo.rate_pic" :span="20">
                <img
                  v-for="(pic, index) in details.rateInfo.rate_pic"
                  :key="index"
                  :src="pic"
                  width="100"
                  @click="showImg(pic)"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="col-3 content-right"> {{ $t('d41d8cd9.n0o1p2') }} </el-col>
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
              <el-col :span="4" class="col-3 content-right"> {{ $t('d41d8cd9.q3r4s5') }} </el-col>
              <el-col :span="20">
                {{ details.rateInfo.created | datetime('YYYY-MM-DD HH:mm:ss') }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="col-3 content-right"> {{ $t('d41d8cd9.t6u7v8') }} </el-col>
              <el-col :span="20">
                <el-tag v-if="details.rateInfo.is_reply" type="success" size="mini">
                  {{ $t('d41d8cd9.j0k1l2') }}
                </el-tag>
                <el-tag v-else type="danger" size="mini"> {{ $t('d41d8cd9.m3n4o5') }} </el-tag>
              </el-col>
            </el-row>
          </div>
          <div class="section-header with-border">
            <h3>{{ $t('d41d8cd9.w9x0y1') }}</h3>
          </div>
          <div v-if="details.replyInfo" class="section-body">
            <el-row>
              <el-col :span="4" class="col-3 content-right"> {{ $t('d41d8cd9.z2a3b4') }} </el-col>
              <el-col :span="20">
                <el-tag type="success">
                  {{ details.replyInfo.content }}
                </el-tag>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="col-3 content-right"> {{ $t('d41d8cd9.c5d6e7') }} </el-col>
              <el-col :span="20">
                {{ details.replyInfo.operator_name }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="col-3 content-right"> {{ $t('d41d8cd9.f8g9h0') }} </el-col>
              <el-col :span="20">
                {{ details.replyInfo.created | datetime('YYYY-MM-DD HH:mm:ss') }}
              </el-col>
            </el-row>
          </div>
          <div class="section-header with-border">
            <h3>{{ $t('d41d8cd9.i1j2k3') }}</h3>
          </div>
          <div class="section-body">
            <el-row>
              <el-table :data="details.userReply" style="width: 100%">
                <el-table-column prop="username" :label="$t('20af59f4.84fed1')" width="120">
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
                <el-table-column prop="content" :label="$t('20af59f4.034484')" />
                <el-table-column prop="created" :label="$t('20af59f4.a666ad')" width="160">
                  <template slot-scope="scope">
                    <span>{{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </div>
        </div>
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>
<style scoped lang="scss" type="text/css">
img {
  margin-right: 5px;
}
</style>
<script>
import { mapGetters } from 'vuex'
import {
  getTradeRateList,
  replyTradeRate,
  getTradeRateDetails,
  deleteRate,
  rateAdd
} from '../../../../api/trade'
export default {
  data() {
    return {
      loading: false,
      create_time: '',
      form: {
        rate_id: '',
        content: ''
      },
      params: {
        page: 1,
        pageSize: 20,
        order_type: 'pointsmall'
      },
      rateStatusList: [
        {
          name: this.$t('20af59f4.6231a2'),
          value: '0'
        },
        {
          name: this.$t('20af59f4.4bea88'),
          value: '1'
        }
      ],
      rate_status: '',
      item_id: '',
      time_start_begin: '',
      time_start_end: '',
      total_count: 0,
      list: [],
      order_id: '',
      Dialogpic: '',
      details: {
        rateInfo: [],
        itemInfo: [],
        userReply: []
      },
      replyDialogVisible: false,
      imgVisible: false,
      detailsDialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.getTradeRateList(this.params)
  },
  methods: {
    onCopy() {
      this.$notify({
        message: this.$t('20af59f4.20a495'),
        type: 'success'
      })
    },
    // rateAdd () {
    //   let addData = {
    //     order_id: 'CN3000062746732000099132',
    //     anonymous: 1,
    //     rates: [
    //       {item_id: 1248, star: 0, content: '1254评价内容', pics: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg']},
    //       {item_id: 1256, star: 4, content: '1256评价内容', pics: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg']}
    //     ]
    //   }
    //
    //   let replyData = {
    //     rate_id: 28,
    //     content: '这是我的回复内容'
    //   }
    //
    //   let list = {
    //     page: 1,
    //     pageSize: 20,
    //     item_id: 1248
    //   }
    //   console.log(list)
    //
    //   rateAdd(list).then(res => {
    //     console.log(res)
    //   })
    // },
    rateDelete(id) {
      const _self = this
      this.$confirm(this.$t('20af59f4.ad22c3')).then((_) => {
        deleteRate(id).then((res) => {
          if (res.data.data.status) {
            this.$message({
              message: this.$t('20af59f4.0007d1'),
              type: 'success'
            })
            _self.getTradeRateList(this.params)
          }
        })
      })
    },
    showImg(pic) {
      this.imgVisible = true
      this.Dialogpic = pic
    },
    handleClose() {
      this.replyDialogVisible = false
      this.detailsDialogVisible = false
    },
    replyDialog(row) {
      this.form.rate_id = row.rate_id
      this.replyDialogVisible = true
    },
    replySubmit() {
      replyTradeRate(this.form).then((res) => {
        this.$message({
          type: 'success',
          message: this.$t('20af59f4.ac9f45')
        })
        this.replyDialogVisible = false
        this.getTradeRateList(this.params)
      })
    },
    detailsDialog(row) {
      getTradeRateDetails(row.rate_id).then((res) => {
        this.details = res.data.data
        console.log(this.details)
      })
      this.detailsDialogVisible = true
    },
    rateStatusSelectHandle() {
      this.params.rate_status = this.rate_status
      this.params.page = 1
      this.getParams()
      this.getTradeRateList(this.params)
    },
    search(e) {
      this.params.page = 1
      this.getParams()
      this.getTradeRateList(this.params)
    },
    dateChange(val) {
      if (val.length > 0) {
        this.time_start_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.time_start_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.time_start_begin = ''
        this.time_start_end = ''
      }
      this.params.page = 1
      this.getParams()
      this.getTradeRateList(this.params)
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.loading = false
      this.getParams()
      this.getTradeRateList(this.params)
    },
    handleSizeChange(pageSize) {
      this.loading = false
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getParams()
      this.getTradeRateList(this.params)
    },
    getParams() {
      this.params.time_start_begin = this.time_start_begin
      this.params.time_start_end = this.time_start_end
      this.params.item_id = this.item_id
      this.params.order_id = this.order_id
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    getTradeRateList(filter) {
      this.loading = true
      getTradeRateList(filter).then((response) => {
        this.list = response.data.data.list
        this.total_count = Number(response.data.data.total_count)
        this.loading = false
      })
    }
  }
}
</script>
