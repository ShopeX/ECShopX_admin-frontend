<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <div>
    <span>时间筛选：</span>
    <el-select v-model="timeType" type="timeType" @change="typeChange">
      <el-option label="最近7天" :value="1" />
      <el-option label="最近30天" :value="2" />
      <el-option label="自然天" :value="3" />
      <el-option label="今日实时" :value="4" />
      <el-option label="自定义" :value="5" />
</el-select
    >&nbsp;
    <span v-if="isNeardate"
      >{{ typeText
      }}<span v-if="isRealTime" class="refresh" @click="getRealTime">&nbsp;刷新</span></span
    >
    <el-date-picker
      v-if="ischooseDay"
      v-model="chooseDate"
      type="date"
      placeholder="选择日期"
      :picker-options="pickerOptions"
    />
    <el-date-picker
      v-if="iscustom"
      v-model="customDate"
      type="daterange"
      placeholder="选择日期范围"
      :picker-options="pickerOptions2"
    />
  </div>
</template>

<script>
export default {
  props: ['defaultText', 'defaultValue'],
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7
        }
      },
      chooseDate: '',
      customDate: '',
      timeType: '最近7天',
      typeText: '',
      isNeardate: true,
      ischooseDay: false,
      isRealTime: false,
      iscustom: false
    }
  },
  mounted() {
    this.timeType = this.defaultText
    this.timeTypeChange(this.defaultValue)
  },
  methods: {
    typeChange(val) {
      this.timeTypeChange(val)
    },
    timeTypeChange(val) {
      var day = 86400000
      var yesterday = new Date(new Date().getTime() - day)
      yesterday = this.getTaskTime(yesterday, true)
      var startDate = ''
      this.isNeardate = this.ischooseDay = this.isRealTime = this.iscustom = false
      switch (val) {
        case 1:
          startDate = this.getTaskTime(new Date(new Date().getTime() - day * 7), true)
          this.typeText = startDate + ' 至 ' + yesterday
          this.isNeardate = true
          break
        case 2:
          startDate = this.getTaskTime(new Date(new Date().getTime() - day * 30), true)
          this.typeText = startDate + ' 至 ' + yesterday
          this.isNeardate = true
          break
        case 3:
          this.ischooseDay = true
          break
        case 4:
          this.isRealTime = this.isNeardate = true
          this.typeText = this.getTaskTime('', false)
          break
        case 5:
          this.iscustom = true
          break
      }
    },
    getTaskTime(s, isShortTime) {
      let date = s ? s : new Date()
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let h = date.getHours()
      h = h < 10 ? '0' + h : h
      let mm = date.getMinutes()
      mm = mm < 10 ? '0' + mm : mm
      let ms = date.getSeconds()
      ms = ms < 10 ? '0' + ms : ms
      let str = isShortTime
        ? y + '-' + m + '-' + d
        : y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + ms
      return str
    },
    getRealTime() {
      this.typeText = this.getTaskTime('', false)
    }
  }
}
</script>
