<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <SpPage>
    <!-- 境内支付平台 -->
    <div class="payment-section">
      <h3 class="section-title">境内支付平台</h3>
      <el-collapse v-model="activeDomestic" accordion>
        <el-collapse-item 
          v-for="item in domesticPaymentList" 
          :key="item.name" 
          :name="item.name"
          v-if="item.isShow"
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
              form-type="normalForm"
              label-width="200px"
              @submit="handleSubmit(item.name)"
            />
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- 境外支付平台 -->
    <div class="payment-section">
      <h3 class="section-title">境外支付平台</h3>
      <el-collapse v-model="activeInternational" accordion>
        <el-collapse-item 
          v-for="item in internationalPaymentList" 
          :key="item.name" 
          :name="item.name"
          v-if="item.isShow"
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
              form-type="normalForm"
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

// 创建收款账户表单配置
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
      value: '',
      componentProps: {
        placeholder: '请输入收款人户名'
      },
      rules: [
        { required: true, message: '请输入收款人户名', trigger: 'blur' }
      ]
    },
    {
      fieldName: 'bank_account_no',
      label: '银行账号',
      component: 'input',
      formItemClass: 'w-2/4',
      value: '',
      componentProps: {
        placeholder: '请输入银行账号'
      },
      rules: [
        { required: true, message: '请输入银行账号', trigger: 'blur' }
      ]
    },
    {
      fieldName: 'bank_name',
      label: '开户银行',
      component: 'input',
      formItemClass: 'w-2/4',
      value: '',
      componentProps: {
        placeholder: '请输入开户银行'
      },
      rules: [
        { required: true, message: '请输入开户银行', trigger: 'blur' }
      ]
    },
    {
      fieldName: 'china_ums_no',
      label: '银联号',
      component: 'input',
      formItemClass: 'w-2/4',
      value: '',
      componentProps: {
        placeholder: '请输入银联号'
      },
      rules: [
        { required: true, message: '请输入银联号', trigger: 'blur' }
      ]
    },
    {
      fieldName: 'pic',
      label: '银行LOGO',
      component: 'imagepicker',
      value: '',
      componentProps: {
        multiple: false,
        limit: 1,
        onChange: (value) => {
          console.log('图片选择变化:', value)
        }
      },
      rules: [
        { required: true, message: '请上传银行LOGO', trigger: 'change' }
      ]
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'input',
      formItemClass: 'w-2/4',
      value: '',
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
      value: 'no',
      componentProps: {
        options: [
          { label: '是', value: 'yes' },
          { label: '否', value: 'no' }
        ]
      },
      rules: [
        { required: true, message: '请选择是否默认', trigger: 'change' }
      ]
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
      activeDomestic: 'wxpay',
      activeInternational: 'paypal',
      isHfpay: false,
      loading: false,
      
      // 境内支付平台列表
      domesticPaymentList: [
        {
          name: 'wxpay',
          title: '微信支付配置',
          icon: require('@/assets/pay_logo/wepay.png'),
          description: '支持客户端:移动商城(微信小程序、H5)、PC商城',
          enabled: false,
          isShow: true
        },
        {
          name: 'alipay',
          title: '支付宝支付配置',
          icon: require('@/assets/pay_logo/alipay.png'),
          description: '支持客户端:移动商城(H5)、PC商城',
          enabled: false,
          isShow: !this.isHfpay && !this.VERSION_IN_PURCHASE() && !this.VERSION_SHUYUN()
        },
        {
          name: 'chinaumspay',
          title: '银联商务支付配置',
          icon: require('@/assets/pay_logo/unionpay.png'),
          description: '支持客户端:移动商城(微信小程序、H5)',
          enabled: false,
          isShow: !this.VERSION_SHUYUN()
        },
        {
          name: 'offline_pay',
          title: '线下转账',
          icon: '',
          description: '支持客户端:移动商城(H5)、PC商城',
          enabled: false,
          isShow: !this.VERSION_SHUYUN() && !this.VERSION_B2C()
        },
        {
          name: 'bspay',
          title: '汇付斗拱支付配置',
          icon: require('@/assets/pay_logo/huifu.png'),
          description: '支持客户端:移动商城(微信小程序、H5)、PC商城',
          enabled: false,
          isShow: true
        }
      ],
      
      // 境外支付平台列表
      internationalPaymentList: [
        {
          name: 'paypal',
          title: 'PayPal',
          icon: require('@/assets/pay_logo/paypal.png'),
          description: '支持客户端:移动商城(H5)、PC商城',
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
        paypal: {}
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
      },
      accountsSetting: {
        columns: [
          { name: '收款人户名', key: 'bank_account_name' },
          { name: '银行账号', key: 'bank_account_no' },
          { name: '开户银行', key: 'bank_name' },
          { name: '银联号', key: 'china_ums_no' },
          {
            name: '银行LOGO',
            width: 100,
            key: 'pic',
            render: (h, { row }) => {
              return <SpImage src={row.pic} width={60} height={60} />
            }
          },
          { name: '备注', key: 'remark' },
          {
            name: '是否默认',
            width: 100,
            key: 'staff_attribute',
            render: (h, { row }) => {
              return <span>{row.is_default === 'true' ? '是' : '否'}</span>
            }
          }
        ],
        actions: [
          {
            name: '编辑',
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([row]) => {
                this.accountsForm = {
                  ...row
                }
                this.addDeliveryman('edit')
              }
            }
          },
          {
            name: '删除',
            key: 'apply',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                await this.$confirm(`确认删除？`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
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
    allPaymentList() {
      return [...this.domesticPaymentList, ...this.internationalPaymentList]
    },
    
    // 动态生成表单配置，确保数据回显
    wxpayFormItems() { // 微信
      return this.getWxpayFormItems()
    },
    alipayFormItems() { // 支付宝
      return this.getAlipayFormItems()
    },
    chinaumspayFormItems() { // 银联商务
      return this.getChinaumspayFormItems()
    },
    offlineFormItems() { // 线下转账
      return this.getOfflineFormItems()
    },
    bspayFormItems() { // 汇付斗拱
      return this.getBspayFormItems()
    },
    paypalFormItems() { // PayPal
      return this.getPaypalFormItems()
    },
  },
  
  methods: {
    beforeSearch(params) {
      const _params = {
        ...params,
        ...this.params
      }
      return _params
    },
    // 初始化支付数据
    async initPaymentData() {
      try {
        const res = await hfpayVersionStatus()
        const data = res.data.data
        if (data.hfpay_version_status) {
          this.activeDomestic = 'hfpay'
          this.isHfpay = true
        } else {
          this.activeDomestic = 'offline_pay'
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
      const paymentTypes = ['wxpay', 'alipay', 'hfpay', 'chinaumspay', 'adapay', 'offline_pay', 'bspay', 'paypal']
      
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
        
        // 更新表单数据
        this.$set(this.paymentForms, payType, {
          ...data,
          is_open: data.is_open === 'true' || data.is_open === true
        })
        
        // 更新开关状态
        const paymentItem = this.allPaymentList.find(item => item.name === payType)
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
    
    // 获取表单配置项
    getFormItems(payType) {
      const formConfigs = {
        wxpay: this.getWxpayFormItems(),
        alipay: this.getAlipayFormItems(),
        chinaumspay: this.getChinaumspayFormItems(),
        offline_pay: this.getOfflineFormItems(),
        bspay: this.getBspayFormItems(),
        paypal: this.getPaypalFormItems()
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
                <div>微信支付分配的公众账号ID（企业号corpid即为此appId）。请到 微信公众平台 → 开发 → 基本配置 → 获取</div>
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
                <div>微信开放平台审核通过的应用APPID（请登录open.weixin.qq.com查看，注意与公众号的APPID不同）</div>
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
                <div>请到 微信支付商户平台 → 账户中心 → API安全 → API密钥 中设置32位密钥，并将密钥复粘贴过来</div>
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
            onChange: (file, fileList) => {
              this.paymentForms.wxpay.cert = file.raw
            }
          },
          tip: '微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->证书下载 apiclient_cert.pem'
        },
        {
          label: '商户证书秘钥',
          component: 'upload',
          componentProps: {
            title: formData.cert_key_url,
            buttonSize: '点击上传',
            size: 'middle',
            autoUpload: false,
            onChange: (file, fileList) => {
              console.log('上传:', file, fileList)
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
              h('a', {
                attrs: {
                  href: 'https://b.alipay.com/signing/productDetail.htm?productId=I1011000290000001001',
                  target: '_blank',
                  class: 'text-blue-500'
                },
              }, '手机网站支付')
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
          },
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
          },
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
          rules: [
            { required: true, message: '请输入支付方式名称', trigger: 'blur' }
          ]
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
          rules: [
            { required: true, message: '请输入自动取消时间', trigger: 'blur' }
          ]
        },
        {
          isShow: () => formData.is_open,
          component: ({ value, props, onInput, h, formData }) => {
            return (
              <div>
                <el-button type="primary" plain onClick={() =>this.addDeliveryman('add')}>
                  添加收款账户
                </el-button>
                <SpFinder
                  ref="finder"
                  url=""
                  data={this.offlineList}
                  no-selection
                  setting={this.accountsSetting}
                />
              </div>
            )
          },
          rules: [
            { required: true, message: '请输入商户RSA私钥', trigger: 'blur' }
          ],
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
          rules: [
            { required: true, message: '请输入sys_id', trigger: 'blur' }
          ]
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
          rules: [
            { required: true, message: '请输入product_id', trigger: 'blur' }
          ]
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
            placeholder: '请输入商户私钥',
          },
          rules: [
            { required: true, message: '请输入商户私钥', trigger: 'blur' }
          ]
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
          rules: [
            { required: true, message: '请输入汇付公钥', trigger: 'blur' }
          ]
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
          value: formData.pay_channel || [],
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
            options: [
              { label: '标准费率线上', value: 'online' }
            ]
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
            options: [
              { label: '标准费率线上', value: 'online' }
            ]
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
        },
      ]
    },
    
    // 处理支付平台开关切换
    handleTogglePayment(paymentItem) {
      this.$set(this.paymentForms[paymentItem.name], 'is_open', paymentItem.enabled)
      this.savePaymentConfig(paymentItem.name)
    },
    
    // 强制刷新表单数据
    refreshFormData() {
      this.$forceUpdate()
    },
    
    // 处理表单提交
    async handleSubmit(payType) {
      await this.savePaymentConfig(payType)
    },
    
    // 保存支付配置
    async savePaymentConfig(payType) {
      this.loading = true
      try {
        const formData = this.paymentForms[payType]
        const params = {
          pay_type: payType,
          ...formData,
          is_open: formData.is_open ? 'true' : 'false'
        }
        
        await this.$api.trade.setPaymentSetting(params)
        this.$message.success('保存成功')
      } catch (error) {
        this.$message.error('保存失败')
        console.error('保存支付配置失败:', error)
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
        this.accountsForm = {}
      }
      await this.$dialog.open({
        title: type == 'edit' ? '编辑收款账户' : '添加收款账户',
        size: 'medium',
        content: <CompAccountForm ref="accountsForm" value={this.accountsForm} />,
        confirmBefore: async () => {
          try {
            await AccountFormApi.validate()
          } catch (error) {
            throw new Error('表单验证失败')
          }
        }
      })
      const formData = await AccountFormApi.getFieldsValue()
      let params = {
        ...formData
      }
      if (type == 'edit') {
        params.id = this.accountsForm.id
      }
      if (params.id) {
        await this.$api.offline.updateOfflineAccount(params)
        this.$message.success('编辑成功')
      } else {
        await this.$api.offline.createOfflineAccount(params)
        this.$message.success('保存成功')
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
  },
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
