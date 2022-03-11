<template>
  <el-dialog
    class="store-dialog"
    title="选择区域"
    :visible.sync="showDialog"
    :close-on-click-modal="false"
    :before-close="cancelAction"
  >
    <div style="margin-bottom: 15px">
      <el-input
        v-model="regionauth_name"
        placeholder="输入区域名称"
        clearable
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="handleIconClick"
        />
      </el-input>
    </div>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="storeData"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column label="选择">
        <template slot-scope="scope">
          <el-radio
            v-model="templateRadio"
            :label="scope.row.regionauth_id"
            @change.native="getTemplateRow(scope.$index, scope.row)"
          >
&nbsp;
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column
        prop="regionauth_name"
        label="区域名称"
      />
    </el-table>
    <div
      v-if="total_count > params.pageSize"
      class="tr"
    >
      <el-pagination
        layout="prev, pager, next"
        :total="total_count"
        :page-size="pageLimit"
        @current-change="handleCurrentChange"
      />
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="cancelAction">取 消</el-button>
      <el-button
        type="primary"
        @click="saveStoreAction"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getRegionauth } from '@/api/regionauth'

export default {
  props: {
    relDataIds: {
      type: Array,
      default: function () {
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
  data () {
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
  computed: {
    showDialog () {
      return this.storeVisible
    }
  },
  watch: {
    sourceType (newVal, oldVal) {
      this.dataType = this.sourceType
    },
    relDataIds (newVal, oldVal) {
      this.selectRows = newVal
    },
    getStatus (newVal, oldVal) {
      this.getRegionauth()
    }
  },
  methods: {
    getTemplateRow (index, row) {
      this.multipleSelection = new Array(row)
    },
    getRegionauth () {
      getRegionauth(this.params).then((response) => {
        this.storeData = response.data.data.list
        this.total_count = parseInt(response.data.data.total_count)
        this.loading = false
        this.multipleSelection = []
      })
    },
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getRegionauth()
    },
    handleIconClick () {
      this.params.regionauth_name = this.regionauth_name
      this.getRegionauth()
    },
    cancelAction () {
      this.$emit('closeStoreDialog')
    },
    saveStoreAction () {
      this.$emit('chooseStore', this.multipleSelection)
    }
  }
}
</script>

<style type="text/css">
.store-dialog .el-checkbox {
  display: inline;
}
</style>
