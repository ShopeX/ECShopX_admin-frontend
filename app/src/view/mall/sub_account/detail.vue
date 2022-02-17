<template>
  <div class="zyk_adapay_account_detail">
    <el-descriptions :column="2" title="订单信息">
      <el-descriptions-item label="交易状态">
        <span v-if="list.trade_state == 'SUCCESS'">支付完成</span>
        <span v-else-if="list.trade_state == 'PARTIAL_REFUND'">部分退款</span>
        <span v-else-if="list.trade_state == 'FULL_REFUND'">全额退款</span>
      </el-descriptions-item>
      <el-descriptions-item label="分账状态">
        <span v-if="list.adapay_div_status == 'NOTDIV'">未分账</span>
        <span v-else-if="list.adapay_div_status == 'DIVED'">已分账</span>
      </el-descriptions-item>
      <el-descriptions-item label="商户名称">{{ list.mer_name }}</el-descriptions-item>
      <el-descriptions-item label="店铺名称">{{ list.distributor_name }}</el-descriptions-item>
      <el-descriptions-item label="订单号">
        {{ list.order_id }}
      </el-descriptions-item>
      <el-descriptions-item label="交易流水号">{{ list.trade_id }}</el-descriptions-item>
      <el-descriptions-item label="订单金额">{{
        (list.total_fee / 100) | formatNumMoney
      }}</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{
        list.time_start | formatTimestamp
      }}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions :column="2" title="支付信息">
      <el-descriptions-item label="支付订单号">{{ list.transaction_id }}</el-descriptions-item>
      <el-descriptions-item label="支付时间">{{
        list.time_start | formatTimestamp
      }}</el-descriptions-item>
      <el-descriptions-item label="支付金额">{{
        (list.pay_fee / 100) | formatNumMoney
      }}</el-descriptions-item>
      <el-descriptions-item label="支付方式">
        <span v-if="list.pay_channel == 'wx_lite'">微信小程序支付</span>
      </el-descriptions-item>
      <el-descriptions-item label="支付对象ID">{{ list.username }}</el-descriptions-item>
    </el-descriptions>
    <div class="group"  v-if="list.div_fee_info.total_div_fee">
      <div class="title">分账信息</div>
      <div class="list">
        <div class="tab">
          <div class="key">分账总金额：</div>
          <div class="value">{{ (list.div_fee_info.total_div_fee / 100) | formatNumMoney }}</div>
        </div>
        <div class="tab">
          <div class="key">分账时间：</div>
          <div class="value">{{ list.div_fee_info.create_time | formatTimestamp }}</div>
        </div>
      </div>
      <div class="list" v-for="(item, index) in list.div_fee_info.list.list" :key="index">
        <div class="tab">
          <div class="key">分账用户：</div>
          <div class="value">{{ item.username }}</div>
        </div>
        <div class="tab">
          <template v-if="index == 0">
            <div class="key">
              <el-tooltip
                v-if="$store.getters.login_type != 'distributor'"
                placement="top-end"
                effect="light"
              >
                <i class="el-icon-warning-outline"></i>
                 <div v-if="$store.getters.login_type == 'dealer'" slot="content">分账金额 = (订单金额-手续费) * 经销商分账占比<br/>若计算金额存在三位及以上的小数，则四舍五入精确至两位小数</div>
                  <div v-else slot="content">分账金额 = (订单金额-手续费) * 总部分账占比<br/>若计算金额存在三位及以上的小数，则四舍五入精确至两位小数</div>
              </el-tooltip>
              分账金额：
            </div>
          </template>
          <template v-if="index == 1">
            <div class="key">
              <el-tooltip
                v-if="$store.getters.login_type != 'distributor'"
                content="店铺分账金额=订单金额-手续费-总部分账金额-经销商分账金额"
                placement="top-end"
                effect="light"
              >
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
              分账金额：
            </div>
          </template>
          <template v-if="index == 2">
            <div class="key">
              <el-tooltip
                v-if="$store.getters.login_type != 'distributor'"
                content="分账金额=(订单金额-手续费)*经销商分账占比，若计算金额存在三位及以上的小数，则四舍五入精确至两位小数"
                placement="top-end"
                effect="light"
              >
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
              分账金额： 
            </div>
          </template>


          <div class="value">{{ (item.div_fee / 100) | formatNumMoney }}</div>
        </div>
      </div>
    </div>
    <el-descriptions :column="2" title="手续费信息" v-if="list.adapay_fee && $store.getters.login_type=='admin'">
      <el-descriptions-item label="手续费扣费方式">
        <span v-if="list.adapay_fee_mode == 'O'">外扣</span>
        <span v-else-if="list.adapay_fee_mode == 'I'">内扣</span>
      </el-descriptions-item>
      <el-descriptions-item label="手续费">{{
        (list.adapay_fee / 100) | formatNumMoney
      }}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions :column="2" title="退款信息" v-if="list.refund_list.length > 0">
      <template v-for="item in list.refund_list">
        <el-descriptions-item :key="item.order_id" label="退款订单号">{{
          item.order_id
        }}</el-descriptions-item>
        <el-descriptions-item :key="item.refund_bn" label="退款流水号">{{
          item.refund_bn
        }}</el-descriptions-item>
        <el-descriptions-item :key="item.refunded_fee" label="退款金额">{{
          (item.refunded_fee / 100) | formatNumMoney
        }}</el-descriptions-item>
        <el-descriptions-item :key="item.create_time" label="申请时间">{{
          item.create_time | formatTimestamp
        }}</el-descriptions-item>
      </template>
    </el-descriptions>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: {}
    }
  },
  mounted() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { order_id } = this.$route.params
      const result = await this.$api.adapay.subAccountDetail(order_id)
      this.list = result.data.data
    }
  }
}
</script>

<style lang="scss" scoped>
.zyk_adapay_account_detail {
  padding-bottom: 100px;
}
.group {
  padding: 20px 0;

  .title {
    font-size: 16px;
    font-weight: 700;
    color: #000;
    background: #f5f5f5;
    padding: 5px;
  }
  .list {
    max-width: 1200px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    .tab {
      flex: 1;
      display: flex;
      // justify-content: space-between;
    }
    &:nth-child(2){
      padding: 20px 20px;
    }
    &:nth-child(3){
      padding: 0px 20px;
    }
    &:nth-child(4){
      padding: 20px 20px;
    }
    &:nth-child(5){
      padding: 0px 20px;
    }
  }


}
</style>

<style lang="scss">
.zyk_adapay_account_detail {
  .el-descriptions {
    margin: 20px 0;
  }
}
</style>

<style lang="scss">
.zyk_adapay_account_detail {
  .el-descriptions__header {
    background: #f5f5f5;
    padding-left: 0px;
    padding: 5px;
  }
  .el-descriptions__body {
    color: #606266;
    background-color: #fff;
    padding: 20px;
    max-width: 1200px;
  }
}
</style>