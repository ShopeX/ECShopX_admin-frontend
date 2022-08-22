<template>
  <div>
    <el-card>
      <div>
        <el-form v-loading="loading" label-width="180px" :model="form">
          <el-row :gutter="20">
            <el-col :span="4">
              <el-form-item label="优惠券主体底色">
                <el-color-picker v-model="form.bodyColor"></el-color-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
            <el-form-item label="领取按钮底色">
              <el-color-picker v-model="form.btnColor"></el-color-picker>
            </el-form-item>
            </el-col>
            <el-col :span="4">
            <el-form-item label="优惠券主体文字颜色">
              <el-color-picker v-model="form.textColor"></el-color-picker>
            </el-form-item>
            </el-col>
            <el-col :span="4">
            <el-form-item label="领取门槛文字/领取按钮文字颜色">
              <el-color-picker v-model="form.btnColor2"></el-color-picker>
            </el-form-item>
            </el-col>
            <el-col :span="4">
            <el-form-item label="为你推荐好券背景色">
              <el-color-picker v-model="form.receiveColor"></el-color-picker>
            </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="recommend_title" :style="{backgroundColor: form.receiveColor}">
          <div class="triangle-left"></div>
          <div class="triangle-right"></div>
          <p>为你推荐好券</p>
        </div>
        <div class="coupon-item">
          <div class="center-coupon-item" v-for="(item,index) in info" :key="index">
            <span class="semicircle semicircle-l"></span>
            <span class="semicircle semicircle-r"></span>
            <div class="center-coupon-item__up"  :style="{backgroundColor: form.bodyColor}">
              <div class="center-coupon-item__price-wrap">
                <div class="center-coupon-item__price" :style="{color: form.textColor}" v-if="item.card_type == 'discount'">{{ (100 - item.discount)/10 }}折</div>
                <div class="center-coupon-item__price" :style="{color: form.textColor}" v-if="item.card_type == 'cash'">
                  <p class="center-coupon-item__price-num" unit="cent"> {{item.reduce_cost}}</p>
                  <p class="center-coupon-item__price-num-reduce" :style="{color: form.btnColor2}"> 满{{item.least_cost > 0 ? item.least_cost/100 : 0.01}}可用</p>
                </div>
                <div class="center-coupon-item__price" v-if="item.card_type == 'gift'">兑换券</div>
              </div>
              <div class="center-coupon-item__desc" :style="{color: form.textColor}">
                <div class="title" v-if="item.card_type != 'gift'" :style="{color: form.textColor}">
                  {{item.title}}
                </div>
                <div class="time" :style="{color: form.textColor}">{{item.begin_date}} - {{item.end_date}}
                  <p class="use_rules" :style="{color: form.textColor}">使用规则</p>
                </div>
              </div>
            </div>
            <div class="center-coupon-item__down no-receive-btn" 
              :style="{backgroundColor: form.btnColor}"
              v-if="item.getted != 1 && item.getted != 2">
              <p class="no-receive" 
              >立即领取</p>
            </div>
            <div class="center-coupon-item__down have-receive-btn" 
              v-else-if="item.getted == 1">
              <p class="have-receive"
              >已领取</p>
            </div>
            <div class="center-coupon-item__down is-end-btn"
              v-else-if="item.getted == 2 ">
              <p class="is-end"
              >已结束</p>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getTdkglobalset, saveTdkglobalset } from '../../../api/tdkset'

