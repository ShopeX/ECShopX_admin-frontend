<style lang="scss" src="./index.scss" />
<template>
    <div class="wgt-couponcard" :style="outerStyle">
        <div class="wgt-couponcard-inner" :style="innerStyle" :class="{
            'wgt-couponcard-one': value.data.length == 1,
            'wgt-couponcard-two': value.data.length == 2,
            'wgt-couponcard-three': value.data.length == 3,
            'wgt-couponcard-more': value.data.length >= 4,
        }">
            <div v-for="(item, index) in value.data" :key="index" class="wgt-couponcard-item">
                <div class="wgt-couponcard-item-body">
                    <div class="wgt-couponcard-item-header">
                        <div v-if="item.type !== 'discount'" class="coupon-unit" :style="{ color: value.amountColor }">
¥
                        </div>
                        <div class="coupon-title" :style="{ color: value.amountColor }">{{ item.amount }}</div>
                        <div v-if="item.type == 'discount'" class="coupon-unit" :style="{ color: value.amountColor }">
折
                        </div>
                    </div>
                    <div v-if="value.data.length == 1" class="wgt-couponcard-item-info">
                        <p class="use-title">{{ item?.title }}</p>
                        <p class="use-desc">使用条件{{ item.desc }}</p>
                        <p class="use-time">有效期至 {{ item.end_date }}</p>
                    </div>
                    <div v-else class="wgt-couponcard-item-info">
                        <p class="use-title">{{ item?.title }}</p>
                        <p class="use-desc">{{ item.desc }}</p>
                    </div>
                </div>
                <div class="wgt-couponcard-item-btn" :style="receiveBtnStyle">立即领取</div>
            </div>
        </div>
    </div>
</template>

<script>
import config from './config'
export default {
    name: 'CouponCard',
    wgtName: '优惠券',
    wgtDesc: '',
    wgtIcon: 'wgt-coupon',
    wgtType: 2,
    config: config,
    props: {
        value: [Object, Array]
    },
    data() {
        return {
            currentIndex: 1,
            couponDeep: {}
        }
    },
    computed: {
        outerStyle() {
            const { outerMargin, outerBackground } = this.value
            return {
                paddingTop: outerMargin.paddedt + 'px',
                paddingBottom: outerMargin.paddedb + 'px',
                paddingLeft: outerMargin.paddedl + 'px',
                paddingRight: outerMargin.paddedr + 'px',
                backgroundColor: outerBackground.color,
                backgroundImage: outerBackground.image ? `url(${outerBackground.image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }
        },
        innerStyle() {
            const { innerMargin, innerBackground } = this.value
            return {
                paddingTop: innerMargin.paddedt + 'px',
                paddingBottom: innerMargin.paddedb + 'px',
                paddingLeft: innerMargin.paddedl + 'px',
                paddingRight: innerMargin.paddedr + 'px',
                backgroundColor: innerBackground.color,
                backgroundImage: innerBackground?.type == 'gradient' ? `linear-gradient(${innerBackground.startColor} , ${innerBackground.endColor})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }
        },
        receiveBtnStyle() {
            const { color, textColor, } = this.value.receiveBtn
            return {
                backgroundColor: color,
                color: textColor,
            }
        }
    },
    created() { },
    methods: {
    }
}
</script>
