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
      <SpFilterFormItem prop="name" label="企业名称:">
        <el-input v-model="queryForm.name" placeholder="请输入企业名称" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="enterprise_sn" label="企业编码:">
        <el-input v-model="queryForm.enterprise_sn" placeholder="请输入企业编码" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="auth_type" label="验证方式:">
        <el-select v-model="queryForm.auth_type" placeholder="请选择验证方式">
          <el-option
            v-for="(item, index) in validateTypeList"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="distributor_id" label="来源店铺:">
        <SpSelectShop v-model="queryForm.distributor_id" clearable placeholder="请选择" />
      </SpFilterFormItem>
    </SpFilterForm>

    <div class="action-container">
      <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addCompany">
        添加企业
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
      :title="companyForm.id ? '编辑企业' : '添加企业'"
      :modal="false"
      :form="companyForm"
      :form-list="companyFormList"
      :confirm-status="addDialogLoading"
      :is-show-footer="isShowFooter"
      @onSubmit="onCompanyFormSubmit"
    />

    <el-dialog :title="'企业二维码-' + qrcodeName" :visible.sync="qrDialog" width="30%">
      <span
        >用户扫描该二维码打开小程序时会跳过白名单身份验证步骤，在继续完成授权手机号登录后即可获得相应企业的“员工”身份；已是该企业员工的用户不受影响。</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button @click="qrDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleDownload">下载二维码</el-button>
      </span>
    </el-dialog>

    <SpDialog
      ref="sendEmailRef"
      v-model="sendEmailDialog"
      class="dg-create-company"
      title="发件测试"
      confirm-btn-text="发送验证码"
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
import { createSetting } from '@shopex/finder'
import { VALIDATE_TYPES } from './consts'

