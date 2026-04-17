<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-table ref="notestable" v-loading="loading" :data="tmpData" @selection-change="checkChange">
      <el-table-column type="selection" width="55" :selectable="whereDisable" />

      <el-table-column prop="post_id" label="id" />

      <el-table-column prop="title" :label="$t('c5ae46b6.70dd91')" />

      <el-table-column :label="$t('c5ae46b6.b8c467')" prop="badges[0].badge_name" />

      <el-table-column prop="status_text" :label="$t('c5ae46b6.0326f3')" />

      <el-table-column :label="$t('c5ae46b6.c360e9')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_top == '1'" type="danger" size="mini" effect="dark">
            {{ $t('c5ae46b6.1b8e54') }}
          </el-tag>
          <div v-else class="text">
            {{ scope.row.p_order }}
          </div>
        </template>
      </el-table-column>

      <el-table-column :label="$t('c5ae46b6.95a43e')">
        <template slot-scope="scope">
          <div v-if="scope.row.source == '2'">{{ $t('c5ae46b6.b1dae9') }}</div>
          <div v-else>{{ scope.row.userInfo.nickname }}<br />{{ scope.row.userInfo.mobile }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="created_text" :label="$t('c5ae46b6.eca37c')" />

      <el-table-column v-if="handleType" :label="$t('8da83775.2b6bc0')" width="160" align="center">
        <template slot-scope="scope">
          <div class="operating-icons">
            <el-button
              v-if="scope.row.source != '2'"
              type="text"
              @click="viewDetails(scope.row, scope.$index)"
            >
              {{ $t('a0d7a294.f26225') }}
            </el-button>

            <el-button v-if="scope.row.source == '2'" type="text">
              <router-link
                :to="{
                  path: '/content/ugc/note-management/editor',
                  query: { id: scope.row.post_id }
                }"
              >
                {{ $t('e240ae54.95b351') }}
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
        var text = this.$t('e240ae54.cf13b1')
        if (row.status == '1') {
          text = this.$t('e240ae54.d2379a')
        } else if (row.status == '2') {
          text = this.$t('2e5b8fba.83611a')
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
<style scoped lang="css"></style>
