<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpFormPlus
      ref="form"
      v-model="form"
      :form-items="formItems"
      form-type="form"
      label-width="100px"
      :show-default-actions="false"
    />
    <div class="section-footer with-border content-center">
      <el-button type="primary" @click="onSubmit"> 保存 </el-button>
    </div>
  </SpPage>
</template>
<script>
import { getPrinterInfo, savePrinter } from '../../../../api/printer'

export default {
  data() {
    return {
      loading: false,
      form: {
        is_open: '',
        person_id: '',
        app_id: '',
        app_key: '',
        is_hide: '',
        type: 'yilianyun'
      },
      query: {
        type: 'yilianyun'
      }
    }
  },
  computed: {
    formItems() {
      return [
        {
          fieldName: 'is_open',
          label: '开启小票机',
          component: 'switch',
          componentProps: {
            width: 60,
            'active-value': 'true',
            'inactive-value': 'false',
            'inactive-color': '#ccc',
            'active-text': '开启',
            'inactive-text': '关闭',
            'active-color': '#13ce66'
          }
        },
        {
          fieldName: 'is_hide',
          label: '隐藏收货人',
          component: 'switch',
          componentProps: {
            width: 60,
            'active-value': 'true',
            'inactive-value': 'false',
            'inactive-color': '#ccc',
            'active-text': '开启',
            'inactive-text': '关闭',
            'active-color': '#13ce66'
          }
        },
        {
          fieldName: 'person_id',
          label: '用户ID',
          component: 'input',
          componentProps: {
            style: { width: '300px' },
            placeholder: '用户ID'
          },
          tip: () => {
            return this.$createElement('div', { class: 'frm-tips' }, [
              this.$createElement(
                'a',
                {
                  attrs: {
                    href: 'http://dev.10ss.net/admin/listapp',
                    target: '_blank'
                  }
                },
                '应用列表地址，点击进入应用，进行查询'
              )
            ])
          }
        },
        {
          fieldName: 'app_id',
          label: '应用ID',
          component: 'input',
          componentProps: {
            style: { width: '300px' },
            placeholder: '用户ID'
          },
          tip: () => {
            return this.$createElement('div', { class: 'frm-tips' }, [
              this.$createElement(
                'a',
                {
                  attrs: {
                    href: 'http://dev.10ss.net/admin/listapp',
                    target: '_blank'
                  }
                },
                '应用列表地址，点击进入应用，进行查询'
              )
            ])
          }
        },
        {
          fieldName: 'app_key',
          label: '应用密钥',
          component: 'input',
          componentProps: {
            style: { width: '300px' },
            placeholder: '用户ID'
          },
          tip: () => {
            return this.$createElement('div', { class: 'frm-tips' }, [
              this.$createElement(
                'a',
                {
                  attrs: {
                    href: 'http://dev.10ss.net/admin/listapp',
                    target: '_blank'
                  }
                },
                '应用列表地址，点击进入应用，进行查询'
              )
            ])
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
      getPrinterInfo(this.query).then((response) => {
        this.form = response.data.data
      })
    },
    async onSubmit() {
      try {
        await this.$refs.form.validate()
        await savePrinter(this.form)
        this.$message({ message: '保存成功', type: 'success' })
        this.getInfo()
      } catch (error) {}
    }
  }
}
</script>
<style lang="scss" scoped></style>
