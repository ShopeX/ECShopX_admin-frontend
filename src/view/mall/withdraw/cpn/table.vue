<template>
  <el-table ref="Table" :data="seletedBusiness" tooltip-effect="dark" style="width: 100%" border>
    <el-table-column prop="user_name" label="商户名称" width="220" />
    <el-table-column prop="location" label="地址" />
    <el-table-column label="暂冻金额">
      <template slot-scope="scope">
        <el-input style="width: 200px" type="number" min="1" v-model.number="scope.row.draw_limit">
          <template slot="append">元</template>
        </el-input>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="100">
      <template slot-scope="scope">
        <el-button
          style="color: #409eff"
          @click.native.prevent="deleteRow(scope.$index)"
          type="text"
          size="small"
        >
          移除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: ['seletedBusiness'],
  methods: {
    deleteRow(index, rows) {
      this.$emit('deleteRowHandle', index)
    }
  }
}
</script>

<style></style>
