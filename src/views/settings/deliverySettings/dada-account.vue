<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $t('8099ec30.e50663') }}</span>
      </div>
      <div class="w-full px-[50px]">
        <div class="account w-[300px] py-[30px] mr-[100px] box-border">
          <p class="flex justify-between pb-6">
            <span>{{ $t('8099ec30.9e7ef0') }}</span>
            <span class="text-xl leading-5">{{ account }} {{ $t('8099ec30.c16655') }}</span>
          </p>
          <SpFormPlus
            ref="form"
            v-model="form"
            :form-items="formItems"
            form-type="form"
            label-width="100px"
            :show-default-actions="false"
          />
          <div class="mx-auto mt-[50px]">
            <el-button type="primary" @click="submitForm">{{ $t('8099ec30.060196') }}</el-button>
          </div>
        </div>
      </div>
    </el-card>
  </SpPage>
</template>

<script>
import { get_DD_Account, getRechargeURL } from '@/api/account.js'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      account: 1000,
      form: {
        money: null
      }
    }
  },
  computed: {
    formItems() {
      return [
        {
          fieldName: 'money',
          label: this.$t('8099ec30.1bcb8e'),
          cellWidth: 0.6,
          component: ({ value, h, onInput }) => {
            return h('el-input', {
              props: {
                value: value,
                type: 'text',
                autocomplete: 'off',
                size: 'small'
              },
              class: 'money-input',
              on: {
                input: onInput
              }
            })
          },
          rules: [
            { required: true, message: this.$t('8099ec30.2085ff'), trigger: 'blur' },
            { validator: this.validateMoney, trigger: 'change' }
          ]
        }
      ]
    }
  },
  mounted() {
    this.getAccount()
  },
  methods: {
    async submitForm() {
      try {
        await this.$refs.form.validate()
        const amount = {
          amount: Number(this.form.money)
        }
        try {
          const { data } = await getRechargeURL(amount)
          window.open(data.data.link)
          // window.location.href = data.data.link
          // 清空不会触发验证
          this.form.money = null
          this.$refs.form.$refs.form.clearValidate()
        } catch (err) {
          Message.error(this.$t('8099ec30.d9217d'))
        }
      } catch (error) {
        // 验证失败
      }
    },
    async getAccount() {
      const result = await get_DD_Account()
      console.log(result)
      if (result.status == 200) {
        console.log(result.data.data.deliverBalance)
        this.account = result.data.data.deliverBalance
      }
    },

    validateMoney(rule, value, callback) {
      const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
      if (!Number(value)) {
        callback(new Error(this.$t('8099ec30.4bce36')))
      } else {
        if (!reg.test(value)) {
          callback(new Error(this.$t('8099ec30.061da0')))
        } else if (Number(value) > 10000) {
          callback(new Error(this.$t('8099ec30.f44589')))
        } else {
          callback()
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .account .el-input {
  position: relative;
  &::after {
    content: '元';
    position: absolute;
    right: 0.5%;
    top: 50%;
    transform: translateY(-50%);
    padding: 3px 10px;
    height: 30px;
    line-height: 22px;
    background-color: rgb(244, 244, 244);
  }
}
</style>
