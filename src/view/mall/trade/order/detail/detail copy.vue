<template>
  <div class="section-white">
    <div v-loading="loading" class="detail-info">
      <PayCard :order-info="orderInfo" :member-info="memberInfo" :trade-info="tradeInfo" />

      <BaseCard :order-info="orderInfo" :member-info="memberInfo" />

      <GoodCard :order-info="orderInfo" :member-info="memberInfo" />
    </div>

    <div class="footer-container" />
  </div>
</template>

<script>
import {
  getOrderDetail,
  updateDelivery,
  processDrugOrders,
  getDeliveryDetail,
  getLogisticsList,
  getDeliveryLists
} from '../../../../../api/trade'
import { getMember } from '../../../../../api/member'
import { getWxShopsList } from '@/api/shop'
import hqbdlycorp_kname from '../../../../common/hqbdlycorp_kname.json'

import BaseCard from './component/BaseCard'
import GoodCard from './component/GoodCard'
import PayCard from './component/PayCard'

export default {
  components: {
    BaseCard,
    GoodCard,
    PayCard
  },
  data() {
    const self = this
    return {
      dialog: false,
      shopsList: [],
      dialogVisible: false,
      loading: false,
      order_id: '',
      orderInfo: {},
      distributor: {},
      tradeInfo: {},
      cancelData: {},
      profit: {},
      resource: '',
      user_id: 0,
      memberInfo: {
        gradeInfo: {}
      },
      form: {
        status: 'true',
        receipt_type: 'ziti',
        reject_reason: ''
      },
      reverse: true,
      activities: [],
      dlycorpskn: hqbdlycorp_kname,
      bigImageUrl: '',
      dlycorps: [],
      deliveryForm: {
        delivery_type: 'batch',
        order_id: '',
        delivery_corp: '',
        delivery_code: '',
        sepInfo: {}
      },
      deliveryData: {}
    }
  },
  mounted() {
    if (this.$route.query.orderId) {
      this.order_id = this.$route.query.orderId
    }
    if (this.$route.query.resource) {
      this.resource = this.$route.query.resource
    }
    if (this.$route.query.user_id) {
      this.user_id = this.$route.query.user_id
    }
    this.getDetail()
    this.getLogisticsList()
  },
  methods: {
    retrunClick() {
      this.$router.go(-1)
    },
    handleCancelLabelsDialog() {
      this.dialog = false
    },
    getMemberInfo(filter) {
      getMember(filter).then(response => {
        this.memberInfo = response.data.data
      })
    },
    deliveryDesc() {
      this.dialog = true
      let query = {
        delivery_corp: this.orderInfo.delivery_corp,
        delivery_code: this.orderInfo.delivery_code,
        delivery_corp_source: this.orderInfo.delivery_corp_source
      }
      getDeliveryDetail(query).then(response => {
        this.activities = response.data.data
      })
    },
    getMemberInfo(filter) {
      getMember(filter).then(response => {
        this.memberInfo = response.data.data
      })
    },
    process() {
      processDrugOrders(this.order_id, this.form).then(res => {
        this.$message({ type: 'success', message: '审核成功' })
        this.getDetail()
      })
    },
    remoteMethod(query) {
      getWxShopsList({
        page: 1,
        pageSize: 100,
        name: query,
        distributor_id: this.orderInfo.distributor_id
      }).then(res => {
        this.shopsList = res.data.data.list
      })
    },
    getDetail() {
      this.loading = true
      getOrderDetail(this.order_id).then(response => {
        this.orderInfo = response.data.data.orderInfo
        this.tradeInfo = response.data.data.tradeInfo
        this.distributor = response.data.data.distributor
        this.cancelData = response.data.data.cancelData
        this.profit = response.data.data.profit
        this.loading = false
        this.getMemberInfo({ user_id: this.orderInfo.user_id })
        if (response.data.data.orderInfo.pack) {
          this.orderInfo.pack = JSON.parse(response.data.data.orderInfo.pack)
        }
      })
      getDeliveryLists({ order_id: this.order_id }).then(response => {
        this.deliveryData = response.data.data
      })
    },
    imagedetail(imgurl) {
      this.dialogVisible = true
      this.bigImageUrl = imgurl
    },
    getLogisticsList() {
      getLogisticsList().then(res => {
        this.dlycorps = res.data.data.list
      })
    },
    updateDeliveryAction() {
      // 修改物流信息
      if (this.orderInfo.delivery_corp) {
        this.deliveryForm.delivery_corp = this.orderInfo.delivery_corp
        this.deliveryForm.delivery_code = this.orderInfo.delivery_code
        this.deliveryForm.sepInfo = {}
      } else {
        this.deliveryForm.delivery_type = 'sep'
        this.deliveryForm.sepInfo = JSON.stringify(this.orderInfo.items)
        this.deliveryForm.delivery_corp = ''
        this.deliveryForm.delivery_code = ''
      }
      updateDelivery(this.order_id, this.deliveryForm).then(response => {
        var deliveryStatus = response.data.data.delivery_status
        if (deliveryStatus && deliveryStatus != 'PENDING') {
          this.$message.success('修改物流信息成功!')
          this.getDetail()
        } else {
          this.$message.error('修改物流信息失败!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss" type="text/css">
.flex {
  display: flex;
}
h3.title {
  padding: 20px;
  font-size: 18px;
  color: #ff5000;
}
.col-3 {
  width: 120px;
  margin-right: 10px;
}
.detail-info {
  margin: 0 10px;
}
.el-row {
  margin-bottom: 10px;
}
.item-image {
  max-width: 80px;
  margin: 0 auto;
}
img {
  max-width: 100px;
  margin: 0 auto;
}
.block {
  margin-left: 85px;
}
.radio {
  margin-bottom: 15px;
}
</style>
