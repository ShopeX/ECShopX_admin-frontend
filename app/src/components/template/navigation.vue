<template>
  <div class="component-wrap" :class="{ 'component-padded': base.padded, 'active': active }">
    <div class="current-active"></div>
    <div class="component-body with-padding">
      <div class="navigation">
        <div v-for="(item, index) in data" :key="index" class="nav-item">
          <img class="nav-img" :src="wximageurl + item.imgUrl" />
          <div class="nav-name">{{ item.content }}</div>
        </div>
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
    res: {
      deep: true,
      handler(value) {
        if (value) {
          this.setData(value)
        }
      }
    }
  },
  data() {
    return {
      base: {},
      data: []
    }
  },
  methods: {
    setData(val) {
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
.navigation {
  display: flex;
  align-items: center;
  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    .nav-img {
      width: 50px;
      height: 50px;
    }
    .nav-name {
      font-size: 12px;
    }
  }
}
</style>
