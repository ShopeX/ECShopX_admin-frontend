<style lang="scss" src="./comp_panel.scss"></style>

<script>
import { isFunction } from '@/utils'
import CompPickerLink from './comp_pickerLink'
export default {
  name: 'CompPanel',
  props: {
    info: [Object, Array],
    value: [Object, Number, String, Boolean]
  },
  data() {
    return {
      compValue: null
    }
  },
  components: {
    CompPickerLink
  },
  computed: {
  },
  created() {
    this.compValue = this.value
  },
  methods: {
    onCompChange() {
      this.$emit('input', this.compValue)
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
    _renderPickerLink({ key }) {
      return <CompPickerLink v-model={this.value[key]} />
    },
    _renderNumber({ key, min, max, step }) {
      return (
        <el-input-number v-model={this.value[key]} size='small' min={min} max={max} step={step} />
      )
    },
    _renderSelect({ key, options, onchange = () => { } }) {
      return (
        <el-select v-model={this.value[key]} size="mini" onChange={(e) => onchange(e, this)}>
          {options.map((op) => (
            <el-option label={op.label} value={op.value} />
          ))}
        </el-select>
      )
    },
    _renderSwitch({ key }) {
      return <el-switch v-model={this.value[key]} />
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
    isShowLabel({ label }) {
      return typeof label != 'undefined'
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
        // 'checkbox': this._renderCheckbox,
        // 'table': this._renderTable,
        // 'richText': this._renderRichText,
        'pickerLink': this._renderPickerLink,
        'switch': this._renderSwitch,
        'radiobutton': this._renderRadioButton
      }
      return renderItem[item.component](item)
    }

    return (
      <div class='comp-panel'>
        {setting.map((item, index) => (
          <div
            class={[
              'comp-panel-cell',
              {
                'is-show': typeof item.isShow != 'undefined' ? item.isShow.call(this, item) : true
              }
            ]}
          >
            {this.isShowLabel(item) && (
              <div class='cell-label'>
                {item.label}
              </div>
            )}
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
