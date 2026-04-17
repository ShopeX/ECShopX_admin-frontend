<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style>
.grade-setting-row {
  border: 1px solid #eaeefb;
}
.grade-setting-col {
  height: 100%;
  padding: 18px 20px;
}
.grade-setting-item {
  padding-bottom: 10px;
}
.title {
  font-weight: bold;
}
</style>
<template>
  <SpPage class="section section-white">
    <el-form ref="form" :model="form" label-position="right" label-width="82px">
      <div class="section-body">
        <el-form-item :label="$t('d7e2997d.917de5')">
          <el-alert :title="$t('d7e2997d.dc9c7f')" type="info" close-text=" " />
          <el-switch
            v-model="form.isOpenPromoterGrade"
            :width="50"
            active-value="true"
            inactive-value="false"
            inactive-color="#ccc"
            :active-text="$t('d7e2997d.cc42dd')"
            :inactive-text="$t('d7e2997d.b15d91')"
            active-color="#13ce66"
          />
        </el-form-item>
        <template v-if="form.isOpenPromoterGrade == 'true'">
          <el-form-item :label="$t('d7e2997d.de6ecc')">
            <el-alert :title="$t('d7e2997d.4fe9b1')" type="info" close-text=" " />
            <el-radio-group v-model="form.upgrade.stat_cycle">
              <el-radio label="total">{{ $t('d7e2997d.dc5b71') }}</el-radio>
              <el-radio label="month_total">{{ $t('d7e2997d.6243d8') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('d7e2997d.f41256')">
            <el-checkbox
              v-model="form.upgrade.filter.children_num"
              :label="$t('d7e2997d.9cb632')"
            />
            <el-checkbox
              v-model="form.upgrade.filter.children_sales_amount"
              :label="$t('d7e2997d.8f9b46')"
            />
            <el-checkbox
              v-model="form.upgrade.filter.grade_member"
              :label="$t('d7e2997d.52eec0')"
            />
          </el-form-item>
          <el-form-item :label="$t('d7e2997d.b2b54b')">
            <el-alert
              :title="$t('d7e2997d.305ed8')"
              type="info"
              close-text=" "
              :description="$t('d7e2997d.a872a6')"
            />
            <el-row class="grade-setting-row" :gutter="20">
              <el-col
                v-for="(item, key) in form.grade"
                :key="key"
                :span="8"
                class="grade-setting-col"
              >
                <el-tag>{{ item.name }}</el-tag
                ><br />
                <span class="title">{{ $t('d7e2997d.9d05c7') }}</span>
                <el-input
                  v-model="form.grade[key].custom_name"
                  :placeholder="$t('d7e2997d.f70e00')"
                  :maxlength="30"
                  :minlength="1"
                  class="grade-setting-item"
                />
                <div v-if="item.grade_level > 1">
                  <span class="title">{{ $t('d7e2997d.f41256') }}</span>
                  <el-input
                    v-if="form.upgrade.filter.children_num"
                    v-model="form.grade[key].children_num"
                    type="number"
                    required
                    min="0"
                    class="grade-setting-item"
                  >
                    <template slot="append">{{ $t('d7e2997d.5d77a9') }}</template>
                  </el-input>
                  <el-input
                    v-if="form.upgrade.filter.children_sales_amount"
                    v-model="form.grade[key].children_sales_amount"
                    type="number"
                    required
                    min="0"
                    class="grade-setting-item"
                  >
                    <template slot="append">{{ $t('d7e2997d.2e8f96') }}</template>
                  </el-input>
                  <el-select
                    v-show="form.upgrade.filter.grade_member"
                    v-model="form.grade[key].grade_member"
                  >
                    <el-option
                      v-for="item in vipGradeList"
                      :key="item.lv_type"
                      :label="item.grade_name"
                      :value="item.lv_type"
                    />
                  </el-select>
                </div>
                <div v-if="item.grade_level == 2">
                  <span class="title">{{ $t('d7e2997d.d626d0') }}</span>
                  <el-input
                    v-model="form.grade[key].first_ratio"
                    class="grade-setting-item"
                    type="number"
                    required
                    min="0"
                  >
                    <template slot="append"> % </template>
                  </el-input>
                </div>
                <div v-if="item.grade_level == 3">
                  <span class="title">{{ $t('d7e2997d.4512e3') }}</span>
                  <el-input
                    v-model="form.grade[key].first_ratio"
                    class="grade-setting-item"
                    type="number"
                    required
                    min="0"
                  >
                    <template slot="append"> % </template>
                  </el-input>
                  <span class="title">{{ $t('d7e2997d.09deba') }}</span>
                  <el-input
                    v-model="form.grade[key].second_ratio"
                    class="grade-setting-item"
                    type="number"
                    required
                    min="0"
                  >
                    <template slot="append"> % </template>
                  </el-input>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
        </template>
      </div>
      <div class="section-footer with-border content-center">
        <el-button type="primary" @click="save">{{ $t('d7e2997d.56df61') }}</el-button>
      </div>
    </el-form>
  </SpPage>
</template>
<script>
import { getPromoterGradeConfig, setPromoterGradeConfig } from '../../api/promotions'
import { listVipGrade } from '../../api/cardticket'
export default {
  data() {
    return {
      form: {
        isOpenPromoterGrade: false,
        upgrade: {
          stat_cycle: 'total',
          filter: {
            children_num: false,
            children_sales_amount: false,
            grade_member: false
          }
        },
        grade: {
          first_grade: { name: this.$t('d7e2997d.10ffb7'), grade_level: 1 },
          second_grade: { name: this.$t('d7e2997d.cddd26'), grade_level: 2 },
          third_grade: { name: this.$t('d7e2997d.3dca9a'), grade_level: 3 }
        }
      },
      vipGradeList: {},
      isChecked: 0
    }
  },
  mounted() {
    getPromoterGradeConfig().then((res) => {
      console.log(res.data.data)
      if (res.data.data.upgrade) {
        this.form = res.data.data
      }
    }),
      listVipGrade().then((response) => {
        if (response != undefined && response.data.data && response.data.data.length > 0) {
          this.vipGradeList = response.data.data
        }
      }),
      this.isCheckedFun()
  },
  methods: {
    save() {
      this.isCheckedFun()
      if (this.form.isOpenPromoterGrade && this.isChecked == 3) {
        this.$message.error(this.$t('d7e2997d.e05a00'))
        return
      }

      setPromoterGradeConfig(this.form).then((res) => {
        this.$message({ message: this.$t('d7e2997d.3b1083'), type: 'success' })
      })
    },
    isCheckedFun() {
      let obj = this.form.upgrade.filter
      let arr = Array()
      this.isChecked = 0
      for (let i in obj) {
        arr[i] = obj[i]
        if (!arr[i]) {
          this.isChecked++
        }
      }
      console.log(789, this.isChecked)
    }
  }
}
</script>
