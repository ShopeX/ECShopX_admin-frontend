<template>
  <div class="hover-delete" @mouseenter="hovering = true" @mouseleave="hovering = false">
    <slot />
    <div v-if="hovering" class="hover-cover" @click="handleClick">
      <i class="el-icon-delete-solid" @click="$emit('delete')" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hovering: false
    }
  },
  methods: {
    handleClick: function (e) {
      e.stopPropagation()
    }
  }
}
</script>

<style lang="scss">
.hover-delete {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .hover-cover {
    position: absolute;
    inset: 0 0 0 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;

    .el-icon-delete-solid {
      color: white;
      font-size: 20px;
    }
  }
}
</style>
