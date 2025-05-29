<template>
  <div class="action-list-view">
    <div v-for="item in showDataList" :key="item.key">
      <el-button type="text" @click="item.action?.handler([row])">{{ item.name }}</el-button>
    </div>
    <template v-if="moreDataList.length">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link"> 更多<i class="el-icon-arrow-down el-icon--right" /> </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item, idx) in moreDataList" :key="item.key" :command="idx">
            {{ item.name }}
            <!-- <el-button type="text" @click="item.action?.handler([row])">{{ item.name }}</el-button> -->
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    row: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {}
  },
  computed: {
    showDataList() {
      return this.list.filter((item) => item.visible(this.row)).slice(0, 3)
    },
    moreDataList() {
      return this.list.filter((item) => item.visible(this.row)).slice(3)
    }
  },
  mounted() {},
  methods: {
    handleCommand(command) {
      this.moreDataList[command]?.action?.handler([this.row])
    }
  }
}
</script>

<style lang="scss" scoped>
.action-list-view {
  display: flex;
  flex-wrap: wrap;
  .el-dropdown-link {
    color: var(--themeColor);
  }
}
</style>
