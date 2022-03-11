<template>
  <div>
    <el-card>
      <div style="width: 70%">
        <el-form
          v-loading="loading"
          label-width="180px"
          :model="form"
        >
          <el-form-item label="TITLE(页面标题）">
            <el-input
              v-model="form.title"
              type="text"
            />
          </el-form-item>
          <el-form-item label="MATE_DESCRIPTION(页面描述）">
            <el-input
              v-model="form.mate_description"
              type="textarea"
            />
          </el-form-item>
          <el-form-item label="MATE_KEYWORDS(关键词）">
            <el-input
              v-model="form.mate_keywords"
              type="textarea"
            />
            <span class="tip">关键词之间请用半角”,”分隔</span>
          </el-form-item>

          <el-form-item size="large">
            <el-button>取消</el-button>
            <el-button
              type="primary"
              @click="save"
            >
              保存
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getTdkglobalset, saveTdkglobalset } from '../../../api/tdkset'

export default {
  components: {},

  data () {
    return {
      loading: false,
      form: {
        title: '',
        mate_description: '',
        mate_keywords: ''
      }
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    // 获取信息
    getInfo () {
      this.loading = true
      getTdkglobalset(this.params).then((res) => {
        this.form.title = res.data.data.title
        this.form.mate_description = res.data.data.mate_description
        this.form.mate_keywords = res.data.data.mate_keywords
        this.loading = false
      })
    },
    // 保存数据
    save () {
      saveTdkglobalset(this.form).then((res) => {
        this.$message({ type: 'success', message: '操作成功' })
        this.getInfo()
      })
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  }
}
</script>
<style scoped lang="scss">
.tip {
  font-size: 12px;
  color: #909399;
}
</style>
