<template>
  <div>
    <SpFinder
      ref="finder"
      url="/account/management"
      fixed-row-action
      row-actions-width="80px"
      :other-config="{}"
      no-selection
      :setting="tableSchema"
      :hooks="{
        beforeSearch
      }"
      row-actions-fixed-align="left"
      @reset="resetAction"
    >
      <template v-slot:tableTop>
        <div class="action-container">
          <el-button type="primary" icon="plus" @click="addLabels"> 添加账号 </el-button>
        </div>
      </template>
      <template v-slot:shop>
        <SpSelectShopV2
          ref="selectShop"
          v-model="params.distributor_id"
          clearable
          placeholder="请选择"
        />
      </template>
    </SpFinder>

    <!-- 添加、编辑标识-开始 -->
    <SpDialog
      ref="searchDialogRef"
      v-model="editVisible"
      :title="isEdit ? '编辑账号信息' : '添加账号信息'"
      :modal="false"
      :form="form"
      :form-list="formBaseRuleList"
      @onSubmit="submitAction"
    />

    <DistributorSelect
      :store-visible="DistributorVisible"
      :is-valid="true"
      :rel-data-ids="relDistributors"
      :get-status="DistributorStatus"
      :parent-params="{
        regionauth_id: form.regionauth_ids
      }"
      @chooseStore="DistributorChooseAction"
      @closeStoreDialog="closeDialogAction"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { createTableSchema, createFormSchema } from './normalstaffSchema'
import { pageMixin } from '@/mixins'
import DistributorSelect from '@/components/function/distributorSelect'
import { generatorParams } from '@/utils/schemaHelper.js'

import api from '@/api'

export default {
  components: {
    DistributorSelect
  },
  mixins: [pageMixin],
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      DistributorStatus: false,
      relDistributors: [],
      DistributorVisible: false,
      isEdit: false,
      editVisible: false,
      activeName: 'staff',

      detailData: {},
      params: {
        operator_type: 'staff',
        distributor_id: ''
      },
      operator_id: 0,
      rolesListData: [],
      areas: [],
      form: {
        ...generatorParams(createFormSchema(this)),
        operator_type: 'staff'
      }
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    tableSchema() {
      return createTableSchema(this)
    },
    formBaseRuleList() {
      return createFormSchema(this)
    }
  },
  watch: {
    status(val) {
      if (val) {
        this.fetchList()
      }
    }
  },
  mounted() {
    // 查询区域数据 和 角色列表
    const pros = [
      api.regionauth.getRegionauth(),
      api.company.getRolesList({ page: 1, pageSize: 100, version: 1 })
    ]
    Promise.all(pros).then((res) => {
      this.areas = res?.[0]?.list?.map((el) => ({
        value: el.regionauth_id,
        label: el.regionauth_name,
        title: el.regionauth_name
      }))
      this.rolesListData = res?.[1].list?.map((el) => ({
        value: el.role_id,
        label: el.role_name
      }))
      this.form = {
        ...generatorParams(createFormSchema(this)),
        operator_type: 'staff'
      }
    })
    this.fetchList()
  },
  methods: {
    resetAction() {
      this.params = {
        operator_type: 'staff',
        distributor_id: ''
      }
      this.fetchList()
    },
    fetchList() {
      this.$refs.finder.refresh(true)
    },
    // 删除所选店铺
    handleClose(item) {
      this.relDistributors = this.relDistributors.filter(
        (el) => el.distributor_id !== item.distributor_id
      )
      this.form.distributor_ids = this.relDistributors
    },
    // 选择店铺弹窗
    addDistributoreAction() {
      this.DistributorVisible = true
      this.DistributorStatus = true
    },
    beforeSearch(params) {
      params = {
        ...params,
        ...this.params
      }
      return params
    },
    // 添加账号
    addLabels() {
      this.editVisible = true
      this.isEdit = false
      this.operator_id = ''
      this.form = {
        ...generatorParams(createFormSchema(this)),
        operator_type: 'staff'
      }
      this.relDistributors = []
    },
    // 编辑账号
    editAction(row) {
      this.editVisible = true
      this.isEdit = true
      this.operator_id = row.operator_id

      this.form = {
        ...generatorParams(createFormSchema(this), row),
        password: '',
        role_id: row.role_data?.map((el) => el.role_id),
        distributor_ids: row?.distributor_ids?.map((el) =>
          el.distributor_id ? el.distributor_id : el
        ),
        regionauth_ids: row?.regionauth_ids?.map((el) => (el.regionauth_id ? el.regionauth_id : el))
      }
      this.getDistributor(row)
    },
    getDistributor(row) {
      let ids = row?.distributor_ids?.map((item) => item.distributor_id) || []
      if (!ids?.length) {
        this.relDistributors = []
        return
      }
      api.marketing.getDistributorList({ distributor_id: ids, is_app: 1 }).then((res) => {
        this.relDistributors = res.list
      })
    },
    async submitAction() {
      const _areaMap = this.areas?.reduce((pre, now) => {
        return {
          ...pre,
          [now.value]: now
        }
      }, {})
      const params = {
        ...this.form,
        distributor_ids: this.relDistributors?.map((distributor) => ({
          name: distributor.name,
          distributor_id: distributor.distributor_id
        })),
        regionauth_ids: this.form.regionauth_ids?.map((el) => {
          const res = _areaMap[el]
          return {
            regionauth_id: res.value,
            regionauth_name: res.label
          }
        }),
        operator_type: 'staff'
      }
      let response = null
      try {
        if (this.operator_id) {
          response = await api.company.updateAccountInfo(this.operator_id, params)
        } else {
          response = await api.company.createAccount(params)
        }
        this.detailData = response
        this.editVisible = false
        this.fetchList()
      } catch (error) {
        console.log(error)
      }
    },
    acitonDisabledAfter(row) {
      let params = {
        'operator_id': row.operator_id,
        'is_disable': row.is_disable ? 0 : 1
      }
      api.login.changeOperatorStatus(params).then((res) => {
        this.fetchList()
      })
    },
    acitonDisabled(val, row) {
      if (val == '1') {
        var msg = '此操作将会禁用该账号，是否继续?'
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.acitonDisabledAfter(row)
        })
      } else {
        this.acitonDisabledAfter(row)
      }
    },
    DistributorChooseAction(data) {
      this.DistributorVisible = false
      this.DistributorStatus = false
      if (data === null || data.length <= 0) return
      this.relDistributors = data
    },
    closeDialogAction() {
      this.DistributorStatus = false
      this.DistributorVisible = false
    },
    handleRegionauthChange(val) {
      // 区域变更 清空店铺选择
      this.form = {
        ...this.form,
        distributor_ids: []
      }
      this.relDistributors = []
    }
  }
}
</script>
<style scoped lang="scss">
.el-tag + .el-tag {
  margin-left: 5px;
}
.new-tag {
  height: 40px;
  line-height: 40px;
  padding-top: 0;
  padding-bottom: 0;
}
.button-new-tag {
  height: 40px;
  line-height: 40px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  height: 40px;
  line-height: 40px;
  width: 138px;
  vertical-align: bottom;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.grid-content {
  border-radius: 4px;
  min-height: 10px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
