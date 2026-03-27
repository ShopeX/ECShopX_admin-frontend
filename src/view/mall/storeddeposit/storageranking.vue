<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section-white content-padded">
    <div class="content-bottom-padded">
      <span>{{ $t('1f387ae0.eca37c') }}</span
      >&nbsp;<el-date-picker
        v-model="create_time"
        type="daterange"
        :placeholder="$t('1f387ae0.4b8cb9')"
        style="width: 240px"
        @change="dateChange"
      />
    </div>
    <div>
      <el-table v-loading="loading" :data="rankingList">
        <el-table-column type="index" width="50" />
        <el-table-column prop="store" :label="$t('1f387ae0.a7da92')" />
        <el-table-column prop="money" :label="$t('1f387ae0.4cf24a')" />
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
