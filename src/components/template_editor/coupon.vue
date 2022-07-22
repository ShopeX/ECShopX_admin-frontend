<template>
  <section
    v-if="name === 'coupon'"
    class="section"
  >
    <div class="section-header with-border">
      设置
    </div>
    <div class="section-body">
      <el-form label-width="100px">
        <el-form-item label="标题">
          <el-input
            v-model="base.title"
            type="text"
          />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="base.subtitle" />
        </el-form-item>
        <el-form-item label="组件间距">
          <el-switch
            v-model="base.padded"
            active-color="#27cc6a"
            inactive-color="#efefef"
          />
        </el-form-item>
        <el-form-item label="选择优惠券">
          <div
            v-for="(item, index) in data"
            :key="index"
            class="setting-item item-selected"
          >
            <div
              v-if="item.imgUrl"
              class="upload-box"
            >
              <img
                :src="wximageurl + item.imgUrl"
                class="banner-uploader square thumbnail"
                @click="handleImgChange(index)"
              >
            </div>
            <div
              v-else
              class="banner-uploader square thumbnail"
              @click="handleImgChange(index)"
            >
              <div class="content-center">
                <i class="iconfont icon-camera" />
              </div>
            </div>
            {{ item.title }}
            <span
              v-if="item.type === 'cash'"
              class="amount-cur"
            >{{ item.amount }}元满减券</span>
            <span
              v-if="item.type === 'discount'"
              class="amount-cur"
            >{{ item.amount }}折券</span>

            <div
              class="setting-remove"
              @click="removeItem(index)"
            >
              <i class="iconfont icon-trash-alt" />
            </div>
          </div>
          <div class="frm-tips">
            只能上传jpg/png文件，且不超过2M （建议尺寸：375px * 200px）
          </div>
          <el-button
            type="default"
            class="iconfont icon-cog banner-button-uploader"
            @click="setCoupons"
          >
            设置优惠券
          </el-button>
        </el-form-item>
        <!----------------------------------- 卷包功能 ----------------------------------->

        <el-form-item label="选择优惠券包">
          <div
            v-for="(item, index) in voucher_package"
            :key="index"
            class="setting-item item-selected"
          >
            <div
              v-if="item.imgUrl"
              class="upload-box"
            >
              <img
                :src="wximageurl + item.imgUrl"
                class="banner-uploader square thumbnail"
                @click="couponPackageImg(index)"
              >
            </div>
            <div
              v-else
              class="banner-uploader square thumbnail"
              @click="couponPackageImg(index)"
            >
              <div class="content-center">
                <i class="iconfont icon-camera" />
              </div>
            </div>
            {{ item.title }}
            <div
              class="setting-remove"
              @click="removeCouponPackage(index)"
            >
              <i class="iconfont icon-trash-alt" />
            </div>
          </div>
          <div class="frm-tips">
            只能上传jpg/png文件，且不超过2M （建议尺寸：375px * 200px）
          </div>
          <el-button
            class="iconfont icon-cog banner-button-uploader"
            @click="pickCouponHanle()"
          >
            选择优惠券包
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
  data () {
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
      handler (value) {
        if (value) {
          this.setData(value)
        }
      }
    }
  },
  mounted () {
    this.setData(this.res)
  },
  methods: {
    pickCouponHanle () {
      this.$emit('couponPackageVisible')
    },
    couponPackageImg (index) {
      this.$emit('bindImgs', index, true)
    },
    removeCouponPackage (index) {
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
    setData (val) {
      this.name = val.name
      this.base = val.base
      this.config = val.config
      this.data = val.data
      this.voucher_package = val.voucher_package
    },
    removeItem (index) {
      this.data.splice(index, 1)
    },
    setCoupons () {
      this.$emit('bindCoupons')
    },
    handleImgChange (index) {
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
