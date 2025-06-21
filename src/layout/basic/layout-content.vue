<template>
  <el-container class="h-full">
    <el-container class="h-full">
      <div class="w-full h-full bg-background-deep">
        <slot />
      </div>
    </el-container>
    <el-aside class="bg-white h-full" width="50px">
      <div class="flex flex-col items-center justify-center gap-4">
        <el-popover placement="left" width="200" trigger="click">
          <div slot="reference">
            <SpIcon button class="bg-gray-100" name="headset" size="16" />
            <div class="text-xs text-center mt-1">售前</div>
          </div>
          <div>
            <SpImage :src="serviceImage" height="200" fit="contain" />
          </div>
        </el-popover>
      </div>
    </el-aside>
  </el-container>
</template>

<script>
import serviceImage from '@/assets/images/customer-service.jpg'
export default {
  name: 'LayoutContent',
  data() {
    return {
      serviceImage
    }
  }
}
</script>

<style lang="scss" scoped></style>
