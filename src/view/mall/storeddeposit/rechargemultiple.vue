<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div v-loading="loading" class="section-white content-padded">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item :label="$t('344aac07.780afe')" prop="content">
        <el-switch v-model="form.is_open" active-color="#13ce66" inactive-color="#ff4949" />
        <div class="frm-tips">{{ $t('344aac07.d86d5f') }}</div>
      </el-form-item>
      <el-form-item :label="$t('344aac07.ae20c0')" prop="content">
        <el-date-picker
          v-model="form.datetimerange"
          type="datetimerange"
          :range-separator="$t('344aac07.981cbe')"
          :start-placeholder="$t('344aac07.b44c0f')"
          :end-placeholder="$t('344aac07.1d468b')"
        />
      </el-form-item>
      <el-form-item :label="$t('344aac07.61076e')" prop="content">
        <el-input-number v-model="form.multiple" controls-position="right" :min="1" :max="10" />
      </el-form-item>
      <div class="section-footer with-border content-center">
        <el-button type="primary" @click="save"> {{ $t('344aac07.be5fbb') }} </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { setRechargeMultiple, getRechargeMultipleByCompanyId } from '../../../api/deposit'

export default {
  props: ['getStatus'],
  data() {
    return {
      loading: false,
      form: {
        datetimerange: '',
        is_open: 'false',
        multiple: 1
      }
    }
  },
  watch: {
    getStatus(newVal, oldVal) {
      if (newVal) {
        this.getMultiple()
      }
    }
  },
  methods: {
    save() {
      let form = {
        start_time: this.form.datetimerange[0],
        end_time: this.form.datetimerange[1],
        is_open: this.form.is_open,
        multiple: this.form.multiple
      }
      setRechargeMultiple(form).then((res) => {
        this.$message({
          message: this.$t('344aac07.3b1083'),
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    getMultiple() {
      this.loading = true
      getRechargeMultipleByCompanyId().then((res) => {
        this.form.is_open = res.data.data.is_open
        this.form.multiple = res.data.data.multiple
        this.form.datetimerange = [
          this.formatTimeStampToStr(res.data.data.start_time),
          this.formatTimeStampToStr(res.data.data.end_time)
        ]
        console.log(this.form.datetimerange)
        this.loading = false
      })
    },
    formatTimeStampToStr(timeStamp) {
      //时间戳转时间字符串
      var date = new Date()
      date.setTime(timeStamp * 1000)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      var h = date.getHours()
      h = h < 10 ? '0' + h : h
      var minute = date.getMinutes()
      var second = date.getSeconds()
      minute = minute < 10 ? '0' + minute : minute
      second = second < 10 ? '0' + second : second
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    }
  }
}
</script>

<style scoped lang="scss">
.agreement-content {
  display: inline-block;
  overflow: hidden;
  word-break: break-all;
  width: 80%;
}
</style>
