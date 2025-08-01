<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-input v-model="order_id" placeholder="订单号" size="mini">
            <el-button slot="append" icon="el-icon-search" @click="numberSearch" />
          </el-input>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="全部" name="all" />
        <!-- <el-tab-pane label="电子" name="success"></el-tab-pane> -->
        <!-- <el-tab-pane label="已开票" name="notpay"></el-tab-pane>
      <el-tab-pane label="未开票" name="notpay"></el-tab-pane> -->
        <el-table v-loading="loading" :data="list" style="width: 100%" :height="wheight - 140">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="order_id" label="订单号" min-width="84" />
          <el-table-column prop="user_id" label="会员ID" min-width="84" />
          <el-table-column prop="type_hz" label="开票方式" />
          <el-table-column prop="amount" label="开票金额">
            <!-- <template slot-scope="scope">
            <span>￥{{scope.row.amount/100}}</span>
          </template> -->
          </el-table-column>
          <el-table-column label="开票人信息">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.fapiaoinfo_query" :key="index">
                <a v-if="item.c_buyername != ''">{{ item.c_buyername }}</a>
                <!-- <a v-if="item.c_bhsje != '' " >金额：{{item.c_bhsje}}</a> -->
              </div>
            </template>
          </el-table-column>

          <el-table-column label="商品信息">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.fapiaoinfo" :key="index">
                <a v-if="item.item_name != ''">{{ item.item_name }}</a>
                <a v-if="item.num != ''"> X {{ item.num }} </a>
                <!-- <a v-if="item.c_bhsje != '' " >金额：{{item.c_bhsje}}</a> -->
              </div>
            </template>
          </el-table-column>

          <el-table-column label="下载">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.fapiaoinfo_query" :key="index">
                <a v-if="item.c_url != ''" :href="item.c_url" target="_blank"
                  >发票PDF{{ index + 1 }}</a
                >
                <!-- <a v-if="item.c_jpg_url != '' " :href="'http://' + item.c_jpg_url" target="_blank" >发票图片{{index + 1}}</a> -->
              </div>

              <div v-for="(item, index) in scope.row.fapiaoinfo_query_red" :key="index">
                <a v-if="item.c_url != ''" :href="item.c_url" target="_blank"
                  >冲红票{{ index + 1 }}</a
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.fapiaoinfo_query" :key="index">
                <a v-if="item.c_msg != ''">{{ item.c_msg }}</a>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="开票状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">申请</span>
              <span v-if="scope.row.status == 2">开票</span>
              <span v-if="scope.row.status == 5">冲红</span>
              <span v-if="scope.row.status == 9">废弃</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="1"
                type="text"
                @click="handleChangeStatus(scope.row, scope.$index, 8)"
              >
                查询
              </el-button>
              <el-button
                v-if="scope.row.status == 1"
                type="text"
                @click="handleChangeStatus(scope.row, scope.$index, 2)"
              >
                开票
              </el-button>
              <el-button
                v-if="scope.row.status == 2"
                type="text"
                @click="handleChangeStatus(scope.row, scope.$index, 5)"
              >
                冲红
              </el-button>
              <!-- <el-button type="text" v-if="scope.row.status == 2" @click="downloadpop(scope.row,scope.$index,2)">下载</el-button> -->
              <!-- <router-link :to="{ path: matchRoutePath('detail'), query: { id: scope.row.id, resource: $route.path }}">编辑</router-link> -->
              <el-button
                v-if="scope.row.status == 1"
                type="text"
                @click="handleChangeStatus(scope.row, scope.$index, 9)"
              >
                作废
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="content-center content-padded">
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
      </el-tabs>
    </div>
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getFapiaoList, fapiaoSet } from '@/api/fapiao'
import shopSelect from '@/components/shopSelect'

export default {
  components: {
    shopSelect
  },
  data() {
    return {
      activeName: 'all',
      loading: false,
      total_count: 0,
      status: '',
      create_time: '',
      order_id: '',
      date_begin: '',
      date_end: '',
      params: {
        page: 1,
        pageSize: 20
      },
      list: [],
      currentShop: '',
      downloadView: false,
      downloadUrl: '',
      downloadName: ''
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.getList(this.params)
  },
  methods: {
    // 切换tab
    handleClick(tab, event) {
      this.activeName = tab.name
      this.params.status = tab.name == 'all' ? '' : tab.name
      this.params.page = 1
      this.getParams()
      this.getList(this.params)
    },
    shopHandle(val) {
      val && val.shop_id
      this.currentShop = val.shop_id
      this.params.page = 1
      this.getParams()
      this.getList(this.params)
    },
    numberSearch(e) {
      this.params.page = 1
      this.getParams()
      this.getList(this.params)
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getParams()
      this.getList(this.params)
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getParams()
      this.getList(this.params)
    },
    getParams() {
      this.params.order_id = this.order_id
    },
    getList(filter) {
      this.loading = true
      getFapiaoList(filter).then(response => {
        this.list = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
        console.warn(this.list)
      })
    },
    cancelFapiao(item, index) {
      let params = { id: 0, delete: 1 }
      params.id = item.id
      this.$confirm('确定作废吗？？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          DeleteSettingData(params).then(response => {
            this.list.splice(index, 1)
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
          })
          //删除操作
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },

    downloadpop(item) {
      console.log(item.fapiaoinfo_query)
    },

    handleChangeStatus(item, index, status_change) {
      let query = { id: 0 }
      let _text = ''
      query.id = item.id
      // query.status = item.status
      query.status = status_change
      console.warn('status_change=======', status_change)
      console.warn('item.status=========', item.status)
      switch (item.status) {
        case 1:
          _text = '1~确定开票吗？'
          break
        case 2:
          _text = '2~确定冲红吗？'
          break
        case 9:
          _text = '9~确定作废吗？'
          break
      }
      console.warn(_text)
      this.$confirm(_text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          fapiaoSet(query).then(response => {
            this.getList(this.params)
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
          })
          //删除操作
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    }
  }
}
</script>
<style scoped lang="scss"></style>
