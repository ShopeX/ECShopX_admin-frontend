<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section section-white">
    <el-form ref="form" :label-position="'left'" :model="form" :rules="rules" label-width="160px">
      <div class="section-body">
        <el-form-item :label="$t('01253601.ac3adf')" prop="modelSetting">
          <el-radio-group v-model="form.reservationMode">
            <el-radio v-for="item in reservationModes" :key="item.value" :label="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('01253601.279335')" prop="interval">
          <el-select v-model="form.interval">
            <el-option
              v-for="item in timeIntervals"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              {{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('01253601.1a971a')" prop="resourceName">
          <el-input
            v-model="form.resourceName"
            :placeholder="$t('01253601.e2138b')"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item :label="$t('01253601.4e56e7')" prop="maxLimitDay">
          {{ $t('01253601.aa251f') }} <el-input v-model="form.maxLimitDay" style="width: 80px" />
          {{ $t('01253601.fadb0f') }}
        </el-form-item>
        <el-form-item label="" prop="minLimitHour">
          {{ $t('01253601.53fcd5') }} <el-input v-model="form.minLimitHour" style="width: 80px" />
          {{ $t('01253601.f303ee') }}
        </el-form-item>
        <el-form-item :label="$t('01253601.ea472f')" prop="cancelMinute">
          {{ $t('01253601.931ff2') }} <el-input v-model="form.cancelMinute" style="width: 80px" />
          {{ $t('01253601.e2492c') }}
          {{ $t('01253601.526456') }}
        </el-form-item>
        <el-form-item :label="$t('01253601.1df6fc')" prop="condition">
          <el-select v-model="form.condition">
            <el-option
              v-for="item in conditions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('01253601.a8db01')" prop="sms_delay">
          {{ $t('01253601.10ab23') }} <el-input v-model="form.sms_delay" style="width: 80px" />
          {{ $t('01253601.d720c5') }}
        </el-form-item>
        <el-form-item :label="$t('01253601.5d90ff')" prop="limitType">
          <el-radio-group v-model="form.limitType" @change="limitChange">
            <el-radio v-for="item in limitType" :key="item.value" :label="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
          <br />
          <span v-if="form.limitType == 'limit_days'">
            <el-input v-model="form.limit" style="width: 80px" />{{ $t('01253601.2ecb00') }}
          </span>
          <span v-if="form.limitType == 'limit_nums'">
            {{ $t('01253601.54dd6f') }} <el-input v-model="form.limit" style="width: 80px" />{{
              $t('01253601.7229ec')
            }}
          </span>
        </el-form-item>
      </div>
      <div class="section-footer with-border content-center">
        <el-button type="primary" @click="save"> {{ $t('01253601.be5fbb') }} </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { getSetting, saveSetting } from '../../../../api/reservation'
export default {
  data() {
    var modelChecked = (rule, val, callback) => {
      if (val.length <= 0) {
        return callback(new Error(this.$t('01253601.5e2e72')))
      }
      callback()
    }
    var limitTypeChecked = (rule, value, callback) => {
      let reg = /^\d*$/
      let limit = this.form.limit
      if (value === 'limit_nums') {
        if (!reg.test(limit)) {
          callback(new Error(this.$t('01253601.d7c181')))
        } else {
          console.log()
          callback()
        }
      } else if (value === 'limit_days') {
        if (!reg.test(limit)) {
          callback(new Error(this.$t('01253601.3526ce')))
        } else {
          callback()
        }
      }
    }
    var maxLimitChecked = (rule, value, callback) => {
      let reg = /^\d*$/
      if (!reg.test(value)) {
        callback(new Error(this.$t('01253601.e2cd91')))
      } else {
        callback()
      }
    }
    var minLimitChecked = (rule, value, callback) => {
      let reg = /^\d*$/
      if (!reg.test(value)) {
        callback(new Error(this.$t('01253601.5ff9d4')))
      } else {
        callback()
      }
    }
    var smsDelayChecked = (rule, value, callback) => {
      let reg = /^\d*$/
      if (!reg.test(value)) {
        callback(new Error(this.$t('01253601.60caae')))
      } else {
        callback()
      }
    }
    var cancelMinuteChecked = (rule, value, callback) => {
      let reg = /^\d*$/
      if (!reg.test(value)) {
        callback(new Error(this.$t('01253601.67d6fd')))
      } else {
        callback()
      }
    }
    return {
      timeIntervals: [
        { value: 15, label: this.$t('01253601.f511e9') },
        { value: 30, label: this.$t('01253601.751a79') },
        { value: 60, label: this.$t('01253601.743a81') },
        { value: 90, label: this.$t('01253601.7c4d81') }
      ],
      conditions: [{ value: 1, label: this.$t('01253601.cf3a90') }],
      reservationModes: [
        { value: 1, label: this.$t('01253601.0a6c5f') }
        //{ value: 2, label: '门店＋时间＋服务项目'}
      ],
      form: {
        reservationMode: 1,
        interval: 30,
        maxLimitDay: 10,
        minLimitHour: 30,
        condition: 1,
        resourceName: this.$t('01253601.34cc0e'),
        cancelMinute: 60,
        limitType: 'not_open',
        sms_delay: 1,
        limit: 1
      },
      rules: {
        modelSetting: [{ required: true, validator: modelChecked, trigger: 'blur' }],
        interval: [{ required: true, message: this.$t('01253601.e5f6ff'), trigger: 'blur' }],
        resourceName: [{ required: true, message: this.$t('01253601.f6cfeb'), trigger: 'blur' }],
        maxLimitDay: [{ required: true, validator: maxLimitChecked, trigger: 'blur' }],
        minLimitHour: [{ required: true, validator: minLimitChecked, trigger: 'blur' }],
        cancelMinute: [{ required: true, validator: cancelMinuteChecked, trigger: 'blur' }],
        condition: [{ required: true, message: this.$t('01253601.09854f'), trigger: 'blur' }],
        sms_delay: [{ required: true, validator: smsDelayChecked, trigger: 'blur' }],
        limitType: [{ required: true, validator: limitTypeChecked, trigger: 'blur' }]
      },
      limitType: [
        { value: 'not_open', label: this.$t('01253601.89b508') },
        { value: 'limit_days', label: this.$t('01253601.215c4c') },
        { value: 'limit_nums', label: this.$t('01253601.a3d686') }
      ]
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    save() {
      saveSetting(this.form).then((res) => {
        if (res.data.data) {
          this.$message({
            type: 'success',
            message: this.$t('01253601.756e9d')
          })
        }
        this.getData()
      })
    },
    getData() {
      this.loading = true
      getSetting().then((res) => {
        if (res.data.data) {
          var data = res.data.data
          this.form.reservationMode = data.reservationMode
          this.form.maxLimitDay = data.maxLimitDay
          this.form.minLimitHour = data.minLimitHour
          this.form.condition = data.reservationCondition
          this.form.resourceName = data.resourceName
          this.form.interval = data.timeInterval
          this.form.cancelMinute = data.cancelMinute
          this.form.sms_delay = data.smsDelay ? data.smsDelay : 1
          if (data.limitType) {
            this.form.limitType = data.limitType
          } else {
            this.form.limitType = 'not_open'
          }
          if (data.limit) {
            this.form.limit = data.limit
          } else {
            this.form.limit = 1
          }
        }
        console.log(this.form)
        this.loading = false
      })
    },
    limitChange() {
      this.form.limit = 0
    }
  }
}
</script>
