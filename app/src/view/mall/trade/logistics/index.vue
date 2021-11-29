<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="普通快递" name="normal">
      <Normal />
    </el-tab-pane>
    <el-tab-pane label="同城配" name="city" v-if="!isMicorMall">
      <City />
    </el-tab-pane> 
  </el-tabs>
</template>

<script>
import City from './city';
import Normal from './normal'; 
import { mapGetters } from "vuex";
export default {
  data(){
    return {
      activeName: 'normal',
    }
  },
  components:{
    Normal,
    City
  },
  computed: {
    ...mapGetters(['isMicorMall']),
  },
  methods:{
    handleClick(tab){
      this.activeName=tab.name 
    }
  }
}
</script>

<style scoped>
</style>