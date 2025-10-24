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
<style lang="scss">
.refund-goods-address {
  margin-top: 12px;
  line-height: initial;
  .tip {
    font-size: 13px;
    color: #999;
  }
  .inner-base-form {
    width: fit-content;
    background-color: #f0f2f5;
    margin-left: 120px;
    padding: 30px 30px 30px 0;
    .el-form-item {
      width: 700px;
    }
  }
  .sp-form {
    width: 750px;
    background: #f0f2f5;
    padding: 30px 0;
    margin-top: 6px;
    .el-form-item {
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .refund-name {
    width: 580px;
    max-width: initial;
  }
  .refund-address {
    display: flex;
    align-items: center;
    .el-cascader {
      margin-right: 10px;
    }
    .address {
      width: 375px;
      max-width: initial;
    }
  }
  .concat-mobile {
    display: flex;
    align-items: center;
    .input-area-code {
      width: 130px;
    }
    .input-mobile {
      width: 430px;
      max-width: initial;
    }
  }
  .time-block {
    display: flex;
    align-items: center;
    .input-start,
    .input-end {
      width: 130px;
    }
  }
}
</style>
<template>
  <div class="refund-goods-address">
    <div class="tip">
      退货点信息会在买家选择到店退货时展示，初次使用此功能时本店退货点默认为选中状态（可退货店铺列表内未展示），可在保存店铺信息后再次进入此页面移除。
    </div>
    <SpForm
      ref="form"
      v-model="form"
      show-message
      label-width="120px"
      :form-list="formList"
      :submit="false"
    />
  </div>
</template>

<script>
import district from '@/common/district.json'
export default {
  name: 'RefundGoodsAddress',
  props: ['value'],
  data() {
    return {
      district: district,
      form: {
        name: '',
        regions_id: '',
        address: '',
        area_code: '',
        mobile: '',
        startTime: '',
        endTime: ''
      },
      formList: [
        {
          label: '退货点名称',
          key: 'name',
          type: 'input',
          className: 'refund-name',
          width: 'auto',
          placeholder: '请填写退货点名称便于买家理解和管理'
        },
        {
          label: '退货点地址',
          width: 'auto',
          component: ({ key }, value) => {
            return (
              <div class="refund-address">
                <el-cascader v-model={value['regions_id']} options={district} />
                <el-input
                  v-model={value['address']}
                  class="address"
                  placeholder="请填写退货点的具体地址"
                />
              </div>
            )
          }
        },
        {
          label: '联系电话',
          width: 'auto',
          component: ({ key }, value) => {
            return (
              <div class="concat-mobile">
                <el-input v-model={value['area_code']} class="input-area-code" placeholder="区号" />
                <span class="separator">~</span>
                <el-input
                  v-model={value['mobile']}
                  class="input-mobile"
                  placeholder="请填写准确的联系电话，便于买家联系（手机号时，区号可为空）"
                />
              </div>
            )
          }
        },
        {
          label: '营业时间',
          width: 'auto',
          component: ({ key }, value) => {
            return (
              <div class="time-block">
                <el-time-select
                  v-model={value['startTime']}
                  class="input-start"
                  placeholder="起始时间"
                  picker-options={{
                    start: '00:00',
                    step: '00:30',
                    end: '23:59'
                  }}
                />
                <span class="separator">~</span>
                <el-time-select
                  v-model={value['endTime']}
                  class="input-end"
                  placeholder="结束时间"
                  picker-options={{
                    start: '00:00',
                    step: '00:30',
                    end: '23:59'
                  }}
                />
              </div>
            )
          }
        }
      ]
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        this.form = newVal
      }
    }
  },
  created() {},
  methods: {}
}
</script>
