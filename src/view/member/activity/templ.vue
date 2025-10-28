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
  <SpPage class="section section-white page-activity-templ">
    <div v-for="item in list" :key="item.name">
      <div class="templ-title">
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
import { isValidActivity } from '../../../api/promotions'
export default {
  data() {
    return {
      list: [
        {
          name: '会员权益',
          desc: '定期会员关怀，增加会员粘性',
          itemList: [
            { name: '生日会员', desc: '会员生日关怀，提升消费体验', form: 'member_birthday' }
          ]
        },
        {
          name: '生命周期',
          desc: '全程会员关怀，培养会员忠诚度',
          itemList: [
            { name: '会员升级', desc: '会员升级关怀，激励消费升级', form: 'member_upgrade' },
            {
              name: '付费会员升级',
              desc: '付费会员升级关怀,赠送优惠券, 激励消费升级',
              form: 'member_vip_upgrade'
            },
            { name: '入会周年', desc: '会员入会周年庆，提升品牌归属', form: 'member_anniversary' },
            { name: '会员日', desc: '固定会员日，每年每月每周有活动', form: 'member_day' }
          ]
        }
      ]
    }
  },
  methods: {
    toForm(type) {
      var param = {
        activity_type: type
      }
      isValidActivity(param).then((res) => {
        this.$router.push({
          path: this.$route.path.replace('templ', 'editor/') + type
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.page-activity-templ {
  .tip {
    padding: 16px;
    background-color: color-mix(in srgb, #ffffff 90%, var(--primary));
    border-radius: 4px;
    border-left: 5px solid var(--primary);
  }
  .view-flex {
    display: flex;
  }
  .view-flex-item {
    flex: 1;
  }
  .templ-title {
    padding: 10px 15px;
  }
  .content-padded {
    padding: 10px;
  }
}
.page-activity-templ ::v-deep .el-row {
  margin-bottom: 10px;
}
</style>
