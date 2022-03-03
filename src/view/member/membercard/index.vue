<template>
  <div class="section-white">
    <el-tabs
      v-model="activeName"
      type="border-card"
    >
      <el-tab-pane
        label="基础设置"
        name="first"
      >
        <card-setting />
      </el-tab-pane>
      <el-tab-pane
        label="等级设置"
        name="second"
      >
        <card-level />
      </el-tab-pane>
      <el-tab-pane
        label="付费等级设置"
        name="thrid"
      >
        <card-viplevel />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import cardViplevel from './viplevel.vue'
import cardLevel from './level.vue'
import cardSetting from './setting.vue'
export default {
  components: {
    cardLevel,
    cardSetting,
    cardViplevel
  },
  data () {
    return {
      activeName: 'first'
    }
  }
}
</script>
