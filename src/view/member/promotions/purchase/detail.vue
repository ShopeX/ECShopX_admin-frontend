<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section section-white">
    <div class="section-header with-border">{{ $t('f60777f5.67d849') }}</div>
    <div class="section-body">
      <el-form ref="detail" :model="detail" label-width="150px" label-position="right">
        <el-form-item :label="$t('f60777f5.eb2f99')">
          {{ detail.purchase_name }}
        </el-form-item>
        <el-form-item :label="$t('f60777f5.d89b24')">
          <img class="detail-img" :src="detail.ad_pic">
        </el-form-item>
        <el-form-item :label="$t('f60777f5.339045')" prop="activity_time">
          {{ detail.begin_date }} ~ {{ detail.end_date }}
        </el-form-item>
        <el-form-item :label="$t('f60777f5.936aa4')">
          {{ roleTransform(detail.used_roles) }}
        </el-form-item>
        <el-form-item :label="$t('f60777f5.aaf0b4')">
          {{ detail.employee_limitfee }}
        </el-form-item>
        <el-form-item :label="$t('f60777f5.9726c0')">
          {{ detail.is_share_limitfee ? $t('f60777f5.0a60ac') : $t('f60777f5.c9744f') }}
        </el-form-item>
        <el-form-item
          v-if="
            detail.used_roles &&
            detail.used_roles.indexOf('dependents') > -1 &&
            !detail.is_share_limitfee
          "
          :label="$t('f60777f5.be3d6c')"
        >
          {{ detail.dependents_limitfee }}
        </el-form-item>
        <el-form-item
          v-if="detail.used_roles && detail.used_roles.indexOf('dependents') > -1"
          :label="$t('f60777f5.060d99')"
        >
          {{ detail.dependents_limit }}
        </el-form-item>
        <el-form-item :label="itemTypeTransform(detail.item_type) + $t('f60777f5.5ecbfa')">
          <p v-if="detail.item_type == 'all'">
            {{ $t('f60777f5.343488') }}{{ detail.item_limit }}{{ $t('f60777f5.f7edf5') }}
          </p>
          <el-table v-else :data="detail.item_limit">
            <el-table-column prop="item_id" label="ID" />
            <el-table-column prop="name" :label="$t('f60777f5.d7ec2d')" />
            <el-table-column
              v-if="detail.item_type === 'item'"
              prop="item_spec_desc"
              :label="$t('f60777f5.8fc069')"
            />
            <el-table-column prop="limit_num" :label="$t('f60777f5.343488')" />
            <el-table-column prop="limit_fee" :label="$t('f60777f5.8a34e8')" />
          </el-table>
        </el-form-item>
        <el-form-item :label="$t('f60777f5.6703e8')">
          {{ detail.minimum_amount }}
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getPurchaseInfo } from '@/api/purchase'

export default {
  data() {
    return {
      detail: {}
    }
  },
  mounted() {
    if (this.$route.query.id) {
      let filter = { purchase_id: this.$route.query.id }
      getPurchaseInfo(filter).then((res) => {
        this.detail = res.data.data
        const { dependents_limitfee, employee_limitfee, item_limit, minimum_amount } = this.detail
        this.detail.dependents_limitfee = (dependents_limitfee / 100).toFixed(2)
        this.detail.employee_limitfee = (employee_limitfee / 100).toFixed(2)
        this.detail.minimum_amount = (minimum_amount / 100).toFixed(2)
        if (Array.isArray(item_limit) && item_limit.length > 0) {
          this.detail.item_limit = item_limit.map((item) => {
            item.limit_fee = (item.limit_fee / 100).toFixed(2)
            return item
          })
        }
      })
    }
  },
  methods: {
    roleTransform(role) {
      if (role) {
        let transRole = eval(role)
        let textArr = []
        transRole.length > 0 &&
          transRole.indexOf('employee') > -1 &&
          textArr.push(this.$t('f60777f5.2ed392'))
        transRole.length > 0 &&
          transRole.indexOf('dependents') > -1 &&
          textArr.push(this.$t('f60777f5.4eca5b'))
        return textArr.toString()
      }
    },
    itemTypeTransform(type) {
      if (!type) return ''
      const map = {
        all: 'f60777f5.794a4e',
        item: 'f60777f5.106704',
        tag: 'f60777f5.ca5298',
        category: 'f60777f5.9f7160',
        brand: 'f60777f5.32906f'
      }
      return this.$t(map[type] || '')
    }
  }
}
</script>
<style scoped lang="scss">
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 1px;
}
.detail-img {
  width: 150px;
}
</style>
