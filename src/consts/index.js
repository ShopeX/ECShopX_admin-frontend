export const ICON_MAP = {
  'tachometer-alt': 'gaikuang',
  'shopping-bag': 'shangpin',
  'clipboard-list': 'jiaoyi',
  'store-alt': 'jingxiaoshang',
  'gem1': 'huiyuan',
  'brush': 'moban',
  'gift': 'yingxiao',
  'file-invoice-dollar': 'caiwu',
  'chart-bar': 'tongji',
  'sitemap': 'zhandian',
  'yingyong-01': 'yingyong',
  'cog': 'shezhi'
}

export const open_status_arr = [
  {
    value: 'pending',
    label: '待开票',
    title: '待开票'
  },
  {
    value: 'inProgress',
    label: '开票中',
    title: '开票中'
  },
  {
    value: 'success',
    label: '开票成功',
    title: '开票成功'
  },
  {
    value: 'waste',
    label: '已红冲',
    title: '已红冲'
  },
  {
    value: 'failed',
    label: '开票失败',
    title: '开票失败'
  },
  {
    value: 'cancel',
    label: '取消',
    title: '取消'
  },
  {
    value: 'waitProgress',
    label: '排队',
    title: '排队'
  },
];


export const SALES_STATUS = [
  { title: '前台可销售', value: 'onsale' },
  { title: '前台不展示', value: 'offline_sale' },
  { title: '前台仅展示', value: 'only_show' },
  { title: '不可销售', value: 'instock' }
]

export const DISTRIBUTION_TYPE = [
  { title: '全部', value: '' },
  { title: '普通快递', value: 'logistics' },
  { title: '同城配', value: 'dada' },
  { title: '客户自提', value: 'ziti' },
  { title: '商家自配送', value: 'merchant' }
]

export const DISTRIBUTION_STATUS = [
  { title: '全部', value: '' },
  { title: '待确认', value: 'CONFIRMING' },
  { title: '已接单', value: 'RECEIVEORDER' },
  { title: '已打包', value: 'PACKAGED' },
  { title: '配送中', value: 'DELIVERING' },
  { title: '已送达', value: 'DONE' }
  // { title: '已取消', value: 'NOTMERCHANT' }
]

export const ORDER_STATUS = [
  { title: '全部', value: '' },
  { title: '待支付', value: 'notpay' },
  { title: '待发货', value: 'notship' },
  { title: '待收货', value: 'shipping' },
  { title: '待退款', value: 'cancelapply' },
  { title: '待自提', value: 'ziti' },
  { title: '已取消', value: 'cancel' },
  { title: '已完成', value: 'finish' },
  { title: '待接单', value: 'dada_0' },
  { title: '待骑士接单', value: 'dada_1' },
  { title: '待取货', value: 'dada_2' },
  { title: '骑士到店', value: 'dada_100' },
  { title: '配送中', value: 'dada_3' },
  { title: '未妥投', value: 'dada_9' }
]

export const ORDER_B2C_STATUS = [
  { title: '全部', value: '' },
  { title: '待支付', value: 'notpay' },
  { title: '待发货', value: 'notship' },
  { title: '待收货', value: 'shipping' },
  { title: '待退款', value: 'cancelapply' },
  { title: '待自提', value: 'ziti' },
  { title: '已取消', value: 'cancel' },
  { title: '已完成', value: 'finish' }
]

export const IN_PURCHASE_STATUS = [
  { title: '全部', value: '' },
  { title: '待支付', value: 'notpay' },
  { title: '待发货', value: 'notship' },
  { title: '待收货', value: 'shipping' },
  { title: '待退款', value: 'cancelapply' },
  { title: '已取消', value: 'cancel' },
  { title: '已完成', value: 'finish' }
  // { title: '配送中', value: 'dada_3' }
]

export const ORDER_TYPE = [
  { title: '全部', value: '' },
  { title: '团购订单', value: 'groups' },
  { title: '秒杀订单', value: 'seckill' },
  { title: '普通订单', value: 'normal' },
  { title: '社区团购订单', value: 'community' },
  { title: '内购订单', value: 'employee_purchase' }
  // { title: "导购订单", value: "shopguide" },
  // { title: "跨境订单", value: "crossborder" },
  // { title: "助力订单", value: "bargain" },
  // { title: "服务类订单", value: "services" },
  // { title: "兑换订单", value: "excard"}
]

export const ORDER_TYPE_STANDARD = [
  { title: '全部', value: '' },
  { title: '团购订单', value: 'groups' },
  { title: '秒杀订单', value: 'seckill' },
  { title: '普通订单', value: 'normal' },
  { title: '社区团购订单', value: 'community' },
  { title: '兑换订单', value: 'excard' },
  { title: '门店订单', value: 'shopadmin' },
  { title: '内购订单', value: 'employee_purchase' }
]

export const INVOICE_STATUS = [
  { title: '全部', value: '' },
  { title: '未开票', value: 0 },
  { title: '已开票', value: 1 }
]

