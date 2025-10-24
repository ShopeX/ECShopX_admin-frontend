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
<style lang="scss">
.sp-countdown {
  .count-down-timer {
    display: flex;
    align-items: center;
    padding-left: 10px;
    font-size: 11px;
    .timer {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      padding: 0 3px;
      background: #333;
      color: #fff;
      border-radius: 2px;
      font-size: 10px;
      font-family: sans-serif;
    }
    .dot {
      padding: 0 3px;
      position: relative;
      top: 1px;
    }
    .describe {
      position: relative;
      top: 1px;
    }
  }
}
</style>

<template>
  <div class="sp-countdown">
    <div class="count-down-timer">
      <div class="timer">{{ day }}</div>
      <div class="dot">天</div>
      <div class="timer">{{ hour }}</div>
      <div class="dot">时</div>
      <div class="timer">{{ min }}</div>
      <div class="dot">分</div>
      <div class="timer">{{ sec }}</div>
      <div class="dot">秒</div>
      <div class="describe">{{ describe }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SpCountDown',
  props: {
    time: {
      type: Number,
      default: 0
    },
    describe: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      day: '',
      hour: '',
      min: '',
      sec: '',
      // 剩余秒数
      remainTime: 0,
      timeInterval: null
    }
  },
  watch: {
    time: {
      handler(newVal, oldVal) {
        this.remainTime = newVal
        clearInterval(this.timeInterval)
        this.countdown()
      },
      immediate: true
    }
  },
  methods: {
    countdown() {
      this.timeInterval = setInterval(() => {
        if (this.remainTime <= 0) {
          clearInterval(this.timeInterval)
        }
        const day = Math.floor(this.remainTime / 86400)
        const hour = Math.floor((this.remainTime / 3600) % 24)
        const min = Math.floor((this.remainTime / 60) % 60)
        const sec = Math.floor(this.remainTime % 60)
        this.day = day < 10 ? '0' + day : day
        this.hour = hour < 10 ? '0' + hour : hour
        this.min = min < 10 ? '0' + min : min
        this.sec = sec < 10 ? '0' + sec : sec
        this.remainTime--
      }, 1000)
    }
  }
}
</script>
