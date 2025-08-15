export const status = [
  {
    value: 'all',
    label: '全部'
  },
  {
    value: 'pending',
    label: '待开票'
  },
  {
    value: 'inProgress',
    label: '开票中'
  },
  {
    value: 'success',
    label: '开票成功'
  },
  {
    value: 'failed',
    label: '开票失败'
  },
  {
    value: 'waste',
    label: '已红冲'
  }
]

export const open_status_map = {
  inProgress: '开票中',
  success: '开票成功',
  waste: '已红冲',
  failed: '开票失败',
  pending: '待开票'
};


export const open_status_step_map = {
  online: '线上百望开票',
  offline:'线下开票'
}

export  const invoice_type_code_map = {
  '01':'专业发票',
  '02':'电子普通发票'
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
  }
];


export const invoice_source_map = {
  'user': '用户端',
  'oms': 'OMS端',
}

export const invoice_source_arr = [
  {
    value: 'user',
    label: '用户端',
    title: '用户端'
  },
  {
    value: 'oms',
    label: 'OMS端',
    title: 'OMS端'
  }
]



// update 更新 update_remark 更新备注 create创建  resend_email 重发邮件
export const invoice_log_type_map = {
  update: '更新',
  update_remark: '更新备注',
  create: '创建',
  resend_email: '重发邮件'
}
