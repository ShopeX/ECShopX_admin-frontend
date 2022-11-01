<template>
  <div
    v-loading="loading"
    class="section-white content-padded"
  >
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
    >
      <el-form-item
        label="是否开启"
        prop="content"
      >
        <el-switch
          v-model="form.is_open"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
        <div class="frm-tips">
          只有储值面额里面配置的是 充值送积分 才翻倍，充值送钱 不翻倍
        </div>
      </el-form-item>
      <el-form-item
        label="时间段"
        prop="content"
      >
        <el-date-picker
          v-model="form.datetimerange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item
        label="翻倍数"
        prop="content"
      >
        <el-input-number
          v-model="form.multiple"
          controls-position="right"
          :min="1"
          :max="10"
        />
      </el-form-item>
      <div class="section-footer with-border content-center">
        <el-button
          type="primary"
          @click="save"
        >
          保存
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { setRechargeMultiple, getRechargeMultipleByCompanyId } from '../../../api/deposit'

export default {
  props: ['getStatus'],
  data () {
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
    getStatus (newVal, oldVal) {
      if (newVal) {
        this.getMultiple()
      }
    }
  },
  methods: {
    save () {
      let form = {
        'start_time': this.form.datetimerange[0],
        'end_time': this.form.datetimerange[1],
        'is_open': this.form.is_open,
        'multiple': this.form.multiple
      }
      setRechargeMultiple(form).then((res) => {
        this.$message({
          message: '保存成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    getMultiple () {
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
    formatTimeStampToStr (timeStamp) {
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
