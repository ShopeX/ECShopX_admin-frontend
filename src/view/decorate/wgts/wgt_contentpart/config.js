import { pickBy } from '@/utils'
import NavItem from './nav-item.vue'
import CompOuter from '../../comps/comp_outer.vue'
import CompStyle from '../../comps/comp_style.vue'

export default {
  name: 'contentpart',
  setting: [
    {
      label: '分区交互',
      key: 'animate',
      component: 'radiobutton',
      options: [
        { name: '分区纵向', label: 'vertical' },
        { name: '分区切屏', label: 'horizontal' }
      ],
      value: 'vertical',
      module: ''
    },
    {
      label: '导航可吸顶',
      key: 'navSticky',
      component: 'switch',
      value: false
    },
    {
      label: '导航栏背景',
      key: 'navbg',
      component: function (h, { key }) {
        return <CompOuter v-model={this.value[key]} />
      },
      value: { color: '#ffffff', image: '' }
    },
    {
      label: '导航栏内边距',
      key: 'navpadded',
      component: function (h, { key }) {
        return (
          <CompStyle
            showBgsetting={false}
            v-model={this.value[key]}
            uuid={this.value.uuid}
            showLabel={false}
          />
        )
      },
      value: {
        paddedt: 0,
        paddedb: 0,
        paddedl: 0,
        paddedr: 0
      }
    },
    {
      label: '导航项区域背景',
      key: 'navitembg',
      component: function (h, { key }) {
        return <CompOuter v-model={this.value[key]} />
      },
      value: { color: '#ffffff', image: '' }
    },
    {
      label: '导航项区域内边距',
      key: 'navitempadded',
      component: function (h, { key }) {
        return (
          <CompStyle
            showBgsetting={false}
            v-model={this.value[key]}
            uuid={this.value.uuid}
            showLabel={false}
          />
        )
      },
      value: {
        paddedt: 8,
        paddedb: 8,
        paddedl: 0,
        paddedr: 0
      }
    },
    {
      label: '导航项区域圆角',
      key: 'navitemradius',
      component: 'number',
      value: 0
    },
    {
      label: '导航项高度',
      key: 'navitemheight',
      component: 'number',
      value: 40
    },
    {
      label: '导航项内间距',
      key: 'navitemmargin',
      component: function (h, { key }) {
        return (
          <CompStyle
            showBgsetting={false}
            v-model={this.value[key]}
            uuid={this.value.uuid}
            showLabel={false}
            showTop={false}
            showBottom={false}
            showLeft={false}
            showRight={false}
            showLR={true}
          />
        )
      },
      value: {
        paddedlr: 18
      }
    },
    {
      label: '导航左滑示意图',
      key: 'leftimgUrl',
      component: function (h, { key }) {
        return (
          <div class={'sp-image-picker'}>
            <SpImagePicker v-model={this.value[key]} size='small' />
          </div>
        )
      },
      value: ''
    },
    {
      label: '导航右滑示意图',
      key: 'rightimgUrl',
      component: function (h, { key }) {
        return (
          <div class={'sp-image-picker'}>
            <SpImagePicker v-model={this.value[key]} size='small' />
          </div>
        )
      },
      value: ''
    },
    {
      label: '导航项选中底线',
      key: 'navitemborder',
      component: 'switch',
      value: false
    },
    {
      label: '',
      key: 'data',
      component: function (h, { key }) {
        return <NavItem v-model={this.value[key]} />
      },
      value: []
    }
  ],
  transformIn: (v, wgtList) => {
    const {
      name,
      base,
      data: { data },
      uuid
    } = v
    return {
      name,
      uuid,
      ...base,
      data: data.map(({ children, ...item }) => {
        return {
          ...item,
          children: children?.map((ele) => {
            const { transformIn } =
              wgtList.find((wgt) => wgt.name.toLowerCase() == ele.name.toLowerCase())?.config || {}
            if (transformIn) {
              return { ...transformIn(ele, wgtList), wgtName: ele.wgtName }
            }
            return { ...ele, wgtName: ele.wgtName }
          })
        }
      })
    }
  },
  transformOut: (v, wgtList) => {
    return pickBy(v, {
      name: 'name',
      base: (v) => {
        return pickBy(v, {
          animate: 'animate',
          navSticky: 'navSticky',
          navbg: 'navbg',
          navpadded: 'navpadded',
          navitembg: 'navitembg',
          navitempadded: 'navitempadded',
          navitemheight: 'navitemheight',
          navitemmargin: 'navitemmargin',
          leftimgUrl: 'leftimgUrl',
          rightimgUrl: 'rightimgUrl',
          navitemborder: 'navitemborder',
          navitemradius: 'navitemradius'
        })
      },
      data: (v) => {
        return pickBy(v, {
          data: ({ data }) => {
            return data.map(({ children, ...item }) => {
                const _children = children?.map((ele) => {
                  const { transformOut } = wgtList.find(
                    (wgt) => wgt.name.toLowerCase() == ele.name.toLowerCase()
                  ).config || {}
                  if (transformOut) {
                    return { ...transformOut(ele, wgtList), wgtName: ele.wgtName }
                  }
                  return { ...ele, wgtName: ele.wgtName }
                })
                return {
                  ...item,
                  children: children ? _children : []
                }
            })
          }
        })
      },
    })
  }
}
