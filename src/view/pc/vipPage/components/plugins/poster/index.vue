<template>
  <div>
    <slot></slot>
    <div class="poster" v-for="item in t_data">
      <img v-if="item.imgUrl" class="i" :src="item.imgUrl" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'poster',
  props: {
    data: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      t_data: this.data.data
    }
  }
}
</script>
<style lang="scss" scoped>
.poster {
  img {
    width: 100%;
  }
}
</style>
