<template>
  <div>
    <div class="cus-form-label">
      <el-input v-model="name" placeholder="输入店铺名称" clearable class="cus-width-35">
        <el-button slot="append" icon="el-icon-search" @click="handleIconClick" />
      </el-input>
      <el-input v-model="address" placeholder="输入经营地址" clearable class="cus-width-35">
        <el-button slot="append" icon="el-icon-search" @click="handleIconClick" />
      </el-input>
    </div>
    <el-table v-loading="info.loading" :data="data" tooltip-effect="dark" style="width: 100%">
      <el-table-column prop="name" label="店铺名称">
        <template slot-scope="scope">
          <i class="el-icon-house icons-size" />
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="经营地址" show-overflow-tooltip>
        <template slot-scope="scope">
          <i class="el-icon-location-outline icons-size" />
          <span style="margin-left: 10px">{{ scope.row.address }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="info.total_count > params.pageSize" class="tr">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="info.total_count"
        :page-sizes="[10, 20, 50]"
        :current-page.sync="params.page"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ['data', 'click', 'info'],
  data() {
    return {
      name: '',
      address: '',
      params: {
        page: 1,
        pageSize: 10,
        is_valid: 'true'
      }
    }
  },
  methods: {
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.$emit('click', this.params)
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.$emit('click', this.params)
    },
    handleIconClick() {
      this.params.name = this.name
      this.params.address = this.address
      this.$emit('click', this.params)
    }
  }
}
</script>

<style lang="scss" scoped>
.cus-form-label {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-around;
}
.cus-width-35 {
  width: 35%;
}
.tr {
  margin-top: 20px;
  text-align: center;
}
.icons-size {
  font-size: 18px;
}
</style>
