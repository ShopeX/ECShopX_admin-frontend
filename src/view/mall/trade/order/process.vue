<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div class="section-white">
      <div v-loading="loading" class="detail-info">
        <el-timeline :reverse="false">
          <el-timeline-item
            v-for="(key, index) in list"
            :key="index"
            :timestamp="key.create_time | datetime('YYYY-MM-DD HH:mm:ss')"
            placement="top"
          >
            <el-card>
              <h2>{{ key.remarks }}</h2>
              <p>{{ $t('18d95d54.a73518') }}{{ key.operator_name }}</p>
              <p>
                {{ $t('18d95d54.f1f902') }}
                <span v-if="'user' == key.operator_type"> {{ $t('18d95d54.1fd02a') }} </span>
                <span v-else-if="'salesperson' == key.operator_type">
                  {{ $t('18d95d54.a6d9eb') }}
                </span>
                <span v-else-if="'admin' == key.operator_type"> {{ $t('18d95d54.b1dae9') }} </span>
                <span v-else-if="'system' == key.operator_type"> {{ $t('18d95d54.8a8b89') }} </span>
                <span v-else-if="'distributor' == key.operator_type">
                  {{ $t('18d95d54.3282f2') }}
                </span>
                <span v-else> {{ $t('18d95d54.1622dc') }} </span>
              </p>
              <p>{{ $t('18d95d54.a7b805') }}{{ key.detail }}</p>
              <p v-if="key.delivery_remark">{{ $t('18d95d54.82ad15') }}{{ key.delivery_remark }}</p>
              <div v-if="key?.pics?.length">
                {{ $t('18d95d54.6a1136') }}
                <div class="img-box">
                  <el-image
                    v-for="(item, idx) in key.pics"
                    :key="idx"
                    :src="item"
                    class="img-item"
                    :preview-src-list="key.pics"
                  />
                </div>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </SpPage>
</template>

<style scoped lang="scss" type="text/css">
h3.title {
  padding: 20px;
  font-size: 18px;
  color: #ff5000;
}
.col-3 {
  width: 120px;
  margin-right: 10px;
}
.detail-info {
  margin: 0 10px;
}
.el-row {
  margin-bottom: 10px;
}
.item-image {
  max-width: 80px;
  margin: 0 auto;
}
img {
  // max-width: 100px;
  margin: 0 auto;
}
.block {
  margin-left: 85px;
}
.radio {
  margin-bottom: 15px;
}
.img-box {
  display: flex;
  flex-wrap: wrap;
}
.img-item {
  width: 150px;
  height: 150px;
  margin: 0 20px 20px 0;
}
</style>
<script>
import { getProcessLog } from '@/api/trade'
export default {
  data() {
    return {
      loading: false,
      order_id: '',
      list: []
    }
  },
  mounted() {
    if (this.$route.query.orderId) {
      this.order_id = this.$route.query.orderId
    }
    this.getProcessLogInfo()
  },
  methods: {
    retrunClick() {
      this.$router.go(-1)
    },
    getProcessLogInfo() {
      this.loading = true
      getProcessLog(this.order_id).then((response) => {
        this.list = response.data.data
        this.loading = false
      })
    }
  }
}
</script>
