<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-card header="搜索" class="search-card">
      <SpFormPlus
        v-model="form"
        form-type="searchForm"
        :form-items="formItems"
        :inline="true"
        @submit="handleSearch"
        @reset="handleReset"
      />
    </el-card>
    <el-card header="物流列表">
      <el-row :gutter="40">
        <el-col v-for="(item, index) in list" :key="index" :xs="8" :sm="6" :md="6" :lg="6" :xl="4">
          <LogisticsBlock :info="item" :disabled="index === 0" @refreshList="getList" />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getLogisticsList } from '@/api/logistics'
import LogisticsBlock from './component/logisticsBlock'
export default {
  components: { LogisticsBlock },
  data() {
    return {
      form: {
        corp_name: '',
        status: 0
      },
      statusOptions: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '启用'
        },
        {
          value: 2,
          label: '关闭'
        }
      ],
      formItems: [
        {
          fieldName: 'corp_name',
          label: '物流名称',
          cellWidth: 2,
          component: 'input',
          componentProps: {
            placeholder: '请输入物流公司名称'
          }
        },
        {
          fieldName: 'status',
          label: '物流状态',
          component: 'select',
          componentProps: {
            placeholder: '请选择',
            clearable: true,
            options: [
              {
                value: 0,
                label: '全部'
              },
              {
                value: 1,
                label: '启用'
              },
              {
                value: 2,
                label: '关闭'
              }
            ]
          }
        }
      ],
      list: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleReset: function () {
      this.form = {
        corp_name: '',
        status: 0
      }
      this.getList()
    },
    handleSearch: function () {
      this.getList()
    },
    getList: function () {
      getLogisticsList({
        ...this.form
      }).then((res) => {
        const {
          data: {
            data: { list }
          }
        } = res
        this.list = list
      })
    }
  }
}
</script>

<style scoped lang="scss">
.search-card {
  ::v-deep .sp-form-plus--search-form {
    background-color: white;
  }
}
</style>
