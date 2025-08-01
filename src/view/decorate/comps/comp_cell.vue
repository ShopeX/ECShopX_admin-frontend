<style lang="scss">
.comp-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 12px 10px;
  .cell-label {
    width: 80px;
    color: #888;
  }
  .cell-value {
    width: 220px;
    text-align: right;
  }

  .el-radio-button {
    &:first-child {
      .el-radio-button__inner {
        border-radius: 2px 0 0 2px;
      }
    }
    &:last-child {
      .el-radio-button__inner {
        border-radius: 0 2px 2px 0;
      }
    }
  }
}
</style>

<script>
export default {
  name: 'CompCell',
  props: ['info', 'value', 'scope'],
  inject: ['scope'],
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
    }
  },
  render() {
    const { title, key, type, disabled = false, option } = this.info
    const renderComp = type => {
      switch (type) {
        case 'text':
          return (
            <el-input
              clearable
              type="text"
              v-model={this.compValue}
              on-change={this.onCompChange}
            />
          )
          break
        case 'radio-group':
          return (
            <el-radio-group
              v-model={this.compValue}
              size="small"
              disabled={disabled(this.scope)}
              on-change={this.onCompChange}
            >
              {option.map(item => (
                <el-radio-button label={item.value}>{item.label}</el-radio-button>
              ))}
            </el-radio-group>
          )
      }
    }

    return (
      <div class="comp-cell">
        <div class="cell-label">{title}</div>
        <div class="cell-value">{renderComp(type)}</div>
      </div>
    )
  }
}
</script>