export default {
  name: '',
  data() {
    const isShow = () => {
      return this.companyForm.auth_type == 'email'
    }

    const validator = (rule, value, callback) => {
      const { auth_type } = this.companyForm
      if (auth_type != 'email' || (auth_type == 'email' && !!value)) {
        callback()
      } else {
        callback('不能为空')
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
                title="请确保填写的邮箱可以正常接受邮件，若五分钟内未收到测试邮件，请检查邮箱配置后再尝试。"
                type="warning"
                closable={false}
              ></el-alert>
            )
          }
        },
        {
          label: '收件地址',
          key: 'email',
          type: 'input',
          placeholder: '用于接受验证码的邮箱地址',
          required: true,
          message: '收件地址不能为空'
        }
      ],
      setting: createSetting({
        actions: [
          {
            name: '编辑',
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            visible: row => {
              return !(this.IS_ADMIN() && row.distributor_id != '0')
            },
            action: {
              handler: async ([row]) => {
                Object.keys(this.companyForm).forEach(key => (this.companyForm[key] = row[key]))
                this.companyForm.is_employee_check_enabled =
                  this.companyForm.is_employee_check_enabled == 'true'
                this.isShowFooter = true
                this.addDialog = true
              }
            }
          },
          {
            name: '查看',
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            visible: row => {
              return this.IS_ADMIN() && row.distributor_id != '0'
            },
            action: {
              handler: async ([row]) => {
                Object.keys(this.companyForm).forEach(key => (this.companyForm[key] = row[key]))
                this.companyForm.is_employee_check_enabled =
                  this.companyForm.is_employee_check_enabled == 'true'
                this.isShowFooter = false
                this.addDialog = true
              }
            }
          },
          {
            name: '发件测试',
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            visible: row => {
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
            name: '二维码',
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
            name: '查看员工列表',
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            // visible: (row) => {
            //   return row.auth_type == 'qr_code'
            // },
            action: {
              handler: async ([row]) => {
                window.open(
                  `${
                    this.IS_DISTRIBUTOR() ? '/shopadmin' : ''
                  }/applications/ec/employee?company_id=${row.id}`,
                  '_blank'
                )
              }
            }
          }
        ],
        columns: [
          { name: '企业ID', key: 'id' },
          {
            name: '企业Logo',
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
            name: '企业名称',
            key: 'name'
          },
          {
            name: '企业编码',
            key: 'enterprise_sn'
          },
          {
            name: '排序',
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
            name: '登录类型',
            key: 'auth_type',
            formatter: (value, { auth_type }, col) => {
              const authType = VALIDATE_TYPES.find(item => item.value == auth_type)?.name
              return authType
            }
          },
          {
            name: '状态',
            key: 'disabled',
            render: (h, { row }) =>
              h('el-switch', {
                props: {
                  value: row.disabled + '',
                  'active-value': '0',
                  'inactive-value': '1'
                },
                on: {
                  change: async e => {
                    await this.$api.member.updateCompanyStatus({
                      enterprise_id: row.id,
                      disabled: e
                    })
                    row.disabled = e
                  }
                }
              })
          },
          {
            name: '来源店铺',
            key: 'distributor_name'
          }
        ]
      }),
      validateTypeList: VALIDATE_TYPES,
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
          label: '企业名称',
          key: 'name',
          type: 'input',
          placeholder: '请输入企业名称',
          required: true,
          message: '不能为空'
        },
        {
          label: '企业编码',
          key: 'enterprise_sn',
          type: 'input',
          placeholder: '请输入企业编码',
          required: true,
          message: '不能为空'
        },
        {
          label: '排序',
          key: 'sort',
          component: () => (
            <SpInput
              v-model={this.companyForm.sort}
              class="sort-input"
              width="100px"
              suffix="选择器中的企业展示顺序，数字越小越靠前"
            />
          )
        },
        {
          label: '登录类型',
          key: 'auth_type',
          type: 'radio',
          options: [
            { label: 'mobile', name: '手机号' },
            { label: 'account', name: '账号' },
            { label: 'email', name: '邮箱' },
            { label: 'qr_code', name: '二维码' }
          ],
          validator: (rule, value, callback) => {
            if (value) {
              callback()
            } else {
              callback('不能为空')
            }
          }
        },
        {
          label: '发件邮箱',
          key: 'email_user',
          type: 'input',
          placeholder: '请输入发件邮箱',
          isShow,
          validator
        },
        {
          label: 'SMTP服务器',
          key: 'relay_host',
          type: 'input',
          placeholder: '请输入SMTP服务器',
          isShow,
          validator
        },
        {
          label: '端口',
          key: 'smtp_port',
          type: 'input',
          placeholder: '请输入邮箱端口',
          isShow,
          validator
        },
        {
          label: '密码',
          key: 'email_password',
          type: 'input',
          placeholder: '请输入邮箱密码',
          isShow,
          validator
        },
        {
          label: '员工收件邮箱后缀',
          key: 'email_suffix',
          type: 'input',
          placeholder: '请输入员工收件邮箱后缀',
          isShow,
          validator
        },
        {
          label: '是否验证白名单',
          key: 'is_employee_check_enabled',
          type: 'switch',
          isShow: () => this.companyForm.auth_type == 'qr_code'
        },
        {
          label: '企业Logo',
          key: 'logo',
          component: () => <SpImagePicker v-model={this.companyForm.logo} />,
          validator: (rule, value, callback) => {
            if (value) {
              callback()
            } else {
              callback('请选择企业')
            }
          },
          tip: '建议尺寸100*100，支持 png、jpg 格式，不超过2M'
        },
        {
          label: '企业二维码海报',
          key: 'qr_code_bg_image',
          component: () => <SpImagePicker v-model={this.companyForm.qr_code_bg_image} />,
          isShow: () => this.companyForm.auth_type == 'qr_code',
          // validator: (rule, value, callback) => {
          //   if (value || this.companyForm.auth_type != 'qr_code') {
          //     callback()
          //   } else {
          //     callback('请选择企业')
          //   }
          // },
          tip: '员工邀请亲友海报：建议上传尺寸540*960且格式为png、jpg图片，文件大小为2M内'
        }
      ]
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
            ctx.fillText('扫码进入小程序', textX, textY)
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
        .catch(error => {
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
        this.$message.success('邮件已发送')
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
