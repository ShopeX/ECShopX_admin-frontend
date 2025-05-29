import { pickBy } from '@/utils'
import AttrHotSetting from './attr-hotsetting'
import CompStyle from '../../comps/comp_style.vue';

export default {
  name: 'imgHotzone',
  setting: [
    {
      label: "埋点上报参数",
      key: "track",
      component: "input",
      value: "",
    },
    {
      label: '展示形式',
      key: 'animation',
      component: 'radiobutton',
      options: [
        { name: '横向排列', label: 'horizontal' },
        { name: '纵向排列', label: 'vertical' }
      ],
      value: 'horizontal',
    },
    {
      label: '图片高度',
      key: 'imgHeight',
      component: 'number',
      value: 156,
      isShow: function (v) {
        return this.value.animation === 'vertical'
      }
    },
    {
      label: '热区设置',
      key: 'data',
      component: function (h, { key }) {
        return <AttrHotSetting v-model={this.value[key]} />
      },
      value: { imgUrl: '', data: [] }
    },
    {
      label: '组件外边距',
      key: 'outerMargin',
      component: function (h, { key }) {
          return (
              <CompStyle
                  showBgsetting={false}
                  v-model={this.value[key]}
                  uuid={this.value.uuid}
                  showLabel={false}
              />
          );
      },
      value: {
          paddedt: 12,
          paddedb: 12,
          paddedl: 12,
          paddedr: 12,
      },
  },
  ],
  transformIn: (v) => {
    const {
      name,
      base,
      config: { imgUrl },
      data
    } = v
    return {
      name,
      ...base,
      data: {
        imgUrl,
        data
      }
    }
  },
  transformOut: (v) => {
    return pickBy(v, {
      name: 'name',
      base: (v) => {
        return pickBy(v, {
          track: 'track',
          animation: 'animation',
          imgHeight: 'imgHeight',
          outerMargin: 'outerMargin'
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
