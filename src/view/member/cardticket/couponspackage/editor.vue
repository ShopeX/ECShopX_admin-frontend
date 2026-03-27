<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="zykCouponEditor">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <span>{{ $t('c17172ba.6ea1fe') }}</span>
        </div>
        <div class="content">
          <el-form-item :label="$t('c17172ba.d994e3')" prop="title">
            <el-input v-model="ruleForm.title" class="maxW" maxlength="10" show-word-limit />
          </el-form-item>
          <el-form-item :label="$t('c17172ba.3bdd08')">
            <el-input
              v-model="ruleForm.package_describe"
              class="maxW"
              maxlength="20"
              show-word-limit
              :placeholder="$t('c17172ba.fb6982')"
            />
          </el-form-item>
        </div>
      </el-card>
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <span>{{ $t('c17172ba.d36e99') }}</span>
          <div class="tips">{{ $t('c17172ba.f8c31f') }}</div>
        </div>
        <div class="content">
          <el-form-item label-width="0px">
            <el-tooltip placement="top" width="350">
              <div slot="content" class="tips">
                <p>{{ $t('c17172ba.4c3511') }}</p>
                <p>{{ $t('c17172ba.6d7554') }}</p>
                <p>{{ $t('c17172ba.a6916e') }}</p>
                <p>{{ $t('c17172ba.f3bf70') }}</p>
              </div>
              <el-button
                style="border: none; font-size: 14px; width: 100px"
                class="btn"
                type="text"
                icon="el-icon-warning-outline"
              >
                {{ $t('c17172ba.9ea8d6') }}
              </el-button>
            </el-tooltip>
            <el-button :disabled="disabled" @click="pickHanle">
              {{ $t('c17172ba.45bcee') }}
            </el-button>
          </el-form-item>
          <el-form-item v-if="seletedCoupon.length > 0" label-width="20px">
            <cpn-table
              :seleted-coupon="seletedCoupon"
              :type="type"
              @deleteRowHandle="deleteRowHandle"
            />
          </el-form-item>

          <el-form-item :label="$t('c17172ba.9e426a')">
            <span>{{ $t('c17172ba.e7aa9e') }} </span>
            <span>
              <el-tooltip placement="top" width="250">
                <div slot="content" class="tips">
                  <p>{{ $t('c17172ba.f31a0f') }}</p>
                </div>
                <el-button
                  style="border: none; font-size: 14px; color: none"
                  class="btn"
                  type="text"
                  icon="el-icon-warning-outline"
                /> </el-tooltip
            ></span>
          </el-form-item>
          <el-form-item :label="$t('c17172ba.c89f2c')">
            <el-input
              v-model="ruleForm.limit_count"
              style="width: 130px"
              :placeholder="$t('c17172ba.02cc4f')"
              :disabled="disabled"
            >
              <el-button slot="append"> {{ $t('c17172ba.7229ec') }} </el-button>
            </el-input>
            <p class="tips">{{ $t('c17172ba.727b1d') }}</p>
          </el-form-item>
        </div>
      </el-card>
      <div>
        <el-button @click="back"> {{ $t('c17172ba.5f4112') }} </el-button>
        <el-button type="primary" @click="confirmHandle('ruleForm')">
          {{ $t('c17172ba.939d53') }}
        </el-button>
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
      seletedCoupon: []
    }
  },
  computed: {
    rules() {
      return {
        title: [requiredRules(this.$t('c17172ba.d994e3')), MaxRules(10)]
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
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const { status } = await this.$api.coupons_package.editCouponPackage({
              ...this.ruleForm,
              package_id: package_id
            })

            if (status) {
              this.$message.success(this.$t('c17172ba.330363'))
              this.$router.push({
                path: this.$route.matched[1].path
              })
            } else {
              this.$message.success(this.$t('c17172ba.acd5cb'))
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let package_content = []

            this.seletedCoupon.forEach((item) => {
              package_content.push({ card_id: item.card_id, give_num: item.give_num })
            })

            const { status } = await this.$api.coupons_package.createdCoupons({
              ...this.ruleForm,
              package_content
            })

            if (status) {
              this.$message.success(this.$t('c17172ba.330363'))
              this.$router.push({
                path: this.$route.matched[1].path
              })
            } else {
              this.$message.success(this.$t('c17172ba.acd5cb'))
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
