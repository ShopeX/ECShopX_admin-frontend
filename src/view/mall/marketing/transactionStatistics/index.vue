<template>
  <!-- 6.30 -->
  <div class="page-transactionStatistics">
    <el-card
      class="box-card"
      shadow="never"
    >
      <div
        slot="header"
        class="header_"
      >
        <div>平台账户收入</div>
        <div
          class="why"
          @mouseenter="mouseenterHandle(1)"
          @mouseout="mouseoverHandle(1)"
        >
          <img
            src="../../../../assets/img/wenhao.png"
            alt=""
          >

          <div
            v-if="tips_1"
            class="tips"
          >
            <div class="tips_content">
              <h4 class="title">
                平台总计收入（含退款）
              </h4>
              <h5 class="value">
                分账手续费统计（含退款）
              </h5>
            </div>
            <div class="tips_content">
              <h4 class="title">
                平台总退款金额
              </h4>
              <h5 class="value">
                分账手续费总退款金额（已退款成功）
              </h5>
            </div>
            <div class="tips_content">
              <h4 class="title">
                平台未结算金额
              </h4>
              <h5 class="value">
                订单为过售后期进行分账的手续费（不含全额退款成功及退款中）
              </h5>
            </div>
            <div class="tips_content">
              <h4 class="title">
                平台已结算金额
              </h4>
              <h5 class="value">
                已进行分账且成功的手续费金额
              </h5>
            </div>
            <div class="tips_content">
              <h4 class="title">
                当前可提现余额
              </h4>
              <h5 class="value">
                汇付平台账户中当前余额
              </h5>
            </div>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="item">
          <p class="money">
            {{ incomeList.income }}
          </p>
          <p>平台总计收入（含退款）</p>
        </div>
        <div class="item">
          <p class="money">
            {{ incomeList.refund }}
          </p>
          <p>平台总退款金额</p>
        </div>
        <div class="item">
          <p class="money">
            {{ incomeList.unsettled_funds }}
          </p>
          <p>平台未结算金额</p>
        </div>
        <div class="item">
          <p class="money">
            {{ incomeList.settlement_funds }}
          </p>
          <p>平台已结算金额</p>
        </div>
        <div class="item">
          <p class="money">
            {{ incomeList.withdrawal_balance }}
          </p>
          <p>当前可提现余额</p>
        </div>
        <!-- <div class="item">1</div>
        <div class="item">1</div>
        <div class="item">1</div>
        <div class="item">1</div> -->
      </div>
    </el-card>
    <el-card
      class="box-card box-card2"
      shadow="never"
    >
      <div
        slot="header"
        class="header_"
      >
        <div class="left">
          <div class="date">
            <el-date-picker
              v-model="dateValue"
              type="daterange"
              alue-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              value-format="yyyy-MM-dd"
              @change="changeDateHandle"
            />
          </div>
          <div>
            <el-cascader
              v-model="select_regions_value"
              placeholder="省/市/区"
              :options="regions"
              clearable
              @change="RegionChangeSearch"
            />
          </div>
          <div v-if="shopValues.length >= 0">
            <el-select
              v-model="shopValue"
              clearable
              placeholder="请选择"
              @change="selectChange"
            >
              <el-option
                v-for="item in shopValues"
                :key="item.distributor_id"
                :label="item.name"
                :value="item.distributor_id"
              />
            </el-select>
          </div>
        </div>
        <div class="right">
          <div class="btn">
            <el-button
              type="primary"
              size="mini"
              @click="exportHandle"
            >
              导出
            </el-button>
          </div>
          <div
            class="why"
            @mouseenter="mouseenterHandle(2)"
            @mouseout="mouseoverHandle(2)"
          >
            <img
              src="../../../../assets/img/wenhao.png"
              alt=""
            >

            <div
              v-if="tips_2"
              class="tips"
            >
              <div class="tips_content">
                <h4 class="title">
                  当前可提现金额
                </h4>
                <h5 class="value">
                  当前店铺在支付平台账户中余额
                </h5>
              </div>
              <div class="tips_content">
                <h4 class="title">
                  交易总笔数
                </h4>
                <h5 class="value">
                  当前时间段内交易总笔数（含退款）
                </h5>
              </div>
              <div class="tips_content">
                <h4 class="title">
                  总交易金额
                </h4>
                <h5 class="value">
                  当前时间段内总支付金额（含退款）
                </h5>
              </div>
              <div class="tips_content">
                <h4 class="title">
                  已退款总笔数&退款总金额
                </h4>
                <h5 class="value">
                  已退总笔数：当前时间段内退款成功总笔数
                </h5>
                <h5 class="value">
                  退款总金额：当前时间段内退款成功总额
                </h5>
              </div>
              <div class="tips_content">
                <h4 class="title">
                  在退总笔数&在退总金额
                </h4>
                <h5 class="value">
                  在退总笔数：当前时间段内退款中总笔数
                </h5>
                <h5 class="value">
                  在退总金额：当前时间段内退款中总金额
                </h5>
              </div>

              <div class="tips_content">
                <h4 class="title">
                  已结算手续费总额&未结算手续费总额
                </h4>
                <h5 class="value">
                  已结算手续费总额：当前时间段内已分账到平台账户中金额
                </h5>
                <h5 class="value">
                  未结算手续费总额：当前时间段内未分账到平台账户中金额
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content2">
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            prop="distributor_name"
            label="店铺名称"
            width="180"
          />
          <el-table-column
            prop="withdrawal_balance"
            label="当前可提现金额"
          >
            <template slot-scope="scope">
              {{ scope.row.withdrawal_balance && formatMoney(scope.row.withdrawal_balance / 100) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="order_count"
            label="交易总笔数"
          />
          <el-table-column
            prop="order_total_fee"
            label="总交易金额"
          >
            <template slot-scope="scope">
              {{ scope.row.order_total_fee && formatMoney(scope.row.order_total_fee / 100) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="order_refund_count"
            label="已退款总笔数"
          />
          <el-table-column
            prop="order_refund_total_fee"
            label="退款总金额"
          >
            <template slot-scope="scope">
              {{
                scope.row.order_refund_total_fee &&
                  formatMoney(scope.row.order_refund_total_fee / 100)
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="order_refunding_count"
            label="在退总笔数"
          />
          <el-table-column
            prop="order_refunding_total_fee"
            label="在退总金额"
          >
            <template slot-scope="scope">
              <span class="red">
                {{
                  scope.row.order_refunding_total_fee &&
                    formatMoney(scope.row.order_refunding_total_fee / 100)
                }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="order_profit_sharing_charge"
            label="已结算手续费总额"
          >
            <template slot-scope="scope">
              {{
                scope.row.order_profit_sharing_charge &&
                  formatMoney(scope.row.order_profit_sharing_charge / 100)
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="order_un_profit_sharing_charge"
            label="未结算手续费总额"
          >
            <template slot-scope="scope">
              {{
                scope.row.order_un_profit_sharing_charge &&
                  formatMoney(scope.row.order_un_profit_sharing_charge / 100)
              }}
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            :page-sizes="[10, 20, 50]"
            :current-page="page.page"
            :page-size="page.page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total_count"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { get_all, exportData } from '@/api/transactionStatistics'
import district from '@/common/district.json'
import { getDistributorList } from '@/api/marketing'
import { LexModelBuildingService } from 'aws-sdk'

// 取选中地区的值
function getCascaderObj (val, opt) {
  return val.map(function (value, index, array) {
    for (var itm of opt) {
      if (itm.value === value) {
        opt = itm.children
        return itm
      }
    }
    return null
  })
}
export default {
  data () {
    return {
      // 平台账户收入
      incomeList: {},
      // 店铺列表
      shopValue: '',
      shopValues: [],
      distributor_id: '',
      // tips开关
      tips_1: false,
      tips_2: false,
      dateValue: [],
      select_regions_value: [],
      regions: district,
      // 总页数
      total_count: 0,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 0)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 0)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近 7 天',
            onClick (picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 0)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近 15 天',
            onClick (picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 15)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 0)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近 30 天',
            onClick (picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 0)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近 90 天',
            onClick (picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 0)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      page: {
        page: 1,
        page_size: 10
      },
      params: {
        name: '',
        mobile: '',
        is_valid: '',
        province: '',
        city: '',
        area: ''
      },
      pickerDate: {
        startTime: '',
        endTime: ''
      },
      // DefaultShow: new Date(),
      tableData: [],
      loading: false
    }
  },
  computed: {
    //获取当前时间，格式YYYY-MM-DD
    getNowFormatDate () {
      var date = new Date()
      console.log(date)
      var seperator1 = '-'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate
      return currentdate
    }
  },
  created () {},
  mounted () {
    this.dateValue = [this.getNowFormatDate, this.getNowFormatDate]
    this.get_config()
    this.getList()
  },

  methods: {
    async get_config () {
      this.loading = true
      const parmes = {
        start_date: this.dateValue[0],
        end_date: this.dateValue[1],
        ...this.page,
        distributor_id: this.distributor_id
      }
      const result = await get_all(parmes)
      this.loading = false
      this.incomeList = result.data.data.totle
      this.tableData = result.data.data.list.data
      this.total_count = result.data.data.list.total_count
      if (this.total_count <= 0) {
        this.$message.error('暂无数据')
      }
    },
    mouseenterHandle (type) {
      if (type == 1 && !this.tips_1) {
        this.tips_1 = true
      } else if (type == 2 && !this.tips_2) {
        console.log(122)
        this.tips_2 = true
      }
    },
    mouseoverHandle (type) {
      if (type == 1 && this.tips_1) {
        this.tips_1 = false
      } else if (type == 2 && this.tips_2) {
        this.tips_2 = false
      }
    },
    // 选择时间方法
    changeDateHandle () {
      if (this.dateValue) {
        let timeDay =
          (new Date(this.dateValue[1]) - new Date(this.dateValue[0])) / (1000 * 60 * 60 * 24)
        if (timeDay > 90) {
          this.$message.error('所选日期不能大于90天')
          this.dateValue = [this.getNowFormatDate, this.getNowFormatDate]
          this.get_config()
        } else {
          this.get_config(this.dateValue[0], this.dateValue[1])
        }
      } else {
        this.$nextTick(() => {
          this.dateValue = [this.getNowFormatDate, this.getNowFormatDate]
          this.get_config()
        })
      }
    },

    searchAction (val) {
      console.log(val)
    },
    RegionChangeSearch (value) {
      this.shopValue = ''
      this.distributor_id = ''
      console.log(value)
      var vals = getCascaderObj(value, this.regions)
      if (vals.length == 1) {
        this.params.province = vals[0].label
        this.params.city = ''
        this.params.area = ''
      } else if (vals.length == 2) {
        this.params.province = vals[0].label
        this.params.city = vals[1].label
        this.params.area = ''
      } else if (vals.length == 3) {
        this.params.province = vals[0].label
        this.params.city = vals[1].label
        this.params.area = vals[2].label
      }
      console.log(this.params)
      console.log(this.select_regions_value)
      if (this.select_regions_value.length == 0) {
        this.params.area = ''
        this.params.city = ''
        this.params.province = ''
        this.get_config()
      }
      this.getList()
    },
    // 获取店铺列表
    async getList () {
      try {
        const result = await getDistributorList(this.params)
        this.shopValues = result.data.data.list
      } catch (err) {
        this.$message({
          message: '获取店铺失败',
          type: 'error'
        })
      }
    },
    formatMoney (num) {
      var result = parseFloat(num)
      if (isNaN(result)) {
        console('传递参数错误，请检查！')
        return false
      }
      result = Math.round(num * 100) / 100
      var s_x = result.toString()
      var pos_decimal = s_x.indexOf('.')
      if (pos_decimal < 0) {
        pos_decimal = s_x.length
        s_x += '.'
      }
      while (s_x.length <= pos_decimal + 2) {
        s_x += '0'
      }
      return '￥' + s_x
    },
    //  修改一页显示多少行数据
    handleSizeChange (page_size) {
      this.page.page_size = page_size
      this.get_config()
    },
    // 修改页数
    handleCurrentChange (page) {
      this.page.page = page
      this.get_config()
    },
    // 监听店铺选择的id
    selectChange (val) {
      this.distributor_id = val
      this.get_config()
    },
    // 导出
    async exportHandle () {
      const params = {
        start_date: this.dateValue[0],
        end_date: this.dateValue[1],
        distributor_id: this.distributor_id
      }
      // if (this.total_count<=0) {
      //   return this.$message.error('暂无数据')
      // }
      const result = await exportData(params)
      if (result.data.data.status) {
        return this.$message.success('导出成功')
      }
    }
  }
}
</script>
<style lang="scss">
.page-transactionStatistics {
  .el-card__header {
    padding: 10px 20px;
    background-color: #f5f7fa;
    .header_ {
      width: 100%;
      display: flex;
      align-items: center;
      text-align: left;
      justify-content: space-between;
    }
  }
  .why {
    width: 20px;
    height: 20px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.el-card {
  border-radius: 4px;
  overflow: visible !important;
}
</style>

<style lang="scss" scoped>
.page-transactionStatistics {
  .why {
    position: relative;
    .tips {
      position: absolute;
      top: 120%;
      right: 0;
      padding: 15px;
      z-index: 999;
      border-radius: 4px;
      width: 280px;
      border: 1px solid #f5f7fa;
      // left: -50px;

      background: #fff;
      .tips_content {
        margin-bottom: 20px;
      }
    }
  }
  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .item {
      flex: 1;
      margin: 0 auto;
      text-align: center;
      p {
        font-size: 14px;
      }
      .money {
        margin-bottom: 6px;
        font-size: 20px;
        font-weight: 700;
        color: #000;
      }
    }
  }
  .content2 {
    .pagination {
      text-align: center;
      padding: 20px 0;
    }
    .red {
      color: red;
    }
  }
  .box-card2 {
    .left {
      display: flex;
      align-items: center;
      .day {
        margin-right: 20px;
      }
      .date {
        margin-right: 20px;
      }
    }
    .right {
      display: flex;
      align-items: center;
      .btn {
        margin-right: 20px;
      }
    }
  }
}
</style>

<style lang="scss">
.page-transactionStatistics {
  .el-date-editor .el-range-separator {
    width: 6%;
  }
}
</style>
