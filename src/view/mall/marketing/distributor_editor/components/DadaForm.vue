<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.data-form {
  .el-form-item__content {
    width: auto !important;
  }
  .form-item-tip {
    font-size: 13px;
    color: #999;
    line-height: initial;
  }
  .business-select {
    width: 220px !important;
  }
}
</style>

<template>
  <el-card v-if="show" class="el-card--normal">
    <div slot="header">
      <div>
        {{ $t('68758f54.583dcd') }}<span class="frm-tips">{{ $t('68758f54.d7de2d') }}</span>
      </div>
    </div>
    <el-form
      ref="form"
      class="data-form"
      label-width="120px"
      :model="content.baseForm"
      :rules="rules"
    >
      <el-form-item :label="$t('68758f54.bcb155')">
        <el-switch v-model="content.baseForm.is_dada" />
        <div class="form-item-tip">
          {{ $t('68758f54.62ec6f') }}
        </div>
      </el-form-item>

      <el-form-item v-if="content.baseForm.is_dada" prop="business" :label="$t('68758f54.09ab42')">
        <el-select
          v-model="content.baseForm.business"
          class="business-select"
          :placeholder="$t('68758f54.708c9d')"
        >
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  inject: ['content'],
  data() {
    return {
      typeList: [],
      show: false
    }
  },
  computed: {
    rules() {
      return {
        business: [{ message: this.$t('68758f54.16c84d'), required: true }]
      }
    }
  },
  mounted() {
    this.getDataInfo()
  },
  methods: {
    async getDataInfo() {
      const { business_list, is_open } = await this.$api.dada.getDadaInfo()
      this.typeList = Object.keys(business_list).reduce((total, current, index) => {
        return total.concat({
          value: Number(current),
          label: business_list[current]
        })
      }, [])
      console.log('typeList', this.typeList)
      this.show = is_open === '1'
      this.$emit('onChange', this.show)
    },
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
