<template>
  <div class="cpn-result">
    <div
      v-if="currentStatus.resultStatus == 'failed'"
      class="content"
    >
      <div class="img">
        <img
          :src="fail_IMG"
          alt=""
        >
      </div>
      <div class="tips">
        <p>
          您的{{ currentStatus.title }}审核于
          {{ currentStatus.time && timestampToTime(currentStatus.time) }} 未通过
        </p>
        <p>建议查看审批详情修改入驻信息再提交审核</p>
      </div>
      <div class="errinfo">
        审批意见：{{ currentStatus.info || '-' }}
      </div>
    </div>
    <div
      v-else-if="currentStatus.resultStatus == 'succeeded'"
      class="content"
    >
      <div class="img">
        <img
          :src="success_IMG"
          alt=""
        >
      </div>
      <div class="tips">
        <p>
          您的{{ currentStatus.title }}审核于
          {{ currentStatus.time && timestampToTime(currentStatus.time) }} 顺利通过
        </p>
        <p v-if="currentStatus.type == 'photo'">
          请在
          {{ (currentStatus.time && timestampToTime(currentStatus.time + day * 5)) || '-' }}
          前提交证照信息进行审核，否则入驻审核结果将失效
        </p>
      </div>
    </div>
    <div
      v-else-if="currentStatus.resultStatus == 'netin'"
      class="content"
    >
      <div class="img">
        <img
          :src="success_IMG"
          alt=""
        >
      </div>
      <div class="tips">
        <p>您的入网环节顺利完成</p>
      </div>
    </div>
    <div
      v-else
      class="content"
    >
      <div class="img">
        <img
          :src="wait_IMG"
          alt=""
        >
      </div>
      <div class="tips">
        <p>已提交审核，请耐心等待～</p>
        <p>预计会在1～5个工作日完成审核</p>
      </div>
    </div>
    <div class="btn">
      <el-button
        v-if="currentStatus.resultStatus == 'failed'"
        type="primary"
        @click="reset"
      >
        重新填写
      </el-button>
      <el-button
        v-if="currentStatus.resultStatus == 'succeeded'"
        type="primary"
        @click="next"
      >
        下一步
      </el-button>
      <el-button
        v-if="currentStatus.resultStatus == 'netin' && $store.getters.login_type != 'distributor'"
        type="primary"
        @click="nextCenter"
      >
        进入结算信息
      </el-button>
    </div>
  </div>
</template>

<script>
const wait_IMG = require('@/assets/img/adapay/waiting.png')
const success_IMG = require('@/assets/img/adapay/success.png')
const fail_IMG = require('@/assets/img/adapay/fail.png')
import { timestampToTime } from '@/utils'

export default {
  props: {
    currentStatus: {
      type: Object,
      default: () => ({
        resultStatus: 'pending',
        title: '',
        time: '',
        info: '',
        type: null
      })
    }
  },
  data () {
    return {
      wait_IMG,
      success_IMG,
      fail_IMG,
      timestampToTime,
      day: '86400' // 一天的时间戳
    }
  },
  mounted () {
    // this.configHandle();
  },
  methods: {
    reset () {
      this.$emit('processedHandle')
    },
    next () {
      this.$emit('nextPage')
    },
    configHandle () {
      if (this.currentStatus.resultStatus == 'netin') {
        if (this.$store.getters.login_type == 'dealer') {
          const isShow = localStorage.getItem('dealer_isShow')
          if (isShow) {
            this.$router.push({
              path: '/'
            })
          }
          return
        }
      }
    },
    nextCenter () {
      if (this.$store.getters.login_type == 'dealer') {
        window.localStorage.setItem('dealer_isShow', true)
        this.$router.push({
          path: '/'
        })
      } else {
        this.$router.push({
          path: '/applications/adapay/adapay_merchant_info'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cpn-result {
  margin-top: 40px;
  .img {
    margin: 0 auto;
    max-width: 140px;
    img {
      display: block;
      width: 100%;
    }
  }
  .tips {
    padding-top: 50px;
    text-align: center;
    font-size: 16px;
    color: #1890ff;
    p:nth-child(2) {
      margin-top: 16px;
      font-size: 12px;
      color: #8c8c8c;
      margin-bottom: 24px;
    }
  }
  .errinfo {
    width: 60%;
    margin: 0 auto;
    text-align: justify;
    background: #ffcccc;
    padding: 10px 20px;
    border: 1px solid #ffcccc;
    font-size: 14px;
    color: #262626;
    line-height: 20px;
  }
  .btn {
    margin: 50px auto;
    text-align: center;
  }
}
</style>
