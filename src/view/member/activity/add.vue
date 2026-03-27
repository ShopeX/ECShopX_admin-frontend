<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage :title="$t('118bb174.1e5200')">
    <section class="section section-white">
      <div class="content-padded">
        <el-form ref="form" :model="form" label-width="180px">
          <el-form-item :label="$t('118bb174.39834b')">
            <el-row>
              <el-col :span="8">
                <el-input v-model="form.title" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item :label="$t('118bb174.c799f5')">
            <el-date-picker
              v-model="date"
              type="daterange"
              align="right"
              value-format="timestamp"
              unlink-panels
              :range-separator="$t('118bb174.981cbe')"
              :start-placeholder="$t('118bb174.b44c0f')"
              :end-placeholder="$t('118bb174.1d468b')"
              :disabled="form.is_forever"
              :default-time="['00:00:00', '23:59:59']"
              :picker-options="pickerOptions2"
            />
            &nbsp;&nbsp;&nbsp;
            <el-checkbox v-model="form.is_forever"> {{ $t('118bb174.1c5029') }} </el-checkbox>
          </el-form-item>
          <el-form-item :label="$t('118bb174.cfa851')">
            <el-radio-group v-if="form.activity_type === 'member_birthday'" v-model="condition">
              <el-radio label="birthday_month"> {{ $t('118bb174.0b8db5') }} </el-radio>
              <el-radio label="birthday_week"> {{ $t('118bb174.883212') }} </el-radio>
              <el-radio label="birthday_day"> {{ $t('118bb174.503d48') }} </el-radio>
            </el-radio-group>
            <el-radio
              v-if="form.activity_type === 'member_upgrade'"
              v-model="condition"
              label="member_upgrade"
            >
              {{ $t('118bb174.e3e252') }}
            </el-radio>
            <el-radio
              v-if="form.activity_type === 'member_vip_upgrade'"
              v-model="condition"
              label="member_vip_upgrade"
            >
              {{ $t('118bb174.a2d14e') }}
            </el-radio>
            <el-radio-group v-if="form.activity_type === 'member_anniversary'" v-model="condition">
              <el-radio label="anniversary_month"> {{ $t('118bb174.ce21e7') }} </el-radio>
              <el-radio label="anniversary_week"> {{ $t('118bb174.e8667c') }} </el-radio>
              <el-radio label="anniversary_day"> {{ $t('118bb174.5446bf') }} </el-radio>
            </el-radio-group>
            <el-radio-group v-if="form.activity_type === 'member_day'" v-model="condition">
              <el-radio label="every_year"> {{ $t('118bb174.281cd3') }} </el-radio>
              <el-radio label="every_month"> {{ $t('118bb174.aa3d57') }} </el-radio>
              <el-radio label="every_week"> {{ $t('118bb174.09b03b') }} </el-radio>
            </el-radio-group>
            <transition name="el-fade-in-linear">
              <div v-if="condition === 'every_year'">
                <el-select v-model="memberDay.month" :placeholder="$t('118bb174.904393')">
                  <el-option
                    v-for="item in monthOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-select v-model="memberDay.day" :placeholder="$t('118bb174.aa2fb1')">
                  <el-option
                    v-for="item in dayOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div v-if="condition === 'every_month'">
                <el-select v-model="memberDay.day" :placeholder="$t('118bb174.aa2fb1')">
                  <el-option
                    v-for="item in dayOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div v-if="condition === 'every_week'">
                <el-select v-model="memberDay.week" :placeholder="$t('118bb174.2b40fa')">
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
            :label="levelItem.grade_name + $t('118bb174.e33e07')"
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
                    {{ $t('118bb174.2f3635') }}
                    <a class="promotion-card-btn" href="#" @click="showModal('coupons', item.id)">{{
                      $t('118bb174.66ab5e')
                    }}</a>
                  </div>
                  <div class="promotion-card-body">
                    <ul class="promotion-card-list">
                      <li v-for="(child, index) in item.checked" :key="index">
                        <div class="promotion-name">
                          {{ child.title }}
                        </div>
                        <el-input-number
                          v-model="child.count"
                          size="mini"
                          controls-position="right"
                          :min="1"
                          :max="10"
                          :label="$t('118bb174.f4e5d6')"
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
              />
            </el-row>
          </el-form-item>
          <el-form-item :label="$t('118bb174.e7d158')">
            <div class="content-bottom-padded">
              <el-switch v-model="form.sms_isopen" />
              {{ $t('118bb174.3d70d5') }}
              <router-link :to="{ path: matchInternalRoute('datamessage') }" target="_blank">
                {{ $t('118bb174.f3a137') }}
              </router-link>
            </div>
            <transition name="el-fade-in-linear">
              <el-row v-if="form.sms_isopen" :gutter="30">
                <el-col v-if="form.activity_type === 'member_birthday'" :span="6">
                  {{ $t('118bb174.d34f1f') }}
                  <el-input
                    v-model="form.sms_params.app_name"
                    class="content-bottom-padded"
                    :placeholder="$t('118bb174.7c28ca')"
                  />
                </el-col>
                <el-col :span="6">
                  <el-card class="box-card sms-templ">
                    <div slot="header" class="clearfix">
                      <span>{{ $t('118bb174.dbe8ba') }}</span>
                    </div>
                    <span v-if="form.activity_type === 'member_birthday'">{{
                      $t('118bb174.77fed3')
                    }}</span>
                    <span v-if="form.activity_type === 'member_day'">{{
                      $t('118bb174.62eb69')
                    }}</span>
                    <span v-if="form.activity_type === 'member_anniversary'">{{
                      $t('118bb174.6ab1b5')
                    }}</span>
                    <span v-if="form.activity_type === 'member_upgrade'">{{
                      $t('118bb174.67eebf')
                    }}</span>
                    <span v-if="form.activity_type === 'member_vip_upgrade'">{{
                      $t('118bb174.4ec471')
                    }}</span>
                  </el-card>
                </el-col>
              </el-row>
            </transition>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="submitLoading" @click="onSubmit">
              {{ $t('118bb174.9fd000') }}
            </el-button>
            <el-button @click="back"> {{ $t('118bb174.625fb2') }} </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-for="levelItem in levelData">
        <el-dialog
          v-for="(item, index) in goods"
          v-if="levelItem.grade_id === item.id"
          :key="index"
          :title="$t('118bb174.43d1e2')"
          :visible.sync="item.dialog"
          width="50%"
          @open="onshowModal('goods')"
          @close="oncloseModal('goods')"
        >
          <ul v-loading="item.loading" class="dialog-list flex flex-wrap">
            <template v-for="child in item.list">
              <li :class="child.checked ? 'checked' : ''" @click="selectItems('goods', child)">
                <i v-if="child.checked" class="el-icon-check" /> {{ child.itemName }}
              </li>
            </template>
          </ul>
          <div class="content-padded">
            <el-pagination
              background
              class="mt-4 text-center"
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
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancelSelected('goods')">{{ $t('118bb174.c08ab9') }}</el-button>
            <el-button type="primary" @click="submitSelected('goods')">{{
              $t('118bb174.aa7527')
            }}</el-button>
          </span>
        </el-dialog>
      </div>
      <div v-for="levelItem in levelData">
        <el-dialog
          v-for="(item, index) in coupons"
          v-if="levelItem.grade_id === item.id"
          :key="index"
          :title="$t('118bb174.45bcee')"
          :visible.sync="item.dialog"
          width="50%"
          @open="onshowModal('coupons')"
          @close="oncloseModal('coupons')"
        >
          <ul v-loading="item.loading" class="dialog-list flex flex-wrap">
            <template v-for="child in item.list">
              <li :class="child.checked ? 'checked' : ''" @click="selectItems('coupons', child)">
                <i v-if="child.checked" class="el-icon-check" /> {{ child.title }}
              </li>
            </template>
          </ul>
          <div class="content-padded">
            <el-pagination
              background
              class="mt-4 text-center"
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
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancelSelected('coupons')">{{ $t('118bb174.c08ab9') }}</el-button>
            <el-button type="primary" @click="submitSelected('coupons')">{{
              $t('118bb174.aa7527')
            }}</el-button>
          </span>
        </el-dialog>
      </div>
    </section>
  </SpPage>
