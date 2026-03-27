<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-card :header="$t('1874b458.e5f71f')" class="search-card">
      <SpFormPlus
        v-model="form"
        form-type="searchForm"
        :form-items="formItems"
        :inline="true"
        @submit="handleSearch"
        @reset="handleReset"
      />
    </el-card>
    <el-card :header="$t('1874b458.419c0e')">
      <el-row :gutter="40">
        <el-col v-for="(item, index) in list" :key="index" :xs="8" :sm="6" :md="6" :lg="6" :xl="4">
          <LogisticsBlock :info="item" :disabled="index === 0" @refreshList="getList" />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getLogisticsList } from '@/api/logistics'
import LogisticsBlock from './component/logisticsBlock'
export default {
  components: { LogisticsBlock },
  data() {
    return {
      form: {
        corp_name: '',
        status: 0
      },
      list: []
    }
  },
  computed: {
    formItems() {
      return [
        {
          fieldName: 'corp_name',
          label: this.$t('1874b458.f35ebd'),
          cellWidth: 2,
          component: 'input',
          componentProps: {
            placeholder: this.$t('1874b458.7ba15c')
          }
        },
        {
          fieldName: 'status',
          label: this.$t('1874b458.2c574f'),
          component: 'select',
          componentProps: {
            placeholder: this.$t('1874b458.708c9d'),
            clearable: true,
            options: [
              { value: 0, label: this.$t('1874b458.a8b0c2') },
              { value: 1, label: this.$t('1874b458.7854b5') },
              { value: 2, label: this.$t('1874b458.b15d91') }
            ]
          }
        }
      ]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleReset: function () {
      this.form = {
        corp_name: '',
        status: 0
      }
      this.getList()
    },
    handleSearch: function () {
      this.getList()
    },
    getList: function () {
      getLogisticsList({
        ...this.form
      }).then((res) => {
        const {
          data: {
            data: { list }
          }
        } = res
        this.list = list
      })
    }
  }
}
</script>

<style scoped lang="scss">
.search-card {
  ::v-deep .sp-form-plus--search-form {
    background-color: white;
  }
}
</style>
