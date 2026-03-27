<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.cus-dealer-store-page {
  .el-dialog__body {
    padding-top: 10px;
  }
  .cus-btn {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px !important;
  }
  .cus-title {
    font-size: 20px;
    font-weight: bold;
  }
  .cus-no-bot {
    margin-bottom: 0px !important;
  }
  .cus-btn-css {
    display: flex;
    justify-content: flex-end;
    .el-form-item {
      margin-right: 0px;
    }
  }
}
</style>
<template>
  <div class="cus-dealer-store-page">
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
        url="/adapay/dealer/distributors"
        @reset="onFinderReset"
      >
        <template #tableTop>
          <el-row class="cus-btn">
            <el-col :span="12" :offset="12" style="text-align: right">
              <el-button type="primary" size="small" plain @click="onAddShop">
                {{ $t('74751947.2db35d') }}
              </el-button>
            </el-col>
          </el-row>
        </template>
        <template #create_time>
          <el-date-picker
            v-model="create_time"
            class="input-m"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :start-placeholder="$t('74751947.b44c0f')"
            :end-placeholder="$t('74751947.1d468b')"
            @change="(val) => dateChange(val)"
          />
        </template>
      </SpFinder>
    </el-card>
    <RemoveShipModal
      :visible="visibleModal"
      :info="detailData"
      :content="modalContent"
      @handleClick="handleClick"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { createSetting } from '@shopex-ui/finder'
import RemoveShipModal from '@/view/mall/marketing/component/RemoveShipModal'

export default {
  components: { RemoveShipModal },
  data() {
    return {
      dealer_id: 0,
      username: '',
      create_time: '',
      form: {},
      detailData: {},
      visibleModal: false,
      modalContent: ''
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    statusList() {
      return [
        { label: this.$t('74751947.14f778'), value: 1 },
        { label: this.$t('74751947.5cb424'), value: 2 },
        { label: this.$t('74751947.4ad6e4'), value: 3 }
      ]
    },
    typeList() {
      return [
        { label: this.$t('74751947.75d29a'), value: 'I' },
        { label: this.$t('74751947.6c1506'), value: 'O' }
      ]
    },
    setting() {
      return createSetting({
        columns: [
          { name: this.$t('74751947.8fdefd'), key: 'distributor_id' },
          { name: this.$t('74751947.0d4934'), key: 'name' },
          { name: this.$t('74751947.52409d'), key: 'contact' },
          { name: this.$t('74751947.b58943'), key: 'mobile' },
          {
            name: this.$t('74751947.3fea7c'),
            key: '',
            formatter: (h, { audit_state }) =>
              (audit_state == '2' && this.$t('74751947.5cb424')) ||
              (audit_state == '3' && this.$t('74751947.4ad6e4')) ||
              (audit_state == '1' && this.$t('74751947.14f778'))
          },
          {
            name: this.$t('74751947.6e640f'),
            key: '',
            width: 130,
            formatter: (h, { split_ledger_info }) => {
              if (split_ledger_info && split_ledger_info.adapay_fee_mode) {
                return (
                  (split_ledger_info.adapay_fee_mode === 'O' && this.$t('74751947.6c1506')) ||
                  (split_ledger_info.adapay_fee_mode === 'I' && this.$t('74751947.75d29a'))
                )
              } else {
                return '-'
              }
            }
          },
          {
            name: this.$t('74751947.04dc22'),
            key: '',
            width: 130,
            formatter: (h, { split_ledger_info }) => {
              if (split_ledger_info && split_ledger_info.headquarters_proportion) {
                return split_ledger_info.headquarters_proportion + '%'
              } else {
                return '-'
              }
            }
          },
          {
            name: this.$t('74751947.696f5a'),
            key: 'created',
            formatter: (h, { created }) =>
              created ? moment(created * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'
          }
        ],
        search: [
          {
            type: 'input',
            key: 'name',
            name: this.$t('74751947.0d4934'),
            placeholder: this.$t('74751947.867738')
          },
          {
            type: 'input',
            key: 'contact',
            name: this.$t('74751947.52409d'),
            placeholder: this.$t('74751947.9e3f21')
          },
          {
            type: 'input',
            key: 'mobile',
            name: this.$t('74751947.b58943'),
            placeholder: this.$t('74751947.8f7e96')
          },
          {
            type: 'select',
            key: 'audit_state',
            options: this.statusList,
            name: this.$t('74751947.3fea7c'),
            placeholder: this.$t('74751947.708c9d')
          },
          { key: 'create_time', name: this.$t('74751947.eca37c'), slot: 'create_time' },
          {
            type: 'select',
            key: 'adapay_fee_mode',
            options: this.typeList,
            name: this.$t('74751947.6e640f'),
            placeholder: this.$t('74751947.708c9d')
          }
        ],
        actions: [
          {
            name: this.$t('74751947.6e46c0'),
            key: 'relation',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return row.audit_state == 3 || row.audit_state == 1
            },
            action: {
              handler: (row) => this.handleModalClick(this.$t('74751947.6e46c0'), row[0])
            }
          }
        ]
      })
    }
  },
  mounted() {
    if (this.$route.query.dealer_id) {
      this.dealer_id = this.$route.query.dealer_id
      this.username = this.$route.query.username
    }
  },
  methods: {
    beforeSearch(params) {
      params = {
        ...params,
        ...this.form,
        dealer_id: this.dealer_id
      }
      return params
    },
    onFinderReset() {
      this.create_time = ''
      this.form = {}
    },
    onAddShop() {
      this.$router.push({
        path: `/setting/staff/dealer_list/relation`,
        query: { dealer_id: this.dealer_id, username: this.username }
      })
    },
    handleModalClick(type, row) {
      if (row) {
        this.detailData = { ...row, store_name: row.name }
        this.modalContent =
          row.audit_state == '3'
            ? this.$t('74751947.712e6c')
            : this.$t('74751947.7b7ad6', { username: row.username })
      }
      this.visibleModal = true
    },
    handleClick() {
      this.visibleModal = false
      this.$refs.finder.refresh(true)
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    dateChange(val) {
      if (val) {
        this.form.time_start = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.form.time_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.form.time_start = undefined
        this.form.time_end = undefined
      }
    }
  }
}
</script>
