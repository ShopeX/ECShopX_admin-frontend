<template>
  <!-- 申请脱敏 -->
  <div class="zyk_authAdmin">
    <el-row>
      <el-col :span="24">
        <el-input
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 7 }"
          placeholder="请填写申请理由（非必填）"
          v-model="form.reason"
          maxlength="100"
          show-word-limit
        >
        </el-input>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="form">
      <el-col :span="24">
        <i class="el-icon-alarm-clock icon-time"></i> 重复时间：
        <el-select v-model="form.date_type" placeholder="请选择">
          <el-option label="每天" value="0"> </el-option>
          <el-option label="周一到周五" value="1"> </el-option>
        </el-select>
        <el-checkbox v-model="form.isDay" style="margin: 0 20px">全天</el-checkbox>
        <el-col :span="24" style="margin-top: 20px; padding-left: 20px">
          <el-date-picker
            @change="timeChange"
            style="width: 384px"
            v-model="form.time"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-col>
      </el-col>
      <el-col :span="24" style="margin-top: 20px; padding-left: 30px" v-if="!form.isDay">
        <el-time-picker
          is-range
          :clearable="false"
          style="width: 384px"
          format="HH:mm"
          value-format="HH:mm"
          v-model="form.range"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
        >
        </el-time-picker>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16" v-if="!form.isDay">
        每{{ form.date_type == 0 ? '天' : '周一到周五' }} {{ form.range[0] }} 至
        {{ form.range[1] }} 有权限，生效时间：{{ form.start_time }} 结束时间：{{ form.end_time }}
      </el-col>

      <el-col :span="16" class="tips" v-else>
        每{{ form.date_type == 0 ? '天' : '周一到周五' }} 有权限，生效时间：{{
          form.start_time
        }}
        结束时间：{{ form.end_time }}
      </el-col>
      <el-col :span="24" style="text-align: left">
        <el-button type="primary" style="margin-top: 20px" size="small" @click="submit"
          >提 交</el-button
        >
      </el-col>
      <!-- <div style="text-align: right; width: 80%"> -->

      <!-- </div> -->
    </el-row>

    <el-divider></el-divider>

    <SpFinder
      ref="finder"
      :split-count="4"
      :search-row-count="2"
      :fixed-row-action="true"
      :setting="setting"
      noSelection
      url="/datapass"
    >
    </SpFinder>
  </div>
</template>

<script>
import setting_ from './setting/authAdmin'
export default {
  data() {
    return {
      form: {
        start_time: '',
        end_time: '',
        date_type: '0',
        range: '',
        reason: '',
        isDay: false,
        time: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  mounted() {
    this.getDate()
    this.getRange()

    let time = Number('0'+(4+1))
    console.log(time);
  },
  computed: {
    setting() {
      return setting_(this)
    }
  },
  methods: {
    async submit() {
      let obj
      if (!this.form.isDay) {
        obj = { ...this.form, range: `${this.form.range[0]}-${this.form.range[1]}` }
      } else {
        obj = { ...this.form, range: '' }
      }

      const { status, message } = await this.$api.encrypt.createEncrypt(obj)
      if (status) {
        this.$message.success('提交成功')
        this.$refs.finder.refresh()
        this.getDate()
        this.getRange()
        this.form.reason = ''
        this.form.date_type = '0'
      } else {
        this.open(message)
      }
    },
    open(message) {
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        dangerouslyUseHTMLString: true,
        type: 'warning',
        customClass: 'zyk_authAdmin_messageBox'
      })
    },
    getDate() {
      const timer = new Date()
      let y = timer.getFullYear()
      let m = timer.getMonth() + 1
      let d = timer.getDate()
      let h = timer.getHours()
      let min = timer.getMinutes()
      if (m < 10) {
        m = '0' + m
      }
      if (d < 10) {
        d = '0' + d
      }

      this.form.start_time = `${y}-${m}-${d}`
      this.form.end_time = `${y}-${m}-${d}`
      this.form.time = [`${y}-${m}-${d}`, `${y}-${m}-${d}`]
    },
    getRange() {
      const timer = new Date()

      let h = timer.getHours()
      let min = timer.getMinutes()
    
      if (h < 10) {
        var h1 = '0'
      }
      if (min < 10) {
        min = '0' + min
      }
      if (h1) {
        this.form.range = [`${h1+ h}:${min}`, `${h1+ Number(h + 1)}:${min}`]
      }else{
        this.form.range = [`${h}:${min}`, `${Number(h + 1)}:${min}`]
      }
      
    },
    timeChange(val) {
      if (!val) {
        this.form.time = []
        this.form.start_time = ''
        this.form.end_time = ''
      } else {
        this.form.start_time = val[0]
        this.form.end_time = val[1]
      }
    }
  },
  watch: {
    'form.isDay'(val) {
      if (val == '0') {
        this.getRange()
        return
      }
      this.form.range = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  padding: 20px 0;
  .icon-time {
    font-size: 20px;
  }
  span {
    padding: 0 20px;
  }
}
</style>

<style lang="scss">
.zyk_authAdmin {
  .sp-finder-bd {
    padding: 16px 0px;
  }
  .el-table th {
    background: #f5f5f5;
    color: #000;
  }
}

.zyk_authAdmin_messageBox {
  .el-message-box__status {
    position: absolute;
    top: 8% !important;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    font-size: 24px !important;
  }
}
</style>