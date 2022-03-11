<template lang="html">
  <div>
    <el-tabs
      v-model="activeName"
      type="card"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="item.name"
        :name="item.activeName"
      >
        <template v-if="activeName === 'valid'">
          <div class="content-bottom-padded">
            <el-button
              size="medium"
              @click="add"
            >
              添加活动
            </el-button>
          </div>

          <el-table
            :data="activity"
            border
            style="width: 100%"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form
                  label-position="left"
                  inline
                  class="demo-table-expand"
                >
                  <el-form-item label="触发条件">
                    <span v-if="props.row.activity_type == 'member_birthday'">
                      <span
                        v-if="props.row.trigger_condition.trigger_time == 'birthday_month'"
                      >生日当月1日统一发放</span>
                      <span
                        v-if="props.row.trigger_condition.trigger_time == 'birthday_week'"
                      >生日当周周日统一发放</span>
                      <span
                        v-if="props.row.trigger_condition.trigger_time == 'birthday_day'"
                      >生日当日统一发放</span>
                    </span>
                    <span
                      v-if="props.row.activity_type == 'member_upgrade'"
                    >会员升级成功后发放</span>
                    <span
                      v-if="props.row.activity_type == 'member_vip_upgrade'"
                    >付费会员升级成功后发放</span>
                    <span v-if="props.row.activity_type == 'member_anniversary'">
                      <span
                        v-if="props.row.trigger_condition.trigger_time == 'anniversary_month'"
                      >周年入会当月1日统一发放</span>
                      <span
                        v-if="props.row.trigger_condition.trigger_time == 'anniversary_week'"
                      >周年入会当周周日统一发放</span>
                      <span
                        v-if="props.row.trigger_condition.trigger_time == 'anniversary_day'"
                      >周年入会当日统一发放</span>
                    </span>
                    <span v-if="props.row.activity_type == 'member_day'">
                      <span v-if="props.row.trigger_condition.trigger_time.type == 'every_year'">
                        每年的{{ props.row.trigger_condition.trigger_time.month }}月
                      </span>
                      <span v-if="props.row.trigger_condition.trigger_time.type == 'every_month'">
                        每月的{{ props.row.trigger_condition.trigger_time.day }}号
                      </span>
                      <span v-if="props.row.trigger_condition.trigger_time.type == 'every_week'">
                        每周的星期{{ props.row.trigger_condition.trigger_time.week }}
                      </span>
                    </span>
                  </el-form-item>
                  <el-row :gutter="20">
                    <el-col v-if="props.row.discount_config.coupons">
                      <el-card class="box-card">
                        <div slot="header">
                          <el-button type="text">
                            赠送优惠券
                          </el-button>
                        </div>
                        <div
                          v-for="(item, index) in props.row.discount_config.coupons"
                          :key="index"
                          class="text item"
                        >
                          <div v-if="item.name">
                            赠送{{ item.count }}张【{{ item.name }} 】优惠券
                          </div>
                          <div
                            v-for="(row, i) in item"
                            v-else
                            :key="i"
                            class="text item"
                          >
                            赠送【{{ gradeList[index] }}】{{ row.count }}张【{{ row.name }} 】
                            优惠券
                          </div>
                        </div>
                      </el-card>
                    </el-col>
                    <el-col v-if="props.row.discount_config.goods">
                      <el-card class="box-card">
                        <div
                          slot="header"
                          class="clearfix"
                        >
                          <el-button type="text">
                            赠送服务类商品
                          </el-button>
                        </div>
                        <div
                          v-for="(item, index) in props.row.discount_config.goods"
                          :key="index"
                          class="text item"
                        >
                          <div v-if="item.name">
                            赠送{{ item.count }}件【{{ item.name }} 】服务类商品
                          </div>
                          <div
                            v-for="(row, i) in item"
                            v-else
                            :key="i"
                            class="text item"
                          >
                            赠送【{{ gradeList[index] }}】{{ row.count }}件【{{ row.name }}
                            】服务类商品
                          </div>
                        </div>
                      </el-card>
                    </el-col>
                  </el-row>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              label="活动名称"
              prop="title"
            />
            <el-table-column
              label="开始时间"
              prop="begin_time"
            />
            <el-table-column
              label="结束时间"
              prop="end_time"
            />
            <el-table-column label="营销类型">
              <template slot-scope="props">
                <span
                  v-if="props.row.activity_type === 'member_anniversary'"
                  class="list-item-obj"
                >会员周年</span>
                <span
                  v-else-if="props.row.activity_type === 'member_birthday'"
                  class="list-item-obj"
                >会员生日</span>
                <span
                  v-else-if="props.row.activity_type === 'member_upgrade'"
                  class="list-item-obj"
                >会员升级</span>
                <span
                  v-else-if="props.row.activity_type === 'member_vip_upgrade'"
                  class="list-item-obj"
                >付费会员升级</span>
                <span
                  v-else
                  class="list-item-obj"
                >会员日</span>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="props">
                {{ props.row.status === 'processing' ? '进行中' : '准备中' }}
              </template>
            </el-table-column>
            <el-table-column label="发送短信">
              <template slot-scope="props">
                {{ props.row.sms_isopen === 'false' ? '禁用' : '启用' }}
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="props">
                <el-button
                  type="primary"
                  size="mini"
                  @click="invalidActivity(props.row.activity_id)"
                >
                  终止活动
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="validPage.total > validPage.pageSize"
            background
            layout="prev, pager, next"
            :current-page="validPage.currentPage"
            :page-size="validPage.pageSize"
            :total="validPage.total"
            @current-change="changeValidPage"
          />
        </template>
        <template v-if="activeName === 'invalid'">
          <el-table
            :data="history"
            border
            style="width: 100%"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form
                  label-position="left"
                  inline
                  class="demo-table-expand"
                >
                  <el-form-item label="触发条件">
                    <span v-if="props.row.activity_type == 'member_birthday'">
                      <span
                        v-if="props.row.trigger_condition.trigger_time == 'birthday_month'"
                      >生日当月1日统一发放</span>
                      <span
                        v-if="props.row.trigger_condition.trigger_time == 'birthday_week'"
                      >生日当周周日统一发放</span>
                      <span
                        v-if="props.row.trigger_condition.trigger_time == 'birthday_day'"
                      >生日当日统一发放</span>
                    </span>
                    <span
                      v-if="props.row.activity_type == 'member_upgrade'"
                    >会员升级成功后发放</span>
                    <span
                      v-if="props.row.activity_type == 'member_vip_upgrade'"
                    >付费会员升级成功后发放</span>
                    <span v-if="props.row.activity_type == 'member_anniversary'">
                      <span
                        v-if="props.row.trigger_condition.trigger_time == 'anniversary_month'"
                      >周年入会当月1日统一发放</span>
                      <span
                        v-if="props.row.trigger_condition.trigger_time == 'anniversary_week'"
                      >周年入会当周周日统一发放</span>
                      <span
                        v-if="props.row.trigger_condition.trigger_time == 'anniversary_day'"
                      >周年入会当日统一发放</span>
                    </span>
                    <span v-if="props.row.activity_type == 'member_day'">
                      <span v-if="props.row.trigger_condition.trigger_time.type == 'every_year'">
                        每年的{{ props.row.trigger_condition.trigger_time.month }}月
                      </span>
                      <span v-if="props.row.trigger_condition.trigger_time.type == 'every_month'">
                        每月的{{ props.row.trigger_condition.trigger_time.day }}号
                      </span>
                      <span v-if="props.row.trigger_condition.trigger_time.type == 'every_week'">
                        每周的星期{{ props.row.trigger_condition.trigger_time.week }}
                      </span>
                    </span>
                  </el-form-item>
                  <el-row :gutter="20">
                    <el-col v-if="props.row.discount_config.coupons">
                      <el-card class="box-card">
                        <div slot="header">
                          <el-button type="text">
                            赠送优惠券
                          </el-button>
                        </div>
                        <div
                          v-for="(item, index) in props.row.discount_config.coupons"
                          :key="index"
                          class="text item"
                        >
                          <div v-if="item.name">
                            赠送{{ item.count }}张【{{ item.name }} 】优惠券
                          </div>
                          <div
                            v-for="(row, i) in item"
                            v-else
                            :key="i"
                            class="text item"
                          >
                            赠送【{{ gradeList[index] }}】{{ row.count }}张【{{ row.name }} 】
                            优惠券
                          </div>
                        </div>
                      </el-card>
                    </el-col>
                    <el-col v-if="props.row.discount_config.goods">
                      <el-card class="box-card">
                        <div
                          slot="header"
                          class="clearfix"
                        >
                          <el-button type="text">
                            赠送服务类商品
                          </el-button>
                        </div>
                        <div
                          v-for="(item, index) in props.row.discount_config.goods"
                          :key="index"
                          class="text item"
                        >
                          <div v-if="item.name">
                            赠送{{ item.count }}件【{{ item.name }} 】服务类商品
                          </div>
                          <div
                            v-for="(row, i) in item"
                            v-else
                            :key="i"
                            class="text item"
                          >
                            赠送【{{ gradeList[index] }}】{{ row.count }}件【{{ row.name }}
                            】服务类商品
                          </div>
                        </div>
                      </el-card>
                    </el-col>
                  </el-row>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              label="活动名称"
              prop="title"
            />
            <el-table-column
              label="开始时间"
              prop="begin_time"
            />
            <el-table-column
              label="结束时间"
              prop="end_time"
            />
            <el-table-column label="营销类型">
              <template slot-scope="props">
                <span
                  v-if="props.row.activity_type === 'member_anniversary'"
                  class="list-item-obj"
                >会员周年</span>
                <span
                  v-else-if="props.row.activity_type === 'member_birthday'"
                  class="list-item-obj"
                >会员生日</span>
                <span
                  v-else-if="props.row.activity_type === 'member_upgrade'"
                  class="list-item-obj"
                >会员升级</span>
                <span
                  v-else-if="props.row.activity_type === 'member_vip_upgrade'"
                  class="list-item-obj"
                >付费会员升级</span>
                <span
                  v-else
                  class="list-item-obj"
                >会员日</span>
              </template>
            </el-table-column>
            <el-table-column label="发送短信">
              <template slot-scope="props">
                {{ props.row.sms_isopen === 'false' ? '禁用' : '启用' }}
              </template>
            </el-table-column>
          </el-table>
          <div class="content-center">
            <el-pagination
              layout="total, prev, pager, next"
              :current-page="invalidPage.currentPage"
              :page-size="invalidPage.pageSize"
              :total="invalidPage.total"
              @current-change="changeInvalidPage"
            />
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
    <router-view />
  </div>
