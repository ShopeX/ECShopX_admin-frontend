<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div class="action-container">
      <el-button type="primary" icon="el-icon-circle-plus" @click="handleNew">
        {{ $t('7e801404.111e3a') }}
      </el-button>
    </div>

    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="enterprise_name" :label="$t('7e801404.1a1bc7')">
        <el-input v-model="params.enterprise_name" :placeholder="$t('7e801404.8ded4d')" />
      </SpFilterFormItem>
    </SpFilterForm>

    <el-table
      v-loading="loading"
      border
      :data="list"
      :height="wheight - 170"
      :element-loading-text="$t('7e801404.f09b12')"
      :default-sort="{ prop: 'bind_date', order: 'descending' }"
    >
      <el-table-column label="ID" prop="enterprise_id" />
      <el-table-column prop="enterprise_name" :label="$t('7e801404.f47e27')" />
      <el-table-column prop="enterprise_sn" :label="$t('7e801404.705f0a')" />

      <el-table-column prop="login_type" :label="$t('7e801404.78cbe8')">
        <template slot-scope="scope">
          <span v-if="scope.row.login_type == 'mobile'">{{ $t('7e801404.cbbfff') }}</span>
          <span v-else-if="scope.row.login_type == 'email'">{{ $t('7e801404.fc2898') }}</span>
          <span v-else-if="scope.row.login_type == 'account'">{{ $t('7e801404.efae77') }}</span>
          <span v-else>{{ scope.row.login_type }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="disabled" :label="$t('7e801404.3fea7c')">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-s-tools" @click="handleClick(scope.row)">
            {{ scope.row.disabled == 0 ? $t('7e801404.7854b5') : $t('7e801404.710ad0') }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('7e801404.2b6bc0')">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row)">
            {{ $t('7e801404.95b351') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-4 text-right">
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
    <sideBar :visible.sync="show_sideBar" :title="$t('7e801404.13118a')">
      <el-form>
        <el-form-item :label="$t('7e801404.f47e27')">
          <el-input v-model="form.enterprise_name" />
        </el-form-item>
        <el-form-item :label="$t('7e801404.705f0a')">
          <el-input v-model="form.enterprise_sn" />
        </el-form-item>
        <el-form-item :label="$t('7e801404.78cbe8')">
          <el-select v-model="form.login_type" style="width: 100%">
            <el-option :label="$t('7e801404.8098e2')" value="mobile" />
            <el-option :label="$t('7e801404.7035c6')" value="account" />
            <el-option :label="$t('7e801404.3bc5e6')" value="email" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">{{ $t('7e801404.939d53') }}</el-button>
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
  data() {
    return {
      form: {
        enterprise_id: '',
        enterprise_name: '',
        enterprise_sn: '',
        login_type: ''
      },
      params: {
        enterprise_name: ''
      },
      list: [],
      loading: false,
      brand_name: '',
      total_count: 0,
      show_sideBar: false,
      setChinaumspayVisible: false
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    handleNew() {
      this.show_sideBar = true
      this.resetData()
    },
    resetData() {
      this.form = {
        enterprise_id: '',
        enterprise_name: '',
        enterprise_sn: '',
        login_type: ''
      }
    },
    handleEdit(data) {
      this.show_sideBar = true
      this.form = {
        enterprise_id: data.enterprise_id,
        enterprise_name: data.enterprise_name,
        enterprise_sn: data.enterprise_sn,
        login_type: data.login_type
      }
    },
    handleClick(row) {
      const message = row.disabled == 0 ? this.$t('7e801404.c93817') : this.$t('7e801404.40df5a')
      this.$confirm(message, this.$t('7e801404.59a702'), {
        confirmButtonText: this.$t('7e801404.38cf16'),
        cancelButtonText: this.$t('7e801404.625fb2'),
        type: 'warning',
        center: true
      }).then(async () => {
        const result = await updateEnterpriseStaus(row.enterprise_id, {
          disabled: row.disabled == 1 ? 0 : 1,
          id: row.enterprise_id
        })
        if (result.data.data.status) {
          this.$message({
            type: 'success',
            message: this.$t('7e801404.a3869d')
          })
          this.fetchList()
          this.resetData()
        }
      })
      console.log(row)
    },
    save() {
      // 如果没有id，则表示为新增
      if (!this.form.enterprise_id) {
        delete this.form.enterprise_id
        addEnterpriseInfo(this.form).then((res) => {
          this.$message({ type: 'success', message: this.$t('7e801404.33130f') })
          this.page.pageIndex = 1
          this.resetData()
          this.fetchList()
        })
      } else {
        updateEnterpriseInfo(this.form.enterprise_id, this.form).then((res) => {
          this.$message({ type: 'success', message: this.$t('7e801404.33130f') })
          this.fetchList()
          this.setChinaumspayVisible = false
        })
      }
    },
    fetchList() {
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
      console.log(this.list)
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
