<template>
  <div class="component-wrap" :class="{ 'component-padded': base.padded, 'active': active }">
    <div class="current-active"></div>
    <div class="floorImg-title" :style="'text-align:' + base.float">{{ base.title }}</div>
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
      name: '',
      base: {}
    }
  },
  methods: {
    setData(val) {
      this.name = val.name
      this.base = val.base
    }
  },
  mounted() {
    this.setData(this.res)
  }
}
</script>

<style scoped lang="scss">
.floorImg-title {
  font-size: 20px;
  color: #00081c;
  text-align: center;
  padding: 20px 10px;
}
</style>
