<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <!-- 申请脱敏 -->
  <SpPage>
    <div class="zyk_authAdmin">
      <el-row>
        <el-col :span="24">
          <el-input
            v-model="form.reason"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 7 }"
            :placeholder="$t('d593459e.af88e3')"
            maxlength="100"
            show-word-limit
          />
        </el-col>
      </el-row>
      <el-row :gutter="20" class="form">
        <el-col :span="24">
          <i class="el-icon-alarm-clock icon-time" /> {{ $t('d593459e.2abd15') }}
          <el-select v-model="form.date_type" :placeholder="$t('d593459e.708c9d')">
            <el-option :label="$t('d593459e.78623e')" value="0" />
            <el-option :label="$t('d593459e.ebd0a9')" value="1" />
          </el-select>
          <el-checkbox v-model="form.isDay" style="margin: 0 20px">
            {{ $t('d593459e.bd4357') }}
          </el-checkbox>
          <el-col :span="24" style="margin-top: 20px; padding-left: 20px">
            <el-date-picker
              v-model="form.time"
              style="width: 384px"
              type="daterange"
              :range-separator="$t('d593459e.981cbe')"
              value-format="yyyy-MM-dd"
              :start-placeholder="$t('d593459e.b44c0f')"
              :end-placeholder="$t('d593459e.1d468b')"
              :picker-options="pickerOptions"
              @change="timeChange"
            />
          </el-col>
        </el-col>
        <el-col v-if="!form.isDay" :span="24" style="margin-top: 20px; padding-left: 30px">
          <el-time-picker
            v-model="form.range"
            is-range
            :clearable="false"
            style="width: 384px"
            format="HH:mm"
            value-format="HH:mm"
            :range-separator="$t('d593459e.981cbe')"
            :start-placeholder="$t('d593459e.592c59')"
            :end-placeholder="$t('d593459e.f78277')"
            :placeholder="$t('d593459e.6ae9ce')"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col v-if="!form.isDay" :span="16">
          {{ $t('d593459e.a7e221')
          }}{{ form.date_type == 0 ? $t('d593459e.249aba') : $t('d593459e.ebd0a9') }}
          {{ form.range[0] }} {{ $t('d593459e.981cbe') }} {{ form.range[1] }}
          {{ $t('d593459e.23aa00') }}{{ form.start_time }} {{ $t('d593459e.590dbb')
          }}{{ form.end_time }}
        </el-col>

        <el-col v-else :span="16" class="tips">
          {{ $t('d593459e.a7e221')
          }}{{ form.date_type == 0 ? $t('d593459e.249aba') : $t('d593459e.ebd0a9') }}
          {{ $t('d593459e.23aa00') }}{{ form.start_time }} {{ $t('d593459e.590dbb')
          }}{{ form.end_time }}
        </el-col>
        <el-col :span="24" style="text-align: left">
          <el-button type="primary" style="margin-top: 20px" @click="submit">
{{
            $t('d593459e.4372a5')
          }}
</el-button>
        </el-col>
        <!-- <div style="text-align: right; width: 80%"> -->

        <!-- </div> -->
      </el-row>

      <el-divider />

      <SpFinder
        ref="finder"
        :split-count="4"
        :search-row-count="2"
        :fixed-row-action="true"
        :setting="setting"
        no-selection
        url="/datapass"
      />
    </div>
  </SpPage>
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
  computed: {
    setting() {
      return setting_(this)
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
  },
  mounted() {
    this.getDate()
    this.getRange()

    let time = Number('0' + (4 + 1))
    console.log(time)
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
        this.$message.success(this.$t('d593459e.23b62e'))
        this.$refs.finder.refresh(true)
        this.getDate()
        this.getRange()
        this.form.reason = ''
        this.form.date_type = '0'
      } else {
        this.open(message)
      }
    },
    open(message) {
      this.$confirm(message, this.$t('d593459e.02d981'), {
        confirmButtonText: this.$t('d593459e.38cf16'),
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
        this.form.range = [`${h1 + h}:${min}`, `${h1 + Number(h + 1)}:${min}`]
      } else {
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
