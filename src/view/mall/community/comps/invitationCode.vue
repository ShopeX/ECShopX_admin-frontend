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
    <SpImage :src="info" :width="120" />
    <a class="download-link" download="invitation_code.jpg" :href="info">下载邀请码</a>
  </div>
</template>

<script>
export default {
  name: 'InvitationCode',
  props: {
    info: String
  },
  data() {
    return {}
  },
  created() {},
  methods: {
    handleDownload() {
      console.log('handleDownload: ', this.info)
      window.open(this.info)
    }
  }
}
</script>
