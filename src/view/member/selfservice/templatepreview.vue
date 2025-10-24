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
    <div v-if="$route.path.indexOf('detail') === -1 && $route.path.indexOf('editor') === -1">
      <el-row class="content-bottom-padded" :gutter="20">
        <el-col :span="4">
          开启体测：
          <el-switch v-model="setting.status" active-color="#13ce66" inactive-color="#ff4949" />
        </el-col>
      </el-row>
      <el-row v-if="setting.status == 1" class="content-bottom-padded" :gutter="20">
        <el-col v-if="setting.status == 1 && setting.temp_id != 0" :span="4">
          <div>当前体测模板：{{ setting.temp_name }}</div>
        </el-col>
        <el-col :span="4">
          <el-button round @click="batchChooseFormwork"> 选择体测模板 </el-button>
        </el-col>
      </el-row>
      <el-card v-if="setting.status == 1 && setting.temp_id != 0" shadow="never">
        <el-table v-loading="loading" :data="ItemsList" :height="wheight - 280">
          <el-table-column prop="mobile" label="会员手机号" width="140" />
          <el-table-column prop="username" label="姓名" width="120" />
          <el-table-column
            v-for="(col, index) in colsTitle"
            :key="index"
            :prop="col.prop"
            :label="col.label"
            width="100"
          />
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <i class="iconfont icon-search-plus" @click="goToDetail(scope.$index, scope.row)"
                >详情</i
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="content-center content-top-padded">
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
      </el-card>
      <el-dialog title="选择体侧模板" class="right-dialog" :visible.sync="FormworkVisible">
        <template>
          <el-form ref="formwork" :model="formwork">
            <el-form-item>
              <el-radio-group v-model="formwork.resource">
                <el-radio v-for="(item, index) in FormworkList" :key="index" :label="item.id">
                  {{ item.tem_name }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="content-center">
              <el-button type="primary" @click="onSubmitFormwork"> 确定添加 </el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import {
  saveSetting,
  getSettingList,
  getSettingInfo,
  updateSetting,
  deleteSetting,
  restoreSetting,
  getTemplateList,
  physicalFirst,
  physicalNormal,
  allUserList
} from '../../../api/selfhelpform'
export default {
  provide() {
    return {
      refresh: this.getDataList
    }
  },
  data() {
    return {
      loading: false,
      formwork: {
        resource: ''
      },
      setting: {
        status: 0,
        temp_id: 1,
        temp_name: null
      },
      total_count: 0,
      colsTitle: [],
      ItemsList: [],
      // ItemsList: [{
      //   mobile: '1391111111',
      //   user_name: 'ceshi',
      //   key_index: [
      //     {score: 99, name: 'ddd'},
      //     {score: 99, name: 'ddd'},
      //     {score: 99, name: 'ddd'},
      //     {score: 99, name: 'ddd'},
      //     {score: 99, name: 'ddd'},
      //   ]
      // }],
      params: {
        page: 1,
        pageSize: 10,
        tem_name: '',
        tem_type: 'basic_entry',
        is_valid: 1
      },
      list_parmas: {
        page: 1,
        pageSize: 10
      },
      FormworkVisible: false,
      FormworkList: []
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {},
  mounted() {
    this.physicalFirst()
  },
  methods: {
    physicalFirst() {
      this.$nextTick(() => {
        physicalFirst().then(response => {
          if (response.data.data.status == 1) {
            this.physicalNormal({
              status: Number(response.data.data.status),
              temp_id: response.data.data.temp_id,
              temp_name: response.data.data.temp_name
            })
          }
          this.setting.status = Boolean(response.data.data.status)
          this.setting.temp_id = response.data.data.temp_id
          this.setting.temp_name = response.data.data.temp_name
        })
      })
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getDataList()
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getDataList()
    },
    // 模板列表
    getFormworkList() {
      this.loading = true
      getTemplateList(this.params).then(response => {
        this.FormworkList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    // 拉取列表数据
    batchChooseFormwork() {
      this.getFormworkList()
      this.FormworkVisible = true
    },
    onSubmitFormwork() {
      this.physicalNormal({
        status: Number(this.setting.status),
        temp_id: this.formwork.resource,
        temp_name: this.setting.temp_name
      })
      this.FormworkVisible = false
    },
    physicalNormal(query) {
      physicalNormal(query).then(response => {
        this.getDataList()
      })
    },
    // 加载列表数据
    getDataList(list_parmas) {
      allUserList(list_parmas).then(response => {
        this.colsTitle = response.data.data.colstitle
        this.ItemsList = response.data.data.list
      })
    },
    goToDetail(index, row) {
      // this.$router.push({ path: this.matchRoutePath('detail/') + row.user_id })
      this.$router.push({
        path: this.matchRoutePath('detail'),
        query: {
          user_id: row.user_id
        }
      })
    }
  }
}
</script>
