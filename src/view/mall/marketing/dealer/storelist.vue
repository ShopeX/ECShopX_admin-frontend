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
                新增关联店铺
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
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="val => dateChange(val)"
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
import { createSetting } from '@shopex/finder'
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
      modalContent: '',
      statusList: [
        { label: '未入网', value: 1 },
        { label: '待审核', value: 2 },
        { label: '入网成功', value: 3 }
      ],
      typeList: [
        { label: '内扣', value: 'I' },
        { label: '外扣', value: 'O' }
      ]
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    setting() {
      return createSetting({
        columns: [
          { name: '店铺ID', key: 'distributor_id' },
          { name: '店铺名称', key: 'name' },
          { name: '联系人', key: 'contact' },
          { name: '联系方式', key: 'mobile' },
          {
            name: '状态',
            key: '',
            formatter: (h, { audit_state }) =>
              (audit_state == '2' && '待审核') ||
              (audit_state == '3' && '入网成功') ||
              (audit_state == '1' && '未入网')
          },
          {
            name: '手续费扣费方式',
            key: '',
            width: 130,
            formatter: (h, { split_ledger_info }) => {
              if (split_ledger_info && split_ledger_info.adapay_fee_mode) {
                return (
                  (split_ledger_info.adapay_fee_mode === 'O' && '外扣') ||
                  (split_ledger_info.adapay_fee_mode === 'I' && '内扣')
                )
              } else {
                return '-'
              }
            }
          },
          {
            name: '总帐分账占比',
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
            name: '创建日期',
            key: 'created',
            formatter: (h, { created }) =>
              created ? moment(created * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'
          }
        ],
        search: [
          { type: 'input', key: 'name', name: '店铺名称', placeholder: '请输入店铺名称' },
          { type: 'input', key: 'contact', name: '联系人', placeholder: '请输入联系人' },
          { type: 'input', key: 'mobile', name: '联系方式', placeholder: '请输入联系方式' },
          {
            type: 'select',
            key: 'audit_state',
            options: this.statusList,
            name: '状态',
            placeholder: '请选择'
          },
          { key: 'create_time', name: '创建时间', slot: 'create_time' },
          {
            type: 'select',
            key: 'adapay_fee_mode',
            options: this.typeList,
            name: '手续费扣费方式',
            placeholder: '请选择'
          }
        ],
        actions: [
          {
            name: '解除关联',
            key: 'relation',
            type: 'button',
            buttonType: 'text',
            visible: row => {
              return row.audit_state == 3 || row.audit_state == 1
            },
            action: {
              handler: row => this.handleModalClick('解除关联', row[0])
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
            ? '如解除关联，已入网成功的店铺需重新设置店铺所占分帐比例。'
            : `请确认是否解除该店铺与【${row.username}】的关联`
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
