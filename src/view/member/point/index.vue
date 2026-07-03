<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage :title="$t('031f6b81.35f445')" class="section section-white point-rule">
    <div slot="page-footer" class="text-center">
      <el-button type="primary" @click="save"> {{ $t('031f6b81.56df61') }} </el-button>
    </div>
    <el-form ref="form" :model="form" label-position="left" label-width="180px">
      <div class="section-body">
        <el-form-item v-if="!VERSION_SHUYUN()" :label="$t('031f6b81.3c4670')">
          <el-switch
            v-model="form.isOpenMemberPoint"
            :width="40"
            active-value="true"
            inactive-value="false"
            inactive-color="#ccc"
            :active-text="$t('031f6b81.cc42dd')"
            :inactive-text="$t('031f6b81.b15d91')"
            active-color="#13ce66"
            @change="isOpenMemberPointHandle"
          />
        </el-form-item>
        <el-form-item v-if="!VERSION_SHUYUN()" :label="$t('031f6b81.80dd3d')">
          <el-input v-model="form.name" placeholder="" style="width: 120px" :max="8" />
          <el-tooltip class="item" effect="dark" :content="$t('031f6b81.793980')" placement="top">
            <i class="el-icon-question" />
          </el-tooltip>
        </el-form-item>
        <div>
          <el-form-item v-if="showPointGainBlock" :label="$t('031f6b81.c5c99b')">
            <el-radio-group v-model="form.access" @change="changeAccess">
              <el-radio label="order"> {{ $t('031f6b81.4c117f') }} </el-radio>
              <el-radio label="items"> {{ $t('031f6b81.9897d8') }} </el-radio>
            </el-radio-group>
            <p v-if="access == 'order'" class="frm-tips">{{ $t('031f6b81.1e8e75') }}</p>
            <p v-if="access == 'items'" class="frm-tips">{{ $t('031f6b81.85f868') }}</p>
          </el-form-item>
          <el-form-item
            v-if="showPointGainBlock && access == 'order'"
            :label="$t('031f6b81.d85f77')"
          >
            {{ $t('031f6b81.37d64c')
            }}<el-input
              v-model="form.gain_point"
              type="number"
              placeholder=""
              style="width: 120px"
              :min="0"
              :max="9999999"
            />{{ $t('031f6b81.9f68a8') }}
          </el-form-item>

          <el-form-item
            v-if="showPointGainBlock && access == 'order'"
            :label="$t('031f6b81.73b492')"
          >
            <el-radio-group v-model="form.include_freight">
              <el-radio label="true"> {{ $t('031f6b81.e13556') }} </el-radio>
              <el-radio label="false"> {{ $t('031f6b81.da0291') }} </el-radio>
            </el-radio-group>
            <p v-if="include_freight == 'true'" class="frm-tips">
              {{ $t('031f6b81.45f8c7') }}
            </p>
            <p v-if="include_freight == 'false'" class="frm-tips">
              {{ $t('031f6b81.45f8c7') }}
            </p>
          </el-form-item>
          <el-form-item v-if="showPointGainBlock" :label="$t('031f6b81.643445')">
            {{ $t('031f6b81.86f31c')
            }}<el-input
              v-model="form.gain_limit"
              type="number"
              placeholder=""
              style="width: 120px"
              :min="1"
              :max="9999999"
            />{{ $t('031f6b81.9f68a8') }}
            <div class="frm-tips">{{ $t('031f6b81.385b7a') }}</div>
          </el-form-item>
          <el-form-item v-if="showPointGainBlock" :label="$t('031f6b81.d45a0c')">
            {{ $t('031f6b81.c1a80c')
            }}<el-input
              v-model="form.gain_time"
              type="number"
              placeholder=""
              style="width: 120px"
              :min="1"
              :max="9999999"
            />{{ $t('031f6b81.360b0e') }}
          </el-form-item>
          <template>
            <el-form-item
              v-if="
                VERSION_SHUYUN() || (form.isOpenMemberPoint == 'true' && !VERSION_IN_PURCHASE())
              "
              :label="$t('031f6b81.e81d87')"
            >
              <el-switch
                v-model="form.isOpenDeductPoint"
                :width="60"
                active-value="true"
                inactive-value="false"
                inactive-color="#ccc"
                :active-text="$t('031f6b81.cc42dd')"
                :inactive-text="$t('031f6b81.b15d91')"
                active-color="#13ce66"
                @change="isOpenMemberPointHandle"
              />
            </el-form-item>
            <el-form-item
              v-if="
                VERSION_SHUYUN() || (form.isOpenMemberPoint == 'true' && !VERSION_IN_PURCHASE())
              "
              :label="$t('031f6b81.0380cd')"
            >
              <el-input
                v-model="form.deduct_proportion_limit"
                type="number"
                placeholder=""
                style="width: 120px"
                :min="1"
                :max="100"
              />{{ $t('031f6b81.f39418') }}
            </el-form-item>
            <el-form-item
              v-if="
                VERSION_SHUYUN() || (form.isOpenMemberPoint == 'true' && !VERSION_IN_PURCHASE())
              "
              :label="$t('031f6b81.d7e11e')"
            >
              <el-input
                v-model="form.deduct_point"
                type="number"
                placeholder=""
                style="width: 120px"
                :min="1"
                :max="9999999"
              />
              {{ $t('031f6b81.8ef12b') }}
            </el-form-item>
            <el-form-item
              v-if="form.isOpenMemberPoint == 'true' && !VERSION_IN_PURCHASE() && !VERSION_SHUYUN()"
              :label="$t('031f6b81.70aecb')"
            >
              <el-radio-group v-model="form.can_deduct_freight">
                <el-radio label="1"> {{ $t('031f6b81.e13556') }} </el-radio>
                <el-radio label="0"> {{ $t('031f6b81.da0291') }} </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="form.isOpenMemberPoint == 'true' && !VERSION_IN_PURCHASE() && !VERSION_SHUYUN()"
              :label="$t('031f6b81.6067a8')"
            >
              <el-switch
                v-model="form.point_pay_first"
                :width="60"
                active-value="1"
                inactive-value="0"
                inactive-color="#ccc"
                :active-text="$t('031f6b81.cc42dd')"
                :inactive-text="$t('031f6b81.b15d91')"
                active-color="#13ce66"
              />
              <span class="frm-tips"> {{ $t('031f6b81.706377') }}</span>
            </el-form-item>
            <el-form-item
              v-if="
                VERSION_SHUYUN() || (form.isOpenMemberPoint == 'true' && !VERSION_IN_PURCHASE())
              "
              :label="$t('031f6b81.8aea67')"
            >
              <SpRichText v-model="form.rule_desc" />
              <div v-if="VERSION_SHUYUN()">{{ $t('031f6b81.b0835b') }}</div>
            </el-form-item>
          </template>
          <!-- <el-form-item label="购物赠送积分">
                       消费满<el-input  type="number"  v-model="form.deduct_shopping" placeholder="" style="width: 120px;" :min="1" :max="9999999"/>元 赠送1积分
                   </el-form-item> -->
        </div>
      </div>
    </el-form>
  </SpPage>
