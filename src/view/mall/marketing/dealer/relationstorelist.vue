<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="cus-dealer-rel-page">
    <div>
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
          <template #create_time>
            <el-date-picker
              v-model="create_time"
              class="input-m"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :start-placeholder="$t('3f433608.b44c0f')"
              :end-placeholder="$t('3f433608.1d468b')"
              @change="(val) => dateChange(val)"
            />
          </template>
        </SpFinder>
      </el-card>
      <AddShipModal
        :visible="visibleModal"
        :info="detailData"
        :content="modalContent"
        @handleClick="handleModalClick"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { createSetting } from '@shopex-ui/finder'
import AddShipModal from '@/view/mall/marketing/component/AddShipModal'
export default {
  components: { AddShipModal },
  data() {
    return {
      dealer_id: 0,
      username: '',
      detailData: {},
      visibleModal: false,
      modalContent: '',
      statusList: [
        { label: this.$t('3f433608.14f778'), value: 1 },
        { label: this.$t('3f433608.5cb424'), value: 2 },
        { label: this.$t('3f433608.4ad6e4'), value: 3 }
      ],
      create_time: '',
      form: {}
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    setting() {
      return createSetting({
        columns: [
          { name: this.$t('3f433608.8fdefd'), key: 'distributor_id' },
          { name: this.$t('3f433608.0d4934'), key: 'name' },
          { name: this.$t('3f433608.52409d'), key: 'contact' },
          { name: this.$t('3f433608.b58943'), key: 'mobile' },
          {
            name: this.$t('3f433608.3fea7c'),
            key: '',
            formatter: (h, { audit_state }) =>
              (audit_state == '1' && this.$t('3f433608.14f778')) ||
              (audit_state == '2' && this.$t('3f433608.5cb424')) ||
              (audit_state == '3' && this.$t('3f433608.4ad6e4'))
          },
          {
            name: this.$t('3f433608.696f5a'),
            key: 'created',
            formatter: (h, { created }) =>
              created ? moment(created * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'
          }
        ],
        search: [
          {
            type: 'input',
            key: 'name',
            name: this.$t('3f433608.0d4934'),
            placeholder: this.$t('3f433608.867738')
          },
          {
            type: 'input',
            key: 'contact',
            name: this.$t('3f433608.52409d'),
            placeholder: this.$t('3f433608.9e3f21')
          },
          {
            type: 'input',
            key: 'mobile',
            name: this.$t('3f433608.b58943'),
            placeholder: this.$t('3f433608.8f7e96')
          },
          {
            type: 'select',
            key: 'audit_state',
            options: this.statusList,
            name: this.$t('3f433608.3fea7c'),
            placeholder: this.$t('3f433608.708c9d')
          },
          { key: 'create_time', name: this.$t('3f433608.eca37c'), slot: 'create_time' }
        ],
        actions: [
          {
            name: this.$t('3f433608.1c3cf7'),
            key: 'relation',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: (row) => this.handleModalClick(true, this.$t('3f433608.14f778'), row[0])
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
        dealer_id: 0
      }
      return params
    },
    onFinderReset() {
      this.create_time = ''
      this.form = {}
    },
    handleModalClick(visible, type, row) {
      if (row) {
        this.detailData = {
          ...row,
          store_name: row.name,
          username: this.username,
          operator_id: this.dealer_id
        }
        this.modalContent =
          row.audit_state == '3'
            ? this.$t('3f433608.cb3f8c')
            : this.$t('3f433608.454a59', [row.name, this.username])
      }
      this.visibleModal = visible
      if (!visible) this.$refs.finder.refresh(true)
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
