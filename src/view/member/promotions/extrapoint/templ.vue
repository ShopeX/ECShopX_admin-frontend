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
  <SpPage>
    <div v-for="item in list">
      <div class="section-header with-border">
        {{ item.name }} &nbsp; <small>{{ item.desc }}</small>
      </div>
      <div class="content-padded">
        <el-row v-for="(row, index) in item.itemList" :key="index" :gutter="20">
          <el-col>
            <div class="tip">
              <div class="view-flex">
                <div class="view-flex-item">
                  <p>{{ row.name }}</p>
                  <p>{{ row.desc }}</p>
                </div>
                <el-button @click="toForm(row.form)"> 选择 </el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </SpPage>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          name: '会员特权',
          desc: '会员福利，增加用户活跃度及粘性',
          itemList: [
            {
              name: '指定日期额外积分',
              desc: '如会员日关怀，指定日期会员可获取额外积分',
              form: 'member_day'
            }
          ]
        }
      ]
    }
  },
  methods: {
    toForm(type) {
      this.$router.push({
        path: this.$route.path.replace('templ', 'editor')
      })
    }
  }
}
</script>

<style scoped lang="scss">
.tip {
  padding: 16px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: 5px solid #50bfff;
}
</style>
