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
      val.forEach((item) => {
        checkList.push(item.id)
      })
      this.$emit('selectNotes', { id_set: checkList })
      //console.log('checkChange',checkList,auditdiff)
    }
  }
}
</script>
<style scoped lang="css">
.el-button + .el-button {
  margin-left: 20px;
}
</style>
