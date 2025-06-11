<template>
  <component :is="icon" :size="size" />
</template>

<script>
import * as icons from 'lucide-vue'
export default {
  name: 'SpIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: [Number, String],
      default: 16
    },
    color: {
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
