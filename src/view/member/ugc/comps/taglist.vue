<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-table ref="tagtable" v-loading="loading" :data="tmpData" @selection-change="checkChange">
      <el-table-column type="selection" width="55" :selectable="whereDisable" />

      <el-table-column prop="tag_id" label="id" />

      <el-table-column prop="tag_name" :label="$t('8f90518f.0eab37')" />

      <el-table-column prop="status_text" :label="$t('8f90518f.e6f080')" />

      <el-table-column v-if="handleType == 'view'" :label="$t('8f90518f.df9a42')">
        <template slot-scope="scope">
          {{ scope.row.userInfo.nickname }}<br />{{ scope.row.userInfo.mobile }}
        </template>
      </el-table-column>

      <el-table-column
        v-if="handleType == 'view'"
        prop="created_text"
        :label="$t('c5ae46b6.eca37c')"
      />

      <el-table-column :label="$t('8da83775.2b6bc0')" width="160" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="auditNote(scope.row)">
            {{ resetText(scope.row) }}
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
      return (row) => {
        var text = this.$t('e240ae54.cf13b1')
        if (row.status == '1') {
          text = this.$t('ed6f1bab.7173f8')
        } else if (row.status == '2') {
          text = this.$t('e240ae54.23c1f3')
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
    auditNote(row) {
      var params = {
        id_set: [row.tag_id],
        auditdiff: false,
        aloneAuditType: row.status == '1' ? 'refuse' : 'pass'
      }
      this.$refs.tagtable.clearSelection()
      this.$refs.tagtable.toggleRowSelection(row)
      this.$emit('selectNotes', params)
    },
    checkChange(val) {
      var checkList = []
      var auditdiff = false
      var status = null
      val.forEach((item) => {
        checkList.push(item.tag_id)
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
