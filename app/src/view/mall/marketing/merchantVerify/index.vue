<template>
  <div class="merchantVerify">
    <div v-if="$route.path.indexOf('verify') === -1">
      <div class="query">
        <el-form :model="query" ref="myForm" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="审批状态" prop='audit_status'>
                <el-select
                  v-model="query.audit_status"
                  placeholder="请选择审批状态"
                  class="input-m"
                >
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
              <el-form-item label="商户名称" prop='merchant_name'>
                <el-input
                  class="input-m"
                  placeholder="请输入"
                  clearable
                  v-model="query.merchant_name"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属地区">
                <el-cascader
                  placeholder="根据地区筛选"
                  :options="regions"
                  filterable
                  clearable
                  v-model="regions_value"
                  :props="{ checkStrictly: true }"
                  @change="RegionChangeSearch"
                  class="input-m"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="入驻类型" prop='settled_type'>
                <el-select v-model="query.settled_type" placeholder="请选择" class="input-m">
                  <el-option label="企业" value="enterprise"></el-option>
                  <el-option label="个体户" value="soletrader"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请日期">
                <el-date-picker
                  class="input-m"
                  v-model="query.time_start"
                  :default-time="['00:00:00', '23:59:59']"
                  type="daterange"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item style="text-align: right;width:91%">
                <el-button type="primary" @click="searchData">查询</el-button>
                <el-button @click="resetForm('myForm')">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-divider></el-divider>
      <el-card v-if="list.length>0"  shadow="never">
        <div class="cus-list" v-for="item in list" :key="item.id">
          <el-row class="cus-row">
            <el-col :span="3">
              <img
                v-if="item.settled_type === 'soletrader'"
                class="cus-row-img"
                style="width:90px;height:90px"
                src="@/assets/img/adapay/distributor.png"
                alt=""
              />
              <img
                v-else
                class="cus-row-img"
                src="@/assets/img/adapay/dealer.png"
                alt=""
              />
            </el-col>
            <el-col :span="13">
              <router-link :to="{ path:matchHidePage('verify'), query: { type:'verify',merchantId: item.id } }">
                <span class="cus-row-name">{{ item.merchant_name }}</span>
              </router-link>
              <div class="cus-row-time">
                <span
                  >申请时间：{{ item.created ? createTimeFilter(item.created) : '-' }}</span
                >
                <span>所属地区：{{ item.province+'-'+item.city+'-'+item.area || '-' }}</span>
              </div>
            </el-col>
            <el-col :span="5">
              <img
                v-if="item.audit_status === '2'"
                src="@/assets/img/adapay/pass.png"
                alt=""
                style="width: 85px; height: 85px"
              />
              <img
                v-if="item.audit_status === '3'"
                src="@/assets/img/adapay/reject.png"
                alt=""
                style="width: 92px; height: 92px"
              />
            </el-col>
            <el-col class="cus-row-btn" :span="3" :offset="item.audit_status !== '1'?0:5">
              <router-link
                v-if="item.audit_status === '1'"
               :to="{ path:matchHidePage('verify'), query: { type:'verify',merchantId: item.id } }"
              >
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
            :current-page.sync="query.page"
            :page-sizes="[10, 20, 50]"
            :total="count"
            :page-size="query.page_size"
          >
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
import { getApplicationListForMerchantEntry } from '@/api/mall/marketing.js'
export default {
  data() {
    return {
      loading: true,
      regions: district,
      create_time: [],
      currentArea: {},
      query: {
        page: 1,
        page_size: 20,
        merchant_name: '',
        audit_status: '',
        settled_type: '',
        time_start:[]
      },
      regions_value: [],
      approveStatusList: [
        { name: '待审批', value: '1' },
        { name: '通过', value: '2' },
        { name: '驳回', value: '3' }
      ],
      count: 0,
      list: []
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.getList()
  },
  methods: {
    searchData(e) {
      this.query.page = 1
      this.getList()
      console.log(this.query)
    },
    handleCurrentChange(val) {
      this.query.page = val
      this.loading = false
      this.getList()
    },
    handleSizeChange(page_size) {
      this.loading = false
      this.query.page = 1
      this.query.page_size = page_size
      this.getList()
    },
    async getList() {
      this.loading = true
      const result = await getApplicationListForMerchantEntry({ ...this.query, ...this.currentArea })
      this.list = result.data.data.list
      this.count = result.data.data.count
      this.loading = false
    },
    RegionChangeSearch(value) {
      console.log(value)
      var vals = this.getCascaderObj(value, this.regions)
      if (vals.length == 1) {
        this.currentArea.province = vals[0].label
      } else if (vals.length == 2) {
        this.currentArea.city = vals[1].label
      } else if (vals.length == 3) {
        this.currentArea.area = vals[2].label
      } else {
        this.currentArea = {}
      }
    },
    getCascaderObj(val, opt) {
      return val.map(function (value, index, array) {
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
        this.regions_value = []
        this.query.time_start = []
        this.currentArea ={}
        
        this.getList();
    },
    createTimeFilter(time) {
      return moment(time * 1000).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  beforeRouteUpdate(to, from, next) {
    next()
    if (to.path.indexOf('verify') === -1) {
      this.getList()
    }
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
      font-size: 20px;
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

<style lang="scss">
.merchantVerify {
  .input-m {
    width: 90% !important;
  }
}
</style>

