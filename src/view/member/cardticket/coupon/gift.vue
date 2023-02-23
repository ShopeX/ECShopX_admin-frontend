<template>
  <div class="gift-coupon">
    <el-form
      v-if="!showGiftEdit"
      ref="form"
      :rules="rules"
      :model="form"
      label-width="140px"
    >
      <el-card
        shadow="never"
        header="基础信息"
      >
        <el-form-item
          label="优惠券名称"
          prop="title"
        >
          <el-input
            v-model="form.title"
            :disabled="form.card_id ? true : false"
            :maxlength="15"
            placeholder="请输入优惠券名称"
            show-word-limit
            style="width: 400px"
          />
        </el-form-item>

        <el-form-item
          label="发放总量"
          prop="quantity"
        >
          <el-input
            v-model.number="form.quantity"
            :disabled="form.kq_status === 1 || form.kq_status === 2"
            placeholder="发放数量需大于0，且为整数"
            style="width: 400px"
          >
            <template slot="append">
              张
            </template>
          </el-input>
        </el-form-item>

        <el-form-item
          label="活动类型"
          prop="date_type"
        >
          <el-radio-group
            v-model="form.date_type"
            :disabled="form.card_id ? true : false"
          >
            <el-radio label="DATE_TYPE_LONG">
              长期活动
            </el-radio>
            <el-radio label="DATE_TYPE_SHORT">
              短期活动
            </el-radio>
          </el-radio-group>
          <template v-if="form.date_type === 'DATE_TYPE_LONG'">
            <el-form-item
              class="m-b-10"
              label-width="80px"
              label="开始时间"
              prop="begintime"
            >
              <el-date-picker
                v-model="form.begintime"
                :disabled="form.card_id ? true : false"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                size="small"
              />
              &nbsp;
              <el-tooltip
                class="item"
                effect="dark"
                content="该时间为活动开始时间点"
                placement="top"
              >
                <i class="el-icon-question tooltip" />
              </el-tooltip>
            </el-form-item>
            <el-form-item
              label-width="80px"
              label="领取"
              prop="days"
            >
              <template>
                <el-select
                  v-model="form.limit"
                  :disabled="form.card_id ? true : false"
                  size="small"
                  style="width: 100px"
                >
                  <el-option
                    v-for="item in totalDays"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  />
                </el-select>
                <span style="padding: 0 8px">后生效，</span>
                <el-input
                  v-model.number="form.days"
                  style="width: 120px; margin-top: 6px"
                  :disabled="form.card_id ? true : false"
                  size="small"
                >
                  <template slot="append">
                    天
                  </template>
                </el-input>
                <!-- <el-select
                  :disabled="form.card_id ? true : false"
                  v-model="form.days"
                  size="small"
                  style="width: 100px"
                >
                  <el-option
                    v-for="item in issueTotalDays"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  ></el-option>
                </el-select> -->
                <span style="padding-left: 8px">内可用</span>
                <!-- <el-input
                  :disabled="form.card_id ? true : false"
                  v-model.number="form.days"
                  style="width: 60px"
                  size="small"
                ></el-input
                >&nbsp;天可用 -->
              </template>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item
              class="m-b-10"
              label-width="80px"
              label="发放时间"
              prop="issuetime"
            >
              <el-date-picker
                v-model="form.issuetime"
                :disabled="form.card_id ? true : false"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                size="small"
              />
            </el-form-item>
            <el-form-item
              class="m-b-10"
              label-width="80px"
              label="使用时间"
              prop="usetime"
            >
              <el-date-picker
                v-model="form.usetime"
                :disabled="form.card_id ? true : false"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                size="small"
              />
            </el-form-item>
          </template>
        </el-form-item>

        <el-form-item
          label="卡券使用说明"
          prop="description"
        >
          <el-input
            v-model="form.description"
            :disabled="form.kq_status === 1 || form.kq_status === 2"
            required
            :maxlength="300"
            show-word-limit
            type="textarea"
            :rows="6"
            style="width: 400px"
            placeholder="请输入内容"
          />
        </el-form-item>

        <!-- <el-form-item label="优惠券主色" prop="color">
          <el-color-picker v-model="form.color" :disabled="form.card_id ? true : false"></el-color-picker>
        </el-form-item> -->
      </el-card>

      <el-card
        shadow="never"
        header="领取和适用规则"
      >
        <el-form-item
          label="领取限制"
          prop="get_limit"
        >
          <el-input
            v-model.number="form.get_limit"
            :disabled="form.card_id ? true : false"
            style="width: 150px"
          >
            <template slot="append">
              张
            </template>
          </el-input>
          <span class="tips after-tips">每个用户领券上限，如不填，则默认为1。</span>
        </el-form-item>

        <el-form-item label="前台直接领取">
          <el-switch
            v-model="form.receive"
            :disabled="form.kq_status === 1 || form.kq_status === 2"
          />
          <span
            class="tips after-tips"
          >默认为开启。开启后用户可在卡券列表中领取，未开启需手动发放。</span>
        </el-form-item>

        <el-form-item label="指定会员可领">
          <el-checkbox-group
            v-model="form.grade_ids"
            class="checkbox"
            :disabled="form.kq_status === 1 || form.kq_status === 2"
          >
            <el-checkbox
              v-for="grade in memberGrade"
              :key="grade.grade_id"
              :label="grade.grade_id"
            >
              {{ grade.grade_name }}
            </el-checkbox>
          </el-checkbox-group>
          <el-checkbox-group
            v-model="form.vip_grade_ids"
            class="checkbox"
            :disabled="form.kq_status === 1 || form.kq_status === 2"
          >
            <el-checkbox
              v-for="vipdata in vipGrade"
              :key="vipdata.vip_grade_id"
              :label="vipdata.vip_grade_id"
            >
              付费{{ vipdata.grade_name }}
            </el-checkbox>
          </el-checkbox-group>
          <div class="tips after-tips">
            未选默认所有会员适用
          </div>
        </el-form-item>

        <!-- <el-form-item label="指定会员标签可领">
          <el-tag
            class="tag-list"
            v-for="item in tagsList"
            :key="item.tag_id"
            :type="item.type"
            effect="dark"
          >
            {{ item.tag_name }}
          </el-tag>
          <el-button
            :disabled="form.kq_status === 1 || form.kq_status === 2"
            class="button-new-tag"
            size="small"
            @click="dialogVisible = true"
          >
            +
          </el-button>
        </el-form-item> -->
      </el-card>

      <el-card
        shadow="never"
        header="兑换规则"
      >
        <el-form-item
          label="选定商品锁定时间"
          prop="lock_time"
        >
          <el-input
            v-model.number="form.lock_time"
            :disabled="form.kq_status === 1 || form.kq_status === 2"
            style="width: 100px"
          />&nbsp;小时
          <div class="tips">
            消费者使用兑换券选定商品后，为避免到店后无兑换商品，则该商品对应库存锁定时间，时间需大于0，且为整数
          </div>
        </el-form-item>
      </el-card>

      <div class="content-center">
        <el-button
          v-if="form.kq_status !== 2"
          @click="cancelSubmit"
        >
          取消
        </el-button>
        <template v-if="form.card_id && form.kq_status === 0">
          <el-button
            type="danger"
            @click="editGift(2)"
          >
            关闭
          </el-button>
          <el-button
            type="danger"
            @click="editGift(1)"
          >
            暂停
          </el-button>
        </template>
        <template v-if="form.kq_status !== 2">
          <el-button
            v-if="form.kq_status === 1"
            type="danger"
            plain
            @click="editGift(0)"
          >
            启用
          </el-button>
          <el-button
            v-else
            v-loading="loading"
            type="primary"
            @click="submitForm('form')"
          >
            提交
          </el-button>
        </template>
      </div>
    </el-form>

    <GiftEdit
      v-else
      :list-data="form"
      @changeShowEdit="changeShowEdit"
      @submitList="submitGift"
    />

    <!-- 标签选择器 -->
    <TagSelect
      v-model="dialogVisible"
      @selectTags="selectTags"
    />
  </div>
