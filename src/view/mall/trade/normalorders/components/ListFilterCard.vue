<template>
  <el-card>
    <el-form
      :inline="true"
      :model="orderForm"
      label-width="120px"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="手机号/订单号:">
            <el-input
              v-model="orderForm.ordernumber"
              placeholder="请输入订单编号/客户手机号码"
              :size="size"
            />
          </el-form-item>
        </el-col>
        <el-col
          v-if="$store.getters.login_type != 'merchant'"
          :span="8"
        >
          <el-form-item label="导购手机号:">
            <el-input
              v-model="orderForm.salesman_mobile"
              placeholder="请输入导购手机号"
              :size="size"
            />
          </el-form-item>
        </el-col>
        <el-col
          v-if="!isMicorMall"
          :span="8"
        >
          <el-form-item label="配送类型:">
            <el-select
              v-model="orderForm.receipt_type"
              placeholder="请选择配送类型"
              :size="size"
              @change="handleSubmit"
            >
              <el-option
                v-for="(item, index) in distribution_list"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="订单来源:">
            <el-autocomplete
              v-model="orderForm.source"
              :size="size"
              :fetch-suggestions="querySearch"
              placeholder="请输入来源"
              @select="sourceSearch"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="订单状态:">
            <el-select
              v-model="orderForm.order_status"
              placeholder="请选择订单状态"
              :size="size"
              @change="handleSubmit"
            >
              <el-option
                v-for="(item, index) in order_status_list"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          v-if="$store.getters.login_type != 'merchant'"
          :span="8"
        >
          <el-form-item label="订单类型:">
            <el-select
              v-model="orderForm.order_class"
              placeholder="请选择订单类型"
              :size="size"
              @change="handleSubmit"
            >
              <el-option
                v-for="(item, index) in order_class_array"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          v-if="!isMicorMall"
          :span="8"
        >
          <el-form-item label="开票状态:">
            <el-select
              v-model="orderForm.is_invoiced"
              placeholder="请选择开票状态"
              :size="size"
              @change="handleSubmit"
            >
              <el-option
                v-for="(item, index) in invoice_status_list"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="下单时间:">
            <el-date-picker
              v-model="orderForm.create_time"
              :size="size"
              type="daterange"
              start-placeholder="开始日期"
              ange-separator="至"
              end-placeholder="结束日期"
              value-format="yyyy/MM/dd HH:mm:ss"
              placeholder="选择日期范围"
              :default-time="['00:00:00', '23:59:59']"
              @change="dateChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单分类:">
            <el-select
              v-model="orderForm.distributor_type"
              placeholder="请选择订单分类"
              :size="size"
              @change="handleSubmit"
            >
              <el-option
                v-for="(item, index) in distributor_type_list"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="!isMicorMall || loginType != 'distributor'">
        <el-col :span="12">
          <el-form-item label="选择店铺:">
            <shop-select
              ref="shopSelect"
              :size="size"
              distributors
              @update="storeSearch"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col
          :span="6"
          :push="17"
        >
          <div class="flex-right">
            <el-button
              type="primary"
              :size="size"
              @click="handleSubmit"
            >
              搜索
            </el-button>
            <el-button
              :size="size"
              @click="handleReset"
            >
              重置
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import { getSourcesList } from '@/api/datacube'
import shopSelect from '@/components/shopSelect2'
import { mapGetters } from 'vuex'
export default {
  components: {
    shopSelect
  },
  props: ['loginType'],
  data () {
    return {
      orderForm: {
        ordernumber: '',
        salesman_mobile: '',
        receipt_type: '',
        source: '',
        is_invoiced: '',
        order_status: '',
        order_class: '',
        create_time: '',
        source_id: '',
        time_start_begin: '',
        time_start_end: '',
        distributor_id: '',
        distributor_type: ''
      },
      size: '',

      invoice_status_list: [
        { name: '全部', value: '' },
        { name: '未开票', value: 0 },
        { name: '已开票', value: 1 }
      ],
      distribution_list: [
        { name: '全部', value: '' },
        { name: '普通快递', value: 'logistics' },
        { name: '同城配', value: 'dada' },
        { name: '客户自提', value: 'ziti' }
      ],
      order_class_array: [
        { name: '全部', value: '' },
        { name: '团购订单', value: 'groups' },
        { name: '秒杀订单', value: 'seckill' },
        // { name: "导购订单", value: "shopguide" },
        // { name: "跨境订单", value: "crossborder" },
        // { name: "助力订单", value: "bargain" },
        // { name: "社区订单", value: "community" },
        { name: '普通订单', value: 'normal' }
        // { name: "服务类订单", value: "services" },
        // { name: "兑换订单", value: "excard"}
      ],
      distributor_type_list: [
        { name: '全部', value: '' },
        { name: '自营订单', value: 'self' },
        { name: '商家订单', value: 'shop' }
      ],
      order_status_list: [
        { name: '全部', value: '' },
        { name: '待支付', value: 'notpay' },
        { name: '待发货', value: 'notship' },
        { name: '待收货', value: 'shipping' },
        { name: '待退款', value: 'cancelapply' },
        { name: '待自提', value: 'ziti' },
        { name: '已取消', value: 'cancel' },
        { name: '已完成', value: 'finish' },
        { name: '待接单', value: 'dada_0' },
        { name: '待骑士接单', value: 'dada_1' },
        { name: '待取货', value: 'dada_2' },
        { name: '骑士到店', value: 'dada_100' },
        { name: '配送中', value: 'dada_3' },
        { name: '未妥投', value: 'dada_9' }
      ],
      //来源数据
      source_list: []
    }
  },
  mounted () {
    this.getAllSourcesList()
    console.log(this.$store.getters.login_type)
  },
  computed: {
    ...mapGetters(['isMicorMall'])
  },
  methods: {
    handleReset () {
      this.orderForm = {
        ordernumber: '',
        salesman_mobile: '',
        receipt_type: '',
        source: '',
        is_invoiced: '',
        order_status: '',
        order_class: '',
        create_time: '',
        source_id: '',
        time_start_begin: '',
        time_start_end: '',
        distributor_id: '',
        distributor_type: ''
      }
      this.$refs.shopSelect.init()
    },
    handleSubmit () {
      const {
        ordernumber,
        salesman_mobile,
        receipt_type,
        source_id,
        order_status,
        order_class,
        is_invoiced,
        time_start_begin,
        time_start_end,
        distributor_id,
        distributor_type
      } = this.orderForm
      this.filterFormValues = {
        order_id:
          ordernumber.length === 11 ? undefined : ordernumber === '' ? undefined : ordernumber,
        mobile:
          ordernumber.length === 11 ? (ordernumber === '' ? undefined : ordernumber) : undefined,
        salesman_mobile: salesman_mobile === '' ? undefined : salesman_mobile,
        receipt_type: receipt_type === '' ? undefined : receipt_type,
        source_id: source_id === '' ? undefined : source_id,
        order_status: order_status === '' ? undefined : order_status,
        order_class: order_class === '' ? undefined : order_class,
        is_invoiced: is_invoiced === '' ? undefined : is_invoiced,
        time_start_begin: time_start_begin === '' ? undefined : time_start_begin,
        time_start_end: time_start_end === '' ? undefined : time_start_end,
        distributor_id: distributor_id === '' ? undefined : distributor_id,
        distributor_type: distributor_type === '' ? undefined : distributor_type
      }
      this.$emit('onFilter', { ...this.filterFormValues })
    },
    dateStrToTimeStamp (str) {
      return Date.parse(new Date(str)) / 1000
    },
    storeSearch (val) {
      this.orderForm.distributor_id = val.shop_id
      this.handleSubmit()
    },
    sourceSearch (item) {
      this.orderForm.source_id = item.source_id
    },
    getAllSourcesList () {
      const params = { page: 1, pageSize: 1000 }
      getSourcesList(params).then((response) => {
        if (response.data.data.list) {
          response.data.data.list.forEach((row) => {
            this.source_list.push({
              value: row.sourceName,
              source_id: row.sourceId
            })
          })
        }
      })
    },
    TypeHandle (val) {},
    querySearch (queryString, cb) {
      const restaurants = this.source_list
      const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      if (queryString && results) {
        cb(results)
      } else {
        cb([])
      }
    },
    dateChange (val) {
      if (val && val.length > 0) {
        this.orderForm.time_start_begin = this.dateStrToTimeStamp(val[0])
        this.orderForm.time_start_end = this.dateStrToTimeStamp(val[1])
      } else {
        this.orderForm.time_start_begin = ''
        this.orderForm.time_start_end = ''
      }
    },
    createFilter (queryString) {
      return (restaurant) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    }
  }
}
</script>

<style scoped>
.el-form-item {
  /* margin-bottom: 0; */
}
.flex-right {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
