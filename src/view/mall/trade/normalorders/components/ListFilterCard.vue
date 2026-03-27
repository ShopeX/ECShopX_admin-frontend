<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-card>
    <el-form :inline="true" :model="orderForm" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label="$t('cb8b59e7.b5e148')">
            <el-input
              v-model="orderForm.ordernumber"
              :placeholder="$t('cb8b59e7.32f4ee')"
              :size="size"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="$store.getters.login_type != 'merchant'" :span="8">
          <el-form-item :label="$t('cb8b59e7.7c0d05')">
            <el-input
              v-model="orderForm.salesman_mobile"
              :placeholder="$t('cb8b59e7.27cab4')"
              :size="size"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="!isMicorMall" :span="8">
          <el-form-item :label="$t('cb8b59e7.e9d70f')">
            <el-select
              v-model="orderForm.receipt_type"
              :placeholder="$t('cb8b59e7.8b474e')"
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
          <el-form-item :label="$t('cb8b59e7.b36ea7')">
            <el-autocomplete
              v-model="orderForm.source"
              :size="size"
              :fetch-suggestions="querySearch"
              :placeholder="$t('cb8b59e7.4b525f')"
              @select="sourceSearch"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('cb8b59e7.7816f5')">
            <el-select
              v-model="orderForm.order_status"
              :placeholder="$t('cb8b59e7.c47867')"
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
        <el-col v-if="$store.getters.login_type != 'merchant'" :span="8">
          <el-form-item :label="$t('cb8b59e7.0e83be')">
            <el-select
              v-model="orderForm.order_class"
              :placeholder="$t('cb8b59e7.249ee7')"
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
        <el-col v-if="!isMicorMall" :span="8">
          <el-form-item :label="$t('cb8b59e7.dfc420')">
            <el-select
              v-model="orderForm.is_invoiced"
              :placeholder="$t('cb8b59e7.d25a8e')"
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
          <el-form-item :label="$t('cb8b59e7.43c297')">
            <el-date-picker
              v-model="orderForm.create_time"
              :size="size"
              type="daterange"
              :start-placeholder="$t('cb8b59e7.b44c0f')"
              :range-separator="$t('cb8b59e7.981cbe')"
              :end-placeholder="$t('cb8b59e7.1d468b')"
              value-format="yyyy/MM/dd HH:mm:ss"
              :placeholder="$t('cb8b59e7.4b8cb9')"
              :default-time="['00:00:00', '23:59:59']"
              @change="dateChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('cb8b59e7.e56a5e')">
            <el-select
              v-model="orderForm.distributor_type"
              :placeholder="$t('cb8b59e7.edc8a9')"
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
          <el-form-item :label="$t('cb8b59e7.6580fe')">
            <shop-select ref="shopSelect" :size="size" distributors @update="storeSearch" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" :push="17">
          <div class="flex-right">
            <el-button type="primary" :size="size" @click="handleSubmit">
              {{ $t('cb8b59e7.e5f71f') }}
            </el-button>
            <el-button :size="size" @click="handleReset"> {{ $t('cb8b59e7.4b9c32') }} </el-button>
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
  data() {
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
        { name: this.$t('cb8b59e7.a8b0c2'), value: '' },
        { name: this.$t('cb8b59e7.5613ba'), value: 0 },
        { name: this.$t('cb8b59e7.ca4355'), value: 1 }
      ],
      distribution_list: [
        { name: this.$t('cb8b59e7.a8b0c2'), value: '' },
        { name: this.$t('cb8b59e7.249bfe'), value: 'logistics' },
        { name: this.$t('cb8b59e7.583dcd'), value: 'dada' },
        { name: this.$t('cb8b59e7.3f6ca2'), value: 'ziti' }
      ],
      order_class_array: [
        { name: this.$t('cb8b59e7.a8b0c2'), value: '' },
        { name: this.$t('cb8b59e7.9b251e'), value: 'groups' },
        { name: this.$t('cb8b59e7.ee8bc9'), value: 'seckill' },
        { name: this.$t('cb8b59e7.e7978e'), value: 'normal' }
      ],
      distributor_type_list: [
        { name: this.$t('cb8b59e7.a8b0c2'), value: '' },
        { name: this.$t('cb8b59e7.a509ca'), value: 'self' },
        { name: this.$t('cb8b59e7.d25231'), value: 'shop' }
      ],
      order_status_list: [
        { name: this.$t('cb8b59e7.a8b0c2'), value: '' },
        { name: this.$t('cb8b59e7.9246fe'), value: 'notpay' },
        { name: this.$t('cb8b59e7.d8476e'), value: 'notship' },
        { name: this.$t('cb8b59e7.4933ca'), value: 'shipping' },
        { name: this.$t('cb8b59e7.6b715b'), value: 'cancelapply' },
        { name: this.$t('cb8b59e7.25d532'), value: 'ziti' },
        { name: this.$t('cb8b59e7.2111cc'), value: 'cancel' },
        { name: this.$t('cb8b59e7.fad522'), value: 'finish' },
        { name: this.$t('cb8b59e7.1ef6f1'), value: 'dada_0' },
        { name: this.$t('cb8b59e7.f8c921'), value: 'dada_1' },
        { name: this.$t('cb8b59e7.186671'), value: 'dada_2' },
        { name: this.$t('cb8b59e7.b5b1a5'), value: 'dada_100' },
        { name: this.$t('cb8b59e7.739c91'), value: 'dada_3' },
        { name: this.$t('cb8b59e7.ed23e1'), value: 'dada_9' }
      ],
      //来源数据
      source_list: []
    }
  },
  mounted() {
    this.getAllSourcesList()
    console.log(this.$store.getters.login_type)
  },
  computed: {
    ...mapGetters(['isMicorMall'])
  },
  methods: {
    handleReset() {
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
    handleSubmit() {
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
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    storeSearch(val) {
      this.orderForm.distributor_id = val.shop_id
      this.handleSubmit()
    },
    sourceSearch(item) {
      this.orderForm.source_id = item.source_id
    },
    getAllSourcesList() {
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
    TypeHandle(val) {},
    querySearch(queryString, cb) {
      const restaurants = this.source_list
      const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      if (queryString && results) {
        cb(results)
      } else {
        cb([])
      }
    },
    dateChange(val) {
      if (val && val.length > 0) {
        this.orderForm.time_start_begin = this.dateStrToTimeStamp(val[0])
        this.orderForm.time_start_end = this.dateStrToTimeStamp(val[1])
      } else {
        this.orderForm.time_start_begin = ''
        this.orderForm.time_start_end = ''
      }
    },
    createFilter(queryString) {
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
