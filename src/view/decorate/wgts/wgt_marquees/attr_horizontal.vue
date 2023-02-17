<style lang="scss" scoped>
.article-item {
  display: flex;
  margin-bottom: 10px;

  .el-input {
    margin: 0 10px;
  }
}
</style>
<template>
  <div>
      <CompTodoList v-model="localValue" :max="20" @onAddItem="handleAddhorizontal">
        <template slot="myslot" slot-scope="scope">
          <div class="cate-item">
            <el-input v-model="scope.data.title" class="cate-name" size="small" />
          </div>
        </template>
      </CompTodoList>
</div>
</template>

<script>
import CompTodoList from '../../comps/comp-todoList'
import articleSelector from '@/components/function/articleSelector'

export default {
  name: 'AttrHotSetting',
  data() {
    return {
      localValue: [],
      directions: ''
    }
  },
  watch: {
    localValue: {
      handler(nVal) {
        this.$emit('input', nVal)
      },
      deep: true,
    },
    direction: function (nVal, oVal) {
      if (this.directions != this.direction) {
        this.eliminate()
        this.directions = this.direction
      }
    }
  },
  props: {
    value: {
      type: Array
    },
    direction: {
      type: String
    }
  },
  components: {
    CompTodoList,
    articleSelector
  },
  created() {
    this.localValue = this.value
    this.directions = this.direction
  },
  methods: {
    handleAddhorizontal() {
      this.localValue.push({ title: '' })
    },
    eliminate() {
      this.localValue.splice(0)
    }
  }
}
</script>
