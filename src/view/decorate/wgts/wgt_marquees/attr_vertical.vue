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
    <CompTodoList v-model="localValue" :max="20" @onAddItem="handleAddTabs">
      <template slot="myslot" slot-scope="scope">
        <div class="cate-item">
          <span>{{ scope.data.title }}</span>
        </div>
      </template>
    </CompTodoList>

    <articleSelector :visible.sync="articleVisible" :get-status="setArticleStatus" :rel-items-ids="relArticles"
      @change="pickArticle" />
</div>
</template>

<script>
import articleSelector from '@/components/function/articleSelector'
import CompTodoList from '../../comps/comp-todoList'


export default {
  name: 'AttrVertical',
  data() {
    return {
      localValue: [],
      relArticles: [],
      setArticleStatus: false,
      articleVisible: false,
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
    articleSelector,
    CompTodoList
  },
  created() {
    this.localValue = this.value
    this.directions = this.direction
  },
  methods: {
    pickArticle(data) {
      this.relArticles = data
      if (data.length > 0) {
        this.localValue.splice(0)
        data.forEach((item) => {
          let obj = {
            title: item.title,
            id: item.article_id
          }
          this.localValue.push(obj)
        })
      }
    },
    handleAddTabs() {
      this.setArticleStatus = true
      this.articleVisible = true
    },
    eliminate() {
      this.localValue.splice(0)
      this.relArticles = []
    }
  }
}
</script>
