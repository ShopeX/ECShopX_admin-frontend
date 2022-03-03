<template>
  <div class="component-wrap" :class="{ 'component-padded': base.padded, 'active': active }">
    <div class="current-active"></div>
    <div
      class="content"
      :class="{ 'bold': config.bold, 'italic': config.italic }"
      :style="{ color: config.color, fontSize: config.size + 'px', textAlign: config.align }"
    >
      {{ data[0].content }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    res: {
      type: Object,
      default: {}
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    res(value) {
      if (value) {
        this.setData(value)
      }
    }
  },
  data() {
    return {
      base: {},
      config: {},
      data: []
    }
  },
  methods: {
    setData(val) {
      this.base = val.base
      this.config = val.config
      this.data = val.data
    }
  },
  created() {
    this.setData(this.res)
  }
}
</script>

<style scoped lang="scss">
.content {
  padding: 0 15px;
}
.bold {
  font-weight: bolder;
}
.italic {
  font-style: italic;
}
</style>
