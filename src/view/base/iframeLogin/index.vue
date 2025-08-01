<template>
  <div class="main">
    <div v-loading="true" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      key: ''
    }
  },
  mounted() {
    let { code } = this.$route.query
    if (code) {
      window.top.location.href = `${window.location.origin}/login?code=${code}`
    } else {
      window.top.location.href = `${window.location.origin}/login`
    }
  },
  methods: {
    name() {}
  }
}
</script>

<style lang="scss" scoped>
.main {
  height: 500px;
  width: 100%;
  margin-top: 250px;
  // transform: translateY(-50%);
}
</style>
