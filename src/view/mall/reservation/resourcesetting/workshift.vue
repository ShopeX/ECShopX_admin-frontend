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
  <div class="setting-manage-box">
    <el-row :gutter="20">
      <el-col :span="12">
        门店：
        <el-select v-model="shopId" @change="storeChange">
          <el-option
            v-for="item in shopListData"
            :key="item.wxShopId"
            :label="item.storeName"
            :value="item.wxShopId"
          />
        </el-select>
      </el-col>
      <el-col :span="12" class="content-right">
        <el-button type="primary" icon="plus" @click="getDefaultWorkShift">
          配置默认排班
        </el-button>
        <el-button type="primary" icon="plus" @click="getShiftType"> 管理班次类型 </el-button>
      </el-col>
    </el-row>
    <div class="content-center" style="margin-bottom: 10px">
      <el-button type="default" @click="preWeek"> 上一周 </el-button>
      <el-select v-model="currWeek" @change="weekChange">
        <el-option
          v-for="item in weekData"
          :key="item.value"
          :label="item.name"
          :value="item.label"
        >
          {{ item.name }}
        </el-option>
      </el-select>
      <el-button type="default" @click="nextWeek"> 下一周 </el-button>
    </div>
    <el-table v-loading="loading" border :data="manageData" :height="wheight - 220">
      <el-table-column prop="name" :label="resourceName" class="content-center" />
      <el-table-column :label="sevenDays.monday.md">
        <template slot-scope="scope">
          <template v-if="!scope.row.monday">
            <span class="type-add" @click="typeAdd(scope.row, sevenDays.monday.ymd)"
              ><i class="el-icon-plus"
            /></span>
          </template>
          <template v-else>
            <div class="cell-item-box">
              <div
                class="cell-item"
                @click="showTypeAdd(scope.row, sevenDays.monday.ymd, scope.row.monday)"
              >
                <div class="type-name" :title="scope.row.monday.typeName">
                  {{ scope.row.monday.typeName }}
                </div>
                <div>{{ scope.row.monday.beginTime }}~{{ scope.row.monday.endTime }}</div>
              </div>
              <i
                v-if="scope.row.monday.id != '0'"
                class="el-icon-circle-close"
                @click="clearCell(scope.$index, 0, scope.row.monday.id)"
              />
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column :label="sevenDays.tuesday.md">
        <template slot-scope="scope">
          <template v-if="!scope.row.tuesday">
            <span class="type-add" @click="typeAdd(scope.row, sevenDays.tuesday.ymd)"
              ><i class="el-icon-plus"
            /></span>
          </template>
          <template v-else>
            <div class="cell-item-box">
              <div
                class="cell-item"
                @click="showTypeAdd(scope.row, sevenDays.tuesday.ymd, scope.row.tuesday)"
              >
                <div class="type-name" :title="scope.row.tuesday.typeName">
                  {{ scope.row.tuesday.typeName }}
                </div>
                <div>{{ scope.row.tuesday.beginTime }}~{{ scope.row.tuesday.endTime }}</div>
              </div>
              <i
                v-if="scope.row.tuesday.id != '0'"
                class="el-icon-circle-close"
                @click="clearCell(scope.$index, 1, scope.row.tuesday.id)"
              />
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column :label="sevenDays.wednesday.md">
        <template slot-scope="scope">
          <template v-if="!scope.row.wednesday">
            <span class="type-add" @click="typeAdd(scope.row, sevenDays.wednesday.ymd)"
              ><i class="el-icon-plus"
            /></span>
          </template>
          <template v-else>
            <div class="cell-item-box">
              <div
                class="cell-item"
                @click="showTypeAdd(scope.row, sevenDays.wednesday.ymd, scope.row.wednesday)"
              >
                <div class="type-name" :title="scope.row.wednesday.typeName">
                  {{ scope.row.wednesday.typeName }}
                </div>
                <div>{{ scope.row.wednesday.beginTime }}~{{ scope.row.wednesday.endTime }}</div>
              </div>
              <i
                v-if="scope.row.wednesday.id != '0'"
                class="el-icon-circle-close"
                @click="clearCell(scope.$index, 2, scope.row.wednesday.id)"
              />
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column :label="sevenDays.thursday.md">
        <template slot-scope="scope">
          <template v-if="!scope.row.thursday">
            <span class="type-add" @click="typeAdd(scope.row, sevenDays.thursday.ymd)"
              ><i class="el-icon-plus"
            /></span>
          </template>
          <template v-else>
            <div class="cell-item-box">
              <div
                class="cell-item"
                @click="showTypeAdd(scope.row, sevenDays.thursday.ymd, scope.row.thursday)"
              >
                <div class="type-name" :title="scope.row.thursday.typeName">
                  {{ scope.row.thursday.typeName }}
                </div>
                <div>{{ scope.row.thursday.beginTime }}~{{ scope.row.thursday.endTime }}</div>
              </div>
              <i
                v-if="scope.row.thursday.id != '0'"
                class="el-icon-circle-close"
                @click="clearCell(scope.$index, 3, scope.row.thursday.id)"
              />
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column :label="sevenDays.friday.md">
        <template slot-scope="scope">
          <template v-if="!scope.row.friday">
            <span class="type-add" @click="typeAdd(scope.row, sevenDays.friday.ymd)"
              ><i class="el-icon-plus"
            /></span>
          </template>
          <template v-else>
            <div class="cell-item-box">
              <div
                class="cell-item"
                @click="showTypeAdd(scope.row, sevenDays.friday.ymd, scope.row.friday)"
              >
                <div class="type-name" :title="scope.row.friday.typeName">
                  {{ scope.row.friday.typeName }}
                </div>
                <div>{{ scope.row.friday.beginTime }}~{{ scope.row.friday.endTime }}</div>
              </div>
              <i
                v-if="scope.row.friday.id != '0'"
                class="el-icon-circle-close"
                @click="clearCell(scope.$index, 4, scope.row.friday.id)"
              />
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column :label="sevenDays.saturday.md">
        <template slot-scope="scope">
          <template v-if="!scope.row.saturday">
            <span class="type-add" @click="typeAdd(scope.row, sevenDays.saturday.ymd)"
              ><i class="el-icon-plus"
            /></span>
          </template>
          <template v-else>
            <div class="cell-item-box">
              <div
                class="cell-item"
                @click="showTypeAdd(scope.row, sevenDays.saturday.ymd, scope.row.saturday)"
              >
                <div class="type-name" :title="scope.row.saturday.typeName">
                  {{ scope.row.saturday.typeName }}
                </div>
                <div>{{ scope.row.saturday.beginTime }}~{{ scope.row.saturday.endTime }}</div>
              </div>
              <i
                v-if="scope.row.saturday.id != '0'"
                class="el-icon-circle-close"
                @click="clearCell(scope.$index, 5, scope.row.saturday.id)"
              />
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column :label="sevenDays.sunday.md">
        <template slot-scope="scope">
          <template v-if="!scope.row.sunday">
            <span class="type-add" @click="typeAdd(scope.row, sevenDays.sunday.ymd)"
              ><i class="el-icon-plus"
            /></span>
          </template>
          <template v-else>
            <div class="cell-item-box">
              <div
                class="cell-item"
                @click="showTypeAdd(scope.row, sevenDays.sunday.ymd, scope.row.sunday)"
              >
                <div class="type-name" :title="scope.row.sunday.typeName">
                  {{ scope.row.sunday.typeName }}
                </div>
                <div>{{ scope.row.sunday.beginTime }}~{{ scope.row.sunday.endTime }}</div>
              </div>
              <i
                v-if="scope.row.sunday.id != '0'"
                class="el-icon-circle-close"
                @click="clearCell(scope.$index, 6, scope.row.sunday.id)"
              />
            </div>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="配置默认排班"
      :visible="defaultDialogVisible"
      :close-on-click-modal="false"
      :before-close="cancel"
    >
      <div class="type-list content-center">
        <el-alert title="" type="warning" :closable="false">
          <el-row class="">
            <el-col :span="12"> 门店名称： {{ shopName }} </el-col>
            <el-col :span="12"> 开店时间： {{ shopHour }} </el-col>
          </el-row>
        </el-alert>
        <template>
          <el-row v-for="weekitem in weekdays" :key="weekitem.name" class="type-item">
            <el-col :span="8">
              {{ weekitem.label }}
            </el-col>
            <el-col :span="16">
              <el-select
                v-model="weekitem.value"
                filterable
                allow-create
                default-first-option
                placeholder="请选班次"
                size="large"
              >
                <el-option
                  v-for="item in typeList"
                  v-if="typeList"
                  :key="item.typeId"
                  :label="item.typeName"
                  :value="item.typeId"
                >
                  <span style="float: left">{{ item.typeName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px"
                    >{{ item.beginTime }} ~ {{ item.endTime }}</span
                  >
                </el-option>
                <el-option v-else key="-1" label="休息" value="-1">
                  <span style="float: left">休息</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">00:00 ~ 23:59</span>
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </template>
      </div>
      <div slot="footer" class="footer-dialog content-center">
        <el-button type="primary" :disabled="isAdd" @click="addDefaultShift">
          添加默认排班
        </el-button>
        <el-button @click="cancel"> 关闭 </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="班次类型列表"
      :visible="manageDialogVisible"
      :close-on-click-modal="false"
      :before-close="cancel"
    >
      <div class="type-list content-center">
        <el-alert title="" type="warning" :closable="false">
          <el-row class="">
            <el-col :span="12"> 门店名称： {{ shopName }} </el-col>
            <el-col :span="12"> 开店时间： {{ shopHour }} </el-col>
          </el-row>
        </el-alert>
        <template v-for="(item, index) in typeList">
          <el-row class="type-item">
            <el-col :span="8">
              {{ item.typeName }}
            </el-col>
            <el-col :span="12"> {{ item.beginTime }} ~ {{ item.endTime }} </el-col>
            <el-col :span="4">
              <el-button
                v-if="item.typeId == '-1'"
                disabled
                type="text"
                @click="deleteShiftType(item.typeId)"
              >
                删除
              </el-button>
              <el-button v-else type="text" @click="deleteShiftType(item.typeId)"> 删除 </el-button>
            </el-col>
          </el-row>
        </template>

        <el-row v-if="isAdd" class="type-item">
          <el-col :span="8">
            <el-input
              v-model="addItem.typeName"
              placeholder="班次类型名称"
              :maxlength="10"
              style="width: 120px"
            />&nbsp;<span class="frm-tips">{{ addItem.typeName.length }}/10</span>
          </el-col>
          <el-col :span="16">
            <el-time-select
              v-model="addItem.beginTime"
              :picker-options="{ start: '00:00', step: '00:15', end: '23:59' }"
              placeholder="开始时间"
              style="width: 120px"
            />
            ~
            <el-time-select
              v-model="addItem.endTime"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:59',
                minTime: addItem.beginTime
              }"
              placeholder="结束时间"
              style="width: 120px"
            />
            &nbsp;&nbsp; <el-button type="text" @click="saveShiftType"> 添加 </el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="footer-dialog content-center">
        <el-button type="primary" :disabled="isAdd" @click="addShiftType"> 添加班次类型 </el-button>
        <el-button @click="cancel"> 关闭 </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="班次类型选择"
      :visible="chooseTypeDialogVisible"
      :close-on-click-modal="false"
      :before-close="chooseCancel"
    >
      <div class="type-list type-choose-box content-center">
        <el-alert title="" type="warning" :closable="false">
          <el-row class="">
            <el-col :span="12"> 门店名称： {{ shopName }} </el-col>
            <el-col :span="12"> 开店时间： {{ shopHour }} </el-col>
          </el-row>
        </el-alert>

        <template v-for="(item, index) in typeList">
          <div class="type-item" :class="{ checked: i == index }" @click="chooseType(item, index)">
            <el-row>
              <el-col :span="8">
                {{ item.typeName }}
              </el-col>
              <el-col :span="16"> {{ item.beginTime }} ~ {{ item.endTime }} </el-col>
            </el-row>
          </div>
        </template>
      </div>
      <div slot="footer" class="footer-dialog content-center">
        <el-button @click="chooseCancel"> 取消 </el-button>
        <el-button type="primary" @click="saveChoose"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  createShiftType,
  updateShiftType,
  deleteShiftType,
  getListShiftType,
  getweekday,
  getListWorkShift,
  createWorkShift,
  deleteWorkShift,
  updateWorkShift,
  getDefaultShift,
  createDefautlShift
} from '../../../../api/reservation'
import { getWxShopsList } from '../../../../api/shop'
export default {
  props: ['isLoad', 'resourceName'],
  data() {
    return {
      loading: false,
      shopListData: [],
      shopId: '',
      manageData: [],
      currWeek: '',
      currWeekIndex: 0,
      weekData: [],
      sevenDays: {
        monday: { md: '', ymd: '' },
        tuesday: { md: '', ymd: '' },
        wednesday: { md: '', ymd: '' },
        thursday: { md: '', ymd: '' },
        friday: { md: '', ymd: '' },
        saturday: { md: '', ymd: '' },
        sunday: { md: '', ymd: '' }
      },
      week: [],
      typeList: [],
      addItem: {
        typeName: '',
        beginTime: '',
        endTime: ''
      },
      relResource: {
        resourceLevelId: '',
        dateDay: '',
        shiftTypeId: '',
        shopId: '',
        id: ''
      },
      filterSelect: {
        shopId: '',
        dateData: ''
      },
      isAdd: false,
      currRowIndex: -1,
      currColIndex: -1,
      chooseItem: {},
      defaultDialogVisible: false,
      manageDialogVisible: false,
      chooseTypeDialogVisible: false,
      i: -1,
      shopHour: '',
      shopName: '',
      expiredAt: '',
      nowTime: Date.parse(new Date()) / 1000,
      params: {
        page: 1,
        pageSize: 20
      },
      weekdays: [
        { label: '周一', name: 'monday', value: '-1' },
        { label: '周二', name: 'tuesday', value: '-1' },
        { label: '周三', name: 'wednesday', value: '-1' },
        { label: '周四', name: 'thursday', value: '-1' },
        { label: '周五', name: 'friday', value: '-1' },
        { label: '周六', name: 'saturday', value: '-1' },
        { label: '周日', name: 'sunday', value: '-1' }
      ],
      currYear: ''
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    isLoad(newValue, oldValue) {
      if (newValue) {
        //加载数据
        this.manageData = []
        this.getStoreList()
        this.getEveryYearWeek()
      }
    }
  },
  mounted() {
    this.manageData = []
    this.getStoreList()
    this.getEveryYearWeek()
  },
  methods: {
    getStoreList() {
      this.loading = true
      var shopFilter = { page: 1, pageSize: 500 }
      getWxShopsList(shopFilter).then(response => {
        this.shopListData = response.data.data.list
        if (this.shopId == '' && this.shopListData[0].wxShopId) {
          this.shopId = this.shopListData[0].wxShopId
          this.shopName = this.shopListData[0].storeName
          this.shopHour = this.shopListData[0].hour
          this.expiredAt = this.shopListData[0].expiredAt
        }
        this.loading = false
      })
    },
    getDefaultWorkShift() {
      this.defaultDialogVisible = true
      getListShiftType().then(response => {
        if (response.data.data.list) {
          this.typeList = response.data.data.list
          var params = { shop_id: this.shopId }
          getDefaultShift(params).then(res => {
            var list = res.data.data
            var week = this.weekdays
            if (list.length > 0) {
              for (var i = 0; i < week.length; i++) {
                if (list[week[i].name].typeId) {
                  this.weekdays[i].value = list[week[i].name].typeId
                  var isflag = false
                  for (var j = 0; j < this.typeList.length; j++) {
                    if (this.weekdays[i].value == this.typeList[j].typeId) {
                      isflag = true
                      break
                    }
                  }
                  if (!isflag) {
                    this.weekdays[i].value = '-1'
                  }
                }
              }
            }
          })
        }
      })
    },
    getShiftType() {
      this.manageDialogVisible = true
      this.getShiftTypeList()
    },
    addShiftType() {
      this.isAdd = true
    },
    addDefaultShift() {
      var params = { shop_id: this.shopId, defaultData: this.weekdays }
      console.log(params)
      createDefautlShift(params).then(res => {
        if (res.data.data) {
          this.$message({
            type: 'success',
            message: '配置默认排班成功'
          })
          this.getDefaultWorkShift()
        }
      })
    },
    saveShiftType() {
      if (this.addItem.typeName == '') {
        this.$message.error('班次类型名称不能为空')
        return
      }
      if (this.addItem.beginTime == '') {
        this.$message.error('班次类型开始时间不能为空')
        return
      }
      if (this.addItem.endTime == '') {
        this.$message.error('班次类型结束时间不能为空')
        return
      }
      createShiftType(this.addItem).then(res => {
        if (res.data.data) {
          this.$message({
            type: 'success',
            message: '保存排班类型成功'
          })
          this.getShiftTypeList()
        }
      })
      //this.isAdd = false
      this.addItem = { typeName: '', beginTime: '', endTime: '' }
    },
    deleteShiftType(typeId) {
      deleteShiftType(typeId).then(res => {
        if (res.data.data.status == false) {
          this.$message.error('该类型不可被删除')
          return
        } else {
          this.$message({
            type: 'success',
            message: '删除排班类型成功'
          })
        }
        this.getShiftType()
      })
    },
    typeAdd(resource, dateDay) {
      this.relResource.id = ''
      this.relResource.resourceLevelId = resource.resourceLevelId
      this.relResource.shopId = resource.shopId
      this.relResource.dateDay = dateDay
      this.chooseTypeDialogVisible = true
      this.getShiftTypeList()
    },
    showTypeAdd(resource, dateDay, cellData) {
      this.relResource.resourceLevelId = resource.resourceLevelId
      this.relResource.shopId = resource.shopId
      this.relResource.dateDay = dateDay
      this.relResource.id = cellData.id
      this.chooseTypeDialogVisible = true
      this.getShiftTypeList(cellData.typeId)
    },
    clearCell(rowIndex, weekdaynum, shiftId) {
      var params = { id: shiftId }
      deleteWorkShift(params).then(res => {
        if (res.data.data.status) {
          this.$message({
            type: 'success',
            message: '删除该次排班成功'
          })
          this.getWorkShiftList(this.filterSelect)
          switch (weekdaynum) {
            case 0:
              this.manageData[rowIndex].monday = null
              break
            case 1:
              this.manageData[rowIndex].tuesday = null
              break
            case 2:
              this.manageData[rowIndex].wednesday = null
              break
            case 3:
              this.manageData[rowIndex].thursday = null
              break
            case 4:
              this.manageData[rowIndex].friday = null
              break
            case 5:
              this.manageData[rowIndex].saturday = null
              break
            case 6:
              this.manageData[rowIndex].sunday = null
              break
          }
        }
      })
    },
    cancel() {
      this.manageDialogVisible = false
      this.defaultDialogVisible = false
      this.isAdd = false
    },
    chooseCancel() {
      this.i = -1
      this.chooseTypeDialogVisible = false
    },
    chooseType(item, index) {
      this.relResource.shiftTypeId = item.typeId
      this.chooseItem = item
      this.i = index
    },
    saveChoose() {
      this.i = -1
      if (!this.relResource.shiftTypeId) {
        this.$message({
          type: 'error',
          message: '请选择排班类型'
        })
        return
      }
      if (this.relResource.id) {
        updateWorkShift(this.relResource).then(res => {
          if (res.data.data) {
            this.$message({
              type: 'success',
              message: '更改该排班成功'
            })
          }
          this.getWorkShiftList(this.filterSelect)
        })
      } else {
        createWorkShift(this.relResource).then(res => {
          if (res.data.data) {
            this.$message({
              type: 'success',
              message: '添加该排班成功'
            })
          }
          this.getWorkShiftList(this.filterSelect)
        })
      }
      this.chooseTypeDialogVisible = false
    },
    getShiftTypeList(typeId) {
      var params = {}
      getListShiftType(params).then(response => {
        if (response.data.data.list) {
          this.typeList = response.data.data.list
          //console.log(this.typeList, '+++++')
          if (typeId != '') {
            for (var i = 0; i < this.typeList.length; i++) {
              if (this.typeList[i].typeId == typeId) {
                this.i = i
                break
              }
            }
          }
        }
      })
    },
    getWorkShiftList(params) {
      this.loading = true
      getListWorkShift(params).then(res => {
        this.manageData = res.data.data.resourceLevel
        this.sevenDays = res.data.data.weekDay
        this.total_count = res.data.data.total_count
        this.loading = false
      })
    },
    getEveryYearWeek() {
      var params = { year: this.currYear }
      getweekday(params).then(res => {
        this.weekData = res.data.data.list
        if (this.weekData.length > 0) {
          let currDate = this.weekData[this.weekData.length - 1].label
          this.currYear = this.getTimeStr(currDate.split('-')[0]).split('-')[0]
        }
        if (this.currWeek != '' && this.currWeek == res.data.data.week.label) {
          this.getWorkShiftList(this.filterSelect)
        } else {
          this.currWeek = res.data.data.week.label
          this.currWeekIndex = res.data.data.week.value
          setTimeout(() => {
            this.weekChange(res.data.data.week.label)
          }, 200)
        }
      })
    },
    storeChange() {
      this.filterSelect.shopId = this.shopId
      var index
      for (index in this.shopListData) {
        if (this.shopId == this.shopListData[index].wxShopId) {
          this.shopName = this.shopListData[index].storeName
          this.shopHour = this.shopListData[index].hour
          this.expiredAt = this.shopListData[index].expiredAt
        }
      }
      this.getWorkShiftList(this.filterSelect)
    },
    weekChange(week) {
      this.filterSelect.dateData = week
      if (this.shopId) {
        this.filterSelect.shopId = this.shopId
        this.getWorkShiftList(this.filterSelect)
        for (var i = 0; i < this.weekData.length; i++) {
          if (this.weekData[i].label == week) {
            this.currWeekIndex = i
            break
          }
        }
      }
    },
    preWeek() {
      if (this.currWeekIndex == 0) {
        this.currYear = Number(this.currYear) - 1
        this.getEveryYearWeek()
        //重新加载周数并将this.currWeekIndex赋值为上一年的最后一周的index
      } else {
        this.currWeekIndex = this.currWeekIndex - 1
      }
      // this.currWeekIndex = this.currWeekIndex == 0 ? 0 : this.currWeekIndex - 1
      let preWeek = this.weekData[this.currWeekIndex].label
      this.currWeek = preWeek
      this.weekChange(preWeek)
    },
    nextWeek() {
      if (this.currWeekIndex >= this.weekData.length - 1) {
        this.currYear = Number(this.currYear) + 1
        this.getEveryYearWeek()
        //重新加载周数
        this.currWeekIndex = 0
      } else {
        this.currWeekIndex = this.currWeekIndex + 1
      }
      // this.currWeekIndex = this.currWeekIndex >= this.weekData.length - 1 ? 0 : this.currWeekIndex + 1
      let nextWeek = this.weekData[this.currWeekIndex].label
      this.currWeek = nextWeek
      this.weekChange(nextWeek)
    },
    getTaskTime(strDate) {
      let date = new Date(strDate)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let str = y + '-' + m + '-' + d
      return str
    },
    getTimeStr(date) {
      return this.getTaskTime(new Date(parseInt(date) * 1000))
    }
  }
}
</script>
<style scoped lang="scss">
.type-name {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cell-item {
  position: relative;
  cursor: pointer;
}
.cell-item-box {
  position: relative;
  &:hover {
    .el-icon-circle-close {
      display: block;
    }
  }
  .el-icon-circle-close {
    display: none;
    cursor: pointer;
    position: absolute;
    right: 5px;
    top: 5px;
    color: #ff5000;
    z-index: 2;
  }
}
</style>
<style lang="scss">
.setting-manage-box {
  .type-add {
    display: inline-block;
    width: 98%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border: 1px solid #ddd;
    cursor: pointer;
  }
  .el-table th,
  .el-table .cell {
    text-align: center;
  }
}
.type {
  &-list {
    .el-alert {
      display: block;
    }
    .el-alert__content {
      display: block;
    }
  }
  &-item {
    margin-bottom: 5px;
  }
  &-item:last-child {
    margin-bottom: 0;
  }
  &-choose-box {
    .type-item {
      cursor: pointer;
      padding: 10px 0;
      &:hover,
      &.checked {
        background: #ff5000;
        color: #fff;
      }
    }
  }
}
.el-alert {
  font-size: 14px;
}
</style>
