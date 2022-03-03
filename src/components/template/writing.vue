<template>
  <div class="component-wrap" :class="{ 'component-padded': base.padded, 'active': active }">
    <div class="current-active"></div>
    <div v-if="base.title" class="component-header">
      <div class="component-title">
        <div>{{ base.title }}</div>
        <div class="subtitle">{{ base.subtitle }}</div>
      </div>
      <div class="component-more">
        <div class="three-dot"></div>
      </div>
    </div>
    <div class="content" :style="{ textAlign: config.align }">
      <p class="paragraph" v-for="item in content">
        {{ item }}
      </p>
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
  computed: {
    content() {
      {
        if (this.data[0].content) {
          return this.data[0].content.split('\n')
        }
      }
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
.paragraph {
  margin-bottom: 5px;
  min-height: 6px;
  word-break: break-all;
  line-height: 1.5;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
