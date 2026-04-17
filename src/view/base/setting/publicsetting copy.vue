<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div v-if="VERSION_STANDARD()">
      <div class="clearfix">
        <h2 class="f_l">
          <span>{{ $t('982b8845.2f859b') }}</span>
        </h2>
      </div>
      <hr style="border: 1px solid #efefef" />
      <el-form v-model="form" label-width="200px">
        <el-form-item :label="$t('982b8845.c90132')">
          <el-switch v-model="form.distributor_param_status" @change="paramShareChange()" />
          <div class="wrapper-tips">
            <div class="margin-top-10">{{ $t('982b8845.5b9fd5') }}</div>
            <div>{{ $t('982b8845.65807c') }}</div>
            <div>{{ $t('982b8845.e79a64') }}</div>
            <div class="margin-top-20">{{ $t('982b8845.933db8') }}</div>
            <div>{{ $t('982b8845.1a3783') }}</div>
            <div>{{ $t('982b8845.e79a64') }}</div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="!VERSION_IN_PURCHASE()">
      <div class="clearfix">
        <h2 class="f_l">
          <span>{{ $t('982b8845.53ceb6') }}</span>
        </h2>
      </div>
      <hr style="border: 1px solid #efefef" />
      <el-form v-model="form" label-width="200px">
        <el-form-item :label="$t('982b8845.f4ecf1')">
          <el-switch v-model="form.rate_status" @change="rateStatusChange()" />
        </el-form-item>
      </el-form>
    </div>

    <div v-if="!isMicorMall && !VERSION_IN_PURCHASE()">
      <div class="clearfix">
        <h2 class="f_l">
          <span>{{ $t('982b8845.1c7dda') }}</span>
        </h2>
      </div>
      <hr style="border: 1px solid #efefef" />
      <el-form v-model="form" label-width="200px">
        <el-form-item :label="$t('982b8845.15efe2')">
          <el-switch v-model="form.pickupcode_status" @change="presaleStatusChange()" />
        </el-form-item>
      </el-form>
    </div>

    <div class="clearfix">
      <h2 class="f_l">
        <span>{{ $t('982b8845.e1d267') }}</span>
      </h2>
    </div>
    <hr style="border: 1px solid #efefef" />
    <el-form v-model="form" label-width="200px">
      <el-form-item :label="$t('982b8845.12cfe2')">
        <el-switch v-model="form.whitelist_status" @change="whitelistStatusChange()" />
      </el-form-item>
    </el-form>

    <div v-if="!VERSION_IN_PURCHASE()">
      <div class="clearfix">
        <h2 class="f_l">
          <span>{{ $t('982b8845.a59036') }}</span>
        </h2>
      </div>
      <hr style="border: 1px solid #efefef" />
      <!-- <el-form v-model="form" label-width="200px">
        <el-form-item label="赠品是否扣门店库存">
          <el-switch
            v-model="form.minus_shop_gift_store"
            @change="giftSettingChange('minus_shop_gift_store')"
          ></el-switch>
        </el-form-item>
      </el-form> -->
      <el-form v-model="form" label-width="200px">
        <el-form-item :label="$t('982b8845.c0d404')">
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
          <span>{{ $t('982b8845.154f22') }}</span>
        </h2>
      </div>
      <hr style="border: 1px solid #efefef" />
      <el-form v-model="form" label-width="200px">
        <el-form-item :label="$t('982b8845.aeb804')">
          <el-switch v-model="form.ziti_send_oms" @change="sendOmsChange('ziti_send_oms')" />
        </el-form-item>
      </el-form>
    </div>

    <div v-if="VERSION_STANDARD()">
      <div class="clearfix">
        <h2 class="f_l">
          <span>{{ $t('982b8845.8aa5e1') }}</span>
        </h2>
      </div>
      <hr style="border: 1px solid #efefef" />
      <el-form v-model="form" label-width="200px">
        <el-form-item :label="$t('982b8845.5e6422')">
          <el-switch v-model="form.nostores_status" @change="sendNoStoresChange" />
          <span class="frm-tips">{{ $t('982b8845.aef76c') }}</span>
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
        <span>{{ $t('982b8845.cc9def') }}</span>
      </h2>
    </div>
    <hr style="border: 1px solid #efefef" />
    <el-form v-model="form" label-width="200px">
      <el-form-item :label="$t('982b8845.89e3a5')">
        <el-switch v-model="form.repeat_cancel" @change="repeatCancelChange()" />
      </el-form-item>
    </el-form>

    <div class="clearfix">
      <h2 class="f_l">
        <span>{{ $t('982b8845.256171') }}</span>
      </h2>
    </div>
    <hr style="border: 1px solid #efefef" />
    <el-form v-model="form" label-width="200px">
      <el-form-item :label="$t('982b8845.f590ae')">
        <el-switch v-model="form.item_store_status" @change="itemStoreChange()" />
      </el-form-item>
    </el-form>

    <div class="clearfix">
      <h2 class="f_l">
        <span>{{ $t('982b8845.63f039') }}</span>
      </h2>
    </div>
    <hr style="border: 1px solid #efefef" />
    <el-form v-model="form" label-width="200px">
      <el-form-item :label="$t('982b8845.1a6e14')">
        <el-switch v-model="form.item_sales_status" @change="itemSalesChange()" />
      </el-form-item>
    </el-form>

    <div v-if="!VERSION_IN_PURCHASE()">
      <div class="clearfix">
        <h2 class="f_l">
          <span>{{ $t('982b8845.48fc91') }}</span>
        </h2>
      </div>
      <hr style="border: 1px solid #efefef" />
      <el-form v-model="form" label-width="200px">
        <el-form-item :label="$t('982b8845.79ebf3')">
          <el-switch v-model="form.invoice_status" @change="invoiceStatusChange()" />
        </el-form-item>
      </el-form>
    </div>

    <div class="clearfix">
      <h2 class="f_l">
        <span>{{ $t('982b8845.61b24b') }}</span>
      </h2>
    </div>
    <hr style="border: 1px solid #efefef" />
    <el-form v-model="form" label-width="200px">
      <el-form-item :label="$t('982b8845.fb9f26')">
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
    getRateSetting().then((res) => {
      this.form.rate_status = Boolean(res.data.data.rate_status)
    })

    getShareParams().then((res) => {
      this.form.distributor_param_status = Boolean(res.data.data.distributor_param_status)
    })

    getWhitelistSetting().then((res) => {
      this.form.whitelist_status = Boolean(res.data.data.whitelist_status)
    })

    getPickupcodeSetting().then((res) => {
      this.form.pickupcode_status = Boolean(res.data.data.pickupcode_status)
    })

    getGiftSetting().then((res) => {
      this.form.minus_shop_gift_store = Boolean(res.data.data.minus_shop_gift_store)
      this.form.check_gift_store = Boolean(res.data.data.check_gift_store)
    })

    getSendOmsSetting().then((res) => {
      this.form.ziti_send_oms = Boolean(res.data.data.ziti_send_oms)
    })

    getNoStores().then((res) => {
      this.form.nostores_status = Boolean(res.data.data.nostores_status)
    })

    getRechargeSetting().then((res) => {
      this.form.recharge_status = Boolean(res.data.data.recharge_status)
    })

    getRepeatCancelSetting().then((res) => {
      this.form.repeat_cancel = Boolean(res.data.data.repeat_cancel)
    })

    getItemStoreSetting().then((res) => {
      this.form.item_store_status = Boolean(res.data.data.item_store_status)
    })

    getItemSalesSetting().then((res) => {
      this.form.item_sales_status = Boolean(res.data.data.item_sales_status)
    })

    getInvoiceStatus().then((res) => {
      this.form.invoice_status = Boolean(res.data.data.invoice_status)
    })

    getDianwuShowStatus().then((res) => {
      this.form.dianwu_show_status = Boolean(res.data.data.dianwu_show_status)
    })
  },
  methods: {
    rateStatusChange() {
      const msg =
        this.form.rate_status === true ? this.$t('982b8845.c50e1a') : this.$t('982b8845.d34a15')
      this.$confirm(msg, this.$t('982b8845.02d981'), {
        confirmButtonText: this.$t('982b8845.38cf16'),
        cancelButtonText: this.$t('982b8845.625fb2'),
        type: 'warning'
      })
        .then(() => {
          setRateSetting(this.form)
            .then((res) => {
              this.$message({
                type: 'success',
                message: this.$t('982b8845.3b1083')
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$t('982b8845.6de920')
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
            message: this.$t('982b8845.2111cc')
          })
        })
    },
    paramShareChange() {
      const msg =
        this.form.distributor_param_status === true
          ? this.$t('982b8845.ac254f')
          : this.$t('982b8845.b251d6')
      this.$confirm(msg, this.$t('982b8845.02d981'), {
        confirmButtonText: this.$t('982b8845.38cf16'),
        cancelButtonText: this.$t('982b8845.625fb2'),
        type: 'warning'
      })
        .then(() => {
          saveShareParams(this.form)
            .then((res) => {
              this.$message({
                type: 'success',
                message: this.$t('982b8845.3b1083')
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$t('982b8845.6de920')
              })
            })
        })
        .catch((e) => {
          console.log('e', e)
          if (this.form.distributor_param_status === true) {
            this.form.distributor_param_status = false
          } else {
            this.form.distributor_param_status = true
          }
          this.$message({
            type: 'info',
            message: this.$t('982b8845.2111cc')
          })
        })
    },
    whitelistStatusChange() {
      const msg =
        this.form.whitelist_status === true
          ? this.$t('982b8845.a49e50')
          : this.$t('982b8845.80c5af')
      this.$confirm(msg, this.$t('982b8845.02d981'), {
        confirmButtonText: this.$t('982b8845.38cf16'),
        cancelButtonText: this.$t('982b8845.625fb2'),
        type: 'warning'
      })
        .then(() => {
          setWhitelistSetting(this.form)
            .then((res) => {
              this.$message({
                type: 'success',
                message: this.$t('982b8845.3b1083')
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$t('982b8845.6de920')
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
            message: this.$t('982b8845.2111cc')
          })
        })
    },
    presaleStatusChange() {
      const msg =
        this.form.pickupcode_status === true
          ? this.$t('982b8845.73b5c0')
          : this.$t('982b8845.203404')
      this.$confirm(msg, this.$t('982b8845.02d981'), {
        confirmButtonText: this.$t('982b8845.38cf16'),
        cancelButtonText: this.$t('982b8845.625fb2'),
        type: 'warning'
      })
        .then(() => {
          setPickupcodeSetting(this.form)
            .then((res) => {
              this.$message({
                type: 'success',
                message: this.$t('982b8845.3b1083')
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$t('982b8845.6de920')
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
            message: this.$t('982b8845.2111cc')
          })
        })
    },
    giftSettingChange(type) {
      const prefix =
        this.form[type] == true ? this.$t('982b8845.8805f6') : this.$t('982b8845.7183f6')
      const suffix =
        type === 'minus_shop_gift_store' ? this.$t('982b8845.fd501b') : this.$t('982b8845.5af793')
      const msg = prefix + suffix

      this.$confirm(msg, this.$t('982b8845.02d981'), {
        confirmButtonText: this.$t('982b8845.38cf16'),
        cancelButtonText: this.$t('982b8845.625fb2'),
        type: 'warning'
      })
        .then(() => {
          setGiftSetting(this.form)
            .then((res) => {
              this.$message({
                type: 'success',
                message: this.$t('982b8845.3b1083')
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$t('982b8845.6de920')
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
            message: this.$t('982b8845.2111cc')
          })
        })
    },
    sendOmsChange(type) {
      const prefix =
        this.form[type] == true ? this.$t('982b8845.8805f6') : this.$t('982b8845.7183f6')
      const msg = prefix + this.$t('982b8845.aeb804')

      this.$confirm(msg, this.$t('982b8845.02d981'), {
        confirmButtonText: this.$t('982b8845.38cf16'),
        cancelButtonText: this.$t('982b8845.625fb2'),
        type: 'warning'
      })
        .then(() => {
          setSendOmsSetting(this.form)
            .then((res) => {
              this.$message({
                type: 'success',
                message: this.$t('982b8845.3b1083')
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$t('982b8845.6de920')
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
            message: this.$t('982b8845.2111cc')
          })
        })
    },
    sendNoStoresChange() {
      const msg = this.$t('982b8845.1d3ef6')
      this.$confirm(msg, this.$t('982b8845.02d981'), {
        confirmButtonText: this.$t('982b8845.38cf16'),
        cancelButtonText: this.$t('982b8845.625fb2'),
        type: 'warning'
      })
        .then(() => {
          const params = { nostores_status: this.form.nostores_status }
          setNoStores(params)
            .then((res) => {
              this.$message({
                type: 'success',
                message: this.$t('982b8845.3b1083')
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$t('982b8845.6de920')
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
            message: this.$t('982b8845.2111cc')
          })
        })
    },
    rechargeStatusChange() {
      const msg =
        this.form.recharge_status === true ? this.$t('982b8845.d68a60') : this.$t('982b8845.c2fdab')
      this.$confirm(msg, this.$t('982b8845.02d981'), {
        confirmButtonText: this.$t('982b8845.38cf16'),
        cancelButtonText: this.$t('982b8845.625fb2'),
        type: 'warning'
      })
        .then(() => {
          setRechargeSetting(this.form)
            .then((res) => {
              this.$message({
                type: 'success',
                message: this.$t('982b8845.3b1083')
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$t('982b8845.6de920')
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
            message: this.$t('982b8845.2111cc')
          })
        })
    },
    repeatCancelChange() {
      const msg =
        this.form.repeat_cancel === true ? this.$t('982b8845.d592fb') : this.$t('982b8845.07e7f3')
      this.$confirm(msg, this.$t('982b8845.02d981'), {
        confirmButtonText: this.$t('982b8845.38cf16'),
        cancelButtonText: this.$t('982b8845.625fb2'),
        type: 'warning'
      })
        .then(() => {
          setRepeatCancelSetting(this.form)
            .then((res) => {
              this.$message({
                type: 'success',
                message: this.$t('982b8845.3b1083')
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$t('982b8845.6de920')
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
            message: this.$t('982b8845.2111cc')
          })
        })
    },

    itemStoreChange() {
      const msg =
        this.form.item_store_status === true
          ? this.$t('982b8845.ae34d3')
          : this.$t('982b8845.c5a6de')
      this.$confirm(msg, this.$t('982b8845.02d981'), {
        confirmButtonText: this.$t('982b8845.38cf16'),
        cancelButtonText: this.$t('982b8845.625fb2'),
        type: 'warning'
      })
        .then(() => {
          setItemStoreSetting(this.form)
            .then((res) => {
              this.$message({
                type: 'success',
                message: this.$t('982b8845.3b1083')
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$t('982b8845.6de920')
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
            message: this.$t('982b8845.2111cc')
          })
        })
    },

    itemSalesChange() {
      const msg =
        this.form.item_sales_status === true
          ? this.$t('982b8845.ae34d3')
          : this.$t('982b8845.c5a6de')
      this.$confirm(msg, this.$t('982b8845.02d981'), {
        confirmButtonText: this.$t('982b8845.38cf16'),
        cancelButtonText: this.$t('982b8845.625fb2'),
        type: 'warning'
      })
        .then(() => {
          setItemSalesSetting(this.form)
            .then((res) => {
              this.$message({
                type: 'success',
                message: this.$t('982b8845.3b1083')
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$t('982b8845.6de920')
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
            message: this.$t('982b8845.2111cc')
          })
        })
    },

    invoiceStatusChange() {
      const msg =
        this.form.invoice_status === true ? this.$t('982b8845.ae34d3') : this.$t('982b8845.c5a6de')
      this.$confirm(msg, this.$t('982b8845.02d981'), {
        confirmButtonText: this.$t('982b8845.38cf16'),
        cancelButtonText: this.$t('982b8845.625fb2'),
        type: 'warning'
      })
        .then(() => {
          setInvoiceStatus(this.form)
            .then((res) => {
              this.$message({
                type: 'success',
                message: this.$t('982b8845.3b1083')
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$t('982b8845.6de920')
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
            message: this.$t('982b8845.2111cc')
          })
        })
    },

    dianwuShowStatusChange() {
      const msg =
        this.form.dianwu_show_status === true
          ? this.$t('982b8845.fb70b0')
          : this.$t('982b8845.bb8953')
      this.$confirm(msg, this.$t('982b8845.02d981'), {
        confirmButtonText: this.$t('982b8845.38cf16'),
        cancelButtonText: this.$t('982b8845.625fb2'),
        type: 'warning'
      })
        .then(() => {
          setDianwuShowStatus(this.form)
            .then((res) => {
              this.$message({
                type: 'success',
                message: this.$t('982b8845.3b1083')
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$t('982b8845.6de920')
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
            message: this.$t('982b8845.2111cc')
          })
        })
    }
  }
}
</script>
