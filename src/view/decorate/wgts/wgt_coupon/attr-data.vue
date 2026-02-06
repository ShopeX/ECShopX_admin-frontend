<template>
  <div class="wgt-couponcard-attr-data">
    <CompButton
      placeholder="选择优惠券"
      format="{0}个优惠券"
      :value="value.length"
      :view-btn="false"
      @remove="onRemoveCoupon"
      @click="onOpenDialog"
    />
    <el-dialog :modal="false" :visible.sync="dialogVisible" title="选择优惠券" width="80vw">
      <el-button type="primary" size="small" @click="onAddCoupon">选择优惠券</el-button>
      <SpFinder
        ref="finder"
        no-selection
        fixed-row-action
        :data="data"
        :setting="setting"
        :reserve-selection="true"
        row-actions-fixed-align="left"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash-es'
import { createSetting } from '@shopex-ui/finder'
import { CARD_TYPE } from '@/consts'
import moment from 'moment'
import CompButton from '../../comps/comp-button.vue'
export default {
  name: 'AttrData',
  components: {
    CompButton
  },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      couponList: [],
      mobCouponList: [],
      dialogVisible: false,
      activeTab: 'pro'
    }
  },
  computed: {
    setting() {
      return createSetting({
        actions: [
          {
            name: '删除',
            key: 'delete',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: (row) => {
                console.log(row, '---')
                if (this.activeTab == 'pro') {
                  this.couponList = this.couponList.filter((item) => item.id !== row[0].id)
                } else {
                  this.mobCouponList = this.mobCouponList.filter((item) => item.id !== row[0].id)
                }
              }
            }
          }
        ],
        columns:
          this.activeTab == 'pro'
            ? [
                { name: '券模板ID', key: 'id' },
                { name: '券名称', key: 'title' },
                {
                  name: '券类型',
                  key: 'card_type',
                  width: '100px',
                  render: (h, { row }) =>
                    h(
                      'el-tag',
                      {
                        props: {
                          size: 'mini'
                        }
                      },
                      this.cardTypeFormatter(row)
                    )
                },
                {
                  name: '使用渠道',
                  key: 'use_scenes',
                  formatter: (value, row, col) => {
                    return <span>{this.formatterCardType(value)}</span>
                  }
                },
                {
                  name: '有效期',
                  key: 'valid_date',
                  formatter: (value, { takeEffect, begin_time, end_time }, col) => {
                    if (takeEffect) {
                      return takeEffect
                    } else {
                      return this.getCardValidate(begin_time, end_time)
                    }
                  }
                },
                // { name: '领取时间', key: 'is_enabled' },
                {
                  name: '状态',
                  key: 'is_enabled',
                  formatter: (value, row, col) => {
                    return <span>已上架</span>
                  }
                },
                {
                  name: '可领取库存',
                  formatter: (value, { quantity, get_num }, col) => {
                    if (quantity > get_num) {
                      return quantity - get_num
                    } else {
                      return 0
                    }
                  }
                },
                {
                  name: '来源',
                  key: 'source',
                  formatter: (value, row, col) => {
                    return <span>AIO PRO</span>
                  }
                },
                { name: '区域', key: 'regionauth_name' }
              ]
            : [
                { name: '券模板ID', key: 'id' },
                { name: '券名称', key: 'title' },
                {
                  name: '券类型',
                  key: 'card_type',
                  width: '100px'
                },
                {
                  name: '使用渠道',
                  key: 'use_scenes',
                  formatter: (value, row, col) => {
                    return <span>{this.formatterCardType(value)}</span>
                  }
                },
                { name: '有效期', key: 'valid_date' },
                {
                  name: '状态',
                  key: 'is_enabled',
                  formatter: (value, row, col) => {
                    return <span>已上架</span>
                  }
                },
                { name: '可领取库存', key: 'stockNum' },
                {
                  name: '来源',
                  key: 'source',
                  formatter: (value, row, col) => {
                    return <span>AIO</span>
                  }
                },
                { name: '区域', key: 'regionauth_name' }
              ]
      })
    },
    data() {
      return this.activeTab == 'pro' ? this.couponList : this.mobCouponList
    }
  },
  created() {},
  methods: {
    getCardValidate(beginDate, endDate) {
      return `${moment(beginDate * 1000).format('YYYY-MM-DD HH:mm:ss')} ~ ${moment(
        endDate * 1000
      ).format('YYYY-MM-DD HH:mm:ss')}`
    },
    handleTabClick(tab, event) {
      console.log(tab, event)
    },
    cardTypeFormatter({ card_type }) {
      return CARD_TYPE[card_type]
    },

    formatterCardType(value) {
      const cardType = {
        'online': '线上商城专享',
        'common': '通用券',
        'offline': '线下专享',
        'OFFLINE': '线下专享',
        'ONLINE': '线上商城专享',
        'COMMON': '通用券',
        'NONE': '通用券' //兑换券
      }
      return cardType[value] || value
    },
    onConfirm() {
      console.log('onConfirm')
      this.$emit('input', [...this.couponList, ...this.mobCouponList])
      this.dialogVisible = false
    },
    onCancel() {
      this.dialogVisible = false
    },
    onOpenDialog() {
      this.dialogVisible = true
      const { couponList, mobCouponList } = this.value.reduce(
        (acc, item) => {
          if (item.card_source_platform !== 'AIO') {
            acc.couponList.push(item)
          } else {
            acc.mobCouponList.push(item)
          }
          return acc
        },
        { couponList: [], mobCouponList: [] }
      )
      this.couponList = cloneDeep(couponList)
      this.mobCouponList = cloneDeep(mobCouponList)
    },
    async onAddCoupon() {
      if (this.activeTab == 'pro') {
        const { data: couponData } = await this.$picker.coupon({
          data: this.couponList,
          multiple: true,
          params: {
            regionauth_id: this.$route.query.regionauth_id
          }
        })
        console.log(couponData)

        const couponList = couponData.map((item, index) => {
          let amount
          if (item.card_type == 'cash') {
            amount = item.reduce_cost / 100
          } else if (item.card_type == 'discount') {
            amount = (100 - parseInt(item.discount)) / 10
          } else {
            amount = item.reduce_cost / 100
          }
          return {
            amount,
            desc: item.description,
            id: item.card_id,
            title: item.title,
            type: item.card_type,
            end_date: moment(item.end_date * 1000).format('YYYY-MM-DD HH:mm'),
            card_source: item?.card_source || '',
            card_source_platform: '',
            ...item
          }
        })
        this.couponList = couponList
      } else {
        const { data: mobCouponData } = await this.$picker.mobCard({
          data: this.mobCouponList,
          multiple: true
        })
        console.log(mobCouponData)
        this.mobCouponList = mobCouponData.map((item) => {
          return {
            ...item,
            amount: item.couponValue / 100,
            id: item.card_id,
            card_source_platform: 'AIO'
          }
        })
      }
    },
    onRemoveCoupon() {
      console.log('onRemoveCoupon')
      this.couponList = []
      this.mobCouponList = []
      this.$emit('input', [])
    }
  }
}
</script>

<style lang="scss">
.wgt-couponcard-attr-data {
  .el-drawer__wrapper {
    z-index: 2025;
  }
}
</style>
