// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统 
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn 
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------

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
        this.localVal = val
      }
    }
  },

  methods: {
    resolveDefaultVal() {
      return {
        type: this.type,
        data: this.defaultVal
      }
    },
    getVal() {
      return this.localVal
    },
    updateVal(val) {
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
