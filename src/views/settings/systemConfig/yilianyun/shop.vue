<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpRouterView>
      <SpFinder
        ref="finder"
        url="espier/printer/shop"
        no-selection
        :setting="setting"
        :hooks="{ beforeSearch: beforeSearch }"
        border
      />
      <!-- 添加、编辑标识-开始 -->
      <el-dialog :title="editTitle" :visible.sync="editVisible" :before-close="handleCancel">
        <template>
          <el-form ref="form" :model="form" class="demo-ruleForm" label-width="120px">
            <el-form-item :label="$t('23a1c6ea.9d2ae7')">
              <el-input
                v-model="form.name"
                style="width: 300px"
                :placeholder="$t('23a1c6ea.9d2ae7')"
              />
            </el-form-item>
            <el-form-item :label="$t('23a1c6ea.295713')">
              <el-radio-group v-model="distributor">
                <el-radio :label="1">{{ $t('23a1c6ea.d166bb') }}</el-radio>
                <el-radio :label="2">{{ $t('23a1c6ea.295713') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="distributor == 2" :label="$t('23a1c6ea.baad7e')">
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
                {{ $t('23a1c6ea.a5d26b') }}
              </el-button>
            </el-form-item>
            <el-form-item :label="$t('23a1c6ea.c8e5e2')">
              <el-input
                v-model="form.app_terminal"
                style="width: 300px"
                :placeholder="$t('23a1c6ea.c8e5e2')"
              />
              <div class="frm-tips">{{ $t('23a1c6ea.4bf399') }}</div>
            </el-form-item>
            <el-form-item :label="$t('23a1c6ea.d73500')">
              <el-input
                v-model="form.app_key"
                style="width: 300px"
                :placeholder="$t('23a1c6ea.d73500')"
              />
              <div class="frm-tips">{{ $t('23a1c6ea.4bf399') }}</div>
            </el-form-item>
          </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="handleCancel">{{ $t('23a1c6ea.625fb2') }}</el-button>
          <el-button type="primary" @click="submitAction">{{ $t('23a1c6ea.be5fbb') }}</el-button>
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
    </SpRouterView>
  </SpPage>
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

      setting: {
        columns: [
          {
            name: this.$t('23a1c6ea.9d2ae7'),
            key: 'name'
          },
          {
            name: this.$t('23a1c6ea.2b6bc0'),
            key: 'actions',
            width: 180,
            render: (h, { row }) => {
              return h('div', [
                h(
                  'el-button',
                  {
                    props: {
                      type: 'normal'
                    },

                    on: {
                      click: () => this.editAction(row)
                    }
                  },
                  this.$t('23a1c6ea.95b351')
                ),
                h(
                  'el-button',
                  {
                    props: {
                      type: 'normal'
                    },
                    on: {
                      click: () => this.deleteAction(row)
                    }
                  },
                  this.$t('23a1c6ea.2f4aad')
                )
              ])
            }
          }
        ],
        actions: [
          {
            name: this.$t('23a1c6ea.f77b58'),
            key: 'add',
            type: 'button',
            buttonType: 'primary',
            icon: 'el-icon-plus',
            slot: 'header',
            action: {
              handler: () => {
                this.addLabels()
              }
            }
          }
        ]
      },
      form: {
        name: '',
        distributor_id: 0,
        app_terminal: '',
        app_key: '',
        type: 'yilianyun'
      }
    }
  },
  methods: {
    beforeSearch(params) {
      //SpFinder的params格式需要转换为接口需要的格式
      return {
        page: params.page || 1,
        pageSize: params.pageSize || 20
      }
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
      this.handleCancel()
      this.editTitle = this.$t('23a1c6ea.f1333f')
      this.editVisible = true
      this.isEdit = false
      this.distributor = 1
      this.id = ''
    },
    editAction(row) {
      //
      this.handleCancel()
      this.editTitle = this.$t('23a1c6ea.67b76a')
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
    deleteAction(row) {
      this.$confirm(this.$t('23a1c6ea.c8c187'), this.$t('23a1c6ea.02d981'), {
        confirmButtonText: this.$t('23a1c6ea.38cf16'),
        cancelButtonText: this.$t('23a1c6ea.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deletePrinter(row.id)
            .then((response) => {
              this.$message({ message: this.$t('23a1c6ea.0007d1'), type: 'success' })
              this.editVisible = false
              if (this.$refs.finder) {
                this.$refs.finder.refresh()
              }
            })
            .catch((error) => {
              this.$message({ message: this.$t('23a1c6ea.acf066'), type: 'error' })
            })
        })
        .catch(() => {
          //用户点击取消
        })
    },
    submitAction() {
      this.form.distributor_id = 0
      if (this.distributor == 2 && this.relDistributors.length > 0) {
        this.form.distributor_id = this.relDistributors[0].distributor_id
      }

      if (this.id) {
        updatePrinter(this.id, this.form)
          .then((response) => {
            this.$message({ message: this.$t('23a1c6ea.3b1083'), type: 'success' })
            this.editVisible = false
            if (this.$refs.finder) {
              this.$refs.finder.refresh()
            }
          })
          .catch((error) => {})
      } else {
        createPrinter(this.form)
          .then((response) => {
            this.$message({ message: this.$t('23a1c6ea.3fdaea'), type: 'success' })
            this.editVisible = false
            if (this.$refs.finder) {
              this.$refs.finder.refresh()
            }
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

<style scoped>
::v-deep .sp-finder .el-button--primary {
  @apply mt-[-15px] mb-5 !px-4 !py-2.5;
}
</style>
