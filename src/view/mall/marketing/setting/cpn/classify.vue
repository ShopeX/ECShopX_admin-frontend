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
<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
.classify {
  .list {
    margin-top: 10px;
  }
}
</style>

<template>
  <div class="classify">
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
      <SpFilterFormItem prop="name" label="内容:">
        <el-input v-model="params.name" style="width: 300px" placeholder="请输入内容" />
      </SpFilterFormItem>
    </SpFilterForm>

    <div class="control">
      <el-button plain type="primary" style="margin-right: 10px" @click="addClassify">
        新增分类
      </el-button>
      <el-tooltip content="商户类型" placement="top" effect="light">
        <i class="el-icon-question" style="color: #888" />
      </el-tooltip>
    </div>

    <div class="list">
      <el-table
        :loading="loading"
        :data="tableList"
        style="width: 100%; margin-bottom: 20px"
        border
        row-key="id"
        default-expand-all
        :default-sort="{ prop: 'sort', order: 'ascending' }"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @sort-change="fnSort"
      >
        <el-table-column prop="name" label="分类名称" />
        <el-table-column prop="is_show" label="是否可见">
          <template slot-scope="scope">
            <span>{{ scope.row.is_show == '1' ? '可见' : '不可见' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" sortable="custom">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.sort"
              type="number"
              min="0"
              :style="{ width: '100px' }"
              @change="callbackConfirm(scope.row, 'edit')"
            />
          </template>
        </el-table-column>
        <el-table-column prop="date" label="操作">
          <template slot-scope="scope">
            <template v-if="scope.row.children">
              <el-button type="text" size="small" @click.native.prevent="addRow(scope.row)">
                新增子类
              </el-button>
            </template>
            <el-button type="text" size="small" @click.native.prevent="editRow(scope.row)">
              编辑
            </el-button>
            <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template v-if="AddClassifyBox.visible">
      <AddClassifyBox
        :edit-info="editInfo"
        :visible="AddClassifyBox.visible"
        :parent_id="AddClassifyBox.parent_id"
        :parent_name="AddClassifyBox.parent_name"
        @switchBoxHandle="switchBoxHandle"
        @callbackConfirm="callbackConfirm"
      />
    </template>
  </div>
</template>

<script>
import {
  deleteMerchantsClassification,
  editMerchantsClassification,
  addMerchantsClassification
} from '@/api/mall/marketing.js'
import AddClassifyBox from '@/components/addClassifyBox'
import mixin, { pageMixin } from '@/mixins'

export default {
  components: {
    AddClassifyBox
  },
  mixins: [mixin, pageMixin],
  data() {
    return {
      AddClassifyBox: {
        visible: false,
        parent_id: '',
        parent_name: ''
      },
      loading: false,
      editInfo: null, //当前编辑数据
      params: {
        name: '',
        sort_order_by: 'asc' //按排序字段进行排序 asc:正序 desc:倒序
      }
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    addClassify() {
      this.AddClassifyBox.parent_name = ''
      this.AddClassifyBox.parent_id = '0'
      this.editInfo = {}
      this.switchBoxHandle()
    },
    fnSort({ order }) {
      if (order == 'ascending') {
        this.params.sort_order_by = 'asc'
        this.onSearch()
      } else {
        this.params.sort_order_by = 'desc'
        this.onSearch()
      }
    },
    addRow(row) {
      this.editInfo = row
      this.editInfo.type = 'add'
      this.AddClassifyBox.parent_id = row.id
      this.AddClassifyBox.parent_name = row.name
      this.switchBoxHandle()
    },
    editRow(row) {
      console.log(row)
      this.editInfo = row
      this.editInfo.type = 'edit'
      this.AddClassifyBox = {
        visible: true,
        parent_id: row.cur_level,
        parent_name: row.parent_id != '0' ? this.queryParent(row.parent_id).name : null
      }
      // this.queryParent(row.parent_id)
    },
    // 查找id
    queryParent(id) {
      return this.tableList.find(item => {
        return item.id == id
      })
    },
    async deleteRow(row) {
      const { id } = row
      this.$confirm('确认删除吗？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const result = await deleteMerchantsClassification(id)
        if (result.data.data.status) {
          this.$message.success('删除成功')
          this.onSearch()
        }
      })
    },
    async callbackConfirm(row, type) {
      console.log(row, type)
      console.log(this.editInfo)
      // you row 代表是主页面input 更改 、没有是弹窗更改
      if (type == 'edit') {
        const { name, sort, is_show } = row
        const result = await editMerchantsClassification(
          row.id || (this.editInfo && this.editInfo.id),
          { name, sort, is_show }
        )
        console.log(result)
        if (result.data.data.status) {
          this.$message.success('编辑成功')
          this.switchBoxHandle(true)
          this.onSearch()
        }
      } else {
        const { name, sort, is_show, parent_id } = row
        const result = await addMerchantsClassification({ name, sort, is_show, parent_id })
        if (result.data.data.status) {
          this.$message.success('添加成功')
          this.switchBoxHandle(true)
          this.onSearch()
        }
      }
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.params
      }
      const res = await this.$api.mall_marketing.getMerchantsClassification(params)
      this.tableList = res
      //   this.page.total = total_count
      this.loading = false
    },
    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    onReset() {
      this.params = { ...this.initialParams }
      this.onSearch()
    },
    switchBoxHandle(status) {
      if (status) {
        this.AddClassifyBox.visible = false
      } else {
        this.AddClassifyBox.visible = true
      }
    }
  }
}
</script>
