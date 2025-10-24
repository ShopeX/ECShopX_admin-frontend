<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<style lang="scss">
.sp-image {
  display: flex;
  align-items: center;
  display: block;
}
</style>

<script>
import dImage from '@/assets/imgs/default.jpg'
import { isNumber, isString, isBoolean } from '@/utils'
export default {
  name: 'SpImage',
  props: {
    src: String,
    width: [Number, String],
    height: [Number, String],
    circle: [Boolean, Number],
    fit: {
      type: String,
      default: 'cover'
    }
  },
  methods: {
    handleImageClick() {
      this.$emit('click')
    }
  },
  render() {
    const { src, width, height, circle } = this
    console.log('sp-image render src:', src, src || dImage)
    const styleNames = {}
    if (width) {
      styleNames['width'] = `${width}px`
    }
    if (height) {
      styleNames['height'] = `${height}px`
    }
    if (circle) {
      if (isBoolean(circle)) {
        styleNames['border-radius'] = `${width / 2}px`
      } else {
        styleNames['border-radius'] = `${circle}px`
      }
    }

    return (
      <el-image
        class={'sp-image'}
        style={styleNames}
        src={src || dImage}
        fit={this.fit}
        onClick={this.handleImageClick}
      />
    )
  }
}
</script>
