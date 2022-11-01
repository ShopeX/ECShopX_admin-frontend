<template>
  <div>
    <el-row class="head">
      <shop-select
        distributors
        @update="storeChange"
        @init="initChange"
      />
      <el-input
        v-model="params.mobile"
        placeholder="导购员手机号"
        class="input"
        clearable
        @clear="clearparams('mobile')"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="resetSearch"
        />
      </el-input>
      <el-input
        v-model="params.name"
        placeholder="导购员姓名"
        class="input"
        clearable
        @clear="clearparams('name')"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="resetSearch"
        />
      </el-input>
      <el-date-picker
        v-model="date"
        type="datetimerange"
        placeholder="选择日期范围"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="timestamp"
        @change="dateChange"
      />
    </el-row>
    <el-card>
      <el-table
        v-loading="loading"
        :data="list"
      >
        <el-table-column
          prop="sign_type"
          label="类型"
        />
        <el-table-column
          prop="name"
          label="导购姓名"
        />
        <el-table-column
          prop="mobile"
          label="导购手机号"
        />
        <el-table-column
          prop="shop_name"
          label="所属门店"
        />
        <el-table-column
          prop="updated"
          label="操作时间"
        />
        <!-- <el-table-column label="备注"></el-table-column> -->
      </el-table>
    </el-card>
    <el-pagination
      class="content-padded content-center"
      background
      :current-page="params.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="params.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total_count"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getSalespersonLoginLog } from '@/api/shop'
import shopSelect from '@/components/shopSelect'

export default {
  components: {
    shopSelect
  },
  data () {
    return {
      list: [],
      total_count: 0,
      loading: false,
      salesman_id: '',
      date: [],
      params: {
        page: 1,
        pageSize: 20,
        mobile: '',
        name: '',
        distributor_id: '',
        time_start_begin: '',
        time_start_end: ''
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  filters: {
    signType: function (key) {
      const typeObject = {
        signin: '签到',
        signout: '主动签退',
        forceout: '被动签退'
      }
      return typeObject[key] || '未知类型'
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    addSelectStoreChange (data) {
      this.form.distributor_id = data.shop_id
    },
    storeChange (params) {
      params && params.shop_id
      this.params.distributor_id = params.shop_id
      this.params.page = 1
      this.getList()
    },
    initChange () {
      this.shopId = ''
    },
    resetSearch () {
      this.params.page = 1
      this.getList()
    },
    clearparams (key) {
      this.params[key] = ''
      this.resetSearch()
    },
    dateChange () {
      if (this.date) {
        this.params.time_start_begin = this.date[0] / 1000
        this.params.time_start_end = this.date[1] / 1000
      } else {
        this.params.time_start_begin = ''
        this.params.time_start_end = ''
      }
      this.resetSearch()
    },
    getList () {
      this.loading = true
      getSalespersonLoginLog(this.params).then((response) => {
        if (response.data.data.list) {
          this.list = response.data.data.list
          this.total_count = Number(response.data.data.total_count)
        }
        this.loading = false
      })
    },
    handleSizeChange (val) {
      this.params.page = 1
      this.params.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.getList()
    }
  }
}
</script>

<style scoped lang="scss">
.head {
  .input {
    width: 260px;
  }
}
</style>
