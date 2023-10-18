<template>
  <div>
    <el-table ref="tagtable" v-loading="loading" :data="tmpData" @selection-change="checkChange">
      <el-table-column type="selection" width="55" :selectable="whereDisable" />

      <el-table-column prop="tag_id" label="id" />

      <el-table-column prop="tag_name" label="Tag内容" />

      <el-table-column prop="status_text" label="Tag状态" />

      <el-table-column v-if="handleType == 'view'" label="昵称/手机号">
        <template slot-scope="scope">
          {{ scope.row.userInfo.nickname }}<br>{{ scope.row.userInfo.mobile }}
        </template>
      </el-table-column>

      <el-table-column v-if="handleType == 'view'" prop="created_text" label="创建时间" />

      <el-table-column label="操作" width="160" align="center">
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
