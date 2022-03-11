<template>
  <div>
    <div class="action-container">
      <el-button
        type="primary"
        icon="el-icon-circle-plus"
        @click="addTemplate"
      >
        添加商品标签
      </el-button>
    </div>

    <SpFilterForm
      :model="params"
      @onSearch="onSearch"
      @onReset="onSearch"
    >
      <SpFilterFormItem
        prop="tag_name"
        label="标签名:"
      >
        <el-input
          v-model="params.tag_name"
          placeholder="请输入标签名"
        />
      </SpFilterFormItem>
    </SpFilterForm>

    <el-table
      v-loading="loading"
      border
      :data="tagsList"
      element-loading-text="数据加载中"
    >
      <el-table-column
        prop="tag_id"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="editAction(scope.$index, scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            @click="deleteAction(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="tag_name"
        label="标签名称"
        width="250"
      >
        <template slot-scope="scope">
          <span
            class="tag"
            :style="{ color: scope.row.font_color, background: scope.row.tag_color }"
          >
            {{ scope.row.tag_name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="标签描述"
      />
    </el-table>
    <div class="content-padded content-center">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="page.pageIndex"
        :page-sizes="[10, 20, 50]"
        :total="total_count"
        :page-size="page.pageSize"
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
      />
    </div>
    <sideBar
      :visible.sync="show_sideBar"
      :title="'新增商品标签'"
    >
      <el-form
        ref="form"
        :model="form"
        class="demo-ruleForm"
        label-width="100px"
      >
        <el-form-item
          class="content-left"
          label="标签名称"
          prop="tag_name"
          :rules="[{ required: true, message: '请输入标签名称', trigger: 'blur' }]"
        >
          <el-input
            v-model="form.tag_name"
            placeholder="请输入标签名称"
          />
        </el-form-item>
        <el-form-item
          class="content-left"
          label="标签说明"
        >
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入标签说明"
          />
        </el-form-item>
        <el-form-item
          class="content-left"
          label="标签颜色"
        >
          <el-color-picker
            v-model="form.tag_color"
            show-alpha
            :predefine="predefineColors"
          />
        </el-form-item>
        <el-form-item
          class="content-left"
          label="字体颜色"
        >
          <el-color-picker
            v-model="form.font_color"
            show-alpha
            :predefine="predefineColors"
          />
        </el-form-item>
        <el-form-item
          class="content-left"
          label="前台显示"
        >
          <el-radio-group v-model="form.front_show">
            <el-radio label="1">
              显示
            </el-radio>
            <el-radio label="0">
              隐藏
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          type="primary"
          @click="saveTagData"
        >
          确定保存
        </el-button>
      </div>
    </sideBar>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { saveTag, getTagList, getTagInfo, updateTag, deleteTag } from '../../../api/goods'
import sideBar from '@/components/element/sideBar'
import { pageMixin } from '@/mixins'
export default {
  components: {
    sideBar
  },
  mixins: [pageMixin],
  data () {
    return {
      show_sideBar: false,
      isEdit: false,
      tagsList: [],
      loading: false,
      total_count: 0,
      params: {
        tag_name: ''
      },
      form: {
        tag_id: '',
        tag_name: '',
        tag_color: '#ff1939',
        font_color: '#ffffff',
        description: '',
        front_show: '0'
      },
      predefineColors: ['#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585']
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted () {
    this.fetchList()
  },
  methods: {
    addTemplate () {
      // 添加商品
      this.show_sideBar = true
      this.form = {
        tag_id: '',
        tag_name: '',
        tag_color: '#ff1939',
        font_color: '#ffffff',
        description: '',
        front_show: '0'
      }
    },
    editAction (index, row) {
      // 编辑商品弹框
      this.form = row
      this.show_sideBar = true
    },
    preview (index, row) {
      // 预览弹框
      this.dialogVisible = true
      this.dataInfo = row
    },
    async fetchList () {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.params
      }
      const response = await getTagList(params)
      this.tagsList = response.data.data.list
      this.total_count = response.data.data.total_count
      this.loading = false
    },
    deleteAction (index, row) {
      this.$confirm('此操作将删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteTag(row.tag_id)
            .then((response) => {
              this.tagsList.splice(index, 1)
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 5 * 1000
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    getTaskTime (strDate) {
      let date = new Date(strDate)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let str = y + '-' + m + '-' + d
      return str
    },
    getTimeStr (date) {
      return this.getTaskTime(new Date(parseInt(date) * 1000))
    },
    saveTagData () {
      if (this.form.tag_id) {
        updateTag(this.form).then((res) => {
          if (res.data.data) {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.fetchList()
          }
        })
      } else {
        saveTag(this.form).then((res) => {
          if (res.data.data) {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.fetchList()
          }
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
.tag {
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 12px;
  line-height: 1;
}
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
