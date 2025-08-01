<template>
  <div>
    <div v-if="VERSION_STANDARD()">
      <div class="clearfix">
        <h2 class="f_l">
          <span>分享带门店参数设置：</span>
        </h2>
      </div>
      <hr style="border: 1px solid #efefef">
      <el-form v-model="form" label-width="200px">
        <el-form-item label="是否带门店参数">
          <el-switch v-model="form.distributor_param_status" @change="paramShareChange()" />
          <div class="wrapper-tips">
            <div class="margin-top-10">已开启：</div>
            <div>
              1. 从小程序分享出去的 太阳码和小程序链接
              带店铺参，其他消费者通过此链接或者太阳码进入商城会切换成参数对应的店铺，同时本地缓存也会切换成参数对应的新店铺。
            </div>
            <div>
              2.
              顾客通过「管理后台-店铺-店铺商品」生成的商品二维码或其他带店铺参数的二维码进入商城时，其所在店铺将切换为二维码所带参数对应的店铺，同时本地缓存也会切换成参数对应的新店铺。
            </div>
            <div class="margin-top-20">已关闭：</div>
            <div>
              1. 从小程序分享出去的 太阳码和小程序链接
              不带店铺参，其他消费者通过此链接或者太阳码进入商城不会切换成参数对应的店铺，本地缓存也不会切换成参数对应的新店铺，即按照商城原本的进店逻辑进入店铺。
            </div>
            <div>
              2.
              顾客通过「管理后台-店铺-店铺商品」生成的商品二维码或其他带店铺参数的二维码进入商城时，其所在店铺将切换为二维码所带参数对应的店铺，同时本地缓存也会切换成参数对应的新店铺。
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="!VERSION_IN_PURCHASE()">
      <div class="clearfix">
        <h2 class="f_l">
          <span>评论设置：</span>
        </h2>
      </div>
      <hr style="border: 1px solid #efefef">
      <el-form v-model="form" label-width="200px">
        <el-form-item label="是否开启评论">
          <el-switch v-model="form.rate_status" @change="rateStatusChange()" />
        </el-form-item>
      </el-form>
    </div>

    <div v-if="!isMicorMall && !VERSION_IN_PURCHASE()">
      <div class="clearfix">
        <h2 class="f_l">
          <span>提货码设置：</span>
        </h2>
      </div>
      <hr style="border: 1px solid #efefef">
      <el-form v-model="form" label-width="200px">
        <el-form-item label="是否开启提货码">
          <el-switch v-model="form.pickupcode_status" @change="presaleStatusChange()" />
        </el-form-item>
      </el-form>
    </div>

    <div class="clearfix">
      <h2 class="f_l">
        <span>会员白名单设置：</span>
      </h2>
    </div>
    <hr style="border: 1px solid #efefef">
    <el-form v-model="form" label-width="200px">
      <el-form-item label="是否开启白名单">
        <el-switch v-model="form.whitelist_status" @change="whitelistStatusChange()" />
      </el-form-item>
    </el-form>

    <div v-if="!VERSION_IN_PURCHASE()">
      <div class="clearfix">
        <h2 class="f_l">
          <span>赠品设置：</span>
        </h2>
      </div>
      <hr style="border: 1px solid #efefef">
      <!-- <el-form v-model="form" label-width="200px">
        <el-form-item label="赠品是否扣门店库存">
          <el-switch
            v-model="form.minus_shop_gift_store"
            @change="giftSettingChange('minus_shop_gift_store')"
          ></el-switch>
        </el-form-item>
      </el-form> -->
      <el-form v-model="form" label-width="200px">
        <el-form-item label="赠品缺货是否能继续下单">
          <el-switch
            v-model="form.check_gift_store"
            @change="giftSettingChange('check_gift_store')"
          />
        </el-form-item>
      </el-form>
    </div>

    <div v-if="!VERSION_IN_PURCHASE()">
      <div class="clearfix">
        <h2 class="f_l">
          <span>推单设置：</span>
        </h2>
      </div>
      <hr style="border: 1px solid #efefef">
      <el-form v-model="form" label-width="200px">
        <el-form-item label="自提订单推oms">
          <el-switch v-model="form.ziti_send_oms" @change="sendOmsChange('ziti_send_oms')" />
        </el-form-item>
      </el-form>
    </div>

    <div v-if="VERSION_STANDARD()">
      <div class="clearfix">
        <h2 class="f_l">
          <span>前端店铺展示关闭：</span>
        </h2>
      </div>
      <hr style="border: 1px solid #efefef">
      <el-form v-model="form" label-width="200px">
        <el-form-item label="是否关闭">
          <el-switch v-model="form.nostores_status" @change="sendNoStoresChange" />
          <span class="frm-tips">用于关闭前端店铺切换功能</span>
        </el-form-item>
      </el-form>
    </div>

    <!-- <div class="clearfix">
      <h2 class="f_l">
        <span>储值设置：</span>
      </h2>
    </div>
    <hr style="border: 1px solid #efefef" />
    <el-form v-model="form" label-width="200px">
      <el-form-item label="是否开启储值功能">
        <el-switch v-model="form.recharge_status" @change="rechargeStatusChange()"></el-switch>
      </el-form-item>
    </el-form> -->

    <div class="clearfix">
      <h2 class="f_l">
        <span>取消订单设置：</span>
      </h2>
    </div>
    <hr style="border: 1px solid #efefef">
    <el-form v-model="form" label-width="200px">
      <el-form-item label="拒绝后是否能再次发起申请">
        <el-switch v-model="form.repeat_cancel" @change="repeatCancelChange()" />
      </el-form-item>
    </el-form>

    <div class="clearfix">
      <h2 class="f_l">
        <span>商品库存设置：</span>
      </h2>
    </div>
    <hr style="border: 1px solid #efefef">
    <el-form v-model="form" label-width="200px">
      <el-form-item label="商品详情页是否显示库存">
        <el-switch v-model="form.item_store_status" @change="itemStoreChange()" />
      </el-form-item>
    </el-form>

    <div class="clearfix">
      <h2 class="f_l">
        <span>商品销量设置：</span>
      </h2>
    </div>
    <hr style="border: 1px solid #efefef">
    <el-form v-model="form" label-width="200px">
      <el-form-item label="商品销量是否显示">
        <el-switch v-model="form.item_sales_status" @change="itemSalesChange()" />
      </el-form-item>
    </el-form>

    <div v-if="!VERSION_IN_PURCHASE()">
      <div class="clearfix">
        <h2 class="f_l">
          <span>发票设置：</span>
        </h2>
      </div>
      <hr style="border: 1px solid #efefef">
      <el-form v-model="form" label-width="200px">
        <el-form-item label="结算页是否显示发票">
          <el-switch v-model="form.invoice_status" @change="invoiceStatusChange()" />
        </el-form-item>
      </el-form>
    </div>

    <div class="clearfix">
      <h2 class="f_l">
        <span>店务设置：</span>
      </h2>
    </div>
    <hr style="border: 1px solid #efefef">
    <el-form v-model="form" label-width="200px">
      <el-form-item label="移动端是否展示店务端入口">
        <el-switch v-model="form.dianwu_show_status" @change="dianwuShowStatusChange()" />
      </el-form-item>
    </el-form>
  </div>
