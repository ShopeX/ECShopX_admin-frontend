<template>
  <el-form
    ref="form"
    :model="form"
    class="box-set"
    label-width="120px"
  >
    <el-card
      header="指定日期额外积分"
      shadow="naver"
    >
      <el-form-item
        label="活动名称"
        prop="title"
        :rules="{ required: true, message: '活动名称必填', trigger: 'blur' }"
      >
        <el-col :span="8">
          <el-input
            v-model="form.title"
            :disabled="hasSaveButton ? false : true"
            :maxlength="30"
            placeholder="请输入活动名称"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="活动时间">
        <el-date-picker
          v-model="activity_date"
          type="datetimerange"
          align="right"
          value-format="yyyy-MM-dd HH:mm:ss"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :disabled="!hasSaveButton || form.is_forever ? true : false"
          :default-time="['00:00:00', '23:59:59']"
          :picker-options="pickerOptions2"
        />
        &nbsp;&nbsp;&nbsp;
        <el-checkbox v-model="form.is_forever">
          长期有效
        </el-checkbox>
      </el-form-item>
      <el-form-item label="日期">
        <el-radio-group
          v-model="condition"
          :disabled="hasSaveButton ? false : true"
        >
          <el-radio label="every_year">
            每年
          </el-radio>
          <el-radio label="every_month">
            每月
          </el-radio>
          <el-radio label="every_week">
            每周
          </el-radio>
          <el-radio label="date">
            指定日期
          </el-radio>
        </el-radio-group>
        <transition name="el-fade-in-linear">
          <div v-if="condition === 'every_year'">
            <el-select
              v-model="memberDay.month"
              placeholder="请选择月份"
            >
              <el-option
                v-for="item in monthOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select
              v-model="memberDay.day"
              placeholder="请选择日期"
            >
              <el-option
                v-for="item in dayOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div v-if="condition === 'every_month'">
            <el-select
              v-model="memberDay.day"
              placeholder="请选择日期"
            >
              <el-option
                v-for="item in dayOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div v-if="condition === 'every_week'">
            <el-select
              v-model="memberDay.week"
              placeholder="请选择星期"
            >
              <el-option
                v-for="item in weekOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div
            v-if="condition === 'date'"
            style="width: 350px"
          >
            <el-date-picker
              v-model="memberDay.date"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 100%"
              value-format="yyyy-MM-dd"
              @change="dateChange"
            />
          </div>
        </transition>
      </el-form-item>
      <el-form-item
        label="积分倍数"
        prop="condition_value"
        :rules="{ required: true, message: '升值倍数必填', trigger: 'blur' }"
      >
        活动期内，到账积分为获得基础积分的
        <el-input
          v-model="form.condition_value"
          type="number"
          :maxlength="30"
          placeholder="请输入升值倍数"
          style="width: 150px"
          :min="1"
          :disabled="hasSaveButton ? false : true"
        />
        倍
        <!-- （基础积分+（N-1）倍基础积分） -->
      </el-form-item>

      <el-form-item label="类型">
        <el-radio-group v-model="condition_type">
          <el-radio label="multiple">
            倍数
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="满足条件">
        <el-radio-group
          v-model="has_trigger_amount"
          :disabled="hasSaveButton ? false : true"
        >
          <el-radio label="1">
            是
          </el-radio>
          <el-radio label="0">
            否
          </el-radio>
        </el-radio-group>
        <p
          v-if="has_trigger_amount == '1'"
          class="frm-tips"
        >
          订单金额满
          <el-input
            v-model="form.trigger_amount"
            type="number"
            :maxlength="30"
            style="width: 150px"
            :min="0"
            :disabled="hasSaveButton ? false : true"
          />
          元时，可享受该活动（不含运费）
        </p>
      </el-form-item>

      <el-form-item label="适用会员">
        <el-checkbox-group
          v-model="form.valid_grade"
          :disabled="hasSaveButton ? false : true"
        >
          <el-checkbox
            v-for="grade in memberGrade"
            :key="grade.grade_id"
            :label="grade.grade_id"
          >
            {{ grade.grade_name }}
          </el-checkbox>
          <el-checkbox
            v-for="vipdata in vipGrade"
            :key="vipdata.lv_type"
            :label="vipdata.lv_type"
          >
            付费{{ vipdata.grade_name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="店铺选择">
        <el-radio-group
          v-model="form.use_shop"
          :disabled="hasSaveButton ? false : true"
        >
          <el-radio label="0">
            全店铺适用
          </el-radio>
          <el-radio label="1">
            指定店铺适用
          </el-radio>
        </el-radio-group>
        <el-card
          v-if="form.use_shop == '1'"
          header="绑定店铺"
          shadow="naver"
        >
          <el-button
            type="primary"
            @click="relStoresClick"
          >
            选择店铺
          </el-button>
          <el-table
            v-if="relStores.length > 0"
            :data="relStores"
            style="line-height: normal"
          >
            <el-table-column
              label="ID"
              prop="distributor_id"
              width="60"
            />
            <el-table-column
              label="名称"
              prop="name"
            />
            <el-table-column
              prop="address"
              label="地址"
              show-overflow-tooltip
            />
            <el-table-column
              label="操作"
              width="50"
            >
              <template slot-scope="scope">
                <i
                  class="iconfont icon-trash-alt"
                  @click="deleteStoreRow(scope.$index, form.items)"
                />
              </template>
            </el-table-column>
          </el-table>
          <StoreSelect
            :store-visible="storeVisible"
            :is-valid="true"
            :rel-shop-ids="relStores"
            :get-status="setStatus"
            @chooseStore="chooseStoreAction"
            @closeStoreDialog="closeStoreDialogAction"
          />
        </el-card>
      </el-form-item>
    </el-card>
    <div class="content-center">
      <el-button @click.native="handleCancel">
        返回
      </el-button>
      <el-button
        v-if="hasSaveButton"
        type="primary"
        @click="submitActivityAction()"
      >
        保存
      </el-button>
    </div>
  </el-form>
</template>

<script>
import { createExtrapoint, getExtrapointInfo, updateExtrapoint } from '../../../../api/promotions'
import imgPicker from '@/components/imageselect'
import imgBox from '@/components/element/imgBox'
import { listVipGrade } from '../../../../api/cardticket'
import { getGradeList } from '../../../../api/membercard'
import StoreSelect from '@/components/storeListSelect'

export default {
  inject: ['refresh'],
  components: {
    imgBox,
    StoreSelect
  },
  data () {
    return {
      pickerOptions2: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              end.setHours(23, 59, 59, 0)
              const start = new Date()
              start.setHours(0, 0, 0, 0)
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              end.setHours(23, 59, 59, 0)
              const start = new Date()
              start.setHours(0, 0, 0, 0)
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              end.setHours(23, 59, 59, 0)
              const start = new Date()
              start.setHours(0, 0, 0, 0)
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      used_scene: {
        '1': '订单抵扣'
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
        // upvaluation: '',
        condition_value: '',
        valid_grade: [],
        trigger_amount: '',
        shop_ids: [],
        condition_type: 'multiple',
        use_shop: '0'
      },
      activity_date: '',
      imgDialog: false,
      condition_type: 'multiple',
      has_trigger_amount: '0',
      use_shop: '0',
      relStores: [],
      is_distributor: false,
      setStatus: false,
      storeVisible: false,
      hasSaveButton: true
    }
  },
  watch: {
    relStores (val) {
      if (val) {
        // this.form.use_shop = val.length > 0 ? 1 : 0
      }
    }
  },
  mounted () {
    function filter (val) {
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
    if (this.$route.query.isnodata) {
      this.hasSaveButton = false
    }
  },
  methods: {
    dateChange (val) {
      console.log(val)
      this.memberDay.date = val
    },
    submitActivityAction () {
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
      this.form.shop_ids = []
      if (this.form.use_shop == '1' && this.relStores && this.relStores.length > 0) {
        this.relStores.forEach((item) => {
          this.form.shop_ids.push(item.distributor_id)
        })
      }

      if (this.has_trigger_amount == '0') {
        this.form.trigger_amount = 0
      }

      let params = JSON.stringify(this.form)
      params = JSON.parse(params)
      params.items = JSON.stringify(params.items)
      params.item_category = JSON.stringify(params.item_category)
      if (this.form.activity_id) {
        updateExtrapoint(params).then((res) => {
          if (res.data.data.activity_id) {
            this.loading = false
            this.$message({
              message: '更新成功',
              type: 'success',
              duration: 2 * 1000,
              onClose () {
                that.refresh()
                that.$router.push({
                  path: '/marketing/member/extrapoint'
                })
              }
            })
          } else {
            this.$message.error('保存失败!')
            return false
          }
        })
      } else {
        createExtrapoint(params).then((res) => {
          if (res.data.data.activity_id) {
            this.loading = false
            this.$message({
              message: '添加成功',
              type: 'success',
              duration: 2 * 1000,
              onClose () {
                that.refresh()
                that.$router.push({
                  path: '/marketing/member/extrapoint'
                })
              }
            })
          } else {
            this.$message.error('保存失败!')
            return false
          }
        })
      }
    },
    getTaskTime (strDate) {
      let date = new Date(strDate)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let str = y + '-' + m + '-' + d
      return str
    },
    getActivityDetail (id) {
      getExtrapointInfo(id).then((res) => {
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
          is_forever: response.is_forever,
          condition_value: response.condition_value,
          trigger_amount: response.trigger_condition.trigger_amount,
          use_shop: response.use_shop
        }
        if (typeof response.trigger_condition.trigger_amount == 'undefined') {
          this.has_trigger_amount = '0'
        } else {
          this.has_trigger_amount = '1'
        }
        Object.assign(this.form, data)
        const trigger_time = response.trigger_condition.trigger_time
        this.activity_date = [response.begin_time, response.end_time]
        this.condition = trigger_time.type
        this.memberDay.day = Number(trigger_time.day || 1)
        this.memberDay.month = Number(trigger_time.month || 1)
        this.memberDay.week = Number(trigger_time.week || 1)
        this.memberDay.date = [trigger_time.begin_time || '', trigger_time.end_time || '']
        this.relStores = response.storeLists || []
        // const { begin_date, end_date } = trigger_time
        // this.memberDay.date = [begin_date || '', end_date || '']
        console.log(this.memberDay, 1)
      })
    },
    formatDate (type, num) {
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
    },

    relStoresClick () {
      this.storeVisible = true
      this.setStatus = true
    },
    chooseStoreAction (data) {
      this.storeVisible = false
      this.form.shop_ids = []
      if (data === null || data.length <= 0) return
      this.relStores = data
    },
    closeStoreDialogAction () {
      this.storeVisible = false
    },
    deleteStoreRow (index) {
      this.setStatus = false
      this.relStores.splice(index, 1)
    }
  }
}
</script>
