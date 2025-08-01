<template>
  <div class="section-white content-padded">
    <div class="content-bottom-padded">
      <span>创建时间</span>&nbsp;<el-date-picker
        v-model="create_time"
        type="daterange"
        placeholder="选择日期范围"
        style="width: 240px"
        @change="dateChange"
      />
    </div>
    <div>
      <el-table v-loading="loading" :data="rankingList">
        <el-table-column type="index" width="50" />
        <el-table-column prop="store" label="门店" />
        <el-table-column prop="money" label="金额" />
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      create_time: '',
      rankingList: []
    }
  },
  methods: {
    dateChange(val) {
      console.log(val)
    }
  }
}
</script>
