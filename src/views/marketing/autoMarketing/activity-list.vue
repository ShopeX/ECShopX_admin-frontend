<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpRouterView>
    <SpPage>
      <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app pc alipay />
      <el-tabs
        v-if="$route.path.indexOf('templ') === -1 && $route.path.indexOf('editor') === -1"
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
            <div class="action-container">
              <el-button type="primary" @click="add">{{ $t('89658415.23b46b') }}</el-button>
            </div>

            <el-table :data="activity" border style="width: 100%">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item :label="$t('89658415.65939c')">
                      <span v-if="props.row.activity_type == 'member_birthday'">
                        <span v-if="props.row.trigger_condition.trigger_time == 'birthday_month'">{{
                          $t('89658415.0b8db5')
                        }}</span>
                        <span v-if="props.row.trigger_condition.trigger_time == 'birthday_week'">{{
                          $t('89658415.883212')
                        }}</span>
                        <span v-if="props.row.trigger_condition.trigger_time == 'birthday_day'">{{
                          $t('89658415.503d48')
                        }}</span>
                      </span>
                      <span v-if="props.row.activity_type == 'member_upgrade'">{{
                        $t('89658415.e3e252')
                      }}</span>
                      <span v-if="props.row.activity_type == 'member_vip_upgrade'">{{
                        $t('89658415.a2d14e')
                      }}</span>
                      <span v-if="props.row.activity_type == 'member_anniversary'">
                        <span
                          v-if="props.row.trigger_condition.trigger_time == 'anniversary_month'"
                          >{{ $t('89658415.ce21e7') }}</span
                        >
                        <span
                          v-if="props.row.trigger_condition.trigger_time == 'anniversary_week'"
                          >{{ $t('89658415.e8667c') }}</span
                        >
                        <span
                          v-if="props.row.trigger_condition.trigger_time == 'anniversary_day'"
                          >{{ $t('89658415.5446bf') }}</span
                        >
                      </span>
                      <span v-if="props.row.activity_type == 'member_day'">
                        <span
                          v-if="props.row.trigger_condition.trigger_time.type == 'every_year'"
                          >{{
                            $t('89658415.4af3f8', [props.row.trigger_condition.trigger_time.month])
                          }}</span
                        >
                        <span
                          v-if="props.row.trigger_condition.trigger_time.type == 'every_month'"
                          >{{
                            $t('89658415.367ca2', [props.row.trigger_condition.trigger_time.day])
                          }}</span
                        >
                        <span
                          v-if="props.row.trigger_condition.trigger_time.type == 'every_week'"
                          >{{
                            $t('89658415.2b8313', [props.row.trigger_condition.trigger_time.week])
                          }}</span
                        >
                      </span>
                    </el-form-item>
                    <el-row :gutter="20">
                      <el-col v-if="props.row.discount_config.coupons">
                        <el-card class="box-card">
                          <div slot="header">
                            <el-button type="text">{{ $t('89658415.91fa9b') }}</el-button>
                          </div>
                          <div
                            v-for="(item, index) in props.row.discount_config.coupons"
                            :key="index"
                            class="text item"
                          >
                            <div v-if="item.name">
                              {{ $t('89658415.c68c4a', [item.count, item.name]) }}
                            </div>
                            <div v-for="(row, i) in item" v-else :key="i" class="text item">
                              {{ $t('89658415.85de1d', [gradeList[index], row.count, row.name]) }}
                            </div>
                          </div>
                        </el-card>
                      </el-col>
                      <el-col v-if="props.row.discount_config.goods">
                        <el-card class="box-card">
                          <div slot="header" class="clearfix">
                            <el-button type="text">{{ $t('89658415.e33d64') }}</el-button>
                          </div>
                          <div
                            v-for="(item, index) in props.row.discount_config.goods"
                            :key="index"
                            class="text item"
                          >
                            <div v-if="item.name">
                              {{ $t('89658415.9f93ea', [item.count, item.name]) }}
                            </div>
                            <div v-for="(row, i) in item" v-else :key="i" class="text item">
                              {{ $t('89658415.550a3d', [gradeList[index], row.count, row.name]) }}
                            </div>
                          </div>
                        </el-card>
                      </el-col>
                    </el-row>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column :label="$t('89658415.39834b')" prop="title" />
              <el-table-column :label="$t('89658415.592c59')" prop="begin_time" />
              <el-table-column :label="$t('89658415.f78277')" prop="end_time" />
              <el-table-column :label="$t('89658415.9ad61a')">
                <template slot-scope="props">
                  <span
                    v-if="props.row.activity_type === 'member_anniversary'"
                    class="list-item-obj"
                    >{{ $t('89658415.14f362') }}</span
                  >
                  <span
                    v-else-if="props.row.activity_type === 'member_birthday'"
                    class="list-item-obj"
                    >{{ $t('89658415.299c93') }}</span
                  >
                  <span
                    v-else-if="props.row.activity_type === 'member_upgrade'"
                    class="list-item-obj"
                    >{{ $t('89658415.e1d9d7') }}</span
                  >
                  <span
                    v-else-if="props.row.activity_type === 'member_vip_upgrade'"
                    class="list-item-obj"
                    >{{ $t('89658415.efa363') }}</span
                  >
                  <span v-else class="list-item-obj">{{ $t('89658415.70bdfe') }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('89658415.3fea7c')">
                <template slot-scope="props">
                  {{
                    props.row.status === 'processing'
                      ? $t('89658415.fb852f')
                      : $t('89658415.f76540')
                  }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('89658415.2d7288')">
                <template slot-scope="props">
                  {{
                    props.row.sms_isopen === 'false' ? $t('89658415.710ad0') : $t('89658415.7854b5')
                  }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('89658415.3fea7c')">
                <template slot-scope="props">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="invalidActivity(props.row.activity_id)"
                  >
                    {{ $t('89658415.6489ff') }}
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
            <el-table :data="history" border style="width: 100%">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item :label="$t('89658415.65939c')">
                      <span v-if="props.row.activity_type == 'member_birthday'">
                        <span v-if="props.row.trigger_condition.trigger_time == 'birthday_month'">{{
                          $t('89658415.0b8db5')
                        }}</span>
                        <span v-if="props.row.trigger_condition.trigger_time == 'birthday_week'">{{
                          $t('89658415.883212')
                        }}</span>
                        <span v-if="props.row.trigger_condition.trigger_time == 'birthday_day'">{{
                          $t('89658415.503d48')
                        }}</span>
                      </span>
                      <span v-if="props.row.activity_type == 'member_upgrade'">{{
                        $t('89658415.e3e252')
                      }}</span>
                      <span v-if="props.row.activity_type == 'member_vip_upgrade'">{{
                        $t('89658415.a2d14e')
                      }}</span>
                      <span v-if="props.row.activity_type == 'member_anniversary'">
                        <span
                          v-if="props.row.trigger_condition.trigger_time == 'anniversary_month'"
                          >{{ $t('89658415.ce21e7') }}</span
                        >
                        <span
                          v-if="props.row.trigger_condition.trigger_time == 'anniversary_week'"
                          >{{ $t('89658415.e8667c') }}</span
                        >
                        <span
                          v-if="props.row.trigger_condition.trigger_time == 'anniversary_day'"
                          >{{ $t('89658415.5446bf') }}</span
                        >
                      </span>
                      <span v-if="props.row.activity_type == 'member_day'">
                        <span
                          v-if="props.row.trigger_condition.trigger_time.type == 'every_year'"
                          >{{
                            $t('89658415.4af3f8', [props.row.trigger_condition.trigger_time.month])
                          }}</span
                        >
                        <span
                          v-if="props.row.trigger_condition.trigger_time.type == 'every_month'"
                          >{{
                            $t('89658415.367ca2', [props.row.trigger_condition.trigger_time.day])
                          }}</span
                        >
                        <span
                          v-if="props.row.trigger_condition.trigger_time.type == 'every_week'"
                          >{{
                            $t('89658415.2b8313', [props.row.trigger_condition.trigger_time.week])
                          }}</span
                        >
                      </span>
                    </el-form-item>
                    <el-row :gutter="20">
                      <el-col v-if="props.row.discount_config.coupons">
                        <el-card class="box-card">
                          <div slot="header">
                            <el-button type="text">{{ $t('89658415.91fa9b') }}</el-button>
                          </div>
                          <div
                            v-for="(item, index) in props.row.discount_config.coupons"
                            :key="index"
                            class="text item"
                          >
                            <div v-if="item.name">
                              {{ $t('89658415.c68c4a', [item.count, item.name]) }}
                            </div>
                            <div v-for="(row, i) in item" v-else :key="i" class="text item">
                              {{ $t('89658415.85de1d', [gradeList[index], row.count, row.name]) }}
                            </div>
                          </div>
                        </el-card>
                      </el-col>
                      <el-col v-if="props.row.discount_config.goods">
                        <el-card class="box-card">
                          <div slot="header" class="clearfix">
                            <el-button type="text">{{ $t('89658415.e33d64') }}</el-button>
                          </div>
                          <div
                            v-for="(item, index) in props.row.discount_config.goods"
                            :key="index"
                            class="text item"
                          >
                            <div v-if="item.name">
                              {{ $t('89658415.9f93ea', [item.count, item.name]) }}
                            </div>
                            <div v-for="(row, i) in item" v-else :key="i" class="text item">
                              {{ $t('89658415.550a3d', [gradeList[index], row.count, row.name]) }}
                            </div>
                          </div>
                        </el-card>
                      </el-col>
                    </el-row>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column :label="$t('89658415.39834b')" prop="title" />
              <el-table-column :label="$t('89658415.592c59')" prop="begin_time" />
              <el-table-column :label="$t('89658415.f78277')" prop="end_time" />
              <el-table-column :label="$t('89658415.9ad61a')">
                <template slot-scope="props">
                  <span
                    v-if="props.row.activity_type === 'member_anniversary'"
                    class="list-item-obj"
                    >{{ $t('89658415.14f362') }}</span
                  >
                  <span
                    v-else-if="props.row.activity_type === 'member_birthday'"
                    class="list-item-obj"
                    >{{ $t('89658415.299c93') }}</span
                  >
                  <span
                    v-else-if="props.row.activity_type === 'member_upgrade'"
                    class="list-item-obj"
                    >{{ $t('89658415.e1d9d7') }}</span
                  >
                  <span
                    v-else-if="props.row.activity_type === 'member_vip_upgrade'"
                    class="list-item-obj"
                    >{{ $t('89658415.efa363') }}</span
                  >
                  <span v-else class="list-item-obj">{{ $t('89658415.70bdfe') }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('89658415.2d7288')">
                <template slot-scope="props">
                  {{
                    props.row.sms_isopen === 'false' ? $t('89658415.710ad0') : $t('89658415.7854b5')
                  }}
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
    </SpPage>
  </SpRouterView>
</template>

<script>
import { getActivity, invalidActivity } from '@/api/promotions'
import { getGradeList } from '@/api/membercard'
import { listVipGrade } from '@/api/cardticket'
export default {
  provide() {
    return {
      refresh: this.refresh
    }
  },
  data() {
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
        { name: '', activeName: 'valid' },
        { name: '', activeName: 'invalid' }
      ],
      invalidPage: {
        currentPage: 1,
        pageSize: 12,
        total: 0
      }
    }
  },
  created() {
    this.tabList = [
      { name: this.$t('89658415.c67446'), activeName: 'valid' },
      { name: this.$t('89658415.3524c4'), activeName: 'invalid' }
    ]
  },
  mounted() {
    this.refresh()

    this.$activated = () => {
      this.refresh()
    }
  },
  methods: {
    handleClick(tab, event) {
      this.getList(tab.name)
    },
    add() {
      this.$router.push({
        path: this.matchRoutePath('templ')
      })
    },
    getList(key) {
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
    changeValidPage(currentPage) {
      this.validPage.currentPage = currentPage
      this.getList('valid')
    },
    changeInvalidPage(currentPage) {
      this.invalidPage.currentPage = currentPage
      this.getList('invalid')
    },
    invalidActivity(id) {
      var param = {
        activity_id: id
      }
      this.$confirm(this.$t('89658415.a9e6ff'))
        .then((_) => {
          invalidActivity(param).then((res) => {
            this.getList('valid')
          })
        })
        .catch((_) => {})
    },
    refresh() {
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
