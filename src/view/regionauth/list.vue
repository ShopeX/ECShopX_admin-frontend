<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <!--添加-->
    <div class="action-container">
      <el-button type="primary" icon="el-icon-circle-plus" @click="handleNew">
        {{ $t('3526e299.aa9286') }}
      </el-button>
    </div>

    <el-table
      v-loading="loading"
      border
      :data="list"
      :height="wheight - 300"
      :element-loading-text="$t('3526e299.f09b12')"
    >
      <el-table-column :label="$t('3526e299.2b6bc0')">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row)">
            {{ $t('3526e299.95b351') }}
          </el-button>
          <el-button type="text" @click="handleDelete(scope)">
            {{ $t('3526e299.2f4aad') }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="attribute_name" :label="$t('3526e299.d3ce40')">
        <template slot-scope="scope">
          <div>{{ scope.row.regionauth_name }}</div>
        </template> </el-table-column
      ><el-table-column prop="attribute_name" :label="$t('3526e299.3fea7c')">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.state === '1' ? true : false"
            @change="handleEnable(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="mt-4 text-right">
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

    <!--新增修改-->
    <sideBar :visible.sync="show_sideBar" :title="$t('3526e299.3c2de1')">
      <el-form>
        <el-form-item :label="$t('3526e299.faffe5')">
          <el-input v-model="form.regionauth_name" maxlength="20" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save"> {{ $t('3526e299.939d53') }} </el-button>
        </el-form-item>
      </el-form>
    </sideBar>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import imgPicker from '@/components/imageselect'
import sideBar from '@/components/element/sideBar'
import {
  getRegionauth,
  addRegionauth,
  updateRegionauth,
  delRegionauth,
  enableRegionauth
} from '../../api/regionauth'

export default {
  components: {
    sideBar,
    imgPicker
  },

  data() {
    return {
      loading: false,
      imgDialog: false,
      isGetImage: false,
      show_sideBar: false,
      // 提交数据
      form: {
        regionauth_id: '',
        regionauth_name: ''
      },
      // 搜索数据
      total_count: 0,
      params: {
        page: 1,
        pageSize: 10
      },
      // 列表数据
      list: []
    }
  },
  mounted() {
    this.handleCurrentChange()
  },
  methods: {
    // 新增编辑
    handleNew() {
      this.show_sideBar = true
      this.resetData()
    },
    // 编辑
    handleEdit(data) {
      this.show_sideBar = true
      this.form = {
        regionauth_id: data.regionauth_id,
        regionauth_name: data.regionauth_name
      }
    },
    // 删除
    handleDelete(data) {
      this.$confirm(this.$t('3526e299.d75e0c'))
        .then((_) => {
          delRegionauth(data.row.regionauth_id, []).then((res) => {
            this.list.splice(data.$index, 1)
            this.$message({ type: 'success', message: this.$t('3526e299.33130f') })
          })
        })
        .catch((_) => {})
    },

    // 启用&禁用
    handleEnable(data) {
      let confirmKey = ''
      let query = {}
      if (data.state === '1') {
        confirmKey = '3526e299.c5feac'
        query = { enable: 0 }
      } else {
        confirmKey = '3526e299.99cb03'
        query = { enable: 1 }
      }

      this.$confirm(this.$t(confirmKey))
        .then((_) => {
          enableRegionauth(data.regionauth_id, query).then((res) => {
            this.$message({ type: 'success', message: this.$t('3526e299.33130f') })
            this.getList()
          })
        })
        .catch((_) => {})
    },
    // 初始化
    resetData() {
      this.form = {
        regionauth_id: '',
        regionauth_name: ''
      }
    },
    // 保存数据
    save() {
      if (!this.form.regionauth_id) {
        addRegionauth(this.form).then((res) => {
          this.$message({ type: 'success', message: this.$t('3526e299.33130f') })
          this.params.page = 1
          this.resetData()
          this.getList()
        })
      } else {
        updateRegionauth(this.form.regionauth_id, this.form).then((res) => {
          this.$message({ type: 'success', message: this.$t('3526e299.33130f') })
          this.getList()
        })
      }
    },
    // 分页
    handleCurrentChange(page_num = 1) {
      this.params.page = page_num
      this.getList()
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getList()
    },
    // 获取列表
    getList() {
      console.log('获取数据')
      this.loading = true
      getRegionauth(this.params).then((res) => {
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
