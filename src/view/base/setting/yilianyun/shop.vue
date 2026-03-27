<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-button type="primary" icon="plus" @click="addLabels">
{{
          $t('5f64f748.f77b58')
        }}
</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="printerShopList">
      <el-table-column prop="name" :label="$t('5f64f748.9d2ae7')" />
      <el-table-column :label="$t('5f64f748.2b6bc0')">
        <template slot-scope="scope">
          <el-button size="mini" @click="editAction(scope.$index, scope.row)">
{{
            $t('5f64f748.95b351')
          }}
</el-button>
          <el-button size="mini" @click="deleteAction(scope.$index, scope.row)">
{{
            $t('5f64f748.2f4aad')
          }}
</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total_count > params.pageSize" class="content-center content-top-padded">
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="params.page"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 添加、编辑标识-开始 -->
    <el-dialog :title="editTitle" :visible.sync="editVisible" :before-close="handleCancel">
      <template>
        <el-form ref="form" :model="form" class="demo-ruleForm" label-width="120px">
          <el-form-item :label="$t('5f64f748.9d2ae7')">
            <el-input
              v-model="form.name"
              style="width: 300px"
              :placeholder="$t('5f64f748.9d2ae7')"
            />
          </el-form-item>
          <el-form-item :label="$t('5f64f748.295713')">
            <el-radio-group v-model="distributor">
              <el-radio :label="1">{{ $t('5f64f748.d166bb') }}</el-radio>
              <el-radio :label="2">{{ $t('5f64f748.295713') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="distributor == 2" :label="$t('5f64f748.baad7e')">
            <el-tag
              v-for="(item, index) in relDistributors"
              :key="index"
              class="new-tag"
              closable
              :disable-transitions="false"
              @close="handleClose(index)"
            >
              {{ item.name }}
            </el-tag>
            <el-button size="medium" class="button-new-tag" @click="addDistributoreAction">
              {{ $t('5f64f748.a5d26b') }}
            </el-button>
          </el-form-item>
          <el-form-item :label="$t('5f64f748.c8e5e2')">
            <el-input
              v-model="form.app_terminal"
              style="width: 300px"
              :placeholder="$t('5f64f748.9d2ae7')"
            />
            <div class="frm-tips">{{ $t('5f64f748.4bf399') }}</div>
          </el-form-item>
          <el-form-item :label="$t('5f64f748.d73500')">
            <el-input
              v-model="form.app_key"
              style="width: 300px"
              :placeholder="$t('5f64f748.9d2ae7')"
            />
            <div class="frm-tips">{{ $t('5f64f748.4bf399') }}</div>
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel">{{ $t('5f64f748.625fb2') }}</el-button>
        <el-button type="primary" @click="submitAction">{{ $t('5f64f748.be5fbb') }}</el-button>
      </div>
    </el-dialog>
    <DistributorSelect
      :store-visible="DistributorVisible"
      :is-valid="isValid"
      :rel-data-ids="relDistributors"
      :get-status="DistributorStatus"
      @chooseStore="DistributorChooseAction"
      @closeStoreDialog="closeDialogAction"
    />
  </div>
</template>
<script>
import {
  getPrinterShopList,
  createPrinter,
  updatePrinter,
  deletePrinter
} from '../../../../api/printer'
import { getDistributorList } from '@/api/marketing'

import DistributorSelect from '@/components/function/distributorOneSelect'

export default {
  components: {
    DistributorSelect
  },
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      distributor: 1,
      DistributorStatus: false,
      DistributorVisible: false,
      isValid: false,
      isEdit: false,
      editVisible: false,
      editTitle: '',
      relDistributors: [],
      printerShopList: [],
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20
      },
      id: '',
      form: {
        name: '',
        distributor_id: 0,
        app_terminal: '',
        app_key: '',
        type: 'yilianyun'
      }
    }
  },
  mounted() {
    this.getPrinterShopList()
  },
  methods: {
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getPrinterShopList()
    },
    getPrinterShopList() {
      getPrinterShopList(this.params).then((res) => {
        this.printerShopList = res.data.data.list
      })
    },
    handleClose(index) {
      this.relDistributors.splice(index, 1)
      this.form.distributor_id = 0
    },
    addDistributoreAction() {
      this.DistributorVisible = true
      this.DistributorStatus = true
    },
    getDistributor(ids) {
      let param = { distributor_id: ids }
      getDistributorList(param).then((res) => {
        this.relDistributors = res.data.data.list
      })
    },
    handleCancel() {
      this.editVisible = false
      this.id = ''
      this.form.name = ''
      this.distributor = 1
      this.form.distributor_id = 0
      this.form.app_terminal = ''
      this.form.app_key = ''
      this.relDistributors = []
    },
    addLabels() {
      //
      this.handleCancel()
      this.editTitle = this.$t('5f64f748.f1333f')
      this.editVisible = true
      this.isEdit = false
      this.distributor = 1
      this.id = ''
    },
    editAction(index, row) {
      //
      this.handleCancel()
      this.editTitle = this.$t('5f64f748.67b76a')
      this.editVisible = true
      this.isEdit = true
      if (0 == row.distributor_id) {
        this.distributor = 1
      } else {
        this.distributor = 2
      }
      this.id = row.id
      this.form.name = row.name
      this.form.distributor_id = row.distributor_id
      this.form.app_terminal = row.app_terminal
      this.form.app_key = row.app_key
      this.form.type = row.type
      if (row.distributor_id) {
        let ids = []
        ids.push(row.distributor_id)
        this.getDistributor(ids)
      }
    },
    deleteAction(index, row) {
      //
      this.$confirm(this.$t('5f64f748.c8c187'), this.$t('5f64f748.02d981'), {
        confirmButtonText: this.$t('5f64f748.38cf16'),
        cancelButtonText: this.$t('5f64f748.625fb2'),
        type: 'warning'
      }).then(() => {
        deletePrinter(row.id)
          .then((response) => {
            this.$message({ message: this.$t('5f64f748.0007d1'), type: 'success' })
            this.editVisible = false
            this.getPrinterShopList()
          })
          .catch((error) => {})
      })
    },
    submitAction() {
      //
      this.form.distributor_id = 0
      if (this.distributor == 2 && this.relDistributors.length > 0) {
        this.form.distributor_id = this.relDistributors[0].distributor_id
      }

      if (this.id) {
        updatePrinter(this.id, this.form)
          .then((response) => {
            this.$message({ message: this.$t('5f64f748.3b1083'), type: 'success' })
            this.editVisible = false
            this.getPrinterShopList()
          })
          .catch((error) => {})
      } else {
        createPrinter(this.form)
          .then((response) => {
            this.$message({ message: this.$t('5f64f748.3fdaea'), type: 'success' })
            this.editVisible = false
            this.getPrinterShopList()
            this.handleCancel()
          })
          .catch((error) => {})
      }
    },
    DistributorChooseAction(data) {
      this.DistributorVisible = false
      this.DistributorStatus = false
      if (data === null || data.length <= 0) return
      this.relDistributors = data
    },
    ShopChooseAction(data) {
      this.ShopVisible = false
      this.ShopStatus = false
      if (data === null || data.length <= 0) return
      this.relShops = data
    },
    closeDialogAction() {
      this.ShopVisible = false
      this.ShopStatus = false
      this.DistributorStatus = false
      this.DistributorVisible = false
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
</style>
