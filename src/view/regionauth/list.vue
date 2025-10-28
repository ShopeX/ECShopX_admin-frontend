<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <div>
    <!--添加-->
    <div class="action-container">
      <el-button type="primary" icon="el-icon-circle-plus" @click="handleNew"> 新增区域 </el-button>
    </div>

    <el-table
      v-loading="loading"
      border
      :data="list"
      :height="wheight - 300"
      element-loading-text="数据加载中"
    >
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row)"> 编辑 </el-button>
          <el-button type="text" @click="handleDelete(scope)"> 删除 </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="attribute_name" label="区域">
        <template slot-scope="scope">
          <div>{{ scope.row.regionauth_name }}</div>
        </template>
</el-table-column
      ><el-table-column prop="attribute_name" label="状态">
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
    <sideBar :visible.sync="show_sideBar" :title="'区域编辑'">
      <el-form>
        <el-form-item label="区域名称">
          <el-input v-model="form.regionauth_name" maxlength="20" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save"> 提交 </el-button>
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
      this.$confirm('确认删除该区域么？')
        .then(_ => {
          delRegionauth(data.row.regionauth_id, []).then(res => {
            this.list.splice(data.$index, 1)
            this.$message({ type: 'success', message: '操作成功' })
          })
        })
        .catch(_ => {})
    },

    // 启用&禁用
    handleEnable(data) {
      let tip = ''
      let query = {}
      if (data.state === '1') {
        tip = '禁用'
        query = { enable: 0 }
      } else {
        tip = '启用'
        query = { enable: 1 }
      }

      this.$confirm('确认' + tip + '该区域么？')
        .then(_ => {
          enableRegionauth(data.regionauth_id, query).then(res => {
            this.$message({ type: 'success', message: '操作成功' })
            this.getList()
          })
        })
        .catch(_ => {})
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
        addRegionauth(this.form).then(res => {
          this.$message({ type: 'success', message: '操作成功' })
          this.params.page = 1
          this.resetData()
          this.getList()
        })
      } else {
        updateRegionauth(this.form.regionauth_id, this.form).then(res => {
          this.$message({ type: 'success', message: '操作成功' })
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
      getRegionauth(this.params).then(res => {
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
