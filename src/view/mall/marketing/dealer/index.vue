<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.cus-dealer-page {
  .el-dialog__body {
    padding-top: 10px;
    padding-bottom: 15px;
  }
  .el-card:first-child {
    .el-card__body {
      padding-bottom: 0px !important;
    }
  }
  .cus-btn {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px !important;
  }
  .cus-no-bot {
    margin-bottom: 0px !important;
  }
}
</style>
<template>
  <div class="cus-dealer-page">
    <div
      v-if="$route.path.indexOf('detail') === -1 && $route.path.indexOf('detail/storelist') === -1"
    >
      <el-card>
        <SpFinder
          ref="finder"
          :no-selection="true"
          :setting="setting"
          :search-row-count="3"
          :splict-count="3"
          :hooks="{
            beforeSearch: beforeSearch
          }"
          url="/adapay/dealer/list"
          @reset="onFinderReset"
        >
          <template #tableTop>
            <el-row class="cus-btn">
              <el-button type="primary" plain size="mini" @click="handleClose(true)">
                {{ $t('d41d8cd9.ooo1pp') }}
              </el-button>
            </el-row>
          </template>
          <template #create_time>
            <el-date-picker
              v-model="create_time"
              class="input-m"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :start-placeholder="$t('bf067b2b.b44c0f')"
              :end-placeholder="$t('bf067b2b.1d468b')"
              @change="(val) => dateChange('create', val)"
            />
          </template>
          <template #open_time>
            <el-date-picker
              v-model="open_time"
              class="input-m"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :start-placeholder="$t('bf067b2b.b44c0f')"
              :end-placeholder="$t('bf067b2b.1d468b')"
              @change="(val) => dateChange('open', val)"
            />
          </template>
        </SpFinder>
      </el-card>
      <el-dialog
        :title="$t('bf067b2b.02d981')"
        :visible.sync="visibleModal"
        width="25%"
        :close-on-click-modal="false"
        @before-close="handleOpenOpeartion(false, '')"
      >
        <el-row style="text-aligin: center">
          <p>{{ modalContent }}</p>
          <p>{{ subTitle }}</p>
        </el-row>
        <el-row style="text-align: right">
          <el-button type="primary" size="small" plain @click="handleModalConfirm(false)">
            {{ $t('d41d8cd9.t4u5v6') }}
          </el-button>
          <el-button type="primary" size="small" @click="handleModalConfirm(true)">
            {{ $t('d41d8cd9.w7x8y9') }}
          </el-button>
        </el-row>
      </el-dialog>
      <AddModal :visible="addVisible" @handleClose="handleClose" />
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { createSetting } from '@shopex-ui/finder'
import { setDealerStatus, resertPassword } from '@/api/marketing'
import AddModal from './AddModal.vue'
import moment from 'moment'
export default {
  components: { AddModal },
  computed: {
    ...mapGetters(['wheight']),
    setting() {
      return createSetting({
        columns: [
          { name: this.$t('bf067b2b.9019dc'), key: 'username' },
          { name: this.$t('bf067b2b.52409d'), key: 'contact' },
          { name: this.$t('bf067b2b.09a1f6'), key: 'mobile' },
          {
            name: this.$t('bf067b2b.eca37c'),
            key: 'created',
            formatter: (h, { created }) =>
              created ? moment(created * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'
          },
          {
            name: this.$t('bf067b2b.2a507b'),
            key: 'adapay_open_account_time',
            formatter: (h, { adapay_open_account_time }) =>
              adapay_open_account_time
                ? moment(adapay_open_account_time * 1000).format('YYYY-MM-DD HH:mm:ss')
                : '-'
          }
        ],
        search: [
          {
            type: 'input',
            key: 'username',
            name: this.$t('bf067b2b.9019dc'),
            placeholder: this.$t('bf067b2b.0c098b')
          },
          {
            type: 'input',
            key: 'contact',
            name: this.$t('bf067b2b.52409d'),
            placeholder: this.$t('bf067b2b.9e3f21')
          },
          {
            type: 'input',
            key: 'mobile',
            name: this.$t('bf067b2b.09a1f6'),
            placeholder: this.$t('bf067b2b.7b540b')
          },
          { key: 'create_time', name: this.$t('bf067b2b.eca37c'), slot: 'create_time' },
          { key: 'open_time', name: this.$t('bf067b2b.2a507b'), slot: 'open_time' }
          // { type: 'date-range', key: 'create_time', name: '创建时间', start: 'time_start', end: 'time_end' },
          // { type: 'date-range', key: 'open_time', name: '开户时间', start: 'open_account_start', end: 'open_account_end' }
        ],
        actions: [
          {
            name: this.$t('bf067b2b.f26225'),
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            // slot: 'header',
            action: {
              type: 'link',
              handler: (row) => {
                this.$router.push({
                  path: this.matchRoutePath('detail'),
                  query: { operator_id: row[0].operator_id }
                })
              }
            }
          },
          {
            name: this.$t('bf067b2b.198425'),
            key: 'show',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return row.adapay_open_account_time
            },
            action: {
              handler: (row) => {
                this.$router.push({
                  path: this.matchRoutePath('storelist'),
                  query: { dealer_id: row[0].operator_id, username: row[0].username }
                })
              }
            }
          },
          {
            name: this.$t('bf067b2b.cc42dd'),
            key: 'on',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return row.is_disable === 1
            },
            action: {
              handler: (row) => this.handleOpenOpeartion(true, this.$t('bf067b2b.cc42dd'), row[0])
            }
          },
          {
            name: this.$t('bf067b2b.710ad0'),
            key: 'off',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return row.is_disable === 0
            },
            action: {
              handler: (row) => this.handleOpenOpeartion(true, this.$t('bf067b2b.710ad0'), row[0])
            }
          },
          {
            name: this.$t('bf067b2b.0719aa'),
            key: 'resert',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: (row) => this.handleeResertPass(true, row[0])
            }
          }
        ]
      })
    }
  },
  data() {
    return {
      dataUrl: `${process.env.VUE_APP_BASE_API}/adapay/dealer/list`,
      rowDate: {},
      create_time: '',
      open_time: '',
      loading: false,
      visibleModal: false,
      modalType: '',
      modalContent: '',
      subTitle: '',
      addVisible: false,
      form: {}
    }
  },
  methods: {
    beforeSearch(params) {
      params = {
        ...params,
        ...this.form
      }
      return params
    },
    onFinderReset() {
      this.create_time = ''
      this.open_time = ''
      this.form = {}
    },
    handleOpenOpeartion(visivle, type, rowDate) {
      this.rowDate = rowDate
      this.modalContent =
        type === this.$t('bf067b2b.cc42dd')
          ? this.$t('bf067b2b.c8fbcd')
          : this.$t('bf067b2b.e6d19f')
      this.visibleModal = visivle
      this.modalType = type
      this.subTitle = ''
    },
    handleeResertPass(visivle, rowDate) {
      this.rowDate = rowDate
      this.modalContent = `${this.$t('d41d8cd9.qqq3rr')}${rowDate.username}${this.$t(
        'd41d8cd9.sss5tt'
      )}`
      this.subTitle = this.$t('d41d8cd9.uuu7vv')
      this.visibleModal = visivle
    },
    handleModalConfirm(visible) {
      const { is_disable, operator_id } = this.rowDate
      if (visible) {
        let url = this.subTitle ? resertPassword : setDealerStatus
        let parmas = this.subTitle
          ? operator_id
          : { is_disable: is_disable === 0 ? 1 : 0, operator_id: operator_id }
        url(parmas).then((res) => {
          this.visibleModal = false
          this.modalType = ''
          this.modalContent = ''
          this.$message({
            message: this.$t('bf067b2b.33130f'),
            type: 'success'
          })
        })
        this.$refs.finder.refresh()
      } else {
        this.visibleModal = false
        this.modalType = ''
        this.modalContent = ''
        this.subTitle = ''
      }
    },
    handleClose(visible) {
      if (!visible) {
        this.$refs.finder.refresh()
      }
      this.addVisible = visible
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    dateChange(type, val) {
      if (val) {
        if (type == 'create') {
          this.form.time_start = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
          this.form.time_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
        } else {
          this.form.open_account_start = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
          this.form.open_account_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
        }
      } else {
        if (type == 'create') {
          this.form.time_start = undefined
          this.form.time_end = undefined
        } else {
          this.form.open_account_start = undefined
          this.form.open_account_end = undefined
        }
      }
    }
  }
}
</script>
