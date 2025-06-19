<template>
  <div>
    <span>{{ content }}</span>
    <i
      class="el-icon-document-copy ml-1"
      v-if="enable"
      v-clipboard:copy="content"
      v-clipboard:success="
        () =>
          $message.success({
            message: '复制成功'
          })
      "
    />
  </div>
</template>

<script>
export default {
  name: 'SpClipboard',
  props: {
    content: {
      type: String,
      default: ''
    },
    enable: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped></style>