</template>
<script>
import { savePointRule, getPointRule } from '../../../api/promotions'

export default {
  data() {
    return {
      shuyunOpenPlatformEnabled: false,
      form: {
        isOpenMemberPoint: 'false',
        gain_point: 1,
        gain_limit: 999999,
        gain_time: 3,
        isOpenDeductPoint: false,
        deduct_point: 0,
        deduct_proportion_limit: 1,
        access: 'order',
        include_freight: 'true',
        rule_desc: '',
        point_pay_first: '1',
        can_deduct_freight: '1'
      },
      access: 'order',
      include_freight: 'true'
    }
  },
  computed: {
    /** 获取方式～获取时间：数云版或开启数云开放平台时不展示 */
    showPointGainBlock() {
      return (
        !this.VERSION_SHUYUN() &&
        !this.shuyunOpenPlatformEnabled &&
        this.form.isOpenMemberPoint == 'true'
      )
    }
  },
  mounted() {
    this.loadShuyunOpenPlatformFlag()
    this.getPointRule()
  },
  activated() {
    this.loadShuyunOpenPlatformFlag()
  },
  methods: {
    async loadShuyunOpenPlatformFlag() {
      try {
        const data = await this.$api.third.getShuyunCrmSetting()
        this.shuyunOpenPlatformEnabled = Boolean(data && data.is_enabled)
      } catch (e) {
        this.shuyunOpenPlatformEnabled = false
      }
    },
    isOpenMemberPointHandle(val) {
      if (val == 'false') {
        this.$confirm(this.$t('031f6b81.db6cb8'), this.$t('031f6b81.02d981'), {
          confirmButtonText: this.$t('031f6b81.38cf16'),
          cancelButtonText: this.$t('031f6b81.625fb2'),
          type: 'warning'
        })
          .then(() => {})
          .catch(() => {
            this.form.isOpenMemberPoint = 'true'

            this.$message({
              type: 'info',
              message: this.$t('031f6b81.2111cc')
            })
          })
      }
      console.log(val)
    },
    getPointRule() {
      getPointRule().then((response) => {
        this.form = response.data.data
        this.access = this.form.access
        this.include_freight = this.form.include_freight
      })
    },
    save() {
      if (this.form.isOpenMemberPoint) {
        if (this.form.gain_point < 0 || this.form.gain_time < 0) {
          this.$message({ message: this.$t('031f6b81.c702e2'), type: 'error' })
          return
        }
        if (this.form.gain_limit == '' || this.form.gain_limit == 0) {
          this.form.gain_limit = 9999999
        }
        if (this.form.gain_limit < this.form.gain_point) {
          this.$message({ message: this.$t('031f6b81.eabeef'), type: 'error' })
          return
        }

        if (this.form.isOpenDeductPoint) {
          if (this.form.deduct_point == '') {
            this.$message({ message: this.$t('031f6b81.f70c70'), type: 'error' })
            return
          }
          if (this.form.deduct_proportion_limit == '' || this.form.deduct_proportion_limit == 0) {
            this.form.deduct_proportion_limit = 1
          }
        }
      }
      savePointRule(this.form).then((response) => {
        this.getPointRule()
        this.$message({
          message: this.$t('031f6b81.3b1083'),
          type: 'success'
        })
      })
    },
    changeAccess(type) {
      this.access = type
      if (this.access == 'items') {
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.point-rule {
  height: auto !important;
}
</style>
