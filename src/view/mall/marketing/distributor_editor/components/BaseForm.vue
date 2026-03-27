<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.shop-baseinfo-form {
  .el-form-item__content {
    width: 220px;
  }
  .start-time,
  .end-time {
    width: 100px;
  }
  .separator {
    margin: 0 5px;
  }
  .form-item-tip {
    font-size: 13px;
    color: #999;
    line-height: initial;
  }
}
</style>
<template>
  <el-card class="el-card--normal" :header="$t('bc312924.6ea1fe')">
    <el-form
      ref="form"
      class="shop-baseinfo-form"
      label-width="120px"
      :inline="true"
      :model="content.baseForm"
      :rules="rules"
    >
      <el-form-item :label="$t('bc312924.f6d738')" prop="shop_code">
        <el-input
          v-model="content.baseForm.shop_code"
          :placeholder="$t('bc312924.68f04a')"
          :maxlength="10"
        />
      </el-form-item>

      <el-form-item :label="$t('bc312924.0d4934')" prop="name">
        <el-input v-model="content.baseForm.name" :placeholder="$t('bc312924.867738')" />
      </el-form-item>

      <el-form-item :label="$t('bc312924.986d36')" prop="contact">
        <el-input
          v-model="content.baseForm.contact"
          :placeholder="$t('bc312924.e30625')"
          :disabled="content.baseForm.datapass_block == 1 && distributor_id > 0"
        />
      </el-form-item>

      <el-form-item :label="$t('bc312924.b58943')" prop="mobile">
        <el-input
          v-model="content.baseForm.mobile"
          :placeholder="$t('bc312924.2b28a8')"
          :disabled="content.baseForm.datapass_block == 1 && distributor_id > 0"
        />
      </el-form-item>

      <el-form-item :label="$t('bc312924.699886')">
        <el-input v-model="content.baseForm.contract_phone" :placeholder="$t('bc312924.cb842c')" />
      </el-form-item>

      <el-form-item :label="$t('bc312924.a2bed2')">
        <el-time-select
          v-model="content.baseForm.startTime"
          class="start-time"
          :placeholder="$t('bc312924.26dac3')"
          :picker-options="{
            start: '00:00',
            step: '00:30',
            end: '23:59'
          }"
        />
        <span class="separator">~</span>
        <el-time-select
          v-model="content.baseForm.endTime"
          class="end-time"
          :placeholder="$t('bc312924.f78277')"
          :picker-options="{
            start: '00:00',
            step: '00:30',
            end: '23:59',
            minTime: content.baseForm.startTime
          }"
        />
      </el-form-item>

      <el-form-item :label="$t('bc312924.2e552e')">
        <el-switch v-model="content.baseForm.is_delivery" />
      </el-form-item>

      <el-form-item
        v-if="content.baseForm.distribution_type != '1' && !VERSION_STANDARD()"
        :label="$t('bc312924.48f0ee')"
      >
        <el-switch v-model="content.baseForm.is_audit_goods" />
        <div class="form-item-tip">{{ $t('bc312924.c46414') }}</div>
      </el-form-item>

      <el-form-item
        v-if="
          VERSION_STANDARD() &&
          $store.getters.login_type != 'distributor' &&
          !content.baseForm.distributor_self
        "
        :label="$t('bc312924.5aa3a7')"
      >
        <el-switch v-model="content.baseForm.auto_sync_goods" />
        <div class="form-item-tip">{{ $t('bc312924.8d61d8') }}</div>
      </el-form-item>
      <el-form-item v-if="!content.baseForm.distributor_self" :label="$t('bc312924.6e548b')">
        <el-switch v-model="content.baseForm.is_require_subdistrict" />
        <div class="form-item-tip">{{ $t('bc312924.1ef2d0') }}</div>
      </el-form-item>
      <el-form-item v-if="!content.baseForm.distributor_self" :label="$t('bc312924.a4e97c')">
        <el-switch v-model="content.baseForm.is_require_building" />
        <div class="form-item-tip">{{ $t('bc312924.e2f9a1') }}</div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  inject: ['content'],
  data() {
    return {
      startTime: '08:00',
      endTime: '21:00',
      distributor_id: null
    }
  },
  computed: {
    rules() {
      return {
        shop_code: [
          {
            pattern: /^[A-Za-z0-9\-]+$/,
            message: this.$t('bc312924.3bb116'),
            required: true
          }
        ],
        name: [{ message: this.$t('bc312924.45c9f8'), required: true }],
        contact: [{ message: this.$t('bc312924.e65a59'), required: true }],
        mobile: [{ message: this.$t('bc312924.3510d5'), required: true }]
      }
    }
  },
  mounted() {
    this.distributor_id = this.$route.query.distributor_id
  },
  methods: {
    validate() {
      return new Promise((resolve, reject) => {
        return this.$refs.form.validate((valid) => {
          if (valid) {
            resolve()
          } else {
            reject()
          }
        })
      })
    }
  }
}
</script>
