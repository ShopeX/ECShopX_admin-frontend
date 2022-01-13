<template>
  <div class="tips" v-html='title' :style="{'background':bgColor}"></div>
</template>

<script>
export default {
    props:{
      title:{
        type:String,
        reqired:true
      },
      bgColor:{
        default:'#eef8fd'
      }
    }
}
</script>

<style lang="scss" scoped>
.tips{
    width: 100%;
    padding: 13px 10px;
}
</style>