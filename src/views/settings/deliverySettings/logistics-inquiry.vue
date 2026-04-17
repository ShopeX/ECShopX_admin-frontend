<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="item.name"
        :name="item.activeName"
      >
        <div v-if="activeName == 'kdniao'" class="tab-form-container">
          <SpFormPlus
            v-model="kdniao_form.config"
            :form-items="kdniaoFormItems"
            form-type="form"
            @submit="onSubmit"
            :show-default-actions="false"
            label-width="100px"
          />
          <div class="section-footer with-border content-center">
            <el-button v-loading="loading" type="primary" @click="onSubmit">
              {{ $t('3f24b454.be5fbb') }}
            </el-button>
          </div>
        </div>

        <div v-if="activeName == 'kuaidi100'" class="tab-form-container">
          <SpFormPlus
            v-model="form.config"
            :form-items="kuaidi100FormItems"
            form-type="form"
            @submit="onSubmit"
            :show-default-actions="false"
            label-width="100px"
          />
          <div class="section-footer with-border content-center">
            <el-button v-loading="loading" type="primary" @click="onSubmit">
              {{ $t('3f24b454.be5fbb') }}
            </el-button>
          </div>
        </div>

        <div v-if="activeName == 'sfbsp'" class="tab-form-container">
          <SpFormPlus
            v-model="sfbsp_form.config"
            :form-items="sfbspFormItems"
            form-type="form"
            @submit="onSubmit"
            :show-default-actions="false"
            label-width="100px"
          />
          <div class="section-footer with-border content-center">
            <el-button v-loading="loading" type="primary" @click="onSubmit">
              {{ $t('3f24b454.be5fbb') }}
            </el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </SpPage>
</template>
<script>
import {
  getKdniaoSetting,
  setKdniaoSetting,
  getSfbspSetting,
  seSfbspSetting
} from '../../../api/trade'
export default {
  data() {
    return {
      activeName: 'kdniao',
      loading: false,
      kdniao_form: {
        kuaidi_type: 'kdniao',
        config: {
          EBusinessID: '',
          appkey: '',
          is_open: false,
          request_type: '8001'
        }
      },
      form: {
        kuaidi_type: 'kuaidi100',
        config: {
          app_key: '',
          app_secret: '',
          is_open: false
        }
      },
      sfbsp_form: {
        config: {
          url: '',
          accesscode: '',
          checkword: '',
          is_open: false
        }
      }
    }
  },
  computed: {
    tabList() {
      return [
        { name: this.$t('3f24b454.0c00a8'), activeName: 'kdniao' },
        { name: this.$t('3f24b454.c653e7'), activeName: 'kuaidi100' },
        { name: this.$t('3f24b454.eda877'), activeName: 'sfbsp' }
      ]
    },
    kdniaoFormItems() {
      return [
        {
          fieldName: 'EBusinessID',
          label: 'EBusinessID',
          component: 'input',
          componentProps: {
            style: { width: '400px' }
          }
        },
        {
          fieldName: 'appkey',
          label: 'AppKey',
          component: 'input',
          componentProps: {
            style: { width: '400px' }
          }
        },
        {
          fieldName: 'request_type',
          label: this.$t('3f24b454.7e5c88'),
          component: 'radio',
          componentProps: {
            options: [
              { label: this.$t('3f24b454.0357cd'), value: '1002' },
              { label: this.$t('3f24b454.22e0d3'), value: '8001' },
              { label: this.$t('3f24b454.348d08'), value: '8002' }
            ]
          }
        },
        {
          fieldName: 'is_open',
          label: this.$t('3f24b454.53c3dd'),
          component: 'switch',
          componentProps: {
            activeColor: '#13ce66',
            inactiveColor: '#ff4949'
          }
        },
        {
          fieldName: 'description',
          label: this.$t('3f24b454.104456'),
          component: (context) => {
            const { h } = context
            return h(
              'el-link',
              {
                props: {
                  type: 'primary',
                  href: 'http://www.kdniao.com/product-track1',
                  underline: false,
                  target: '_blank'
                }
              },
              this.$t('3f24b454.495f1e')
            )
          }
        }
      ]
    },
    kuaidi100FormItems() {
      return [
        {
          fieldName: 'app_key',
          label: 'Key',
          component: 'input',
          componentProps: {
            style: { width: '300px' }
          }
        },
        {
          fieldName: 'app_secret',
          label: 'Customer',
          component: 'input',
          componentProps: {
            style: { width: '300px' }
          }
        },
        {
          fieldName: 'is_open',
          label: this.$t('3f24b454.53c3dd'),
          component: 'switch',
          componentProps: {
            activeColor: '#13ce66',
            inactiveColor: '#ff4949'
          }
        },
        {
          fieldName: 'description',
          label: this.$t('3f24b454.104456'),
          component: (context) => {
            const { h } = context
            return h(
              'el-link',
              {
                props: {
                  type: 'primary',
                  href: 'https://api.kuaidi100.com/product/query/',
                  underline: false,
                  target: '_blank'
                }
              },
              this.$t('3f24b454.65b40f')
            )
          }
        }
      ]
    },
    sfbspFormItems() {
      return [
        {
          fieldName: 'url',
          label: this.$t('3f24b454.f682f8'),
          component: 'input',
          componentProps: {
            style: { width: '300px' }
          }
        },
        {
          fieldName: 'accesscode',
          label: this.$t('3f24b454.1312b0'),
          component: 'input',
          componentProps: {
            style: { width: '300px' }
          }
        },
        {
          fieldName: 'checkword',
          label: 'Checkword',
          component: 'input',
          componentProps: {
            style: { width: '300px' }
          }
        },
        {
          fieldName: 'is_open',
          label: this.$t('3f24b454.53c3dd'),
          component: 'switch',
          componentProps: {
            activeColor: '#13ce66',
            inactiveColor: '#ff4949'
          }
        }
      ]
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    handleClick() {
      this.getConfig()
    },
    getConfig() {
      if (this.activeName === 'kdniao') {
        getKdniaoSetting({ kuaidi_type: 'kdniao' }).then((response) => {
          const data = response.data.data
          this.kdniao_form.config = data
          const request_type = data.request_type || '8001'
          this.$set(this.kdniao_form.config, 'request_type', request_type)
        })
      } else if (this.activeName === 'kuaidi100') {
        getKdniaoSetting({ kuaidi_type: 'kuaidi100' }).then((response) => {
          this.form.config = response.data.data
        })
      } else if (this.activeName === 'sfbsp') {
        getSfbspSetting({}).then((response) => {
          const data = response.data.data
          if (!Array.isArray(data)) {
            if (data.is_open == 'true') {
              data.is_open = true
            } else {
              data.is_open = false
            }
            this.sfbsp_form.config = data
          }
        })
      }
    },
    onSubmit() {
      this.loading = true
      const queryMap = {
        kdniao: this.kdniao_form,
        kuaidi100: this.form,
        sfbsp: this.sfbsp_form
      }
      const apiMap = {
        sfbsp: seSfbspSetting,
        kdniao: setKdniaoSetting,
        kuaidi100: setKdniaoSetting
      }

      const query = queryMap[this.activeName]
      const api = apiMap[this.activeName]

      api(query)
        .then(() => {
          this.$message({ type: 'success', message: this.$t('3f24b454.3b1083') })
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 10px;
  .frm-tips {
    color: #ff0000;
  }
}

.tab-form-container {
  @apply min-h-[300px] pt-5;

  :deep(.sp-form-plus) {
    @apply min-h-[300px];

    .sp-form-plus__wrapper {
      @apply min-h-[250px];
    }
  }
}
</style>
