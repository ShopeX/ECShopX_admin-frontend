import { cloneDeep } from 'lodash'

export default {
  config: {},

  props: {
    value: {
      type: Object,
      validator(v) {
        if (v === null) return true
        if (!v.type) {
          console.error('value.type is undefined')
          return false
        }
        if (v.data === undefined) {
          console.error('[base picker] value.data is undefined')
          return false
        }
        return true
      }
    }
  },

  data() {
    return {
      type: '',
      defaultVal: '',
      localVal: {}
    }
  },

  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (!val || val.type !== this.type) {
          val = this.resolveDefaultVal()
        } else {
          val = cloneDeep(val)
        }
        console.log('base watch value:', val)
        this.localVal = val
      }
    }
  },

  methods: {
    cellClass({ columnIndex, rowIndex }) {
      const { multiple } = this
      if (columnIndex == 0 && rowIndex == 0 && !multiple) {
        return 'disableheadselection'
      }
    },
    resolveDefaultVal() {
      return {
        type: this.type,
        data: this.defaultVal
      }
    },
    getVal() {
      console.log(`sp-picker getVal:`, this, JSON.stringify(this.localVal))
      return this.localVal
    },
    updateVal(val) {
      console.log(`sp-picker updateVal:`, this, val)
      // const type = this.$options.config.type || this.type
      // if (!type) throw new Error('type should not be undefined')

      const data = {
        // type,
        data: val
      }
      this.localVal = data

      this.$emit('input', data)
    }
  }
}
