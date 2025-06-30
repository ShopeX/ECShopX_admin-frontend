<template>
  <div>
    <el-table v-loading="loading" :data="groupList" :height="wheight - 240">
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="edit"
            @click="showGroupsActivityDataAction(scope.$index, scope.row)"
          >
            活动数据
          </el-button>
          <el-button
            v-if="scope.row.activity_status == 1"
            size="mini"
            icon="edit"
            @click="editGroupsAction(scope.$index, scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="scope.row.activity_status == 2"
            size="mini"
            @click="showGroupsAction(scope.$index, scope.row)"
          >
            查看
          </el-button>
          <el-button
            v-if="scope.row.activity_status == 2"
            size="mini"
            @click="finishGroupsAction(scope.$index, scope.row)"
          >
            终止
          </el-button>
          <el-button
            v-if="scope.row.activity_status == 1 || scope.row.activity_status == 3"
            size="mini"
            type="danger"
            @click="deleteGroupsAction(scope.$index, scope.row)"
          >
            删 除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="act_name" label="拼团名称" />
      <el-table-column label="商品类型" width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.group_goods_type == 'services'" type="success">
            服务类商品
          </el-tag>
          <el-tag v-else> 实体类商品 </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="goods_name" label="拼团商品" />
      <el-table-column label="拼团有效期">
        <template slot-scope="scope">
          {{ scope.row.begin_time | datetime('YYYY-MM-DD HH:mm:ss') }} -
          {{ scope.row.end_time | datetime('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column prop="act_price" label="拼团价格" width="100">
        <template slot-scope="scope">
          <span>{{ cursymbol + scope.row.act_price / 100 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="disabled" label="状态" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.activity_status == 1">未开始</span>
          <span v-else-if="scope.row.activity_status == 2">进行中</span>
          <span v-else>已结束</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total_count > params.pageSize" class="content-center content-top-padded">
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="params.page"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDefaultCurrency } from '../../../../api/company'
import { getGroupsList, finishGroupActivity, deleteGroupActivity } from '../../../../api/promotions'

export default {
  props: ['view'],
  data() {
    return {
      loading: false,
      groupList: [],
      total_count: 0,
      params: {
        view: 0,
        page: 1,
        pageSize: 20,
        keywords: ''
      },
      currency: {},
      cursymbol: '￥'
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    view(newVal) {
      this.params.view = newVal
      this.getGroupsList()
    }
  },
  mounted() {
    this.params.view = this.view
    this.getGroupsList()
    //this.getCurrencyInfo()
  },
  methods: {
    handleCurrentChange(pageNum) {
      this.params.page = pageNum
      this.getGroupsList()
    },
    getGroupsList() {
      this.loading = true
      getGroupsList(this.params)
        .then(response => {
          this.groupList = response.data.data.list
          this.total_count = response.data.data.total_count
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          this.$message({
            type: 'error',
            message: '获取拼团活动列表失败'
          })
        })
    },
    showGroupsActivityDataAction(index, row) {
      this.$router.push({ path: this.matchRoutePath('team/') + row.groups_activity_id })
    },
    showGroupsAction(index, row) {
      this.$router.push({
        path: this.matchRoutePath('editor/') + row.groups_activity_id,
        query: { show: '1' }
      })
    },
    editGroupsAction(index, row) {
      this.$router.push({ path: this.matchRoutePath('editor/') + row.groups_activity_id })
    },
    finishGroupsAction(index, row) {
      this.$confirm('此操作将终止该拼团活动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          finishGroupActivity(row.groups_activity_id).then(res => {
            this.getGroupsList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    deleteGroupsAction(index, row) {
      debugger
      this.$confirm('此操作将删除该拼团活动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteGroupActivity(row.groups_activity_id).then(res => {
            this.getGroupsList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    getCurrencyInfo() {
      getDefaultCurrency().then(res => {
        this.currency = res.data.data
        this.cursymbol = this.currency.symbol
      })
    }
  }
}
</script>

<style scoped></style>
