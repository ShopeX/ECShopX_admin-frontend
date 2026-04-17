<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="gift-coupon">
    <el-form v-if="!showGiftEdit" ref="form" :rules="rules" :model="form" label-width="140px">
      <el-card shadow="never" :header="$t('81b3322f.6ea1fe')">
        <el-form-item :label="$t('81b3322f.fbaebb')" prop="title">
          <el-input
            v-model="form.title"
            :disabled="form.card_id ? true : false"
            :maxlength="15"
            :placeholder="$t('81b3322f.1f9884')"
            show-word-limit
            style="width: 400px"
          />
        </el-form-item>

        <el-form-item :label="$t('81b3322f.4f8fef')" prop="quantity">
          <el-input
            v-model.number="form.quantity"
            :disabled="form.kq_status === 1 || form.kq_status === 2"
            :placeholder="$t('81b3322f.d86fa9')"
            style="width: 400px"
          >
            <template slot="append"> {{ $t('81b3322f.6499fc') }} </template>
          </el-input>
        </el-form-item>

        <el-form-item :label="$t('81b3322f.13955e')" prop="date_type">
          <el-radio-group v-model="form.date_type" :disabled="form.card_id ? true : false">
            <el-radio label="DATE_TYPE_LONG"> {{ $t('81b3322f.2f28ba') }} </el-radio>
            <!-- <el-radio label="DATE_TYPE_SHORT"> 短期活动 </el-radio> -->
          </el-radio-group>
          <template v-if="form.date_type === 'DATE_TYPE_LONG'">
            <el-form-item
              class="m-b-10"
              label-width="80px"
              :label="$t('81b3322f.592c59')"
              prop="begintime"
            >
              <el-date-picker
                v-model="form.begintime"
                :disabled="form.card_id ? true : false"
                type="datetime"
                :placeholder="$t('81b3322f.a42ae4')"
                value-format="yyyy-MM-dd HH:mm:ss"
                size="small"
              />
              &nbsp;
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('81b3322f.e083ef')"
                placement="top"
              >
                <i class="el-icon-question tooltip" />
              </el-tooltip>
            </el-form-item>
            <el-form-item label-width="80px" :label="$t('81b3322f.9c1b27')" prop="days">
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
                <span style="padding: 0 8px">{{ $t('81b3322f.57f370') }}</span>
                <el-input
                  v-model.number="form.days"
                  style="width: 120px; margin-top: 6px"
                  :disabled="form.card_id ? true : false"
                  size="small"
                >
                  <template slot="append"> {{ $t('81b3322f.249aba') }} </template>
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
                <span style="padding-left: 8px">{{ $t('81b3322f.6f0572') }}</span>
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
          <!-- <template v-else>
            <el-form-item class="m-b-10" label-width="80px" label="发放时间" prop="issuetime">
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
            <el-form-item class="m-b-10" label-width="80px" label="使用时间" prop="usetime">
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
          </template> -->
        </el-form-item>

        <el-form-item :label="$t('81b3322f.f0772c')" prop="description">
          <el-input
            v-model="form.description"
            :disabled="form.kq_status === 1 || form.kq_status === 2"
            required
            :maxlength="300"
            show-word-limit
            type="textarea"
            :rows="6"
            style="width: 400px"
            :placeholder="$t('81b3322f.a11cc7')"
          />
        </el-form-item>

        <!-- <el-form-item label="优惠券主色" prop="color">
          <el-color-picker v-model="form.color" :disabled="form.card_id ? true : false"></el-color-picker>
        </el-form-item> -->
      </el-card>

      <el-card shadow="never" :header="$t('81b3322f.228948')">
        <el-form-item :label="$t('81b3322f.a31bfd')" prop="get_limit">
          <el-input
            v-model.number="form.get_limit"
            :disabled="form.card_id ? true : false"
            style="width: 150px"
          >
            <template slot="append"> {{ $t('81b3322f.6499fc') }} </template>
          </el-input>
          <span class="tips after-tips">{{ $t('81b3322f.727b1d') }}</span>
        </el-form-item>

        <el-form-item :label="$t('81b3322f.466af0')">
          <el-switch
            v-model="form.receive"
            :disabled="form.kq_status === 1 || form.kq_status === 2"
          />
          <span class="tips after-tips">{{ $t('81b3322f.57101c') }}</span>
        </el-form-item>

        <el-form-item :label="$t('81b3322f.b218bc')">
          <el-checkbox-group
            v-model="form.grade_ids"
            class="checkbox"
            :disabled="form.kq_status === 1 || form.kq_status === 2"
          >
            <el-checkbox v-for="grade in memberGrade" :key="grade.grade_id" :label="grade.grade_id">
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
              :key="vipdata.lv_type"
              :label="vipdata.lv_type"
            >
              {{ $t('81b3322f.310f84') }}{{ vipdata.grade_name }}
            </el-checkbox>
          </el-checkbox-group>
          <div class="tips after-tips">{{ $t('81b3322f.632916') }}</div>
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

      <el-card shadow="never" :header="$t('81b3322f.4dccda')">
        <el-form-item :label="$t('81b3322f.764d22')" prop="lock_time">
          <el-input
            v-model.number="form.lock_time"
            :disabled="form.kq_status === 1 || form.kq_status === 2"
            style="width: 100px"
          />&nbsp;{{ $t('81b3322f.2de0d4') }}
          <div class="tips">
            {{ $t('81b3322f.fda2a8') }}
          </div>
        </el-form-item>
      </el-card>

      <div class="content-center">
        <el-button v-if="form.kq_status !== 2" @click="cancelSubmit">
          {{ $t('81b3322f.625fb2') }}
        </el-button>
        <template v-if="form.card_id && form.kq_status === 0">
          <el-button type="danger" @click="editGift(2)"> {{ $t('81b3322f.b15d91') }} </el-button>
          <el-button type="danger" @click="editGift(1)"> {{ $t('81b3322f.8d63ef') }} </el-button>
        </template>
        <template v-if="form.kq_status !== 2">
          <el-button v-if="form.kq_status === 1" type="danger" plain @click="editGift(0)">
            {{ $t('81b3322f.7854b5') }}
          </el-button>
          <el-button v-else v-loading="loading" type="primary" @click="submitForm('form')">
            {{ $t('81b3322f.939d53') }}
          </el-button>
        </template>
      </div>
    </el-form>

    <GiftEdit v-else :list-data="form" @changeShowEdit="changeShowEdit" @submitList="submitGift" />

    <!-- 标签选择器 -->
    <TagSelect v-model="dialogVisible" @selectTags="selectTags" />
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
  data() {
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
      totalDays: [],
      issueTotalDays: [],
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
  computed: {
    rules() {
      const vm = this
      return {
        title: [{ required: true, message: () => vm.$t('81b3322f.2642b9'), trigger: 'blur' }],
        quantity: [{ required: true, validator: vm.checkQuantity, trigger: 'blur' }],
        date_type: [{ required: true, message: () => vm.$t('81b3322f.641268'), trigger: 'blur' }],
        begintime: [{ required: true, message: () => vm.$t('81b3322f.90fae3'), trigger: 'blur' }],
        days: [{ required: true, validator: vm.checkQuantity, trigger: 'blur' }],
        description: [{ required: true, message: () => vm.$t('81b3322f.3408a8'), trigger: 'blur' }],
        lock_time: [{ required: true, validator: vm.checkQuantity, trigger: 'blur' }],
        get_limit: [{ validator: vm.checkNumber, trigger: 'blur' }]
      }
    },
    totalDays() {
      return Array.from({ length: 91 }, (_, i) => ({
        text: i + this.$t('81b3322f.249aba'),
        value: i
      }))
    },
    issueTotalDays() {
      return Array.from({ length: 90 }, (_, i) => ({
        text: i + 1 + this.$t('81b3322f.249aba'),
        value: i + 1
      }))
    }
  },
  async mounted() {
    if (this.$route.query.cardId) {
      this.form.card_id = this.$route.query.cardId
    }
    await Promise.all([this.getGradeList(), this.listVipGrade()])
    await this.init()
  },
  methods: {
    checkNumber(rule, value, callback) {
      if (value === '' || value === null) {
        callback()
      } else {
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error(this.$t('81b3322f.6fb0b9')))
          } else if (value <= 0) {
            callback(new Error(this.$t('81b3322f.cf5fe4')))
          } else {
            callback()
          }
        }, 500)
      }
    },
    checkQuantity(rule, value, callback) {
      if (!value && value !== 0) {
        return callback(new Error(this.$t('81b3322f.281bad')))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error(this.$t('81b3322f.6fb0b9')))
        } else if (value <= 0) {
          callback(new Error(this.$t('81b3322f.cf5fe4')))
        } else {
          callback()
        }
      }, 500)
    },
    toTimeStamp(time) {
      return new Date(time).getTime() / 1000
    },
    toTimeDate(time) {
      return dayjs(time * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
    /** 详情接口可能返回 JSON 字符串，需转为数组才能与勾选框 label 对应 */
    parseJsonIdArray(val) {
      if (val == null || val === '') return []
      if (Array.isArray(val)) return val.slice()
      if (typeof val === 'string') {
        try {
          const parsed = JSON.parse(val)
          return Array.isArray(parsed) ? parsed : []
        } catch (e) {
          return []
        }
      }
      return []
    },
    cancelSubmit() {
      this.$router.go(-1)
    },
    submitForm(formName) {
      if (this.form.days <= 0) {
        this.$message.error(this.$t('81b3322f.ea1a0b'))
        return
      }
      if (typeof this.form.days !== 'number') {
        this.$message.error(this.$t('81b3322f.fde53c'))
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.date_type === 'DATE_TYPE_LONG') {
            this.form.send_begin_time = this.toTimeStamp(this.form.begintime)
            this.form.begin_time = this.form.limit
          }
          // else {
          //   this.form.send_begin_time = this.toTimeStamp(this.form.issuetime[0])
          //   this.form.send_end_time = this.toTimeStamp(this.form.issuetime[1])
          //   this.form.begin_time = this.toTimeStamp(this.form.usetime[0])
          //   this.form.end_time = this.toTimeStamp(this.form.usetime[1])
          // }
          this.submitGift(this.form, 'first')
        } else {
          return false
        }
      })
    },
    changeShowEdit(status) {
      this.showGiftEdit = status
    },
    async submitGift(listData, source) {
      const params = this.params
      Object.keys(params).forEach((key) => {
        params[key] = listData[key]
      })
      params.get_limit = params.get_limit || 1
      params.grade_ids = params.grade_ids?.length > 0 ? JSON.stringify(params.grade_ids) : []
      params.vip_grade_ids =
        params.vip_grade_ids?.length > 0 ? JSON.stringify(params.vip_grade_ids) : []
      console.log(params, 'params参数')
      if (params.card_id) {
        const data = await updateCard(params)
        if (data) {
          this.$message.success(this.$t('81b3322f.55aa63'))
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
          this.$message.success(this.$t('81b3322f.23b62e'))
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
    async getGradeList() {
      const { data } = await getGradeList()
      if (data) {
        this.gradeList = data.data
        this.memberGrade = data.data
      }
    },
    async listVipGrade() {
      const { data } = await listVipGrade()
      if (data) {
        this.vipGrade = data.data
      }
    },
    async init() {
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
        }
        // else {
        //   initData.issuetime = [
        //     this.toTimeDate(initData.send_begin_time),
        //     this.toTimeDate(initData.send_end_time)
        //   ]
        //   initData.usetime = [
        //     this.toTimeDate(initData.begin_time),
        //     this.toTimeDate(initData.end_time)
        //   ]
        // }
        // initData.user_tag_ids = [{tag_id: '142',tag_name:'员工'}]
        const gradeIds = this.parseJsonIdArray(initData.grade_ids).map((id) =>
          Number.isNaN(Number(id)) ? id : Number(id)
        )
        const vipGradeIds = this.parseJsonIdArray(initData.vip_grade_ids).map((id) =>
          id === null || id === undefined ? id : String(id)
        )
        this.form = { ...initData, grade_ids: gradeIds, vip_grade_ids: vipGradeIds }
        Object.keys(this.params).forEach((k) => {
          if (Object.prototype.hasOwnProperty.call(this.form, k)) {
            this.params[k] = this.form[k]
          }
        })
        console.log(this.form, 'this.form初始化')
      }
    },
    // 编辑卡券状态
    editGift(status) {
      const params = this.params
      Object.keys(params).forEach((key) => {
        params[key] = this.form[key]
      })
      params.kq_status = Number(status)
      params.grade_ids = params.grade_ids?.length > 0 ? JSON.stringify(params.grade_ids) : []
      params.vip_grade_ids =
        params.vip_grade_ids?.length > 0 ? JSON.stringify(params.vip_grade_ids) : []
      updateCard(params).then((res) => {
        if (res) {
          this.$message.success(this.$t('81b3322f.55aa63'))
          this.refresh()
          this.$router.go(-1)
        }
      })
    },

    // 添加标签
    selectTags(tagsList) {
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
