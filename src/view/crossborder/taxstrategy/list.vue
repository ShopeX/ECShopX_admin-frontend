<template>
  <div>
    <div v-if="$route.path.indexOf('editor') === -1">
      <!--搜索添加-->
      <el-row :gutter="40">
        <el-col>
          <el-input
            v-model="params.keywords"
            class="input-b"
            placeholder="策略名称"
            @change="origincountrySearch"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="origincountrySearch"
            />
          </el-input>
          <el-button
            type="primary"
            icon="el-icon-circle-plus"
            @click="handleNew"
          >
            新增策略
          </el-button>
        </el-col>
      </el-row>

      <el-card>
        <el-table
          v-loading="loading"
          :data="list"
          :height="wheight - 300"
          element-loading-text="数据加载中"
        >
          <el-table-column
            label="操作"
            width="150"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleEdit(scope.$index, scope.row, true)"
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
            prop="attribute_name"
            label="策略名称"
            width="300"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.taxstrategy_name }}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!--分页-->
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
    </div>

    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getTaxstrategyList, delTaxstrategy } from '../../../api/crossborder'

export default {
  components: {},
  provide () {
    return {
      refresh: this.handleCurrentChange
    }
  },
  data () {
    return {
      loading: false,
      imgDialog: false,
      isGetImage: false,
      show_sideBar: false,
      // 搜索数据
      total_count: 0,
      params: {
        page: 1,
        pageSize: 10,
        keywords: ''
      },
      // 列表数据
      list: []
    }
  },
  mounted () {
    this.handleCurrentChange(1)
  },
  methods: {
    // 搜索
    origincountrySearch () {
      this.handleCurrentChange(1)
    },
    // 编辑
    handleEdit (index, row) {
      this.$router.push({ path: this.matchHidePage('editor/') + row.id })
    },
    // 新增编辑
    handleNew () {
      this.$router.push({ path: this.matchHidePage('editor') })
    },

    // 删除
    handleDelete (data) {
      this.$confirm('确认删除该策略么？')
        .then((_) => {
          delTaxstrategy(data.row.id, []).then((res) => {
            this.list.splice(data.$index, 1)
            this.$message({ type: 'success', message: '操作成功' })
          })
        })
        .catch((_) => {})
    },
    // 分页
    handleCurrentChange (page_num = 1) {
      this.params.page = page_num
      this.getList()
    },
    handleSizeChange (pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getList()
    },
    // 获取列表
    getList () {
      console.log('获取数据')
      this.loading = true
      getTaxstrategyList(this.params).then((res) => {
        console.log('返回数据', res)
        this.list = res.data.data.list
        this.total_count = res.data.data.total_count
        this.loading = false
      })
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
</style>
