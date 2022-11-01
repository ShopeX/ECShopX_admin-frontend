<template>
  <div>
    <el-row :gutter="40">
      <el-col :span="3">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleNew"
        >
          新增标签分类
        </el-button>
      </el-col>
      <el-col :span="8">
        <el-input
          v-model="params.category_name"
          placeholder="分类名称"
          size="mini"
          @change="categorySearch"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="categorySearch"
          />
        </el-input>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="list"
      :height="wheight - 170"
      element-loading-text="数据加载中"
      :default-sort="{ prop: 'bind_date', order: 'descending' }"
    >
      <el-table-column
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            @click="handleDelete(scope)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="category_name"
        label="分类名称"
        width="250"
      >
        <template slot-scope="scope">
          <div v-if="!scope.row.category_id">
            <el-input
              v-model="scope.row.category_name"
              placeholder="请输入分类名称"
            />
          </div>
          <div v-else>
            {{ scope.row.category_name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        label="分类排序"
        width="150"
      />
    </el-table>
    <div class="content-padded content-center">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :current-page.sync="params.page"
        :page-sizes="[10, 20, 50]"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <sideBar
      :visible.sync="show_sideBar"
      :title="'新增分类'"
    >
      <el-form>
        <el-form-item label="分类名">
          <el-input v-model="form.category_name" />
        </el-form-item>
        <el-form-item label="分类排序">
          <el-input v-model="form.sort" />
        </el-form-item>
        <!-- <el-form-item label="标签">
          <el-checkbox-group v-model="form.relTagIds">
            <el-checkbox label="复选框 A"></el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->
        <el-form-item>
          <el-button
            type="primary"
            @click="save"
          >
            提交
          </el-button>
        </el-form-item>
      </el-form>
    </sideBar>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  createTagCategory,
  getTagCategoryList,
  updateTagCategory,
  deleteTagCategory,
  getTagList
} from '@/api/member'
import sideBar from '@/components/element/sideBar'
export default {
  components: {
    sideBar
  },
  data () {
    return {
      form: {
        category_id: '',
        category_name: '',
        sort: '',
        relTagIds: ''
      },
      params: {
        page: 1,
        pageSize: 10,
        category_name: ''
      },
      list: [],
      loading: false,
      total_count: 0,
      show_sideBar: false
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getList()
    },
    handleSizeChange (pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getList()
    },
    handleDelete (data) {
      this.$confirm('确认删除该分类？')
        .then((_) => {
          deleteTagCategory(data.row.category_id).then((res) => {
            this.list.splice(data.$index, 1)
            this.$message({ type: 'success', message: '操作成功' })
          })
        })
        .catch((_) => {})
    },
    handleNew () {
      this.show_sideBar = true
      this.resetData()
    },
    resetData () {
      this.form = {
        category_id: '',
        attribute_type: 'brand',
        category_name: '',
        sort: ''
      }
    },
    handleEdit (data) {
      this.show_sideBar = true
      this.form = {
        category_id: data.category_id,
        category_name: data.category_name,
        sort: data.sort
      }
    },
    save () {
      // 如果没有id，则表示为新增
      if (!this.form.category_id) {
        createTagCategory(this.form).then((res) => {
          this.$message({ type: 'success', message: '操作成功' })
          this.params.page = 1
          this.resetData()
          this.getList()
        })
      } else {
        updateTagCategory(this.form.category_id, this.form).then((res) => {
          this.$message({ type: 'success', message: '操作成功' })
          this.getList()
        })
      }
    },
    getList () {
      this.loading = true
      getTagCategoryList(this.params).then((res) => {
        this.list = res.data.data.list
        this.total_count = res.data.data.total_count
        this.loading = false
      })
    },
    getTagList () {
      let param = {
        category_id: '0',
        tag_status: 'online'
      }
      getTagList(param).then((res) => {})
    },
    categorySearch () {
      this.getList()
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  }
}
</script>
<style scoped lang="scss">
.upload-box {
  width: 100px;
  height: 100px;
  .avatar-uploader-icon {
    line-height: 100px;
  }
}
.grade-setting-col {
  line-height: 40px;
}
.btn-gap {
  margin-left: 10px;
}
</style>
