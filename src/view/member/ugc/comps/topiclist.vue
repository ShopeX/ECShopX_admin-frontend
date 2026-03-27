<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-table ref="topictable" v-loading="loading" :data="tmpData" @selection-change="checkChange">
      <el-table-column type="selection" width="55" />

      <el-table-column prop="topic_id" label="id" width="100" />

      <el-table-column :label="$t('45d681ba.220164')" prop="topic_name" />

      <el-table-column :label="$t('45d681ba.40c294')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_top == '1'" type="danger" size="mini" effect="dark">
            {{ $t('c5ae46b6.1b8e54') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="$t('45d681ba.4938e6')" prop="status_text" />

      <el-table-column :label="$t('c5ae46b6.95a43e')">
        <template slot-scope="scope">
          <div v-if="scope.row.source == '2'">{{ $t('c5ae46b6.b1dae9') }}</div>
          <div v-else>{{ scope.row.userInfo.nickname }}<br>{{ scope.row.userInfo.mobile }}</div>
        </template>
      </el-table-column>

      <el-table-column :label="$t('8da83775.2b6bc0')" width="160" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="auditNote(scope.row)">
            {{ resetText(scope.row) }}
          </el-button>

          <el-button v-if="scope.row.source == '2'" type="text" @click="handleEdit(scope.row)">
            {{ $t('e240ae54.95b351') }}
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
      val.forEach((item) => {
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
