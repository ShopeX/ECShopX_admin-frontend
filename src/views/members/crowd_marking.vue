<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpRouterView>
    <SpPage class="page-order-order-setting">
      <SpFormPlus
        ref="searchForm"
        v-model="params"
        form-type="searchForm"
        :inline="true"
        label-width="100px"
        :form-items="searchFormItems"
        @submit="onSearch"
        @reset="onReset"
      />

      <div class="action-container mt-4">
        <el-button type="primary" @click="handleCreate"> 创建人群 </el-button>
      </div>

      <SpFinder
        ref="finder"
        :setting="finderSetting"
        :row-key="getRowKeys"
        url="/member/segment-rule"
        :page-size="pageSize"
        :hooks="{
          beforeSearch: beforeSearch,
          afterRequest: afterRequest
        }"
        @selection-change="handleSelectionChange"
      />
    </SpPage>
  </SpRouterView>
</template>

<script>
import { mapGetters } from 'vuex'
import { createSetting } from '@shopex-ui/finder'

export default {
  provide() {
    return {
      refresh: () => {
        // 在调用时才访问 finder，确保 ref 已经初始化
        if (this.$refs.finder && this.$refs.finder.refresh) {
          this.$refs.finder.refresh()
        }
      }
    }
  },
  data() {
    return {
      pageSize: 20, // 每页条数
      params: {
        tag_name: '',
        created: []
      },
      searchFormItems: [
        {
          formItemClass: 'w-1/3',
          component: 'input',
          componentProps: {
            placeholder: '请输入标签名称',
            clearable: true
          },
          fieldName: 'tag_name',
          label: '标签名称'
        },
        {
          formItemClass: 'w-2/4',
          component: 'datetimepicker',
          componentProps: {
            type: 'datetimerange',
            rangeSeparator: '至',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            format: 'timestamp',
            valueFormat: 'yyyy-MM-dd'
          },
          fieldName: 'created',
          label: '创建时间',
          size: 'small'
        }
      ],
      finderSetting: null,
      selectedRows: []
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    formList() {
      return [
        {
          label: '标签名称',
          key: 'name',
          type: 'input',
          required: true,
          placeholder: '请输入标签名称'
        },
        {
          label: '人群说明',
          key: 'description',
          type: 'textarea',
          required: true,
          placeholder: '请输入人群说明',
          component: ({ key }, value) => {
            return (
              <el-input
                type='textarea'
                v-model={value[key]}
                placeholder='请输入人群说明'
                rows={4}
              />
            )
          }
        }
      ]
    }
  },
  mounted() {
    this.initFinderSetting()
  },
  methods: {
    initFinderSetting() {
      const vm = this
      this.finderSetting = createSetting({
        columns: [
          {
            name: '标签名称',
            key: 'rule_name',
            width: 200
          },
          {
            name: '人群说明',
            key: 'description',
            minWidth: 300
          },
          {
            name: '创建时间',
            key: 'created',
            width: 180
          }
        ],
        actions: [
          {
            name: '详情',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([row]) => vm.handleDetail(row)
            }
          }
        ]
      })
    },
    getRowKeys(row) {
      return row.rule_id
    },
    beforeSearch(params) {
      // 更新 pageSize，使用用户选择的分页大小
      if (params.pageSize) {
        this.pageSize = params.pageSize
      }
      const finderParams = {
        page: params.page || 1,
        pageSize: params.pageSize || this.pageSize,
        ...this.params
      }
      // 处理日期范围
      if (
        finderParams.created &&
        Array.isArray(finderParams.created) &&
        finderParams.created.length === 2
      ) {
        finderParams.created_start = finderParams.created[0] / 1000
        finderParams.created_end = finderParams.created[1] / 1000
      } else {
        finderParams.created_start = ''
        finderParams.created_end = ''
      }
      delete finderParams.created
      return finderParams
    },
    async afterRequest(response) {
      const data = response.data.data || response.data
      const { list, total_count } = data

      return {
        list: list || [],
        count: total_count || 0
      }
    },
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    onReset() {
      this.params = {
        tag_name: '',
        created: []
      }
      this.$nextTick(() => {
        this.$refs.finder.refresh(true)
      })
    },
    handleCreate() {
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    handleDetail(row) {
      this.$router.push({ path: this.matchRoutePath('editor'), query: { id: row.rule_id } })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该标签,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            // await this.$api.member.deleteAudience(row.id)
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.$refs.finder.refresh()
          } catch (error) {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleSelectionChange(selection) {
      this.selectedRows = selection
    },
    async handleSubmit() {
      try {
        this.$refs.finder.refresh(true)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-order-order-setting {
  .action-container {
    margin-bottom: 16px;
    .el-button {
      margin-right: 10px;
    }
  }
}
</style>
