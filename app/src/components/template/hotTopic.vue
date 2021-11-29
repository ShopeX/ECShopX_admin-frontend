<template>
  <div class="component-wrap" :class="{ 'component-padded': base.padded, 'active': active }">
    <div class="current-active"></div>
    <div class="hotTopic-title">{{ base.title }}</div>
    <div class="hotTopic-list">
      <div
        class="hotTopic_li"
        :class="base.index == index ? 'checked' : ''"
        v-for="(item, index) in data"
        :key="index"
      >
        {{ item.topic }}
      </div>
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
      name: '',
      base: {},
      data: []
    }
  },
  methods: {
    setData(val) {
      this.name = val.name
      this.base = val.base
      this.data = val.data
    }
  },
  mounted() {
    this.setData(this.res)
  }
}
</script>

<style scoped lang="scss">
.hotTopic-title {
  font-size: 20px;
  color: #00081c;
  text-align: left;
  padding: 14px 20px;
}
.hotTopic-list {
  display: flex;
  flex-wrap: wrap;
  padding: 0 20px;
  .hotTopic_li {
    border-radius: 2px;
    border: 1px solid #c7c7c7;
    flex-shrink: 0;
    padding: 8px;
    margin-right: 10px;
    margin-bottom: 10px;
    font-size: 8px;
    font-weight: 400;
    color: #00081c;
    letter-spacing: 1px;
  }

  .checked {
    border: 1px solid #00081c;
    background: #00081c;
    border-radius: 2px;
    flex-shrink: 0;
    padding: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    font-size: 10px;
    font-weight: 400;
    color: #fff;
    letter-spacing: 1px;
  }
}
</style>
