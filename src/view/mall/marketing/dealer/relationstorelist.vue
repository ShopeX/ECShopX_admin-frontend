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
          <template v-slot:create_time>
            <el-date-picker
              v-model="create_time"
              class="input-m"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
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
import { createSetting } from '@shopex/finder'
import AddShipModal from '@/view/mall/marketing/component/AddShipModal'
export default {
  components: { AddShipModal },
  data () {
    return {
      dealer_id: 0,
      username: '',
      detailData: {},
      visibleModal: false,
      modalContent: '',
      statusList: [
        { label: '未入网', value: 1 },
        { label: '待审核', value: 2 },
        { label: '入网成功', value: 3 }
      ],
      create_time: '',
      form: {}
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    setting () {
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
              (audit_state == '1' && '未入网') ||
              (audit_state == '2' && '待审核') ||
              (audit_state == '3' && '入网成功')
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
          { key: 'create_time', name: '创建时间', slot: 'create_time' }
        ],
        actions: [
          {
            name: '关联',
            key: 'relation',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: (row) => this.handleModalClick(true, '未入网', row[0])
            }
          }
        ]
      })
    }
  },
  mounted () {
    if (this.$route.query.dealer_id) {
      this.dealer_id = this.$route.query.dealer_id
      this.username = this.$route.query.username
    }
  },
  methods: {
    beforeSearch (params) {
      params = {
        ...params,
        ...this.form,
        dealer_id: 0
      }
      return params
    },
    onFinderReset () {
      this.create_time = ''
      this.form = {}
    },
    handleModalClick (visible, type, row) {
      if (row) {
        this.detailData = {
          ...row,
          store_name: row.name,
          username: this.username,
          operator_id: this.dealer_id
        }
        this.modalContent =
          row.audit_state == '3'
            ? '如新增关联，已入网成功的店铺需重新设置店铺所占分帐比例。'
            : `请确认是否将【${row.name}】与【${this.username}】关联`
      }
      this.visibleModal = visible
      if (!visible) this.$refs.finder.refresh()
    },
    dateStrToTimeStamp (str) {
      return Date.parse(new Date(str)) / 1000
    },
    dateChange (val) {
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
