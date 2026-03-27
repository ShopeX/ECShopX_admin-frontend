<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
</style>

<template>
  <SpPage>
    <SpRouterView>
      <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app pc alipay />

      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="specific" :label="$t('c69f23db.a252cb')">
          <el-autocomplete
            v-model="params.specific.name"
            :fetch-suggestions="querySearch"
            :placeholder="$t('c69f23db.78a87c')"
            @select="handleSelectStore"
          />
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addActivityData">
          {{ $t('c69f23db.3e35d0') }}
        </el-button>
      </div>

      <el-tabs v-model="params.status" type="card" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="$t(item.nameKey)"
          :name="item.activeName"
        >
          <el-table
            v-loading="loading"
            :data="tableList"
            border
            style="width: 100%"
            :element-loading-text="$t('c69f23db.f09b12')"
          >
            <el-table-column :label="$t('c69f23db.2b6bc0')" min-width="180">
              <template slot-scope="scope">
                <div class="operating-icons">
                  <el-button
                    style="margin-right: 20px"
                    type="text"
                    @click="editActivityAction(scope.$index, scope.row)"
                  >
                    {{ $t('c69f23db.95b351') }}
                  </el-button>
                  <el-button style="margin-right: 20px" type="text" @click="viewDetail(scope.row)">
                    {{ $t('c69f23db.2e8f98') }}
                  </el-button>
                  <!--<i class="el-icon-delete" @click="deleteActivityAction(scope.row)"></i> -->
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="id" width="60" :label="$t('c69f23db.c515f3')" />
            <el-table-column prop="specific_name" min-width="150" :label="$t('c69f23db.188e1b')" />
            <el-table-column :label="$t('c69f23db.2d8423')" min-width="200">
              <template slot-scope="scope">
                <span v-if="scope.row.cycle_type == '1'"> {{ $t('c69f23db.cdfcf4') }} </span>
                <span v-if="scope.row.cycle_type == '2'">
                  {{ scope.row.start_date }} ~ {{ scope.row.end_date }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="discount" min-width="100" :label="$t('c69f23db.3045fe')">
              <template slot-scope="scope"> {{ scope.row.discount }}% </template>
            </el-table-column>
            <el-table-column
              prop="limit_total_money"
              min-width="150"
              :label="$t('c69f23db.55db7f')"
            >
              <template slot-scope="scope">
                {{ scope.row.limit_total_money }}{{ $t('c69f23db.c16655') }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('c69f23db.3fea7c')" min-width="200">
              <template slot-scope="scope">
                <span v-if="scope.row.status == '1'">{{ $t('c69f23db.d8acae') }}</span>
                <span v-if="scope.row.status == '2'">{{ $t('c69f23db.dca0c1') }}</span>
                <span v-if="scope.row.status == '3'">{{ $t('c69f23db.5c56a8') }}</span>
                <span v-if="scope.row.status == '4'">{{ $t('c69f23db.584cd1') }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="mt-4 text-right">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :current-page.sync="page.pageIndex"
              :page-sizes="[10, 20, 50]"
              :total="page.total"
              :page-size="page.pageSize"
              @current-change="onCurrentChange"
              @size-change="onSizeChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>

      <el-dialog
        :title="$t('c69f23db.ebec7b')"
        :visible.sync="activityItemDialog"
        :before-close="handleCancel"
        width="70%"
      >
        <template>
          <el-form
            ref="form"
            :model="form"
            label-width="150px"
            label-position="right"
            class="demo-ruleForm"
          >
            <el-form-item :label="$t('c69f23db.188e1b')">
              <el-autocomplete
                v-model="form.specific_name"
                class="inline-input"
                clearable
                :fetch-suggestions="querySearch"
                :placeholder="$t('c69f23db.78a87c')"
                size="mini"
                @select="selectTag"
              />
            </el-form-item>
            <el-form-item :label="$t('c69f23db.0832b7')">
              <el-radio v-model="form.cycle_type" label="1" @change="cycleType">
                {{ $t('c69f23db.cdfcf4') }}
              </el-radio>
              <el-radio v-model="form.cycle_type" label="2" @change="cycleType">
                {{ $t('c69f23db.f7ad46') }}
              </el-radio>
            </el-form-item>
            <el-form-item :label="$t('c69f23db.08256c')">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-date-picker
                    v-model="form.start_time"
                    type="datetime"
                    default-time="00:00:00"
                    :disabled="form.cycle_type == '1' ? true : false"
                    format="yyyy/MM/dd HH:mm:ss"
                    value-format="timestamp"
                    :placeholder="$t('c69f23db.a42ae4')"
                  />
                </el-col>
                <el-col :span="1"> ~ </el-col>
                <el-col :span="8">
                  <el-date-picker
                    v-model="form.end_time"
                    type="datetime"
                    default-time="23:59:59"
                    :disabled="form.cycle_type == '1' ? true : false"
                    format="yyyy/MM/dd HH:mm:ss"
                    value-format="timestamp"
                    :placeholder="$t('c69f23db.a42ae4')"
                  />
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item :label="$t('c69f23db.763249')">
              <el-input
                v-model="form.discount"
                :placeholder="$t('c69f23db.a11cc7')"
                style="width: 20%"
              />%
            </el-form-item>
            <el-form-item :label="$t('c69f23db.e7309b')">
              <el-input
                v-model="form.limit_total_money"
                :placeholder="$t('c69f23db.a11cc7')"
                style="width: 20%"
              />{{ $t('c69f23db.c16655') }}
            </el-form-item>
            <el-form-item :label="$t('c69f23db.3fea7c')">
              <el-radio v-model="form.status" label="1"> {{ $t('c69f23db.d8acae') }} </el-radio>
              <el-radio v-model="form.status" label="2"> {{ $t('c69f23db.9465f8') }} </el-radio>
              <el-radio v-model="form.status" label="3"> {{ $t('c69f23db.5c56a8') }} </el-radio>
            </el-form-item>
            <el-form-item>
              <el-button @click.native="handleCancel"> {{ $t('c69f23db.625fb2') }} </el-button>
              <el-button type="primary" @click="submitAction">
                {{ $t('c69f23db.be5fbb') }}
              </el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-dialog>
    </SpRouterView>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import { getTagList } from '@/api/member'
import { pageMixin } from '@/mixins'
import { createSpecificcrowddiscount, updateSpecificcrowddiscount } from '@/api/promotions'
import shopSelect from '@/components/shopSelect'

export default {
  components: {
    shopSelect
  },
  mixins: [pageMixin],
  provide() {
    return {
      refresh: this.fetchList
    }
  },
  data() {
    const initialParams = {
      specific: {
        name: undefined,
        id: undefined
      },
      status: 'all'
    }
    return {
      initialParams,
      params: {
        ...initialParams
      },
      cursymbol: '￥',
      loading: false,
      create_time: '',
      activityItemParams: {
        page: 1,
        pageSize: 20
      },
      mount: '3',
      memberTagList: [{ value: '---无----', tag_id: 0 }],
      activity_date: '',
      form: {
        specific_type: 'member_tag',
        specific_id: '',
        specific_name: '',
        cycle_type: '1',
        start_time: '',
        end_time: '',
        discount: 0,
        limit_total_money: 0,
        status: '1'
      },
      activityItemTotalCount: 0,
      activityItemListsData: [],
      total_count: 0,
      list: [],
      activityItemDialog: false,
      ItemLoading: false,
      specific_name: '',
      tabList: [
        { nameKey: 'c69f23db.a8b0c2', activeName: 'all' },
        { nameKey: 'c69f23db.d8acae', activeName: '1' },
        { nameKey: 'c69f23db.dca0c1', activeName: '2' },
        { nameKey: 'c69f23db.5c56a8', activeName: '3' }
      ]
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.getAllMemberTagList()
    this.fetchList()
  },
  methods: {
    viewDetail(row) {
      this.$router.push({
        path: this.matchRoutePath('detail/') + row.id
      })
    },
    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    onReset() {
      this.params = { ...this.initialParams }
      this.params = {
        ...this.params,
        specific: {
          id: undefined,
          name: undefined
        }
      }
      this.onSearch()
    },
    handleSelectStore(storeItem) {
      this.params.specific.id = storeItem.tag_id
    },
    getParams() {
      let params = {
        ...this.params,
        specific_id: this.params.specific.id || undefined,
        specific: undefined,
        status: this.params.status === 'all' ? undefined : this.params.status
      }
      return params
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.getParams()
      }
      const { list, total_count } = await this.$api.promotions.getListSpecificcrowddiscount(params)
      this.tableList = list
      this.page.total = Number(total_count)
      this.loading = false
    },
    // 切换tab
    handleTabClick(tab, event) {
      this.onSearch()
    },
    querySearch(queryString, cb) {
      var restaurants = this.memberTagList
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    getAllMemberTagList() {
      let params = { page: 1, page_size: 1000 }
      getTagList(params).then((response) => {
        if (response.data.data.list) {
          response.data.data.list.forEach((row) => {
            this.memberTagList.push({ value: row.tag_name, tag_id: row.tag_id })
          })
        }
      })
    },
    createFilter(queryString) {
      return (restaurant) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    selectTag(tagdata) {
      this.form.specific_id = tagdata.tag_id
    },
    submitAction() {
      // this.form.start_time = this.dateStrToTimeStamp(this.form.start_time)
      // this.form.end_time = this.dateStrToTimeStamp(this.form.end_time)
      const obj = {
        start_time: this.dateStrToTimeStamp(this.form.start_time),
        end_time: this.dateStrToTimeStamp(this.form.end_time)
      }

      if (this.form.id) {
        updateSpecificcrowddiscount({ ...this.form, ...obj }).then((res) => {
          this.fetchList()
          this.activityItemDialog = false
        })
      } else {
        createSpecificcrowddiscount({ ...this.form, ...obj }).then((res) => {
          this.$message.success(this.$t('c69f23db.04a691'))
          this.fetchList()
          this.activityItemDialog = false
        })
      }
    },
    cycleType(value) {
      if (value == 1) {
        this.monthChange()
      }
    },
    monthChange(select) {
      var now = new Date() //当前日期
      var nowMonth = now.getMonth() //当前月
      if (select) {
        nowMonth = select - 1 //选定月
      }
      var nowYear = now.getFullYear() //当前年
      //本月的开始时间
      var monthStartDate = new Date(nowYear, nowMonth, 1)
      //本月的结束时间
      var monthEndDate = new Date(nowYear, nowMonth + 1, 0, 23, 59, 59)
      this.form.start_time = monthStartDate //Date.parse(monthStartDate)
      this.form.end_time = monthEndDate //Date.parse(monthEndDate)
    },
    addActivityData() {
      this.form = {
        specific_type: 'member_tag',
        specific_id: '',
        specific_name: '',
        cycle_type: '1',
        start_time: '',
        end_time: '',
        discount: 0,
        limit_total_money: 0,
        status: '1'
      }
      this.activityItemDialog = true
      this.monthChange()
    },
    editActivityAction(index, row) {
      this.activityItemDialog = true
      this.form = row
      this.form.start_time = row.start_time * 1000
      this.form.end_time = row.end_time * 1000
      if (this.form.cycle_type == 1) {
        this.monthChange()
      }
    },
    handleCancel() {
      this.activityItemDialog = false
    },

    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },

    updateStatusCommunityAction(row) {
      const msg = this.$t('c69f23db.01be42')
      this.$confirm(msg, this.$t('c69f23db.02d981'), {
        cancelButtonText: this.$t('c69f23db.625fb2'),
        confirmButtonText: this.$t('c69f23db.38cf16'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            removeMarketingActivity({ marketing_id: row.marketing_id, isEnd: true }).then(
              (response) => {
                this.fetchList()
                this.$message({
                  message: this.$t('c69f23db.1c48c9'),
                  type: 'success',
                  duration: 5 * 1000
                })
              }
            )
          }
          done()
        }
      })
    }
  }
}
</script>
