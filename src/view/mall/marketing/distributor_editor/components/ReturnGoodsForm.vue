<template>
    <el-card class="el-card--normal" header="到店退货">
        <el-form class="return-goods-form"
            label-width="120px">
          <el-form-item label="本店订单">
            <el-switch v-model="content.baseForm.offline_aftersales" />
            <div class="form-item-tip">
              启用后本店订单消费者发起退货退款申请时可在线下门店退货，关闭时本店订单仅可使用快递退货；商家发起的退货订单不受此规则限制。
            </div>
          </el-form-item>
          <div v-show="content.baseForm.offline_aftersales">
            <el-form-item label="本店退货点" style="margin-bottom: 0;">
                <div class="form-item-tip line-height-40">
                  消费者选择到店退货时可看到下方的退货点信息
                </div>
              </el-form-item>
      
              <div class="inner-base-form">
                <el-form-item label="退货点名称" prop="shop_code">
                  <el-input 
                    v-model="content.baseForm.offline_aftersales_address['name']" 
                    placeholder="请填写退货点名称便于买家理解和管理" 
                    :maxlength="10"
                    />
                </el-form-item>
          
                <el-form-item label="退货点地址" prop="name" class="range-select">
                  <el-cascader class="regions" v-model="content.baseForm.offline_aftersales_address['regions_id']" :options="regions" />
                  <el-input v-model="content.baseForm.offline_aftersales_address['address']" placeholder="请填写退货点的具体地址，最短5字，最长120字" />
                </el-form-item>
          
                <el-form-item label="联系电话" prop="contact" class="range-select">
                  <el-input
                    class="start-num"
                    placeholder="区号"
                    v-model="content.baseForm.offline_aftersales_address['area_code']	"
                  />
                  <span class="separator">~</span>
                  <el-input
                    placeholder="请填写准确的联系电话，便于买家联系（手机号时，区号可为空）"
                    v-model="content.baseForm.offline_aftersales_address['mobile']"
                  />
                </el-form-item>
                <el-form-item label="营业时间" prop="mobile" class="range-select">
                  <el-time-select
                    v-model="content.baseForm.offline_aftersales_address['startTime']"
                    placeholder="起始时间"
                    :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '23:59'
                    }"
                  />
                  <span class="separator">~</span>
                  <el-time-select
                    v-model="content.baseForm.offline_aftersales_address['endTime']"
                    placeholder="结束时间"
                    :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '23:59'
                    }"
                  />
                </el-form-item>
              </div>
      
              <el-form-item label="可退货店铺">
                <div class="form-item-tip line-height-40">
                  本店线上订单发起退货退款申请是可在下方列表中的店铺到店退货。
                </div>
                <el-button type="text" @click="onSelectShop">选择店铺</el-button>
                <SpFinder
                  :data="finderData"
                  no-selection
                  url="/distributors/aftersales"
                  ref="finder"
                  :setting="setting"
                  :hooks="{
                    beforeSearch: beforeSearch,
                    afterSearch: afterSearch
                  }"
                />
              </el-form-item>
      
              <el-form-item label="其他店铺订单">
                <el-switch v-model="content.baseForm.offline_aftersales_other" />
                <div class="form-item-tip">
                  启用后其他店铺订单可到本店线下退货点退货；商家发起的退货订单不受此规则限制。
                </div>
              </el-form-item>
          </div>
        </el-form>
      </el-card>
  </template>
  
  <script>
  import district from '@/common/district.json'
  import { createSetting } from '@shopex/finder'
  export default {
    inject: ['content'],
    data () {
      return {
        regions: district,
        finderData: [],
        setting: createSetting({
        actions: [
          {
            name: '移除',
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
        columns: [
          { name: '店铺名称', key: 'name' },
        ]
      }),
      }
    },
    created () {
      const { distributor_id } = this.$route.query
      this.distributor_id = distributor_id
    },
    methods: {
      beforeSearch(params) {
        params = {
          ...params,
          is_selected: 1,
          distributor_id: this.distributor_id
        }
        return params
      },
      afterSearch(response) {
        const { list } = response.data.data
        this.finderData = list
      },
      async onSelectShop() {
        const { data } = await this.$picker.aftersalesList({
          data: this.finderData.map((item) => item.id),
          distributor_id: this.distributor_id
        })
        if (data) {
          this.content.baseForm.offline_aftersales_distributor_id = data.map((item) => item.id)
        }
        this.$refs['finder'].refresh()
      },
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
        .inner-base-form{
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
  