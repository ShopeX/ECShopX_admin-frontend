<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <div class="reservation-box">
    <el-row :gutter="20">
      <el-col :span="10">
        门店：
        <el-select v-model="shopId" @change="storeChange">
          <el-option
            v-for="item in shopListData"
            :key="item.wxShopId"
            :label="item.storeName"
            :value="item.wxShopId"
          >
            {{ item.storeName }}
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="14" class="content-right">
        <el-radio-group v-model="dateType" size="mini" @change="dateChange">
          <el-radio-button label="1"> 今天 </el-radio-button>
          <el-radio-button label="2"> 明天 </el-radio-button>
          <el-radio-button label="3"> 后天 </el-radio-button>
          <el-radio-button label="4"> 自定义 </el-radio-button>
        </el-radio-group>
        <el-date-picker
          v-if="dateType == '4'"
          v-model="dateDay"
          type="date"
          placeholder="请选择日期"
          :picker-options="pickerOptions"
          @change="customChange"
        />
      </el-col>
    </el-row>
    <el-table
      ref="table"
      v-loading="loading"
      class="table"
      :max-height="wheight - 100"
      border
      :data="dataList"
    >
      <template v-for="(item, index) in tableTitle">
        <template v-if="index == 0">
          <el-table-column :key="index" fixed :label="item.begin" width="150" prop="name" />
        </template>
        <template v-else>
          <el-table-column :key="index" :label="item.begin">
            <template slot-scope="scope">
              <template v-if="!scope.row.record">
                <span class="type-add" @click="reservationAdd(scope.row, item.begin, item.end)"
                  ><i class="el-icon-plus"
                /></span>
              </template>
              <template v-for="(subItem, subIndex) in scope.row.record" v-else>
                <template v-if="item.begin == subItem.beginTime">
                  <el-tooltip effect="light" placement="top">
                    <div v-if="subItem.status == 'system'" slot="content">
                      系统占位 <br><br>
                      占用时间：{{ subItem.beginTime }}~{{ subItem.endTime }}
                    </div>
                    <div v-else slot="content">
                      预约人：{{ subItem.userName }} <br><br>
                      预约手机：{{ subItem.mobile }} <br><br>
                      预约项目：{{ subItem.labelName }} <br><br>
                      到店时间：{{ subItem.beginTime }}
                    </div>
                    <span v-if="subItem.userName">{{ subItem.userName }}</span>
                    <span v-else-if="subItem.mobile">{{ subItem.mobile }}</span>
                    <span v-else>系统占位</span>
                  </el-tooltip>
                </template>
              </template>
              <span
                v-if="scope.row.timedata && scope.row.timedata.indexOf(item.begin) < 0"
                class="type-add"
                @click="reservationAdd(scope.row, item.begin, item.end)"
                ><i class="el-icon-plus"
              /></span>
            </template>
          </el-table-column>
        </template>
      </template>
    </el-table>
    <div v-if="total_count > params.pageSize" class="mt-4 text-right">
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="params.page"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      title="代客预约"
      width="20%"
      :visible.sync="chooseTypeDialogVisible"
      :close-on-click-modal="false"
    >
      <div class="type-list type-choose-box">
        <el-form v-model="formData" label-width="120px">
          <el-form-item label="预约方式" prop="">
            <el-radio-group v-model="formData.instead">
              <el-radio label="system"> 系统占位 </el-radio>
              <el-radio label="user"> 代客预约 </el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="formData.instead == 'user'">
            <el-form-item label="客户手机号:" prop="">
              <el-input
                v-model="formData.mobile"
                size="40"
                placeholder="客户手机号"
                :maxlength="11"
                :minlength="11"
                style="width: 120px"
                @blur="getMemberData"
              />
            </el-form-item>
            <el-form-item v-if="labelList" label="预约项目:" prop="">
              <el-select v-model="formData.rightsId" size="40">
                <el-option
                  v-for="item in labelList"
                  :key="item.rights_id"
                  :label="item.label_name"
                  :value="item.rights_id"
                >
                  <span style="float: left">{{ item.label_name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px"
                    >{{ item.start_time | datetime }} ~ {{ item.end_time | datetime }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-form>
      </div>
      <div slot="footer" class="footer-dialog content-center">
        <el-button @click="chooseCancel"> 取消 </el-button>
        <el-button type="primary" @click="reservationSave"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getWxShopsList } from '../../../../api/shop'
import {
  getTimePeriodTitle,
  getReservationRecord,
  addReservationRecord
} from '../../../../api/reservation'
import { getMembers } from '../../../../api/member'
import { getRightsList } from '../../../../api/trade'
import util from '../../../../common/js/util'
import moment from 'moment'

import shopSelect from '@/components/shopSelect'

export default {
  components: {
    shopSelect
  },
  props: ['isLoad', 'resourceName'],
  data() {
    return {
      loading: false,
      shopListData: '',
      shopId: '',
      dataList: [],
      daterange: '',
      dateType: '1',
      params: {
        page: 1,
        pageSize: 20
      },
      dateDay: '',
      tableTitle: [],
      total_count: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      chooseTypeDialogVisible: false,
      formData: {
        dateDay: '',
        beginTime: '',
        shopId: '',
        shopName: '',
        resourceLevelId: '',
        resourceLevelName: '',
        labelId: '',
        labelName: '',
        rightsId: '',
        rightsName: '',
        mobile: '',
        userName: '',
        sex: '',
        instead: 'system',
        userId: ''
      },
      labelList: []
      // selectedParams: {
      //   shop_value: '',
      //   regions_value: []
      // }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    selectedParams: {
      handler(newName, oldName) {
        console.log('obj.a changed', newName, oldName)
      },
      // immediate: true,
      deep: true
    }
  },
  watch: {
    isLoad(newValue, oldValue) {
      if (newValue) {
        this.dataList = []
        this.getStoreList()
        if (this.shopId) {
          this.getLevelList()
        }
      }
    }
  },
  mounted() {
    this.dateDay = moment().format('YYYY-MM-DD')
    this.dataList = []
    this.getStoreList()
  },
  methods: {
    chooseCancel() {
      this.i = -1
      this.chooseTypeDialogVisible = false
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      // this.params.shopId = this.shopId
      this.getLevelList()
    },
    // storeChange () {
    //   this.params.page = 1
    //   this.getLevelList()
    //   this.getTimePeriod()
    // },
    storeChange(params) {
      console.log('recieve', params)
      params && params.shop_id && (this.shopId = params.shop_id)
      this.params.page = 1
      this.getLevelList()
      this.getTimePeriod()
    },
    initChange() {
      this.shopId = ''
    },
    getLevelList() {
      this.loading = true
      this.params.dateDay = this.dateDay
      this.params.shopId = this.shopId
      getReservationRecord(this.params).then(res => {
        if (res.data.data) {
          this.dataList = res.data.data.list
          this.total_count = res.data.data.total_count
        }
        this.$nextTick(() => {
          this.$refs.table.doLayout()
        })
        this.loading = false
      })
    },
    getStoreList() {
      this.loading = true
      var shopFilter = { page: 1, pageSize: 500 }
      getWxShopsList(shopFilter).then(response => {
        this.shopListData = response.data.data.list
        if (this.shopId == '' && this.shopListData[0].wxShopId) {
          this.shopId = this.shopListData[0].wxShopId
        }
        this.storeChange()
        this.loading = false
      })
    },
    getTimePeriod() {
      if (this.shopId) {
        this.loading = true
        var timeFile = { shopId: this.shopId, dateDay: this.dateDay }
        getTimePeriodTitle(timeFile).then(res => {
          this.tableTitle = res.data.data.tableTitle
          this.loading = false
        })
      }
    },
    reservationAdd(row, beginTime, endTime) {
      this.formData = {
        dateDay: this.dateDay,
        beginTime: beginTime,
        shopId: this.shopId,
        shopName: '',
        resourceLevelId: row.resourceLevelId,
        resourceLevelName: row.name,
        labelId: '',
        labelName: '',
        rightsId: '',
        rightsName: '',
        mobile: '',
        userName: '',
        sex: '',
        instead: 'system',
        userId: '',
        endTime: endTime
      }
      this.labelList = []
      this.chooseTypeDialogVisible = true
      // 获取预约项目
    },
    reservationSave() {
      if (this.formData.instead == 'system') {
        this.formData.rightsId = ''
        this.formData.userName = ''
        this.formData.userId = ''
        this.formData.mobile = ''
        this.formData.sex = ''
        this.formData.shopName = ''
        this.formData.labelId = ''
        this.formData.labelName = ''
        this.formData.rightsName = ''
        this.formData.labelId = ''
      } else {
        if (!this.formData.mobile) {
          this.$message({
            type: 'error',
            message: '请输入会员手机号'
          })
          return
        }
        let reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (!reg.test(this.formData.mobile)) {
          this.$message({
            message: '请输入正确的手机号',
            type: 'error'
          })
          return
        }
        if (!this.formData.rightsId) {
          this.$message({
            type: 'error',
            message: '请选择会员拥有的权益'
          })
          return
        }
      }
      if (this.formData.rightsId) {
        for (var index in this.labelList) {
          if (this.labelList[index].rights_id == this.formData.rightsId) {
            this.formData.labelName = this.labelList[index].label_name
            this.formData.rightsName = this.labelList[index].rights_name
            this.formData.labelId = this.labelList[index].label_id
          }
        }
      }

      if (this.formData.shopId) {
        for (var i in this.shopListData) {
          if (this.formData.shopId == this.shopListData[i].wxShopId) {
            this.formData.shopName = this.shopListData[i].storeName
          }
        }
      }
      addReservationRecord(this.formData).then(res => {
        if (res.data.status) {
          this.$message({
            type: 'success',
            message: '代客预约成功'
          })
        }
        this.chooseTypeDialogVisible = false
        this.storeChange()
      })
    },
    dateChange(value) {
      if (value == '4') {
        return
      }
      this.dateDay = moment()
        .add('days', Number(value) - 1)
        .format('YYYY-MM-DD')
      this.storeChange()
    },
    customChange(value) {
      this.dateDay = moment(new Date(value)).format('YYYY-MM-DD')
      if (this.dateDay) {
        this.storeChange()
      }
    },
    getMemberData() {
      this.labelList = []
      if (this.formData.mobile) {
        let memberFilter = { mobile: this.formData.mobile }
        getMembers(memberFilter).then(res => {
          if (res.data.data.list) {
            let member = res.data.data.list
            this.formData.userName = member[0].username
            this.formData.sex = member[0].sex
            this.formData.userId = member[0].user_id
            this.getResource(member[0].user_id)
          }
        })
      }
    },
    getResource(userId) {
      let params = {
        user_id: userId,
        end_time: this.dateDay,
        page: 1,
        pageSize: 100,
        resource_level_id: this.formData.resourceLevelId
      }
      getRightsList(params).then(res => {
        if (res.data.data.length == 0) {
          this.$message({
            message: '该用户无可预约权益',
            type: 'error'
          })
          return
        } else if (res.data.data.list) {
          this.labelList = res.data.data.list
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.type-add {
  display: inline-block;
  width: 98%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px solid #ddd;
  cursor: pointer;
}
.table {
  width: 100%;
}
</style>

<style type="text/css" lang="scss">
.board-pane {
  .el-table .cell,
  .el-table th > div {
    padding-left: 8px;
    padding-right: 8px;
  }
}
.reservation-box .el-table__empty-text {
  left: 530px;
}
</style>
