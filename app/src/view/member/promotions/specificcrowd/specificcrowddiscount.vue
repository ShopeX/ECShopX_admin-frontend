<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-row :gutter="20">
        <el-col>
          针对人群:
          <el-autocomplete
            clearable
            v-model="specific_name"
            :fetch-suggestions="querySearch"
            placeholder="请输入会员标签名称"
            @select="byTagSearch"
            @change="byTagSearch"
          ></el-autocomplete>
          <el-button type="primary" icon="el-icon-circle-plus" @click="addActivityData"
            >添加标签折扣</el-button
          >
        </el-col>
      </el-row>
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane label="暂存" name="1"></el-tab-pane>
        <el-tab-pane label="已发布" name="2"></el-tab-pane>
        <el-tab-pane label="停用" name="3"></el-tab-pane>
        <el-table
          :data="list"
          style="width: 100%"
          v-loading="loading"
          element-loading-text="数据加载中"
        >
          <el-table-column prop="id" width="60" label="编号"></el-table-column>
          <el-table-column prop="specific_name" min-width="150" label="适用人群"></el-table-column>
          <el-table-column label="周期" min-width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.cycle_type == '1'">
                自然月
              </span>
              <span v-if="scope.row.cycle_type == '2'">
                {{ scope.row.start_date }} ~ {{ scope.row.end_date }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="discount" min-width="100" label="优惠折扣">
            <template slot-scope="scope">{{ scope.row.discount }}%</template>
          </el-table-column>
          <el-table-column prop="limit_total_money" min-width="150" label="周期内最高优惠限额">
            <template slot-scope="scope"> {{ scope.row.limit_total_money }}元 </template>
          </el-table-column>
          <el-table-column label="状态" min-width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.status == '1'">暂存</span>
              <span v-if="scope.row.status == '2'">已发布</span>
              <span v-if="scope.row.status == '3'">停用</span>
              <span v-if="scope.row.status == '4'">过期</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="150">
            <template slot-scope="scope">
              <div class="operating-icons">
                <el-button style="margin-right:20px" type="text" @click="editActivityAction(scope.$index, scope.row)"
                  >编辑 </el-button
                >
                <router-link :to="{ path: matchHidePage('detail/') + scope.row.id }"
                  > 查看优惠日志 </router-link
                >
                <!--<i class="iconfont icon-trash-alt" @click="deleteActivityAction(scope.row)"></i> -->
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="content-padded content-center">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :current-page.sync="params.page"
            :page-sizes="[10, 20, 50]"
            :total="total_count"
            :page-size="params.pageSize"
          >
          </el-pagination>
        </div>
      </el-tabs>
      <el-dialog
        title="添加定向促销"
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
            <el-form-item label="针对人群">
              <el-autocomplete
                class="inline-input"
                clearable
                v-model="form.specific_name"
                :fetch-suggestions="querySearch"
                placeholder="请输入会员标签名称"
                @select="selectTag"
                size="mini"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="周期选择">
              <el-radio v-model="form.cycle_type" @change="cycleType" label="1">自然月</el-radio>
              <el-radio v-model="form.cycle_type" @change="cycleType" label="2">特定时段</el-radio>
            </el-form-item>
            <el-form-item label="活动有效时间">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-date-picker
                    type="datetime"
                    default-time="00:00:00"
                    :disabled="form.cycle_type == '1' ? true : false"
                    format="yyyy/MM/dd HH:mm:ss"
                    value-format="timestamp"
                    v-model="form.start_time"
                    placeholder="选择日期时间"
                  >
                  </el-date-picker>
                </el-col>
                <el-col :span="1">
                  ~
                </el-col>
                <el-col :span="8">
                  <el-date-picker
                    type="datetime"
                    default-time="23:59:59"
                    :disabled="form.cycle_type == '1' ? true : false"
                    format="yyyy/MM/dd HH:mm:ss"
                    value-format="timestamp"
                    v-model="form.end_time"
                    placeholder="选择日期时间"
                  >
                  </el-date-picker>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="周期内优惠折扣">
              <el-input
                v-model="form.discount"
                placeholder="请输入内容"
                style="width:20%"
              ></el-input
              >%
            </el-form-item>
            <el-form-item label="周期内优惠限额">
              <el-input
                v-model="form.limit_total_money"
                placeholder="请输入内容"
                style="width:20%"
              ></el-input
              >元
            </el-form-item>
            <el-form-item label="状态">
              <el-radio v-model="form.status" label="1">暂存</el-radio>
              <el-radio v-model="form.status" label="2">直接发布</el-radio>
              <el-radio v-model="form.status" label="3">停用</el-radio>
            </el-form-item>
            <el-form-item>
              <el-button @click.native="handleCancel">取消</el-button>
              <el-button type="primary" @click="submitAction">保存</el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-dialog>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getTagList } from '@/api/member'
import {
  createSpecificcrowddiscount,
  updateSpecificcrowddiscount,
  getListSpecificcrowddiscount,
  getInfoSpecificcrowddiscount
} from '@/api/promotions'
import shopSelect from '@/components/shopSelect'

export default {
  provide() {
    return {
      refresh: this.getDataLists
    }
  },
  components: {
    shopSelect
  },
  data() {
    return {
      activeName: 'all',
      cursymbol: '￥',
      loading: false,
      create_time: '',
      params: {
        page: 1,
        pageSize: 20
      },
      activityItemParams: {
        page: 1,
        pageSize: 20
      },
      mount: '3',
      memberTagList: [{ 'value': '---无----', 'tag_id': 0 }],
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
      specific_name: ''
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  methods: {
    // 切换tab
    handleClick(tab, event) {
      this.activeName = tab.name
      this.params.status = tab.name == 'all' ? '' : tab.name
      this.params.page = 1
      this.getDataLists()
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
            this.memberTagList.push({ 'value': row.tag_name, 'tag_id': row.tag_id })
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
    byTagSearch(tagdata) {
      this.params.specific_id = tagdata.tag_id
      this.params.page = 1
      this.getDataLists()
    },
    submitAction() {
      // this.form.start_time = this.dateStrToTimeStamp(this.form.start_time)
      // this.form.end_time = this.dateStrToTimeStamp(this.form.end_time)
      const obj = {
        start_time: this.dateStrToTimeStamp(this.form.start_time),
        end_time: this.dateStrToTimeStamp(this.form.end_time)
      }

      if (this.form.id) {
        updateSpecificcrowddiscount({...this.form,...obj}).then((res) => {
          this.getDataLists()
          this.activityItemDialog = false
        })
      } else {
        createSpecificcrowddiscount({...this.form,...obj}).then((res) => {
          this.$message.success('创建成功')
          this.getDataLists()
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
    dateChange(val) {
      if (val.length > 0) {
        this.params.start_time = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.end_time = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      }
      this.params.page = 1
      this.getDataLists()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.loading = false
      this.getDataLists()
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getDataLists()
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    getDataLists() {
      this.loading = true
      var filter = this.params
      getListSpecificcrowddiscount(filter).then((response) => {
        this.list = response.data.data.list
        this.total_count = Number(response.data.data.total_count)
        this.loading = false
      })
    },

    updateStatusCommunityAction(row) {
      var msg = '此操作将永久终止该活动, 是否继续?'
      this.$confirm(msg, '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            removeMarketingActivity({ marketing_id: row.marketing_id, isEnd: true }).then(
              (response) => {
                this.getDataLists()
                this.$message({
                  message: '修改活动状态成功',
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
  },
  mounted() {
    this.getAllMemberTagList()
    this.getDataLists()
  }
}
</script>
