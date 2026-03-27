/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { pickBy } from '@/utils'
import AttrHotSetting from './attr-hotsetting'

export default {
  wgtName: 'imgHotzone',
  wgtIcon: 'wgt-hotzone',
  example: {
    name: 'imgHotzone',
    title: 'b8c8c43e.0ad6ab',
    subtitle: 'b8c8c43e.f858aa',
    padded: true,
    data: {
      imgUrl: '',
      data: []
    }
  },
  config: {
    name: 'imgHotzone',
    setting: [
      { label: 'b8c8c43e.32c65d', key: 'title', component: 'input', value: '热区图' },
      { label: 'b8c8c43e.72cf37', key: 'subtitle', component: 'input', value: '图上随意画块块' },
      { label: 'b8c8c43e.4707ba', key: 'padded', component: 'switch', value: true },
      {
        label: 'b8c8c43e.c90f57',
        key: 'data',
        component: function (h, { key }) {
          return <AttrHotSetting v-model={this.value[key]} />
        },
        value: { imgUrl: '', data: [] }
      }
    ],
    transformIn: (v) => {
      const {
        name,
        base,
        config: { imgUrl },
        data,
        uuid
      } = v
      return {
        name,
        ...base,
        data: {
          imgUrl,
          data,
          uuid
        }
      }
    },
    transformOut: (v) => {
      return pickBy(v, {
        name: 'name',
        uuid: 'uuid',
        base: (v) => {
          return pickBy(v, {
            title: 'title',
            subtitle: 'subtitle',
            padded: 'padded'
          })
        },
        config: ({ data }) => {
          return pickBy(data, {
            imgUrl: 'imgUrl'
          })
        },
        data: 'data.data'
      })
    }
  }
}
