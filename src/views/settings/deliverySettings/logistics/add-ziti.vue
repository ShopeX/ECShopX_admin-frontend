<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
        {{ $t('c3d289d9.625fb2') }}
      </el-button>
      <el-button
        type="primary"
        @click="
          () => {
            this.$refs['form'].handleSubmit()
          }
        "
      >
        {{ $t('c3d289d9.be5fbb') }}
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
      }
    }
  },
  computed: {
    formList() {
      return [
        {
          label: this.$t('c3d289d9.6b88c4'),
          key: 'name',
          type: 'input',
          required: true,
          message: this.$t('c3d289d9.da8d74')
        },
        {
          label: this.$t('c3d289d9.b73851'),
          key: 'zitiAddress',
          component: () => (
            <FormItemZitiAddress ref='zitiaddress' v-model={this.form.zitiAddress} />
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
          label: this.$t('c3d289d9.09a1f6'),
          key: 'connectPhone',
          component: () => (
            <FormItemConnectPhone ref='connectphone' v-model={this.form.connectPhone} />
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
          label: this.$t('c3d289d9.91c10c'),
          key: 'timeSlots',
          component: () => <FormItemTimeSlot ref='timeslot' v-model={this.form.timeSlots} />,
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
          label: this.$t('c3d289d9.33e3c0'),
          key: 'workDays',
          type: 'checkbox',
          options: [
            { label: '1', name: this.$t('c3d289d9.1603b0') },
            { label: '2', name: this.$t('c3d289d9.b5a6a0') },
            { label: '3', name: this.$t('c3d289d9.e60725') },
            { label: '4', name: this.$t('c3d289d9.170fc8') },
            { label: '5', name: this.$t('c3d289d9.eb79ce') },
            { label: '6', name: this.$t('c3d289d9.245751') },
            { label: '7', name: this.$t('c3d289d9.562d74') }
          ]
        },
        {
          label: this.$t('c3d289d9.2404f5'),
          key: 'waitPickupDays',
          component: () => <FormItemAppointDays v-model={this.form.waitPickupDays} />,
          tip: this.$t('c3d289d9.35fca0')
        },
        {
          label: this.$t('c3d289d9.63ce89'),
          key: 'latestPickupTime',
          component: () => <FormItemAppointZiti v-model={this.form.latestPickupTime} />,
          tip: this.$t('c3d289d9.a70e24')
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
        this.$message.success(this.$t('c3d289d9.77676e'))
      } else {
        await this.$api.pickuplocation.addZitiLocation(params)
        this.$message.success(this.$t('c3d289d9.1496a0'))
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
