<template>
  <div>
    <div class="action-container">
      <el-button
        type="primary"
        icon="el-icon-circle-plus"
        @click="handleNew"
      >
        新增内购企业
      </el-button>
    </div>

    <SpFilterForm
      :model="params"
      @onSearch="onSearch"
      @onReset="onSearch"
    >
      <SpFilterFormItem
        prop="enterprise_name"
        label="企业名称:"
      >
        <el-input
          v-model="params.enterprise_name"
          placeholder="请输入企业名称"
        />
      </SpFilterFormItem>
    </SpFilterForm>

    <el-table
      v-loading="loading"
      border
      :data="list"
      :height="wheight - 170"
      element-loading-text="数据加载中"
      :default-sort="{ prop: 'bind_date', order: 'descending' }"
    >
      <el-table-column label="ID" prop="enterprise_id" />
      <el-table-column
        prop="enterprise_name"
        label="企业名称"
      />
      </el-table-column>
      <el-table-column
        prop="enterprise_sn"
        label="企业编码"
      />
      </el-table-column>

      <el-table-column  prop="login_type" label="登录类型" >
          <template slot-scope="scope">
            <span v-if="scope.row.login_type == 'mobile'">手机号登录</span>
            <span v-else-if="scope.row.login_type == 'email'">邮箱登录</span>
            <span v-else-if="scope.row.login_type == 'account'">账号登录</span>
            <span v-else>{{ scope.row.login_type }}</span>
          </template>
      </el-table-column>

      <el-table-column
        prop="disabled"
        label="状态"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleClick(scope.row)"
            icon="el-icon-s-tools"
          >
            {{ scope.row.disabled == 0 ? '禁用' : '启用' }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="content-padded content-center">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
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
      :title="'新增企业'"
    >
      <el-form>
        <el-form-item label="企业名称">
          <el-input v-model="form.enterprise_name" />
        </el-form-item>
        <el-form-item label="企业编码">
          <el-input v-model="form.enterprise_sn" />
        </el-form-item>
        <el-form-item label="登录类型">
          <el-select v-model="form.login_type" style="width: 100%">
            <el-option
              label="手机号"
              value="mobile"
            />
            <el-option
              label="账号"
              value="account"
            />
            <el-option
              label="邮箱"
              value="email"
            />
          </el-select>
        </el-form-item>
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
import imgPicker from '@/components/imageselect'
import {
  getEnterpriseList,
  addEnterpriseInfo,
  getEnterpriseDetail,
  updateEnterpriseInfo,
  deteleEnterpriseInfo,
  updateEnterpriseStaus
} from '@/api/member'
import { pageMixin } from '@/mixins'
import { setPaymentSetting, getPaymentSetting } from '@/api/trade'
import sideBar from '@/components/element/sideBar'
export default {
  components: {
    sideBar,
    imgPicker
  },
  mixins: [pageMixin],
  data () {
    return {
      form: {
        enterprise_id: '',
        enterprise_name: '',
        enterprise_sn: '',
        login_type: '',
      },
      params: {
        enterprise_name: ''
      },
      list: [],
      loading: false,
      brand_name: '',
      total_count: 0,
      show_sideBar: false,
      setChinaumspayVisible: false,
    }
  },
  mounted () {
    this.fetchList()
  },
  methods: {
    handleNew () {
      this.show_sideBar = true
      this.resetData()
    },
    resetData () {
      this.form = {
        enterprise_id: '',
        enterprise_name: '',
        enterprise_sn: '',
        login_type: '',
      }
    },
    handleEdit (data) {
      this.show_sideBar = true
      this.form = {
        enterprise_id: data.enterprise_id,
        enterprise_name: data.enterprise_name,
        enterprise_sn: data.enterprise_sn,
        login_type: data.login_type,
      }
    },
    handleClick (row) {
      const message = row.disabled == 0
        ? '是否启用？'
        : '是否禁用？'
      this.$confirm(message, '通知消息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        const result = await updateEnterpriseStaus(row.enterprise_id, { disabled: row.disabled == 1 ? 0 : 1, id: row.enterprise_id })
        if (result.data.data.status) {
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
          // this.$refs.finder.refresh()
          this.fetchList()
          this.resetData()
        }
      })
      console.log(row)
    },
    save () {
      // 如果没有id，则表示为新增
      if (!this.form.enterprise_id) {
        delete this.form.enterprise_id
        addEnterpriseInfo(this.form).then((res) => {
          this.$message({ type: 'success', message: '操作成功' })
          this.page.pageIndex = 1
          this.resetData()
          this.fetchList()
        })
      } else {
        updateEnterpriseInfo(this.form.enterprise_id, this.form).then((res) => {
          this.$message({ type: 'success', message: '操作成功' })
          this.fetchList()
          this.setChinaumspayVisible = false
        })
      }
    },
    fetchList () {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.params
      }
      getEnterpriseList(params).then((res) => {
        this.list = res.data.data.list
        this.total_count = res.data.data.total_count
        this.loading = false
      })
      console.log(this.list);
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
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