</template>

<script>
import { getItemsList } from '../../../api/goods'
import { getCardList } from '../../../api/cardticket'
import { getGradeList } from '../../../api/membercard'
import { listVipGrade } from '../../../api/cardticket'
export default {
  inject: ['refresh'],
  data() {
    return {
      pickerOptions2: {
        shortcuts: [
          {
            text: this.$t('118bb174.56ee10'),
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
            text: this.$t('118bb174.335dfc'),
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
            text: this.$t('118bb174.d96eb4'),
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
  mounted() {
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
          obj.label = obj.value + this.$t('118bb174.e42b99')
          month.push(obj)
        }
        for (var i = 0; i < 7; i++) {
          let obj = {}
          obj.value = i + 1
          obj.label = this.$t(
            [
              '118bb174.5ce438',
              '118bb174.34e521',
              '118bb174.711d99',
              '118bb174.3df6af',
              '118bb174.450ea3',
              '118bb174.1ae72f',
              '118bb174.67b195'
            ][obj.value - 1]
          )
          week.push(obj)
        }
        for (var i = 0; i < 31; i++) {
          let obj = {}
          obj.value = i + 1
          obj.label = obj.value + this.$t('118bb174.3edddd')
          day.push(obj)
        }
        this.monthOptions = month
        this.weekOptions = week
        this.dayOptions = day
      }
    }
  },
  methods: {
    async onSubmit() {
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
      try {
        this.submitLoading = true
        await this.$api.promotions.createActivity(this.form)
        this.submitLoading = false
        this.$message.success(this.$t('118bb174.3fdaea'))
        setTimeout(() => {
          this.refresh()
          this.$router.go(-3)
        }, 700)
      } catch (err) {
        this.submitLoading = false
      }
    },
    showModal(type, level) {
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
    onshowModal(type) {
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
    getGoods(current) {
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
    getCoupons(current) {
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
    changeGoodsPage(currentPage) {
      for (var i = 0; i < this.goods.length; i++) {
        if (this.goods[i].id == this.level) {
          this.goods[i].page.currentPage = currentPage
          this.getGoods(currentPage)
        }
      }
    },
    changeCouponsPage(currentPage) {
      for (var i = 0; i < this.coupons.length; i++) {
        if (this.coupons[i].id == this.level) {
          this.coupons[i].page.currentPage = currentPage
          this.getCoupons(currentPage)
        }
      }
    },
    oncloseModal(type) {
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
    selectItems(type, item) {
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
    submitSelected(type) {
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
    cancelSelected(type) {
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
    removeChecked(type, index, level) {
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
    back() {
      this.$router.back(-1)
    },
    getGradeList() {
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
  width: 45%;
  // float: left;
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
