<template>
  <div>
    <slot />
    <div v-for="item in t_data" class="poster">
      <img v-if="item.imgUrl" class="i" :src="item.imgUrl">
    </div>
  </div>
</template>
<script>
export default {
  name: 'Poster',
  props: {
    data: {
      type: Object,
      default: function () {
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
