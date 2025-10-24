// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统 
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn 
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------

import { pickBy } from '@/utils'
import AttrGoods from './attr-goods'
import CompPickerLink from '../../comps/comp-pickerLink'

export default {
  name: 'goodsScroll',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '当地必买' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '看看大家都在买什么' },
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    { label: '直接加购', key: 'addCart', component: 'switch', value: false },
    { label: '显示价格', key: 'showPrice', component: 'switch', value: true },
    {
      label: '商品类型',
      key: 'goodsSetting',
      component: function (h, { key }) {
        return <AttrGoods type={this.value[key].type} v-model={this.value[key]} />
      },
      value: {
        data: [
          {
            imgUrl: '',
            content: '',
            title: '商品名称',
            id: '',
            price: 8888,
            market_price: 10
          }
        ],
        secKillGoods: [
          {
            imgUrl: '',
            title: '商品名称',
            id: '',
            price: 8888
          }
        ],
        limitSecKillGoods: [
          {
            imgUrl: '',
            title: '商品名称',
            id: '',
            price: 8888
          }
        ],
        type: 'goods',
        seckillId: '',
        limitTimeSaleId: ''
      }
    },
    {
      label: '开启排行榜',
      key: 'leaderboard',
      component: 'switch',
      value: true,
      isShow: function () {
        return this.value.goodsSetting.type == 'goods'
      }
    },
    {
      label: '更多链接',
      key: 'moreLink',
      component: function (h, { key }) {
        return <CompPickerLink v-model={this.value[key]} style='margin-top: 7px;' />
      },
      value: {}
    },
    {
      label: '更多图片',
      key: 'backgroundImg',
      component: function (h, { key }) {
        return <SpImagePicker v-model={this.value[key]} size='small' style='margin-top: 10px;' />
      },
      value: '',
      tip: `建议尺寸:（宽度130px，高度200px）`
    }
  ],
  transformIn: (v) => {
    const { name, base, config, data } = v
    const { type, seckillId, lastSeconds, status } = config
    let list = []
    let secKillId = '',
      secKillGoods = [],
      secKillLastSeconds = 0,
      secKillStatus = ''
    let limitTimeSaleId = '',
      limitTimeSaleGoods = [],
      limitTimeSaleLastSeconds = 0,
      limitTimeSaleLastStatus = ''
    if (type == 'goods') {
      list = data
    } else if (type == 'limitTimeSale') {
      limitTimeSaleId = seckillId
      limitTimeSaleGoods = data
      limitTimeSaleLastSeconds = lastSeconds
      limitTimeSaleLastStatus = status
    } else {
      secKillId = seckillId
      secKillGoods = data
      secKillLastSeconds = lastSeconds
      secKillStatus = status
    }

    return {
      id: v?.id,
      name,
      ...base,
      ...config,
      goodsSetting: {
        type: type,
        data: list,
        secKillId,
        secKillGoods,
        secKillLastSeconds,
        secKillStatus,
        limitTimeSaleId,
        limitTimeSaleGoods,
        limitTimeSaleLastSeconds,
        limitTimeSaleLastStatus
      }
    }
  },
  transformOut: (v) => {
    return pickBy(v, {
      id: 'id',
      name: 'name',
      base: (v) => {
        return pickBy(v, {
          title: 'title',
          subtitle: 'subtitle',
          padded: 'padded',
          backgroundImg: 'backgroundImg'
        })
      },
      config: (v) => {
        return pickBy(v, {
          leaderboard: 'leaderboard',
          moreLink: 'moreLink',
          showPrice: 'showPrice',
          seckillId: ({ goodsSetting: { type, secKillId, limitTimeSaleId } }) => {
            if (type == 'seckill') {
              return secKillId
            } else if (type == 'limitTimeSale') {
              return limitTimeSaleId
            } else {
              return ''
            }
          },
          type: 'goodsSetting.type',
          addCart: 'addCart'
          // lastSeconds: 'goodsSetting.lastSeconds'
        })
      },
      data: ({ goodsSetting: { type, data, secKillGoods, limitTimeSaleGoods } }) => {
        if (type == 'seckill') {
          return secKillGoods
        } else if (type == 'limitTimeSale') {
          return limitTimeSaleGoods
        } else {
          return data
        }
      }
    })
  }
}
