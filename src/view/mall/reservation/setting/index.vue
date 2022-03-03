<template>
  <div class="section section-white">
    <el-form
      ref="form"
      :label-position="'left'"
      :model="form"
      :rules="rules"
      label-width="160px"
    >
      <div class="section-body">
        <el-form-item
          label="预约模式设置"
          prop="modelSetting"
        >
          <el-radio-group v-model="form.reservationMode">
            <el-radio
              v-for="item in reservationModes"
              :key="item.value"
              :label="item.value"
            >
              {{
                item.label
              }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="预约时间间隔"
          prop="interval"
        >
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
        <el-form-item
          label="资源位名称"
          prop="resourceName"
        >
          <el-input
            v-model="form.resourceName"
            placeholder="计师"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item
          label="预约周期"
          prop="maxLimitDay"
        >
          最多提前 <el-input
            v-model="form.maxLimitDay"
            style="width: 80px"
          /> 天可预约
        </el-form-item>
        <el-form-item
          label=""
          prop="minLimitHour"
        >
          最少提前 <el-input
            v-model="form.minLimitHour"
            style="width: 80px"
          /> 分钟可预约
        </el-form-item>
        <el-form-item
          label="取消预约条件"
          prop="cancelMinute"
        >
          到店前 <el-input
            v-model="form.cancelMinute"
            style="width: 80px"
          /> 分钟可取消预约
          (必须大于最小预约周期)
        </el-form-item>
        <el-form-item
          label="预约条件"
          prop="condition"
        >
          <el-select v-model="form.condition">
            <el-option
              v-for="item in conditions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="预约短信提醒"
          prop="sms_delay"
        >
          提前 <el-input
            v-model="form.sms_delay"
            style="width: 80px"
          /> 小时发送短信提醒
        </el-form-item>
        <el-form-item
          label="预约限制"
          prop="limitType"
        >
          <el-radio-group
            v-model="form.limitType"
            @change="limitChange"
          >
            <el-radio
              v-for="item in limitType"
              :key="item.value"
              :label="item.value"
            >
              {{
                item.label
              }}
            </el-radio>
          </el-radio-group>
          <br>
          <span v-if="form.limitType == 'limit_days'">
            <el-input
              v-model="form.limit"
              style="width: 80px"
            />天内可预约1次(从预约日开始算)
          </span>
          <span v-if="form.limitType == 'limit_nums'">
            1天内可预约 <el-input
              v-model="form.limit"
              style="width: 80px"
            />次
          </span>
        </el-form-item>
      </div>
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
import { getSetting, saveSetting } from '../../../../api/reservation'
export default {
  data () {
    var modelChecked = (rule, val, callback) => {
      if (val.length <= 0) {
        return callback(new Error('请选择预约模式'))
      }
      callback()
    }
    var limitTypeChecked = (rule, value, callback) => {
      let reg = /^\d*$/
      let limit = this.form.limit
      if (value === 'limit_nums') {
        if (!reg.test(limit)) {
          callback(new Error('预约次数限制必须是数字'))
        } else {
          console.log()
          callback()
        }
      } else if (value === 'limit_days') {
        if (!reg.test(limit)) {
          callback(new Error('预约天数限制必须是数字'))
        } else {
          callback()
        }
      }
    }
    var maxLimitChecked = (rule, value, callback) => {
      let reg = /^\d*$/
      if (!reg.test(value)) {
        callback(new Error('最多提前天数必须为整数'))
      } else {
        callback()
      }
    }
    var minLimitChecked = (rule, value, callback) => {
      let reg = /^\d*$/
      if (!reg.test(value)) {
        callback(new Error('最少提前分钟数必须为整数'))
      } else {
        callback()
      }
    }
    var smsDelayChecked = (rule, value, callback) => {
      let reg = /^\d*$/
      if (!reg.test(value)) {
        callback(new Error('预约短信通知提醒必须为整数'))
      } else {
        callback()
      }
    }
    var cancelMinuteChecked = (rule, value, callback) => {
      let reg = /^\d*$/
      if (!reg.test(value)) {
        callback(new Error('取消预约条件必须为整数'))
      } else {
        callback()
      }
    }
    return {
      timeIntervals: [
        { value: 15, label: '15分钟' },
        { value: 30, label: '30分钟' },
        { value: 60, label: '60分钟' },
        { value: 90, label: '90分钟' }
      ],
      conditions: [{ value: 1, label: '免费预约' }],
      reservationModes: [
        { value: 1, label: '门店＋时间+资源位＋服务项目' }
        //{ value: 2, label: '门店＋时间＋服务项目'}
      ],
      form: {
        reservationMode: 1,
        interval: 30,
        maxLimitDay: 10,
        minLimitHour: 30,
        condition: 1,
        resourceName: '资源位',
        cancelMinute: 60,
        limitType: 'not_open',
        sms_delay: 1,
        limit: 1
      },
      rules: {
        modelSetting: [{ required: true, validator: modelChecked, trigger: 'blur' }],
        interval: [{ required: true, message: '预约时间间隔不能为空', trigger: 'blur' }],
        resourceName: [{ required: true, message: '资源位名称不能为空', trigger: 'blur' }],
        maxLimitDay: [{ required: true, validator: maxLimitChecked, trigger: 'blur' }],
        minLimitHour: [{ required: true, validator: minLimitChecked, trigger: 'blur' }],
        cancelMinute: [{ required: true, validator: cancelMinuteChecked, trigger: 'blur' }],
        condition: [{ required: true, message: '预约条件不能为空', trigger: 'blur' }],
        sms_delay: [{ required: true, validator: smsDelayChecked, trigger: 'blur' }],
        limitType: [{ required: true, validator: limitTypeChecked, trigger: 'blur' }]
      },
      limitType: [
        { value: 'not_open', label: '不开启限制' },
        { value: 'limit_days', label: '天数限制' },
        { value: 'limit_nums', label: '次数限制' }
      ]
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    save () {
      saveSetting(this.form).then((res) => {
        if (res.data.data) {
          this.$message({
            type: 'success',
            message: '保存预约配置成功'
          })
        }
        this.getData()
      })
    },
    getData () {
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
    limitChange () {
      this.form.limit = 0
    }
  }
}
</script>
