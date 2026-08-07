<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <!-- 境内支付平台 -->
    <div class="payment-section">
      <h3 class="section-title">{{ $t('10d92d52.737661') }}</h3>
      <el-collapse v-model="activeDomestic" accordion>
        <el-collapse-item
          v-for="item in domesticPaymentListWithTitle.filter((i) => i.isShow)"
          :key="item.name"
          :name="item.name"
        >
          <template slot="title">
            <div class="payment-item-header">
              <div class="payment-info">
                <img :src="item.icon" v-if="item.icon" :alt="item.title" class="payment-icon" />
                <span class="payment-title" v-else>{{ item.title }}</span>
                <el-switch
                  v-model="item.enabled"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="handleTogglePayment(item)"
                  @click.native.stop
                />
                <span class="payment-description">{{ item.description }}</span>
              </div>
            </div>
          </template>
          <div class="payment-config-content">
            <SpFormPlus
              v-model="paymentForms[item.name]"
              :form-items="getFormItems(item.name)"
              form-type="form"
              label-width="200px"
              @submit="handleSubmit(item.name)"
            />
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- 境外支付平台 -->
    <div class="payment-section">
      <h3 class="section-title">{{ $t('10d92d52.0760e2') }}</h3>
      <el-collapse v-model="activeInternational" accordion>
        <el-collapse-item
          v-for="item in internationalPaymentListWithTitle.filter((i) => i.isShow)"
          :key="item.name"
          :name="item.name"
        >
          <template slot="title">
            <div class="payment-item-header">
              <div class="payment-info">
                <img :src="item.icon" v-if="item.icon" :alt="item.title" class="payment-icon" />
                <span class="payment-title" v-else>{{ item.title }}</span>
                <el-switch
                  v-model="item.enabled"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="handleTogglePayment(item)"
                  @click.native.stop
                />
                <span class="payment-description">{{ item.description }}</span>
              </div>
            </div>
          </template>
          <div class="payment-config-content">
            <SpFormPlus
              v-model="paymentForms[item.name]"
              :form-items="getFormItems(item.name)"
              form-type="form"
              label-width="160px"
              @submit="handleSubmit(item.name)"
            />
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </SpPage>
</template>
<script>
import SpFormPlus from '@/components/sp-form-plus'
import { hfpayVersionStatus } from '@/api/fenzhang'
import { useForm } from '@/composables'
const [BatchStatusForm, BatchStatusFormApi] = useForm({
  formItems: [
    {
      component: 'input',
      label: 'RSA公钥',
      fieldName: 'rsa_public_key',
      formItemClass: 'w-3/4',
      componentProps: {
        type: 'textarea',
        rows: 6
      }
    }
  ],
  showDefaultActions: false
})

// 创建收款账户表单配置（勿在 formItems 写死 value，否则 SpFormPlus 会覆盖弹框传入的回显数据）
const [AccountForm, AccountFormApi] = useForm({
  formType: 'normalForm',
  labelWidth: '120px',
  showDefaultActions: false,
  formItems: [
    {
      fieldName: 'bank_account_name',
      label: '收款人户名',
      component: 'input',
      formItemClass: 'w-2/4',
      componentProps: {
        placeholder: '请输入收款人户名'
      },
      rules: [{ required: true, message: '请输入收款人户名', trigger: 'blur' }]
    },
    {
      fieldName: 'bank_account_no',
      label: '银行账号',
      component: 'input',
      formItemClass: 'w-2/4',
      componentProps: {
        placeholder: '请输入银行账号'
      },
      rules: [{ required: true, message: '请输入银行账号', trigger: 'blur' }]
    },
    {
      fieldName: 'bank_name',
      label: '开户银行',
      component: 'input',
      formItemClass: 'w-2/4',
      componentProps: {
        placeholder: '请输入开户银行'
      },
      rules: [{ required: true, message: '请输入开户银行', trigger: 'blur' }]
    },
    {
      fieldName: 'china_ums_no',
      label: '银联号',
      component: 'input',
      formItemClass: 'w-2/4',
      componentProps: {
        placeholder: '请输入银联号'
      },
      rules: [{ required: true, message: '请输入银联号', trigger: 'blur' }]
    },
    {
      fieldName: 'pic',
      label: '银行LOGO',
      component: 'imagepicker',
      componentProps: {
        multiple: false,
        limit: 1,
        onChange: (value) => {
          console.log('图片选择变化:', value)
        }
      },
      rules: [{ required: true, message: '请上传银行LOGO', trigger: 'change' }]
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'input',
      formItemClass: 'w-2/4',
      componentProps: {
        type: 'textarea',
        rows: 3,
        placeholder: '请输入备注'
      }
    },
    {
      fieldName: 'is_default',
      label: '是否默认',
      component: 'radio',
      componentProps: {
        options: [
          { label: '是', value: 'true' },
          { label: '否', value: 'false' }
        ]
      },
      rules: [{ required: true, message: '请选择是否默认', trigger: 'change' }]
    }
  ]
})

