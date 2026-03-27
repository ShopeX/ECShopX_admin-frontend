<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
      <SpFilterFormItem prop="name" :label="$t('0b8d30ed.46253d')">
        <el-input v-model="params.name" style="width: 300px" :placeholder="$t('0b8d30ed.a11cc7')" />
      </SpFilterFormItem>
    </SpFilterForm>

    <div class="control">
      <el-button plain type="primary" style="margin-right: 10px" @click="addClassify">
        {{ $t('0b8d30ed.b6cb2b') }}
      </el-button>
      <el-tooltip :content="$t('0b8d30ed.4709c8')" placement="top" effect="light">
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
        <el-table-column prop="name" :label="$t('0b8d30ed.04d7d8')" />
        <el-table-column prop="is_show" :label="$t('0b8d30ed.afe561')">
          <template slot-scope="scope">
            <span>{{
              scope.row.is_show == '1' ? $t('0b8d30ed.4d681c') : $t('0b8d30ed.545a3b')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" :label="$t('0b8d30ed.c360e9')" sortable="custom">
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
        <el-table-column prop="date" :label="$t('0b8d30ed.2b6bc0')">
          <template slot-scope="scope">
            <template v-if="scope.row.children">
              <el-button type="text" size="small" @click.native.prevent="addRow(scope.row)">
                {{ $t('0b8d30ed.82537d') }}
              </el-button>
            </template>
            <el-button type="text" size="small" @click.native.prevent="editRow(scope.row)">
              {{ $t('0b8d30ed.95b351') }}
            </el-button>
            <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.row)">
              {{ $t('0b8d30ed.2f4aad') }}
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
      return this.tableList.find((item) => {
        return item.id == id
      })
    },
    async deleteRow(row) {
      const { id } = row
      this.$confirm(this.$t('0b8d30ed.0947bf'), '', {
        confirmButtonText: this.$t('0b8d30ed.38cf16'),
        cancelButtonText: this.$t('0b8d30ed.625fb2'),
        type: 'warning'
      }).then(async () => {
        const result = await deleteMerchantsClassification(id)
        if (result.data.data.status) {
          this.$message.success(this.$t('0b8d30ed.0007d1'))
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
          this.$message.success(this.$t('0b8d30ed.3bb47b'))
          this.switchBoxHandle(true)
          this.onSearch()
        }
      } else {
        const { name, sort, is_show, parent_id } = row
        const result = await addMerchantsClassification({ name, sort, is_show, parent_id })
        if (result.data.data.status) {
          this.$message.success(this.$t('0b8d30ed.3fdaea'))
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
