<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <section v-if="name === 'coupon'" class="section">
    <div class="section-header with-border">{{ $t('dbe6ce92.e366cc') }}</div>
    <div class="section-body">
      <el-form label-width="100px">
        <el-form-item :label="$t('dbe6ce92.32c65d')">
          <el-input v-model="base.title" type="text" />
        </el-form-item>
        <el-form-item :label="$t('dbe6ce92.72cf37')">
          <el-input v-model="base.subtitle" />
        </el-form-item>
        <el-form-item :label="$t('dbe6ce92.4707ba')">
          <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item :label="$t('dbe6ce92.45bcee')">
          <div v-for="(item, index) in data" :key="index" class="setting-item item-selected">
            <div v-if="item.imgUrl" class="upload-box">
              <img
                :src="wximageurl + item.imgUrl"
                class="banner-uploader square thumbnail"
                @click="handleImgChange(index)"
              />
            </div>
            <div v-else class="banner-uploader square thumbnail" @click="handleImgChange(index)">
              <div class="content-center">
                <i class="el-icon-camera" />
              </div>
            </div>
            {{ item.title }}
            <span v-if="item.type === 'cash'" class="amount-cur"
              >{{ item.amount }}{{ $t('dbe6ce92.eeeebc') }}</span
            >
            <span v-if="item.type === 'discount'" class="amount-cur"
              >{{ item.amount }}{{ $t('dbe6ce92.656b64') }}</span
            >

            <div class="setting-remove" @click="removeItem(index)">
              <i class="el-icon-delete" />
            </div>
          </div>
          <div class="frm-tips">{{ $t('dbe6ce92.d5a0d5') }}</div>
          <el-button
            type="default"
            class="iconfont icon-cog banner-button-uploader"
            @click="setCoupons"
          >
            {{ $t('dbe6ce92.8436e0') }}
          </el-button>
        </el-form-item>
        <!----------------------------------- 卷包功能 ----------------------------------->

        <el-form-item :label="$t('dbe6ce92.df19a7')">
          <div
            v-for="(item, index) in voucher_package"
            :key="index"
            class="setting-item item-selected"
          >
            <div v-if="item.imgUrl" class="upload-box">
              <img
                :src="wximageurl + item.imgUrl"
                class="banner-uploader square thumbnail"
                @click="couponPackageImg(index)"
              />
            </div>
            <div v-else class="banner-uploader square thumbnail" @click="couponPackageImg(index)">
              <div class="content-center">
                <i class="el-icon-camera" />
              </div>
            </div>
            {{ item.title }}
            <div class="setting-remove" @click="removeCouponPackage(index)">
              <i class="el-icon-delete" />
            </div>
          </div>
          <div class="frm-tips">{{ $t('dbe6ce92.d5a0d5') }}</div>
          <el-button class="iconfont icon-cog banner-button-uploader" @click="pickCouponHanle()">
            {{ $t('dbe6ce92.df19a7') }}
          </el-button>
        </el-form-item>
        <!----------------------------------- 卷包功能 ----------------------------------->
      </el-form>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    res: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      name: '',
      padded: false,
      config: {},
      data: [],
      voucher_package: []
    }
  },
  watch: {
    res: {
      deep: true,
      handler(value) {
        if (value) {
          this.setData(value)
        }
      }
    }
  },
  mounted() {
    this.setData(this.res)
  },
  methods: {
    pickCouponHanle() {
      this.$emit('couponPackageVisible')
    },
    couponPackageImg(index) {
      this.$emit('bindImgs', index, true)
    },
    removeCouponPackage(index) {
      this.voucher_package.splice(index, 1)
    },
    // closeCouponHandle() {
    //   this.visible = false
    // },
    // seletedDataHandle(seletedCoupon, packageId) {
    //   let voucher_package = seletedCoupon.map((item) => {
    //     return item.package_id
    //   })

    //   this.levelData[packageId].voucher_package = voucher_package
    //   console.log('seletedCoupon', seletedCoupon)
    // },
    setData(val) {
      this.name = val.name
      this.base = val.base
      this.config = val.config
      this.data = val.data
      this.voucher_package = val.voucher_package
    },
    removeItem(index) {
      this.data.splice(index, 1)
    },
    setCoupons() {
      this.$emit('bindCoupons')
    },
    handleImgChange(index) {
      this.$emit('bindImgs', index)
    }
  }
}
</script>

<style scoped lang="scss">
.upload-box {
  height: 100px;
  width: 100px;
  border: 1px dashed #ccc;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-content: center;
  img {
    width: 100%;
  }
}
</style>