export default {
  components: {
    SpFormPlus,
    CompAccountForm: AccountForm
  },
  data() {
    return {
      activeDomestic: '',
      activeInternational: '',
      isHfpay: false,
      loading: false,

      // 境内支付平台列表（titleKey/descriptionKey 在 computed 中译为 title/description）
      domesticPaymentList: [
        {
          name: 'wxpay',
          titleKey: '10d92d52.ccf3d2',
          descriptionKey: '10d92d52.907a49',
          icon: require('@/assets/pay_logo/wepay.png'),
          enabled: false,
          isShow: true
        },
        {
          name: 'alipay',
          titleKey: '10d92d52.25f2a4',
          descriptionKey: '10d92d52.ed7207',
          icon: require('@/assets/pay_logo/alipay.png'),
          enabled: false,
          isShow: !this.isHfpay && !this.VERSION_IN_PURCHASE() && !this.VERSION_SHUYUN()
        },
        {
          name: 'chinaumspay',
          titleKey: '10d92d52.13eff4',
          descriptionKey: '10d92d52.ec52e1',
          icon: require('@/assets/pay_logo/unionpay.png'),
          enabled: false,
          isShow: !this.VERSION_SHUYUN()
        },
        {
          name: 'offline_pay',
          titleKey: '10d92d52.2d8019',
          descriptionKey: '10d92d52.ed7207',
          icon: '',
          enabled: false,
          isShow: !this.VERSION_SHUYUN() && !this.VERSION_B2C()
        },
        {
          name: 'bspay',
          titleKey: '10d92d52.fc8a0f',
          descriptionKey: '10d92d52.907a49',
          icon: require('@/assets/pay_logo/huifu.png'),
          enabled: false,
          isShow: true
        }
      ],

      // 境外支付平台列表
      internationalPaymentList: [
        {
          name: 'paypal',
          title: 'PayPal',
          descriptionKey: '10d92d52.ed7207',
          icon: require('@/assets/pay_logo/paypal.png'),
          enabled: false,
          isShow: true
        },
        {
          name: 'doumen_intl',
          title: '斗门国际',
          descriptionKey: '10d92d52.ed7207',
          icon: '',
          enabled: false,
          isShow: true
        }
      ],

      // 各支付平台的表单数据
      paymentForms: {
        wxpay: {},
        alipay: {},
        chinaumspay: {},
        offline_pay: {},
        bspay: {},
        paypal: {},
        doumen_intl: {}
      },
      publicKeyDialogForm: {
        rsa_public_key: ''
      },
      offlineList: [],
      accountsForm: {
        bank_account_name: '',
        bank_account_no: '',
        bank_name: '',
        pic: '',
        remark: '',
        china_ums_no: '',
        is_default: null
      }
    }
  },
  watch: {
    'paymentForms.offline_pay.is_open': {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.getOfflineList()
        }
      }
    }
  },
  computed: {
    domesticPaymentListWithTitle() {
      return this.domesticPaymentList.map((item) => ({
        ...item,
        title: item.title || this.$t(item.titleKey),
        description: this.$t(item.descriptionKey)
      }))
    },
    internationalPaymentListWithTitle() {
      return this.internationalPaymentList.map((item) => ({
        ...item,
        title: item.title || (item.titleKey ? this.$t(item.titleKey) : ''),
        description: item.descriptionKey ? this.$t(item.descriptionKey) : item.description || ''
      }))
    },
    allPaymentList() {
      return [...this.domesticPaymentListWithTitle, ...this.internationalPaymentListWithTitle]
    },

    // 动态生成表单配置，确保数据回显
    wxpayFormItems() {
      // 微信
      return this.getWxpayFormItems()
    },
    alipayFormItems() {
      // 支付宝
      return this.getAlipayFormItems()
    },
    chinaumspayFormItems() {
      // 银联商务
      return this.getChinaumspayFormItems()
    },
    offlineFormItems() {
      // 线下转账
      return this.getOfflineFormItems()
    },
    bspayFormItems() {
      // 汇付斗拱
      return this.getBspayFormItems()
    },
    paypalFormItems() {
      // PayPal
      return this.getPaypalFormItems()
    },
    doumenIntlFormItems() {
      // 斗门国际
      return this.getDoumenIntlFormItems()
    },
    accountsSetting() {
      return {
        columns: [
          { name: this.$t('10d92d52.84fc41'), key: 'bank_account_name' },
          { name: this.$t('10d92d52.954218'), key: 'bank_account_no' },
          { name: this.$t('10d92d52.cc5ca0'), key: 'bank_name' },
          { name: this.$t('10d92d52.4402fa'), key: 'china_ums_no' },
          {
            name: this.$t('10d92d52.e277b7'),
            width: 100,
            key: 'pic',
            render: (h, { row }) => {
              return <SpImage src={row.pic} width={60} height={60} />
            }
          },
          { name: this.$t('10d92d52.2432b5'), key: 'remark' },
          {
            name: this.$t('10d92d52.d1c357'),
            width: 100,
            key: 'staff_attribute',
            render: (h, { row }) => {
              return (
                <span>
                  {row.is_default === 'true'
                    ? this.$t('10d92d52.0a60ac')
                    : this.$t('10d92d52.c9744f')}
                </span>
              )
            }
          }
        ],
        actions: [
          {
            name: this.$t('10d92d52.95b351'),
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([row]) => {
                this.accountsForm = JSON.parse(JSON.stringify(row))
                this.addDeliveryman('edit')
              }
            }
          },
          {
            name: this.$t('10d92d52.2f4aad'),
            key: 'apply',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                await this.$confirm(this.$t('10d92d52.b28efa'), this.$t('10d92d52.02d981'), {
                  confirmButtonText: this.$t('10d92d52.38cf16'),
                  cancelButtonText: this.$t('10d92d52.625fb2')
                })
                try {
                  await this.$api.offline.deleteOfflineAccount(row.id)
                  this.getOfflineList()
                } catch (error) {
                  console.log('error', error)
                }
              }
            }
          }
        ]
      }
    }
  },

  methods: {
    beforeSearch(params) {
      // 使用深拷贝避免引用问题
      const _params = JSON.parse(JSON.stringify({ ...params, ...this.params }))
      return _params
    },
    // 初始化支付数据
    async initPaymentData() {
      try {
        const res = await hfpayVersionStatus()
        const data = res.data.data
        if (data.hfpay_version_status) {
          this.isHfpay = true
        } else {
          this.isHfpay = false
        }
      } catch (error) {
        console.error('获取汇付版本状态失败:', error)
      }

      // 加载各支付平台的配置
      await this.loadAllPaymentConfigs()
    },

    // 加载所有支付平台配置
    async loadAllPaymentConfigs() {
      const paymentTypes = [
        'wxpay',
        'alipay',
        'hfpay',
        'chinaumspay',
        'adapay',
        'offline_pay',
        'bspay',
        'paypal',
        'doumen_intl'
      ]

      for (const payType of paymentTypes) {
        try {
          await this.loadPaymentConfig(payType)
        } catch (error) {
          console.error(`加载${payType}配置失败:`, error)
        }
      }
    },

    // 加载单个支付平台配置
    async loadPaymentConfig(payType) {
      try {
        const data = await this.$api.trade.getPaymentSetting({ pay_type: payType })
        // const data = res.data.data || {}

        // 更新表单数据（使用深拷贝避免引用问题）
        const formData = JSON.parse(JSON.stringify(data))
        formData.is_open = data.is_open === 'true' || data.is_open === true
        // 汇付支付渠道：接口可能返回字符串，统一转为数组，避免勾选错乱
        if (payType === 'bspay' && formData.pay_channel != null) {
          formData.pay_channel = Array.isArray(formData.pay_channel)
            ? formData.pay_channel
            : String(formData.pay_channel)
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
        }
        this.$set(this.paymentForms, payType, formData)

        // 更新开关状态
        const paymentItem = this.allPaymentList.find((item) => item.name === payType)
        if (paymentItem) {
          paymentItem.enabled = data.is_open === 'true' || data.is_open === true
        }

        // 强制刷新表单数据
        this.$nextTick(() => {
          this.refreshFormData()
        })
      } catch (error) {
        console.error(`加载${payType}配置失败:`, error)
      }
    },

    /** 支付渠道统一为数组，避免接口返回字符串导致勾选错乱（复选需数组） */
    normalizePayChannel(v) {
      if (Array.isArray(v)) return v
      if (v == null || v === '') return []
      return String(v)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    },

    // 获取表单配置项
    getFormItems(payType) {
      const formConfigs = {
        wxpay: this.getWxpayFormItems(),
        alipay: this.getAlipayFormItems(),
        chinaumspay: this.getChinaumspayFormItems(),
        offline_pay: this.getOfflineFormItems(),
        bspay: this.getBspayFormItems(),
        paypal: this.getPaypalFormItems(),
        doumen_intl: this.getDoumenIntlFormItems()
      }

      return formConfigs[payType] || []
    },

    // 微信支付表单配置
    getWxpayFormItems() {
      const formData = this.paymentForms.wxpay || {}
      return [
        {
          fieldName: 'group1',
          label: '基础配置',
          component: 'group'
        },
        {
          fieldName: 'app_id',
          label: '公众账号ID',
          component: 'input',
          value: formData.app_id || '',
          componentProps: {
            placeholder: '请输入公众账号ID',
            style: 'width: 300px'
          },
          tip: () => {
            return (
              <div>
                <div>适用于【微信浏览器、第三方APP、第三方手机浏览器、微信小程序、PC网站】</div>
                <div>
                  微信支付分配的公众账号ID（企业号corpid即为此appId）。请到 微信公众平台 → 开发 →
                  基本配置 → 获取
                </div>
              </div>
            )
          }
        },
        {
          fieldName: 'app_app_id',
          label: 'APP应用ID',
          component: 'input',
          value: formData.app_app_id || '',
          componentProps: {
            placeholder: '请输入APP应用ID',
            style: 'width: 300px'
          },
          tip: () => {
            return (
              <div>
                <div>适用于【第三方APP】</div>
                <div>
                  微信开放平台审核通过的应用APPID（请登录open.weixin.qq.com查看，注意与公众号的APPID不同）
                </div>
              </div>
            )
          }
        },
        {
          fieldName: 'merchant_id',
          label: '商户号',
          component: 'input',
          value: formData.merchant_id || '',
          componentProps: {
            placeholder: '请输入商户号',
            style: 'width: 300px'
          },
          tip: () => {
            return (
              <div>
                <div>适用于【微信浏览器、第三方APP、第三方手机浏览器、微信小程序、PC网站】</div>
                <div>请到 微信支付商户平台→账户中心→商户信息→获取</div>
              </div>
            )
          }
        },
        {
          fieldName: 'key',
          label: 'API密钥',
          component: 'input',
          value: formData.key || '',
          componentProps: {
            placeholder: '请输入API密钥',
            style: 'width: 300px'
          },
          tip: () => {
            return (
              <div>
                <div>适用于【微信浏览器、第三方APP、第三方手机浏览器、微信小程序、PC网站】</div>
                <div>
                  请到 微信支付商户平台 → 账户中心 → API安全 → API密钥
                  中设置32位密钥，并将密钥复粘贴过来
                </div>
              </div>
            )
          }
        },
        {
          fieldName: 'is_servicer',
          label: '是否特约商户',
          component: 'switch',
          value: formData.is_servicer || false,
          componentProps: {
            activeColor: '#13ce66',
            inactiveColor: '#ff4949'
          },
          tip: '如是特约商户，请联系您的服务商获取如下两个参数'
        },
        {
          fieldName: 'servicer_app_id',
          label: '服务商APPID',
          component: 'input',
          value: formData.servicer_app_id || '',
          componentProps: {
            placeholder: '请输入服务商APPID',
            style: 'width: 300px'
          }
        },
        {
          fieldName: 'servicer_merchant_id',
          label: '服务商商户号',
          component: 'input',
          value: formData.servicer_merchant_id || '',
          componentProps: {
            placeholder: '请输入服务商商户号',
            style: 'width: 300px'
          }
        },
        {
          label: '商户证书',
          component: 'upload',
          componentProps: {
            title: formData.cert_name,
            buttonSize: '点击上传',
            size: 'middle',
            autoUpload: false,
            multiple: false,
            onChange: (file, fileList) => {
              if (!file?.raw) return
              this.paymentForms.wxpay.cert = file.raw
            }
          },
          tip: '微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->证书下载 apiclient_cert.pem'
        },
        {
          label: '商户证书秘钥',
          component: 'upload',
          componentProps: {
            title: formData.cert_key_name,
            buttonSize: '点击上传',
            size: 'middle',
            autoUpload: false,
            multiple: false,
            onChange: (file, fileList) => {
              if (!file?.raw) return
              this.paymentForms.wxpay.cert_key = file.raw
            }
          },
          tip: '微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->证书下载 apiclient_key.pem'
        }
      ]
    },

    // 支付宝表单配置
    getAlipayFormItems() {
      const formData = this.paymentForms.alipay || {}
      return [
        {
          fieldName: 'group1',
          label: '基础配置',
          component: 'group'
        },
        {
          fieldName: 'app_id',
          label: '合作者PID',
          component: 'input',
          value: formData.app_id || '',
          componentProps: {
            placeholder: '请输入合作者PID',
            style: 'width: 300px'
          },
          tip: 'APPID'
        },
        {
          fieldName: 'ali_public_key',
          label: '支付宝公钥',
          component: 'input',
          formItemClass: 'w-3/4',
          value: formData.ali_public_key || '',
          componentProps: {
            type: 'textarea',
            rows: 5,
            placeholder: '请输入支付宝公钥'
          },
          tip: 'RSA2(SHA256)密钥 支付宝公钥'
        },
        {
          fieldName: 'private_key',
          label: '应用私钥',
          component: 'input',
          value: formData.private_key || '',
          formItemClass: 'w-3/4',
          componentProps: {
            type: 'textarea',
            rows: 5,
            placeholder: '请输入应用私钥'
          },
          tip: 'RSA2(SHA256)密钥 自己私钥'
        },
        {
          label: '温馨提示',
          component: ({ value, props, onInput, h, formData }) => {
            return h('div', { class: 'custom-field' }, [
              h('span', {}, '您绑定的企业支付宝账号必须开通'),
              h(
                'a',
                {
                  attrs: {
                    href: 'https://b.alipay.com/signing/productDetail.htm?productId=I1011000290000001001',
                    target: '_blank',
                    class: 'text-blue-500'
                  }
                },
                '手机网站支付'
              )
            ])
          }
        }
      ]
    },
    // 银联商务支付表单配置
    getChinaumspayFormItems() {
      const formData = this.paymentForms.chinaumspay || {}
      return [
        {
          fieldName: 'mid',
          label: '平台商户号',
          component: 'input',
          value: formData.mid || '',
          componentProps: {
            placeholder: '请输入平台商户号',
            style: 'width: 300px'
          }
        },
        {
          fieldName: 'tid',
          label: '平台终端号',
          component: 'input',
          value: formData.tid || '',
          componentProps: {
            placeholder: '请输入平台终端号',
            style: 'width: 300px'
          }
        },
        {
          fieldName: 'rate',
          label: '费率',
          component: 'input',
          value: formData.rate || 0,
          componentProps: {
            placeholder: '请输入内容',
            style: 'width: 300px',
            type: 'number'
          },
          tip: '收单手续费（单位：%）'
        },
        {
          label: '商户加签私钥',
          component: 'upload',
          componentProps: {
            // title: formData.rsa_private_name,
            buttonSize: '点击上传',
            size: 'middle',
            autoUpload: false,
            onChange: (file, fileList) => {
              console.log('上传:', file, fileList)
              tthis.paymentForms.chinaumspay.rsa_private = file.raw
            }
          }
        },
        {
          fieldName: 'password',
          label: '密码',
          component: 'input',
          value: formData.password || '',
          componentProps: {
            placeholder: '请输入密码',
            style: 'width: 300px'
          }
        },
        {
          label: '商户回盘验签公钥',
          component: 'upload',
          componentProps: {
            // title: formData.rsa_public_name,
            buttonSize: '点击上传',
            size: 'middle',
            autoUpload: false,
            onChange: (file, fileList) => {
              console.log('上传:', file, fileList)
              tthis.paymentForms.chinaumspay.rsa_public = file.raw
            }
          }
        }
      ]
    },

    // 线下转账表单配置
    getOfflineFormItems() {
      const formData = this.paymentForms.offline_pay || {}
      return [
        {
          fieldName: 'group1',
          label: '基础配置',
          component: 'group'
        },
        {
          fieldName: 'pay_name',
          label: '支付方式名称',
          component: 'input',
          value: formData.pay_name || '',
          componentProps: {
            placeholder: '请输入支付方式名称',
            style: 'width: 300px'
          },
          rules: [{ required: true, message: '请输入支付方式名称', trigger: 'blur' }]
        },
        {
          fieldName: 'pay_tips',
          label: '收款说明',
          component: 'input',
          value: formData.pay_tips || '',
          formItemClass: 'w-3/4',
          componentProps: {
            type: 'textarea',
            rows: 5,
            placeholder: '请输入收款说明'
          }
        },
        {
          fieldName: 'pay_desc',
          label: '付款说明',
          component: 'input',
          formItemClass: 'w-3/4',
          value: formData.pay_desc || '',
          componentProps: {
            type: 'textarea',
            rows: 5,
            placeholder: '请输入付款说明'
          }
        },
        {
          fieldName: 'auto_cancel_time',
          label: '订单自动取消时间',
          component: 'input',
          value: formData.auto_cancel_time || 0,
          componentProps: {
            type: 'number',
            min: 0,
            placeholder: '请输入自动取消时间（小时）',
            style: 'width: 300px'
          },
          tip: `未付款订单将在指定时间 ${formData.auto_cancel_time}（小时）后自动取消`,
          rules: [{ required: true, message: '请输入自动取消时间', trigger: 'blur' }]
        },
        {
          isShow: () => formData.is_open,
          component: ({ value, props, onInput, h, formData }) => {
            return (
              <div>
                <el-button type='primary' plain onClick={() => this.addDeliveryman('add')}>
                  {this.$t('10d92d52.89beb5')}
                </el-button>
                <SpFinder
                  ref='finder'
                  url=''
                  data={this.offlineList}
                  no-selection
                  setting={this.accountsSetting}
                />
              </div>
            )
          },
          rules: [{ required: true, message: '请输入商户RSA私钥', trigger: 'blur' }],
          width: '960px'
        }
      ]
    },

    // 汇付斗拱支付表单配置
    getBspayFormItems() {
      const formData = this.paymentForms.bspay || {}
      return [
        {
          fieldName: 'group1',
          label: '基础配置',
          component: 'group'
        },
        {
          fieldName: 'sys_id',
          label: 'sys_id',
          component: 'input',
          value: formData.sys_id || '',
          componentProps: {
            placeholder: '请输入sys_id',
            style: 'width: 300px'
          },
          rules: [{ required: true, message: '请输入sys_id', trigger: 'blur' }]
        },
        {
          fieldName: 'product_id',
          label: 'product_id',
          component: 'input',
          value: formData.product_id || '',
          componentProps: {
            placeholder: '请输入product_id',
            style: 'width: 300px'
          },
          rules: [{ required: true, message: '请输入product_id', trigger: 'blur' }]
        },
        {
          fieldName: 'rsa_merch_private_key',
          label: '商户私钥',
          component: 'input',
          formItemClass: 'w-3/4',
          value: formData.rsa_merch_private_key || '',
          componentProps: {
            type: 'textarea',
            rows: 5,
            placeholder: '请输入商户私钥'
          },
          rules: [{ required: true, message: '请输入商户私钥', trigger: 'blur' }]
        },
        {
          fieldName: 'rsa_huifu_public_key',
          label: '汇付公钥',
          component: 'input',
          formItemClass: 'w-3/4',
          value: formData.rsa_huifu_public_key || '',
          componentProps: {
            type: 'textarea',
            rows: 5,
            placeholder: '请输入汇付公钥',
            style: 'width: 600px'
          },
          rules: [{ required: true, message: '请输入汇付公钥', trigger: 'blur' }]
        },
        {
          fieldName: 'admin_token_no',
          label: '绑卡序列号',
          component: 'input',
          value: formData.admin_token_no || '',
          componentProps: {
            placeholder: '请输入绑卡序列号',
            style: 'width: 300px'
          }
        },
        {
          fieldName: 'group2',
          label: '支付渠道设置',
          component: 'group'
        },
        {
          fieldName: 'pay_channel',
          label: '支付渠道',
          component: 'checkbox',
          value: this.normalizePayChannel(formData.pay_channel),
          componentProps: {
            options: [
              { label: '微信小程序支付', value: 'wx_lite' },
              { label: '微信公众号支付', value: 'wx_pub' },
              { label: '微信扫码支付', value: 'wx_qr' },
              { label: '支付宝H5支付', value: 'alipay_wap' },
              { label: '支付宝扫码支付', value: 'alipay_qr' }
            ]
          }
        },
        {
          fieldName: 'group3',
          label: '费率设置',
          component: 'group'
        },
        {
          fieldName: 'wxpay_fee_type',
          label: '微信渠道费率类型',
          component: 'radio',
          value: formData.wxpay_fee_type || 'online',
          componentProps: {
            options: [{ label: '标准费率线上', value: 'online' }]
          }
        },
        {
          fieldName: 'wx_lite_online',
          label: '微信小程序支付费率',
          component: 'input',
          value: formData.wx_lite_online || '',
          componentProps: {
            placeholder: '请输入费率，如：0.26',
            style: 'width: 300px'
          }
        },
        {
          fieldName: 'wx_pub_online',
          label: '微信公众号支付费率',
          component: 'input',
          value: formData.wx_pub_online || '',
          componentProps: {
            placeholder: '请输入费率，如：0.26',
            style: 'width: 300px'
          }
        },
        {
          fieldName: 'wx_qr_online',
          label: '微信扫码支付费率',
          component: 'input',
          value: formData.wx_qr_online || '',
          componentProps: {
            placeholder: '请输入费率，如：0.26',
            style: 'width: 300px'
          }
        },
        {
          fieldName: 'alipay_fee_type',
          label: '支付宝渠道费率类型',
          component: 'radio',
          value: formData.alipay_fee_type || 'online',
          componentProps: {
            options: [{ label: '标准费率线上', value: 'online' }]
          }
        },
        {
          fieldName: 'alipay_call',
          label: '支付宝支付费率',
          component: 'input',
          value: formData.alipay_call || '',
          componentProps: {
            placeholder: '请输入费率，如：0.26',
            style: 'width: 300px'
          }
        },
        {
          fieldName: 'alipay_qr_online',
          label: '支付宝扫码支付费率',
          component: 'input',
          value: formData.alipay_qr_online || '',
          componentProps: {
            placeholder: '请输入费率，如：0.26',
            style: 'width: 300px'
          }
        }
      ]
    },

    // 斗门国际表单配置
    getDoumenIntlFormItems() {
      const formData = this.paymentForms.doumen_intl || {}
      const maskedSecret = this.isMaskedSecret(formData['X-SecretKey'])
      return [
        {
          fieldName: 'group1',
          label: '基础配置',
          component: 'group'
        },
        {
          fieldName: 'X-AccessCode',
          label: 'X-AccessCode',
          component: 'input',
          value: formData['X-AccessCode'] || '',
          componentProps: {
            placeholder: '请输入 X-AccessCode',
            style: 'width: 300px'
          }
        },
        {
          fieldName: 'X-SecretKey',
          label: 'X-SecretKey',
          component: 'input',
          value: maskedSecret ? '' : formData['X-SecretKey'] || '',
          componentProps: {
            type: 'password',
            placeholder: maskedSecret
              ? `${formData['X-SecretKey']}（留空则不修改）`
              : '请输入 X-SecretKey',
            style: 'width: 300px'
          }
        },
        {
          fieldName: 'appId',
          label: 'appId',
          component: 'input',
          value: formData.appId || '',
          componentProps: {
            placeholder: '请输入 appId',
            style: 'width: 300px'
          }
        },
        {
          fieldName: 'return_url',
          label: 'return_url',
          component: 'input',
          formItemClass: 'w-3/4',
          value: formData.return_url || '',
          componentProps: {
            placeholder: '请输入支付完成跳转地址',
            style: 'width: 600px'
          }
        }
      ]
    },

    isMaskedSecret(value) {
      return typeof value === 'string' && value.startsWith('****')
    },

    // PayPal表单配置
    getPaypalFormItems() {
      const formData = this.paymentForms.paypal || {}
      return [
        {
          fieldName: 'group1',
          label: '基础配置',
          component: 'group'
        },
        {
          fieldName: 'client_id',
          label: 'Client ID',
          component: 'input',
          value: formData.client_id || '',
          componentProps: {
            placeholder: '请输入PayPal Client ID',
            style: 'width: 300px'
          }
        },
        {
          fieldName: 'client_secret',
          label: 'Client Secret',
          component: 'input',
          value: formData.client_secret || '',
          componentProps: {
            placeholder: '请输入PayPal Client Secret',
            style: 'width: 300px'
          }
        },
        {
          fieldName: 'sandbox',
          label: '是否沙盒环境',
          component: 'switch',
          value: formData.sandbox || false,
          componentProps: {
            activeColor: '#13ce66',
            inactiveColor: '#ff4949'
          }
        },
        {
          fieldName: 'webhook_id',
          label: 'webhook_id',
          component: 'input',
          value: formData.webhook_id || '',
          componentProps: {
            placeholder: '请输入webhook_id',
            style: 'width: 300px'
          }
        }
      ]
    },

    isDoumenIntlEnabled() {
      const doumenItem = this.allPaymentList.find((item) => item.name === 'doumen_intl')
      return !!(doumenItem && doumenItem.enabled)
    },

    // 处理支付平台开关切换
    async handleTogglePayment(paymentItem) {
      const newEnabled = paymentItem.enabled

      if (newEnabled && paymentItem.name !== 'doumen_intl' && this.isDoumenIntlEnabled()) {
        this.$message.warning('请先关闭斗门国际收银台')
        paymentItem.enabled = false
        return
      }

      if (newEnabled && paymentItem.name === 'doumen_intl') {
        try {
          await this.$confirm(
            '请确认是否启用斗门国际收银台，启用会默认关闭其他支付方式',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
        } catch {
          paymentItem.enabled = false
          return
        }
      }

      this.$set(this.paymentForms[paymentItem.name], 'is_open', paymentItem.enabled)

      try {
        await this.savePaymentConfig(paymentItem.name)
      } catch (error) {
        paymentItem.enabled = !newEnabled
        this.$set(this.paymentForms[paymentItem.name], 'is_open', paymentItem.enabled)
      }
    },

    // 强制刷新表单数据
    refreshFormData() {
      this.$forceUpdate()
    },

    // 处理表单提交
    async handleSubmit(payType) {
      await this.savePaymentConfig(payType)
    },

    extractApiErrorMessage(error, fallback) {
      const data = error?.response?.data
      if (typeof data === 'string' && data) {
        return data
      }
      if (data?.message) {
        return data.message
      }
      if (data?.error?.message) {
        return data.error.message
      }
      if (error?.message) {
        return error.message
      }
      return fallback
    },

    // 保存支付配置
    async savePaymentConfig(payType) {
      this.loading = true
      try {
        const formData = this.paymentForms[payType]
        // 使用深拷贝避免引用问题（File 无法被 JSON 序列化，需单独保留）
        const params = JSON.parse(JSON.stringify(formData))
        if (payType === 'wxpay') {
          if (formData.cert instanceof File) params.cert = formData.cert
          if (formData.cert_key instanceof File) params.cert_key = formData.cert_key
        }
        params.pay_type = payType
        params.is_open = formData.is_open ? 'true' : 'false'
        params.isUploadFile = true
        // 过滤掉值为 undefined 的参数
        Object.keys(params).forEach((key) => {
          if (key === 'undefined') {
            delete params[key]
          }
        })
        if (payType == 'wxpay') {
          // 微信删除下面参数
          delete params.cert_name
          delete params.cert_url
          delete params.cert_key_name
          delete params.cert_key_url
        }
        if (payType === 'doumen_intl') {
          const secretKey = params['X-SecretKey']
          if (!secretKey || this.isMaskedSecret(secretKey)) {
            params['X-SecretKey'] = ''
          }
        }

        if (
          payType !== 'doumen_intl' &&
          params.is_open === 'true' &&
          this.isDoumenIntlEnabled()
        ) {
          throw new Error('请先关闭斗门国际收银台')
        }

        await this.$api.trade.setPaymentSetting(params)

        if (payType === 'doumen_intl' && params.is_open === 'true') {
          await this.loadAllPaymentConfigs()
        }

        this.$message.success(this.$t('10d92d52.3b1083'))
      } catch (error) {
        const message = this.extractApiErrorMessage(error, this.$t('10d92d52.6de920'))
        this.$message.error(message)
        console.error('保存支付配置失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    async createKey() {
      const { rsa_private_key, rsa_public_key } = await this.$api.adapay.createAdapayKey()
      this.paymentForms.adapay.rsa_private_key = rsa_private_key
      this.publicKeyDialogForm.rsa_public_key = rsa_public_key
      await this.$dialog.open({
        title: 'RSA公钥',
        size: 'small',
        content: <BatchStatusForm value={this.publicKeyDialogForm} />,
        confirmBefore: async () => {
          // try {
          //   await BatchStatusFormApi.validate()
          // } catch (error) {
          //   throw new Error('表单验证失败')
          // }
        }
      })
    },
    async addDeliveryman(type) {
      if (type == 'add') {
        // 新增时设置默认值
        this.accountsForm = {
          bank_account_name: '',
          bank_account_no: '',
          bank_name: '',
          china_ums_no: '',
          pic: '',
          remark: '',
          is_default: 'false'
        }
      }
      const dialogPromise = this.$dialog.open({
        title: type == 'edit' ? this.$t('10d92d52.27e12d') : this.$t('10d92d52.89beb5'),
        size: 'medium',
        content: <CompAccountForm ref='accountsForm' value={this.accountsForm} />,
        confirmBefore: async () => {
          try {
            await AccountFormApi.validate()
          } catch (error) {
            throw new Error(this.$t('10d92d52.53aadf'))
          }
        }
      })
      // 弹框挂载后再回填，避免 SpFormPlus 初始化用空值覆盖
      await this.$nextTick()
      if (AccountFormApi.setFieldsValue) {
        const form = this.accountsForm || {}
        AccountFormApi.setFieldsValue({
          bank_account_name: form.bank_account_name || '',
          bank_account_no: form.bank_account_no || '',
          bank_name: form.bank_name || '',
          china_ums_no: form.china_ums_no || '',
          pic: form.pic || '',
          remark: form.remark || '',
          is_default:
            form.is_default === true || form.is_default === 'true' ? 'true' : 'false'
        })
      }
      await dialogPromise
      const formData = await AccountFormApi.getFieldsValue()
      // 使用深拷贝避免引用问题
      let params = JSON.parse(JSON.stringify(formData))
      if (type == 'edit') {
        params.id = this.accountsForm.id
      }
      if (params.id) {
        await this.$api.offline.updateOfflineAccount(params)
        this.$message.success(this.$t('10d92d52.3bb47b'))
      } else {
        await this.$api.offline.createOfflineAccount(params)
        this.$message.success(this.$t('10d92d52.3b1083'))
      }
      this.getOfflineList()
    },
    async getOfflineList() {
      const data = await this.$api.offline.getOfflineList()
      this.offlineList = data.list
    }
  },
  mounted() {
    this.initPaymentData()
  }
}
</script>
<style scoped lang="scss">
.payment-section {
  margin-bottom: 30px;

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1d1d1d;
    margin-bottom: 16px;
    padding-left: 8px;
    border-left: 4px solid #409eff;
  }
}

.payment-item-header {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid #f1f2f5;

  .payment-info {
    display: flex;
    align-items: center;
    margin: 0px 10px;

    .payment-icon {
      width: 110px;
      height: 100%;
      margin-right: 12px;
      border-radius: 4px;
    }

    .payment-title {
      min-width: 110px;
      font-size: 16px;
      color: #1d1d1d;
      margin-left: 13px;
    }
  }

  .payment-description {
    font-size: 14px;
    color: #606266;
    margin-left: 36px;
    line-height: 1.4;
  }
}

.payment-config-content {
  padding: 0px 20px;
  border-radius: 4px;
  margin-top: 10px;
}

// 折叠面板样式优化
.el-collapse {
  border: none;

  .el-collapse-item {
    margin-bottom: 12px;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
    // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    // &:hover {
    //   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    // }

    .el-collapse-item__header {
      padding: 16px 20px;
      background: #fff;
      border-bottom: none;
      font-weight: 500;

      &:hover {
        background: #f8f9fa;
      }

      .el-collapse-item__arrow {
        margin-right: 8px;
        font-size: 14px;
        color: #909399;
      }
    }

    .el-collapse-item__wrap {
      border-bottom: none;
    }

    .el-collapse-item__content {
      padding: 0;
    }
  }
}

// 表单样式优化
.sp-form-plus {
  .el-form-item {
    margin-bottom: 20px;

    .el-form-item__label {
      font-weight: 500;
      color: #606266;
    }

    .el-form-item__content {
      .el-input__inner,
      .el-textarea__inner {
        border-radius: 4px;
        border-color: #dcdfe6;

        &:focus {
          border-color: #409eff;
          // box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
        }
      }
    }
  }

  .el-form-item__tip {
    color: #909399;
    font-size: 12px;
    margin-top: 4px;
    line-height: 1.4;
  }
}

// 开关样式
.el-switch {
  &.is-checked {
    .el-switch__core {
      background-color: #13ce66;
      border-color: #13ce66;
    }
  }
}

// 分组标题样式
.sp-form-plus .el-form-item--group {
  .el-form-item__label {
    font-size: 16px;
    font-weight: 600;
    color: #1d1d1d;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid #409eff;
    width: 100%;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .payment-item-header {
    .payment-info {
      flex-wrap: wrap;

      .payment-title {
        margin-right: 12px;
        margin-bottom: 8px;
      }
    }

    .payment-description {
      margin-left: 0;
      margin-top: 8px;
    }
  }

  .payment-config-content {
    padding: 0px 16px;
  }
}
</style>
