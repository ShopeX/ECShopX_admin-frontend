<style lang="scss" scoped>
.invitation-code {
  display: flex;
  align-items: flex-end;
  .download-link {
    line-height: 1;
    margin-left: 10px;
    cursor: default;
  }
}
</style>
<template>
  <div class="invitation-code">
    <SpImage />
    <a
      class="download-link"
      @click="handleDownload"
    >下载邀请码</a>
  </div>
</template>

<script>
export default {
  name: 'InvitationCode',
  data () {
    return {}
  },
  created () {},
  methods: {
    handleDownload () {
      console.log('handleDownload')
    }
  }
}
</script>
