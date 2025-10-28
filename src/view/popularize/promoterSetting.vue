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
        <el-form-item label="推广员等级">
          <el-alert
            title="开启推广员等级后，推广员可以通过提升等级来建立自己的推广团队，并且获取团队奖金"
            type="info"
            close-text=" "
          />
          <el-switch
            v-model="form.isOpenPromoterGrade"
            :width="50"
            active-value="true"
            inactive-value="false"
            inactive-color="#ccc"
            active-text="开启"
            inactive-text="关闭"
            active-color="#13ce66"
          />
        </el-form-item>
        <template v-if="form.isOpenPromoterGrade == 'true'">
          <el-form-item label="统计周期">
            <el-alert
              title="推广员升级的统计周期，累计或者月度统计（当月数据满足升级条件，不包含其他月份数据）"
              type="info"
              close-text=" "
            />
            <el-radio-group v-model="form.upgrade.stat_cycle">
              <el-radio label="total"> 累计 </el-radio>
              <el-radio label="month_total"> 月度统计 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="升级条件">
            <el-checkbox v-model="form.upgrade.filter.children_num" label="直属下线数量达到X人" />
            <el-checkbox
              v-model="form.upgrade.filter.children_sales_amount"
              label="直属下线销售总额达到X元"
            />
            <el-checkbox v-model="form.upgrade.filter.grade_member" label="成为指定付费等级会员" />
          </el-form-item>
          <el-form-item label="等级配置">
            <el-alert
              title="等级一，等级二，等级三......为由低到高，等级一为最低"
              type="info"
              close-text=" "
              description="直接获取一级团队分红比例：表示推广员的直属上级为三级推广员，中间无二级推广员"
            />
            <el-row class="grade-setting-row" :gutter="20">
              <el-col
                v-for="(item, key) in form.grade"
                :key="key"
                :span="8"
                class="grade-setting-col"
              >
                <el-tag>{{ item.name }}</el-tag
                ><br>
                <span class="title">等级名称</span>
                <el-input
                  v-model="form.grade[key].custom_name"
                  placeholder="自定义等级名称"
                  :maxlength="30"
                  :minlength="1"
                  class="grade-setting-item"
                />
                <div v-if="item.grade_level > 1">
                  <span class="title">升级条件</span>
                  <el-input
                    v-if="form.upgrade.filter.children_num"
                    v-model="form.grade[key].children_num"
                    type="number"
                    required
                    min="0"
                    class="grade-setting-item"
                  >
                    <template slot="append"> 直属下线数量 </template>
                  </el-input>
                  <el-input
                    v-if="form.upgrade.filter.children_sales_amount"
                    v-model="form.grade[key].children_sales_amount"
                    type="number"
                    required
                    min="0"
                    class="grade-setting-item"
                  >
                    <template slot="append"> 直属下线销售总额 </template>
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
                  <span class="title">团队分红比例</span>
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
                  <span class="title">直接获取一级团队分红比例</span>
                  <el-input
                    v-model="form.grade[key].first_ratio"
                    class="grade-setting-item"
                    type="number"
                    required
                    min="0"
                  >
                    <template slot="append"> % </template>
                  </el-input>
                  <span class="title">获取二级团队分红比例</span>
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
        <el-button type="primary" @click="save"> 保 存 </el-button>
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
          first_grade: { name: '等级一', grade_level: 1 },
          second_grade: { name: '等级二', grade_level: 2 },
          third_grade: { name: '等级三', grade_level: 3 }
        }
      },
      vipGradeList: {},
      isChecked: 0
    }
  },
  mounted() {
    getPromoterGradeConfig().then(res => {
      console.log(res.data.data)
      if (res.data.data.upgrade) {
        this.form = res.data.data
      }
    }),
      listVipGrade().then(response => {
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
        this.$message.error('至少选择一项升级条件')
        return
      }

      setPromoterGradeConfig(this.form).then(res => {
        this.$message({ message: '保存成功', type: 'success' })
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
