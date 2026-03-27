<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-form ref="form" label-width="200px">
    <el-tabs type="border-card">
      <el-tab-pane :label="$t('72593ef2.ae872f')">
        <el-form-item :label="$t('72593ef2.ce06a0')">
          <el-switch
            v-model="form.distributor.show"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
        <el-form-item :label="$t('72593ef2.543ac1')">
          <el-input v-model="form.distributor.distributor" class="input-m">
            <i slot="suffix">%</i>
          </el-input>
          <span class="frm-tips">
            <i class="el-icon-warning-outline" /> {{ $t('72593ef2.4c7c26') }}
          </span>
        </el-form-item>
        <el-form-item :label="$t('72593ef2.b46c38')">
          <el-input v-model="form.distributor.seller" class="input-m">
            <i slot="suffix">%</i>
          </el-input>
          <span class="frm-tips">
            <i class="el-icon-warning-outline" /> {{ $t('72593ef2.df5b74') }}
          </span>
        </el-form-item>
        <el-form-item :label="$t('72593ef2.ee2d0c')">
          <el-input v-model="form.distributor.popularize_seller" class="input-m">
            <i slot="suffix">%</i>
          </el-input>
          <span class="frm-tips">
            <i class="el-icon-warning-outline" /> {{ $t('72593ef2.f2d462') }}
          </span>
        </el-form-item>
        <el-form-item :label="$t('72593ef2.91a10e')">
          <el-input v-model="form.distributor.distributor_seller" class="input-m">
            <i slot="suffix">%</i>
          </el-input>
          <span class="frm-tips">
            <i class="el-icon-warning-outline" /> {{ $t('72593ef2.4cf65f') }}
          </span>
        </el-form-item>
        <el-form-item :label="$t('72593ef2.a8b38b')">
          {{ $t('72593ef2.a7c6cf')
          }}<el-input
            v-model="form.distributor.plan_limit_time"
            class="input-m"
            style="width: 100px"
          />{{ $t('72593ef2.49f897') }}
          <span class="frm-tips"
            ><i class="el-icon-warning-outline" /> {{ $t('72593ef2.6bf7db') }}</span
          >
        </el-form-item>
        <div class="section-footer with-border content-center">
          <el-button type="primary" @click="onSubmit">{{ $t('72593ef2.be5fbb') }}</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-form>
</template>
<script>
import { getDistributionConfig, setDistributionConfig } from '@/api/shop'

export default {
  data() {
    return {
      form: {
        distributor: {
          show: 0,
          distributor: 0,
          seller: 0,
          popularize_seller: 0,
          plan_limit_time: 0
        }
      }
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    getConfig() {
      getDistributionConfig().then((response) => {
        this.form = response.data.data
      })
    },
    onSubmit() {
      setDistributionConfig(this.form).then((response) => {
        this.form = response.data.data
        this.$message({
          type: 'success',
          message: this.$t('72593ef2.3b1083')
        })
      })
    }
  }
}
</script>
<style scoped lang="scss"></style>
