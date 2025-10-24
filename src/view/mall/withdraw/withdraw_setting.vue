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
  <SpPage title="提现设置">
    <template slot="page-footer">
      <div class="text-center">
        <el-button type="info" size="medium" @click="getConfig">取消</el-button>
        <!-- <el-button type="primary" size="medium" v-debounce:ruleForm="confirm">确认</el-button> -->

        <loading-btn
          ref="loadingBtn"
          size="medium"
          type="primary"
          text="保存"
          @clickHandle="confirm('ruleForm', 'loadingBtn')"
        />
      </div>
    </template>
    <div class="zyk_adapay_withdraw_setting">
      <el-card class="box-card" shadow="never">
        <!-- <div slot="header" class="clearfix">
          <span>提现设置</span>
        </div> -->
        <div class="content">
          <el-form
            ref="ruleForm"
            :model="form"
            class="demo-ruleForm"
            label-width="140px"
            :rules="rules"
          >
            <el-form-item label="提现类型" prop="auto_draw_cash" label-width="100px">
              <el-radio-group v-model="form.auto_draw_cash">
                <el-radio label="Y">自动提现</el-radio>
                <el-radio label="N">手动提现</el-radio>
              </el-radio-group>
            </el-form-item>
            <div class="rules">
              <template v-if="form.auto_draw_cash == 'Y'">
                <el-form-item label="提现规则" prop="auto_type" class="noBottom">
                  <el-radio-group v-model="form.auto_type" @change="tabHandle">
                    <el-radio label="month">每月提取时间</el-radio>
                    <el-radio label="day">每日提取时间</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item v-if="form.auto_type == 'month'" prop="auto_day" class="noBottom">
                  <el-date-picker
                    v-model="form.auto_day"
                    style="width: 180px"
                    type="date"
                    format="dd"
                    value-format="dd"
                    placeholder="请选择每月日期"
                  />
                  <el-time-picker
                    v-model="form.auto_time"
                    style="width: 120px"
                    format="HH:mm"
                    value-format="HH:mm"
                    placeholder="选择时间"
                  />
                </el-form-item>
                <el-form-item v-if="form.auto_type == 'day'" prop="auto_time" class="noBottom">
                  <el-time-picker
                    v-model="form.auto_time"
                    style="width: 300px"
                    format="HH:mm"
                    value-format="HH:mm"
                    placeholder="请选择每日提取时间"
                  />
                </el-form-item>
                <el-form-item>
                  <div class="tips">提现操作建议在10:00:00-22:00:00进行，以免影响操作时效。</div>
                </el-form-item>

                <el-form-item label="提现金额" prop="min_cash">
                  <span class="tips">当可提现余额大于 </span>
                  <el-input
                    v-model.number="form.min_cash"
                    style="width: 200px"
                    type="number"
                    min="0"
                  >
                    <template slot="append">元</template>
                  </el-input>
                  <span class="tips"> 可提现</span>
                </el-form-item>
                <el-form-item label="提现类型" prop="cash_type">
                  <el-select
                    v-model="form.cash_type"
                    placeholder="请选择提现类型"
                    style="width: 300px"
                  >
                    <el-option
                      v-for="item in cash_type_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </template>
              <el-form-item label="商户暂冻金额" prop="draw_limit">
                <el-input
                  v-model="form.draw_limit"
                  placeholder="请输入"
                  style="width: 300px"
                  type="number"
                  min="0"
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="不适用商户" class="noBottom">
                <el-radio-group v-model="isAllShop">
                  <el-radio label="Y">无</el-radio>
                  <el-radio label="N">指定商户</el-radio>
                </el-radio-group>
              </el-form-item>
              <template v-if="isAllShop == 'N'">
                <el-form-item>
                  <el-button type="primary" size="mini" @click="seletedShopHandle">
                    选择商户
                  </el-button>
                </el-form-item>
                <selector-table
                  :seleted-business="form.draw_limit_list"
                  @deleteRowHandle="deleteRowHandle"
                />
              </template>
            </div>
            <!--
          <el-form-item style="text-align: center; margin-top: 50px; margin-right: 130px">

          </el-form-item> -->
          </el-form>
        </div>
      </el-card>
      <template v-if="visible">
        <withdraw-shop
          :visible="visible"
          :seleted-business="form.draw_limit_list"
          @closeHandle="seletedShopHandle"
          @saveSeletedBusinessHandle="saveSeletedBusinessHandle"
        />
      </template>
    </div>
  </SpPage>
