<template>
  <el-card class="cus-card">
    <div class="cus-title">
      详细信息
    </div>
    <div class="avater-box">
      <div class="flex-avater-box">
        <img
          class="avater-img"
          src="@/assets/img/adapay/authory_avater.png"
          alt=""
        >
        <span class="cus-username">{{ operatorInfo.login_name }}</span>
        <el-tag
          :type="operatorInfo.operator_type === 'staff' ? 'success' : 'warning'"
          size="medium"
          style="margin-left: 25px"
        >
          {{ operatorInfo.operator_type === 'staff' ? '平台管理员' : '店铺管理员' }}
        </el-tag>
      </div>
      <img
        v-if="info.status == '1'"
        src="@/assets/img/adapay/pass.png"
        style="width: 80px; height: 64px"
        alt=""
      >
      <img
        v-if="info.status == '2'"
        src="@/assets/img/adapay/reject.png"
        alt=""
        style="width: 70px; height: 69px"
      >
    </div>
    <el-row class="cus-info-box">
      <el-col :span="24">
        <span class="cus-label">姓名：</span>
        <span>{{ operatorInfo.username }}</span>
      </el-col>
      <el-col :span="24">
        <span class="cus-label">手机号：</span>
        <span>{{ operatorInfo.mobile }}</span>
      </el-col>
      <el-col :span="24">
        <span class="cus-label">申请时间：</span>
        <span>{{ timeFilter(info.create_time) }}</span>
      </el-col>
      <el-col :span="24">
        <span class="cus-label">所属店铺：</span>
        <el-tag
          v-for="item in distributorIds"
          :key="item.name"
          type=""
          size="small"
          class="cus-authory-tags"
        >
          {{ item.name }}
        </el-tag>
      </el-col>
      <el-col
        v-if="operatorInfo.operator_type === 'staff'"
        :span="24"
      >
        <span class="cus-label">角色：</span>
        <el-tag
          v-for="item in roleData"
          :key="item.role_name"
          type="success"
          size="small"
          class="cus-authory-tags"
        >
          {{ item.role_name }}
        </el-tag>
      </el-col>
      <el-col :span="24">
        <span class="cus-label">申请说明：</span>
        <span>{{ info.reason || '-' }}</span>
      </el-col>
      <el-col
        :span="24"
        class="cus-time"
      >
        <span class="cus-label">申请开通时间：</span>
        <span>{{ info.range ? '每个工作日' + info.range : '全天' }}</span>
        <span class="cus-label">生效时间：</span>
        <span>{{ info.start_time }}</span>
        <span class="cus-label">结束时间：</span>
        <span>{{ info.end_time }}</span>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import moment from 'moment'
export default {
  props: ['info', 'title', 'roleData', 'distributorIds', 'operatorInfo'],
  methods: {
    timeFilter (time, format = 'YYYY-MM-DD HH:mm:ss') {
      return time ? moment(time * 1000).format(format) : '-'
    }
  }
}
</script>

<style lang="scss" scoped>
.cus-card {
  .cus-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 25px;
  }
  .avater-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    margin-right: 100px;
    margin-left: 20px;
  }
  .flex-avater-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .avater-img {
    width: 50px;
    height: 50px;
  }
  .cus-info-box {
    margin-left: 20px;
    .el-col-24 {
      margin-bottom: 10px;
    }
    .el-tag {
      margin-bottom: 10px;
    }
  }
  .cus-username {
    font-size: 20px;
    font-weight: bold;
    // color: #02A7F0;
    margin: 10px 0px;
    margin-left: 30px;
  }
  .cus-authory-tags {
    margin-right: 10px;
  }
  .cus-label {
    color: #666666;
    // width: 13%;
    display: inline-block;
  }
}
</style>
