<template>
  <section class="section nav-wrap">
    <div class="section-header with-border">基础设置</div>
    <div class="section-body">
      <el-form label-width="80px" label-position="top">
        <el-form-item label="分类样式">
          <el-radio-group v-model="config.category">
            <el-radio :label="'collapse'"> 收起 </el-radio>
            <el-radio :label="'expand'"> 展开 </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  name: 'SettingsStyle',
  props: {
    res: {
      deep: true,
      handler(value) {
        if (value) {
          this.setData(value)
        }
      }
    }
  },
  data() {
    return {
      name: '',
      base: {},
      config: {},
      data: []
    }
  },
  watch: {
    res: {
      deep: true,
      handler(value) {
        if (value) {
          this.setData(value)
        }
      }
    }
  },
  mounted() {
    this.setData(this.res)
  },
  methods: {
    setData(val) {
      this.name = val.name
      this.base = val.base
      this.config = val.config
      this.data = val.data
    }
  }
}
</script>
<style lang="scss">
.nav-wrap {
  .setting-item {
    cursor: pointer;
  }
  .desc {
    line-height: 25px;
    margin-top: 10px;
  }
  .setting-remove {
    padding: 0 5px;
  }
  .goods-title {
    padding: 0 10px;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
