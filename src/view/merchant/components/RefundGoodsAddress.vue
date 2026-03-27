<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
      {{ $t('add1f60e.7f3581') }}
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
          label: this.$t('add1f60e.4a3fed'),
          key: 'name',
          type: 'input',
          className: 'refund-name',
          width: 'auto',
          placeholder: this.$t('add1f60e.acb9a6')
        },
        {
          label: this.$t('add1f60e.fba620'),
          width: 'auto',
          component: ({ key }, value) => {
            return (
              <div class='refund-address'>
                <el-cascader v-model={value['regions_id']} options={district} />
                <el-input
                  v-model={value['address']}
                  class='address'
                  placeholder={this.$t('add1f60e.b4b052')}
                />
              </div>
            )
          }
        },
        {
          label: this.$t('add1f60e.09a1f6'),
          width: 'auto',
          component: ({ key }, value) => {
            return (
              <div class='concat-mobile'>
                <el-input
                  v-model={value['area_code']}
                  class='input-area-code'
                  placeholder={this.$t('add1f60e.9a0e44')}
                />
                <span class='separator'>~</span>
                <el-input
                  v-model={value['mobile']}
                  class='input-mobile'
                  placeholder={this.$t('add1f60e.8f24ce')}
                />
              </div>
            )
          }
        },
        {
          label: this.$t('add1f60e.cc3307'),
          width: 'auto',
          component: ({ key }, value) => {
            return (
              <div class='time-block'>
                <el-time-select
                  v-model={value['startTime']}
                  class='input-start'
                  placeholder={this.$t('add1f60e.26dac3')}
                  picker-options={{
                    start: '00:00',
                    step: '00:30',
                    end: '23:59'
                  }}
                />
                <span class='separator'>~</span>
                <el-time-select
                  v-model={value['endTime']}
                  class='input-end'
                  placeholder={this.$t('add1f60e.f78277')}
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
