<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <SpFilterForm
        :model="params"
        @onSearch="onSearch"
        @onReset="onReset"
      >
        <SpFilterFormItem
          prop="create_time"
          label="日期范围:"
        >
          <el-date-picker
            v-model="params.create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dateChange"
          />
        </SpFilterFormItem>
        <SpFilterFormItem
          prop="rel_id"
          label="商品ID:"
        >
          <el-input
            v-model="params.rel_id"
            placeholder="请输入商品ID"
          />
        </SpFilterFormItem>
        <SpFilterFormItem
          prop="sub_status"
          label="是否评价:"
        >
          <el-select
            v-model="params.sub_status"
            clearable
            placeholder="请选择是否评价"
          >
            <el-option
              v-for="(item, index) in noticeStatusList"
              :key="index"
              :label="item.name"
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
        element-loading-text="数据加载中"
      >
        <el-table-column
          prop="star"
          min-width="150"
          label="用户"
        >
          <template slot-scope="scope">
            <div
              class="order-time"
              style="padding: 8px 0 2px 0"
            >
              <span class="content-right-margin">
                <router-link
                  target="_blank"
                  :to="{
                    path: '/member/member/detail',
                    query: { user_id: scope.row.user_id }
                  }"
                >{{ scope.row.username }}</router-link>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="order_id"
          width="200"
          label="订阅时间"
        >
          <template slot-scope="scope">
            <div class="order-time">
              {{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="order_id"
          width="400"
          label="商品"
        >
          <template slot-scope="scope">
            <div class="order-time">
              {{ scope.row.item_name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_reply"
          width="160"
          label="通知状态"
        >
          <template slot-scope="scope">
            <!-- 订单状态 -->
            <span>
              <el-tag
                v-if="scope.row.sub_status == 'SUCCESS'"
                type="success"
                size="mini"
              >已通知</el-tag>
              <el-tag
                v-else
                type="danger"
                size="mini"
              >未通知</el-tag>
            </span>
            <el-tag
              v-if="scope.row.disabled"
              type="danger"
              size="mini"
            >
              已删除
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
      <el-pagination
        class="content-padded content-center"
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
        title="评价详情"
        width="45%"
        :visible.sync="detailsDialogVisible"
        :before-close="handleClose"
      >
        <el-dialog
          width="45%"
          :visible.sync="imgVisible"
          append-to-body
        >
          <img
            width="100%"
            :src="Dialogpic"
          >
        </el-dialog>
        <div class="section-white">
          <div class="section-header with-border">
            <h3>评价商品信息</h3>
          </div>
          <div class="section-body">
            <el-row>
              <el-table
                :data="details.itemInfo"
                style="width: 100%"
              >
                <el-table-column
                  class="goods-img"
                  prop="pic"
                  label="商品图片"
                >
                  <template slot-scope="scope">
                    <img
                      :src="scope.row.pics[0]"
                      :alt="scope.row.item_name"
                      width="100"
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  prop="item_name"
                  label="商品名称"
                  width="180"
                />
                <el-table-column label="成交价格(元)">
                  <template
                    slot-scope="scope"
                  >
                    <span>￥{{ scope.row.total_fee / 100 }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </div>
          <div class="section-header with-border">
            <h3>评价信息</h3>
          </div>
          <div class="section-body">
            <el-row>
              <el-col
                :span="4"
                class="col-3 content-right"
              >
                评价星级：
              </el-col>
              <el-col :span="20">
                <el-rate
                  v-model="details.rateInfo.star"
                  disabled
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col
                :span="4"
                class="col-3 content-right"
              >
                评价内容：
              </el-col>
              <el-col :span="20">
                {{ details.rateInfo.content }}
              </el-col>
            </el-row>
            <el-row>
              <el-col
                :span="4"
                class="col-3 content-right"
              >
                评价图：
              </el-col>
              <el-col
                v-if="details.rateInfo.rate_pic"
                :span="20"
              >
                <img
                  v-for="pic in details.rateInfo.rate_pic"
                  :src="pic"
                  width="100"
                  @click="showImg(pic)"
                >
              </el-col>
            </el-row>
            <el-row>
              <el-col
                :span="4"
                class="col-3 content-right"
              >
                评价人：
              </el-col>
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
              <el-col
                :span="4"
                class="col-3 content-right"
              >
                评价时间：
              </el-col>
              <el-col :span="20">
                {{
                  details.rateInfo.created | datetime('YYYY-MM-DD HH:mm:ss')
                }}
              </el-col>
            </el-row>
            <el-row>
              <el-col
                :span="4"
                class="col-3 content-right"
              >
                是否回复：
              </el-col>
              <el-col :span="20">
                <el-tag
                  v-if="details.rateInfo.is_reply"
                  type="success"
                  size="mini"
                >
                  已回复
                </el-tag>
                <el-tag
                  v-else
                  type="danger"
                  size="mini"
                >
                  未回复
                </el-tag>
              </el-col>
            </el-row>
          </div>
          <div class="section-header with-border">
            <h3>管理员回复信息</h3>
          </div>
          <div
            v-if="details.replyInfo"
            class="section-body"
          >
            <el-row>
              <el-col
                :span="4"
                class="col-3 content-right"
              >
                回复内容：
              </el-col>
              <el-col :span="20">
                <el-tag type="success">
                  {{ details.replyInfo.content }}
                </el-tag>
              </el-col>
            </el-row>
            <el-row>
              <el-col
                :span="4"
                class="col-3 content-right"
              >
                回复人：
              </el-col>
              <el-col :span="20">
                {{ details.replyInfo.operator_name }}
              </el-col>
            </el-row>
            <el-row>
              <el-col
                :span="4"
                class="col-3 content-right"
              >
                回复时间：
              </el-col>
              <el-col :span="20">
                {{
                  details.replyInfo.created | datetime('YYYY-MM-DD HH:mm:ss')
                }}
              </el-col>
            </el-row>
          </div>
          <div class="section-header with-border">
            <h3>买家评论</h3>
          </div>
          <div class="section-body">
            <el-row>
              <el-table
                :data="details.userReply"
                style="width: 100%"
              >
                <el-table-column
                  prop="username"
                  label="评论人"
                  width="120"
                >
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
                <el-table-column
                  prop="content"
                  label="评论内容"
                />
                <el-table-column
                  prop="created"
                  label="评论时间"
                  width="160"
                >
                  <template
                    slot-scope="scope"
                  >
                    <span>{{
                      scope.row.created | datetime('YYYY-MM-DD HH:mm:ss')
                    }}</span>
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
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
<script>
import { mapGetters } from 'vuex'
import { getSubscribeList } from '../../../../api/member'
import { pageMixin } from '@/mixins'
export default {
  mixins: [pageMixin],
  data () {
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
        {
          name: '未通知',
          value: 'NO'
        },
        {
          name: '已通知',
          value: 'SUCCESS'
        }
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
  mounted () {
    this.fetchList()
  },
  methods: {
    onCopy () {
      this.$notify({
        message: '复制成功',
        type: 'success'
      })
    },
    noticeDelete (id) {
      const _self = this
      this.$confirm('确认删除当前通知吗？').then((_) => {
        deleteRate(id).then((res) => {
          if (res.data.data.status) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            _self.fetchList()
          }
        })
      })
    },
    showImg (pic) {
      this.imgVisible = true
      this.Dialogpic = pic
    },
    handleClose () {
      this.detailsDialogVisible = false
    },
    replyDialog (row) {
      this.form.rate_id = row.rate_id
    },
    detailsDialog (row) {
      getTradeRateDetails(row.rate_id).then((res) => {
        this.details = res.data.data
        console.log(this.details)
      })
      this.detailsDialogVisible = true
    },
    onReset () {
      this.dateChange()
      this.onSearch()
    },
    dateChange (val) {
      if (val != null && val.length > 0) {
        this.params.time_start_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.time_start_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.params.time_start_begin = ''
        this.params.time_start_end = ''
      }
    },

    dateStrToTimeStamp (str) {
      return Date.parse(new Date(str)) / 1000
    },
    fetchList () {
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