export default {
  components: {},

  data() {
    return {
      loading: false,
      form: {
        bodyColor: '#E83637',
        btnColor: '#F9D0A0',
        textColor: '#FFFFFF',
        btnColor2: '#D21C0C',
        receiveColor: '#E83637',
      },
      info: [
        {
          card_type: 'cash',
          title: '满减券',
          discount: '80', // 折扣
          least_cost: 2000, // 满减条件
          reduce_cost: '10', // 减免金额
          begin_date: '2022-08-10', // 开始时间
          end_date: '2022-08-20', // 结束时间
          notice: '测试是测试', // 使用规则
          getted: '0', // 领取状态 0未领取 1已领取 2已结束
        },
        {
          card_type: 'discount',
          title: '满减券',
          discount: '80', // 折扣
          least_cost: 1000, // 满减条件
          reduce_cost: '10', // 减免金额
          begin_date: '2022-08-10', // 开始时间
          end_date: '2022-08-20', // 结束时间
          notice: '测试是测试', // 使用规则
          getted: '1', // 领取状态 0未领取 1已领取 2已结束
        },
        {
          card_type: 'discount',
          title: '满减券',
          discount: '80', // 折扣
          least_cost: 0, // 满减条件
          reduce_cost: '10', // 减免金额
          begin_date: '2022-08-10', // 开始时间
          end_date: '2022-08-20', // 结束时间
          notice: '测试是测试', // 使用规则
          getted: '2', // 领取状态 0未领取 1已领取 2已结束
        },
      ]
    }
  },
  mounted() {
  },
  methods: {
    
    // 保存数据
    save() {
      // saveTdkglobalset(this.form).then((res) => {
        this.$message({ type: 'success', message: '操作成功' })
      // })
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  }
}
</script>
<style scoped lang="scss">
.tip {
  font-size: 12px;
  color: #909399;
}
.recommend_title{
  position: relative;
  width: max-content;
  margin: 0 auto;
  color: #FFF;
  padding: 6px 20px;
  margin-bottom: 76px;
  .triangle{
    &-right {
      position: absolute;
      top: 11px;
      right: -10px;
      width: 0;
      height: 0;
      border-left: 15px solid transparent;
      border-right: 15px solid transparent;
      border-bottom: 10px solid #FFF;
      transform: rotate(-90deg);
    }
    &-left {
      position: absolute;
      top: 11px;
      left: -10px;
      width: 0;
      height: 0;
      border-left: 15px solid transparent;
      border-right: 15px solid transparent;
      border-bottom: 10px solid #FFF;
      transform: rotate(90deg);
    }
  }
}
.coupon-item{
  display: flex;
  width: 100%;
  justify-content: center;
}
.center-coupon-item {
  position: relative;
  width: 366px;
  display: flex;
  margin-bottom: 24px;
  margin-right: 32px;
  &__up {
    position: relative;
    width: 100%;
    // height: 140px;
    background-color: #E83637;
    position: relative;
    // background: radial-gradient(transparent 0, transparent 5px, #ffb937 5px);
    background-size: 15px 15px;
    background-position: 0px 14px;
  }
  .semicircle {
    position: absolute;
    // top: 63px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    border: 1px solid #FFF;
    &-l {
      z-index: 1;
      right: 64px;
      top: -12px;
    }
    &-r {
      z-index: 1;
      right: 64px;
      bottom: -12px;
    }
  }
  &__up::after {
    content: '';
    width: 0 ;
    height: 100%;
    position: absolute;
    border-right: 6px dotted white;
    right: -3px;
    top: 0;
  }
  &__desc {
    padding: 3px 15px 0px 15px;
    // text-align: center;
    line-height: 22px;
    height: 55px;
    color: #fff;
    .time {
      font-size: 12px;
      display: flex;
      align-items: center;
      .use_rules{
        margin-left: 25px;
        text-decoration: underline;
      }
    }
  }
  &__down::after {
    content: '';
    width: 0 ;
    height: 100%;
    position: absolute;
    border-right: 6px dotted white;
    left: -3px;
    top: 0;
  }
  &__down {
    background-color: #F9D0A0;
    position: relative;
    text-align: center;
    overflow: hidden;
    width: 92px;
    align-items: center;
    justify-content: center;
    display: flex;
    .code {
      padding: 10px 0;
      color: #666;
    }
    .use-goods {
      margin-bottom: 10px;
      font-size: 12px;
      color: #888;
    }
    .btn-wrap {
      text-align: center;
      position: absolute;
      width: 100%;
      bottom: 10px;
      .btn-text {
        height: 32px;
        line-height: 32px;
        color: #e6a23c;
        font-size: 12px;
        &.btn {
          cursor: pointer;
          display: inline-block;
          color: #f0c78a;
          background-color: #fdf6ec;
          border: 1px solid #faecd8;
          line-height: 30px;
          padding: 0 9px;
          border-radius: 3px;
        }
        &.disabled {
          cursor: not-allowed;
        }
      }
    }
    .shop {
      text-align: center;
      color: #666;
      margin-bottom: 10px;
      &-title {
        display: inline-block;
        vertical-align: top;
        color: #666;
      }
      ul {
        display: inline-block;
        text-align: left;
      }
      li {
        width: 160px;
        color: #66b1ff;
        cursor: pointer;
        margin-bottom: 2px;
      }
      li:hover {
        color: #409eff;
      }
    }
    .use {
      text-align: center;
      position: absolute;
      width: 100%;
      bottom: 20px;
      p {
        height: 32px;
        line-height: 32px;
        color: #e6a23c;
      }
    }
    .no-receive{
      color: #E83637;
      width: 50%;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      align-items: center;
    }
    .have-receive{
      color: #E83637;
      background: #FFDEDE;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      align-items: center;
    }
    .is-end{
      color: #858585;
      background: #EAEAEA;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      align-items: center;
    }
  }
  .no-receive-btn {
    background: #F9D0A0;
  }
  .have-receive-btn {
    background: #FFDEDE;
  }
  .is-end-btn {
    background: #EAEAEA;
  }
  &__left{
    position: relative;
    width: 138px;
    height: 100%;
    float: left;
  }
  &__right  {
    width: calc(100% - 138px);
    height: 100%;
    color: #fff;
    padding: 0 20px 0 26px;
    margin-left: 138px;
  }
  &__logo{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 0;
    bottom: 0;
    margin: auto;
  }
  &__price {
    font-size: 35px;
    // margin-top: 30px;
    color: #fff;
    display: flex;
    align-items: center;
    &-num {
      line-height: 1;
      font-size: 35px;
      display: flex;
      align-items: flex-end;
      span {
        color: #fff;
      }
      .price__symbol{
        color: #fff;
        font-size: 24px;
      }
      .price__int {
        color: #fff;
        font-size: 40px;
        font-weight: bold;
      }
      .price__decimal {
        display: none;
      }
    }
    &-num-reduce {
      margin-left: 11px;
      padding: 5px 11px;
      height: 23px;
      line-height: 13px;
      font-size: 12px;
      color: #D21C0C;
      background: #FFE2E2;
      border-radius: 5px;
    }
    &-wrap {
      line-height: 40px;
      padding: 8px 15px 0px 15px;
      color: #fff !important;
      text-align: center;
    }
    // text-align: right;
    // padding-top: 12px;
    // &-top{
    // }
    // &-unit {
    //   font-size: 20px;
    //   vertical-align: bottom;
    // }
    // &-num {
    //   font-size: 49px;
    //   line-height: 1;
    //   letter-spacing: -2px;
    //   color: #fff;
    // }
    // &-text{
    //   font-size: 16px;
    //   letter-spacing: 1px;
    //   color: #fff;
    // }
  }
  &__rule{
    text-align: left;
    margin-top: 18px;
    min-height: 150px;
    padding: 10px;
    &-hd{
      font-size: 20px;
    }
    &-text{
      font-size: 14px;
      letter-spacing: 1px;
      margin-top: 10px;
    }
  }
  &.invalid {
    .coupon-item__up {
      background: #ccc;
    }
    .coupon-item__price-wrap, .coupon-item__desc {
      background: #ccc;
    }
  }
}
</style>