</template>

<script>
import { getActivity, invalidActivity } from '@/api/promotions'
import { getGradeList } from '@/api/membercard'
import { listVipGrade } from '@/api/cardticket'
export default {
  provide () {
    return {
      refresh: this.refresh
    }
  },
  data () {
    return {
      activity: [],
      history: [],
      activeName: 'valid',
      validLoading: false,
      invalidLoading: false,
      gradeList: [],
      validPage: {
        currentPage: 1,
        pageSize: 12,
        total: 0
      },
      tabList: [
        { name: '活动监控室', activeName: 'valid' },
        { name: '历史活动', activeName: 'invalid' }
      ],
      invalidPage: {
        currentPage: 1,
        pageSize: 12,
        total: 0
      }
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    handleClick (tab, event) {
      this.getList(tab.name)
    },
    add () {
      this.$router.push({
        path: this.matchHidePage('templ')
      })
    },
    getList (key) {
      let currentPage, pageSize
      if (key === 'valid') {
        this.validLoading = true
        currentPage = this.validPage.currentPage
        pageSize = this.validPage.pageSize
      } else {
        this.invalidLoading = true
        currentPage = this.invalidPage.currentPage
        pageSize = this.invalidPage.pageSize
      }
      var param = {
        page: currentPage,
        pageSize: pageSize,
        activity_status: key
      }
      getActivity(param).then((res) => {
        if (key === 'valid') {
          this.validLoading = false
          this.activity = res.data.data.list
          this.validPage.total = res.data.data.total_count
        } else {
          this.invalidLoading = false
          this.history = res.data.data.list
          this.invalidPage.total = res.data.data.total_count
        }
      })
    },
    changeValidPage (currentPage) {
      this.validPage.currentPage = currentPage
      this.getList('valid')
    },
    changeInvalidPage (currentPage) {
      this.invalidPage.currentPage = currentPage
      this.getList('invalid')
    },
    invalidActivity (id) {
      var param = {
        activity_id: id
      }
      this.$confirm('确认终止该活动？')
        .then((_) => {
          invalidActivity(param).then((res) => {
            this.getList('valid')
          })
        })
        .catch((_) => {})
    },
    refresh () {
      getGradeList().then((response) => {
        response.data.data.forEach((item) => {
          this.gradeList[item.grade_id] = item.grade_name
        })
      })
      listVipGrade().then((res) => {
        let vipData = res.data.data
        vipData.forEach((item) => {
          this.gradeList[item.lv_type] = item.grade_name
        })
      })
      this.getList('valid')
    }
  }
}
</script>

<style scoped lang="scss">
.list-item {
  padding: 15px;
  background: #f8f8f8;
  margin-bottom: 15px;
  &-title {
    font-size: 16px;
  }
  &-obj {
    font-size: 14px;
  }
  &-period {
    font-size: 12px;
  }
  &-status {
    font-size: 16px;
  }
}
</style>
