<template>
  <div class="h-full bg-background px-6 py-10">
    <!-- <slot></slot> -->
    <router-view v-slot="{ Component, route }">
      <Transition>
        <KeepAlive>
          <component :is="Component" />
        </KeepAlive>
      </Transition>
    </router-view>
  </div>
</template>

<script>
export default {
  name: 'AuthForm'
}
</script>

<style lang="scss" scoped></style>
