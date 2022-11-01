<template lang="html">
  <section class="section section-white">
    <div class="section-header with-border">
      <div class="section-title">
        创建营销活动
      </div>
    </div>
    <div class="content-padded">
      <el-form
        ref="form"
        :model="form"
        label-width="180px"
      >
        <el-form-item label="活动名称">
          <el-row>
            <el-col :span="8">
              <el-input v-model="form.title" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker
            v-model="date"
            type="daterange"
            align="right"
            value-format="timestamp"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :disabled="form.is_forever"
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="pickerOptions2"
          />
          &nbsp;&nbsp;&nbsp;
          <el-checkbox v-model="form.is_forever">
            长期有效
          </el-checkbox>
        </el-form-item>
        <el-form-item label="赠送方式">
          <el-radio-group
            v-if="form.activity_type === 'member_birthday'"
            v-model="condition"
          >
            <el-radio label="birthday_month">
              生日当月1日统一发放
            </el-radio>
            <el-radio label="birthday_week">
              生日当周周日统一发放
            </el-radio>
            <el-radio label="birthday_day">
              生日当日统一发放
            </el-radio>
          </el-radio-group>
          <el-radio
            v-if="form.activity_type === 'member_upgrade'"
            v-model="condition"
            label="member_upgrade"
          >
            会员升级成功后发放
          </el-radio>
          <el-radio
            v-if="form.activity_type === 'member_vip_upgrade'"
            v-model="condition"
            label="member_vip_upgrade"
          >
            付费会员升级成功后发放
          </el-radio>
          <el-radio-group
            v-if="form.activity_type === 'member_anniversary'"
            v-model="condition"
          >
            <el-radio label="anniversary_month">
              周年入会当月1日统一发放
            </el-radio>
            <el-radio label="anniversary_week">
              周年入会当周周日统一发放
            </el-radio>
            <el-radio label="anniversary_day">
              周年入会当日统一发放
            </el-radio>
          </el-radio-group>
          <el-radio-group
            v-if="form.activity_type === 'member_day'"
            v-model="condition"
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
          </transition>
        </el-form-item>
        <el-form-item
          v-for="levelItem in levelData"
          :key="levelItem.grade_id"
          :label="levelItem.grade_name + '优惠设置'"
        >
          <el-row :gutter="20">
            <el-col
              v-for="item in coupons"
              v-if="levelItem.grade_id === item.id"
              :key="item.index"
              :span="8"
            >
              <div class="promotion-card">
                <div class="promotion-card-header">
                  优惠券
                  <a
                    class="promotion-card-btn"
                    href="#"
                    @click="showModal('coupons', item.id)"
                  >新增</a>
                </div>
                <div class="promotion-card-body">
                  <ul class="promotion-card-list">
                    <li
                      v-for="(child, index) in item.checked"
                      :key="index"
                    >
                      <div class="promotion-name">
                        {{ child.title }}
                      </div>
                      <el-input-number
                        v-model="child.count"
                        size="mini"
                        controls-position="right"
                        :min="1"
                        :max="10"
                        label="描述文字"
                      />
                      <i
                        class="remove-btn el-icon-delete"
                        @click="removeChecked('coupons', index, item.id)"
                      />
                    </li>
                  </ul>
                </div>
              </div>
            </el-col>
            <el-col
              v-for="item in goods"
              v-if="levelItem.grade_id === item.id"
              :key="item.index"
              :span="8"
            >
              <!-- <div class="promotion-card">
                <div class="promotion-card-header">
                  商品
                  <a class="promotion-card-btn" @click="showModal('goods', item.id)" href="#"
                    >新增</a
                  >
                </div>
                <div class="promotion-card-body">
                  <ul class="promotion-card-list">
                    <li v-for="(child, index) in item.checked" :key="index">
                      <div class="promotion-name">
                        {{ child.itemName }}
                      </div>
                      <el-input-number
                        size="mini"
                        controls-position="right"
                        v-model="child.count"
                        :min="1"
                        :max="10"
                        label="描述文字"
                      ></el-input-number>
                      <i
                        class="remove-btn el-icon-delete"
                        @click="removeChecked('goods', index, item.id)"
                      ></i>
                    </li>
                  </ul>
                </div>
              </div> -->
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="短信通知">
          <div class="content-bottom-padded">
            <el-switch v-model="form.sms_isopen" />
            请确保短信账户余额充足
            <router-link
              :to="{ path: matchInternalRoute('datamessage') }"
              target="_blank"
            >
              查看短息账户
            </router-link>
          </div>
          <transition name="el-fade-in-linear">
            <el-row
              v-if="form.sms_isopen"
              :gutter="30"
            >
              <el-col
                v-if="form.activity_type === 'member_birthday'"
                :span="6"
              >
                小程序名称
                <el-input
                  v-model="form.sms_params.app_name"
                  class="content-bottom-padded"
                  placeholder="请填写小程序名称"
                />
              </el-col>
              <el-col :span="6">
                <el-card class="box-card sms-templ">
                  <div
                    slot="header"
                    class="clearfix"
                  >
                    <span>短信模板</span>
                  </div>
                  <span
                    v-if="form.activity_type === 'member_birthday'"
                  >尊敬的会员：值此您生日之际，衷心祝您生日快乐！为感谢您对本店的支持，特此赠送您｛赠送内容｝｛数量｝。详情请查看官方小程序</span>
                  <span
                    v-if="form.activity_type === 'member_day'"
                  >｛会员日时间｝是｛品牌｝会员日，特此为您奉上｛奖品｝。到店更有其他惊喜</span>
                  <span
                    v-if="form.activity_type === 'member_anniversary'"
                  >历史上的今天，您成为了｛品牌｝会员。感谢您一路来对｛品牌｝的支持，特此为您奉上｛奖品｝。到店更有其他惊喜。</span>
                  <span
                    v-if="form.activity_type === 'member_upgrade'"
                  >恭喜您成为｛品牌｝｛会员等级名称｝，特此为您奉上｛奖品｝。到店更有其他惊喜。</span>
                  <span
                    v-if="form.activity_type === 'member_vip_upgrade'"
                  >恭喜您成为{{ 品牌 }}的{{ 付费会员等级名称 }}，特此为您奉上{{ 赠送内容 }}</span>
                </el-card>
              </el-col>
            </el-row>
          </transition>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="onSubmit"
          >
            立即创建
          </el-button>
          <el-button @click="back">
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-for="levelItem in levelData">
      <el-dialog
        v-for="(item, index) in goods"
        v-if="levelItem.grade_id === item.id"
        :key="index"
        title="选择商品"
        :visible.sync="item.dialog"
        width="30%"
        @open="onshowModal('goods')"
        @close="oncloseModal('goods')"
      >
        <ul
          v-loading="item.loading"
          class="dialog-list clearfix"
        >
          <template v-for="child in item.list">
            <li
              :class="child.checked ? 'checked' : ''"
              @click="selectItems('goods', child)"
            >
              <i
                v-if="child.checked"
                class="el-icon-check"
              /> {{ child.itemName }}
            </li>
          </template>
        </ul>
        <div class="content-padded">
          <el-pagination
            background
            layout="prev, pager, next"
            :current-page="item.page.currentPage"
            :page-size="item.page.pageSize"
            :total="item.page.total"
            @current-change="changeGoodsPage"
          />
        </div>
        <div style="display: none">
          <template v-for="(child, index) in item.temp">
            <li>{{ child.itemName }}</li>
          </template>
        </div>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="cancelSelected('goods')">取 消</el-button>
          <el-button
            type="primary"
            @click="submitSelected('goods')"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div v-for="levelItem in levelData">
      <el-dialog
        v-for="(item, index) in coupons"
        v-if="levelItem.grade_id === item.id"
        :key="index"
        title="选择优惠券"
        :visible.sync="item.dialog"
        width="30%"
        @open="onshowModal('coupons')"
        @close="oncloseModal('coupons')"
      >
        <ul
          v-loading="item.loading"
          class="dialog-list clearfix"
        >
          <template v-for="child in item.list">
            <li
              :class="child.checked ? 'checked' : ''"
              @click="selectItems('coupons', child)"
            >
              <i
                v-if="child.checked"
                class="el-icon-check"
              /> {{ child.title }}
            </li>
          </template>
        </ul>
        <div class="content-padded">
          <el-pagination
            background
            layout="prev, pager, next"
            :current-page="item.page.currentPage"
            :page-size="item.page.pageSize"
            :total="item.page.total"
            @current-change="changeCouponsPage"
          />
        </div>
        <div style="display: none">
          <template v-for="(child, index) in item.temp">
            <li>{{ child.title }}</li>
          </template>
        </div>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="cancelSelected('coupons')">取 消</el-button>
          <el-button
            type="primary"
            @click="submitSelected('coupons')"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </section>
