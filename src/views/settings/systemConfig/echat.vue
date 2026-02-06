<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />
    <SpFormPlus
      ref="form"
      v-model="form"
      :form-items="formItems"
      form-type="form"
      label-width="130px"
      :show-default-actions="false"
    />
    <div class="section-footer with-border content-center">
      <el-button type="primary" @click="onSubmit"> 一洽客服保存 </el-button>
    </div>
  </SpPage>
</template>

<script>
import { getECahtSetting, saveEChatSetting } from '../../../api/im'

export default {
  data() {
    return {
      loading: false,
      form: {
        is_open: '',
        echat_url: ''
      }
    }
  },
  computed: {
    formItems() {
      return [
        {
          fieldName: '__group_echat',
          component: 'group',
          label: '客服配置'
        },
        {
          fieldName: 'is_open',
          label: '开启一洽客服',
          component: 'switch',
          componentProps: {
            'active-value': 'true',
            'inactive-value': 'false',
            'inactive-color': '#ccc',
            'active-text': '开启',
            'inactive-text': '关闭',
            'active-color': '#13ce66'
          }
        },
        {
          fieldName: 'echat_url',
          label: '一洽客服链接地址',
          component: 'input',
          componentProps: {
            style: { width: '300px' },
            placeholder: '请输入内容'
          }
        }
      ]
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      getECahtSetting().then((response) => {
        this.form = response.data.data
      })
    },
    async onSubmit() {
      try {
        await this.$refs.form.validate()
        await saveEChatSetting(this.form)
        this.$message({ message: '保存成功', type: 'success' })
        this.getInfo()
      } catch (error) {}
    }
  }
}
</script>
