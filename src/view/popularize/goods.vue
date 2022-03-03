<template>
  <div>
    <div class="content-bottom-padded">
      <el-row
        class="content-bottom-padded"
        :gutter="20"
      >
        <el-col :span="6">
          <el-input
            v-model="params.keywords"
            style="width: 100%"
            size="mini"
            placeholder="请输入商品名称"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="goodsSearch"
            />
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="status"
            size="mini"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-button-group>
            <el-button
              type="primary"
              size="mini"
              @click="showChangeRebateType()"
            >
              批量设置返佣任务制
            </el-button>
            <el-button
              size="mini"
              @click="handleBatchChangeStatus()"
            >
              批量设置返佣状态
            </el-button>
          </el-button-group>
        </el-col>
      </el-row>
    </div>
    <el-tabs
      v-model="activeName"
      type="border-card"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="item.name"
        :name="item.activeName"
      >
        <el-table
          ref="multipleItemsTable"
          v-loading="loading"
          :data="itemsList"
          style="width: 100%"
          :height="wheight - 240"
          @selection-change="handleItemsSelectionChange"
          @filter-change="filterHandler"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="操作"
            width="160"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                class="btn-gap"
                @click="handleRebateConf(scope.row, 1)"
              >
                分销参数
              </el-button>
              <el-button
                type="text"
                class="btn-gap"
                @click="handleRebateConf(scope.row, 2)"
              >
                任务参数
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="返佣状态"
            width="160"
            column-key="rebate"
            :filters="[
              { text: '支持返佣', value: '1' },
              { text: '不支持返佣', value: '0' },
              { text: '等待审核', value: '2' },
              { text: '拒绝加入', value: '3' }
            ]"
            :filter-multiple="false"
          >
            <template slot-scope="scope">
              <div v-if="allSelect && $store.getters.login_type != 'distributor'">
                <el-switch
                  v-model="allSelect"
                  active-color="#13ce66"
                  disabled
                />
              </div>
              <div v-else>
                <el-tag
                  v-if="scope.row.rebate_audit === 2"
                  size="mini"
                >
                  等待审核
                </el-tag>
                <el-tag
                  v-if="scope.row.rebate_audit === 3"
                  size="mini"
                  type="warning"
                >
                  审核拒绝
                </el-tag>
                <el-switch
                  v-if="
                    scope.row.rebate_audit === 2 ||
                      (scope.row.rebate_audit === 1 && $store.getters.login_type == 'distributor')
                  "
                  v-model="scope.row.rebate"
                  disabled
                  active-color="#13ce66"
                  @change="switchStatusChange(scope.row)"
                />
                <el-switch
                  v-else
                  v-model="scope.row.rebate"
                  active-color="#13ce66"
                  @change="switchStatusChange(scope.row)"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="商品图片"
            width="80"
          >
            <template slot-scope="scope">
              <el-avatar
                shape="square"
                :size="60"
                fit="fit"
                :src="scope.row.pics[0]"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="标题"
            prop="item_name"
            min-width="250"
          />
          <el-table-column label="销售价">
            <template slot-scope="scope">
              {{ scope.row.price / 100 }}元
            </template>
          </el-table-column>
          <el-table-column label="成本价">
            <template slot-scope="scope">
              {{ scope.row.cost_price / 100 }}元
            </template>
          </el-table-column>
          <el-table-column
            prop="store"
            label="库存"
            width="80"
          />
          <el-table-column
            prop="approve_status"
            label="状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.approve_status === 'onsale'"
                type="success"
                class="grid-content"
              >
                前台可销售
              </el-tag>
              <el-tag
                v-else-if="scope.row.approve_status === 'offline_sale'"
                type="info"
                class="grid-content"
              >
                可线下销售
              </el-tag>
              <el-tag
                v-else
                type="danger"
                class="grid-content"
              >
                不可销售
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
        <div class="content-padded content-center">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next"
            :current-page.sync="params.page"
            :page-sizes="[10, 20, 50]"
            :total="total_count"
            :page-size="params.pageSize"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
    <SideBar
      :visible.sync="show_task_sideBar"
      title="任务制配置"
      width="67"
    >
      <slot>
        <el-card class="box-card">
          <div
            slot="header"
            class="clearfix"
          >
            <span class="title">{{ current.item_name }}</span>
            <span>
              <!-- <el-alert title="比例计算"
                description="积分  计算方式：返佣金额*积分与现金的抵扣比例，其中返佣金额为满足条件自定义，如果不填则不进行返佣"
                type="info" close-text=" " class="alert-text" show-icon>
              </el-alert> -->
              <el-alert
                :title="alertTip.title"
                :description="alertTip.description"
                type="info"
                close-text=" "
                class="alert-text"
                show-icon
              />
            </span>
          </div>
          <el-radio-group v-model="current.rebate_type">
            <el-radio label="default">
              不支持任务制
            </el-radio>
            <el-radio label="total_money">
              任务制-按总金额
            </el-radio>
            <el-radio label="total_num">
              任务制-按总数量
            </el-radio>
          </el-radio-group>
        </el-card>
        <el-card
          v-if="current.rebate_type != 'default'"
          class="box-card"
        >
          <el-table :data="rebateSpecItems">
            <el-table-column
              label="规格"
              prop="item_spec_desc"
              min-width="120"
            >
              <template
                slot-scope="scope"
              >
                <span v-if="scope.row.item_spec_desc">{{ scope.row.item_spec_desc }}</span><span v-else>单规格</span>
              </template>
            </el-table-column>
            <el-table-column
              label="销售价"
              min-width="80"
            >
              <template slot-scope="scope">
                ¥{{ scope.row.price / 100 }}
              </template>
            </el-table-column>
            <el-table-column
              label="成本价"
              min-width="80"
            >
              <template slot-scope="scope">
                ¥{{ scope.row.cost_price / 100 }}
              </template>
            </el-table-column>
            <!--el-table-column label="类型" width="140">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.rebate_conf.rebate_task_type" active-value="money" inactive-value="ratio" active-text="金额" inactive-text="比例"> </el-switch>
              </template>
            </el-table-column-->
            <el-table-column
              v-for="(item, key) in floorHead"
              :key="key"
              :label="item.label"
              min-width="120"
            >
              <template slot-scope="scope">
                满足条件
                <el-input
                  v-model="scope.row.rebate_conf.rebate_task[key].filter"
                  :min="0"
                  size="mini"
                  type="number"
                  @input="changeLimit(arguments[0], key, scope.row)"
                />

                返佣
                <el-input
                  v-if="scope.row.rebate_conf.rebate_task_type == 'money'"
                  v-model="scope.row.rebate_conf.rebate_task[key].money"
                  size="mini"
                  type="number"
                  suffix-icon="iconfont icon-yen-sign"
                />
                <el-input
                  v-else
                  v-model="scope.row.rebate_conf.rebate_task[key].ratio"
                  size="mini"
                  type="number"
                  suffix-icon="iconfont icon-percent"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <div slot="footer">
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="saveRebateConf"
          >
            保存
          </el-button>
        </div>
      </slot>
    </SideBar>
    <SideBar
      :visible.sync="show_sideBar"
      title="分销参数配置"
      width="67"
    >
      <slot>
        <el-card class="box-card">
          <div
            slot="header"
            class="clearfix"
          >
            <span class="title">{{ current.item_name }}</span>
            <div class="frm-tips">
              如果设置的返佣为固定金额，返佣金额就是设置的固定金额。否则按照
              【返佣计算类型】计算返佣
            </div>
            <span
              v-if="
                popularizeSetting.popularize_ratio.type == 'profit' &&
                  popularizeSetting.commission_type == 'money'
              "
            >
              <el-alert
                title="返佣计算类型: 【按利润分佣】"
                description="计算方式：商品利润 ×  百分比，其中商品利润为【支付金额-运费-商品成本价】，如果不填则不进行返佣"
                type="info"
                close-text=" "
                class="alert-text"
                show-icon
              />
            </span>
            <span
              v-else-if="
                popularizeSetting.popularize_ratio.type == 'profit' &&
                  popularizeSetting.commission_type == 'point'
              "
            >
              <el-alert
                title="返佣计算类型: 【按利润分佣】"
                description="计算方式： 商品利润 × 百分比 × 积分与现金的抵扣比例，其中商品利润为【支付金额-运费-商品成本价】，如果不填则不进行返佣"
                type="info"
                close-text=" "
                class="alert-text"
                show-icon
              />
            </span>
            <span
              v-else-if="
                popularizeSetting.popularize_ratio.type == 'order_money' &&
                  popularizeSetting.commission_type == 'money'
              "
            >
              <el-alert
                title="返佣计算类型: 【按订单金额分佣】"
                description="计算方式： 订单金额 × 百分比，其中订单金额为【支付金额-运费】，如果不填则使用通用配置返佣"
                type="info"
                close-text=" "
                class="alert-text"
                show-icon
              />
            </span>
            <span
              v-else-if="
                popularizeSetting.popularize_ratio.type == 'order_money' &&
                  popularizeSetting.commission_type == 'point'
              "
            >
              <el-alert
                title="返佣计算类型: 【按订单金额分佣】"
                description="计算方式： 订单金额 × 百分比 × 积分与现金的抵扣比例，其中订单金额为【支付金额-运费】，如果不填则使用通用配置返佣"
                type="info"
                close-text=" "
                class="alert-text"
                show-icon
              />
            </span>
          </div>
          <el-table :data="rebateSpecItems">
            <el-table-column
              label="规格"
              prop="item_spec_desc"
              min-width="120"
            >
              <template
                slot-scope="scope"
              >
                <span v-if="scope.row.item_spec_desc">{{ scope.row.item_spec_desc }}</span><span v-else>单规格</span>
              </template>
            </el-table-column>
            <el-table-column
              label="销售价"
              min-width="80"
            >
              <template slot-scope="scope">
                ¥{{ scope.row.price / 100 }}
              </template>
            </el-table-column>
            <el-table-column
              label="成本价"
              min-width="80"
            >
              <template slot-scope="scope">
                ¥{{ scope.row.cost_price / 100 }}
              </template>
            </el-table-column>
            <el-table-column
              label="类型"
              width="160"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.rebate_conf.type"
                  active-value="money"
                  inactive-value="ratio"
                  active-text="金额"
                  inactive-text="比例"
                />
              </template>
            </el-table-column>
            <el-table-column
              v-for="(item, key) in popularizeSetting.popularize_ratio.profit"
              :key="key"
              :label="item.name"
              min-width="110"
            >
              <template slot-scope="scope">
                <el-input
                  v-if="scope.row.rebate_conf.type == 'money'"
                  v-model="scope.row.rebate_conf.value[key]"
                  type="number"
                  size="mini"
                  suffix-icon="iconfont icon-yen-sign"
                />
                <el-input
                  v-else
                  v-model="scope.row.rebate_conf.value[key]"
                  size="mini"
                  type="number"
                  suffix-icon="iconfont icon-percent"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <div slot="footer">
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="saveRebateConf"
          >
            保存
          </el-button>
        </div>
      </slot>
    </SideBar>
    <el-dialog
      title="更改商品返佣任务制支持"
      :visible.sync="changeRebateTypeVisible"
      width="30%"
    >
      <el-radio-group v-model="changeRebateType">
        <el-radio label="default">
          不支持任务制
        </el-radio>
        <el-radio label="total_money">
          任务制-按总金额
        </el-radio>
        <el-radio label="total_num">
          任务制-按总数量
        </el-radio>
      </el-radio-group>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="changeRebateTypeVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleBatchChange"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import store from '@/store'
