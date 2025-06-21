<template>
  <div
    v-if="button"
    class="w-[32px] h-[32px] rounded flex items-center justify-center hover:bg-gray-100 transition-all duration-300"
  >
    <component :is="icon" :size="size" :fill="fill" />
  </div>
  <component v-else :is="icon" :size="size" :fill="fill" />
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
    }
  },
  mounted() {}
}
</script>

<style scoped>
.sp-icon {
  display: inline-block;
  fill: currentColor;
  vertical-align: middle;
}
</style>
