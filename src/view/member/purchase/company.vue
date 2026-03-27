<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.dg-create-company {
  .sort-input {
    .el-input {
      margin-left: 0;
    }
    .suffix {
      font-size: 13px;
      color: #999;
    }
  }
}
</style>
<style lang="scss" scoped>
.qurcode-canvas {
  position: fixed;
  left: -1000%;
  right: -1000%;
}
</style>
<template>
  <SpPage>
    <SpFilterForm :model="queryForm" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="name" :label="$t('63ede0f6.1a1bc7')">
        <el-input v-model="queryForm.name" :placeholder="$t('63ede0f6.8ded4d')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="enterprise_sn" :label="$t('63ede0f6.f969ea')">
        <el-input v-model="queryForm.enterprise_sn" :placeholder="$t('63ede0f6.5ee937')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="auth_type" :label="$t('63ede0f6.b28abf')">
        <el-select v-model="queryForm.auth_type" :placeholder="$t('63ede0f6.370e61')">
          <el-option
            v-for="(item, index) in validateTypeList"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="distributor_id" :label="$t('63ede0f6.16f2bc')">
        <SpSelectShop
          v-model="queryForm.distributor_id"
          clearable
          :placeholder="$t('63ede0f6.708c9d')"
        />
      </SpFilterFormItem>
    </SpFilterForm>

    <div class="action-container">
      <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addCompany">
        {{ $t('63ede0f6.0b1ff3') }}
      </el-button>
    </div>

    <SpFinder
      ref="finder"
      no-selection
      :setting="setting"
      :row-actions-align="'left'"
      :hooks="{
        beforeSearch: beforeSearch
      }"
      url="/enterprise"
    />

    <SpDialog
      ref="addDialogRef"
      v-model="addDialog"
      class="dg-create-company"
      :title="companyForm.id ? $t('63ede0f6.610002') : $t('63ede0f6.0b1ff3')"
      :modal="false"
      :form="companyForm"
      :form-list="companyFormList"
      :confirm-status="addDialogLoading"
      :is-show-footer="isShowFooter"
      @onSubmit="onCompanyFormSubmit"
    />

    <el-dialog
      :title="$t('63ede0f6.897af2') + '-' + qrcodeName"
      :visible.sync="qrDialog"
      width="30%"
    >
      <span>{{ $t('63ede0f6.85d62d') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="qrDialog = false">{{ $t('63ede0f6.c08ab9') }}</el-button>
        <el-button type="primary" @click="handleDownload">{{ $t('63ede0f6.feea92') }}</el-button>
      </span>
    </el-dialog>

    <SpDialog
      ref="sendEmailRef"
      v-model="sendEmailDialog"
      class="dg-create-company"
      :title="$t('63ede0f6.eed806')"
      :confirm-btn-text="$t('63ede0f6.c5c358')"
      :confirm-status="sendEmaiLoading"
      :modal="false"
      :form="sendEmailForm"
      :form-list="sendEmailFormList"
      @onSubmit="onSendEmailSubmit"
    />

    <canvas id="qurcodeCanvas" class="qurcode-canvas" />
  </SpPage>
</template>

<script>
import { createSetting } from '@shopex-ui/finder'
import { getUrlPathByLoginType } from '@/utils'
import { VALIDATE_TYPES } from './consts'
import { i18n } from '@/i18n'

export default {
  name: '',
  data() {
    const t = (key) => i18n.t(key)
    const self = this
    const isShow = () => {
      return self.companyForm.auth_type == 'email'
    }

    const validator = (rule, value, callback) => {
      const { auth_type } = self.companyForm
      if (auth_type != 'email' || (auth_type == 'email' && !!value)) {
        callback()
      } else {
        callback(t('63ede0f6.281bad'))
      }
    }

    return {
      qrcodeUrl: '',
      qrcodeName: '',
      qrCodeBgImage: '',
      queryForm: {
        name: '',
        enterprise_sn: '',
        auth_type: '',
        distributor_id: ''
      },
      sendEmailDialog: false,
      sendEmaiLoading: false,
      sendEmailForm: {
        email: '',
        enterprise_id: ''
      },
      sendEmailFormList: [
        {
          component: () => {
            return (
              <el-alert
                title={t('63ede0f6.639e7b')}
                type='warning'
                closable={false}
              ></el-alert>
            )
          }
        },
        {
          label: t('63ede0f6.b5f0bd'),
          key: 'email',
          type: 'input',
          placeholder: t('63ede0f6.a18c29'),
          required: true,
          message: t('63ede0f6.211d59')
        }
      ],
      setting: createSetting({
        actions: [
          {
            name: () => t('63ede0f6.95b351'),
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return !(this.IS_ADMIN() && row.distributor_id != '0')
            },
            action: {
              handler: async ([row]) => {
                Object.keys(this.companyForm).forEach((key) => (this.companyForm[key] = row[key]))
                this.companyForm.is_employee_check_enabled =
                  this.companyForm.is_employee_check_enabled == 'true'
                this.isShowFooter = true
                this.addDialog = true
              }
            }
          },
          {
            name: () => t('63ede0f6.607e7a'),
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return this.IS_ADMIN() && row.distributor_id != '0'
            },
            action: {
              handler: async ([row]) => {
                Object.keys(this.companyForm).forEach((key) => (this.companyForm[key] = row[key]))
                this.companyForm.is_employee_check_enabled =
                  this.companyForm.is_employee_check_enabled == 'true'
                this.isShowFooter = false
                this.addDialog = true
              }
            }
          },
          {
            name: () => t('63ede0f6.eed806'),
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return row.auth_type == 'email' && !(this.IS_ADMIN() && row.distributor_id != '0')
            },
            action: {
              handler: async ([row]) => {
                this.sendEmailForm = {
                  email: '',
                  enterprise_id: row.id
                }
                this.sendEmailDialog = true
              }
            }
          },
          {
            name: () => t('63ede0f6.22b03c'),
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            // visible: (row) => {
            //   return row.auth_type == 'qr_code'
            // },
            action: {
              handler: async ([row]) => {
                const { base64Image } = await this.$api.member.getEnterpriseQrcode({
                  enterprise_id: row.id
                })
                this.qrcodeUrl = base64Image
                this.qrcodeName = row.name
                if (row.qr_code_bg_image) {
                  this.qrCodeBgImage = row.qr_code_bg_image
                }
                this.qrDialog = true
              }
            }
          },
          {
            name: () => t('63ede0f6.a6b8e9'),
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            // visible: (row) => {
            //   return row.auth_type == 'qr_code'
            // },
            action: {
              handler: async ([row]) => {
                window.open(
                  `${getUrlPathByLoginType(
                    `/applications/enterprise-purchase/staff-management?company_id=${row.id}`
                  )}`,
                  '_blank'
                )
              }
            }
          }
        ],
        columns: [
          { name: t('63ede0f6.5a83cb'), key: 'id' },
          {
            name: t('63ede0f6.390b03'),
            key: 'logo',
            render: (h, { row }) => {
              if (row.logo) {
                return h('el-image', {
                  props: {
                    src: row.logo
                  },
                  class: {
                    'company-logo': true
                  },
                  style: {
                    width: '64px',
                    display: 'block'
                  }
                })
              } else {
                return ''
              }
            }
          },
          {
            name: t('63ede0f6.f47e27'),
            key: 'name'
          },
          {
            name: t('63ede0f6.705f0a'),
            key: 'enterprise_sn'
          },
          {
            name: t('63ede0f6.c360e9'),
            key: 'sort',
            showType: 'pop-editable',
            componentProps: {
              icon: 'el-icon-edit',
              popperClass: 'sp-finder__popover-edit',
              change: async (v, row) => {
                await this.$api.member.updateCompanySort({
                  enterprise_id: row.id,
                  sort: v
                })
                this.$refs['finder'].refresh()
              }
            }
          },
          {
            name: t('63ede0f6.78cbe8'),
            key: 'auth_type',
            formatter: (value, { auth_type }, col) => {
              const authType = self.validateTypeList.find((item) => item.value == auth_type)
              return authType ? authType.name : ''
            }
          },
          {
            name: t('63ede0f6.3fea7c'),
            key: 'disabled',
            render: (h, { row }) =>
              h('el-switch', {
                props: {
                  value: row.disabled + '',
                  'active-value': '0',
                  'inactive-value': '1'
                },
                on: {
                  change: async (e) => {
                    await self.$api.member.updateCompanyStatus({
                      enterprise_id: row.id,
                      disabled: e
                    })
                    row.disabled = e
                  }
                }
              })
          },
          {
            name: t('63ede0f6.16f2bc'),
            key: 'distributor_name'
          }
        ]
      }),
      addDialog: false,
      qrDialog: false,
      addDialogLoading: false,
      isShowFooter: true,
      companyForm: {
        id: '',
        logo: '',
        name: '',
        enterprise_sn: '',
        sort: '1',
        auth_type: 'mobile',
        relay_host: '',
        smtp_port: '',
        email_user: '',
        email_password: '',
        email_suffix: '',
        is_employee_check_enabled: false,
        qr_code_bg_image: ''
      },
      companyFormList: [
        {
          label: t('63ede0f6.f47e27'),
          key: 'name',
          type: 'input',
          placeholder: t('63ede0f6.8ded4d'),
          required: true,
          message: t('63ede0f6.281bad')
        },
        {
          label: t('63ede0f6.705f0a'),
          key: 'enterprise_sn',
          type: 'input',
          placeholder: t('63ede0f6.5ee937'),
          required: true,
          message: t('63ede0f6.281bad')
        },
        {
          label: t('63ede0f6.c360e9'),
          key: 'sort',
          component: () => (
            <SpInput
              v-model={self.companyForm.sort}
              class='sort-input'
              width='100px'
              suffix={t('63ede0f6.916a52')}
            />
          )
        },
        {
          label: t('63ede0f6.78cbe8'),
          key: 'auth_type',
          type: 'radio',
          options: [
            { label: 'mobile', name: t('63ede0f6.8098e2') },
            { label: 'account', name: t('63ede0f6.7035c6') },
            { label: 'email', name: t('63ede0f6.3bc5e6') },
            { label: 'qr_code', name: t('63ede0f6.22b03c') }
          ],
          validator: (rule, value, callback) => {
            if (value) {
              callback()
            } else {
              callback(t('63ede0f6.281bad'))
            }
          }
        },
        {
          label: t('63ede0f6.5fbb35'),
          key: 'email_user',
          type: 'input',
          placeholder: t('63ede0f6.27044b'),
          isShow,
          validator
        },
        {
          label: t('63ede0f6.4723b1'),
          key: 'relay_host',
          type: 'input',
          placeholder: t('63ede0f6.90ca32'),
          isShow,
          validator
        },
        {
          label: t('63ede0f6.c76cfe'),
          key: 'smtp_port',
          type: 'input',
          placeholder: t('63ede0f6.4a0798'),
          isShow,
          validator
        },
        {
          label: t('63ede0f6.a81052'),
          key: 'email_password',
          type: 'input',
          placeholder: t('63ede0f6.f35263'),
          isShow,
          validator
        },
        {
          label: t('63ede0f6.9c53cd'),
          key: 'email_suffix',
          type: 'input',
          placeholder: t('63ede0f6.d3b119'),
          isShow,
          validator
        },
        {
          label: t('63ede0f6.487b6c'),
          key: 'is_employee_check_enabled',
          type: 'switch',
          isShow: () => self.companyForm.auth_type == 'qr_code'
        },
        {
          label: t('63ede0f6.390b03'),
          key: 'logo',
          component: () => <SpImagePicker v-model={self.companyForm.logo} />,
          validator: (rule, value, callback) => {
            if (value) {
              callback()
            } else {
              callback(t('63ede0f6.321fa5'))
            }
          },
          tip: t('63ede0f6.203143')
        },
        {
          label: t('63ede0f6.fbf272'),
          key: 'qr_code_bg_image',
          component: () => <SpImagePicker v-model={self.companyForm.qr_code_bg_image} />,
          isShow: () => self.companyForm.auth_type == 'qr_code',
          tip: t('63ede0f6.9ce120')
        }
      ]
    }
  },
  computed: {
    validateTypeList() {
      const keys = {
        '': '63ede0f6.a8b0c2',
        mobile: '63ede0f6.8098e2',
        account: '63ede0f6.bc1f2d',
        email: '63ede0f6.3bc5e6',
        qr_code: '63ede0f6.22b03c'
      }
      return VALIDATE_TYPES.map((item) => ({
        ...item,
        name: this.$t(keys[item.value] || '63ede0f6.a8b0c2')
      }))
    }
  },
  created() {},
  methods: {
    // 下载二维码
    handleDownload() {
      console.log('this.qrCodeBgImage', this.qrCodeBgImage)
      if (!this.qrCodeBgImage) {
        var a = document.createElement('a')
        var temp = this.qrcodeName
        if (this.qrcodeUrl) {
          a.href = this.qrcodeUrl
          a.download = temp + '.png'
          a.click()
          setTimeout(() => {
            this.qrDialog = false
          }, 1000)
        }
        return
      }

      //有海报则拼接
      const canvas = document.getElementById('qurcodeCanvas')
      const ctx = canvas.getContext('2d')

      // 定义两张图片的 URL
      const image1Url = this.qrCodeBgImage
      const image2Url = this.qrcodeUrl

      // 创建两个 Image 对象
      const image1 = new Image()
      const image2 = new Image()
      console.log('image1', image1.width, image1.height)

      // 当两张图片都加载完成后执行拼接操作
      Promise.all([
        new Promise((resolve, reject) => {
          image1.src = image1Url
          // 防止跨域引起的 Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.
          image1.setAttribute('crossOrigin', 'anonymous')
          image1.onload = () => {
            resolve()
          }
          image1.onerror = reject
        }),
        new Promise((resolve, reject) => {
          image2.src = image2Url
          // 防止跨域引起的 Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.
          image2.setAttribute('crossOrigin', 'anonymous')
          image2.onload = () => {
            resolve()
          }
          image2.onerror = reject
        })
      ])
        .then(() => {
          // 设置 canvas 的宽度和高度为第一张图片的宽度和高度
          canvas.width = image1.width
          canvas.height = image1.height

          // 在 canvas 上绘制第一张图片
          ctx.drawImage(image1, 0, 0)

          // 计算第二张图片的绘制位置，使其位于右下角
          const x = canvas.width - 350
          const y = canvas.height - 430

          // 设置文字样式
          ctx.font = '22px sans-serif'
          ctx.fillStyle = '#F3B289'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'alphabetic'

          // 计算文字的位置，使其位于第二张图片下方居中
          const textX = x + 150
          const textY = y + 300 + 35 // 30 是文字与图片的间距

          // 确保文字位置在 canvas 范围内
          if (textX >= 0 && textX <= canvas.width && textY >= 0 && textY <= canvas.height) {
            // 绘制文字
            ctx.fillText(this.$t('63ede0f6.ef2e3d'), textX, textY)
          } else {
            console.error('文字位置超出 canvas 范围')
          }

          const radius = 150 // 半径为宽高的一半

          // 保存当前绘图状态
          ctx.save()

          // 开始绘制圆角路径
          ctx.beginPath()
          ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, true)
          ctx.closePath()
          ctx.clip()

          // 在 canvas 上绘制第二张图片，位置在右下角，宽高设置为 300，并应用圆角裁剪
          ctx.drawImage(image2, x, y, 300, 300)
          ctx.restore()

          const link = document.createElement('a')
          link.href = canvas.toDataURL('image/jpeg')
          link.download = this.qrcodeName + '.png'
          link.click()
        })
        .catch((error) => {
          console.error('图片加载失败:', error)
        })
    },
    beforeSearch(params) {
      return {
        ...params,
        ...this.queryForm
      }
    },
    onSearch() {
      this.$refs['finder'].refresh()
    },
    addCompany() {
      this.companyForm = this.$options.data().companyForm
      this.addDialog = true
    },
    async onSendEmailSubmit() {
      const { email, enterprise_id } = this.sendEmailForm
      this.sendEmaiLoading = true
      try {
        await this.$api.member.sendEmployeeEmail({
          enterprise_id,
          email
        })
        this.sendEmaiLoading = false
        this.$message.success(this.$t('63ede0f6.aea7be'))
      } catch (error) {
        this.sendEmaiLoading = false
      }
    },
    async onCompanyFormSubmit() {
      const {
        id,
        logo,
        name,
        enterprise_sn,
        auth_type,
        email_user,
        relay_host,
        smtp_port,
        email_password,
        email_suffix,
        is_employee_check_enabled,
        qr_code_bg_image,
        sort
      } = this.companyForm
      const params = {
        logo,
        name,
        enterprise_sn,
        auth_type,
        relay_host,
        smtp_port,
        email_user,
        email_password,
        email_suffix,
        is_employee_check_enabled,
        qr_code_bg_image,
        sort
      }
      this.addDialogLoading = true

      try {
        if (id) {
          await this.$api.member.updatePurchaseCompany(id, params)
        } else {
          await this.$api.member.postPurchaseCompany(params)
        }
        this.addDialog = false
        this.addDialogLoading = false
        this.onSearch()
      } catch (error) {
        this.addDialogLoading = false
      }
    }
  }
}
</script>
