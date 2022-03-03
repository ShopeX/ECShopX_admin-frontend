<template>
  <el-dialog
    class="store-dialog"
    title="选择区域"
    :visible.sync="showDialog"
    :close-on-click-modal="false"
    :before-close="cancelAction"
  >
    <div style="margin-bottom: 15px;">
      <el-input placeholder="输入区域名称" v-model="regionauth_name" clearable>
        <el-button slot="append" icon="el-icon-search" @click="handleIconClick"></el-button>
      </el-input>
    </div>
    <el-table
      ref="multipleTable"
      :data="storeData"
      tooltip-effect="dark"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column label="选择">
        <template slot-scope="scope">
          <el-radio
            :label="scope.row.regionauth_id"
            v-model="templateRadio"
            @change.native="getTemplateRow(scope.$index, scope.row)"
            >&nbsp;
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="regionauth_name" label="区域名称"></el-table-column>
    </el-table>
    <div v-if="total_count > params.pageSize" class="tr">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :total="total_count"
        :page-size="pageLimit"
      >
      </el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelAction">取 消</el-button>
      <el-button type="primary" @click="saveStoreAction">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getRegionauth } from '@/api/regionauth'

export default {
  props: {
    relDataIds: {
      type: Array,
      default: function() {
        return []
      }
    },
    getStatus: {
      type: Boolean,
      default: false
    },
    isValid: {
      type: Boolean,
      default: false
    },
    storeVisible: {
      type: Boolean,
      default: false
    },
    sourceType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      templateRadio: '',
      dataType: 'regionauth',
      loading: false,
      storeData: [],
      multipleSelection: [],
      pageLimit: 10,
      total_count: '',
      params: {
        page: 1,
        pageSize: 10,
        state: 1
      },
      regionauth_name: ''
    }
  },
  methods: {
    getTemplateRow(index, row) {
      this.multipleSelection = new Array(row)
    },
    getRegionauth() {
      getRegionauth(this.params).then((response) => {
        this.storeData = response.data.data.list
        this.total_count = parseInt(response.data.data.total_count)
        this.loading = false
        this.multipleSelection = []
      })
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getRegionauth()
    },
    handleIconClick() {
      this.params.regionauth_name = this.regionauth_name
      this.getRegionauth()
    },
    cancelAction() {
      this.$emit('closeStoreDialog')
    },
    saveStoreAction() {
      this.$emit('chooseStore', this.multipleSelection)
    }
  },
  computed: {
    showDialog() {
      return this.storeVisible
    }
  },
  watch: {
    sourceType(newVal, oldVal) {
      this.dataType = this.sourceType
    },
    relDataIds(newVal, oldVal) {
      this.selectRows = newVal
    },
    getStatus(newVal, oldVal) {
      this.getRegionauth()
    }
  }
}
</script>

<style type="text/css">
.store-dialog .el-checkbox {
  display: inline;
}
</style>
