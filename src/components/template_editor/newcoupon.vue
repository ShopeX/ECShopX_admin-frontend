<template>
  <section v-if="name === 'coupon'" class="section">
    <div class="section-header with-border">设置</div>
    <div class="section-body">
      <el-form label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="base.title" type="text" />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="base.subtitle" />
        </el-form-item>
        <el-form-item label="组件间距">
          <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item label="选择优惠券">
          <div v-for="(item, index) in data" :key="index" class="setting-item item-selected">
            <div class="old-styles">
              <!--<img v-if="item.imgUrl" :src="wximageurl + item.imgUrl" class="banner-uploader square thumbnail" @click="handleImgChange(index)"/>
              <div class="banner-uploader square thumbnail" v-else @click="handleImgChange(index)">
                <div class="content-center">
                  <i class="iconfont icon-camera"></i>
                </div>
              </div>-->
              {{ item.title }}
              <span v-if="item.type === 'cash'" class="amount-cur">{{ item.amount }}元满减券</span>
              <span v-if="item.type === 'discount'" class="amount-cur">{{ item.amount }}折券</span>

              <div class="setting-remove" @click="removeItem(index)">
                <i class="iconfont icon-trash-alt" />
              </div>
            </div>
            <div class="background-color">
              背景色：
              <el-color-picker v-model="item.backgroundOne" />
              <el-color-picker v-model="item.backgroundTwo" />
              <el-color-picker v-model="item.backgroundThree" />

              按钮文字颜色：<el-color-picker v-model="item.btnColor" />
            </div>
            <div class="background-color">
              开始时间：<el-input v-model="item.startTime" type="text" />
            </div>
            <div class="background-color">
              结束时间：<el-input v-model="item.endTime" type="text" />
            </div>
          </div>
          <div class="frm-tips">只能上传jpg/png文件，且不超过2M （建议尺寸：375px * 200px）</div>
          <el-button
            type="default"
            class="iconfont icon-cog banner-button-uploader"
            @click="setCoupons"
          >
            设置优惠券
          </el-button>
        </el-form-item>
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
      data: []
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
    setData(val) {
      this.name = val.name
      this.base = val.base
      this.config = val.config
      this.data = val.data
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
.setting-item {
  display: block;
}
.old-styles {
  display: flex;
}
.background-color {
  margin-top: 10px;
  line-height: 40px;
}
</style>
