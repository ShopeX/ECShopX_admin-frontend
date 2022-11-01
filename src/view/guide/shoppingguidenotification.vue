<template>
  <div>
    <div
      v-if="$route.path.indexOf('editor') === -1"
      class="shoppingguidenotification"
    >
      <el-row>
        <el-col>
          <el-select
            v-model="searchData.status"
            placeholder="请选择"
          >
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model="searchData.title"
            class="input-b"
            placeholder="请输入通知名称"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handelClickSearch"
            />
          </el-input>
          <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            @click="handelClickAdd"
          >
            新增通知
          </el-button>
        </el-col>
      </el-row>
      <!-- table -->
      <el-card>
        <el-table
          v-loading="loadingTable"
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            prop="title"
            label="通知标题"
          />
          <el-table-column
            prop="created"
            label="创建时间"
          >
            <template slot-scope="scope">
              {{ timestampToTime(scope.row.created) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="updated"
            label="最后一次发送时间"
          >
            <template slot-scope="scope">
              {{ timestampToTime(scope.row.last_sent_time) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="withdraw"
            label="发送状态"
          >
            <template slot-scope="scope">
              {{ scope.row.status | sendingState }}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="
                  () =>
                    $router.push({
                      path: matchHidePage('editor'),
                      query: { id: scope.row.notice_id }
                    })
                "
              >
                编辑
              </el-button>
              <el-button
                v-if="scope.row.status != 1"
                type="text"
                @click="
                  () => {
                    temporary = scope.row
                    showSeeModule = true
                  }
                "
              >
                查看
              </el-button>
              <el-button
                v-if="scope.row.status != 2"
                type="text"
                @click="
                  () => {
                    temporary = scope.row
                    showSendModule = true
                  }
                "
              >
                发送
              </el-button>
              <el-button
                v-if="scope.row.status == 2"
                type="text"
                @click="handelClickRevoke(scope.row)"
              >
                撤回发送
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="content-padded content-center"
          background
          :current-page="paging.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="paging.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="paging.total_count"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-card>
      <!-- 查看 -->
      <el-dialog
        title="查看通知发送状态"
        :visible.sync="showSeeModule"
        width="700"
        :before-close="
          () => {
            showSeeModule = false
          }
        "
      >
        <el-form
          v-loading="loading"
          :model="seeDataForm"
          label-width="100px"
        >
          <el-form-item
            label="通知时间："
          >
            {{ seeDataForm.last_sent_time | formatDataTime }}
            {{ seeDataForm.status | sendingState }}
          </el-form-item>
          <el-form-item
            v-if="seeDataForm.all_distributor == 1"
            label="通知店铺："
          >
            全部
          </el-form-item>
          <el-form-item
            v-if="seeDataForm.all_distributor == 0"
            label="通知店铺："
          >
            <el-tag
              v-for="(item, index) in seeDataForm.distributors"
              :key="index"
              size="size"
            >
              {{
                item.name
              }}
            </el-tag>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 发送通知 -->
      <el-dialog
        v-loading="loading"
        title="发送通知"
        :visible.sync="showSendModule"
        width="700"
        :before-close="
          () => {
            showSendModule = false
          }
        "
      >
        <div class="flex">
          <div class="label">
            选择通知门店：
          </div>
          <div>
            <el-radio
              v-model="sendDataForm.radio"
              label="1"
            >
              全部门店
            </el-radio>
            <el-radio
              v-model="sendDataForm.radio"
              label="2"
            >
              选择门店
            </el-radio>
          </div>
        </div>
        <div class="flex ma-t">
          <div class="label">
            通知门店：
          </div>
          <div v-if="sendDataForm.radio == 1">
            全部
          </div>
          <div v-if="sendDataForm.radio == 2">
            <div>
              <ul class="flex">
                <li
                  v-for="item in distributor_info"
                  :key="item.distributor_id"
                  class="ma-r"
                >
                  <el-tag>{{ item.name }}</el-tag>
                </li>
              </ul>
            </div>
            <el-button
              class="ma-t"
              type="primary"
              @click="
                () => {
                  ;(distributorVisible = true), (setDistributorStatus = true)
                }
              "
            >
              选择店铺
            </el-button>
          </div>
        </div>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="showSendModule = false">取 消</el-button>
          <el-button
            type="primary"
            @click="handelClickSendOut"
          >确 定</el-button>
        </span>
      </el-dialog>
      <DistributorSelect
        :store-visible="distributorVisible"
        :is-valid="true"
        :get-status="setDistributorStatus"
        @chooseStore="handelClickDistributor"
        @closeStoreDialog="distributorVisible = false"
      />
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import DistributorSelect from '@/components/storeListSelect'

import {
  getSalespersonoticeList,
  delSalespersonoticeWithdrawnotice,
  setSalespersonoticeSendnotice,
  getSalespersonoticeDetail
} from '@/api/marketing'

export default {
  components: {
    DistributorSelect
  },
  provide () {
    return {
      refresh: this.fetchList
    }
  },
  filters: {
    sendingState (v) {
      if (v == 1) {
        return '未发送'
      }
      if (v == 2) {
        return ' 已发送'
      }
      return '已撤回'
    }
  },
  data () {
    return {
      loadingTable: false,
      loading: false,
      stateOptions: [
        {
          value: '0',
          label: '全部'
        },
        {
          value: '1',
          label: '已发送'
        },
        {
          value: '2',
          label: '未发送'
        },
        {
          value: '3',
          label: '已撤回'
        }
      ],
      searchData: {
        status: '0', //状体
        title: '' //标题
      },
      tableData: [],
      paging: {
        //分页
        page: 1,
        page_size: 10,
        total_count: 0
      },
      showSeeModule: false, //查看
      seeDataForm: {
        radio: '1',
        shop: ''
      },
      showSendModule: false, //发送通知
      sendDataForm: {
        radio: '1'
      },

      distributorVisible: false, //选择店铺组件
      setDistributorStatus: false,
      distributor_info: [],
      distributor_id: [],

      temporary: null //临时存储
    }
  },
  watch: {
    showSeeModule (val) {
      if (val) {
        this._getSalespersonoticeDetail()
      }
      console.log('val', val)
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted () {
    this.handelClickSearch()
  },
  methods: {
    resetPage () {
      this.paging = {
        page: 1,
        page_size: 10,
        total_count: 0
      }
    },

    fetchList () {
      this.resetPage()
      this.handelClickSearch()
    },

    /**
     * 搜索
     * */
    async handelClickSearch () {
      let { page, page_size } = this.paging
      let { title, status } = this.searchData

      let params = {
        page,
        page_size,
        title,
        status
      }
      this.loadingTable = true

      let { data } = await getSalespersonoticeList(params)

      this.tableData = data.data.list

      this.paging.total_count = data.data.total_count

      this.loadingTable = false
    },

    /**
     * 分页
     * */
    handleCurrentChange (val) {
      this.paging.page = val
      this.handelClickSearch()
    },
    // 时间戳转日期格式
    timestampToTime (timestamp) {
      var date = new Date(timestamp * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var YY = date.getFullYear() + '-'
      var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
      var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return YY + MM + DD + ' ' + hh + mm + ss
    },

    /**
     * 新增消息通知
     * */

    handelClickAdd (id) {
      this.$router.push({ path: this.matchHidePage('editor') })
    },

    /**
     * 撤回发送
     * */
    handelClickRevoke (row) {
      let notice_id = row.notice_id
      this.checkWithdrawnotice(async () => {
        let data = await delSalespersonoticeWithdrawnotice({ notice_id })

        this.resetPage()

        this.handelClickSearch()

        this.$message({
          type: 'success',
          message: '撤回成功!'
        })
      })
    },
    checkWithdrawnotice (callback) {
      this.$confirm('撤回后，对应店铺的导购将无法再看到次通知?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        callback()
      })
    },

    /**
     * 选择店铺
     * */
    handelClickDistributor (data) {
      this.distributorVisible = false
      if (data === null || data.length <= 0) return
      this.distributor_info = data
      let distributor_id = []
      for (var i = 0; i < data.length; i++) {
        if (distributor_id.indexOf(Number(data[i].distributor_id)) < 0) {
          distributor_id.push(Number(data[i].distributor_id))
        }
      }
      this.distributor_id = distributor_id
    },

    /**
     * 发送导购通知
     * */
    async handelClickSendOut () {
      let params = {
        notice_id: this.temporary.notice_id,
        distributor_id:
          this.sendDataForm.radio == '1' ? 'all' : JSON.parse(JSON.stringify(this.distributor_id))
      }
      this.loading = true

      if (params.distributor_id !== 'all' && this.distributor_id.length === 0) {
        this.$message.error('请选择店铺')
        return
      }
      this.loading = false

      console.log('params', params)

      // return;
      this.showSendModule = false

      let { data } = await setSalespersonoticeSendnotice(params)

      this.$message({
        message: '发送成功',
        type: 'success'
      })

      this.distributor_id = []
      this.sendDataForm.radio = '1'
      this.handelClickSearch()
    },

    /**
     * 获取导购通知
     * */
    async _getSalespersonoticeDetail () {
      this.loading = true

      let { data } = await getSalespersonoticeDetail({
        notice_id: this.temporary.notice_id,
        with_log: 1
      })
      this.seeDataForm = data.data
      this.loading = false
      console.log('_getSalespersonoticeDetail', data)
    },
    handleSizeChange (val) {
      this.paging.page = 1
      this.paging.page_size = val
      this.handelClickSearch()
    }
  }
}
</script>

<style scoped lang="scss">
.shoppingguidenotification {
  .flex {
    display: flex;
  }
  &-header {
    height: 73px;
  }
  .label {
    width: 105px;
  }
  .ma-t {
    margin-top: 30px;
  }
  .ma-r {
    margin-right: 20px;
  }
}
</style>
