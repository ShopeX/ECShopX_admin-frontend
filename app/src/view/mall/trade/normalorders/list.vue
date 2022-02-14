<template>
  <div class="">
    <div v-if="$route.path.indexOf('detail') === -1 && $route.path.indexOf('process') === -1">
      <ListFilterCard
        :loginType="$store.getters.login_type"
        @onChangeData="handleChangeData"
        @onFilter="handleFilterChange"
        ref="filterCard"
      />

        <ListActionButton :size="size" :params="params" :filterParams="filterParams" @onChangeData="handleChangeData" />
        <ListTable
          @onChangeData="handleChangeData"
          @refreshList="getOrders"
          :selectItemType="selectItemType"
          :params="params"
          :list="dataSource.list"
          :dataPass="dataSource.datapass_block"
          :total_count="dataSource.total_count"
          :loading="dataSource.loading"
        />
      <!-- 发货-开始 -->
      <ListDeliveryDialog
        :visible="deliveryVisible"
        :newVisible="deliveryVisibleNew"
        @onChangeData="handleChangeData"
        @onSuccessDelivery="getOrders"
        @onCancel="handleCancel"
        :deliveryData="deliveryData"
        :IsDisabled="IsDisabled"
        :dlycorps="dlycorps"
        :selectItemType="selectItemType"
        :deliveryInfo="deliveryInfo"
      />

      <!-- 取消订单退款审核-开始 -->
      <ListCancelAuditDialog
        :visible="cancelVisible"
        @onChangeData="handleChangeData"
        @refreshList="getOrders"
        :cancelData="cancelData"
        :info="cancelInfo"
      />

      <!-- 取消订单 -->
      <ListCancelOrderDialog
        :visible="cancelOrderVisible"
        :info="cancelOrderInfo"
        @onChangeData="handleChangeData"
        @refreshList="getOrders"
        :cancelOrderData="cancelOrderData"
      />

      <!-- 自提订单核销 -->
      <ListWriteoffOrder
        :visible="writeoffOrderVisible"
        :writeoffOrderData="writeoffOrderData"
        :form="writeoffOrderForm"
         @refreshList="getOrders"
        @onChangeData="handleChangeData" 
      />
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getOrderList } from "@/api/trade";
import ListFilterCard from "./components/ListFilterCard";
import ListActionButton from "./components/ListActionButton";
import ListDeliveryDialog from "./components/ListDeliveryDialog";
import ListTable from "./components/ListTable";
import ListCancelAuditDialog from "./components/ListCancelAuditDialog";
import ListCancelOrderDialog from "./components/ListCancelOrderDialog";
import ListWriteoffOrder from "./components/ListWriteoffOrder";
import shopSelect from "@/components/shopSelect";

export default {
  components: {
    shopSelect,
    ListFilterCard,
    ListActionButton,
    ListDeliveryDialog,
    ListCancelAuditDialog,
    ListCancelOrderDialog,
    ListWriteoffOrder,
    ListTable,
  },
  data() {
    return {
      //table传递属性
      deliveryInfo: {
        delivery_type: "batch",
        order_id: "",
      },
      //table传递属性
      cancelOrderInfo: {
        order_id: "",
      },
      //table传递属性
      cancelInfo: {
        order_id: "",
        check_cancel: "1",
        shop_reject_reason: "",
      },
      IsDisabled: false, 
      params: {
        page: 1,
        pageSize: 20,
        order_class_exclude: "drug,pointsmall",
        order_type: "normal",
      },
      filterParams:{},
      cancelOrderData: {
        orderInfo: {},
      },
      deliveryData: {
        orderInfo: {},
      },
      cancelData: {
        orderInfo: {},
      },
      writeoffOrderData: {
        items: {},
      },
      dataSource:{
        total_count: 0,
        list: [],
        loading: false,
        // 是否为数据脱敏
        datapass_block: 1
      },
      deliveryVisible: false,
      dlycorps: [],
      cancelVisible: false,
      cancelOrderVisible: false,
      writeoffOrderVisible: false,
      deliveryVisibleNew: false,
      writeoffOrderForm: {
        order_id: "",
        pickupcode: "",
      },
      size:'small',
      // 选择发货订单的类型，老订单还是新订单
      selectItemType: "",
    };
  },
  computed: {
    ...mapGetters(["wheight"]),
  },
  methods: {
    handleFilterChange(values){
      this.filterParams=values;
      this.getOrders();
    },
    handleChangeData(changeField, changeValue) {
      if (typeof changeValue === "boolean" || typeof changeValue === "string") {
        this[changeField] = changeValue;
      } else {
        this[changeField] = {
          ...this[changeField],
          ...changeValue,
        };
      }
      if (changeField === "params") {
        this.getOrders(this.params);
      }
    },
    getOrders() {
      this.dataSource.loading = true;
      getOrderList({...this.params,...this.filterParams}).then((response) => {
        const { list,pager, datapass_block } =response.data.data;
        this.dataSource={
          list,
          total_count:Number(pager.count),
          loading:false,
          datapass_block
        } 
      });
    },
    handleCancel() {
      this.deliveryVisible = false;

      this.deliveryVisibleNew = false;

      this.IsDisabled = false;
    },
  },
  mounted() {
    if (this.$route.query.tab) {
      this.filterParams.order_status = this.$route.query.tab; 
    } 
    // this.getOrders();
  },
  watch: {
    $route:{
      handler(n){ 
        this.getOrders();
      },
      immediate: true,
      deep: true,
    }
  },
};
</script>
<style>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.invoice {
  cursor: pointer;
}
</style>
