<style lang="scss" src="./attr_panel.scss"></style>

<script>
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
    _renderInput({ key }) {
      return <el-input type='text' v-model={this.value[key]} size='small' />
    },
    _renderColor({ key }) {
      return <el-color-picker v-model={this.value[key]} size='small' />
    },
    _renderNumber({ key, min, max, step }) {
      return (
        <el-input-number v-model={this.value[key]} size='small' min={min} max={max} step={step} />
      )
    }
  },
  render() {
    const { wgtName, setting } = this.info

    const renderComp = (item) => {
      const renderItem = {
        // 'textarea': this._renderTextArea,
        'input': this._renderInput,
        'color': this._renderColor,
        'number': this._renderNumber
        // 'text': this._renderText,
        // 'select': this._renderSelect,
        // 'radio': this._renderRadio,
        // 'checkbox': this._renderCheckbox,
        // 'table': this._renderTable,
        // 'richText': this._renderRichText,
        // 'image': this._renderImage,
        // 'switch': this._renderSwitch
      }
      return renderItem[item.component](item)
    }

    return (
      <div className='attr-panel'>
        {setting.map((item, index) => (
          <div class='attr-panel-cell'>
            <div class='cell-label'>{item.label}</div>
            <div class='cell-value'>{renderComp(item)}</div>
          </div>
        ))}
      </div>
    )
  }
}
</script>