import { mapGetters } from 'vuex'
import SideBar from '@/components/element/sideBar'
import { getPopularizeSetting } from '../../api/promotions'
import { getItemsList, updateItemRebateConf, updateGoodsInfo } from '@/api/goods'

let changeRebateTypeMap = {
  default: {
    title: '不支持任务制：商品不按任务制模式获得佣金',
    description: ''
  },
  total_money: {
    title: '任务制：商品月度销售金额设置',
    description:
      '任务制说明：阶梯设置商品月度销售金额目标及对应返佣佣金，每月月底达标后可获得佣金。'
  },
  total_num: {
    title: '任务制：商品月度销售数量设置',
    description:
      '任务制说明：阶梯设置商品月度销售数量目标及对应返佣佣金，每月月底达标后可获得佣金。'
  }
}

export default {
  components: {
    SideBar
  },
  data () {
    return {
      changeRebateType: 'default',
      changeRebateTypeVisible: false,
      current: {},
      selectGoodsIds: [],
      rebateSpecItems: [],
      show_sideBar: false,
      show_task_sideBar: false,
      activeName: 'first',
      submitLoading: false,
      allSelect: false,
      total_count: 0,
      loading: false,
      itemsList: [],
      changeRebateTypeMap,
      params: {
        item_type: 'normal',
        page: 1,
        pageSize: 10,
        keywords: ''
      },
      popularizeSetting: {
        popularize_ratio: {
          type: 'profit'
        }
      },
      tabList: [
        { name: '全部返佣商品', value: null, activeName: 'first' },
        { name: '不支持任务制', value: 'true', activeName: 'default' },
        { name: '任务制-按总金额', value: 'true', activeName: 'total_money' },
        { name: '任务制-按总数量', value: 'true', activeName: 'total_num' }
      ],
      floorHead: [
        {
          label: '第一阶梯',
          property: 'name'
        },
        {
          label: '第二阶梯',
          property: 'name'
        },
        {
          label: '第三阶梯',
          property: 'name'
        }
      ],
      statusOptions: [
        { value: 1, label: '启用' },
        { value: 2, label: '未启用' }
      ],
      status: '',
      alertTip: {
        title: '',
        description: ''
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    status: {
      handler: function (val) {
        this.getGoodsList(val)
      }
    },
    'current.rebate_type': {
      handler: function (val) {
        val = val ? val : 'default'
        this.alertTip = {
          title: changeRebateTypeMap[val].title,
          description: changeRebateTypeMap[val].description
        }
      },
      immediate: true
    }
  },
  mounted () {
    getPopularizeSetting().then((res) => {
      this.popularizeSetting = res.data.data
      if (res.data.data.goods == 'all') {
        this.allSelect = true
      } else {
        this.allSelect = false
      }
      this.getGoodsList()
    })
  },
  methods: {
    handleChangeRebate: function (e) {
      console.log('===', e)
    },
    filterHandler (filters) {
      this.params.page = 1
      this.params.rebate = filters.rebate[0]
      this.getGoodsList()
    },
    handleClick () {
      if (this.activeName != 'first') {
        this.params.rebate_type = this.activeName
      } else {
        this.params.rebate_type = ''
      }
      this.params.page = 1
      this.getGoodsList()
    },
    handleSizeChange (pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getGoodsList()
    },
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getGoodsList()
    },
    handleItemsSelectionChange (val) {
      let goods_id = []
      for (let i in val) {
        goods_id.push(val[i].goods_id)
      }
      this.selectGoodsIds = goods_id
    },
    showChangeRebateType () {
      if (this.selectGoodsIds.lenght == 0) {
        this.$message({
          type: 'success',
          message: '未选择商品，无需更新'
        })
      } else {
        this.changeRebateTypeVisible = true
        this.changeRebateType = this.activeName
      }
    },
    goodsSearch () {
      this.params.page = 1
      this.getGoodsList()
    },
    switchStatusChange (data) {
      var rebate = data.rebate ? 1 : 0
      updateGoodsInfo({ goods_id: data.goods_id, rebate: rebate }).then((res) => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.getGoodsList()
      })
    },
    handleBatchChangeStatus () {
      console.log('====handleBatchChangeStatus===>', this.selectGoodsIds)
      if (this.selectGoodsIds.length == 0) {
        this.$message({
          type: 'success',
          message: '未选择商品，无需更新'
        })
      } else {
        updateGoodsInfo({ goods_id: this.selectGoodsIds, rebate: 1 }).then((res) => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.getGoodsList()
        })
      }
    },
    handleBatchChange () {
      // console.log(rebate_task)
      if (this.selectGoodsIds.length == 0) {
        this.$message({
          type: 'success',
          message: '未选择商品，无需更新'
        })
        this.changeRebateTypeVisible = false
      } else {
        updateGoodsInfo({ goods_id: this.selectGoodsIds, rebate_type: this.changeRebateType }).then(
          (res) => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.changeRebateTypeVisible = false
            this.getGoodsList()
          }
        )
      }
    },
    saveRebateConf () {
      console.log(this.current.rebate_type)
      var rebateConf = []
      var firstMoney, firstFilter
      var rebateTask = []
      this.rebateSpecItems.forEach((item) => {
        var rebate_conf = item.rebate_conf
        rebate_conf.ratio_type = this.popularizeSetting.popularize_ratio.type
        firstMoney = rebate_conf.rebate_task[0].money
        firstFilter = rebate_conf.rebate_task[0].filter
        rebateTask = rebate_conf.rebate_task

        rebateConf.push(rebate_conf)
      })
      var errorMsg = ''
      var succCount = 0
      rebateTask.forEach((item, index) => {
        if (item.money != '' && item.filter != '') {
          succCount++
        }
      })
      rebateTask.forEach((item, index) => {
        if (succCount > 0) {
          if ((item.money != '' && item.filter == '') || (item.money == '' && item.filter != '')) {
            errorMsg = '满足条件或返佣金额不能为空'
          }
        }
        // else{
        //   if(item.money == '' || item.filter == ''){
        //     debugger
        //     errorMsg = '满足条件或返佣金额不能为空'
        //   }
        // }
      })
      if (this.current.rebate_type != 'default') {
        if (errorMsg != '') {
          this.$message({
            type: 'error',
            message: '满足条件或返佣金额不能为空'
          })
          return
        }
      }

      updateItemRebateConf({
        rebateConf: JSON.stringify(rebateConf),
        rebate_type: this.current.rebate_type
      }).then((res) => {
        this.$message({ message: '保存成功', type: 'success', duration: 2 * 1000 })
      })
    },
    handleRebateConf (data, type) {
      if (type == 1) {
        this.show_sideBar = true
        this.show_task_sideBar = false
      } else {
        this.show_sideBar = false
        this.show_task_sideBar = true
      }
      this.current = data
      getItemsList({
        page: 1,
        pageSize: 1000,
        is_sku: true,
        item_id: data.item_id,
        item_type: 'normal'
      }).then((res) => {
        var rebateSpecItems = []
        res.data.data.list.forEach((item) => {
          if (item.rebate_conf.length === 0) {
            item.rebate_conf = {}
            item.rebate_conf.type = 'money'
            item.rebate_conf.rebate_task_type = 'money'
            item.rebate_conf.value = {}
            for (var key in this.popularizeSetting.popularize_ratio.profit) {
              item.rebate_conf.value[key] = ''
            }
          } else {
            if (
              this.popularizeSetting.popularize_ratio.type != item.rebate_conf.ratio_type &&
              item.rebate_conf.type != 'money'
            ) {
              for (var key in this.popularizeSetting.popularize_ratio.profit) {
                item.rebate_conf.value[key] = ''
              }
            }
          }

          if (!item.rebate_conf.rebate_task) {
            item.rebate_conf.rebate_task = []
            for (var n in [0, 1, 2]) {
              item.rebate_conf.rebate_task[n] = {}
              item.rebate_conf.rebate_task[n].filter = ''
              item.rebate_conf.rebate_task[n].ratio = ''
              item.rebate_conf.rebate_task[n].money = ''
            }
          }

          item.rebate_conf.item_id = item.item_id
          rebateSpecItems.push(item)
        })
        this.rebateSpecItems = rebateSpecItems
      })
    },
    getGoodsList (status) {
      this.loading = true
      if (status === 1 || status === 2 || !status) {
        this.params.rebate = status ? (status === 1 ? 1 : 0) : undefined
      }
      getItemsList(this.params).then((response) => {
        this.itemsList = response.data.data.list
        this.itemsList.forEach((item) => {
          item.rebate_audit = ''
          item.rebate_audit = item.rebate
          item.rebate = item.rebate === 1 ? true : false
        })
        console.log(this.itemsList)
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },

    nextChange (value, key, row) {
      let index = this.rebateSpecItems.findIndex((v) => v.itemId === row.itemId)
      // 下一个的值
      let next = this.rebateSpecItems[index].rebate_conf.rebate_task[key + 1].filter
      if (next <= Number(value)) {
        row.rebate_conf.rebate_task[key + 1].filter = Number(value) + 1
        this.$nextTick(() => {
          row.rebate_conf.rebate_task[key + 1].filter = Number(value) + 1
        })
      }
    },

    // 变更限制
    changeLimit (value, key, row) {
      console.log(value, key, row, '当前数据')
      console.log(this.rebateSpecItems, '列表的数据')
      // 限制后级的最小值要大于上级
      if (key > 0) {
        let index = this.rebateSpecItems.findIndex((v) => v.itemId === row.itemId)
        // 上一个的值
        let last = this.rebateSpecItems[index].rebate_conf.rebate_task[key - 1].filter
        if (last !== '') {
          row.rebate_conf.rebate_task[key].filter = Number(value)
          this.$nextTick(() => {
            let newVal = Math.max(Number(value), Number(last) + 1)
            row.rebate_conf.rebate_task[key].filter = Number(newVal)
          })
        }
      }
      // 变更上级，下级小于等于上级时自动+1
      if (key === 0) {
        this.nextChange(value, 0, row)
        let index = this.rebateSpecItems.findIndex((v) => v.itemId === row.itemId)
        let nextValue = this.rebateSpecItems[index].rebate_conf.rebate_task[1].filter
        this.nextChange(nextValue, 1, row)
      } else if (key === 1) {
        this.nextChange(value, key, row)
      }
    }
  }
}
</script>
