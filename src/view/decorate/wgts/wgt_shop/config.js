import { pickBy } from '@/utils'
import AttrStore from './attr-store'
import { transformInBase, createTransformOutBase } from '../../comps/transform-utils'

const config = {
  name: 'shop',
  setting: [
    {
      label: '自定义挂件名称',
      key: 'wgtCustName',
      component: 'input',
      value: ''
    },
    {
      label: '埋点上报参数',
      key: 'track',
      component: 'input',
      value: ''
    },

    {
      label: '数据类型',
      key: 'dataType',
      component: 'select',
      options: [{ label: '指定店铺', value: 'specify' }],
      value: 'specify',
      onchange: function (e, vm) {
        vm.value.data = []
      }
    },

    {
      label: '数据设置',
      key: 'data',
      component: function (h, { key }) {
        return (
          <AttrStore
            v-model={this.value[key]}
            on-change={() => {
              if (this.value[key].id === '') {
                this.value['items'] = []
                this.value['tags'] = []
              }
            }}
          />
        )
      },
      value: [],
      isShow: function () {
        return this.value.dataType === 'specify'
      }
    }
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
    //         showLeft={false}
    //         showRight={false}
    //       />
    //     )
    //   },
    //   value: {
    //     paddedt: 10,
    //     paddedb: 10
    //   }
    // },
    // {
    //   label: '组件内边距',
    //   key: 'innerPadding',
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
    //     paddedt: 10,
    //     paddedb: 10,
    //     paddedl: 10,
    //     paddedr: 10
    //   }
    // },
    // {
    //   label: '组件外背景',
    //   key: 'outerBackground',
    //   component: function (h, { key }) {
    //     return <CompOuter v-model={this.value[key]} uuid={this.value.uuid} />
    //   },
    //   value: { color: '#f8f8f8', image: '' }
    // },
    // {
    //   label: '组件内背景',
    //   key: 'innerBackground',
    //   component: function (h, { key }) {
    //     return <CompInner v-model={this.value[key]} uuid={this.value.uuid} />
    //   },
    //   value: { type: 'solid', color: '#ffffff', startColor: '#ffffff', endColor: '#ffffff' }
    // }
  ],
  transformIn: (v) => {
    const { name, base, data, meber_tags = [], no_meber_tags = [], tagsType } = v
    // 使用公共函数处理 base 中的样式数据转换
    const transformedBase = transformInBase(base, ['outerMargin', 'innerPadding'])
    return {
      name,
      ...transformedBase,
      data: data,
      tags: {
        type: tagsType || '2',
        meber_tags: meber_tags || [],
        no_meber_tags: no_meber_tags || []
      }
    }
  },
  transformOut: (v, wgtList, regionauth_id) => {
    return pickBy(v, {
      name: 'name',
      base: (v) => {
        // 使用公共函数处理 outerMargin 和 innerPadding 转换，同时保留其他字段
        const baseData = createTransformOutBase(
          [
            'dataType',
            'outerMargin',
            'innerPadding',
            'outerBackground',
            'innerBackground',
            'wgtCustName',
            'track'
          ],
          ['outerMargin', 'innerPadding']
        )(v)
        return baseData
      },
      data: 'data',
      meber_tags: 'tags.meber_tags',
      no_meber_tags: 'tags.no_meber_tags',
      tagsType: 'tags.type',
      noRegionauth: !regionauth_id
    })
  }
}

import '../../comps/configsetting'

export default typeof globalThis !== 'undefined' && globalThis.__processConfig__
  ? globalThis.__processConfig__(config)
  : config
