<template>
  <div>
    <SpDialog
      v-model="value"
      @input="$emit('input', $event)"
      class="comp-conflict-activity"
      title="同一商品不得同时存在多个促销活动，以下活动有重复："
      :isShowFooter="false"
      :modal="false"
      :form="activityForm"
      :form-list="activityFormList"
    />
  </div>
</template>

<script>
import { createSetting } from '@shopex/finder'
import { PROMOTION_TYPE_MAP } from '@/consts'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activityForm: {},
      activityFormList: [
        {
          component: ({ key }, value) => {
            return (
              <SpFinder

                data={this.list}
                show-pager={false}
                no-selection={true}
                setting={this.setting}
              />
            )
          }
        }
      ]
    }
  },
  computed: {
    setting() {
      return createSetting({
        actions: [
          {
            name: '查看详情',
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([row]) => {
                this.handleDetail(row)
              }
            }
          }
        ],
        columns: [
          { name: '活动ID', key: 'marketing_id' },
          { name: '活动名称', key: 'marketing_name' },
          {
            name: '活动类型',
            key: 'enterprise_sn',
            render: (h, { row }) => {
              return <span>{PROMOTION_TYPE_MAP[row.marketing_type]}</span>
            }
          },
          {
            name: '活动时间',
            key: 'enterprise_sn',
            render: (h, { row }) => {
              return <span>{row.start_date} ~ {row.end_date} </span>
            }
          }
        ]
      })
    }
  },
  methods: {
    handleDetail({marketing_type,marketing_id}) {
      const PROMOTION_TYPE_URL_MAP = {
        'full_minus':'/marketing/promotion/Marketingsfullminus/editor/',//'满减',
        'full_discount':'/marketing/promotion/marketingsfulldiscount/editor/',//'满折'
        'full_gift':'/marketing/promotion/Marketingsfullgift/editor/',//'满赠',
        'limited_time_sale':'/marketing/promotion/limitedtimesale/editor/',//'限时特惠',
        'member_preference':'/marketing/membermarket/memberpreference/editor/',//优先购
        // 'normal':'秒杀',
        // 'single_group' : '团购' ,
        // 'plus_price_buy':'换购',
        // 'specific_crowd':'定向营销'
      }
      // ?isnodata=true
      const href = `${PROMOTION_TYPE_URL_MAP[marketing_type]}${marketing_id}?isnodata=true`
      if(PROMOTION_TYPE_URL_MAP[marketing_type]){
        window.open(href,'_blank')
      }

    }
  }
}
</script>

<style lang="scss">
.comp-conflict-activity {
  .el-dialog__body .el-form {
    margin: 0 !important;
  }
}
</style>
