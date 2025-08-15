<style lang="scss" src="./attr_panel.scss"></style>

<script>
import { isFunction } from '@/utils'
export default {
  name: 'AttrPanel',
  props: {
    info: [Object, Array],
    value: [Object, Number, String, Boolean]
  },
  data() {
    return {
      compValue: null
    }
  },
  created() {
    this.compValue = this.value
  },
  methods: {
    onCompChange() {
      this.$emit('input', this.compValue)
    },

    _renderSelect({ key, options }) {
      return (
        <el-select v-model={this.value[key]} size='small'>
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
      // console.log('_renderColor:', this)
      return (
        <div class='el-color-picker-wrap'>
          <el-color-picker v-model={this.value[key]} size='small' />
          <el-button
            class='button-reset'
            type='text'
            on-click={() => {
              this.value[key] = initValue
            }}
          >
            重置
          </el-button>
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
      return (
        <el-slider v-model={this.value[key]} show-input={showInput} />
      )
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
    _renderRadioButton({ key, options, onchange = () => { } }) {
      return (
        <el-radio-group v-model={this.value[key]} size="mini" onChange={(e) => onchange(e, this)}>
          {options.map((op) => (
            <el-radio-button label={op.label}>{op.name}</el-radio-button>
          ))}
        </el-radio-group>
      )
    },
    _renderCheckbox({ key, options, min = 0, onchange = () => { } }) {
      return (
        <el-checkbox-group min={min} v-model={this.value[key]} onChange={(e) => onchange(e, this)}>
          {options.map((op) => (
            <el-checkbox label={op.label} key={op.label}>{op.name}</el-checkbox>
          ))}
        </el-checkbox-group>
      )
    },
  },
  render(h) {
    const { wgtName, setting } = this.info

    const renderComp = (item) => {
      if (isFunction(item.component)) {
        return item.component.call(this, h, item)
        // return <el-input v-model={this.value[item.key]} />
      }

      const renderItem = {
        'textarea': this._renderTextArea,
        'input': this._renderInput,
        'color': this._renderColor,
        'number': this._renderNumber,
        // 'text': this._renderText,
        'select': this._renderSelect,
        'radio': this._renderRadio,
        'radiobutton': this._renderRadioButton,
        // 'checkbox': this._renderCheckbox,
        // 'table': this._renderTable,
        // 'richText': this._renderRichText,
        // 'image': this._renderImage,
        'switch': this._renderSwitch,
        'slider': this._renderSlider
      }
      return renderItem[item.component](item)
    }

    return (
      <div class='attr-panel'>
        {setting.map((item, index) => (
          <div
            class={[
              'attr-panel-cell',
              {
                'is-show': typeof item.isShow != 'undefined' ? item.isShow.call(this, item) : true
              }
            ]}
          >
            <div class='cell-label'>{item.label}</div>
            <div class='cell-value'>
              <div class='cell-value-content'>{renderComp(item)}</div>
              {item.tip && <div class='cell-value-tip' domPropsInnerHTML={item.tip} />}
            </div>
          </div>
        ))}
      </div>
    )
  }
}
</script>
