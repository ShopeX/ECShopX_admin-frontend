/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { pickBy } from '@/utils'
import { i18n } from '@/i18n'
import AttrGoods from './attr-goods'
import CompPickerLink from '../../comps/comp-pickerLink'

const config = {
  name: 'goodsScroll',
  setting: [
    { label: i18n.t('e6a33596.4707ba'), key: 'padded', component: 'switch', value: true },
    { label: i18n.t('e6a33596.319337'), key: 'addCart', component: 'switch', value: false },
    { label: i18n.t('e6a33596.ba302e'), key: 'showPrice', component: 'switch', value: true },
    {
      label: i18n.t('e6a33596.2af133'),
      key: 'goodsSetting',
      component: function (h, { key }) {
        return <AttrGoods type={this.value[key].type} v-model={this.value[key]} />
      },
      value: {
        data: [
          {
            imgUrl: '',
            content: '',
            title: 'e6a33596.1fd1d5',
            id: '',
            price: 8888,
            market_price: 10
          }
        ],
        secKillGoods: [
          {
            imgUrl: '',
            title: 'e6a33596.1fd1d5',
            id: '',
            price: 8888
          }
        ],
        limitSecKillGoods: [
          {
            imgUrl: '',
            title: 'e6a33596.1fd1d5',
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
      label: i18n.t('e6a33596.aaa49b'),
      key: 'leaderboard',
      component: 'switch',
      value: true,
      isShow: function () {
        return this.value.goodsSetting.type == 'goods'
      }
    },
    {
      label: i18n.t('e6a33596.eec533'),
      key: 'moreLink',
      component: function (h, { key }) {
        return <CompPickerLink v-model={this.value[key]} style='margin-top: 7px;' />
      },
      value: {}
    },
    {
      label: i18n.t('e6a33596.0ecbd5'),
      key: 'backgroundImg',
      component: function (h, { key }) {
        return <SpImagePicker v-model={this.value[key]} size='small' style='margin-top: 10px;' />
      },
      value: '',
      tip: 'e6a33596.f1e36f'
    }
  ],
  transformIn: (v) => {
    const { name, base, config, data, track, tagsType, meber_tags, no_meber_tags } = v
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
      track,
      tags: {
        type: tagsType || '2',
        meber_tags: meber_tags || [],
        no_meber_tags: no_meber_tags || []
      },
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
      },
      track: 'track',
      tags: 'tags',
      tagsType: 'tags.type',
      meber_tags: 'tags.meber_tags',
      no_meber_tags: 'tags.no_meber_tags'
    })
  }
}

// 自动处理 compStyle 配置（初始化全局处理函数）
import '../../comps/configsetting'
export default typeof globalThis !== 'undefined' && globalThis.__processConfig__
  ? globalThis.__processConfig__(config)
  : config
