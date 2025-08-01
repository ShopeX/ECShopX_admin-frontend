<template>
  <div>
    <el-row :gutter="10">
      <el-col :md="8" :lg="6">
        <el-input v-model="params.order_id" placeholder="订单号">
          <el-button slot="append" icon="el-icon-search" @click="getLuckyDrawTeamList" />
        </el-input>
      </el-col>
      <el-col :md="8" :lg="6">
        <el-input v-model="params.mobile" placeholder="手机号">
          <el-button slot="append" icon="el-icon-search" @click="getLuckyDrawTeamList" />
        </el-input>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="luckyDrawTeamList" style="width: 110%" border height="580">
      <el-table-column prop="luckydraw_trade_id" label="订单号" width="180" />
      <el-table-column prop="lucky_code" label="抽奖号码" width="120" />
      <el-table-column prop="member_info.backend_mobile" label="手机号" width="120">
        <template slot-scope="scope">
          <router-link
            :to="{ path: '/member/manage/members/detail', query: { user_id: scope.row.user_id } }"
          >
            {{ scope.row.member_info.backend_mobile }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="member_info.username" label="姓名" width="100" />
      <el-table-column label="下单时间" width="160">
        <template slot-scope="scope">
          {{ scope.row.created | datetime }}
        </template>
      </el-table-column>
      <el-table-column label="中奖状态" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.lucky_status == 'wait'"> 未开奖 </el-tag>
          <el-tag v-else-if="scope.row.lucky_status == 'lucky'" type="danger"> 已中奖 </el-tag>
          <el-tag v-else-if="scope.row.lucky_status == 'unlucky'" type="info"> 未中奖 </el-tag>
          <el-tag v-else> - </el-tag>
          <el-button
            v-if="scope.row.lucky_status == 'lucky' && !scope.row.ship_code"
            type="text"
            @click="deliveryAction(scope.row)"
          >
            发货
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="支付状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.payment_status == 'payed'" type="success"> 已支付 </el-tag>
          <el-tag v-else-if="scope.row.payment_status == 'unpay'" type="info"> 未支付 </el-tag>
          <el-tag v-else-if="scope.row.payment_status == 'refunded'" type="warning">
            已退款
          </el-tag>
          <el-tag v-else-if="scope.row.payment_status == 'readyrefund'"> 等待退款 </el-tag>
          <el-tag v-else> - </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="支付(积分/现金)">
        <template v-if="scope.row.luckydraw_payment == 'cash'" slot-scope="scope">
          <span>{{ scope.row.luckydraw_price / 100 }}元</span>
        </template>
        <template v-if="scope.row.luckydraw_payment == 'point'" slot-scope="scope">
          <span>{{ scope.row.luckydraw_point }} 积分</span>
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
    <!-- 发货-开始 -->
    <el-dialog
      :title="deliveryTitle"
      :visible.sync="deliveryVisible"
      :before-close="handleCancel"
      width="57%"
    >
      <template>
        <el-alert
          v-if="deliveryData.ship_status == 'waitaddress' || !deliveryData.ship_status"
          title="获奖用户还没有填写收货地址，暂时不能发货！"
          type="error"
        />
        <el-form ref="deliveryForm" :model="deliveryForm" class="demo-ruleForm" label-width="100px">
          <el-form-item label="抽奖订单号">
            <el-col :span="20">
              {{ deliveryData.luckydraw_trade_id }}
            </el-col>
          </el-form-item>
          <el-form-item label="商品名称">
            <el-col :span="20">
              {{ deliveryData.item_name }}
            </el-col>
          </el-form-item>
          <el-form-item label="积分">
            <el-col :span="20">
              {{ deliveryData.luckydraw_point }}
            </el-col>
          </el-form-item>
          <el-form-item v-if="deliveryData.address_id" label="收货地址">
            <el-col :span="20">
              {{ deliveryData.address.province }}
              {{ deliveryData.address.city }}
              {{ deliveryData.address.county }}
              {{ deliveryData.address.adrdetail }}
            </el-col>
          </el-form-item>
          <el-form-item v-if="deliveryData.address_id" label="收货人">
            <el-col :span="20">
              {{ deliveryData.address.username }}
            </el-col>
          </el-form-item>
          <el-form-item v-if="deliveryData.address_id" label="手机号">
            <el-col :span="20">
              {{ deliveryData.address.telephone }}
            </el-col>
          </el-form-item>
          <template v-if="deliveryData.address_id">
            <el-form-item label="快递公司">
              <el-col>
                <el-select
                  v-model="deliveryForm.ship_corp"
                  filterable
                  placeholder="请选择快递公司，可搜索"
                >
                  <el-option
                    v-for="item in dlycorps"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="物流单号">
              <el-col :span="14">
                <el-input
                  v-model="deliveryForm.ship_code"
                  :maxlength="20"
                  placeholder="物流公司单号"
                />
              </el-col>
            </el-form-item>
          </template>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel"> 取消 </el-button>
        <el-button type="primary" @click="submitDeliveryAction"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getLuckyDrawTeamList, luckydrawDelivery } from '../../../../../api/promotions'
import hqbdlycorp from '../../../../../common/hqbdlycorp.json'

export default {
  props: ['view'],
  data() {
    return {
      loading: false,
      luckydraw_id: null,
      luckyDrawTeamList: [],
      luckyDrawActivity: {},
      total_count: 0,
      params: {
        view: 0,
        page: 1,
        pageSize: 20,
        keywords: '',
        order_id: '',
        mobile: ''
      },
      IsDisabled: false,
      deliveryVisible: false,
      deliveryTitle: '发货',
      deliveryData: {},
      deliveryForm: {
        luckydraw_trade_id: '',
        ship_corp: '',
        ship_code: '',
        sepInfo: {}
      },
      dlycorps: hqbdlycorp
    }
  },
  mounted() {
    this.luckydraw_id = this.$route.params.luckydraw_id
    this.params.view = this.view
    this.getLuckyDrawTeamList()
  },
  methods: {
    handleCurrentChange(pageNum) {
      this.params.page = pageNum
      this.getLuckyDrawTeamList()
    },
    getLuckyDrawTeamList() {
      this.loading = true
      getLuckyDrawTeamList(this.luckydraw_id, this.params)
        .then(response => {
          this.luckyDrawTeamList = response.data.data.list
          this.luckyDrawActivity = response.data.data.luckyDrawActivity
          this.total_count = response.data.data.total_count
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          this.$message({
            type: 'error',
            message: '获取参与抽奖活动列表失败'
          })
        })
    },
    deliveryAction(row) {
      // 编辑物料弹框
      this.deliveryVisible = true
      this.deliveryData = row
      if (this.deliveryData) {
        this.IsDisabled = true
      }
      this.deliveryForm.luckydraw_trade_id = row.luckydraw_trade_id
      this.deliveryForm.ship_code = row.ship_code
      this.deliveryForm.ship_corp = row.ship_corp
    },
    handleCancel() {
      this.deliveryVisible = false
      this.deliveryForm.luckydraw_trade_id = ''
      this.deliveryForm.ship_corp = ''
      this.deliveryForm.ship_code = ''
    },
    submitDeliveryAction() {
      // 提交物料
      console.log(this.deliveryData)
      if (!this.deliveryData.address_id) {
        this.$message.error('获奖用户还没有填写收货地址，暂时不能发货!')
        return false
      }
      luckydrawDelivery(this.deliveryForm).then(response => {
        if (response.data.data) {
          this.handleCancel()
          this.$message.success('发货成功!')
          this.getLuckyDrawTeamList()
        } else {
          this.$message.error('发货失败!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped></style>
