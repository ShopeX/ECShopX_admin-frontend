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
    <el-table ref="notestable" v-loading="loading" :data="tmpData" @selection-change="checkChange">
      <el-table-column type="selection" width="55" :selectable="whereDisable" />

      <el-table-column prop="comment_id" label="id" width="100" />

      <el-table-column prop="content" label="评论内容" />

      <el-table-column prop="status_text" label="评论状态" />

      <el-table-column label="创建人">
        <template slot-scope="scope">
          <div v-if="scope.row.userInfo">
            {{ scope.row.userInfo.nickanme }}<br>{{ scope.row.userInfo.mobile }}
          </div>
          <div v-else>管理员</div>
        </template>
      </el-table-column>

      <el-table-column prop="created_text" label="评论时间" />

      <el-table-column v-if="handleType" label="操作" width="160" align="center">
        <template slot-scope="scope">
          <div class="operating-icons">
            <el-button type="text" @click="viewDetails(scope.row, scope.$index)"> 详情 </el-button>

            <el-button type="text" @click="auditNote(scope.row)">
              {{ resetText(scope.row) }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tmpData: Array,
    handleType: String,
    loading: Boolean
  },
  data() {
    return {}
  },
  computed: {
    resetText() {
      return row => {
        var text = '审核'
        if (row.status == '1') {
          text = '拒绝'
        } else if (row.status == '2') {
          text = '通过'
        }
        return text
      }
    }
  },
  mounted() {},
  methods: {
    whereDisable(row) {
      var disable = true
      // if(row.status=='1'){
      //   disable = false;
      // }
      //console.log('row',row)
      return disable
    },
    viewDetails(row) {
      this.$refs.notestable.clearSelection()
      this.$refs.notestable.toggleRowSelection(row)
      this.$emit('viewDetails', row.comment_id)
    },
    auditNote(row) {
      var params = {
        id_set: [row.comment_id],
        auditdiff: false,
        aloneAuditType: row.status == '1' ? 'refuse' : 'pass'
      }
      this.$refs.notestable.clearSelection()
      this.$refs.notestable.toggleRowSelection(row)
      this.$emit('selectNotes', params)
    },
    checkChange(val) {
      var checkList = []
      var auditdiff = false
      var status = null

      val.forEach(item => {
        checkList.push(item.comment_id)
        if (status == null) {
          status = item.status
        } else if (status != item.status) {
          auditdiff = true
        }
      })

      var params = {
        id_set: checkList,
        auditdiff
      }

      this.$emit('selectNotes', params)
      //console.log('checkChange',checkList,auditdiff)
    }
  }
}
</script>
<style scoped lang="css"></style>
