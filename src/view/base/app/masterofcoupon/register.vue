<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section-white content-padded">
    <div class="content-bottom-padded clearfix">
      <div class="f_l">
        <el-tooltip
          class="item"
          effect="light"
          :content="$t('01cc111d.23b46b')"
          placement="right-start"
        >
          <el-button type="primary" icon="plus" @click="actionCouponAdd">
            {{ $t('01cc111d.23b46b') }}
          </el-button>
        </el-tooltip>
      </div>
      <div class="f_r">
        <el-pagination
          layout="prev, pager, next"
          :total="pagers.total"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <div>
      <el-table v-loading="loading" :data="dataList">
        <el-table-column prop="active_name" :label="$t('01cc111d.39834b')" />
        <el-table-column prop="effective_date" :label="$t('01cc111d.bb114a')">
          <template slot-scope="scope">
            {{ scope.row.begin_date }}~{{ scope.row.end_date }}
          </template>
        </el-table-column>
        <el-table-column prop="gift_content" :label="$t('01cc111d.c2174c')" />
        <el-table-column prop="join_num" :label="$t('01cc111d.990969')" />
        <el-table-column prop="" :label="$t('01cc111d.1181a5')">
          <template slot-scope="scope">
            {{ formatStatus(scope.row.active_status) }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('01cc111d.2b6bc0')">
          <template slot-scope="scope">
            <el-button type="text"> {{ $t('01cc111d.607e7a') }} </el-button>
            <el-button type="text" @click="remove(scope.$index)">
              {{ $t('01cc111d.2f4aad') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageSize: 20,
      pagers: {
        total: 0
      },
      dataList: [
        {
          active_name: 'sdfsdf',
          begin_date: '2016-09-10',
          end_date: '2017-09-10',
          gift_content: 'sdfsdf',
          join_num: 20,
          active_status: 0
        }
      ],
      loading: false
    }
  },
  methods: {
    formatStatus(status) {
      const map = {
        0: this.$t('01cc111d.dd4e55'),
        1: this.$t('01cc111d.fb852f'),
        2: this.$t('01cc111d.047fab')
      }
      return map[status] ?? ''
    },
    actionCouponAdd() {
      this.$router.push({ path: '/application/masterofcoupon/registeradd' })
    },
    handleCurrentChange(val) {},
    remove(index) {
      this.dataList.splice(index, 1)
    }
  }
}
</script>
