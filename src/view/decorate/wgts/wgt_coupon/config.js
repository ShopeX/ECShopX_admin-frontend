import { pickBy } from '@/utils'
import moment from 'moment'
import CompBtn from '../../comps/comp_btn.vue'
import CompButton from '../../comps/comp-button.vue'
import { transformInBase, createTransformOutBase } from '../../comps/transform-utils'
// import CrowdSelectV2 from '@/components/function/crowdSelectV2.vue'
const config = {
  name: 'couponCard',
  setting: [
    {
      label: '自定义挂件名称',
      key: 'wgtCustName',
      component: 'input',
      value: ''
    },
    // {
    //   label: '埋点上报参数',
    //   key: 'track',
    //   component: 'input',
    //   value: ''
    // },
    // {
    //   label: '人群设置',
    //   key: 'tags',
    //   component: function (h, { key }) {
    //     return <CrowdSelectV2 v-model={this.value[key]} />
    //   },
    //   value: {
    //     type: '2',
    //     meber_tags: [],
    //     no_meber_tags: []
    //   }
    // },
    {
      label: '数据设置',
      key: 'data',
      component: function (h, { key }) {
        const self = this
        return (
          <CompButton
            placeholder='选择优惠券'
            format='{0}个优惠券'
            value={self.value[key]?.length || 0}
            viewBtn={false}
            on-click={async () => {
              try {
                const couponList = self.value[key] || []
                const { data: couponData } = await self.$picker.coupon({
                  data: couponList,
                  multiple: true,
                  params: {
                    regionauth_id: self.$route.query.regionauth_id
                  }
                })

                const formattedCouponList = couponData.map((item) => {
                  let amount
                  if (item.card_type == 'cash') {
                    amount = item.reduce_cost / 100
                  } else if (item.card_type == 'discount') {
                    amount = (100 - parseInt(item.discount)) / 10
                  } else {
                    amount = item.reduce_cost / 100
                  }
                  return {
                    amount,
                    desc: item.description,
                    id: item.card_id,
                    title: item.title,
                    type: item.card_type,
                    end_date: moment(item.end_date * 1000).format('YYYY-MM-DD HH:mm'),
                    card_source: item?.card_source || '',
                    card_source_platform: '',
                    ...item
                  }
                })
                self.$set(self.value, key, formattedCouponList)
              } catch (error) {
                console.error('选择优惠券失败:', error)
              }
            }}
            on-remove={() => {
              self.$set(self.value, key, [])
            }}
          />
        )
      },
      value: []
    },
    // {
    //   label: '组件外边距',
    //   key: 'outerMargin',
    //   component: function (h, { key }) {
    //     return (
    //       <CompStyle
    //         showBgsetting={false}
    //         v-model={this.value[key]}
    //         uuid={this.value.uuid}
    //         showLabel={false}
    //       />
    //     )
    //   },
    //   value: {
    //     paddedt: 0,
    //     paddedb: 14,
    //     paddedl: 12,
    //     paddedr: 12
    //   }
    // },

    // {
    //   label: '组件内边距',
    //   key: 'innerMargin',
    //   component: function (h, { key }) {
    //     return (
    //       <CompStyle
    //         showBgsetting={false}
    //         v-model={this.value[key]}
    //         uuid={this.value.uuid}
    //         showLabel={false}
    //       />
    //     )
    //   },
    //   value: {
    //     paddedt: 0,
    //     paddedb: 0,
    //     paddedl: 0,
    //     paddedr: 0
    //   }
    // },
    // {
    //   label: '组件外背景',
    //   key: 'outerBackground',
    //   component: function (h, { key }) {
    //     return <CompOuter v-model={this.value[key]} />
    //   },
    //   value: { color: '', image: '' }
    // },
    // {
    //   label: '组件内背景',
    //   key: 'innerBackground',
    //   component: function (h, { key }) {
    //     return <CompInner v-model={this.value[key]} />
    //   },
    //   value: { type: 'solid', color: '', startColor: '', endColor: '' }
    // },
    {
      label: '面额颜色',
      key: 'amountColor',
      component: 'color',
      value: '#D4003B'
    },
    {
      label: '领取按钮',
      key: 'receiveBtn',
      component: function (h, { key }) {
        return <CompBtn v-model={this.value[key]} showImage={false} />
      },
      value: {
        color: '#000000',
        textColor: '#fff',
        image: ''
      }
    }
  ],
  transformIn: (v) => {
    const { name, base, data, meber_tags = [], no_meber_tags = [], tagsType } = v
    // 使用公共函数处理 base 中的样式数据转换
    const transformedBase = transformInBase(base, ['outerMargin', 'innerPadding'])
    return {
      name,
      ...transformedBase,
      data,
      tags: {
        type: tagsType || '2',
        meber_tags: meber_tags || [],
        no_meber_tags: no_meber_tags || []
      }
    }
  },
  transformOut: (v) => {
    return pickBy(v, {
      name: 'name',
      base: (v) => {
        // 使用公共函数处理 outerMargin 转换，同时保留其他字段
        const baseData = createTransformOutBase(
          [
            'wgtCustName',
            'track',
            'outerMargin',
            'innerPadding',
            'outerBackground',
            'innerBackground',
            'amountColor',
            'receiveBtn'
          ],
          ['outerMargin', 'innerPadding']
        )(v)
        return baseData
      },
      data: 'data',
      meber_tags: 'tags.meber_tags',
      no_meber_tags: 'tags.no_meber_tags',
      tagsType: 'tags.type'
    })
  }
}

import '../../comps/configsetting'

export default typeof globalThis !== 'undefined' && globalThis.__processConfig__
  ? globalThis.__processConfig__(config)
  : config
