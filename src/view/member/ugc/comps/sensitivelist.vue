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
    <el-table ref="keytable" v-loading="loading" :data="tmpData" @selection-change="checkChange">
      <el-table-column type="selection" width="55" :selectable="whereDisable" />

      <el-table-column label="敏感词" prop="text" />

      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row, 'edit')"> 编辑 </el-button>

          <el-button type="text" @click="handleEdit(scope.row, 'del')"> 删除 </el-button>
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
  computed: {},
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
    handleEdit(row, type) {
      var params = {
        id_set: [row.id]
      }
      if (type == 'edit') {
        params.aloneEdit = true
        params.option = row
      } else if (type == 'del') {
        params.aloneDelete = true
      }

      //console.log('handleEdit',[row])
      this.$refs.keytable.clearSelection()
      this.$refs.keytable.toggleRowSelection(row)
      this.$emit('selectNotes', params)
    },
    checkChange(val) {
      var checkList = []
      val.forEach(item => {
        checkList.push(item.id)
      })
      this.$emit('selectNotes', { id_set: checkList })
      //console.log('checkChange',checkList,auditdiff)
    }
  }
}
</script>
<style scoped lang="css"></style>
