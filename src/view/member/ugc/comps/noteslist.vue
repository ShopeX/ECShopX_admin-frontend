<template>
  <div>
    <el-table ref="notestable" v-loading="loading" :data="tmpData" @selection-change="checkChange">
      <el-table-column type="selection" width="55" :selectable="whereDisable" />

      <el-table-column prop="post_id" label="id" />

      <el-table-column prop="title" label="笔记标题" />

      <el-table-column label="角标" prop="badges[0].badge_name" />

      <el-table-column prop="status_text" label="笔记状态" />

      <el-table-column label="排序">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_top == '1'" type="danger" size="mini" effect="dark">
            置项
          </el-tag>
          <div v-else class="text">
            {{ scope.row.p_order }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="创建人">
        <template slot-scope="scope">
          <div v-if="scope.row.source == '2'">管理员</div>
          <div v-else>{{ scope.row.userInfo.nickname }}<br>{{ scope.row.userInfo.mobile }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="created_text" label="创建时间" />

      <el-table-column v-if="handleType" label="操作" width="160" align="center">
        <template slot-scope="scope">
          <div class="operating-icons">
            <el-button
              v-if="scope.row.source != '2'"
              type="text"
              @click="viewDetails(scope.row, scope.$index)"
            >
              详情
            </el-button>

            <el-button v-if="scope.row.source == '2'" type="text">
              <router-link
                :to="{
                  path: '/marketing/ugc/ugcindex/editor',
                  query: { id: scope.row.post_id }
                }"
              >
                编辑
              </router-link>
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
        var text = '审核'
        if (row.status == '1') {
          text = '下架'
        } else if (row.status == '2') {
          text = '发布'
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
      this.$emit('viewDetails', row.post_id)
    },
    auditNote(row) {
      var params = {
        id_set: [row.post_id],
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
        checkList.push(item.post_id)
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
.el-button + .el-button {
  margin-left: 20px;
}
</style>
