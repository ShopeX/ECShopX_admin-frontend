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
    <el-table ref="ruleTable" v-loading="loading" :data="tmpData">
      <el-table-column prop="badge_id" label="id" width="100" />

      <el-table-column label="角标名称" prop="badge_name" />

      <el-table-column label="备注" prop="badge_memo" />

      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row)"> 编辑 </el-button>

          <el-button type="text" @click="handleDel(scope.row)"> 删除 </el-button>

          <!-- <el-button
            type="text"
            @click="auditNote(scope.row)"
          >
            {{ resetText(scope.row) }}
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tmpData: Array,
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
          text = '下架'
        } else if (row.status == '2') {
          text = '通过'
        }
        return text
      }
    }
  },
  mounted() {},
  methods: {
    handleEdit(row, column) {
      this.$emit('handleEdit', true, row)
    },
    handleDel(row) {
      //console.log('row',row.badge_id)
      this.$emit('handleDel', row.badge_id)
    },
    auditNote(row) {
      var params = {
        id_set: [row.badge_id],
        auditdiff: false,
        aloneAuditType: row.status == '1' ? 'refuse' : 'pass'
      }
      this.$emit('selectNotes', params)
    }
  }
}
</script>
<style scoped lang="css"></style>
