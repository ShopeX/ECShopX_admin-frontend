<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app pc alipay />

    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
      <SpFilterFormItem prop="create_time" :label="$t('7de71dd3.8d3bf9')">
        <el-date-picker
          v-model="params.create_time"
          type="daterange"
          value-format="yyyy/MM/dd"
          :start-placeholder="$t('7de71dd3.b44c0f')"
          :end-placeholder="$t('7de71dd3.1d468b')"
          @change="dateChange"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="item_id" :label="$t('7de71dd3.bcd964')">
        <el-input v-model="params.item_id" :placeholder="$t('7de71dd3.bc49b3')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="order_id" :label="$t('7de71dd3.070dce')">
        <el-input v-model="params.order_id" :placeholder="$t('7de71dd3.e9e836')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="rate_status" :label="$t('7de71dd3.6c95c6')">
        <el-select v-model="params.rate_status" clearable :placeholder="$t('7de71dd3.6784cc')">
          <el-option
            v-for="(item, index) in rateStatusList"
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
      :element-loading-text="$t('7de71dd3.f09b12')"
    >
      <el-table-column prop="star" min-width="250" :label="$t('7de71dd3.606120')">
        <template slot-scope="scope">
          <el-rate v-model="scope.row.star" disabled />
          <div class="order-time" style="padding: 8px 0 2px 0">
            <span class="content-right-margin">
              <el-tooltip effect="dark" :content="$t('7de71dd3.bbe772')" placement="top-start">
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
            <el-tooltip effect="dark" :content="$t('7de71dd3.607ef9')" placement="top-start">
              <i class="el-icon-time" />
            </el-tooltip>
            {{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}
          </div>
          <div class="view-flex">
            <div class="order-time">
              <el-tooltip effect="dark" :content="$t('7de71dd3.bc0d27')" placement="top-start">
                <i class="el-icon-chat-line-square" />
              </el-tooltip>
            </div>
            <div class="view-flex-item" style="padding-left: 4px">
              {{ scope.row.content }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="order_id" width="220" :label="$t('7de71dd3.4c117f')">
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
            <el-tooltip effect="dark" :content="$t('7de71dd3.79d3ab')" placement="top-start">
              <i
                v-clipboard:copy="scope.row.order_id"
                v-clipboard:success="onCopy"
                class="el-icon-document-copy"
              />
            </el-tooltip>
          </div>
          <div class="order-time">{{ $t('7de71dd3.10fe9c') }}{{ scope.row.item_name }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="is_reply" width="160" :label="$t('7de71dd3.ccc283')">
        <template slot-scope="scope">
          <span>
            <el-tag v-if="scope.row.is_reply == '1'" type="success" size="mini">{{
              $t('7de71dd3.4bea88')
            }}</el-tag>
            <el-tag v-else type="danger" size="mini">{{ $t('7de71dd3.6231a2') }}</el-tag>
          </span>
          <el-tag v-if="scope.row.disabled == '1'" type="danger" size="mini">
            {{ $t('7de71dd3.5cc232') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="140" :label="$t('7de71dd3.2b6bc0')">
        <template slot-scope="scope">
          <el-button type="text" @click="detailsDialog(scope.row)">
            {{ $t('7de71dd3.f26225') }}
          </el-button>
          <el-button v-if="scope.row.is_reply == '0'" type="text" @click="replyDialog(scope.row)">
            {{ $t('7de71dd3.1edff0') }}
          </el-button>
          <el-button
            v-if="scope.row.disabled == '0'"
            type="text"
            @click="rateDelete(scope.row.rate_id)"
          >
            {{ $t('7de71dd3.2f4aad') }}
          </el-button>
          <!--            <el-button  type="text"  @click="rateAdd">测试</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="mt-4 text-right"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :current-page.sync="page.pageIndex"
      :page-sizes="[10, 20, 50]"
      :total="total_count"
      :page-size="page.pageSize"
      @current-change="onCurrentChange"
      @size-change="onSizeChange"
    />

    <el-dialog
      :title="$t('7de71dd3.ee0294')"
      :visible.sync="replyDialogVisible"
      width="35%"
      :before-close="handleClose"
    >
      <el-input
        v-model="form.content"
        type="textarea"
        :rows="3"
        :placeholder="$t('7de71dd3.a11cc7')"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="replyDialogVisible = false">{{ $t('7de71dd3.c08ab9') }}</el-button>
        <el-button type="primary" @click="replySubmit">{{ $t('7de71dd3.aa7527') }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="$t('7de71dd3.ae1bad')"
      width="45%"
      :visible.sync="detailsDialogVisible"
      :before-close="handleClose"
    >
      <el-dialog width="45%" :visible.sync="imgVisible" append-to-body>
        <img width="100%" :src="Dialogpic">
      </el-dialog>
      <div class="section-white">
        <div class="section-header with-border">
          <h3>{{ $t('7de71dd3.2233e4') }}</h3>
        </div>
        <div class="section-body">
          <el-row>
            <el-table :data="details.itemInfo" style="width: 100%">
              <el-table-column class="goods-img" prop="pic" :label="$t('7de71dd3.9b94b1')">
                <template slot-scope="scope">
                  <img :src="scope.row.pics[0]" :alt="scope.row.item_name" width="100">
                </template>
              </el-table-column>
              <el-table-column prop="item_name" :label="$t('7de71dd3.1fd1d5')" width="180" />
              <el-table-column :label="$t('7de71dd3.b5972b')">
                <template slot-scope="scope">
                  <span>￥{{ scope.row.total_fee / 100 }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </div>
        <div class="section-header with-border">
          <h3>{{ $t('7de71dd3.9c20b6') }}</h3>
        </div>
        <div class="section-body">
          <el-row>
            <el-col :span="4" class="col-3 content-right"> {{ $t('7de71dd3.d06931') }} </el-col>
            <el-col :span="20">
              <el-rate v-model="details.rateInfo.star" disabled />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class="col-3 content-right"> {{ $t('7de71dd3.2d0f2f') }} </el-col>
            <el-col :span="20">
              {{ details.rateInfo.content }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class="col-3 content-right"> {{ $t('7de71dd3.c6321f') }} </el-col>
            <el-col v-if="details.rateInfo.rate_pic" :span="20">
              <img
                v-for="pic in details.rateInfo.rate_pic"
                :src="pic"
                width="100px"
                @click="showImg(pic)"
              >
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class="col-3 content-right"> {{ $t('7de71dd3.24bc89') }} </el-col>
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
            <el-col :span="4" class="col-3 content-right"> {{ $t('7de71dd3.4738bc') }} </el-col>
            <el-col :span="20">
              {{ details.rateInfo.created | datetime('YYYY-MM-DD HH:mm:ss') }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class="col-3 content-right"> {{ $t('7de71dd3.c3fd30') }} </el-col>
            <el-col :span="20">
              <el-tag v-if="details.rateInfo.is_reply" type="success" size="mini">
                {{ $t('7de71dd3.4bea88') }}
              </el-tag>
              <el-tag v-else type="danger" size="mini"> {{ $t('7de71dd3.6231a2') }} </el-tag>
            </el-col>
          </el-row>
        </div>
        <div class="section-header with-border">
          <h3>{{ $t('7de71dd3.e60ff5') }}</h3>
        </div>
        <div v-if="details.replyInfo" class="section-body">
          <el-row>
            <el-col :span="4" class="col-3 content-right"> {{ $t('7de71dd3.c2747a') }} </el-col>
            <el-col :span="20">
              <el-tag type="success">
                {{ details.replyInfo.content }}
              </el-tag>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class="col-3 content-right"> {{ $t('7de71dd3.fcf518') }} </el-col>
            <el-col :span="20">
              {{ details.replyInfo.operator_name }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class="col-3 content-right"> {{ $t('7de71dd3.afdc52') }} </el-col>
            <el-col :span="20">
              {{ details.replyInfo.created | datetime('YYYY-MM-DD HH:mm:ss') }}
            </el-col>
          </el-row>
        </div>
        <div class="section-header with-border">
          <h3>{{ $t('7de71dd3.561c22') }}</h3>
        </div>
        <div class="section-body">
          <el-row>
            <el-table :data="details.userReply" style="width: 100%">
              <el-table-column prop="username" :label="$t('7de71dd3.84fed1')" width="120">
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
              <el-table-column prop="content" :label="$t('7de71dd3.034484')" />
              <el-table-column prop="created" :label="$t('7de71dd3.a666ad')" width="160">
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
import {
  getTradeRateList,
  replyTradeRate,
  getTradeRateDetails,
  deleteRate,
  rateAdd
} from '@/api/trade'
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
        order_type: 'normal',
        create_time: '',
        item_id: '',
        order_id: '',
        rate_status: ''
      },
      rateStatusList: [
        { name: '7de71dd3.6231a2', value: '0' },
        { name: '7de71dd3.4bea88', value: '1' }
      ],
      total_count: 0,
      list: [],
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
    this.fetchList()
  },
  methods: {
    onCopy() {
      this.$notify({
        message: this.$t('7de71dd3.20a495'),
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
      this.$confirm(this.$t('7de71dd3.ad22c3')).then((_) => {
        deleteRate(id).then((res) => {
          if (res.data.data.status) {
            this.$message({
              message: this.$t('7de71dd3.0007d1'),
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
          message: this.$t('7de71dd3.ac9f45')
        })
        this.replyDialogVisible = false
        this.fetchList()
      })
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
      console.log(val)
      if (!val) {
        this.params.time_start_begin = ''
        this.params.time_start_end = ''
        return
      }
      if (val.length > 0) {
        this.params.time_start_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.time_start_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.params.time_start_begin = ''
        this.params.time_start_end = ''
      }
    },

    // getParams() {
    //   this.params.time_start_begin = this.time_start_begin
    //   this.params.time_start_end = this.time_start_end
    //   this.params.item_id = this.item_id
    //   this.params.order_id = this.order_id
    // },
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
      getTradeRateList(params).then((response) => {
        this.list = response.data.data.list
        this.list.forEach((item) => {
          item.star = Number(item.star)
        })
        this.total_count = Number(response.data.data.total_count)
        this.loading = false
      })
    }
  }
}
</script>
<style scoped lang="scss" type="text/css">
img {
  margin-right: 5px;
}
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
