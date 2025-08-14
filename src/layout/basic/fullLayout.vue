<template>
  <div class="relative flex min-h-full w-full">
    <el-container>
      <router-view v-slot="{ Component }">
        <Transition name="fade" appear mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </el-container>
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
.el-header {
  padding-left: 8px;
  padding-right: 0;
}
</style>
