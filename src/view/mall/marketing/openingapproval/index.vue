<template>
  <div>
    <div v-if="$route.path.indexOf('approve') === -1">
      <el-card class="cus-card">
        <el-form :model="params" :inline="true" ref="myForm" label-width="120px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="审批状态">
                <el-select v-model="params.status" placeholder="请选择审批状态" class="input-m">
                  <el-option
                    v-for="(item, index) in approveStatusList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商户名称">
                <el-input class="input-m" placeholder="请输入" clearable v-model="params.user_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属地区">
                <el-cascader
                  placeholder="根据地区筛选"
                  :options="regions"
                  filterable
                  clearable
                  v-model='regions_value'
                  :props="{ checkStrictly: true }"
                  @change="RegionChangeSearch"
                  class="input-m"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请日期">
                <el-date-picker
                  class="input-m"
                  v-model="create_time"
                  type="daterange"
                  format='yyyy-MM-dd'
                  value-format='yyyy-MM-dd'
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="dateChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="9" style="text-align:center">
              <el-form-item>
                <el-button type="primary" @click="searchData">搜索</el-button>
                <el-button @click="resetForm('myForm')">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card>
        <div class="cus-list" v-for="item in list" :key="item.id">
          <el-row class="cus-row">
            <el-col :span="3">
              <img v-if="item.apply_type === 'distributor'" class="cus-row-img" src="@/assets/img/adapay/distributor.png" alt="">
              <img v-if="item.apply_type === 'dealer'" class="cus-row-img" src="@/assets/img/adapay/dealer.png" alt="">
            </el-col>
            <el-col :span="13">
              <router-link :to="{ path: matchHidePage('approve'), query: { id: item.id}}">
                <span class="cus-row-name">{{item.user_name}}</span>
              </router-link>
              <div class="cus-row-time">
                <span>申请时间：{{item.create_time ? createTimeFilter(item.create_time) : '-'}}</span>
                <span>所属地区：{{item.address || '-'}}</span>
              </div>
            </el-col>
            <el-col :span="5">
              <img v-if="item.status === 'APPROVED'" src="@/assets/img/adapay/pass.png" alt="" style="width:100px;height:84px">
              <img v-if="item.status === 'REJECT'" src="@/assets/img/adapay/reject.png" alt="" style="width:90px;height:89px">
            </el-col>
            <el-col class="cus-row-btn" :span="3" :offset="item.status === 'WAIT_APPROVE' ? 5 : 0">
              <router-link v-if="item.status === 'WAIT_APPROVE'" :to="{ path: matchHidePage('approve'), query: { id: item.id}}">
                <el-button type="primary">审批</el-button>
              </router-link>
              <el-button v-else type="info" plain disabled>已审批</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="content-padded content-center">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :current-page.sync="params.page"
            :page-sizes="[10,20,50]"
            :total="total_count"
            :page-size="params.pageSize">
          </el-pagination>
        </div>
      </el-card>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  import district from '@/common/district.json'
  import { getOpenApprovedList } from '@/api/adapay/dealer'
  import { getAftersalesList, exportList, getAftersalesRemind, setAftersalesRemind } from '@/api/aftersales'
  export default {
    data () {
      return {
        loading: true,
        regions: district,
        create_time: '',
        params: {
          page: 1,
          pageSize: 20,
          user_name: '',
          status: '',
          time_star: '',
          time_end: ''
        },
        regions_value: [],
        approveStatusList: [
          { name: '全部', value: '' },
          { name: '待审批', value: 'WAIT_APPROVE' },
          { name: '审批成功', value: 'APPROVED' },
          { name: '审批失败', value: 'REJECT' }
        ],
        total_count: 0,
        list: []
      }
    },
    computed: {
      ...mapGetters([
        'wheight'
      ])
    },
    methods: {
      dateStrToTimeStamp(str) {
        return Date.parse(new Date(str)) / 1000
      },
      dateChange(val) {
        if (val.length > 0) {
          this.params.time_star = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
          this.params.time_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
        } else {
          this.params.time_star = ''
          this.params.time_end = ''
        }
        this.params.page = 1
      },
      searchData (e) {
        this.params.page = 1
        this.getAftersalesList(this.params)
      },
      handleCurrentChange (val) {
        this.params.page = val
        this.loading = false
        this.getAftersalesList(this.params)
      },
      handleSizeChange (pageSize) {
        this.loading = false
        this.params.page = 1
        this.params.pageSize = pageSize
        this.getAftersalesList(this.params)
      },
      getAftersalesList(params) {
        this.loading = true
        getOpenApprovedList(params).then(response => {
          this.list = response.data.data.list
          this.total_count = Number(response.data.data.total_count)
          this.loading = false
        })
      },
      RegionChangeSearch(value) {
        var vals = this.getCascaderObj(value, this.regions)
        if (vals.length == 1) {
          this.params.address = vals[0].label
        } else if (vals.length == 2) {
          this.params.address = vals[0].label + '-' +vals[1].label
        } else if (vals.length == 3) {
          this.params.address = vals[0].label + '-' + vals[1].label + '-' + vals[2].label
        } else {
          this.params.address = ''
        }
        this.params.page = 1
      },
      getCascaderObj(val, opt) {
        return val.map(function(value, index, array) {
          for (var itm of opt) {
            if (itm.value === value) {
              opt = itm.children
              return itm
            }
          }
          return null
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      createTimeFilter (time) {
        return moment(time * 1000).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    mounted () {
      this.getAftersalesList(this.params)
    }
  }
</script>
<style lang="scss" scoped>
.cus-list {
  .cus-row {
    border: 1px solid #ccc;
    padding: 10px;
    color: #222;
    margin-bottom: 20px !important;
    &-img {
      width: 90px;
      height: 90px;
    }
    &-name {
      font-size: 22px;
      font-weight: bold;
    }
    &-time {
      margin-top: 30px;
      :nth-child(2) {
        margin-left: 60px;
      }
    }
    &-btn {
      height: 90px;
      line-height: 90px;
    }
  }
}
.cus-card {
  .el-row {
    margin-bottom: 0 !important;
  }
}
</style>