</template>

<script>
import GiftEdit from './giftEdit.vue'
import TagSelect from '@/components/tagselect/index.vue'
import { getGradeList } from '@/api/membercard'
import { listVipGrade } from '@/api/cardticket'
import { getCardDetail, updateCard, creatCard } from '@/api/cardticket'
import dayjs from 'dayjs'
export default {
  inject: ['refresh'],
  components: {
    GiftEdit,
    TagSelect
  },
  data () {
    function getTempDays (start = 0) {
      let tempDays = []
      for (let i = start; i <= 90; i++) {
        tempDays.push({ text: i + '天', value: i })
      }
      return tempDays
    }
    const checkNumber = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback()
      } else {
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'))
          } else {
            if (value <= 0) {
              callback(new Error('必须大于0'))
            } else {
              callback()
            }
          }
        }, 500)
      }
    }
    const checkQuantity = (rule, value, callback) => {
      if (!value && value !== 0) {
        return callback(new Error('不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value <= 0) {
            callback(new Error('必须大于0'))
          } else {
            callback()
          }
        }
      }, 500)
    }
    const params = {
      card_id: null,
      card_type: 'new_gift',
      color: '#000000',
      title: '',
      description: '',
      quantity: null,
      date_type: 'DATE_TYPE_LONG', // 时间类型[DATE_TYPE_LONG: 长期活动 DATE_TYPE_SHORT: 短期活动]
      send_begin_time: null,
      send_end_time: null,
      begin_time: null,
      days: 1,
      end_time: null,
      get_limit: null,
      receive: true,
      limit: 0,
      lock_time: null,
      kq_status: 0, // 卡券状态 0:正常 1:暂停 2:关闭
      distributor_ids: [],
      items: [],
      grade_ids: [],
      vip_grade_ids: []
    }
    return {
      form: Object.assign({}, params),
      params,
      rules: {
        title: [{ required: true, message: '请填写优惠券名称', trigger: 'blur' }],
        quantity: [{ required: true, validator: checkQuantity, trigger: 'blur' }],
        date_type: [{ required: true, message: '请选择活动类型', trigger: 'blur' }],
        begintime: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        issuetime: [{ required: true, message: '请选择发放时间', trigger: 'blur' }],
        usetime: [{ required: true, message: '请选择使用时间', trigger: 'blur' }],
        days: [{ required: true, validator: checkQuantity, trigger: 'blur' }],
        description: [{ required: true, message: '请填写卡券使用说明', trigger: 'blur' }],
        // color: [{ required: true, message: '请选择优惠券主色', trigger: 'blur' }],
        lock_time: [{ required: true, validator: checkQuantity, trigger: 'blur' }],
        get_limit: [{ validator: checkNumber, trigger: 'blur' }]
      },
      totalDays: getTempDays(),
      issueTotalDays: getTempDays(1),
      loading: false,
      showGiftEdit: false,
      gradeList: [],
      dialogVisible: false,
      tagsList: [],

      validGrade: [],
      memberGrade: [],
      vipGrade: []
    }
  },
  mounted () {
    if (this.$route.query.cardId) {
      this.form.card_id = this.$route.query.cardId
    }
    this.getGradeList()
    this.listVipGrade()
    this.init()
  },
  methods: {
    toTimeStamp (time) {
      return new Date(time).getTime() / 1000
    },
    toTimeDate (time) {
      return dayjs(time * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
    cancelSubmit () {
      this.$router.go(-1)
    },
    submitForm (formName) {
      if (this.form.days <= 0) {
        this.$message.error('有效天数必须大于0')
        return
      }
      if (typeof this.form.days !== 'number') {
        this.$message.error('请输入有效的数字')
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.date_type === 'DATE_TYPE_LONG') {
            this.form.send_begin_time = this.toTimeStamp(this.form.begintime)
            this.form.begin_time = this.form.limit
          } else {
            this.form.send_begin_time = this.toTimeStamp(this.form.issuetime[0])
            this.form.send_end_time = this.toTimeStamp(this.form.issuetime[1])
            this.form.begin_time = this.toTimeStamp(this.form.usetime[0])
            this.form.end_time = this.toTimeStamp(this.form.usetime[1])
          }
          this.submitGift(this.form, 'first')
        } else {
          return false
        }
      })
    },
    changeShowEdit (status) {
      this.showGiftEdit = status
    },
    async submitGift (listData, source) {
      const params = this.params
      Object.keys(params).forEach((key) => {
        params[key] = listData[key]
      })
      params.get_limit = params.get_limit || 1
      params.grade_ids = JSON.stringify(params.grade_ids)
      params.vip_grade_ids = JSON.stringify(params.vip_grade_ids)
      console.log(params, 'params参数')
      if (params.card_id) {
        const data = await updateCard(params)
        if (data) {
          this.$message.success('更新成功')
          if (source === 'first') {
            this.showGiftEdit = true
          } else {
            this.refresh()
            this.$router.go(-1)
          }
        }
      } else {
        const { data } = await creatCard(params)
        if (data) {
          this.params.card_id = data.data.status.card_id
          this.form = data.data.status
          this.$message.success('提交成功')
          if (source === 'first') {
            this.showGiftEdit = true
            this.$emit('haddleShowTab', false)
          } else {
            this.refresh()
            this.$router.go(-1)
          }
        }
      }
    },
    async getGradeList () {
      const { data } = await getGradeList()
      if (data) {
        this.gradeList = data.data
        this.memberGrade = data.data
      }
    },
    async listVipGrade () {
      const { data } = await listVipGrade()
      if (data) {
        this.vipGrade = data.data
      }
    },
    async init () {
      if (this.form.card_id) {
        const { data } = await getCardDetail({ card_id: this.form.card_id })
        let initData = data.data
        initData.kq_status = Number(initData.kq_status)
        initData.quantity = Number(initData.quantity)
        initData.lock_time = Number(initData.lock_time)
        initData.get_limit = Number(initData.get_limit)
        if (initData.date_type === 'DATE_TYPE_LONG') {
          initData.begintime = this.toTimeDate(initData.send_begin_time)
          initData.limit = initData.begin_time
        } else {
          initData.issuetime = [
            this.toTimeDate(initData.send_begin_time),
            this.toTimeDate(initData.send_end_time)
          ]
          initData.usetime = [
            this.toTimeDate(initData.begin_time),
            this.toTimeDate(initData.end_time)
          ]
        }
        // initData.user_tag_ids = [{tag_id: '142',tag_name:'员工'}]
        this.form = initData
        console.log(this.form, 'this.form初始化')
      }
    },
    // 编辑卡券状态
    editGift (status) {
      const params = this.params
      Object.keys(params).forEach((key) => {
        params[key] = this.form[key]
      })
      params.kq_status = Number(status)
      params.grade_ids = JSON.stringify(params.grade_ids)
      params.vip_grade_ids = JSON.stringify(params.vip_grade_ids)
      updateCard(params).then((res) => {
        if (res) {
          this.$message.success('更新成功')
          this.refresh()
          this.$router.go(-1)
        }
      })
    },

    // 添加标签
    selectTags (tagsList) {
      console.log(tagsList, 'tagsList提交的标签')
      this.tagsList = tagsList
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.m-b-10 {
  margin-bottom: 12px;
}
.gift-coupon {
  padding-bottom: 20px;
}
.tips {
  font-size: 12px;
  color: #7f7f7f;
}
.after-tips {
  margin-left: 10px;
}
.tooltip {
  color: #999;
  font-size: 16px;
  cursor: pointer;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.tag-list {
  margin-right: 10px;
}
.checkbox {
  display: inline-block;
  margin-right: 30px;
}
</style>
