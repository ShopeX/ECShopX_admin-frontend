<template>
  <el-button :type='type' :size='size' :loading='loading' @click="btnHandle">{{text}}</el-button>
</template>

<script>
export default {
  props:['size','type','text'],
  data(){
    return{
      loading:false
    }
  },
  methods:{
    btnHandle(){
      this.loading = true;
      this.$emit('clickHandle');
    },
    closeLoading() {
      this.loading = false
    }
  }
}
</script>

<style>

</style>