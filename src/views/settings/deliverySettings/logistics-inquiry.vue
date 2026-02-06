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
            <el-button v-loading="loading" type="primary" @click="onSubmit"> 保存 </el-button>
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
            <el-button v-loading="loading" type="primary" @click="onSubmit"> 保存 </el-button>
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
            <el-button v-loading="loading" type="primary" @click="onSubmit"> 保存 </el-button>
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
      },
      tabList: [
        { name: '快递鸟', activeName: 'kdniao' },
        { name: '快递100', activeName: 'kuaidi100' },
        { name: '顺丰BSP', activeName: 'sfbsp' }
      ],
      kdniaoFormItems: [
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
          label: '扣量方式选择',
          component: 'radio',
          componentProps: {
            options: [
              { label: '免费版', value: '1002' },
              { label: '增值版（按单）', value: '8001' },
              { label: '增值版（按次）', value: '8002' }
            ]
          }
        },
        {
          fieldName: 'is_open',
          label: '是否启用',
          component: 'switch',
          componentProps: {
            activeColor: '#13ce66',
            inactiveColor: '#ff4949'
          }
        },
        {
          fieldName: 'description',
          label: '功能说明',
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
              '快递鸟快递物流跟踪'
            )
          }
        }
      ],
      kuaidi100FormItems: [
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
          label: '是否启用',
          component: 'switch',
          componentProps: {
            activeColor: '#13ce66',
            inactiveColor: '#ff4949'
          }
        },
        {
          fieldName: 'description',
          label: '功能说明',
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
              '快递100实时快递查询'
            )
          }
        }
      ],
      sfbspFormItems: [
        {
          fieldName: 'url',
          label: '接入地址',
          component: 'input',
          componentProps: {
            style: { width: '300px' }
          }
        },
        {
          fieldName: 'accesscode',
          label: '接入编码',
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
          label: '是否启用',
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
          this.$message({ type: 'success', message: '保存成功' })
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
