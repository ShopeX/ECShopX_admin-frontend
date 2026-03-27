<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section section-white">
    <el-form ref="form" :label-position="'left'" :model="form" :rules="rules" label-width="160px">
      <div class="section-body">
        <el-form-item :label="$t('5001c021.29b041')" prop="resourceName">
          <el-input
            v-model="form.resourceName"
            :placeholder="$t('5001c021.d1ea11')"
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item :label="$t('5001c021.2a79a7')" prop="resourceName">
          <el-input
            v-model="form.title_date"
            :placeholder="$t('5001c021.a4d9a2')"
            style="width: 140px"
          />
          %
        </el-form-item>
        <el-form-item :label="$t('5001c021.1e3650')" prop="resourceName">
          <el-input
            v-model="form.title_time"
            :placeholder="$t('5001c021.3fcdc5')"
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item :label="$t('5001c021.b6c084')" prop="reservationName">
          <el-input
            v-model="form.title_time"
            :placeholder="$t('5001c021.ffce05')"
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item :label="$t('5001c021.0f7f38')" prop="interval">
          <el-input
            v-model="form.title_time"
            :placeholder="$t('5001c021.6bd2fe')"
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item :label="$t('5001c021.f42347')" prop="resourceName">
          <el-input
            v-model="form.title_time"
            :placeholder="$t('5001c021.e8f08c')"
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item :label="$t('5001c021.68346c')" prop="resourceName">
          <el-input
            v-model="form.title_time"
            :placeholder="$t('5001c021.4e9fd0')"
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item :label="$t('5001c021.9ed26a')" prop="resourceName">
          <el-input
            v-model="form.title_time"
            :placeholder="$t('5001c021.0125ab')"
            style="width: 340px"
          />
        </el-form-item>
      </div>
      <div class="section-footer with-border content-center">
        <el-button type="primary" @click="save">{{ $t('5001c021.be5fbb') }}</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { getFapiaoset, saveFapiaoset } from '@/api/fapiao'
import { i18n } from '@/i18n'

export default {
  inject: ['refresh'],
  data() {
    var modelChecked = (rule, val, callback) => {
      if (val.length <= 0) {
        return callback(new Error(this.$t('5001c021.5e2e72')))
      }
      callback()
    }

    var maxLimitChecked = (rule, value, callback) => {
      let reg = /^\d*$/
      if (!reg.test(value)) {
        callback(new Error(this.$t('5001c021.e2cd91')))
      } else {
        callback()
      }
    }
    var minLimitChecked = (rule, value, callback) => {
      let reg = /^\d*$/
      if (!reg.test(value)) {
        callback(new Error(this.$t('5001c021.5ff9d4')))
      } else {
        callback()
      }
    }
    var smsDelayChecked = (rule, value, callback) => {
      let reg = /^\d*$/
      if (!reg.test(value)) {
        callback(new Error(this.$t('5001c021.60caae')))
      } else {
        callback()
      }
    }
    var cancelMinuteChecked = (rule, value, callback) => {
      let reg = /^\d*$/
      if (!reg.test(value)) {
        callback(new Error(this.$t('5001c021.67d6fd')))
      } else {
        callback()
      }
    }
    return {
      timeIntervals: [
        { value: 15, labelKey: '5001c021.f511e9' },
        { value: 30, labelKey: '5001c021.751a79' },
        { value: 60, labelKey: '5001c021.743a81' },
        { value: 90, labelKey: '5001c021.7c4d81' }
      ],
      attrList: [], //服务类目ID
      form: {
        id: 1,
        resourceName: '',
        reservationMode: '',
        reservationName: '',
        title_date: '',
        title_time: '',
        interval: 30,
        maxLimitDay: 10,
        minLimitHour: 30
      },
      rules: {
        resourceName: [{ required: true, message: i18n.t('5001c021.df09ff'), trigger: 'blur' }],
        reservationName: [
          { required: true, message: () => this.$t('5001c021.4f848a'), trigger: 'blur' }
        ],
        interval: [{ required: true, message: () => this.$t('5001c021.e5f6ff'), trigger: 'blur' }],
        maxLimitDay: [{ required: true, validator: maxLimitChecked, trigger: 'blur' }],
        minLimitHour: [{ required: true, validator: minLimitChecked, trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getData()
    this.getAttr()
  },
  methods: {
    save() {
      const that = this
      saveSettingData(this.form).then((res) => {
        if (res.data.data) {
          this.$message({
            type: 'success',
            message: this.$t('5001c021.756e9d'),
            duration: 2 * 1000,
            onClose() {
              that.refresh()
              that.$router.go(-1)
            }
          })
        }
        //this.getData()
      })
    },
    getData() {
      let params = { id: 0 }
      this.loading = true
      if (this.$router.currentRoute.query.id) {
        params.id = this.$router.currentRoute.query.id
        getFapiaoset(params).then((res) => {
          if (res.data.data.list) {
            var data = res.data.data.list
            data.map((item) => {
              ;(this.form.id = item.id),
                (this.form.resourceName = item.resourceName),
                (this.form.title_date = item.title_date),
                (this.form.title_time = item.title_time),
                (this.form.reservationMode = item.reservationModeKV.value),
                (this.form.reservationName = item.reservationModeKV.label),
                (this.form.interval = item.timeInterval),
                (this.form.maxLimitDay = item.maxLimitDay)
              this.form.minLimitHour = item.minLimitHour
            })
          }
          this.loading = false
        })
      }
    },
    limitChange() {
      this.form.limit = 0
      this.form.limit = 0
    },
    selectAtr() {},
    getAttr() {
      let params = { page: 1, pageSize: 200, attribute_type: 'item_inductry' }
      // getAttributes(params).then(res =>{
      //   console.log(res)
      //   this.attrList = res.data.data.list;
      //   console.log(this.attrList)
      // })
    }
  }
}
</script>
<style scoped></style>
