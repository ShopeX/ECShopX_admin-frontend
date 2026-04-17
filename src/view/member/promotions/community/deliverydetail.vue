<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section section-white">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane :label="$t('b264361a.9e5ffa')" name="first">
        <el-row>
          <el-col :span="8">
            <span>{{ $t('b264361a.567aed') }}</span> <span>{{ detail.delivery_bn }}</span>
          </el-col>
          <el-col :span="8"> {{ $t('b264361a.75f211') }}{{ detail.community_name }} </el-col>
          <el-col :span="8">
            {{ $t('b264361a.13b5c7') }}
            <el-tag v-if="detail.status === 'PENDING'" type="info">
              {{ $t('b264361a.d8476e') }}
            </el-tag>
            <el-tag v-if="detail.status === 'SHIPPED'" type="primary">
              {{ $t('b264361a.4933ca') }}
            </el-tag>
            <el-tag v-if="detail.status === 'DONE'" type="success">
              {{ $t('b264361a.f87f48') }}
            </el-tag>
            <el-tag v-if="detail.status === 'BADDONE'" type="warning">
              {{ $t('b264361a.5dc3f1') }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span> {{ $t('b264361a.4a3bb4') }}</span
            ><span>{{ detail.shop_number }}</span>
          </el-col>
          <el-col :span="8">
            <span> {{ $t('b264361a.dd2c11') }}</span
            ><span>{{ detail.site_number }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            {{ $t('b264361a.e74a08') }}{{ detail.created_time | datetime('YYYY-MM-DD HH:mm:ss') }}
          </el-col>
          <el-col :span="8">
            {{ $t('b264361a.8fca68')
            }}<span v-if="detail.shipped_time">
              {{ detail.shipped_time | datetime('YYYY-MM-DD HH:mm:ss') }}
            </span>
          </el-col>
          <el-col :span="8">
            {{ $t('b264361a.2bf74a') }}
            <span v-if="detail.finish_time">{{
              detail.finish_time | datetime('YYYY-MM-DD HH:mm:ss')
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <span> {{ $t('b264361a.6e370f') }}</span
            ><span>{{ detail.address }}</span>
          </el-col>
          <el-col :span="8">
            {{ $t('b264361a.751ce6') }}
            <el-input
              v-model="detail.memo"
              type="textarea"
              :rows="2"
              :placeholder="$t('b264361a.3cac63')"
              @blur="handleSetMemo()"
            />
          </el-col>
        </el-row>
        <el-table v-loading="loading" :data="detail.items" border :height="wheight - 270">
          <el-table-column type="index" width="50" :label="$t('b264361a.faaadc')" />
          <el-table-column :label="$t('b264361a.9b94b1')" min-width="50">
            <template slot-scope="scope">
              <img :src="wximageurl + scope.row.item_pic" width="50" />
            </template>
          </el-table-column>
          <el-table-column prop="item_name" :label="$t('b264361a.1fd1d5')" min-width="100" />
          <el-table-column prop="num" :label="$t('b264361a.06612d')" min-width="100" />
          <el-table-column prop="item_bn" :label="$t('b264361a.b07bdf')" min-width="100" />
          <el-table-column prop="item_unit" :label="$t('b264361a.f29968')" min-width="100" />
          <el-table-column prop="bad_item_num" :label="$t('b264361a.1a9a9b')" min-width="100" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import {
  getDeliveryOrderDetail,
  shippingDeliveryorder,
  setDeliveryorderMemo
} from '../../../../api/community'
export default {
  data() {
    return {
      activeName: 'first',
      detail: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    if (this.$route.params.delivery_id) {
      this.getDetail()
    } else {
      this.$router.go(-1)
    }
  },
  methods: {
    handleSetMemo() {
      setDeliveryorderMemo({ memo: this.detail.memo, delivery_id: this.detail.delivery_id }).then(
        (res) => {
          this.$message({
            type: 'success',
            message: this.$t('b264361a.94a22a')
          })
        }
      )
    },
    // 发货确认
    shippedHandle(row) {
      this.$confirm(this.$t('b264361a.8f2605'), this.$t('b264361a.02d981'), {
        confirmButtonText: this.$t('b264361a.38cf16'),
        cancelButtonText: this.$t('b264361a.625fb2'),
        type: 'warning'
      })
        .then(() => {
          shippingDeliveryorder({ delivery_id: row.delivery_id }).then((response) => {
            this.$message({
              type: 'success',
              message: this.$t('b264361a.33130f')
            })
            this.getList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('b264361a.c34281')
          })
        })
    },
    getDetail() {
      this.loading = true
      getDeliveryOrderDetail(this.$route.params.delivery_id).then((response) => {
        this.detail = response.data.data
        this.loading = false
      })
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 10px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