</template>
<style scoped lang="scss">
.wrapper-tips {
  div {
    line-height: 1.5;
    font-size: 13px;
  }
  .margin-top-10 {
    margin-top: 10px;
  }
  .margin-top-20 {
    margin-top: 20px;
  }
}
</style>
<script>
import { mapGetters } from 'vuex'
import { VERSION_STANDARD } from '@/utils'
import {
  getRateSetting,
  setRateSetting,
  getPickupcodeSetting,
  setPickupcodeSetting,
  getWhitelistSetting,
  setWhitelistSetting,
  getGiftSetting,
  setGiftSetting,
  getSendOmsSetting,
  setSendOmsSetting,
  getNoStores,
  setNoStores,
  getRechargeSetting,
  setRechargeSetting,
  getRepeatCancelSetting,
  setRepeatCancelSetting,
  setItemSalesSetting,
  setItemStoreSetting,
  getItemSalesSetting,
  getItemStoreSetting,
  getInvoiceStatus,
  setInvoiceStatus,
  getDianwuShowStatus,
  setDianwuShowStatus
} from '@/api/company'
import { getShareParams, saveShareParams } from '@/api/system'
import imgPicker from '@/components/imageselect'

export default {
  components: {
    imgPicker
  },
  data() {
    return {
      imgDialog: false,
      isGetImage: false,
      form: {
        rate_status: false,
        whitelist_status: false,
        pickupcode_status: false,
        minus_shop_gift_store: false,
        check_gift_store: false,
        ziti_send_oms: false,
        nostores_status: false,
        recharge_status: true,
        repeat_cancel: false,
        item_store_status: true,
        item_sales_status: true,
        invoice_status: true,
        distributor_param_status: false,
        dianwu_show_status: false
      }
    }
  },
  computed: {
    ...mapGetters(['wheight', 'isMicorMall'])
  },
  mounted() {
    getRateSetting().then(res => {
      this.form.rate_status = Boolean(res.data.data.rate_status)
    })

    getShareParams().then(res => {
      this.form.distributor_param_status = Boolean(res.data.data.distributor_param_status)
    })

    getWhitelistSetting().then(res => {
      this.form.whitelist_status = Boolean(res.data.data.whitelist_status)
    })

    getPickupcodeSetting().then(res => {
      this.form.pickupcode_status = Boolean(res.data.data.pickupcode_status)
    })

    getGiftSetting().then(res => {
      this.form.minus_shop_gift_store = Boolean(res.data.data.minus_shop_gift_store)
      this.form.check_gift_store = Boolean(res.data.data.check_gift_store)
    })

    getSendOmsSetting().then(res => {
      this.form.ziti_send_oms = Boolean(res.data.data.ziti_send_oms)
    })

    getNoStores().then(res => {
      this.form.nostores_status = Boolean(res.data.data.nostores_status)
    })

    getRechargeSetting().then(res => {
      this.form.recharge_status = Boolean(res.data.data.recharge_status)
    })

    getRepeatCancelSetting().then(res => {
      this.form.repeat_cancel = Boolean(res.data.data.repeat_cancel)
    })

    getItemStoreSetting().then(res => {
      this.form.item_store_status = Boolean(res.data.data.item_store_status)
    })

    getItemSalesSetting().then(res => {
      this.form.item_sales_status = Boolean(res.data.data.item_sales_status)
    })

    getInvoiceStatus().then(res => {
      this.form.invoice_status = Boolean(res.data.data.invoice_status)
    })

    getDianwuShowStatus().then(res => {
      this.form.dianwu_show_status = Boolean(res.data.data.dianwu_show_status)
    })
  },
  methods: {
    rateStatusChange() {
      let msg = ''
      if (this.form.rate_status === true) {
        msg = '确定开启评价功能？'
      } else {
        msg = '确定关闭评价功能？'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setRateSetting(this.form)
            .then(res => {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '保存失败'
              })
            })
        })
        .catch(() => {
          if (this.form.rate_status === true) {
            this.form.rate_status = false
          } else {
            this.form.rate_status = true
          }
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    paramShareChange() {
      let msg = ''
      if (this.form.distributor_param_status === true) {
        msg = '确定开启分享带门店参数功能？'
      } else {
        msg = '确定关闭分享带门店参数功能？'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          saveShareParams(this.form)
            .then(res => {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '保存失败'
              })
            })
        })
        .catch(e => {
          console.log('e', e)
          if (this.form.distributor_param_status === true) {
            this.form.distributor_param_status = false
          } else {
            this.form.distributor_param_status = true
          }
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    whitelistStatusChange() {
      let msg = ''
      if (this.form.whitelist_status === true) {
        msg = '确定开启白名单功能？'
      } else {
        msg = '确定关闭白名单功能？'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setWhitelistSetting(this.form)
            .then(res => {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '保存失败'
              })
            })
        })
        .catch(() => {
          if (this.form.whitelist_status === true) {
            this.form.whitelist_status = false
          } else {
            this.form.whitelist_status = true
          }
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    presaleStatusChange() {
      let msg = ''
      if (this.form.pickupcode_status === true) {
        msg = '确定开启预售提货码功能？'
      } else {
        msg = '确定关闭预售提货码功能？'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setPickupcodeSetting(this.form)
            .then(res => {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '保存失败'
              })
            })
        })
        .catch(() => {
          if (this.form.pickupcode_status === true) {
            this.form.pickupcode_status = false
          } else {
            this.form.pickupcode_status = true
          }
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    giftSettingChange(type) {
      let msg = ''
      if (this.form[type] == true) {
        msg = '确定开启'
      } else {
        msg = '确定关闭'
      }

      switch (type) {
        case 'minus_shop_gift_store':
          msg += '赠品扣门店库存'
          break
        case 'check_gift_store':
          msg += '赠品缺货能继续下单'
          break
      }

      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setGiftSetting(this.form)
            .then(res => {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '保存失败'
              })
            })
        })
        .catch(() => {
          if (this.form[type] === true) {
            this.form[type] = false
          } else {
            this.form[type] = true
          }
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    sendOmsChange(type) {
      let msg = ''
      if (this.form[type] == true) {
        msg = '确定开启'
      } else {
        msg = '确定关闭'
      }

      switch (type) {
        case 'ziti_send_oms':
          msg += '自提订单推oms'
          break
      }

      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setSendOmsSetting(this.form)
            .then(res => {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '保存失败'
              })
            })
        })
        .catch(() => {
          if (this.form[type] === true) {
            this.form[type] = false
          } else {
            this.form[type] = true
          }
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    sendNoStoresChange() {
      let msg = ''
      if (this.form.nostores_status === true) {
        msg = '更改前端店铺切换功能，会影响前端消费者购物流程，请谨慎操作'
      } else {
        msg = '更改前端店铺切换功能，会影响前端消费者购物流程，请谨慎操作'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = { nostores_status: this.form.nostores_status }
          setNoStores(params)
            .then(res => {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '保存失败'
              })
            })
        })
        .catch(() => {
          if (this.form.nostores_status === true) {
            this.form.nostores_status = false
          } else {
            this.form.nostores_status = true
          }
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    rechargeStatusChange() {
      let msg = ''
      if (this.form.recharge_status === true) {
        msg = '确定开启储值功能？'
      } else {
        msg = '确定关闭储值功能？'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setRechargeSetting(this.form)
            .then(res => {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '保存失败'
              })
            })
        })
        .catch(() => {
          if (this.form.recharge_status === true) {
            this.form.recharge_status = false
          } else {
            this.form.recharge_status = true
          }
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    repeatCancelChange() {
      let msg = ''
      if (this.form.repeat_cancel === true) {
        msg = '确定开启重复发起取消订单功能？'
      } else {
        msg = '确定关闭重复发起取消订单功能？'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setRepeatCancelSetting(this.form)
            .then(res => {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '保存失败'
              })
            })
        })
        .catch(() => {
          if (this.form.repeat_cancel === true) {
            this.form.repeat_cancel = false
          } else {
            this.form.repeat_cancel = true
          }
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },

    itemStoreChange() {
      let msg = ''
      if (this.form.item_store_status === true) {
        msg = '确定开启显示功能？'
      } else {
        msg = '确定关闭显示功能？'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setItemStoreSetting(this.form)
            .then(res => {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '保存失败'
              })
            })
        })
        .catch(() => {
          if (this.form.item_store_status === true) {
            this.form.item_store_status = false
          } else {
            this.form.item_store_status = true
          }
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },

    itemSalesChange() {
      let msg = ''
      if (this.form.item_sales_status === true) {
        msg = '确定开启显示功能？'
      } else {
        msg = '确定关闭显示功能？'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setItemSalesSetting(this.form)
            .then(res => {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '保存失败'
              })
            })
        })
        .catch(() => {
          if (this.form.item_sales_status === true) {
            this.form.item_sales_status = false
          } else {
            this.form.item_sales_status = true
          }
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },

    invoiceStatusChange() {
      let msg = ''
      if (this.form.invoice_status === true) {
        msg = '确定开启显示功能？'
      } else {
        msg = '确定关闭显示功能？'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setInvoiceStatus(this.form)
            .then(res => {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '保存失败'
              })
            })
        })
        .catch(() => {
          if (this.form.invoice_status === true) {
            this.form.invoice_status = false
          } else {
            this.form.invoice_status = true
          }
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },

    dianwuShowStatusChange() {
      let msg = ''
      if (this.form.dianwu_show_status === true) {
        msg = '确定开启显示店务端？'
      } else {
        msg = '确定关闭显示店务端？'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setDianwuShowStatus(this.form)
            .then(res => {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '保存失败'
              })
            })
        })
        .catch(() => {
          if (this.form.dianwu_show_status === true) {
            this.form.dianwu_show_status = false
          } else {
            this.form.dianwu_show_status = true
          }
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    }
  }
}
</script>
