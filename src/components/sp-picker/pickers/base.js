import { cloneDeep } from 'lodash'

export default {
  config: {},

  props: {
    value: {
      type: Object,
      validator (v) {
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

  data () {
    return {
      type: '',
      defaultVal: '',
      localVal: {}
    }
  },

  watch: {
    value: {
      immediate: true,
      handler (val) {
        if (!val || val.type !== this.type) {
          val = this.resolveDefaultVal()
        } else {
          val = cloneDeep(val)
        }
        this.localVal = val
      }
    }
  },

  methods: {
    resolveDefaultVal () {
      return {
        type: this.type,
        data: this.defaultVal
      }
    },
    getVal () {
      return this.localVal
    },
    updateVal (val) {
      // debugger
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
