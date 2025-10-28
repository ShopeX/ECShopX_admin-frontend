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
    <el-table ref="topictable" v-loading="loading" :data="tmpData" @selection-change="checkChange">
      <el-table-column type="selection" width="55" />

      <el-table-column prop="topic_id" label="id" width="100" />

      <el-table-column label="话题名称" prop="topic_name" />

      <el-table-column label="话题置项">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_top == '1'" type="danger" size="mini" effect="dark">
            置项
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="话题状态" prop="status_text" />

      <el-table-column label="创建人">
        <template slot-scope="scope">
          <div v-if="scope.row.source == '2'">管理员</div>
          <div v-else>{{ scope.row.userInfo.nickname }}<br>{{ scope.row.userInfo.mobile }}</div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="auditNote(scope.row)">
            {{ resetText(scope.row) }}
          </el-button>

          <el-button v-if="scope.row.source == '2'" type="text" @click="handleEdit(scope.row)">
            编辑
          </el-button>
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

    handleEdit(row, column) {
      this.$emit('handleEdit', true, row)
    },
    auditNote(row) {
      var params = {
        id_set: [row.topic_id],
        auditdiff: false,
        aloneAuditType: row.status == '1' ? 'refuse' : 'pass'
      }
      this.$refs.topictable.clearSelection()
      this.$refs.topictable.toggleRowSelection(row)
      this.$emit('selectNotes', params)
    },
    checkChange(val) {
      var checkList = []
      var auditdiff = false
      var status = null
      val.forEach(item => {
        checkList.push(item.topic_id)
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
<style scoped lang="css">
.comps-flaglist .f-info {
  display: flex;
  width: 900px;
}
.comps-flaglist .f-info .el-button {
  margin-left: 20px;
}
</style>
