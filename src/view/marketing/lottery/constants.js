/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
export const audit_status = (t) => [
  { value: 'all', label: t('9f64e002.a8b0c2') },
  { value: 'notstart', label: t('9f64e002.1568ba') },
  { value: 'online', label: t('9f64e002.fb852f') },
  { value: 'expire', label: t('9f64e002.047fab') }
]

export const status_map = (t) => ({
  notstart: t('9f64e002.dd4e55'),
  expire: t('9f64e002.4d5ccd'),
  online: t('9f64e002.fb852f')
})

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

export const prize_types = (t) => ({
  thanks: t('9f64e002.d7bc19'),
  points: t('9f64e002.9f68a8'),
  coupon: t('9f64e002.2f3635'),
  coupons: t('9f64e002.7fac13')
})

export const defaultGameConfig = {
  gameType: '',
  backgroundImage: 'https://img.yzcdn.cn/vant/cat.jpeg',
  gameMarginTop: '100px',
  gameConfig: {
    width: '300px',
    height: '300px',
    gameContainerMarginTop: '120px',
    blocks: [
      {
        padding: '13px',
        background: '#617df2'
      }
    ],
    buttons: [
      {
        radius: '50px',
        background: '#617df2'
      },
      {
        radius: '45px',
        background: '#afc8ff'
      },
      {
        radius: '40px',
        background: '#869cfa',
        pointer: true,
        fonts: {
          text: '开始\\n抽奖',
          top: '-20px'
        }
      }
    ],
    defaultConfig: {
      gutter: 0
    },
    defaultStyle: {
      fontSize: '14px',
      fontColor: '#666666',
      fontWeight: 'bold',
      lineHeight: '24px',
      background: '#ffffff',
      shadow: '0 0 10px rgba(0,0,0,0.1)',
      fontStyle: 'normal'
    }
  }
}
