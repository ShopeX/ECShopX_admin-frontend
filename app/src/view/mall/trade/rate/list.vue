<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-row class="filter-header" :gutter="20">
        <el-col>
          <el-date-picker
            v-model="create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            placeholder="选择日期范围"
            @change="dateChange"
          ></el-date-picker>
          <el-input class="input-m" type="number" placeholder="商品ID" v-model="item_id" mini="1">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
          <el-input class="input-m" placeholder="订单号" v-model="order_id">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
          <el-select
            clearable
            v-model="rate_status"
            @change="rateStatusSelectHandle"
            placeholder="是否评价"
          >
            <el-option
              v-for="(item, index) in rateStatusList"
              :key="index"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-card>
        <el-table
          :data="list"
          style="width: 100%"
          :height="wheight - 140"
          v-loading="loading"
          element-loading-text="数据加载中"
        >
          <el-table-column prop="star" min-width="250" label="评价">
            <template slot-scope="scope">
              <el-rate disabled v-model="scope.row.star"></el-rate>
              <div class="order-time" style="padding: 8px 0 2px 0">
                <span class="content-right-margin">
                  <el-tooltip effect="dark" content="评价人" placement="top-start">
                    <i class="el-icon-user"></i>
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
                <el-tooltip effect="dark" content="评价时间" placement="top-start">
                  <i class="el-icon-time"></i>
                </el-tooltip>
                {{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}
              </div>
              <div class="view-flex">
                <div class="order-time">
                  <el-tooltip effect="dark" content="评价内容" placement="top-start">
                    <i class="el-icon-chat-line-square"></i>
                  </el-tooltip>
                </div>
                <div class="view-flex-item" style="padding-left: 4px">
                  {{ scope.row.content }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="order_id" width="220" label="订单">
            <template slot-scope="scope">
              <div class="order-num">
                <router-link
                  target="_blank"
                  :to="{
                    path: '/order/entitytrade/tradenormalorders/detail',
                    query: { orderId: scope.row.order_id }
                  }"
                  >{{ scope.row.order_id }}</router-link
                >
                <el-tooltip effect="dark" content="复制" placement="top-start">
                  <i
                    v-clipboard:copy="scope.row.order_id"
                    v-clipboard:success="onCopy"
                    class="el-icon-document-copy"
                  ></i>
                </el-tooltip>
              </div>
              <div class="order-time">商品：{{ scope.row.item_name }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="is_reply" width="160" label="评价状态">
            <template slot-scope="scope">
              <!-- 订单状态 -->
              <span>
                <el-tag v-if="scope.row.is_reply == '1'" type="success" size="mini">已回复</el-tag>
                <el-tag v-else type="danger" size="mini">未回复</el-tag>
              </span>
              <el-tag type="danger" v-if="scope.row.disabled=='1'" size="mini">已删除</el-tag>
            </template>
          </el-table-column>
          <el-table-column width="140" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="detailsDialog(scope.row)">详情</el-button>
              <el-button
                type="text"
                v-if="scope.row.is_reply === '0'"
                @click="replyDialog(scope.row)"
                >回复</el-button
              >
              <el-button
                type="text"
                v-if="scope.row.disabled === '0'"
                @click="rateDelete(scope.row.rate_id)"
                >删除</el-button
              >
              <!--            <el-button  type="text"  @click="rateAdd">测试</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="content-padded content-center"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page.sync="params.page"
          :page-sizes="[10, 20, 50]"
          :total="total_count"
          :page-size="params.pageSize"
        >
        </el-pagination>
      </el-card>
      <el-dialog
        title="评价回复"
        :visible.sync="replyDialogVisible"
        width="35%"
        :before-close="handleClose"
      >
        <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="form.content">
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="replyDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="replySubmit">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="评价详情"
        width="45%"
        :visible.sync="detailsDialogVisible"
        :before-close="handleClose"
      >
        <el-dialog width="45%" :visible.sync="imgVisible" append-to-body>
          <img width="100%" :src="Dialogpic" />
        </el-dialog>
        <div class="section-white">
          <div class="section-header with-border">
            <h3>评价商品信息</h3>
          </div>
          <div class="section-body">
            <el-row>
              <el-table :data="details.itemInfo" style="width: 100%">
                <el-table-column class="goods-img" prop="pic" label="商品图片">
                  <template slot-scope="scope">
                    <img :src="scope.row.pics[0]" :alt="scope.row.item_name" width="100" />
                  </template>
                </el-table-column>
                <el-table-column prop="item_name" label="商品名称" width="180"> </el-table-column>
                <el-table-column label="成交价格(元)">
                  <template slot-scope="scope"
                    ><span>￥{{ scope.row.total_fee / 100 }}</span></template
                  >
                </el-table-column>
              </el-table>
            </el-row>
          </div>
          <div class="section-header with-border">
            <h3>评价信息</h3>
          </div>
          <div class="section-body">
            <el-row>
              <el-col :span="4" class="col-3 content-right">评价星级：</el-col>
              <el-col :span="20">
                <el-rate disabled v-model="details.rateInfo.star"></el-rate>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="col-3 content-right">评价内容：</el-col>
              <el-col :span="20">{{ details.rateInfo.content }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="col-3 content-right">评价图：</el-col>
              <el-col :span="20" v-if="details.rateInfo.rate_pic">
                <img
                  v-for="pic in details.rateInfo.rate_pic"
                  :src="pic"
                  width="100px"
                  @click="showImg(pic)"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="col-3 content-right">评价人：</el-col>
              <el-col :span="20">
                <router-link
                  target="_blank"
                  :to="{
                    path: matchInternalRoute('member_detail'),
                    query: { user_id: details.rateInfo.user_id }
                  }"
                  >{{ details.rateInfo.username }}</router-link
                >
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="col-3 content-right">评价时间：</el-col>
              <el-col :span="20">{{
                details.rateInfo.created | datetime('YYYY-MM-DD HH:mm:ss')
              }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="col-3 content-right">是否回复：</el-col>
              <el-col :span="20">
                <el-tag v-if="details.rateInfo.is_reply" type="success" size="mini">已回复</el-tag>
                <el-tag v-else type="danger" size="mini">未回复</el-tag>
              </el-col>
            </el-row>
          </div>
          <div class="section-header with-border">
            <h3>管理员回复信息</h3>
          </div>
          <div class="section-body" v-if="details.replyInfo">
            <el-row>
              <el-col :span="4" class="col-3 content-right">回复内容：</el-col>
              <el-col :span="20">
                <el-tag type="success">
                  {{ details.replyInfo.content }}
                </el-tag>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="col-3 content-right">回复人：</el-col>
              <el-col :span="20">{{ details.replyInfo.operator_name }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="col-3 content-right">回复时间：</el-col>
              <el-col :span="20">{{
                details.replyInfo.created | datetime('YYYY-MM-DD HH:mm:ss')
              }}</el-col>
            </el-row>
          </div>
          <div class="section-header with-border">
            <h3>买家评论</h3>
          </div>
          <div class="section-body">
            <el-row>
              <el-table :data="details.userReply" style="width: 100%">
                <el-table-column prop="username" label="评论人" width="120">
                  <template slot-scope="scope">
                    <router-link
                      target="_blank"
                      :to="{
                        path: matchInternalRoute('member_detail'),
                        query: { user_id: scope.row.user_id }
                      }"
                      >{{ scope.row.username }}</router-link
                    >
                  </template>
                </el-table-column>
                <el-table-column prop="content" label="评论内容"> </el-table-column>
                <el-table-column prop="created" label="评论时间" width="160">
                  <template slot-scope="scope"
                    ><span>{{
                      scope.row.created | datetime('YYYY-MM-DD HH:mm:ss')
                    }}</span></template
                  >
                </el-table-column>
              </el-table>
            </el-row>
          </div>
        </div>
      </el-dialog>
    </div>
    <router-view></router-view>
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
        order_type: 'normal'
      },
      rateStatusList: [
        {
          name: '未回复',
          value: '0'
        },
        {
          name: '已回复',
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
  methods: {
    onCopy() {
      this.$notify({
        message: '复制成功',
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
      this.$confirm('确认删除当前评价吗？').then((_) => {
        deleteRate(id).then((res) => {
          if (res.data.data.status) {
            this.$message({
              message: '删除成功',
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
          message: '回复成功'
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
      console.log(val)
      if (!val) {
        this.time_start_begin = ''
        this.time_start_end = ''
        this.getParams()
        this.getTradeRateList(this.params)
        return
      }
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
        this.list.forEach((item)=>{
          item.star = Number(item.star)
        })
        this.total_count = Number(response.data.data.total_count)
        this.loading = false
      })
    }
  },
  mounted() {
    this.getTradeRateList(this.params)
  }
}
</script>
