import { pickBy } from '@/utils'
import AttrHotSetting from './attr-hotsetting'
import { transformInBase, createTransformOutBase } from '../../comps/transform-utils'

const config = {
  name: 'imgHotzone',
  setting: [
    {
      group: '风格设置',
      label: '展示形式',
      key: 'animation',
      component: 'radiobutton',
      options: [
        { name: '纵向排列', label: 'horizontal' },
        { name: '横向排列', label: 'vertical' }
      ],
      tips: '横向排列:高度固定，宽度自适应, 超出屏幕滑动',
      value: 'horizontal'
    },
    {
      group: '风格设置',
      label: '图片高度',
      key: 'imgHeight',
      component: function (h, { key }) {
        return (
          <el-input-number
            value={this.value[key]}
            on-input={(val) => {
              this.value[key] = val
              // 当 animation === 'vertical' 且图片已选择时，重新计算图片宽高 获取高度的意义就为了在小程序中可以占位准确
              if (
                this.value.animation === 'vertical' &&
                this.value.data?.imgUrl &&
                this.value.data?.imgWidth &&
                this.value.data?.imgHeight
              ) {
                const aspectRatio = this.value.data.imgWidth / this.value.data.imgHeight
                const newImgHeight = val
                const newImgWidth = Math.round(newImgHeight * aspectRatio)
                this.$set(this.value.data, 'imgHeight', newImgHeight)
                this.$set(this.value.data, 'imgWidth', newImgWidth)
              }
            }}
            size='small'
            min={0}
          />
        )
      },
      value: 156,
      isShow: function (v) {
        return this.value.animation === 'vertical'
      }
    },
    {
      group: '风格设置',
      label: '热区设置',
      key: 'data',
      component: function (h, { key }) {
        return <AttrHotSetting v-model={this.value[key]} />
      },
      value: { imgUrl: '', data: [] }
    }
    // outerMargin 会自动添加，无需手动写
  ],
  transformIn: (v) => {
    const {
      name,
      base,
      config: { imgUrl, imgWidth, imgHeight },
      data,
      track,
      tagsType,
      meber_tags,
      no_meber_tags
    } = v
    // 使用公共函数处理 base 中的样式数据转换
    const transformedBase = transformInBase(base, ['outerMargin'])

    // 将 rpx 转换为 px（除以2）- hotzone 特有的转换
    const convertedImgWidth = imgWidth !== undefined && imgWidth !== null ? imgWidth / 2 : 0
    const convertedImgHeight = imgHeight !== undefined && imgHeight !== null ? imgHeight / 2 : 0
    const convertedBaseImgHeight =
      base?.imgHeight !== undefined && base?.imgHeight !== null
        ? base.imgHeight / 2
        : base?.imgHeight

    return {
      name,
      ...transformedBase,
      imgHeight: convertedBaseImgHeight,
      data: {
        imgUrl,
        imgWidth: convertedImgWidth,
        imgHeight: convertedImgHeight,
        data
      },
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
      name: 'name',
      base: (v) => {
        // 使用公共函数处理 outerMargin 转换
        const baseData = createTransformOutBase(
          ['animation', 'imgHeight', 'outerMargin'],
          ['outerMargin']
        )(v)

        // 将 base.imgHeight 转换为 rpx（乘以2）- hotzone 特有的转换
        if (baseData.imgHeight !== undefined && baseData.imgHeight !== null) {
          baseData.imgHeight = baseData.imgHeight * 2
        }
        return baseData
      },
      config: ({ data }) => {
        if (!data) return {}
        // 将 imgWidth 和 imgHeight 转换为 rpx（乘以2）
        const imgWidth =
          data.imgWidth !== undefined && data.imgWidth !== null ? data.imgWidth * 2 : 0
        const imgHeight =
          data.imgHeight !== undefined && data.imgHeight !== null ? data.imgHeight * 2 : 0
        return {
          imgUrl: data.imgUrl || '',
          imgWidth,
          imgHeight
        }
      },
      data: 'data.data',
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
