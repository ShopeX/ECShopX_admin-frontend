<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-card class="cus-card">
    <div class="cus-title">{{ $t('4113c984.4bcc9a') }}</div>
    <div class="avater-box">
      <div class="flex-avater-box">
        <img class="avater-img" src="@/assets/img/adapay/authory_avater.png" alt="">
        <span class="cus-username">{{ operatorInfo.login_name }}</span>
        <el-tag
          :type="operatorInfo.operator_type === 'staff' ? 'success' : 'warning'"
          size="medium"
          style="margin-left: 25px"
        >
          {{
            operatorInfo.operator_type === 'staff' ? $t('4113c984.fc79d4') : $t('4113c984.3282f2')
          }}
        </el-tag>
      </div>
      <img
        v-if="info.status == '1'"
        src="@/assets/img/adapay/pass.png"
        style="width: 64px; height: 64px"
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
        <span class="cus-label">{{ $t('4113c984.f5d015') }}</span>
        <span>{{ operatorInfo.username }}</span>
      </el-col>
      <el-col :span="24">
        <span class="cus-label">{{ $t('4113c984.41fe81') }}</span>
        <span>{{ operatorInfo.mobile }}</span>
      </el-col>
      <el-col :span="24">
        <span class="cus-label">{{ $t('4113c984.402d96') }}</span>
        <span>{{ timeFilter(info.create_time) }}</span>
      </el-col>
      <el-col :span="24">
        <span class="cus-label">{{ $t('4113c984.468a5c') }}</span>
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
      <el-col v-if="operatorInfo.operator_type === 'staff'" :span="24">
        <span class="cus-label">{{ $t('4113c984.20f32e') }}</span>
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
        <span class="cus-label">{{ $t('4113c984.56d702') }}</span>
        <span>{{ info.reason || '-' }}</span>
      </el-col>
      <el-col :span="24" class="cus-time">
        <span class="cus-label">{{ $t('4113c984.fdaccb') }}</span>
        <span>{{ info.range ? $t('4113c984.1a5086') + info.range : $t('4113c984.bd4357') }}</span>
        <span class="cus-label">{{ $t('4113c984.2e451c') }}</span>
        <span>{{ info.start_time }}</span>
        <span class="cus-label">{{ $t('4113c984.590dbb') }}</span>
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
    timeFilter(time, format = 'YYYY-MM-DD HH:mm:ss') {
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
