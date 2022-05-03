<style lang="scss" src="./attr_panel.scss"></style>

<script>
export default {
  name: 'AttrPanel',
  props: {
    info: Object,
    value: [Object, Number, String, Boolean]
  },
  data () {
    return {
      compValue: null
    }
  },
  created () {
    this.compValue = this.value
  },
  methods: {
    onCompChange () {
      this.$emit('input', this.compValue)
    }
  },
  render () {
    const { title, key, type, option } = this.info

    const renderComp = (type) => {
      switch (type) {
        case 'text':
          return (
            <el-input
              clearable
              type='text'
              v-model={this.compValue}
              on-change={this.onCompChange}
            />
          )
          break
        case 'radio-group':
          return (
            <el-radio-group v-model={this.compValue} size='small'>
              {option.map((item) => (
                <el-radio-button label={item.label} />
              ))}
            </el-radio-group>
          )
      }
    }

    return (
      <div class='attr-panel-cell'>
        <div class='cell-label'>{title}</div>
        <div class='cell-value'>{renderComp(type)}</div>
      </div>
    )
  }
}
</script>