</template>

<script>
import { createActivity } from '../../../api/promotions'
import { getItemsList } from '../../../api/goods'
import { getCardList } from '../../../api/cardticket'
import { getGradeList } from '../../../api/membercard'
import { listVipGrade } from '../../../api/cardticket'
export default {
  inject: ['refresh'],
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
      level: 0,
      levelData: [],
      monthOptions: [],
      weekOptions: [],
      dayOptions: [],
      memberDay: {
        month: '',
        week: '',
        day: ''
      },
      submitLoading: false,
      date: [],
      condition: '',
      coupons: [],
      goods: [],
      form: {
        title: '',
        activity_type: '',
        trigger_condition: '',
        discount_config: '',
        sms_isopen: false,
        sms_params: {
          app_name: ''
        },
        is_forever: false,
        begin_time: '',
        end_time: ''
      }
    }
  },
  mounted () {
    this.getGradeList()
    if (this.$route.params.type) {
      this.form.activity_type = this.$route.params.type
      if (this.$route.params.type === 'member_upgrade') {
        this.condition = 'member_upgrade'
      }
      if (this.$route.params.type === 'member_vip_upgrade') {
        this.condition = 'member_vip_upgrade'
      }
      if (this.$route.params.type === 'member_day') {
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
      }
    }
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
  },
  methods: {
    onSubmit () {
      if (this.form.activity_type === 'member_day') {
        let obj = {
          type: this.condition,
          month: this.memberDay.month,
          week: this.memberDay.week,
          day: this.memberDay.day
        }
        this.form.trigger_condition = { trigger_time: obj }
      } else {
        this.form.trigger_condition = { trigger_time: this.condition }
      }
      this.form.begin_time = this.date[0] / 1000
      this.form.end_time = this.date[1] / 1000
      let couponArr = [],
        goodsArr = []
      for (var i = 0; i < this.coupons.length; i++) {
        if (this.coupons[i].id) {
          couponArr[this.coupons[i].id] = []
          for (var j = 0; j < this.coupons[i].checked.length; j++) {
            let couponObj = {}
            couponObj.id = this.coupons[i].checked[j].card_id
            couponObj.count = this.coupons[i].checked[j].count
            couponObj.name = this.coupons[i].checked[j].title
            couponArr[this.coupons[i].id].push(couponObj)
          }
        }
      }
      for (var i = 0; i < this.goods.length; i++) {
        if (this.goods[i].id) {
          goodsArr[this.goods[i].id] = []
          for (var j = 0; j < this.goods[i].checked.length; j++) {
            let goodsObj = {}
            goodsObj.id = this.goods[i].checked[j].itemId
            goodsObj.count = this.goods[i].checked[j].count
            goodsObj.name = this.goods[i].checked[j].itemName
            goodsArr[this.goods[i].id].push(goodsObj)
          }
        }
      }

      this.form.discount_config = {
        coupons: couponArr,
        goods: goodsArr,
        version: 1
      }
      this.submitLoading = true
      const that = this
      createActivity(this.form).then((res) => {
        this.submitLoading = false
        this.$message({
          message: '添加成功',
          type: 'success',
          duration: 2 * 1000,
          onClose () {
            that.refresh()
            that.$router.go(-3)
          }
        })
      })
    },
    showModal (type, level) {
      if (type === 'goods') {
        for (var i = 0; i < this.goods.length; i++) {
          if (this.goods[i].id == level) {
            this.goods[i].dialog = true
          }
        }
      } else {
        for (var i = 0; i < this.coupons.length; i++) {
          if (this.coupons[i].id == level) {
            this.coupons[i].dialog = true
          }
        }
      }
      this.level = level
    },
    onshowModal (type) {
      if (type === 'goods') {
        for (var i = 0; i < this.goods.length; i++) {
          if (this.goods[i].id == this.level) {
            this.goods[i].loading = true
            for (var j = 0; j < this.goods[i].checked.length; j++) {
              this.goods[i].temp.push(this.goods[i].checked[j])
            }
            this.getGoods(this.goods[i].page.currentPage)
          }
        }
      } else {
        for (var i = 0; i < this.coupons.length; i++) {
          if (this.coupons[i].id == this.level) {
            this.coupons[i].loading = true
            for (var j = 0; j < this.coupons[i].checked.length; j++) {
              this.coupons[i].temp.push(this.coupons[i].checked[j])
            }
            this.getCoupons(this.coupons[i].page.currentPage)
          }
        }
      }
    },
    getGoods (current) {
      getItemsList({
        page: current,
        pageSize: 20
      }).then((res) => {
        let data = res.data.data.list
        if (data.length <= 0) {
          for (let j = 0; j < this.goods.length; j++) {
            this.goods[j].loading = false
            this.goods[j].list = []
            this.goods[j].page.total = 0
          }
        } else {
          for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < this.goods.length; j++) {
              if (this.goods[j].id == this.level) {
                for (var k = 0; k < this.goods[j].temp.length; k++) {
                  if (data[i].itemId == this.goods[j].temp[k].itemId) {
                    data[i].checked = true
                  }
                }
                this.goods[j].list = data
                this.goods[j].page.total = res.data.data.total_count
                this.goods[j].loading = false
              }
            }
          }
        }
      })
    },
    getCoupons (current) {
      getCardList({
        page_no: current,
        page_size: 20
      }).then((res) => {
        var data = res.data.data.list
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < this.coupons.length; j++) {
            if (this.coupons[j].id == this.level) {
              for (var k = 0; k < this.coupons[j].temp.length; k++) {
                if (data[i].card_id == this.coupons[j].temp[k].card_id) {
                  data[i].checked = true
                }
              }
              this.coupons[j].list = data
              this.coupons[j].page.total = res.data.data.pagers.total
              this.coupons[j].loading = false
            }
          }
        }
      })
    },
    changeGoodsPage (currentPage) {
      for (var i = 0; i < this.goods.length; i++) {
        if (this.goods[i].id == this.level) {
          this.goods[i].page.currentPage = currentPage
          this.getGoods(currentPage)
        }
      }
    },
    changeCouponsPage (currentPage) {
      for (var i = 0; i < this.coupons.length; i++) {
        if (this.coupons[i].id == this.level) {
          this.coupons[i].page.currentPage = currentPage
          this.getCoupons(currentPage)
        }
      }
    },
    oncloseModal (type) {
      if (type === 'goods') {
        for (var i = 0; i < this.goods.length; i++) {
          if (this.goods[i].id == this.level) {
            this.goods[i].temp = []
          }
        }
      } else {
        for (var i = 0; i < this.coupons.length; i++) {
          if (this.coupons[i].id == this.level) {
            this.coupons[i].temp = []
          }
        }
      }
    },
    selectItems (type, item) {
      if (type === 'goods') {
        if (item.checked) {
          for (var i = 0; i < this.goods.length; i++) {
            if (this.goods[i].id == this.level) {
              for (var j = 0; j < this.goods[i].temp.length; j++) {
                if (this.goods[i].temp[j].itemId === item.itemId) {
                  this.goods[i].temp.splice(j, 1)
                }
              }
              for (var k = 0; k < this.goods[i].list.length; k++) {
                if (this.goods[i].list[k].itemId === item.itemId) {
                  this.goods[i].list[k].checked = false
                }
              }
            }
          }
        } else {
          for (var i = 0; i < this.goods.length; i++) {
            if (this.goods[i].id == this.level) {
              for (var k = 0; k < this.goods[i].list.length; k++) {
                if (this.goods[i].list[k].itemId === item.itemId) {
                  this.goods[i].list[k].checked = true
                }
              }
              this.goods[i].temp.push(item)
            }
          }
        }
      } else {
        if (item.checked) {
          for (var i = 0; i < this.coupons.length; i++) {
            if (this.coupons[i].id == this.level) {
              for (var j = 0; j < this.coupons[i].temp.length; j++) {
                if (this.coupons[i].temp[j].card_id === item.card_id) {
                  this.coupons[i].temp.splice(j, 1)
                }
              }
              for (var k = 0; k < this.coupons[i].list.length; k++) {
                if (this.coupons[i].list[k].card_id === item.card_id) {
                  this.coupons[i].list[k].checked = false
                }
              }
            }
          }
        } else {
          for (var i = 0; i < this.coupons.length; i++) {
            if (this.coupons[i].id == this.level) {
              for (var k = 0; k < this.coupons[i].list.length; k++) {
                if (this.coupons[i].list[k].card_id === item.card_id) {
                  this.coupons[i].list[k].checked = true
                }
              }
              this.coupons[i].temp.push(item)
            }
          }
        }
      }
    },
    submitSelected (type) {
      if (type === 'goods') {
        for (var i = 0; i < this.goods.length; i++) {
          if (this.goods[i].id == this.level) {
            this.goods[i].dialog = false
            this.goods[i].checked = this.goods[i].temp
            for (var j = 0; j < this.goods[i].checked.length; j++) {
              this.goods[i].checked[j].count = 1
            }
            this.goods[i].temp = []
          }
        }
      } else {
        for (var i = 0; i < this.coupons.length; i++) {
          if (this.coupons[i].id == this.level) {
            this.coupons[i].dialog = false
            this.coupons[i].checked = this.coupons[i].temp
            for (var j = 0; j < this.coupons[i].checked.length; j++) {
              this.coupons[i].checked[j].count = 1
            }
            this.coupons[i].temp = []
          }
        }
      }
    },
    cancelSelected (type) {
      if (type === 'goods') {
        for (var i = 0; i < this.goods.length; i++) {
          if (this.goods[i].id == this.level) {
            this.goods[i].dialog = false
            this.goods[i].temp = []
          }
        }
      } else {
        for (var i = 0; i < this.coupons.length; i++) {
          if (this.coupons[i].id == this.level) {
            this.coupons[i].dialog = false
            this.coupons[i].temp = []
          }
        }
      }
    },
    removeChecked (type, index, level) {
      if (type === 'goods') {
        for (var i = 0; i < this.goods.length; i++) {
          if (this.goods[i].id == level) {
            this.goods[i].checked.splice(index, 1)
          }
        }
      } else {
        for (var i = 0; i < this.coupons.length; i++) {
          if (this.coupons[i].id == level) {
            this.coupons[i].checked.splice(index, 1)
          }
        }
      }
    },
    back () {
      this.$router.back(-1)
    },
    getGradeList () {
      getGradeList().then((response) => {
        if (response != undefined && response.data.data && response.data.data.length > 0) {
          var params = { is_disabled: 'false' }
          listVipGrade(params).then((res) => {
            let vipData = res.data.data
            vipData.forEach((item) => {
              item.grade_id = item.lv_type
            })

            if (this.form.activity_type == 'member_upgrade') {
              this.levelData = response.data.data
            } else if (this.form.activity_type == 'member_vip_upgrade') {
              this.levelData = vipData
            } else {
              this.levelData = [...response.data.data, ...vipData]
            }
            for (let i = 0; i < this.levelData.length; i++) {
              let good = {
                id: this.levelData[i].grade_id,
                dialog: false,
                loading: false,
                temp: [],
                list: [],
                checked: [],
                page: {
                  currentPage: 1,
                  pageSize: 20,
                  total: 0
                }
              }
              this.goods.push(good)
              let coupon = {
                id: this.levelData[i].grade_id,
                dialog: false,
                loading: false,
                temp: [],
                list: [],
                checked: [],
                page: {
                  currentPage: 1,
                  pageSize: 20,
                  total: 0
                }
              }
              this.coupons.push(coupon)
            }
          })
        }
      })
    }
  }
}
</script>

