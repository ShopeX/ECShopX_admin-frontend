import { pickBy } from '@/utils'
import { i18n } from '@/i18n'
import AttrStore from './attr-store'
import { transformInBase, createTransformOutBase } from '../../comps/transform-utils'

const NEARBY_SETTING_KEYS = [
  'title',
  'subtitle',
  'padded',
  'show_nearby_merchants',
  'merchantsNumber',
  'quantityNumber'
]

const SHARED_BASE_KEYS = [
  'dataType',
  'outerMargin',
  'innerPadding',
  'outerBackground',
  'innerBackground',
  'track',
  ...NEARBY_SETTING_KEYS
]

function isNearbyDataType(v, raw = {}) {
  if (raw.name === 'nearbyShop') return true
  const base = raw.base || {}
  return (base.dataType || v.dataType) === 'nearby'
}

function buildNearbySetting() {
  return [
    { label: i18n.t('9b7fb994.4707ba'), key: 'padded', component: 'switch', value: false },
    {
      label: i18n.t('9b7fb994.f417a5'),
      key: 'show_nearby_merchants',
      component: 'switch',
      value: false
    },
    {
      label: i18n.t('9b7fb994.35f408'),
      key: 'merchantsNumber',
      component: 'number',
      value: 4,
      min: 1,
      max: 100
    },
    {
      label: i18n.t('9b7fb994.81756c'),
      key: 'quantityNumber',
      component: 'number',
      value: 4,
      min: 1,
      max: 100
    }
  ]
}

const config = {
  name: 'shop',
  setting: [
    {
      label: i18n.t('ca99873f.095e43'),
      key: 'track',
      component: 'input',
      value: ''
    },
    {
      label: i18n.t('ca99873f.185f7b'),
      key: 'dataType',
      component: 'select',
      options: [
        { label: i18n.t('ca99873f.fcf7d8'), value: 'specify' },
        { label: i18n.t('5e1ae7f2.0c0d95'), value: 'nearby' }
      ],
      value: 'specify',
      onchange: function (e, vm) {
        if (e === 'nearby') {
          vm.value.data = []
        }
      }
    },
    {
      label: i18n.t('ca99873f.e7af71'),
      key: 'data',
      component: function (h, { key }) {
        return (
          <AttrStore
            v-model={this.value[key]}
            on-change={() => {
              if (this.value[key].id === '') {
                this.value.items = []
                this.value.tags = []
              }
            }}
          />
        )
      },
      value: [],
      isShow() {
        return this.value.dataType === 'specify'
      }
    },
    ...buildNearbySetting().map((item) => ({
      ...item,
      isShow() {
        return this.value.dataType === 'nearby'
      }
    }))
  ],
  transformIn: (v) => {
    const nearby = isNearbyDataType(v, v)
    const base = v.base || {}
    const transformedBase = transformInBase(base, ['outerMargin', 'innerPadding'])
    const tags = {
      type: v.tagsType || '2',
      meber_tags: v.meber_tags || [],
      no_meber_tags: v.no_meber_tags || []
    }
    const common = {
      id: v?.id,
      name: 'shop',
      dataType: nearby ? 'nearby' : base.dataType || 'specify',
      ...transformedBase,
      track: v.track ?? base.track ?? '',
      tags
    }
    if (nearby) {
      return {
        ...common,
        data: [],
        title: base.title ?? '',
        subtitle: base.subtitle ?? '',
        padded: base.padded ?? false,
        show_nearby_merchants: base.show_nearby_merchants ?? false,
        merchantsNumber: base.merchantsNumber ?? 4,
        quantityNumber: base.quantityNumber ?? 4
      }
    }
    return {
      ...common,
      data: v.data || [],
      padded: false,
      show_nearby_merchants: false,
      merchantsNumber: 4,
      quantityNumber: 4,
      title: '',
      subtitle: ''
    }
  },
  transformOut: (v, wgtList, regionauth_id) => {
    const nearby = v.dataType === 'nearby'
    const baseKeys = nearby
      ? SHARED_BASE_KEYS
      : SHARED_BASE_KEYS.filter((k) => !NEARBY_SETTING_KEYS.includes(k))
    const out = {
      id: 'id',
      name: () => 'shop',
      base: createTransformOutBase(baseKeys, ['outerMargin', 'innerPadding']),
      meber_tags: 'tags.meber_tags',
      no_meber_tags: 'tags.no_meber_tags',
      tagsType: 'tags.type',
      noRegionauth: !regionauth_id
    }
    if (nearby) {
      out.data = () => []
    } else {
      out.data = 'data'
    }
    return pickBy(v, out)
  }
}

import '../../comps/configsetting'

export default typeof globalThis !== 'undefined' && globalThis.__processConfig__
  ? globalThis.__processConfig__(config)
  : config
