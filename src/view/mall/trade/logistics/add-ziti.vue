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
<style lang="scss" scoped>
.ziti-form {
  margin-top: 30px;
}
</style>
<template>
  <SpPage>
    <SpForm
      ref="form"
      v-model="form"
      class="ziti-form"
      :form-list="formList"
      :submit="false"
      @onSubmit="onSubmit"
    />

    <div class="text-center">
      <el-button
        @click="
          () => {
            this.$router.go(-1)
          }
        "
      >
        取消
      </el-button>
      <el-button
        type="primary"
        @click="
          () => {
            this.$refs['form'].handleSubmit()
          }
        "
      >
        保存
      </el-button>
    </div>
  </SpPage>
</template>

<script>
import { getRegionNameById, getRegionIdByName } from '@/utils'
import district from '@/common/district.json'
import FormItemZitiAddress from './comps/form-item-zitiaddress'
import FormItemConnectPhone from './comps/form-item-connectphone'
import FormItemTimeSlot from './comps/form-item-timeslot'
import FormItemAppointDays from './comps/form-item-appointdays'
import FormItemAppointZiti from './comps/form-item-appointziti'
export default {
  name: '',
  // components: {
  //   FormItemZitiAddress,
  //   FormItemConnectPhone
  // },
  data() {
    return {
      form: {
        name: '',
        zitiAddress: {
          region: [],
          address: ''
        },
        connectPhone: {
          areaNo: '',
          phone: ''
        },
        timeSlots: [[null, null]],
        workDays: [],
        waitPickupDays: {
          value: 'current', // current, days
          days: 1
        },
        latestPickupTime: null
      },
      formList: [
        {
          label: '自提点名称',
          key: 'name',
          type: 'input',
          required: true,
          message: '自提点名称不能为空'
        },
        {
          label: '自提点地址',
          key: 'zitiAddress',
          component: () => (
            <FormItemZitiAddress ref="zitiaddress" v-model={this.form.zitiAddress} />
          ),
          validator: (rule, value, callback) => {
            try {
              this.$refs['zitiaddress'].validator()
              callback()
            } catch (e) {
              callback(e)
            }
          }
        },
        {
          label: '联系电话',
          key: 'connectPhone',
          component: () => (
            <FormItemConnectPhone ref="connectphone" v-model={this.form.connectPhone} />
          ),
          validator: (rule, value, callback) => {
            try {
              this.$refs['connectphone'].validator()
              callback()
            } catch (e) {
              callback(e)
            }
          }
        },
        {
          label: '自提时间段',
          key: 'timeSlots',
          component: () => <FormItemTimeSlot ref="timeslot" v-model={this.form.timeSlots} />,
          validator: (rule, value, callback) => {
            try {
              this.$refs['timeslot'].validator()
              callback()
            } catch (e) {
              callback(e)
            }
          }
        },
        {
          label: '重复',
          key: 'workDays',
          type: 'checkbox',
          options: [
            { label: '1', name: '周一' },
            { label: '2', name: '周二' },
            { label: '3', name: '周三' },
            { label: '4', name: '周四' },
            { label: '5', name: '周五' },
            { label: '6', name: '周六' },
            { label: '7', name: '周日' }
          ]
        },
        {
          label: '最长预约',
          key: 'waitPickupDays',
          component: () => <FormItemAppointDays v-model={this.form.waitPickupDays} />,
          tip: '天数从第二天开始计算，如设置为可预约1天内订单，则买家最长可预约第二天上门自提；天为自然日。'
        },
        {
          label: '预约自提',
          key: 'latestPickupTime',
          component: () => <FormItemAppointZiti v-model={this.form.latestPickupTime} />,
          tip: '该时间之后，只能选择第二天的自提时间；如上面最长预约选择只能当天自提，则该时间后下单不能选择自提。'
        }
      ]
    }
  },
  created() {
    const { id } = this.$route.params
    if (id) {
      this.fetchZitiInfo(id)
    }
  },
  methods: {
    async fetchZitiInfo(id) {
      const {
        name,
        province,
        city,
        area,
        address,
        contract_phone,
        hours,
        workdays,
        wait_pickup_days,
        latest_pickup_time
      } = await this.$api.pickuplocation.getZitiLocation(id)
      const connectPhone = contract_phone.split('-')
      const areaNo = connectPhone.length > 1 ? connectPhone[0] : ''
      const phone = connectPhone.length > 1 ? connectPhone[1] : connectPhone[0]
      this.form = {
        name,
        zitiAddress: {
          region: getRegionIdByName([province, city, area], district),
          address
        },
        connectPhone: {
          areaNo,
          phone
        },
        timeSlots: hours,
        workDays: workdays,
        waitPickupDays: {
          value: wait_pickup_days == 0 ? 'current' : 'days', // current, days
          days: wait_pickup_days
        },
        latestPickupTime: latest_pickup_time
      }
    },
    timeSlotsSort(times) {
      let temp
      for (let i = 0; i < times.length - 1; i++) {
        for (let j = 0; j < times.length - 1; j++) {
          const [t1] = times[j]
          const [t2] = times[j + 1]
          const [h1, m1] = t1.split(':')
          const [h2, m2] = t2.split(':')
          if (h1 * 60 + parseInt(m1) > h2 * 60 + parseInt(m2)) {
            temp = JSON.parse(JSON.stringify(times[j]))
            times[j] = JSON.parse(JSON.stringify(times[j + 1]))
            times[j + 1] = temp
          } else {
            times[j] = JSON.parse(JSON.stringify(times[j]))
          }
        }
      }
      return times
    },
    async onSubmit() {
      console.log('form:', JSON.stringify(this.form))
      const {
        name,
        zitiAddress,
        connectPhone,
        timeSlots,
        workDays,
        waitPickupDays,
        latestPickupTime
      } = this.form
      const { region, address } = zitiAddress
      const { areaNo, phone } = connectPhone
      const { value, days } = waitPickupDays
      const [province, city, area] = getRegionNameById(region, district)
      let params = {
        name,
        province,
        city,
        area,
        address,
        area_code: areaNo,
        contract_phone: phone,
        hours: this.timeSlotsSort(timeSlots),
        workdays: workDays,
        wait_pickup_days: value == 'current' ? 0 : days,
        latest_pickup_time: latestPickupTime
      }
      const { id } = this.$route.params
      if (id) {
        await this.$api.pickuplocation.updateZitiLocation(id, params)
        this.$message.success('自提点更新成功')
      } else {
        await this.$api.pickuplocation.addZitiLocation(params)
        this.$message.success('自提点添加成功')
      }
      this.$EventBus.$emit('event.zitilist.refresh')
      console.log(this)
      setTimeout(() => {
        this.$router.go(-1)
      }, 1000)
    }
  }
}
</script>
