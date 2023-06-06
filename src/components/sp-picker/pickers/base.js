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
      console.log(`sp-picker getVal:`, JSON.stringify(this.localVal))
      if (this.multiple) {
        console.log('this.value', this, this.value)
        const { num, islimitImgType = false } = this.value
        if (num) {
          if (this.localVal.data.length > num) {
            throw new Error(`最多选择${num}条数据`)
          }
        }
        if (islimitImgType) {
          let similarCount = 0
          this.localVal.data.forEach((element) => {
            console.log("循环");
            if (element.attribute_type == 'item_spec' && element.is_image == 'true') {
              similarCount += 1
            }
            if (similarCount > 1) {
              throw new Error(`最多关联一个图片类型规格`)
            }
          })
          console.log(similarCount)
        }
      }
      return this.localVal
    },
    updateVal(val) {
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
