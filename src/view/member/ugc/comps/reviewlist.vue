<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-table ref="notestable" v-loading="loading" :data="tmpData" @selection-change="checkChange">
      <el-table-column type="selection" width="55" :selectable="whereDisable" />

      <el-table-column prop="comment_id" label="id" width="100" />

      <el-table-column prop="content" :label="$t('ed6f1bab.034484')" />

      <el-table-column prop="status_text" :label="$t('ed6f1bab.8d81d3')" />

      <el-table-column :label="$t('c5ae46b6.95a43e')">
        <template slot-scope="scope">
          <div v-if="scope.row.userInfo">
            {{ scope.row.userInfo.nickanme }}<br>{{ scope.row.userInfo.mobile }}
          </div>
          <div v-else>{{ $t('c5ae46b6.b1dae9') }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="created_text" :label="$t('ed6f1bab.a666ad')" />

      <el-table-column v-if="handleType" :label="$t('8da83775.2b6bc0')" width="160" align="center">
        <template slot-scope="scope">
          <div class="operating-icons">
            <el-button type="text" @click="viewDetails(scope.row, scope.$index)">
{{
              $t('a0d7a294.f26225')
            }}
</el-button>

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

      val.forEach((item) => {
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