export const GOOD_CATEGORY = [
  { title: '自营', value: 'self' },
  { title: '商户商品', value: 'distributor' },
  { title: '供应商商品', value: 'supplier' }
]

export const GOOD_CATEGORY_MAP = {
  'self': '自营',
  'distributor': '商户商品',
  'supplier': '供应商商品'
}

export const ORDER_CATEGORY = [
  { title: '全部', value: '' },
  { title: '自营订单', value: 'self' },
  { title: '商家订单', value: 'distributor' },
  { title: '供应商订单', value: 'supplier' },
  { title: '自营+供应商订单', value: 'self_supplier' }
]

export const SELF_ORDER_CATEGORY = [
  { title: '全部', value: 'self,self_supplier' },
  { title: '自营订单', value: 'self' },
  { title: '自营+供应商订单', value: 'self_supplier' }
]

export const REFUND_STATUS = {
  READY: '待审核',
  AUDIT_SUCCESS: '审核成功待退款',
  SUCCESS: '退款成功',
  SHOP_CHECK_FAILS: '商家审核不通过',
  CANCEL: '撤销退款',
  PROCESSING: '已发起退款等待到账',
  FAILS: '退款失败',
  WAIT_CHECK: '待审核',
  WAIT_REFUND: '等待退款'
}

export const REFUND_PROCESS = {
  0: '待处理',
  1: '已取消',
  2: '退款中',
  3: '已完成',
  4: '已驳回'
}

export const PROFIT_TYPE = {
  1: '总部分润',
  2: '自营门店分润',
  3: '加盟门店分润'
}

export const PAY_TYPE = {
  offline: '线下转账',
  offline_pay: '线下转账',
  wxpay: '微信支付',
  amorepay: '微信支付',
  wechat: '微信支付',
  wepayjs: '微信支付',
  wxpaypc: '微信PC支付',
  wxpayh5: '微信H5支付',
  alipay: '支付宝支付',
  alipayh5: '支付宝H5支付',
  deposit: '余额支付',
  point: '积分支付',
  // pos: 'POS银行卡支付',
  pos: '现金支付',
  wxpaypos: '微信扫码支付',
  alipaypos: '支付宝扫码支付',
  chinaums: '微信支付-银联',
  // pay_channel
  wx_lite: '微信支付',
  wx_pub: '微信H5支付',
  wx_qr: '微信PC支付',
  alipay_wap: '支付宝H5支付',
  alipay_qr: '支付宝PC支付',
  alipaymini: '支付宝小程序'
}

export const PAY_STATUS = {
  SUCCESS: '支付成功',
  REFUND: '转入退款',
  CANCEL_CLOSED: '已取消',
  REFUND_SUCCESS: '退款成功',
  NOTPAY: '未支付',
  CLOSED: '已关闭',
  REVOKED: '已撤销',
  PAYERROR: '支付失败(其他原因，如银行返回失败)'
}

export const PICKER_DATE_OPTIONS = {
  shortcuts: [
    {
      text: '最近一周',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '最近一个月',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '最近三个月',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        picker.$emit('pick', [start, end])
      }
    }
  ]
}

export const FORM_COMP = {
  INPUT: 1,
  NUMBER: 2,
  DATE: 3,
  RADIO: 4,
  CHECKBOX: 5,
  MOBILE: 6,
  IMAGE: 7
}

export const SYSTEM_CONFIG = {
  platform: { name: 'Powered By ShopeX', theme: '#CB060F' },
  standard: { name: '新零售云店', theme: '#FF9D00' },
  b2c: { name: '官方商城', theme: '#157FE3' },
  in_purchase: { name: '商派Onex内购', theme: '#EC442E' }
}

export const LINK_PATH = {
  'goods': '商品',
  'store': '店铺',
  'sale_category': '销售分类',
  'category': '管理分类',
  'tag': '商品标签',
  'article': '文章',
  'planting': '软文',
  'link': '页面',
  // 'marketing': '营销',
  'regactivity': '活动报名',
  'purchase_activity': '内购活动',
  'seckill': '秒杀',
  'custom_page': '自定义页面',
  'liverooms': '直播',
  'other_wxapp': '外部小程序',
  'shop_tag': '商家'
}

export const CARD_TYPE = {
  'discount': '折扣券',
  'cash': '满减券',
  'new_gift': '兑换券'
}

export const SECKILL_ACTIVITY_STATUS = {
  'waiting': '待开始',
  'in_the_notice': '预热中',
  'in_sale': '进行中',
  'it_has_ended': '已结束'
}

// 商品审核状态
export const GOODS_APPLY_STATUS = {
  submitting: '待提交',
  approved: '已审核',
  processing: '审核中',
  rejected: '已拒绝'
}

// 商品税率
export const GOODS_TAX_RATE = [
  { title: '1%', value: 1 },
  { title: '6%', value: 6 },
  { title: '9%', value: 9 },
  { title: '13%', value: 13 },
  { title: '免税', value: 0 }
]

export const ROLE_LIST = [
  { label: '普通用户', value: 1 },
  { label: '企业员工', value: 6 },
  { label: '员工亲友', value: 9 }
]
