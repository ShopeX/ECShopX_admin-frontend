<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-card class="el-card--normal" :header="$t('8b441c8b.11b600')">
    <el-form class="return-goods-form" label-width="120px">
      <el-form-item :label="$t('8b441c8b.6dc5f4')">
        <el-switch v-model="content.baseForm.offline_aftersales" />
        <div class="form-item-tip">
          {{ $t('8b441c8b.53dbe3') }}
        </div>
      </el-form-item>
      <div>
        <el-form-item :label="$t('8b441c8b.efdb86')" style="margin-bottom: 0">
          <div class="form-item-tip line-height-40">
            {{ $t('8b441c8b.7f3581') }}
          </div>
        </el-form-item>

        <div class="inner-base-form">
          <el-form-item :label="$t('8b441c8b.4a3fed')" prop="shop_code">
            <el-input
              v-model="content.baseForm.offline_aftersales_address['name']"
              :placeholder="$t('8b441c8b.acb9a6')"
            />
          </el-form-item>

          <el-form-item :label="$t('8b441c8b.fba620')" prop="name" class="range-select">
            <el-cascader
              v-model="content.baseForm.offline_aftersales_address['regions_id']"
              class="regions"
              :options="regions"
            />
            <el-input
              v-model="content.baseForm.offline_aftersales_address['address']"
              :placeholder="$t('8b441c8b.8415ae')"
            />
          </el-form-item>

          <el-form-item :label="$t('8b441c8b.09a1f6')" prop="contact" class="range-select">
            <el-input
              v-model="content.baseForm.offline_aftersales_address['area_code']"
              class="start-num"
              :placeholder="$t('8b441c8b.9a0e44')"
            />
            <span class="separator">~</span>
            <el-input
              v-model="content.baseForm.offline_aftersales_address['mobile']"
              :placeholder="$t('8b441c8b.8f24ce')"
            />
          </el-form-item>
          <el-form-item :label="$t('8b441c8b.cc3307')" prop="mobile" class="range-select">
            <el-time-select
              v-model="content.baseForm.offline_aftersales_address['startTime']"
              :placeholder="$t('8b441c8b.26dac3')"
              :picker-options="{
                start: '00:00',
                step: '00:30',
                end: '23:59'
              }"
            />
            <span class="separator">~</span>
            <el-time-select
              v-model="content.baseForm.offline_aftersales_address['endTime']"
              :placeholder="$t('8b441c8b.f78277')"
              :picker-options="{
                start: '00:00',
                step: '00:30',
                end: '23:59'
              }"
            />
          </el-form-item>
        </div>

        <el-form-item :label="$t('8b441c8b.6105a8')">
          <div class="form-item-tip line-height-40">
            {{ $t('8b441c8b.0e97ba') }}
          </div>
          <el-button type="text" @click="onSelectShop">{{ $t('8b441c8b.afa2e6') }}</el-button>
          <SpFinder ref="finder" no-selection :data="finderData" :setting="setting" />
        </el-form-item>

        <el-form-item :label="$t('8b441c8b.7c8532')">
          <el-switch v-model="content.baseForm.offline_aftersales_other" />
          <div class="form-item-tip">
            {{ $t('8b441c8b.2c41e6') }}
          </div>
        </el-form-item>
      </div>
    </el-form>
  </el-card>
</template>

<script>
import districtOptions from '@/mixins/districtOptions'
import { createSetting } from '@shopex-ui/finder'
export default {
  mixins: [districtOptions],
  inject: ['content'],
  data() {
    return {
      regions: [],
      finderData: [],
      finderUrl: '',
      setting: createSetting({
        actions: [
          {
            name: this.$t('8b441c8b.86048b'),
            key: 'apply',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                const index = this.finderData.findIndex((item) => item.id == row.id)
                this.finderData.splice(index, 1)
                this.$nextTick(() => {
                  this.$refs['finder'].refresh()
                })
              }
            }
          }
        ],
        columns: [{ name: this.$t('8b441c8b.0d4934'), key: 'name' }]
      })
    }
  },
  created() {
    const { distributor_id } = this.$route.query
    this.distributor_id = distributor_id
  },
  mounted() {
    if (this.distributor_id) {
      this.fetchData()
    }
  },
  methods: {
    async fetchData() {
      const { list } = await this.$api.marketing.getAftersales({
        distributor_id: this.distributor_id,
        is_selected: 1
      })
      this.finderData = list
      this.$nextTick(() => {
        this.$refs['finder'].refresh()
      })
    },
    // beforeSearch(params) {
    //   params = {
    //     ...params,
    //     is_selected: 1,
    //     distributor_id: this.distributor_id
    //   }
    //   return params
    // },
    // afterSearch(response) {
    //   const { list } = response.data.data
    //   this.finderData = list
    // },
    async onSelectShop() {
      const ids = this.finderData.map((item) => item.distributor_id)
      const { data } = await this.$picker.afterSalesList({
        data: ids,
        distributor_id: this.distributor_id,
        merchant_id: this.content.baseForm.merchant_id
      })
      this.finderData = data
      this.$nextTick(() => {
        this.$refs['finder'].refresh()
      })
    }
  }
}
</script>

<style lang="scss">
.return-goods-form {
  .regions {
    margin-right: 10px;
    line-height: 40px;
  }
  .el-form-item__content {
    width: calc(100% - 120px) !important;
  }
  .range-select {
    .el-form-item__content {
      display: flex;
      width: fit-content;
    }
    .start-num {
      width: 120px;
    }
  }
  .separator {
    margin: 0 10px;
  }
  .inner-base-form {
    width: fit-content;
    background-color: #f0f2f5;
    margin-left: 120px;
    padding: 30px 30px 30px 0;
    .el-form-item {
      width: 700px;
    }
  }
}
</style>
