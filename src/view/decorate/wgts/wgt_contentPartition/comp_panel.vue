<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" src="../../attr_panel.scss"></style>

<script>
import { i18n } from '@/i18n'
import { isFunction } from '@/utils'
import CompLayoutSelector from '../../comps/comp_layout_selector.vue'
import CompPickerLink from './comp_pickerLink'

// 商品挂件列表
const GOODS_WIDGETS = ['speedkill', 'group', 'hotranking', 'ranking', 'goods']

export default {
  name: 'CompPanel',
  components: {
    CompLayoutSelector,
    CompPickerLink
  },
  props: {
    info: [Object, Array],
    value: [Object, Number, String, Boolean]
  },
  data() {
    return {
      compValue: null,
      activeTab: 'content' // 'content' 或 'style'
    }
  },
  created() {
    this.compValue = this.value
  },
  methods: {
    onCompChange() {
      this.$emit('input', this.compValue)
    },
    _renderSelect({ key, options, onchange = () => {} }) {
      return (
        <el-select v-model={this.value[key]} size='mini' onChange={(e) => onchange(e, this)}>
          {options.map((op) => (
            <el-option label={op.label} value={op.value} />
          ))}
        </el-select>
      )
    },

    _renderTextArea({ key, rows }) {
      return <el-input type='textarea' v-model={this.value[key]} rows={rows} size='small' />
    },

    _renderInput({ key }) {
      return <el-input type='text' v-model={this.value[key]} size='small' />
    },

    _renderColor({ key, value: initValue }) {
      const displayColor = this.value[key]
      return (
        <div class='el-color-picker-wrap'>
          <span class='color-code'>{displayColor}</span>
          <div class='color-controls-item'>
            <el-button
              class='button-reset'
              type='text'
              on-click={() => {
                this.value[key] = ''
              }}
            >
              {i18n.t('a6226f20.4b9c32')}
            </el-button>
            <div class='color-swatch' style={{ backgroundColor: displayColor }}>
              <el-color-picker v-model={this.value[key]} size='small' />
            </div>
          </div>
        </div>
      )
    },

    _renderNumber({ key, min, max, step }) {
      return (
        <el-input-number v-model={this.value[key]} size='small' min={min} max={max} step={step} />
      )
    },
    _renderSwitch({ key }) {
      return <el-switch v-model={this.value[key]} />
    },
    _renderSlider({ key, showInput = false }) {
      return <el-slider v-model={this.value[key]} show-input={showInput} />
    },
    _renderRadio({ key, options }) {
      return (
        <el-radio-group v-model={this.value[key]}>
          {options.map((op) => (
            <el-radio label={op.label}>{op.name}</el-radio>
          ))}
        </el-radio-group>
      )
    },
    _renderRadioButton({ key, options, onchange = () => {} }) {
      return (
        <el-radio-group v-model={this.value[key]} size='mini' onChange={(e) => onchange(e, this)}>
          {options.map((op) => (
            <el-radio-button label={op.label}>{op.name}</el-radio-button>
          ))}
        </el-radio-group>
      )
    },
    _renderPickerLink({ key }) {
      return <CompPickerLink v-model={this.value[key]} />
    },
    _renderCheckbox({ key, options, min = 0, onchange = () => {} }) {
      return (
        <el-checkbox-group min={min} v-model={this.value[key]} onChange={(e) => onchange(e, this)}>
          {options.map((op) => (
            <el-checkbox label={op.label} key={op.label}>
              {op.name}
            </el-checkbox>
          ))}
        </el-checkbox-group>
      )
    }
  },
  computed: {
    // 样式相关的配置项 key 列表
    styleKeys() {
      return [
        'outerMargin',
        'innerPadding',
        'navpadded',
        'navitempadded',
        'navitemmargin',
        'outerBackground',
        'innerBackground',
        'navbg',
        'navitembg',
        'titleColor',
        'titleBackgroundImage',
        'bgColor',
        'bgPic',
        'backgroundImg',
        'newNavigateStyle',
        'newPageBackgroundStyle',
        'limitedTimeBackground',
        'navitembordercolor',
        'navitemradius',
        'navitemheight',
        'interval',
        'padded',
        'rounded',
        'shape',
        'dotColor',
        'itemPadded',
        'content',
        'animation',
        'imgHeight',
        'imgWidth',
        'imgUrl',
        'dot',
        'dotCover',
        'dotLocation',
        'shape',
        'height',
        'navitemborder',
        'leftimgUrl',
        'rightimgUrl',
        'navitemarea',
        'autoplay',
        'searchButtonColor',
        'showSearchButton'
      ]
    },
    // 将配置项按分组组织
    groupedSettings() {
      const { setting } = this.info
      if (!setting || !Array.isArray(setting))
        return { content: [], style: [], contentUngrouped: [], styleUngrouped: [] }

      const contentGroups = {}
      const styleGroups = {}
      const contentUngrouped = []
      const styleUngrouped = []

      setting.forEach((item) => {
        // 判断是否为样式设置：1. key 在 styleKeys 中，2. group 为 '样式设置'
        const isStyle =
          this.styleKeys.includes(item.key) ||
          item.group === '样式设置' ||
          item.group === 'e7f2a1b3.8b2d10'

        // 如果没有 group，不进行分组，但需要展示
        if (!item.group || !item.group.trim()) {
          if (isStyle) {
            styleUngrouped.push(item)
          } else {
            contentUngrouped.push(item)
          }
          return
        }

        const group = item.group
        const targetGroups = isStyle ? styleGroups : contentGroups

        if (!targetGroups[group]) {
          targetGroups[group] = []
        }
        targetGroups[group].push(item)
      })

      return {
        content: Object.entries(contentGroups).map(([groupName, items]) => ({ groupName, items })),
        style: Object.entries(styleGroups).map(([groupName, items]) => ({ groupName, items })),
        contentUngrouped,
        styleUngrouped
      }
    },
    // 内容设置（兼容旧版本，如果没有分组）
    contentSettings() {
      const { setting } = this.info
      if (!setting || !Array.isArray(setting)) return []
      return setting.filter((item) => {
        // 不在样式列表中的都是内容设置
        return !this.styleKeys.includes(item.key)
      })
    },
    // 样式设置（兼容旧版本，如果没有分组）
    styleSettings() {
      const { setting } = this.info
      if (!setting || !Array.isArray(setting)) return []
      return setting.filter((item) => {
        // 在样式列表中的都是样式设置
        return this.styleKeys.includes(item.key)
      })
    },
    // 判断是否为商品挂件
    isGoodsWidget() {
      const widgetName = this.value?.name || ''
      return GOODS_WIDGETS.includes(widgetName)
    },
    // 布局值
    layoutValue: {
      get() {
        return this.value?.goodsLayout || 'default'
      },
      set(val) {
        this.$set(this.value, 'goodsLayout', val)
      }
    }
  },
  render(h) {
    const { wgtName } = this.info

    const renderComp = (item) => {
      if (isFunction(item.component)) {
        return item.component.call(this, h, item)
      }

      const renderItem = {
        textarea: this._renderTextArea,
        input: this._renderInput,
        color: this._renderColor,
        number: this._renderNumber,
        'select': this._renderSelect,
        'radio': this._renderRadio,
        'radiobutton': this._renderRadioButton,
        'pickerLink': this._renderPickerLink,
        'switch': this._renderSwitch,
        'slider': this._renderSlider
      }

      if (!renderItem[item.component]) {
        console.warn(`Unknown component type: ${item.component} for key: ${item.key}`)
        return null
      }

      return renderItem[item.component](item)
    }

    const renderSettings = (settings) => {
      return settings.map((item, index) => {
        const hasLabel = item.label && item.label.trim() !== ''
        // 检查是否包含 SpImagePicker（通过 key 或 component 判断）
        const hasImagePicker =
          item.key === 'titleBackgroundImage' ||
          (typeof item.component === 'function' &&
            item.component.toString().includes('SpImagePicker'))
        return (
          <div
            class={[
              'attr-panel-cell',
              {
                'is-show': typeof item.isShow != 'undefined' ? item.isShow.call(this, item) : true,
                'no-label': !hasLabel,
                'has-image-picker': hasImagePicker
              }
            ]}
          >
            {hasLabel && <div class='cell-label'>{item.label}</div>}
            <div class='cell-value'>
              <div class='cell-value-content'>{renderComp(item)}</div>
              {(item.tip || item.tips) && (
                <div class='cell-value-tip' domPropsInnerHTML={item.tip || item.tips} />
              )}
            </div>
          </div>
        )
      })
    }

    const renderGroupedSettings = (groups) => {
      if (groups.length === 0) return null

      return groups.map(({ groupName, items }) => (
        <div class='setting-group' key={groupName}>
          <div class='setting-group-header'>{groupName}</div>
          <div class='setting-group-content'>{renderSettings(items)}</div>
        </div>
      ))
    }

    // 检查是否有分组
    const hasContentGroups = this.groupedSettings.content.length > 0
    const hasStyleGroups = this.groupedSettings.style.length > 0

    return (
      <div class='attr-panel'>
        {/* 商品挂件布局选择器 */}
        {this.isGoodsWidget && (
          <div class='layout-selector-wrapper'>
            <div class='layout-selector-label'>{i18n.t('e7f2a1b3.9c3e21')}</div>
            <CompLayoutSelector
              value={this.layoutValue}
              on-input={(val) => {
                this.layoutValue = val
              }}
              options={[
                { label: i18n.t('e7f2a1b3.ad4f32'), value: 'default' },
                { label: i18n.t('e7f2a1b3.be5f43'), value: 'one' },
                { label: i18n.t('e7f2a1b3.cf6a54'), value: 'two' },
                { label: i18n.t('e7f2a1b3.d07b65'), value: 'three' }
              ]}
            />
          </div>
        )}
        <el-tabs v-model={this.activeTab} class='attr-panel-tabs'>
          <el-tab-pane label={i18n.t('e7f2a1b3.7a1c09')} name='content'>
            <div class='attr-panel-content'>
              {hasContentGroups && renderGroupedSettings(this.groupedSettings.content)}
              {this.groupedSettings.contentUngrouped.length > 0 &&
                renderSettings(this.groupedSettings.contentUngrouped)}
              {!hasContentGroups &&
                this.groupedSettings.contentUngrouped.length === 0 &&
                renderSettings(this.contentSettings)}
            </div>
          </el-tab-pane>
          <el-tab-pane label={i18n.t('e7f2a1b3.8b2d10')} name='style'>
            <div class='attr-panel-content'>
              {hasStyleGroups && renderGroupedSettings(this.groupedSettings.style)}
              {this.groupedSettings.styleUngrouped.length > 0 &&
                renderSettings(this.groupedSettings.styleUngrouped)}
              {!hasStyleGroups &&
                this.groupedSettings.styleUngrouped.length === 0 &&
                renderSettings(this.styleSettings)}
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    )
  }
}
</script>
