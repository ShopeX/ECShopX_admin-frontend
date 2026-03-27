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
      <el-button type="primary" @click="onSubmit">{{ $t('81ac78f1.be5fbb') }}</el-button>
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
          label: this.$t('81ac78f1.29731e'),
          component: 'switch',
          componentProps: {
            width: 60,
            'active-value': 'true',
            'inactive-value': 'false',
            'inactive-color': '#ccc',
            'active-text': this.$t('81ac78f1.cc42dd'),
            'inactive-text': this.$t('81ac78f1.b15d91'),
            'active-color': '#13ce66'
          }
        },
        {
          fieldName: 'is_hide',
          label: this.$t('81ac78f1.a3f95a'),
          component: 'switch',
          componentProps: {
            width: 60,
            'active-value': 'true',
            'inactive-value': 'false',
            'inactive-color': '#ccc',
            'active-text': this.$t('81ac78f1.cc42dd'),
            'inactive-text': this.$t('81ac78f1.b15d91'),
            'active-color': '#13ce66'
          }
        },
        {
          fieldName: 'person_id',
          label: this.$t('81ac78f1.30acd2'),
          component: 'input',
          componentProps: {
            style: { width: '300px' },
            placeholder: this.$t('81ac78f1.30acd2')
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
                this.$t('81ac78f1.0cc74f')
              )
            ])
          }
        },
        {
          fieldName: 'app_id',
          label: this.$t('81ac78f1.3751f6'),
          component: 'input',
          componentProps: {
            style: { width: '300px' },
            placeholder: this.$t('81ac78f1.3751f6')
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
                this.$t('81ac78f1.0cc74f')
              )
            ])
          }
        },
        {
          fieldName: 'app_key',
          label: this.$t('81ac78f1.b47711'),
          component: 'input',
          componentProps: {
            style: { width: '300px' },
            placeholder: this.$t('81ac78f1.b47711')
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
                this.$t('81ac78f1.0cc74f')
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
        this.$message({ message: this.$t('81ac78f1.3b1083'), type: 'success' })
        this.getInfo()
      } catch (error) {}
    }
  }
}
</script>
<style lang="scss" scoped></style>
