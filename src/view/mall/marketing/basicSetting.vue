<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section section-white">
    <el-form ref="form" :label-position="'left'" :model="form" label-width="160px">
      <div v-loading="loading" class="section-body">
        <!--
        <el-form-item label="购买限制">
          <el-radio-group v-model="form.is_buy">
            <el-radio :label="true"  :key="true">店铺自身可购买</el-radio>
            <el-radio :label="false" :key="false">店铺自身不可购买</el-radio>
          </el-radio-group>
        </el-form-item>
        -->
        <el-form-item :label="$t('664b0a1e.ee25bb')">
          {{ $t('664b0a1e.10c96e') }}
          <el-input
            v-model="form.limit_rebate"
            :placeholder="$t('664b0a1e.22266f')"
            style="width: 80px"
          />
          {{ $t('664b0a1e.c16655') }}
        </el-form-item>
        <el-form-item :label="$t('664b0a1e.c6ef82')">
          {{ $t('664b0a1e.c1a80c') }}
          <el-input
            v-model="form.limit_time"
            :placeholder="$t('664b0a1e.22266f')"
            style="width: 80px"
          />
          {{ $t('664b0a1e.49f897') }}
        </el-form-item>
        <el-form-item :label="$t('664b0a1e.7c4898')">
          <el-input
            v-model="form.return_name"
            :placeholder="$t('664b0a1e.7c4898')"
            style="width: 280px"
          />
        </el-form-item>
        <el-form-item :label="$t('664b0a1e.114351')">
          <el-input
            v-model="form.return_address"
            :placeholder="$t('664b0a1e.4a9179')"
            style="width: 280px"
          />
        </el-form-item>
        <el-form-item :label="$t('664b0a1e.36abca')">
          <el-input
            v-model="form.return_phone"
            :placeholder="$t('664b0a1e.4e2665')"
            style="width: 280px"
          />
        </el-form-item>
      </div>
      <div class="section-footer with-border content-center">
        <el-button type="primary" @click="save"> {{ $t('664b0a1e.be5fbb') }} </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { getBasicConfig, saveBasicConfig } from '../../../api/marketing'
export default {
  data() {
    return {
      loading: false,
      form: {
        is_buy: true,
        limit_rebate: '',
        limit_time: '',
        return_name: '',
        return_address: '',
        return_phone: ''
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    save() {
      saveBasicConfig(this.form).then((res) => {
        if (res.data.data) {
          this.$message({
            type: 'success',
            message: this.$t('664b0a1e.ae9a55')
          })
        }
        this.getData()
      })
    },
    getData() {
      this.loading = true
      getBasicConfig().then((res) => {
        if (res.data.data) {
          this.form = res.data.data
          if (this.form.limit_rebate) {
            this.form.limit_rebate = this.form.limit_rebate / 100
          }
        }
        this.loading = false
      })
    }
  }
}
</script>
