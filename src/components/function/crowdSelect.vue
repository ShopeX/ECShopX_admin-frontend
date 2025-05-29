<template>
  <div class="crowd-select">
    <el-button type="primary" size="mini" :disabled="disabled" @click="handleSelect">选择人群</el-button>
    <div v-if="selectedCrowds && selectedCrowds.length > 0" class="selected-crowds">
      <el-tag
        v-for="(item, index) in selectedCrowds"
        :key="index"
        type="danger"
        :closable="!disabled"
        @close="handleDelete(index)"
      >
        {{ item.tag_name }}
      </el-tag>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    disabled:{
      type: Boolean,
      default: false
    }
  },
  computed: {
    selectedCrowds: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    handleDelete(index) {
      const newValue = [...this.selectedCrowds]
      newValue.splice(index, 1)
      this.selectedCrowds = newValue
    },
    async handleSelect(){
      const { data } = await this.$picker.crowds({data:this.selectedCrowds})
      if (data) {
        this.selectedCrowds = data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.crowd-select {
  .selected-crowds {
    margin-top: 10px;
    .el-tag {
      margin-right: 10px;
      margin-bottom: 5px;
      border:none !important;
    }
  }
}
</style>
