<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="cpn-result">
    <div v-if="currentStatus.resultStatus == 'failed'" class="content">
      <div class="img">
        <img :src="fail_IMG" alt="" />
      </div>
      <div class="tips">
        <p>
          {{
            $t('e15f614a.6247c2', {
              title: currentStatus.title,
              time: currentStatus.time && timestampToTime(currentStatus.time)
            })
          }}
        </p>
        <p>{{ $t('e15f614a.4d8d6f') }}</p>
      </div>
      <div class="errinfo">{{ $t('e15f614a.f5c361') }}{{ currentStatus.info || '-' }}</div>
    </div>
    <div v-else-if="currentStatus.resultStatus == 'succeeded'" class="content">
      <div class="img">
        <img :src="success_IMG" alt="" />
      </div>
      <div class="tips">
        <p>
          {{
            $t('e15f614a.06b035', {
              title: currentStatus.title,
              time: currentStatus.time && timestampToTime(currentStatus.time)
            })
          }}
        </p>
        <p v-if="currentStatus.type == 'photo'">
          {{
            $t('e15f614a.5182d0', {
              time: (currentStatus.time && timestampToTime(currentStatus.time + day * 5)) || '-'
            })
          }}
        </p>
      </div>
    </div>
    <div v-else-if="currentStatus.resultStatus == 'netin'" class="content">
      <div class="img">
        <img :src="success_IMG" alt="" />
      </div>
      <div class="tips">
        <p>{{ $t('e15f614a.ff8e5d') }}</p>
      </div>
    </div>
    <div v-else class="content">
      <div class="img">
        <img :src="wait_IMG" alt="" />
      </div>
      <div class="tips">
        <p>{{ $t('e15f614a.0236d1') }}</p>
        <p>{{ $t('e15f614a.4d6405') }}</p>
      </div>
    </div>
    <div class="btn">
      <el-button v-if="currentStatus.resultStatus == 'failed'" type="primary" @click="reset">
        {{ $t('e15f614a.a5c7b5') }}
      </el-button>
      <el-button v-if="currentStatus.resultStatus == 'succeeded'" type="primary" @click="next">
        {{ $t('e15f614a.38ce27') }}
      </el-button>
      <el-button
        v-if="currentStatus.resultStatus == 'netin' && $store.getters.login_type != 'distributor'"
        type="primary"
        @click="nextCenter"
      >
        {{ $t('e15f614a.5a2ee9') }}
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
  data() {
    return {
      wait_IMG,
      success_IMG,
      fail_IMG,
      timestampToTime,
      day: '86400' // 一天的时间戳
    }
  },
  mounted() {
    // this.configHandle();
  },
  methods: {
    reset() {
      this.$emit('processedHandle')
    },
    next() {
      this.$emit('nextPage')
    },
    configHandle() {
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
    nextCenter() {
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
