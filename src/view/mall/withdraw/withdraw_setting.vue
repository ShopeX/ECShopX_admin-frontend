<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage :title="$t('aeec1e55.b33aa1')">
    <template slot="page-footer">
      <div class="text-center">
        <el-button type="info" size="medium" @click="getConfig">
{{
          $t('aeec1e55.625fb2')
        }}
</el-button>

        <loading-btn
          ref="loadingBtn"
          size="medium"
          type="primary"
          :text="$t('aeec1e55.be5fbb')"
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
            <el-form-item :label="$t('aeec1e55.79b414')" prop="auto_draw_cash" label-width="100px">
              <el-radio-group v-model="form.auto_draw_cash">
                <el-radio label="Y">{{ $t('aeec1e55.232926') }}</el-radio>
                <el-radio label="N">{{ $t('aeec1e55.8eca60') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <div class="rules">
              <template v-if="form.auto_draw_cash == 'Y'">
                <el-form-item :label="$t('aeec1e55.7f7096')" prop="auto_type" class="noBottom">
                  <el-radio-group v-model="form.auto_type" @change="tabHandle">
                    <el-radio label="month">{{ $t('aeec1e55.c4d129') }}</el-radio>
                    <el-radio label="day">{{ $t('aeec1e55.44f946') }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item v-if="form.auto_type == 'month'" prop="auto_day" class="noBottom">
                  <el-date-picker
                    v-model="form.auto_day"
                    style="width: 180px"
                    type="date"
                    format="dd"
                    value-format="dd"
                    :placeholder="$t('aeec1e55.52f74c')"
                  />
                  <el-time-picker
                    v-model="form.auto_time"
                    style="width: 120px"
                    format="HH:mm"
                    value-format="HH:mm"
                    :placeholder="$t('aeec1e55.2c825a')"
                  />
                </el-form-item>
                <el-form-item v-if="form.auto_type == 'day'" prop="auto_time" class="noBottom">
                  <el-time-picker
                    v-model="form.auto_time"
                    style="width: 300px"
                    format="HH:mm"
                    value-format="HH:mm"
                    :placeholder="$t('aeec1e55.a1672f')"
                  />
                </el-form-item>
                <el-form-item>
                  <div class="tips">{{ $t('aeec1e55.56ee17') }}</div>
                </el-form-item>

                <el-form-item :label="$t('7f31cab4.292a28')" prop="min_cash">
                  <span class="tips">{{ $t('aeec1e55.1763c2') }}</span>
                  <el-input
                    v-model.number="form.min_cash"
                    style="width: 200px"
                    type="number"
                    min="0"
                  >
                    <template slot="append">{{ $t('aeec1e55.c16655') }}</template>
                  </el-input>
                  <span class="tips">{{ $t('aeec1e55.d96d6f') }}</span>
                </el-form-item>
                <el-form-item :label="$t('aeec1e55.79b414')" prop="cash_type">
                  <el-select
                    v-model="form.cash_type"
                    :placeholder="$t('aeec1e55.88c618')"
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
              <el-form-item :label="$t('aeec1e55.21e0e9')" prop="draw_limit">
                <el-input
                  v-model="form.draw_limit"
                  :placeholder="$t('aeec1e55.02cc4f')"
                  style="width: 300px"
                  type="number"
                  min="0"
                >
                  <template slot="append">{{ $t('aeec1e55.c16655') }}</template>
                </el-input>
              </el-form-item>
              <el-form-item :label="$t('aeec1e55.16914d')" class="noBottom">
                <el-radio-group v-model="isAllShop">
                  <el-radio label="Y">{{ $t('aeec1e55.d81bb2') }}</el-radio>
                  <el-radio label="N">{{ $t('aeec1e55.b22c01') }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <template v-if="isAllShop == 'N'">
                <el-form-item>
                  <el-button type="primary" size="mini" @click="seletedShopHandle">
                    {{ $t('aeec1e55.b5252d') }}
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
import { MaxRules } from '@/view/base/setting/dealer/tools'
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
        auto_draw_cash: [
          { required: true, message: () => this.$t('aeec1e55.aded40'), trigger: 'blur' }
        ],
        auto_type: [
          { required: true, message: () => this.$t('aeec1e55.cdf692'), trigger: 'change' }
        ],
        auto_day: [{ required: true, message: () => this.$t('aeec1e55.ba1490'), trigger: 'blur' }],
        auto_time: [{ required: true, message: () => this.$t('aeec1e55.6e5e4f'), trigger: 'blur' }],
        min_cash: [{ required: true, message: () => this.$t('aeec1e55.d7b3e3'), trigger: 'blur' }],
        cash_type: [
          { required: true, message: () => this.$t('aeec1e55.ced632'), trigger: 'change' }
        ],
        draw_limit: { required: true, message: () => this.$t('aeec1e55.a31457'), trigger: 'blur' },
        isAllShop: [{ required: true, message: () => this.$t('aeec1e55.c3fdb4'), trigger: 'blur' }]
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
      this.$refs[formName].validate(async (valid) => {
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
              this.$message.success(this.$t('aeec1e55.f6088e'))
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
