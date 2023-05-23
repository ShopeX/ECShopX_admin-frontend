<template>
  <div class="section section-white point-rule">
    <div class="section-header with-border">
      <div class="section-title">积分配置</div>
    </div>
    <el-form ref="form" :model="form" label-position="left" label-width="180px">
      <div class="section-body">
        <el-form-item label="积分：">
          <el-switch
            v-model="form.isOpenMemberPoint"
            :width="60"
            active-value="true"
            inactive-value="false"
            inactive-color="#ccc"
            active-text="开启"
            inactive-text="关闭"
            active-color="#13ce66"
            @change="isOpenMemberPointHandle"
          />
        </el-form-item>
        <el-form-item label="展示名称：">
          <el-input v-model="form.name" placeholder="" style="width: 120px" :max="8" />
          <el-tooltip
            class="item"
            effect="dark"
            content="设置店铺内积分对应的展示名称"
            placement="top"
          >
            <i class="el-icon-question" />
          </el-tooltip>
        </el-form-item>
        <div v-if="form.isOpenMemberPoint == 'true'">
          <el-form-item label="获取方式：">
            <el-radio-group v-model="form.access" @change="changeAccess">
              <el-radio label="order"> 订单 </el-radio>
              <el-radio label="items"> 商品 </el-radio>
            </el-radio-group>
            <p v-if="access == 'order'" class="frm-tips">说明：可按订单金额比例获取</p>
            <p v-if="access == 'items'" class="frm-tips">说明：可按单商品设置的积分值获取</p>
          </el-form-item>
          <el-form-item v-if="access == 'order'" label="获取比例：">
            订单金额1元人民币 获得<el-input
              v-model="form.gain_point"
              type="number"
              placeholder=""
              style="width: 120px"
              :min="1"
              :max="9999999"
            />积分
          </el-form-item>

          <el-form-item v-if="access == 'order'" label="运费配置：">
            <el-radio-group v-model="form.include_freight">
              <el-radio label="true"> 包含 </el-radio>
              <el-radio label="false"> 不包含 </el-radio>
            </el-radio-group>
            <p v-if="include_freight == 'true'" class="frm-tips">
              说明：可设置订单中运费部分金额是否可获取积分
            </p>
            <p v-if="include_freight == 'false'" class="frm-tips">
              说明：可设置订单中运费部分金额是否可获取积分
            </p>
          </el-form-item>
          <el-form-item label="积分获取限制：">
            每月最多获取<el-input
              v-model="form.gain_limit"
              type="number"
              placeholder=""
              style="width: 120px"
              :min="1"
              :max="9999999"
            />积分
            <div class="frm-tips">不限制请填写999999</div>
          </el-form-item>
          <el-form-item label="获取时间：">
            订单完成<el-input
              v-model="form.gain_time"
              type="number"
              placeholder=""
              style="width: 120px"
              :min="1"
              :max="9999999"
            />天，获取积分
          </el-form-item>
          <template v-if="!VERSION_IN_PURCHASE">
            <el-form-item label="积分抵扣：">
              <el-switch
                v-model="form.isOpenDeductPoint"
                :width="60"
                active-value="true"
                inactive-value="false"
                inactive-color="#ccc"
                active-text="开启"
                inactive-text="关闭"
                active-color="#13ce66"
                @change="isOpenMemberPointHandle"
              />
            </el-form-item>
            <el-form-item label="每单抵扣上限：">
              <el-input
                v-model="form.deduct_proportion_limit"
                type="number"
                placeholder=""
                style="width: 120px"
                :min="1"
                :max="100"
              />% 上限范围：1<=x<=100
            </el-form-item>
            <el-form-item label="抵扣比例：">
              <el-input
                v-model="form.deduct_point"
                type="number"
                placeholder=""
                style="width: 120px"
                :min="1"
                :max="9999999"
              />
              积分 抵扣1元人民币
            </el-form-item>
            <el-form-item label="积分规则：">
              <SpRichText v-model="form.rule_desc" />
            </el-form-item>
          </template>
          <!-- <el-form-item label="购物赠送积分">
                       消费满<el-input  type="number"  v-model="form.deduct_shopping" placeholder="" style="width: 120px;" :min="1" :max="9999999"/>元 赠送1积分
                   </el-form-item> -->
        </div>
      </div>
      <div class="section-footer with-border content-center">
        <el-button type="primary" @click="save"> 保 存 </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { savePointRule, getPointRule } from '../../../api/promotions'

export default {
  data() {
    return {
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
        rule_desc: ''
      },
      access: 'order',
      include_freight: 'true'
    }
  },
  mounted() {
    this.getPointRule()
  },
  methods: {
    isOpenMemberPointHandle(val) {
      if (val == 'false') {
        this.$confirm(
          '若关闭该设置，营销 - 分销推广 - 佣金奖励, 自动变更为现金奖励方式。',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {})
          .catch(() => {
            this.form.isOpenMemberPoint = 'true'

            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      }
      console.log(val)
    },
    getPointRule() {
      getPointRule().then((response) => {
        this.form = response.data.data
        ;(this.access = this.form.access), (this.include_freight = this.form.include_freight)
      })
    },
    save() {
      if (this.form.isOpenMemberPoint) {
        if (this.form.gain_point <= 0 || this.form.gain_time <= 0) {
          this.$message({ message: '请配置获取积分参数', type: 'error' })
          return
        }
        if (this.form.gain_limit == '' || this.form.gain_limit == 0) {
          this.form.gain_limit = 9999999
        }
        if (this.form.gain_limit < this.form.gain_point) {
          this.$message({ message: '获取积分限制不能小于获取积分比例', type: 'error' })
          return
        }

        if (this.form.isOpenDeductPoint) {
          if (this.form.deduct_point == '') {
            this.$message({ message: '请配置积分抵扣参数', type: 'error' })
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
          message: '保存成功',
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
