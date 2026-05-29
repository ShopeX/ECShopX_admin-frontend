/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { i18n } from '@/i18n'
import { pickBy, isObject } from '@/utils'
import AttrItem from './attr-item'
import AttrFunctionArea from './attr-function-area'

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const scene = urlParams.get('scene') || '1001'

const config = {
  name: 'page',
  setting: [
    {
      group: i18n.t('f44e2c51.eeb8e8'),
      label: i18n.t('f44e2c51.d83110'),
      key: 'isImmersive',
      component: 'switch',
      value: false
    },
    {
      group: i18n.t('f44e2c51.304e64'),
      label: i18n.t('f44e2c51.231901'),
      key: 'newNavigateStyle',
      component: function (h, { key }) {
        return <AttrItem v-model={this.value[key]} />
      },
      value: {
        color: '#fff',
        image: ''
      }
    },
    {
      group: i18n.t('f44e2c51.304e64'),
      label: i18n.t('f44e2c51.c8d9e0'),
      key: 'immersiveScrollBgColor',
      component: 'color',
      value: '#ffffff',
      isShow: function () {
        return scene === '1008' && this.value.isImmersive === true
      }
    },
    {
      group: i18n.t('f44e2c51.eeb8e8'),
      label: i18n.t('f44e2c51.35b115'),
      key: 'titleStyle',
      component: 'radiobutton',
      options: [
        { name: i18n.t('f44e2c51.006e01'), label: '0' },
        { name: i18n.t('f44e2c51.e5f71f'), label: '3' },
        { name: i18n.t('f44e2c51.b78454'), label: '1' },
        { name: i18n.t('f44e2c51.20def7'), label: '2' }
      ],
      value: '1'
    },
    {
      group: i18n.t('f44e2c51.53f200'),
      label: i18n.t('f44e2c51.94e391'),
      key: 'titleColor',
      component: 'color',
      value: '#000',
      isShow: function () {
        return this.value.titleStyle == '1' // 只在"页面名称"时显示
      },
      tip: 'f44e2c51.a7a33e'
    },
    {
      group: i18n.t('f44e2c51.53f200'),
      label: '',
      key: 'titleBackgroundImage',
      component: function (h, { key }) {
        return <SpImagePicker v-model={this.value[key]} size='small' />
      },
      value: '',
      isShow: function () {
        return this.value.titleStyle == '2'
      },
      tip: 'f44e2c51.7ffc9e'
    },
    {
      group: i18n.t('f44e2c51.53f200'),
      label: i18n.t('f44e2c51.172f1a'),
      key: 'showSearchButton',
      component: 'switch',
      value: true,
      isShow: function () {
        return this.value.titleStyle == '3' // 只在"搜索"时显示
      }
    },
    {
      group: i18n.t('f44e2c51.53f200'),
      label: i18n.t('f44e2c51.351201'),
      key: 'searchButtonColor',
      component: function (h, { key }) {
        const vm = this
        // 确保 searchButtonColor 对象存在
        if (!vm.value[key]) {
          vm.$set(vm.value, key, { bgColor: '#000000', textColor: '#FFFFFF' })
        }
        const bgColor = vm.value[key].bgColor
        const textColor = vm.value[key].textColor

        return (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}
            >
              <span style={{ fontSize: '12px', color: '#999' }}>{i18n.t('f44e2c51.b53d6d')}</span>
              <el-color-picker
                value={bgColor}
                size='small'
                onChange={(color) => {
                  if (!vm.value[key]) {
                    vm.$set(vm.value, key, {})
                  }
                  vm.$set(vm.value[key], 'bgColor', color)
                }}
              />
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}
            >
              <span style={{ fontSize: '12px', color: '#999' }}>{i18n.t('f44e2c51.ca746b')}</span>
              <el-color-picker
                value={textColor}
                size='small'
                onChange={(color) => {
                  if (!vm.value[key]) {
                    vm.$set(vm.value, key, {})
                  }
                  vm.$set(vm.value[key], 'textColor', color)
                }}
              />
            </div>
          </div>
        )
      },
      value: {
        bgColor: '#FF6B35',
        textColor: '#FFFFFF'
      },
      isShow: function () {
        return this.value.titleStyle == '3' && this.value.showSearchButton // 只在"搜索"且"展示搜索按钮"开启时显示
      }
    },
    {
      group: i18n.t('f44e2c51.eeb8e8'),
      label: i18n.t('f44e2c51.41b6e1'),
      key: 'pTitleHotSetting',
      component: function (h, { key }) {
        return <AttrFunctionArea v-model={this.value[key]} />
      },
      value: {
        type: 'none',
        hotzone: { imgUrl: '', data: [] }
      },
      tip: scene != '1001' ? 'f44e2c51.5bc6b6' : 'f44e2c51.37a58e'
    },
    {
      group: i18n.t('f44e2c51.eeb8e8'),
      label: i18n.t('f44e2c51.1dff74'),
      key: 'newPageBackgroundStyle',
      component: function (h, { key }) {
        return <AttrItem v-model={this.value[key]} />
      },
      value: {
        color: '#f5f5f5',
        image: ''
      },
      tip: 'f44e2c51.7b8435'
    }
    // {
    //   label: '',
    //   key: 'pageBackgroundColor',
    //   component: 'color',
    //   value: '#f5f5f5',
    //   isShow: function () {
    //     return this.value.pageBackgroundStyle == '1'
    //   }
    // },
    // {
    //   label: '',
    //   key: 'pageBackgroundImage',
    //   component: function (h, { key }) {
    //     return <SpImagePicker v-model={this.value[key]} size='small' />
    //   },
    //   value: '',
    //   isShow: function () {
    //     return this.value.pageBackgroundStyle == '2'
    //   }
    // },
  ],
  transformIn: (v) => {
    const { name, base, track, tagsType, meber_tags, no_meber_tags } = v
    let {
      navigateStyle,
      navigateBackgroundColor,
      navigateBackgroundImage,
      titleStyle,
      titleColor,
      titleBackgroundImage,
      pageBackgroundStyle,
      pageBackgroundColor,
      pageBackgroundImage,
      pTitleHotSetting = { type: 'none', hotzone: { imgUrl: '', data: [] } },
      isImmersive,
      immersiveScrollBgColor,
      showSearchButton,
      searchButtonColor
    } = base || {}
    // 兼容旧数据格式：如果 pTitleHotSetting 直接是热区图对象，转换为新格式
    if (pTitleHotSetting && pTitleHotSetting.imgUrl !== undefined && !pTitleHotSetting.type) {
      const hasHotzoneContent =
        Boolean(pTitleHotSetting.imgUrl) ||
        (Array.isArray(pTitleHotSetting.data) && pTitleHotSetting.data.length > 0)
      pTitleHotSetting = {
        type: hasHotzoneContent ? 'hotzone' : 'none',
        hotzone: { imgUrl: pTitleHotSetting.imgUrl || '', data: pTitleHotSetting.data || [] }
      }
    } else if (!pTitleHotSetting || !pTitleHotSetting.type) {
      pTitleHotSetting = {
        type: 'none',
        hotzone: { imgUrl: '', data: [] }
      }
    }
    if (isObject(navigateBackgroundImage)) {
      const { url } = newNavigateStyle?.image
      navigateBackgroundImage = url
    }
    if (isObject(titleBackgroundImage)) {
      const { url } = titleBackgroundImage
      titleBackgroundImage = url
    }

    if (isObject(pageBackgroundImage)) {
      const { url } = newPageBackgroundStyle?.image
      pageBackgroundImage = url
    }

    const newNavigateStyle = {
      color: navigateBackgroundColor,
      image: navigateBackgroundImage
    }
    const newPageBackgroundStyle = {
      color: pageBackgroundColor,
      image: pageBackgroundImage
    }
    return {
      id: v?.id,
      name,
      ...base,
      navigateStyle, // 兼容旧版本
      titleStyle,
      titleColor,
      titleBackgroundImage,
      pageBackgroundStyle, // 兼容旧版本
      pageBackgroundImage,
      newNavigateStyle,
      newPageBackgroundStyle,
      pTitleHotSetting,
      isImmersive,
      immersiveScrollBgColor: immersiveScrollBgColor || '#ffffff',
      showSearchButton: showSearchButton !== undefined ? showSearchButton : true,
      searchButtonColor,
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
        return pickBy(v, {
          navigateStyle: 'navigateStyle',
          navigateBackgroundColor: 'newNavigateStyle.color',
          navigateBackgroundImage: 'newNavigateStyle.image',
          titleStyle: 'titleStyle',
          titleColor: 'titleColor',
          titleBackgroundImage: 'titleBackgroundImage',
          showSearchButton: 'showSearchButton',
          searchButtonColor: 'searchButtonColor',
          pageBackgroundStyle: 'pageBackgroundStyle',
          pageBackgroundColor: 'newPageBackgroundStyle.color',
          pageBackgroundImage: 'newPageBackgroundStyle.image',
          isImmersive: 'isImmersive',
          immersiveScrollBgColor: 'immersiveScrollBgColor',
          pTitleHotSetting: 'pTitleHotSetting'
        })
      },
      track: 'track',
      tags: 'tags',
      tagsType: 'tags.type',
      meber_tags: 'tags.meber_tags',
      no_meber_tags: 'tags.no_meber_tags'
    })
  }
}

export default config