</template>

<script>
import loadingBtn from '@/components/loading-btn'
import { MaxRules, requiredRules } from '@/view/base/setting/dealer/tools'
import withdrawShop from '@/components/withdrawShop'
import selectorTable from './cpn/table.vue'
export default {
  components: {
    loadingBtn,
    withdrawShop,
    selectorTable
  },
  data() {
    return {
      visible: false,
      cash_type_options: [],
      isAllShop: 'N',
      form: {
        auto_draw_cash: 'Y', //是否自动提现
        auto_type: '', // 自动提现类型 (day,month)
        auto_day: '', //自动提现日期(1-31)
        auto_time: '', //自动提现时间(09:30)
        min_cash: '', //最小提现金额
        draw_limit: '', //商户暂冻金额
        cash_type: '', //取现类型：T1-T+1取现；D1-D+1取现；D0-即时取现
        // isAllShop: '',
        draw_limit_list: [] // 不适用商户
      },
      rules: {
        auto_draw_cash: [requiredRules('是否自动提现')],
        auto_type: [requiredRules('自动提现类型', 'change')],
        auto_day: [requiredRules('自动提现日期')],
        auto_time: [requiredRules('自动提现时间')],
        min_cash: [requiredRules('提现金额')],
        cash_type: [requiredRules('取现类型', 'change')],
        draw_limit: requiredRules('商户暂冻金额'),
        isAllShop: [requiredRules('不适用商户')]
      }
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    async getConfig() {
      const { cash_type_options, auto_config, draw_limit_list, draw_limit } =
        await this.$api.adapay.withDrawSetting()
      this.cash_type_options = cash_type_options
      if (auto_config.length == 0) {
        return
      }
      delete auto_config.draw_limit
      delete auto_config.draw_limit_list
      delete auto_config.next_time

      this.form = { ...this.form, ...auto_config }
      // if (auto_config.auto_draw_cash=='N') {
      //   this.form = auto_config
      // }

      this.form.draw_limit_list = draw_limit_list
      if (this.form.draw_limit_list.length > 0) {
        this.isAllShop = 'N'
      } else {
        this.isAllShop = 'Y'
      }

      this.form.draw_limit = draw_limit
      console.log(result)
    },
    seletedShopHandle() {
      this.visible = !this.visible
    },
    deleteRowHandle(index) {
      this.form.draw_limit_list.splice(index, 1)
    },
    saveSeletedBusinessHandle(multipleSelection) {
      this.form.draw_limit_list.forEach((item, index) => {
        multipleSelection.forEach((itemy, indexy) => {
          if (item.id == itemy.id) {
            multipleSelection.splice(indexy, 1)
          }
        })
      })
      this.form.draw_limit_list = [...this.form.draw_limit_list, ...multipleSelection]
      this.seletedShopHandle()
    },
    confirm(formName, ref) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            if (this.isAllShop == 'Y') {
              this.form.draw_limit_list = []
            }
            const obj = {
              ...this.form,
              draw_limit_list: JSON.stringify(this.form.draw_limit_list)
            }

            const { status } = await this.$api.adapay.saveDrawSetting(obj)
            if (status) {
              this.$message.success('设置成功')
              this.$refs[ref].closeLoading()
              this.getConfig()
            }
          } catch {
            this.$refs[ref].closeLoading()
          }
        } else {
          console.log('error submit!!')
          this.$refs[ref].closeLoading()
          return false
        }
      })
    },
    tabHandle(val) {
      if (val == 'month') {
        this.form.auto_time = ''
      } else {
        this.form.auto_day = ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.zyk_adapay_withdraw_setting {
  .clearfix span {
    font-weight: 700;
  }

  label {
    font-size: 12px;
    color: #000;
  }

  .el-row {
    margin-bottom: 0px;
  }

  .el-table th {
    background: #f5f5f5;
    color: #000;
  }

  .rules {
    padding: 30px;
    background: #f5f5f5;

    .tips {
      font-size: 12px;
      color: #999;
    }

    .noBottom {
      margin-bottom: 6px;
    }
  }
}
</style>
<style lang="scss">
.zyk_adapay_withdraw_setting {
}
</style>
