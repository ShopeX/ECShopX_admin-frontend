<template>
  <div>
    <el-tabs
      v-model="activeName"
      type="border-card"
    >
      <el-tab-pane
        label="全部"
        name="first"
      >
        <teamList :view="0" />
      </el-tab-pane>
      <el-tab-pane
        label="已中奖"
        name="second"
      >
        <teamList :view="1" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import teamList from './list/teamList'

export default {
  components: {
    teamList
  },
  data () {
    return {
      loading: false,
      view: 0,
      activeName: 'first',
      list: []
    }
  },
  mounted () {
    if ('undefined' != typeof this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
  },
  methods: {}
}
</script>

<style scoped></style>
