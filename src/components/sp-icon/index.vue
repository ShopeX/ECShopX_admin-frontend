<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div
    v-if="button"
    :class="buttonClass"
    class="flex items-center justify-center hover:bg-gray-100 transition-all duration-300 cursor-pointer"
    @click.stop="onButtonClick"
  >
    <component :is="icon" :size="size" v-bind="iconExtraProps" />
    <slot />
  </div>

  <component v-else :is="icon" :size="size" v-bind="iconExtraProps" v-on="$listeners" />
</template>

<script>
import * as iconParkIcons from '@icon-park/vue'
import { LUCIDE_ICONS } from './lucide-registry'

function nameToPascal(name) {
  return name.replace(/(?:^|-)([a-z])/g, (_, letter) => letter.toUpperCase())
}

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
    pascalName() {
      return nameToPascal(this.name)
    },
    icon() {
      const lucide = LUCIDE_ICONS[this.pascalName]
      if (lucide) return lucide
      return iconParkIcons[this.pascalName]
    },
    /** Lucide 走 stroke/currentColor；IconPark 用 fill */
    iconExtraProps() {
      if (LUCIDE_ICONS[this.pascalName]) {
        return { color: this.fill, strokeWidth: 2 }
      }
      return { fill: this.fill }
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
