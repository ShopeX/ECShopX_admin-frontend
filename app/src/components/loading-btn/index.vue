<template>
  <el-button :type='type' :size='size' :loading='loading' @click="btnHandle">{{text}}</el-button>
</template>

<script>
export default {
  props:{
    size:{
      default:'medium'
    },
    type:{
      default:'primary'
    },
    text:{
      default:'确定'
    }
  },

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