import { pickBy } from '@/utils'
import { i18n } from '@/i18n'
import { transformInBase, createTransformOutBase } from '../../comps/transform-utils'

const config = {
  name: 'storeAlphabet',
  setting: [
    {
      label: i18n.t('c6e0a96a.185f7b'),
      key: 'dataType',
      component: 'select',
      options: [
        { label: i18n.t('c6e0a96a.fc689d'), value: 'all' },
        { label: i18n.t('c6e0a96a.fcf7d8'), value: 'specify' }
      ],
      value: 'all',
      onchange: function (e, vm) {
        vm.value.data = []
      }
    }
  ],
  transformIn: (v) => {
    const { name, base, data, track, tagsType, meber_tags, no_meber_tags } = v
    // 使用公共函数处理 base 中的样式数据转换
    const transformedBase = transformInBase(base, ['outerMargin', 'innerPadding'])
    return {
      id: v?.id,
      name,
      ...transformedBase,
      data: data,
      track,
      tags: {
        type: tagsType || '2',
        meber_tags: meber_tags || [],
        no_meber_tags: no_meber_tags || []
      }
    }
  },
  transformOut: (v) => {
    return pickBy(v, {
      id: 'id',
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
            'track'
          ],
          ['outerMargin', 'innerPadding']
        )(v)
        return baseData
      },
      data: 'data',
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
