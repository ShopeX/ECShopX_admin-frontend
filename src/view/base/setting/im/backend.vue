<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-form ref="form" label-width="100px">
    <el-form-item :label="$t('31aa0da4.463297')">
      <el-switch
        v-model="form.is_open"
        active-value="true"
        inactive-value="false"
        inactive-color="#ccc"
        :active-text="$t('31aa0da4.cc42dd')"
        :inactive-text="$t('31aa0da4.b15d91')"
        active-color="#13ce66"
      />
    </el-form-item>
    <el-form-item :label="$t('31aa0da4.2eeeb3')">
      <el-input
        v-model="form.enterprise_id"
        style="width: 300px"
        :placeholder="$t('31aa0da4.a11cc7')"
      />
      <div class="frm-tips">
        <a href="https://app.meiqia.com/setting/id-query" target="_blank">{{
          $t('31aa0da4.d501d4')
        }}</a>
      </div>
    </el-form-item>
    <el-form-item :label="$t('31aa0da4.ee3a3f')">
      <el-input v-model="form.group_id" style="width: 300px" :placeholder="$t('31aa0da4.a11cc7')" />
      <div class="frm-tips">
        <a href="https://app.meiqia.com/setting/id-query" target="_blank">{{
          $t('31aa0da4.63dc1c')
        }}</a>
      </div>
    </el-form-item>
    <el-form-item :label="$t('31aa0da4.46e502')">
      <el-input
        v-model="form.persion_ids"
        style="width: 300px"
        :placeholder="$t('31aa0da4.a11cc7')"
      />
      <div class="frm-tips">
        <a href="https://app.meiqia.com/setting/id-query" target="_blank">{{
          $t('31aa0da4.66ce59')
        }}</a>
      </div>
    </el-form-item>
    <div class="section-footer with-border content-center">
      <el-button type="primary" @click="onSubmit">{{ $t('31aa0da4.31d4d4') }}</el-button>
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
        enterprise_id: '',
        group_id: '',
        persion_ids: '',
        type: 'backend'
      },
      query: {
        type: 'backend'
      }
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
      saveMeiqia(this.form).then((response) => {})
    }
  }
}
</script>
<style lang="scss" scoped></style>
