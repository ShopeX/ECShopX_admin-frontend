<template>
  <el-dialog
    title="选择优惠券"
    class="select-goods-box select-boxs"
    :append-to-body="true"
    :modal-append-to-body="false"
    :visible="couponsVisible"
    @close="closeDialog"
    width="1000px"
  >
    <template>
      <el-transfer
        v-loading="loading"
        v-model="selectedCoupons"
        :titles="['优惠券列表', '已选中']"
        :button-texts="['移除选择', '添加选择']"
        @change="couponsSelector"
        :data="couponList"
      >
        <div class="transfer-footer" slot="left-footer">
          <el-pagination
            v-if="total_count > params.page_size"
            small
            layout="prev, pager, next"
            @current-change="pageChange"
            :total="total_count"
            :page-size="params.page_size"
          >
          </el-pagination>
        </div>
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="couponsComfirm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { getCardList } from '@/api/cardticket'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.couponsVisible = val
        this.getCouponList()
      }
    },
    selectedCoupons(val) {
      if (val.length) {
        let list = []
        this.couponList.forEach((item) => {
          val.forEach((key) => {
            if (item.key == key) {
              list.push(item)
            }
          })
        })
        this.selectList = list
      } else {
      }
    }
  },
  data() {
    return {
      couponsVisible: false,
      loading: false,
      params: {
        page_no: 1,
        page_size: 10,
        end_date: 1
      },
      total_count: 0,
      couponList: [],
      selectedCoupons: [],

      selectList: []
    }
  },
  methods: {
    //选择商品分页
    pageChange(val) {
      this.params.page_no = val
      this.getCouponList()
    },
    //选择商品触发事件
    couponsSelector(value, direction, movedKeys) {
      if (value.length > 3) {
        this.$message({
          message: '最多选择三张优惠券',
          type: 'error',
          duration: 5 * 1000
        })
        this.selectedCoupons.splice(3)
      }
    },
    //选择商品确认
    couponsComfirm() {
      let values = []
      if (this.selectedCoupons.length > 0) {
        this.couponList.forEach((item) => {
          this.selectedCoupons.forEach((key) => {
            if (item.key == key) {
              let obj = {
                imgUrl: item.imgUrl,
                title: item.label,
                id: item.key,
                desc: item.desc,
                amount: item.amount,
                type: item.type
              }
              values.push(obj)
            }
          })
        })
      } else {
        this.$message({
          message: '请选择优惠券',
          type: 'error'
        })
        return
      }
      this.selectedCoupons = []
      this.couponsVisible = false
      this.$emit('pickCoupon', values)
    },
    getCouponList() { 
      this.loading = true
      getCardList({...this.params,from:'btn'})
        .then((res) => {
          let list = []
          res.data.data.list.forEach((item) => {
            list.push({
              type: item.card_type,
              key: item.card_id,
              label: item.title,
              imgUrl: '',
              desc: item.description,
              amount:
                item.card_type === 'discount' ? (100 - item.discount) / 10 : item.reduce_cost / 100
            })
          })

          let arr = list.filter((item) => {
            let xx = this.selectList.find((row) => {
              return row.key === item.key
            })
            if (!xx) {
              return item
            }
          })

          this.couponList = arr.concat(this.selectList)
          this.total_count = res.data.data.pagers.total
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
        })
    },
    closeDialog() {
      this.couponsVisible = false
      this.$emit('closeDialog', 'coupon')
    }
  },
  mounted() {}
}
</script>

<style lang="scss">
.select-boxs {
  .el-dialog__body {
    padding: 20px;
    padding-bottom: 10px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .el-transfer-panel__footer {
      height: 30px;
    }
  }
}
</style>
