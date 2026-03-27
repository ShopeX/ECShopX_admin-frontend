<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-form ref="form" label-width="100px">
    <el-form-item :label="$t('d27216c6.a960c4')">
      <el-switch
        v-model="form.is_open"
        active-value="true"
        inactive-value="false"
        inactive-color="#ccc"
        :active-text="$t('d27216c6.cc42dd')"
        :inactive-text="$t('d27216c6.b15d91')"
        active-color="#13ce66"
      />
    </el-form-item>
    <el-form-item :label="$t('d27216c6.8e7bb1')">
      <el-switch
        v-model="form.is_distributor_open"
        active-value="true"
        inactive-value="false"
        inactive-color="#ccc"
        :active-text="$t('d27216c6.cc42dd')"
        :inactive-text="$t('d27216c6.b15d91')"
        active-color="#13ce66"
      />
    </el-form-item>
    <el-form-item :label="$t('d27216c6.2eeeb3')">
      <el-input
        v-model="form.enterprise_id"
        style="width: 300px"
        :placeholder="$t('d27216c6.a11cc7')"
      />
      <div class="frm-tips">
        <a href="https://app.meiqia.com/setting/id-query" target="_blank">{{
          $t('d27216c6.d501d4')
        }}</a>
      </div>
    </el-form-item>
    <el-form-item :label="$t('d27216c6.ee3a3f')">
      <el-input v-model="form.group_id" style="width: 300px" :placeholder="$t('d27216c6.a11cc7')" />
      <div class="frm-tips">
        <a href="https://app.meiqia.com/setting/id-query" target="_blank">{{
          $t('d27216c6.63dc1c')
        }}</a>
      </div>
    </el-form-item>
    <el-form-item :label="$t('d27216c6.46e502')">
      <el-input
        v-model="form.persion_ids"
        style="width: 300px"
        :placeholder="$t('d27216c6.a11cc7')"
      />
      <div class="frm-tips">
        <a href="https://app.meiqia.com/setting/id-query" target="_blank">{{
          $t('d27216c6.66ce59')
        }}</a>
      </div>
    </el-form-item>
    <div class="section-footer with-border content-center">
      <el-button type="primary" @click="onSubmit">{{ $t('d27216c6.9459ac') }}</el-button>
    </div>
  </el-form>
</template>
<script>
import { getMeiqiaInfo, saveMeiqia } from '../../../../api/im'

export default {
  data() {
    return {
      loading: false,
      form: {
        is_open: '',
        is_distributor_open: '',
        enterprise_id: '',
        group_id: '',
        persion_ids: ''
      },
      query: {}
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      getMeiqiaInfo(this.query).then((response) => {
        this.form = response.data.data
      })
    },
    onSubmit() {
      saveMeiqia(this.form)
        .then((response) => {
          this.$message({ message: this.$t('d27216c6.3b1083'), type: 'success' })
          this.getInfo()
        })
        .catch()
    }
  }
}
</script>
<style lang="scss" scoped></style>
