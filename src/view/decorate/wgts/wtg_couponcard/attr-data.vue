<template>
    <div class="wgt-couponcard-attr-data">
        <CompButton placeholder="选择优惠券" format="{0}个优惠券" :value="couponList.length" :view-btn="false"  @remove="onRemoveCoupon" @click="onAddCoupon" />
    </div>
</template>

<script>
import { cloneDeep } from 'lodash-es';
import CompButton from '../../comps/comp-button.vue';
import moment from 'moment'
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
            couponList: []
        }
    },
    created() {
        this.couponList = cloneDeep(this.value)
    },
    methods: {
        async onAddCoupon() {
            const data = this.couponList.map((item) => item.id)
            const { data: couponData } = await this.$picker.coupon({
                data,
                multiple: true,
                params: {
                    regionauth_id: this.$route.query.regionauth_id
                }
            })
            console.log(couponData)

            const couponList = couponData.map((item, index) => {
                let amount
                if (item.card_type == 'cash') {
                    amount = item.reduce_cost/100
                } else if (item.card_type == 'discount') {
                    amount = (100 - parseInt(item.discount)) / 10
                } else {
                    amount = item.reduce_cost/100
                }
                console.log(moment(item.end_date*1000).format('YYYY-MM-DD HH:mm'))
                return {
                    amount,
                    desc: item.description,
                    id: item.card_id,
                    title: item.title,
                    type: item.card_type,
                    end_date: moment(item.end_date*1000).format('YYYY-MM-DD HH:mm')
                }
            })
            this.couponList = couponList
            this.$emit('input', couponList)
        },
        onRemoveCoupon() {
            console.log('onRemoveCoupon')
            this.couponList = []
            this.$emit('input', [])
        }
    }
}
</script>

<style lang="scss" scoped>
.wgt-couponcard-attr-data {}
</style>