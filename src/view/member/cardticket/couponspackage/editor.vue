<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <div class="zykCouponEditor">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <span>基础信息</span>
        </div>
        <div class="content">
          <el-form-item label="劵包标题" prop="title">
            <el-input v-model="ruleForm.title" class="maxW" maxlength="10" show-word-limit />
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              v-model="ruleForm.package_describe"
              class="maxW"
              maxlength="20"
              show-word-limit
              placeholder="仅商家端显示，可以区分相似劵"
            />
          </el-form-item>
        </div>
      </el-card>
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <span>劵包信息</span>
          <div class="tips">劵包一旦保存,劵包信息不可再修改</div>
        </div>
        <div class="content">
          <el-form-item label-width="0px">
            <el-tooltip placement="top" width="350">
              <div slot="content" class="tips">
                <p>1. 券包不区分优惠券发送渠道，所有种类优惠券都可以配置到同一券包内。</p>
                <p>2. 券包可以设置限领，但限领规则优先由券包内优惠券设置及库存等决定。</p>
                <p>3. 券包内优惠券规则根据优惠券本身规则所定。</p>
                <p>4. 若有优惠券限领1张，券包限领2次，按优惠券规则领取数量。</p>
              </div>
              <el-button
                style="border: none; font-size: 14px; width: 100px"
                class="btn"
                type="text"
                icon="el-icon-warning-outline"
              >
                优惠劵包
              </el-button>
            </el-tooltip>
            <el-button :disabled="disabled" @click="pickHanle"> 选择优惠券 </el-button>
          </el-form-item>
          <el-form-item v-if="seletedCoupon.length > 0" label-width="20px">
            <cpn-table
              :seleted-coupon="seletedCoupon"
              :type="type"
              @deleteRowHandle="deleteRowHandle"
            />
          </el-form-item>

          <el-form-item label="发送规则">
            <span>券包内任一优惠券库存大于等于1时，券包都可继续发放 </span>
            <span>
              <el-tooltip placement="top" width="250">
                <div slot="content" class="tips">
                  <p>
                    例：选择券包内有5张优惠券，其中1张优惠券库存为零，用户可继续领取有库存的4张优惠券
                  </p>
                </div>
                <el-button
                  style="border: none; font-size: 14px; color: none"
                  class="btn"
                  type="text"
                  icon="el-icon-warning-outline"
                /> </el-tooltip
            ></span>
          </el-form-item>
          <el-form-item label="限领次数">
            <el-input
              v-model="ruleForm.limit_count"
              style="width: 130px"
              placeholder="请输入"
              :disabled="disabled"
            >
              <el-button slot="append"> 次 </el-button>
            </el-input>
            <p class="tips">每个用户领券上限，如不填，则默认为1。</p>
          </el-form-item>
        </div>
      </el-card>
      <div>
        <el-button @click="back"> 返回 </el-button>
        <el-button type="primary" @click="confirmHandle('ruleForm')"> 提交 </el-button>
      </div>
    </el-form>
    <template v-if="visible">
      <coupon-select
        :seleted-coupon="seletedCoupon"
        :visible="visible"
        @closeHandle="pickHanle"
        @seletedDataHandle="seletedDataHandle"
      />
    </template>
  </div>
</template>

<script>
import { MaxRules, requiredRules } from '@/view/base/setting/dealer/tools'
import couponSelect from '@/components/couponSelect'
import cpnTable from './cpn/table.vue'
export default {
  components: {
    couponSelect,
    cpnTable
  },
  data() {
    return {
      visible: false,
      disabled: false,
      type: 'create',
      ruleForm: {
        title: '',
        package_describe: '',
        limit_count: ''
      },
      seletedCoupon: [],
      rules: {
        title: [requiredRules('劵包标题'), MaxRules(10)]
      }
    }
  },
  mounted() {
    this.Config()
  },
  methods: {
    async Config() {
      const { type, package_id } = this.$route.query
      this.type = type

      if (type == 'create') {
        return
      }
      if (type == 'edit') {
        this.disabled = true
      }
      const { title, package_describe, limit_count, discount_cards } =
        await this.$api.coupons_package.couponDetail({
          package_id
        })
      this.ruleForm.title = title
      this.ruleForm.package_describe = package_describe
      this.ruleForm.limit_count = limit_count
      this.seletedCoupon = discount_cards
    },
    pickHanle() {
      this.visible = !this.visible
    },
    back() {
      this.$router.push({
        path: this.$route.matched[1].path
      })
    },
    seletedDataHandle(seletedCoupon) {
      this.seletedCoupon = seletedCoupon
      console.log(this.seletedCoupon)
    },
    deleteRowHandle(index) {
      this.seletedCoupon.splice(index, 1)
    },
    confirmHandle(formName) {
      console.log(this.$route)
      const { type, package_id } = this.$route.query
      if (type == 'edit') {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            const { status } = await this.$api.coupons_package.editCouponPackage({
              ...this.ruleForm,
              package_id: package_id
            })

            if (status) {
              this.$message.success('成功')
              this.$router.push({
                path: this.$route.matched[1].path
              })
            } else {
              this.$message.success('失败')
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            let package_content = []

            this.seletedCoupon.forEach(item => {
              package_content.push({ card_id: item.card_id, give_num: item.give_num })
            })

            const { status } = await this.$api.coupons_package.createdCoupons({
              ...this.ruleForm,
              package_content
            })

            if (status) {
              this.$message.success('成功')
              this.$router.push({
                path: this.$route.matched[1].path
              })
            } else {
              this.$message.success('失败')
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.zykCouponEditor ::v-deep .el-card {
  margin-bottom: 20px;
}
.zykCouponEditor {
  padding-bottom: 50px;
  .tips {
    display: inline-block;
    margin-left: 34px;
    font-size: 12px;
    color: #999;
  }
  .maxW {
    width: 500px;
  }
}
</style>

<style lang="scss">
.zykCouponEditor {
  // .btn:focus,
  // .btn:hover,
  // .btn:active {
  //   color: none;
  //   border-color: none;
  //   background-color: none !important;
  // }
  .el-button--text {
    color: #000;
  }
  .el-card__header {
    span {
      font-size: 15px;
      font-weight: 900;
    }
  }
}
</style>
