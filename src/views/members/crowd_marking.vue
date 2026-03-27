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
        <el-button type="primary" @click="handleCreate">{{ $t('c9953411.bef304') }}</el-button>
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
      searchFormItems: [],
      finderSetting: null,
      selectedRows: []
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    formList() {
      const t = this.$t.bind(this)
      return [
        {
          label: t('c9953411.341fe8'),
          key: 'name',
          type: 'input',
          required: true,
          placeholder: t('c9953411.6f81f3')
        },
        {
          label: t('c9953411.5893e9'),
          key: 'description',
          type: 'textarea',
          required: true,
          placeholder: t('c9953411.ff913c'),
          component: ({ key }, value) => {
            return (
              <el-input
                type='textarea'
                v-model={value[key]}
                placeholder={t('c9953411.ff913c')}
                rows={4}
              />
            )
          }
        }
      ]
    }
  },
  mounted() {
    const t = this.$t.bind(this)
    this.searchFormItems = [
      {
        formItemClass: 'w-1/3',
        component: 'input',
        componentProps: {
          placeholder: t('c9953411.6f81f3'),
          clearable: true
        },
        fieldName: 'tag_name',
        label: t('c9953411.341fe8')
      },
      {
        formItemClass: 'w-2/4',
        component: 'datetimepicker',
        componentProps: {
          type: 'datetimerange',
          rangeSeparator: t('c9953411.981cbe'),
          startPlaceholder: t('c9953411.b44c0f'),
          endPlaceholder: t('c9953411.1d468b'),
          format: 'timestamp',
          valueFormat: 'yyyy-MM-dd'
        },
        fieldName: 'created',
        label: t('c9953411.eca37c'),
        size: 'small'
      }
    ]
    this.initFinderSetting()
  },
  methods: {
    initFinderSetting() {
      const vm = this
      const t = vm.$t.bind(vm)
      this.finderSetting = createSetting({
        columns: [
          {
            name: t('c9953411.341fe8'),
            key: 'rule_name',
            width: 200
          },
          {
            name: t('c9953411.5893e9'),
            key: 'description',
            minWidth: 300
          },
          {
            name: t('c9953411.eca37c'),
            key: 'created',
            width: 180
          }
        ],
        actions: [
          {
            name: t('c9953411.f26225'),
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
      this.$confirm(this.$t('c9953411.b1b628'), this.$t('c9953411.02d981'), {
        confirmButtonText: this.$t('c9953411.38cf16'),
        cancelButtonText: this.$t('c9953411.625fb2'),
        type: 'warning'
      })
        .then(async () => {
          try {
            // await this.$api.member.deleteAudience(row.id)
            this.$message({
              type: 'success',
              message: this.$t('c9953411.0007d1')
            })
            this.$refs.finder.refresh()
          } catch (error) {
            this.$message({
              type: 'error',
              message: this.$t('c9953411.acf066')
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('c9953411.c34281')
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
