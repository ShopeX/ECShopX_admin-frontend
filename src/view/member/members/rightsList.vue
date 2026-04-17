<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style type="text/css" lang="scss">
.right-dialog {
  .el-transfer-panel {
    width: 240px;
  }
  .el-transfer-panel__footer {
    height: 38px;
    clear: both;
  }
}
.transfer-footer {
  padding: 6px 5px;
}
.alert-txt {
  padding: 15px 0;
}
.delay-dialog {
  .el-textarea {
    width: 80%;
    vertical-align: middle;
  }
  .option-box {
    padding: 15px 0;
    .el-date-editor {
      width: 70%;
    }
  }
}
</style>

<template>
  <div>
    <el-row class="filter-header" :gutter="20">
      <el-col>
        <!--distributors wxshops 需要哪个api传哪个-->
        <shop-select wxshops @update="shopHandle" />
        <el-input
          v-model="searchMobile"
          class="input-m"
          :placeholder="$t('5e1e35aa.8098e2')"
          clearable
        >
          <el-button slot="append" icon="el-icon-search" @click="numberSearch" />
        </el-input>
        <el-date-picker
          v-model="create_time"
          type="daterange"
          value-format="yyyy/MM/dd"
          :placeholder="$t('5e1e35aa.4b8cb9')"
          @change="dateChange"
        />
        <el-select
          v-model="rights_from"
          :placeholder="$t('5e1e35aa.d5c816')"
          @change="rightsFromHandle"
        >
          <el-option
            v-for="(item, index) in rightsFrom"
            :key="index"
            :label="item.name"
            :value="item.type"
          />
        </el-select>
        <el-switch
          v-model="valid"
          active-color="#13ce66"
          :inactive-text="$t('5e1e35aa.572682')"
          inactive-color="#efefef"
          @change="changeOpen()"
        />
        <el-button type="primary" @click="exportData">{{ $t('5e1e35aa.55405e') }}</el-button>
        <el-popover
          placement="top-start"
          width="200"
          trigger="hover"
          :content="$t('5e1e35aa.676480')"
        >
          <i slot="reference" class="el-icon-question" />
        </el-popover>
      </el-col>
    </el-row>
    <el-dialog
      :title="$t('5e1e35aa.cc93e2')"
      :visible.sync="downloadView"
      :close-on-click-modal="false"
    >
      <template v-if="downloadUrl">
        <a :href="downloadUrl" download>{{ downloadName }}</a>
      </template>

      <!-- <template v-if="dataList.length > 0">
        <div class="code-span" v-for="(item, index) in dataSpan" :class="{'cur': index === codespanIndex}" @click="codeSpanChoose(index)">
          <span>{{item}}</span>
          <span class="bg-waiting" v-if="index === codespanIndex && !isdownloadOk"><i class="el-icon-loading"></i></span>
          <span class="download-ok" v-if="index === codespanIndex && isdownloadOk"><i class="el-icon-circle-check"></i></span>
        </div>
      </template> -->
    </el-dialog>
    <el-card>
      <el-table v-loading="loading" :data="rightsList" :height="wheight - 150">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div v-for="(info, idx) in scope.row.label_infos" :key="idx">
              <span>{{ $t('5e1e35aa.b87551') }}</span
              ><el-tag type="success">
                {{ info.label_name }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="rights_name" :label="$t('5e1e35aa.d7ec2d')" min-width="140" />
        <el-table-column prop="rights_from" :label="$t('5e1e35aa.26ca20')" min-width="100" />
        <el-table-column prop="mobile" :label="$t('5e1e35aa.8098e2')" min-width="90" />
        <el-table-column prop="total_num" :label="$t('5e1e35aa.8887e3')">
          <template slot-scope="scope">
            <span v-if="scope.row.is_not_limit_num == 2">{{ scope.row.total_num }}</span>
            <span v-if="scope.row.is_not_limit_num == 1">{{ $t('5e1e35aa.53e5df') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="total_consum_num" :label="$t('5e1e35aa.d6004a')" />
        <el-table-column :label="$t('5e1e35aa.1fa23f')">
          <template slot-scope="scope">
            <span>{{ scope.row.end_time | datetime }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('5e1e35aa.3fea7c')" min-width="100">
          <template slot-scope="scope">
            <template v-if="scope.row.is_not_limit_num == 2">
              <el-tag v-if="scope.row.total_num == scope.row.total_consum_num" size="mini">
                {{ $t('5e1e35aa.535023') }}
              </el-tag>
            </template>
            <template v-if="scope.row.is_not_limit_num == 1">
              <el-tag size="mini">{{ $t('5e1e35aa.53e5df') }}</el-tag>
            </template>
            <el-tag v-else-if="scope.row.is_valid == '1'" size="mini" type="success">
              {{ $t('5e1e35aa.c6cc39') }}
            </el-tag>
            <el-tag v-else size="mini">{{ $t('5e1e35aa.4d5ccd') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('5e1e35aa.2b6bc0')" min-width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="delayAction(scope.row)">
              {{ $t('5e1e35aa.e6095e') }}
            </el-button>
            <el-button size="mini" @click="transferAction(scope.row)">
              {{ $t('5e1e35aa.9aa883') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-4 text-right">
        <el-pagination
          :current-page.sync="params.page"
          :total="total_count"
          :page-size="params.pageSize"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 添加、编辑标识-开始 -->
    <el-dialog
      :title="$t('5e1e35aa.ba6956')"
      class="right-dialog"
      :visible.sync="addRightsDialog"
      :before-close="handleCancelLabelsDialog"
    >
      <template>
        <el-form>
          <el-form-item label-width="100px" :label="$t('5e1e35aa.8098e2')">
            <el-col :span="9">
              <el-input v-model="mobile" :placeholder="$t('5e1e35aa.d89f8a')" />
            </el-col>
          </el-form-item>
          <el-form-item label-width="100px" :label="$t('5e1e35aa.015d03')">
            <el-transfer
              v-model="addRightsItems"
              :titles="[$t('5e1e35aa.437974'), $t('5e1e35aa.543b04')]"
              :data="goodsList"
            >
              <div slot="left-footer" class="transfer-footer">
                <el-pagination
                  v-if="goods_total_count > goodsParams.pageSize"
                  small
                  layout="prev, pager, next"
                  :total="goods_total_count"
                  :page-size="goodsParams.pageSize"
                  @current-change="handleGoodsChange"
                />
              </div>
            </el-transfer>
          </el-form-item>
          <el-form-item class="content-center">
            <el-button type="primary" @click="onSubmit">{{ $t('5e1e35aa.b04fcb') }}</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>
    <!-- 延期 -->
    <el-dialog :title="$t('5e1e35aa.86fe28')" class="delay-dialog" :visible.sync="delayDialog">
      <div class="alert-txt">
        <el-alert title="" type="warning" :closable="false">
          <span
            >{{ $t('5e1e35aa.733e02') }}{{ rightsInfo.rights_name }} ,{{ $t('5e1e35aa.e65e93')
            }}{{ rightsInfo.end_time | datetime }}</span
          >
        </el-alert>
      </div>
      <el-row class="option-box">
        <el-col :span="8">
          {{ $t('5e1e35aa.452983')
          }}<el-date-picker v-model="form.delay_date" type="date" :picker-options="pickerOptions" />
        </el-col>
        <el-col :span="12">
          {{ $t('5e1e35aa.751ce6')
          }}<el-input
            v-model="form.remark"
            type="textarea"
            :placeholder="$t('5e1e35aa.3cac63')"
            :rows="2"
          />
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="delaySave">{{ $t('5e1e35aa.939d53') }}</el-button>
        </el-col>
      </el-row>
      <el-table :data="delayData" height="380" style="width: 100%">
        <el-table-column :label="$t('5e1e35aa.31add5')">
          <template slot-scope="scope">
            <span>{{ scope.row.original_date | datetime }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('5e1e35aa.8cef94')">
          <template slot-scope="scope">
            <span>{{ scope.row.delay_date | datetime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" :label="$t('5e1e35aa.2432b5')" />
      </el-table>
    </el-dialog>
    <!-- 延期 -->
    <el-dialog :title="$t('5e1e35aa.ac692c')" class="delay-dialog" :visible.sync="transferDialog">
      <el-row class="option-box">
        <el-col :span="8">
          {{ $t('5e1e35aa.d55a1a')
          }}<el-input v-model="transferForm.transfer_mobile" style="width: 200px" />
        </el-col>
        <el-col :span="12">
          {{ $t('5e1e35aa.751ce6')
          }}<el-input
            v-model="transferForm.remark"
            type="textarea"
            :placeholder="$t('5e1e35aa.3cac63')"
            :rows="2"
          />
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="transferSave">{{ $t('5e1e35aa.939d53') }}</el-button>
        </el-col>
      </el-row>
      <el-table :data="transferData" height="380" style="width: 100%">
        <el-table-column :label="$t('5e1e35aa.1f3f11')">
          <template slot-scope="scope">
            <span>{{ scope.row.created | datetime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" :label="$t('5e1e35aa.4ba29d')" />
        <el-table-column prop="transfer_mobile" :label="$t('5e1e35aa.94d7f9')" />
        <el-table-column prop="remark" :label="$t('5e1e35aa.2432b5')" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  findRightsList,
  createRights,
  delayRights,
  transferRights,
  transferRightsList,
  getRightsInfo,
  rightsExport
} from '../../../api/trade'
import { getItemsList } from '../../../api/goods'
import shopSelect from '@/components/shopSelect'
export default {
  components: {
    shopSelect
  },
  data() {
    var delayDisabledDate = Date.now()
    return {
      loading: false,
      activeName: 'first',
      addRightsDialog: false,
      delayDialog: false,
      transferDialog: false,
      mobile: '',
      searchMobile: '',
      goodsList: [],
      addRightsItems: [],
      goodsListSelect: [],
      rightsList: [],
      total_count: 0,
      goods_total_count: 0,
      goods_page: 1,
      currentPage: 1,
      goodsParams: {
        page: 1,
        pageSize: 20
      },
      params: {
        page: 1,
        pageSize: 20
      },
      form: {
        delay_date: [],
        remark: ''
      },
      transferForm: {
        rights_id: null,
        mobile: '',
        transfer_mobile: '',
        remark: ''
      },
      rightsInfo: {},
      delayData: [],
      transferData: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < delayDisabledDate
        }
      },
      create_time: '',
      rights_from: '',
      valid: 0,
      downloadView: false,
      downloadUrl: '',
      downloadName: '',
      currentShop: ''
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    rightsFrom() {
      return [
        { type: '会员升级送', name: this.$t('5e1e35aa.96cbbd') },
        { type: '会员周年送', name: this.$t('5e1e35aa.262501') },
        { type: '会员日送', name: this.$t('5e1e35aa.f9fc39') },
        { type: '会员生日送', name: this.$t('5e1e35aa.920ac0') },
        { type: '注册赠送', name: this.$t('5e1e35aa.78f6e4') },
        { type: '管理员手动添加', name: this.$t('5e1e35aa.d7e022') },
        { type: '购买获取', name: this.$t('5e1e35aa.aecb3a') }
      ]
    }
  },
  mounted() {
    this.getRightsList()
  },
  methods: {
    onSubmit() {
      let query = { mobile: this.mobile, itemids: this.addRightsItems }
      createRights(query).then((res) => {
        this.mobile = ''
        this.addRightsItems = []
        this.$message({
          type: 'success',
          message: this.$t('5e1e35aa.d71d42')
        })
        this.getRightsList()
        this.addRightsDialog = false
      })
    },
    addResource() {
      this.getGoodsList()
      this.mobile = ''
      this.addRightsDialog = true
    },
    handleCancelLabelsDialog() {
      this.addRightsDialog = false
    },
    handleCurrentChange(val) {
      this.loading = false
      this.params.page = val
      this.getRightsList()
    },
    numberSearch() {
      if (!this.searchMobile) {
        this.params.mobile = ''
      } else {
        this.params.mobile = this.searchMobile
      }
      this.params.page = 1
      this.getRightsList()
    },
    dateChange(val) {
      if (val && val.length > 0) {
        this.params.date_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.date_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.params.date_begin = ''
        this.params.date_end = ''
      }
      this.params.page = 1
      this.getRightsList()
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    rightsFromHandle(val) {
      this.params.rights_from = val
      this.params.page = 1
      this.getRightsList()
    },
    handleGoodsChange(val) {
      this.goodsParams.page = val
      this.goodsListSelect = []
      this.goodsList.forEach((row) => {
        //如果选中
        let index = this.addRightsItems.indexOf(row.key)
        if (index != -1) {
          this.goodsListSelect.push(row)
        }
      })
      this.getGoodsList()
    },
    getGoodsList() {
      getItemsList(this.goodsParams).then((response) => {
        let list = []
        response.data.data.list.forEach((row) => {
          let index = this.addRightsItems.indexOf(row.itemId)
          //如果未选中
          if (index === -1) {
            list.push({
              key: row.itemId,
              label: row.itemName
            })
          }
        })
        this.goodsList = list.concat(this.goodsListSelect)
        this.goods_total_count = response.data.data.total_count
      })
    },
    getRightsList() {
      this.loading = true
      findRightsList(this.params).then((response) => {
        this.rightsList = response.data.data.list
        this.total_count = Number(response.data.data.total_count)
        this.loading = false
      })
    },
    delayAction(item) {
      this.form.delay_date = ''
      this.form.remark = ''
      this.rightsInfo = item
      this.form.rights_id = item.rights_id
      var filter = { rights_id: item.rights_id }
      getRightsInfo(filter).then((res) => {
        if (res.data.data.logs.list) {
          this.delayData = res.data.data.logs.list
        }
      })
      this.delayDialog = true
    },
    delaySave() {
      delayRights(this.form).then((res) => {
        if (res.data.data) {
          this.delayDialog = false
          this.getRightsList()
        }
      })
    },
    transferAction(item) {
      this.transferForm.rights_id = item.rights_id
      this.transferForm.mobile = item.mobile
      this.transferForm.transfer_mobile = ''
      this.transferForm.remark = ''
      var filter = { rights_id: item.rights_id }
      transferRightsList(filter).then((res) => {
        if (res.data.data.list) {
          this.transferData = res.data.data.list
        }
      })
      this.transferDialog = true
    },
    transferSave() {
      if (!this.transferForm.transfer_mobile) {
        this.$message({
          type: 'error',
          message: this.$t('5e1e35aa.67cc22')
        })
        return false
      }
      if (!this.transferForm.remark) {
        this.$message({
          type: 'error',
          message: this.$t('5e1e35aa.3cac63')
        })
        return false
      }
      transferRights(this.transferForm)
        .then((res) => {
          if (res.data.data) {
            this.delayDialog = false
            this.getRightsList()
          }
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: error.error.message
          })
        })
      this.transferDialog = false
    },
    changeOpen(key) {
      this.params.valid = this.valid ? 1 : 0
      this.params.page = 1
      this.getRightsList()
    },
    exportData() {
      this.params.page = 1
      rightsExport(this.params).then((response) => {
        if (response.data.data.status) {
          this.$message({
            type: 'success',
            message: this.$t('5e1e35aa.3e1ddd')
          })
          return
        } else if (response.data.data.url) {
          this.downloadUrl = response.data.data.url
          this.downloadName = response.data.data.filename
          this.downloadView = true
        } else {
          this.$message({
            type: 'error',
            message: this.$t('5e1e35aa.89ae53')
          })
          return
        }
      })
    },
    shopHandle(param) {
      param && param.shop_id
      this.currentShop = param.shop_id
      this.params.page = 1
      this.params.shop_id = param.shop_id
      this.getRightsList()
    }
  }
}
</script>
