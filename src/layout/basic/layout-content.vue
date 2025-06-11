<template>
  <el-container class="h-full">
    <el-container class="h-full p-4 bg-background-deep">
      <div class="w-full h-full p-4 bg-white">
        <slot />
      </div>
    </el-container>
    <el-aside class="bg-white h-full" width="50px">
      <el-button>
        <SpIcon name="headset" />
      </el-button>
    </el-aside>
  </el-container>
</template>

<script>
export default {
  name: 'LayoutContent'
}
</script>

<style lang="scss" scoped></style>