<style>
.el-input-number.is-controls-right .el-input__inner {
  padding-left: 10px;
  padding-right: 38px;
}
</style>
<style scoped lang="scss">
.sms-templ {
  line-height: normal;
}
.promotion-card {
  border: 1px solid #dcdfe6;
  height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  border-radius: 4px;
  &-header {
    position: relative;
    height: 40px;
    line-height: 40px;
    background: #f5f7fa;
    margin: 0;
    padding-left: 15px;
    border-bottom: 1px solid #ebeef5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 16px;
    color: #303133;
    font-weight: 400;
  }
  &-list {
    margin: 0;
    padding: 6px 0;
    list-style: none;
    height: 246px;
    overflow: auto;
    box-sizing: border-box;
    li {
      display: flex;
      position: relative;
      width: 100%;
      box-sizing: border-box;
      padding-left: 20px;
      padding-right: 36px;
      line-height: 30px;
      .promotion-name {
        flex: 1;
        padding-right: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .el-input-number--mini {
        width: 80px;
        height: 28px;
      }
      .remove-btn {
        display: none;
        position: absolute;
        top: 8px;
        right: 10px;
        cursor: pointer;
      }
      &:hover {
        background-color: #f8f8f8;
        .remove-btn {
          display: block;
        }
      }
    }
  }
  &-btn {
    position: absolute;
    right: 15px;
    font-size: 14px;
  }
}
.dialog-list li {
  width: 50%;
  float: left;
  padding-left: 30px;
  padding-right: 20px;
  line-height: 30px;
  cursor: pointer;
  &.checked {
    color: #ff5000;
  }
  &:hover {
    background: #f8f8f8;
  }
}
</style>
