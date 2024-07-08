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
          <template v-slot:tableTop>
            <el-row class="cus-btn">
              <el-button type="primary" plain size="mini" @click="handleClose(true)">
                新增经销商
              </el-button>
            </el-row>
          </template>
          <template v-slot:create_time>
            <el-date-picker
              v-model="create_time"
              class="input-m"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="(val) => dateChange('create', val)"
            />
          </template>
          <template v-slot:open_time>
            <el-date-picker
              v-model="open_time"
              class="input-m"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="(val) => dateChange('open', val)"
            />
          </template>
        </SpFinder>
      </el-card>
      <el-dialog
        title="提示"
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
            取消
          </el-button>
          <el-button type="primary" size="small" @click="handleModalConfirm(true)">
            确认
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
import { createSetting } from '@shopex/finder'
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
          { name: '经销商', key: 'username' },
          { name: '联系人', key: 'contact' },
          { name: '联系电话', key: 'mobile' },
          {
            name: '创建时间',
            key: 'created',
            formatter: (h, { created }) =>
              created ? moment(created * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'
          },
          {
            name: '开户时间',
            key: 'adapay_open_account_time',
            formatter: (h, { adapay_open_account_time }) =>
              adapay_open_account_time
                ? moment(adapay_open_account_time * 1000).format('YYYY-MM-DD HH:mm:ss')
                : '-'
          }
        ],
        search: [
          { type: 'input', key: 'username', name: '经销商', placeholder: '请输入经销商' },
          { type: 'input', key: 'contact', name: '联系人', placeholder: '请输入联系人' },
          { type: 'input', key: 'mobile', name: '联系电话', placeholder: '请输入联系电话' },
          { key: 'create_time', name: '创建时间', slot: 'create_time' },
          { key: 'open_time', name: '开户时间', slot: 'open_time' }
          // { type: 'date-range', key: 'create_time', name: '创建时间', start: 'time_start', end: 'time_end' },
          // { type: 'date-range', key: 'open_time', name: '开户时间', start: 'open_account_start', end: 'open_account_end' }
        ],
        actions: [
          {
            name: '详情',
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            // slot: 'header',
            action: {
              type: 'link',
              handler: (row) => {
                this.$router.push({
                  path: this.matchHidePage('detail'),
                  query: { operator_id: row[0].operator_id }
                })
              }
            }
          },
          {
            name: '查看关联店铺',
            key: 'show',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return row.adapay_open_account_time
            },
            action: {
              handler: (row) => {
                this.$router.push({
                  path: this.matchHidePage('storelist'),
                  query: { dealer_id: row[0].operator_id, username: row[0].username }
                })
              }
            }
          },
          {
            name: '开启',
            key: 'on',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return row.is_disable === 1
            },
            action: {
              handler: (row) => this.handleOpenOpeartion(true, '开启', row[0])
            }
          },
          {
            name: '禁用',
            key: 'off',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return row.is_disable === 0
            },
            action: {
              handler: (row) => this.handleOpenOpeartion(true, '禁用', row[0])
            }
          },
          {
            name: '重置密码',
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
        type === '开启'
          ? '如开启该经销商，与之关联的已入网成功的店铺也将被开启，总部将参与分账，请确认是否开启该经销商。'
          : '如禁用该经销商，与之关联的已入网成功的店铺也将被禁用，总部不在参与分账，请确认是否禁用该经销商。'
      this.visibleModal = visivle
      this.modalType = type
      this.subTitle = ''
    },
    handleeResertPass(visivle, rowDate) {
      this.rowDate = rowDate
      this.modalContent = `请确认是否重置【${rowDate.username}】的密码`
      this.subTitle = '（新密码将以短信形式发送至其联系人的手机号上，短信费用将从短信余额中扣除）'
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
            message: '操作成功',
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
