<template>
  <div
    class="export_tip_cpn"
    @click="open"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: ['params'],
  methods: {
    open () {
      this.$emit('exportHandle', this.params)
      // const mesage = `<p>您已确认，在您点击“导出”按钮时，已具有获得系统内全部会员资料、商品资料、订单资料及相关信息等的全部权利，并在使用过程中严格按照相关法律法规，包括但不限于已充分获得授权可以收集个人信息并存储、使用、加工、传输、提供、公开该等信息，否则，应由您出面自行处理并解决侵权事宜，并承担由此引起的争议及纠纷，如因此造成第三方损失的，则应向第三方赔偿损失。</p>`
      // this.$alert(mesage, '通知消息', {
      //   type: 'warning',
      //   confirmButtonText: '确定',
      //   dangerouslyUseHTMLString: true,
      //    customClass: 'export_tip_cpn'
      // })
      //   .then((res) => {
      //     console.log(this.params);
      //     this.$emit('exportHandle',this.params)
      //   })
      //   .catch((res) => {})
    }
  }
}
</script>
<style lang="scss">
.export_tip_cpn {
  display: inline-block;
  .el-message-box__status {
    position: absolute;
    top: 6% !important;
  }
}
</style>
