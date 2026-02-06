import { pickBy } from '@/utils'
import NavItem from './nav-item.vue'
import { transformInBase, createTransformOutBase } from '../../comps/transform-utils'

const config = {
  name: 'locationModule',
  setting: [
    {
      label: '导航可吸顶',
      group: '内容设置',
      key: 'navSticky',
      component: 'radiobutton',
      options: [
        { name: '是', label: true },
        { name: '否', label: false }
      ],
      value: true
    },
    {
      label: '圆角',
      group: '导航项区域设置',
      key: 'navitemradius',
      component: 'number',
      value: 0,
      module: 'navitemarea'
    },
    {
      label: '高度',
      group: '导航项设置',
      key: 'navitemheight',
      component: 'number',
      value: 40
    },
    {
      label: '左右内间距',
      group: '导航项设置',
      key: 'navitemmargin',
      component: 'number',
      value: 0
    },
    {
      label: '导航左滑图片',
      group: '导航项设置',
      key: 'leftimgUrl',
      component: function (h, { key }) {
        return (
          <div class={'sp-image-picker-contentpart'}>
            <SpImagePicker v-model={this.value[key]} size='mini' />
          </div>
        )
      },
      value: ''
    },
    {
      label: '导航右滑图片',
      group: '导航项设置',
      key: 'rightimgUrl',
      component: function (h, { key }) {
        return (
          <div class={'sp-image-picker-contentpart'}>
            <SpImagePicker v-model={this.value[key]} size='mini' />
          </div>
        )
      },
      value: ''
    },
    {
      label: '选中底线',
      group: '导航项设置',
      key: 'navitemborder',
      component: 'radiobutton',
      options: [
        { name: '是', label: 'true' },
        { name: '否', label: 'false' }
      ],
      value: false
    },
    {
      label: '底线颜色',
      group: '导航项设置',
      key: 'navitembordercolor',
      component: 'color',
      value: '#ffffff',

      isShow: function () {
        return this.value.navitemborder
      }
    },
    {
      label: '',
      group: '数据设置',
      key: 'data',
      component: function (h, { key }) {
        return <NavItem v-model={this.value[key]} />
      },
      value: [],
      module: 'navdata'
    }
  ],
  transformIn: (v, wgtList) => {
    const {
      name,
      base,
      data: { data },
      uuid,
      meber_tags,
      no_meber_tags,
      tagsType
    } = v

    // 使用公共函数处理 base 中的样式数据转换（将 rpx 转换为 px）
    const transformedBase = transformInBase(base, ['outerMargin', 'navitemarea'])

    // 将旧的配置格式转换为新格式（兼容旧数据）
    const { navbg, navpadded, navitembg, navitempadded, ...restBase } = transformedBase || {}

    // 转换 navbg + navpadded 为 outerMargin（如果还没有 outerMargin）
    const outerMargin =
      transformedBase?.outerMargin ||
      (navbg || navpadded
        ? {
            paddedt: (navpadded?.paddedt || 0) / 2,
            paddedb: (navpadded?.paddedb || 0) / 2,
            paddedl: (navpadded?.paddedl || 0) / 2,
            paddedr: (navpadded?.paddedr || 0) / 2,
            bgType: navbg?.image ? 'pic' : 'color',
            bgColor: navbg?.color || '#ffffff',
            bgPic: navbg?.image || '',
            startColor: '#ffffff',
            endColor: '#ffffff'
          }
        : {})

    // 转换 navitembg + navitempadded 为 navitemarea（如果还没有 navitemarea）
    const navitemarea =
      transformedBase?.navitemarea ||
      (navitembg || navitempadded
        ? {
            paddedt: (navitempadded?.paddedt || 0) / 2,
            paddedb: (navitempadded?.paddedb || 0) / 2,
            paddedl: (navitempadded?.paddedl || 0) / 2,
            paddedr: (navitempadded?.paddedr || 0) / 2,
            bgType: navitembg?.image ? 'pic' : 'color',
            bgColor: navitembg?.color || 'transparent',
            bgPic: navitembg?.image || '',
            startColor: '#ffffff',
            endColor: '#ffffff'
          }
        : {})

    // 处理 navitemheight 和 navitemmargin 的单位转换（从 rpx 转换为 px）
    const processedRestBase = { ...restBase }
    if (processedRestBase.navitemheight !== undefined) {
      processedRestBase.navitemheight = processedRestBase.navitemheight / 2
    }
    if (processedRestBase.navitemmargin !== undefined) {
      processedRestBase.navitemmargin = processedRestBase.navitemmargin / 2
    }

    return {
      name,
      uuid,
      ...processedRestBase,
      outerMargin,
      navitemarea,
      tags: {
        type: tagsType || '2',
        meber_tags: meber_tags || [],
        no_meber_tags: no_meber_tags || []
      },
      data: data.map(
        ({
          children,
          no_meber_tags = [],
          meber_tags = [],
          tagsType,
          configType = 'widget',
          ...item
        }) => {
          let _children = children
          if (configType == 'widget') {
            _children = children?.map((ele) => {
              const { transformIn } =
                wgtList.find((wgt) => wgt.name.toLowerCase() == ele.name.toLowerCase())?.config ||
                {}
              if (transformIn) {
                return { ...transformIn(ele, wgtList), wgtName: ele.wgtName }
              }
              return { ...ele, wgtName: ele.wgtName }
            })
          }
          return {
            ...item,
            tags: {
              type: tagsType || '2',
              no_meber_tags,
              meber_tags
            },
            configType,
            children: _children
          }
        }
      )
    }
  },
  transformOut: (v, wgtList) => {
    return pickBy(v, {
      name: 'name',
      meber_tags: 'tags.meber_tags',
      no_meber_tags: 'tags.no_meber_tags',
      tagsType: 'tags.type',
      base: (v) => {
        // 使用公共函数处理 base 中的样式数据转换（将 px 转换为 rpx）
        const baseData = createTransformOutBase(
          ['outerMargin', 'navitemarea'],
          ['outerMargin', 'navitemarea']
        )(v)

        // 将新的配置结构转换为旧格式以保持兼容
        const outerMargin = baseData.outerMargin || {}
        const navitemarea = baseData.navitemarea || {}

        // 提取其他 base 字段
        const otherBaseData = pickBy(v, {
          wgtCustName: 'wgtCustName',
          track: 'track',
          navSticky: 'navSticky',
          navitemheight: (v) => (v.navitemheight || 0) * 2,
          navitemmargin: (v) => (v.navitemmargin || 0) * 2,
          leftimgUrl: 'leftimgUrl',
          rightimgUrl: 'rightimgUrl',
          navitemborder: 'navitemborder',
          navitemradius: 'navitemradius',
          navitembordercolor: 'navitembordercolor'
        })

        return {
          ...otherBaseData,
          navitemarea,
          outerMargin
        }
      },
      data: (v) => {
        return pickBy(v, {
          data: ({ data }) => {
            return data.map(({ children, ...item }) => {
              const { tags, configType, ...rest } = item
              let _children = children
              if (configType == 'widget') {
                _children = children?.map((ele) => {
                  const { transformOut } =
                    wgtList.find((wgt) => wgt.name.toLowerCase() == ele.name.toLowerCase())
                      ?.config || {}
                  if (transformOut) {
                    return { ...transformOut(ele, wgtList), wgtName: ele.wgtName }
                  }
                  return { ...ele, wgtName: ele.wgtName }
                })
              }
              return {
                ...rest,
                no_meber_tags: tags.no_meber_tags || [],
                meber_tags: tags.meber_tags || [],
                tagsType: tags.type,
                configType,
                children: children ? _children : []
              }
            })
          }
        })
      }
    })
  }
}

// 自动处理 compStyle 配置（初始化全局处理函数）
import '../../comps/configsetting'
export default typeof globalThis !== 'undefined' && globalThis.__processConfig__
  ? globalThis.__processConfig__(config)
  : config
