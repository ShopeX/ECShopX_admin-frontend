/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { pickBy, isObject } from '@/utils'
import { i18n } from '@/i18n'
import AttrClass from './attr-class'
import CompPickerLink from '../../comps/comp-pickerLink'

const config = {
  name: 'goodsGridTab',
  setting: [
    { label: i18n.t('5e607dbd.4707ba'), key: 'padded', component: 'switch', value: true },
    { label: i18n.t('5e607dbd.319337'), key: 'addCart', component: 'switch', value: false },
    { label: i18n.t('5e607dbd.ba302e'), key: 'showPrice', component: 'switch', value: true },
    { label: i18n.t('5e607dbd.02af2a'), key: 'brand', component: 'switch', value: true },
    {
      label: i18n.t('5e607dbd.c3ece5'),
      key: 'list',
      component: function (h, { key }) {
        return <AttrClass v-model={this.value[key]} />
      },
      value: [
        {
          tabTitle: '5e607dbd.14d342',
          type: 'normal',
          goodsList: [
            {
              imgUrl: '',
              linkPage: '',
              content: '',
              title: '5e607dbd.1fd1d5',
              id: '',
              price: 0,
              market_price: 0
            },
            {
              imgUrl: '',
              linkPage: '',
              content: '',
              title: '5e607dbd.1fd1d5',
              id: '',
              price: 0,
              market_price: 0
            },
            {
              imgUrl: '',
              linkPage: '',
              content: '',
              title: '5e607dbd.1fd1d5',
              id: '',
              price: 0,
              market_price: 0
            },
            {
              imgUrl: '',
              linkPage: '',
              content: '',
              title: '5e607dbd.1fd1d5',
              id: '',
              price: 0,
              market_price: 0
            }
          ],
          pointGoods: [
            {
              imgUrl: '',
              linkPage: '',
              content: '',
              title: '5e607dbd.1fd1d5',
              id: '',
              price: 0,
              market_price: 0,
              point: 0
            },
            {
              imgUrl: '',
              linkPage: '',
              content: '',
              title: '5e607dbd.1fd1d5',
              id: '',
              price: 0,
              market_price: 0,
              point: 0
            },
            {
              imgUrl: '',
              linkPage: '',
              content: '',
              title: '5e607dbd.1fd1d5',
              id: '',
              price: 0,
              market_price: 0,
              point: 0
            },
            {
              imgUrl: '',
              linkPage: '',
              content: '',
              title: '5e607dbd.1fd1d5',
              id: '',
              price: 0,
              market_price: 0,
              point: 0
            }
          ]
        }
      ]
    },
    {
      label: i18n.t('5e607dbd.90ef7c'),
      key: 'moreLink',
      component: function (h, { key }) {
        return <CompPickerLink v-model={this.value[key]} style='margin-top: 7px;' />
      }
    }
  ],
  transformIn: (v) => {
    const {
      name,
      base,
      config,
      data,
      list,
      distributor_id,
      track,
      tagsType,
      meber_tags,
      no_meber_tags
    } = v
    return {
      id: v?.id,
      name,
      ...base,
      ...config,
      data,
      list,
      distributor_id,
      track,
      tags: {
        type: tagsType || '2',
        meber_tags: meber_tags || [],
        no_meber_tags: no_meber_tags || []
      }
    }
  },
  transformOut: (v) => {
    const obj = pickBy(v, {
      id: 'id',
      name: 'name',
      base: (v) => {
        return pickBy(v, {
          title: 'title',
          subtitle: 'subtitle',
          padded: 'padded',
          listIndex: 'listIndex'
        })
      },
      config: (v) => {
        return pickBy(v, {
          brand: 'brand',
          showPrice: 'showPrice',
          style: 'style',
          moreLink: 'moreLink',
          addCart: 'addCart'
        })
      },
      list: 'list',
      data: 'data',
      distributor_id: 'distributor_id',
      track: 'track',
      tags: 'tags',
      tagsType: 'tags.type',
      meber_tags: 'tags.meber_tags',
      no_meber_tags: 'tags.no_meber_tags'
    })
    return obj
  }
}

// 自动处理 compStyle 配置（初始化全局处理函数）
import '../../comps/configsetting'
export default typeof globalThis !== 'undefined' && globalThis.__processConfig__
  ? globalThis.__processConfig__(config)
  : config
