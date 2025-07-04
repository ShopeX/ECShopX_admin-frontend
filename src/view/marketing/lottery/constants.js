// 审核tab数据
export const audit_status = [
  {
    value: 'all',
    label: '全部'
  },
  {
    value: 'notstart',
    label: '待开始'
  },
  {
    value: 'online',
    label: '进行中'
  },
  {
    value: 'expire',
    label: '已结束'
  }
]

export const status_map = {
  notstart: '未开始',
  expire: '已过期',
  online: '进行中'
}

export const status_info_map = {
  notstart: 'notstart',
  expire: 'expire',
  online: 'online'
}

export const defaultItem = {
  text: '',
  prize_probability: '',
  prize_type: '',
  prize_value: '',
  stock: '',
  background: '',
  img: ''
}

export const prize_types = {
  thanks: '无奖品', // 无奖品
  points: '积分', // 积分
  coupon: '优惠券', // 优惠券
  coupons: '券包' // 券包
}

export const defaultGameConfig = {
  'gameType': '',
  'backgroundImage': 'https://img.yzcdn.cn/vant/cat.jpeg',
  'gameMarginTop': '100px',
  'gameConfig': {
    'width': '300px',
    'height': '300px',
    'gameContainerMarginTop': '120px',
    'blocks': [
      {
        'padding': '13px',
        'background': '#617df2'
      }
    ],
    'buttons': [
      {
        'radius': '50px',
        'background': '#617df2'
      },
      {
        'radius': '45px',
        'background': '#afc8ff'
      },
      {
        'radius': '40px',
        'background': '#869cfa',
        'pointer': true,
        'fonts': {
          'text': '开始\\n抽奖',
          'top': '-20px'
        }
      }
    ],
    'defaultConfig': {
      'gutter': 0
    },
    'defaultStyle': {
      'fontSize': '14px',
      'fontColor': '#666666',
      'fontWeight': 'bold',
      'lineHeight': '24px',
      'background': '#ffffff',
      'shadow': '0 0 10px rgba(0,0,0,0.1)',
      'fontStyle': 'normal'
    }
  }
}
