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
<template>
  <div
    v-if="button"
    :class="buttonClass"
    class="flex items-center justify-center hover:bg-gray-100 transition-all duration-300 cursor-pointer"
    @click.stop="onButtonClick"
  >
    <component :is="icon" :size="size" :fill="fill" />
    <slot />
  </div>

  <component v-else :is="icon" :size="size" :fill="fill" v-on="$listeners" />
</template>

<script>
// import * as icons from 'lucide-vue'
import * as icons from '@icon-park/vue'
export default {
  name: 'SpIcon',
  props: {
    button: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      required: true
    },
    size: {
      type: [Number, String],
      default: 16
    },
    radius: {
      type: Boolean,
      default: false
    },
    fill: {
      type: String,
      default: 'currentColor'
    }
  },
  data() {
    return {}
  },
  computed: {
    icon() {
      return icons[this.name.replace(/(?:^|-)([a-z])/g, (_, letter) => letter.toUpperCase())]
      // return icons[this.name]
    },
    buttonClass() {
      return this.button
        ? `w-[${this.size * 2}px] h-[${this.size * 2}px] rounded ${
            this.radius ? 'rounded-full' : ''
          }`
        : ''
    }
  },
  mounted() {},
  methods: {
    onButtonClick() {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.sp-icon {
  display: inline-block;
  fill: currentColor;
  vertical-align: middle;
}
</style>
