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
  <div>
    <el-dialog
      :title="dialogTitle"
      :before-close="handleCancelLabelsDialog"
      :visible.sync="dialogIsShow"
      :show-close="false"
      width="30%"
    >
      <div>
        <div class="result">
          单选，选择后在小程序中将在笔记右上角展示；<br>角标的设置需在「官方角标管理」中调整。
        </div>

        <div v-loading="modalLoad" class="flag-list">
          <el-radio
            v-for="(item, index) in flagList"
            :key="index"
            v-model="checkFlag"
            :label="item.badge_id"
            border
            size="small"
          >
            {{ item.badge_name }}
          </el-radio>
        </div>
      </div>
      <div slot="footer" class="btn-bar">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="pagers.total"
          :page-size="params.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />

        <el-button type="primary" size="small" @click="modalHandle"> 确认 </el-button>
        <el-button size="small" @click="handleCancelLabelsDialog"> 取消 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBadge } from '@/api/ugc'
export default {
  props: {
    dialogIsShow: Boolean,
    dufCheckFlag: Object
  },
  data() {
    return {
      modalLoad: false,
      dialogTitle: '选择角标',
      flagList: [],
      checkFlag: null,
      params: {
        page: 1,
        pageSize: 8,
        status: 'ongoing'
      },
      pagers: {
        total: 0
      }
    }
  },
  computed: {},
  watch: {
    dufCheckFlag: {
      handler(newValue, oldValue) {
        this.modalInit()
      },
      immediate: true
    }
  },
  mounted() {
    // this.getFetch()
  },
  methods: {
    modalInit() {
      const that = this
      const { dufCheckFlag } = this.$props
      const { flagList } = this.$data
      if (dufCheckFlag) {
        this.$data.checkFlag = dufCheckFlag.badge_id
        //console.log('modeal flag checkFlag',dufCheckFlag)
      }
      if (flagList.length < 1) {
        this.getFetch()
      }
    },
    getFetch() {
      const that = this
      const { dufCheckFlag } = this.$props
      //console.log('modeal flag',dufCheckFlag)
      that.$data.modalLoad = true
      getBadge({}).then(res => {
        var { list, total_count } = res.data.data
        if (list && this.flagList.length < 1) {
          list.unshift({ badge_id: null, badge_name: '无' })
        }
        that.$data.flagList = list
        that.$data.pagers = { total: total_count }
        that.$data.modalLoad = false
      })
    },
    handleCancelLabelsDialog() {
      this.$emit('cancelLabelsDialog', false)
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getFetch()
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getFetch()
    },
    modalHandle() {
      const { checkFlag, flagList } = this.$data
      var badge = flagList.find(item => item.badge_id == checkFlag)
      //console.log('modalHandle',checkFlag,badge)
      this.$emit('modalHandle', badge)
    }
  }
}
</script>
<style scoped lang="css">
.result {
  position: absolute;
  top: 20px;
  right: 20px;
  line-height: 1.5;
  font-size: 12px;
  color: #999;
}
.btn-bar {
  position: relative;
  text-align: right;
}
.btn-bar .el-pagination {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50%;
  text-align: left;
}
.flag-list .el-radio {
  margin-right: 10px;
  margin-bottom: 10px;
}
.flag-list .el-radio.is-bordered {
  margin-left: 0;
}

.flag-list /deep/ .el-radio .el-radio__input {
  display: none;
}
.flag-list /deep/ .el-radio .el-radio__label {
  padding-left: 0;
}
.flag-list /deep/ .el-radio.is-checked {
  background: #1480e3;
}
.flag-list /deep/ .el-radio.is-checked .el-radio__label {
  color: #fff;
}
</style>
