<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <el-form ref="form" :model="form" class="box-set" label-width="120px">
      <el-card :header="$t('c9c68157.191931')" shadow="naver">
        <el-form-item :label="$t('c9c68157.39834b')" prop="title" :rules="titleRules">
          <el-col :span="8">
            <el-input v-model="form.title" :maxlength="30" :placeholder="$t('c9c68157.7528b3')" />
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('c9c68157.c799f5')">
          <el-date-picker
            v-model="activity_date"
            type="datetimerange"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"
            unlink-panels
            :range-separator="$t('c9c68157.981cbe')"
            :start-placeholder="$t('c9c68157.b44c0f')"
            :end-placeholder="$t('c9c68157.1d468b')"
            :disabled="form.is_forever"
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="pickerOptions2"
          />
          &nbsp;&nbsp;&nbsp;
          <el-checkbox v-model="form.is_forever"> {{ $t('c9c68157.1c5029') }} </el-checkbox>
        </el-form-item>
        <el-form-item :label="$t('c9c68157.4ff1e7')">
          <el-radio-group v-model="condition">
            <el-radio label="every_year"> {{ $t('c9c68157.281cd3') }} </el-radio>
            <el-radio label="every_month"> {{ $t('c9c68157.aa3d57') }} </el-radio>
            <el-radio label="every_week"> {{ $t('c9c68157.09b03b') }} </el-radio>
            <el-radio label="date"> {{ $t('c9c68157.07dc14') }} </el-radio>
          </el-radio-group>
          <transition name="el-fade-in-linear">
            <div v-if="condition === 'every_year'">
              <el-select v-model="memberDay.month" :placeholder="$t('c9c68157.904393')">
                <el-option
                  v-for="item in monthOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select v-model="memberDay.day" :placeholder="$t('c9c68157.aa2fb1')">
                <el-option
                  v-for="item in dayOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div v-if="condition === 'every_month'">
              <el-select v-model="memberDay.day" :placeholder="$t('c9c68157.aa2fb1')">
                <el-option
                  v-for="item in dayOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div v-if="condition === 'every_week'">
              <el-select v-model="memberDay.week" :placeholder="$t('c9c68157.2b40fa')">
                <el-option
                  v-for="item in weekOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div v-if="condition === 'date'" style="width: 350px">
              <el-date-picker
                v-model="memberDay.date"
                type="daterange"
                align="right"
                unlink-panels
                :range-separator="$t('c9c68157.981cbe')"
                :start-placeholder="$t('c9c68157.b44c0f')"
                :end-placeholder="$t('c9c68157.1d468b')"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                @change="dateChange"
              />
            </div>
          </transition>
        </el-form-item>
        <el-form-item :label="$t('c9c68157.e79791')" prop="upvaluation" :rules="upvaluationRules">
          {{ $t('c9c68157.158fe0') }}
          <el-input
            v-model="form.upvaluation"
            :maxlength="30"
            :placeholder="$t('c9c68157.2f5765')"
            style="width: 150px"
          />
          {{ $t('c9c68157.a9071b') }}
        </el-form-item>
        <el-form-item :label="$t('c9c68157.9fd68c')">
          {{ $t('c9c68157.a4fbed') }}
          <el-input
            v-model="form.max_up_point"
            type="number"
            placeholder=""
            style="width: 150px"
            :min="1"
            :max="9999999"
          />
          {{ $t('c9c68157.548c7a') }}
          <div style="font-size: 12px; color: #999">
            {{ $t('c9c68157.bf5f46') }}
          </div>
        </el-form-item>
        <el-form-item :label="$t('c9c68157.6dbb6f')">
          <el-checkbox-group v-model="form.valid_grade">
            <el-checkbox v-for="grade in memberGrade" :key="grade.grade_id" :label="grade.grade_id">
              {{ grade.grade_name }}
            </el-checkbox>
            <el-checkbox
              v-for="vipdata in vipGrade"
              :key="vipdata.lv_type"
              :label="vipdata.lv_type"
            >
              {{ $t('c9c68157.310f84') }}{{ vipdata.grade_name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('c9c68157.3dbf0c')">
          <el-checkbox-group v-model="form.used_scene">
            <el-checkbox v-for="(value, key) in used_sceneI18n" :key="key" :label="key">
              {{ value }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-card>
    </el-form>

    <template slot="page-footer">
      <div class="text-center">
        <el-button @click.native="handleCancel"> {{ $t('c9c68157.5f4112') }} </el-button>
        <el-button type="primary" @click="submitActivityAction()">
          {{ $t('c9c68157.be5fbb') }}
        </el-button>
      </div>
    </template>
  </SpPage>
</template>

<script>
import {
  createPointupvaluation,
  getPointupvaluationInfo,
  updatePointupvaluation
} from '../../../../api/promotions'
import imgPicker from '@/components/imageselect'
import imgBox from '@/components/element/imgBox'
import { listVipGrade } from '../../../../api/cardticket'
import { getGradeList } from '../../../../api/membercard'

export default {
  inject: ['refresh'],
  components: {
    imgBox
  },
  data() {
    return {
      used_scene: {
        1: '订单抵扣'
      },
      level: 0,
      levelData: [],
      monthOptions: [],
      weekOptions: [],
      dayOptions: [],
      memberDay: {
        month: '',
        week: '',
        day: '',
        begin_time: '',
        end_time: '',
        date: []
      },
      submitLoading: false,
      condition: '',
      vipGrade: [],
      memberGrade: [],
      form: {
        activity_id: '',
        title: '',
        trigger_condition: [],
        begin_time: '',
        end_time: '',
        is_forever: false,
        upvaluation: '',
        max_up_point: '',
        valid_grade: [],
        used_scene: ['1']
      },
      activity_date: '',
      imgDialog: false
    }
  },
  computed: {
    titleRules() {
      return [{ required: true, message: this.$t('c9c68157.813065'), trigger: 'blur' }]
    },
    upvaluationRules() {
      return [{ required: true, message: this.$t('c9c68157.5a7056'), trigger: 'blur' }]
    },
    used_sceneI18n() {
      return { 1: this.$t('c9c68157.5b83c1') }
    },
    pickerOptions2() {
      return {
        shortcuts: [
          {
            text: this.$t('c9c68157.56ee10'),
            onClick(picker) {
              const end = new Date()
              end.setHours(23, 59, 59, 0)
              const start = new Date()
              start.setHours(0, 0, 0, 0)
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: this.$t('c9c68157.335dfc'),
            onClick(picker) {
              const end = new Date()
              end.setHours(23, 59, 59, 0)
              const start = new Date()
              start.setHours(0, 0, 0, 0)
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: this.$t('c9c68157.d96eb4'),
            onClick(picker) {
              const end = new Date()
              end.setHours(23, 59, 59, 0)
              const start = new Date()
              start.setHours(0, 0, 0, 0)
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  mounted() {
    function filter(val) {
      var x = ''
      switch (val) {
        case 1:
          x = '一'
          break
        case 2:
          x = '二'
          break
        case 3:
          x = '三'
          break
        case 4:
          x = '四'
          break
        case 5:
          x = '五'
          break
        case 6:
          x = '六'
          break
        case 7:
          x = '日'
          break
      }
      return x
    }
    var month = [],
      week = [],
      day = []
    for (var i = 0; i < 12; i++) {
      let obj = {}
      obj.value = i + 1
      obj.label = obj.value + '月'
      month.push(obj)
    }
    for (var i = 0; i < 7; i++) {
      let obj = {}
      obj.value = i + 1
      obj.label = '星期' + filter(obj.value)
      week.push(obj)
    }
    for (var i = 0; i < 31; i++) {
      let obj = {}
      obj.value = i + 1
      obj.label = obj.value + '日'
      day.push(obj)
    }
    this.monthOptions = month
    this.weekOptions = week
    this.dayOptions = day
    console.log(this.dayOptions)
    listVipGrade().then((response) => {
      if (response != undefined && response.data.data && response.data.data.length > 0) {
        this.vipGrade = response.data.data
      }
    })

    getGradeList().then((response) => {
      if (response != undefined && response.data.data && response.data.data.length > 0) {
        var result = response.data.data
        if (result) {
          this.memberGrade = result
        }
      }
    })
    if (this.$route.params.id) {
      this.getActivityDetail(this.$route.params.id)
    }
  },
  methods: {
    dateChange(val) {
      console.log(val)
      this.memberDay.date = val
    },
    submitActivityAction() {
      const that = this
      let date_start_time = ''
      let date_end_time = ''
      if (this.memberDay.date.length > 0) {
        date_start_time = this.memberDay.date[0]
        date_end_time = this.memberDay.date[1]
      }
      let obj = {
        type: this.condition,
        month: this.memberDay.month,
        week: this.memberDay.week,
        day: this.memberDay.day,
        begin_time: date_start_time,
        end_time: date_end_time
      }
      this.form.trigger_condition = { trigger_time: obj }

      if (this.activity_date.length > 0) {
        this.form.begin_time = this.activity_date[0]
        this.form.end_time = this.activity_date[1]
      }
      let params = JSON.stringify(this.form)
      params = JSON.parse(params)
      params.items = JSON.stringify(params.items)
      params.item_category = JSON.stringify(params.item_category)
      if (this.form.activity_id) {
        updatePointupvaluation(params).then((res) => {
          if (res.data.data.activity_id) {
            this.loading = false
            this.$message({
              message: this.$t('c9c68157.55aa63'),
              type: 'success',
              duration: 2 * 1000,
              onClose() {
                that.refresh()
                that.$router.go(-1)
              }
            })
          } else {
            this.$message.error(this.$t('c9c68157.73b0d9'))
            return false
          }
        })
      } else {
        createPointupvaluation(params).then((res) => {
          if (res.data.data.activity_id) {
            this.loading = false
            this.$message({
              message: this.$t('c9c68157.3fdaea'),
              type: 'success',
              duration: 2 * 1000,
              onClose() {
                that.refresh()
                that.$router.go(-1)
              }
            })
          } else {
            this.$message.error(this.$t('c9c68157.73b0d9'))
            return false
          }
        })
      }
    },
    getTaskTime(strDate) {
      let date = new Date(strDate)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let str = y + '-' + m + '-' + d
      return str
    },
    getActivityDetail(id) {
      getPointupvaluationInfo({ activity_id: id }).then((res) => {
        let response = res.data.data
        let data = {
          activity_id: response.activity_id,
          title: response.title,
          trigger_condition: response.trigger_condition,
          begin_time: response.begin_time,
          end_time: response.end_time,
          upvaluation: response.upvaluation,
          max_up_point: response.max_up_point,
          valid_grade: response.valid_grade,
          used_scene: response.used_scene,
          is_forever: response.is_forever
        }
        Object.assign(this.form, data)
        const trigger_time = response.trigger_condition.trigger_time
        this.activity_date = [response.begin_date, response.end_date]
        this.condition = trigger_time.type
        this.memberDay.day = Number(trigger_time.day || 1)
        this.memberDay.month = Number(trigger_time.month || 1)
        this.memberDay.week = Number(trigger_time.week || 1)
        const { begin_date, end_date } = trigger_time
        this.memberDay.date = [begin_date || '', end_date || '']
        console.log(this.memberDay, 1)
      })
    },
    formatDate(type, num) {
      const newNum = Number(num) || 1
      const weeks = ['一', '二', '三', '四', '五', '六', '日']
      console.log(weeks[newNum])
      const returnType = {
        week: `星期${weeks[newNum - 1]}`,
        month: `${newNum}月`,
        day: `${newNum}日`
      }
      return returnType[type]
    },
    handleCancel: function () {
      this.$router.go(-1)
    }
  }
}
</script>
