<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section section-white">
    <el-form ref="form" :label-position="'left'" :model="form" :rules="rules" label-width="160px">
      <div class="section-body">
        <el-form-item :label="$t('857fbf98.29b041')" prop="resourceName">
          <el-input
            v-model="form.resourceName"
            :placeholder="$t('857fbf98.d1ea11')"
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item :label="$t('857fbf98.2a79a7')" prop="resourceName">
          <el-input
            v-model="form.title_date"
            :placeholder="$t('857fbf98.a4d9a2')"
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item :label="$t('857fbf98.1e3650')" prop="resourceName">
          <el-input
            v-model="form.title_time"
            :placeholder="$t('857fbf98.3fcdc5')"
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item :label="$t('857fbf98.b6c084')" prop="reservationName">
          <el-input
            v-model="form.title_time"
            :placeholder="$t('857fbf98.ffce05')"
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item :label="$t('857fbf98.0f7f38')" prop="interval">
          <el-input
            v-model="form.title_time"
            :placeholder="$t('857fbf98.6bd2fe')"
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item :label="$t('857fbf98.f42347')" prop="resourceName">
          <el-input
            v-model="form.title_time"
            :placeholder="$t('857fbf98.e8f08c')"
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item :label="$t('857fbf98.68346c')" prop="resourceName">
          <el-input
            v-model="form.title_time"
            :placeholder="$t('857fbf98.4e9fd0')"
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item :label="$t('857fbf98.9ed26a')" prop="resourceName">
          <el-input
            v-model="form.title_time"
            :placeholder="$t('857fbf98.0125ab')"
            style="width: 340px"
          />
        </el-form-item>
      </div>
      <div class="section-footer with-border content-center">
        <el-button type="primary" @click="save"> {{ $t('857fbf98.be5fbb') }} </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { getFapiaoset, saveFapiaoset } from '@/api/fapiao'
export default {
  inject: ['refresh'],
  data() {
    return {
      timeIntervals: [
        { value: 15, label: this.$t('857fbf98.f511e9') },
        { value: 30, label: this.$t('857fbf98.751a79') },
        { value: 60, label: this.$t('857fbf98.743a81') },
        { value: 90, label: this.$t('857fbf98.7c4d81') }
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
        resourceName: [{ required: true, message: this.$t('857fbf98.df09ff'), trigger: 'blur' }],
        reservationName: [{ required: true, message: this.$t('857fbf98.4f848a'), trigger: 'blur' }],
        interval: [{ required: true, message: this.$t('857fbf98.e5f6ff'), trigger: 'blur' }],
        maxLimitDay: [{ required: true, validator: maxLimitChecked, trigger: 'blur' }],
        minLimitHour: [{ required: true, validator: minLimitChecked, trigger: 'blur' }]
      }
    }
  },
  mounted() {
    // this.getData()
    // this.getAttr()
  },
  methods: {
    save() {
      const that = this
      saveSettingData(this.form).then((res) => {
        if (res.data.data) {
          this.$message({
            type: 'success',
            message: this.$t('857fbf98.756e9d'),
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
        getListSetting(params).then((res) => {
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
    }
  }
}
</script>
<style scoped></style>
