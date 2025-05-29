<template>
    <div class="wgt-sign-in" :style="outerStyle">
        <div class="wgt-sign-in-content" :style="innerStyle">
            <div class="wgt-sign-in-content-header">
                <div class="wgt-sign-in-content-header-title">
                    <span :style="{ color: value?.titleColor }">每日签到领福利</span>
                    <div class="wgt-sign-in-content-header-title-line">
                        <span class="wgt-sign-in-content-header-title-line-text">已连续签到</span>
                        <span class="wgt-sign-in-content-header-title-line-day">10</span>
                        <span class="wgt-sign-in-content-header-title-line-text">天</span>
                    </div>
                </div>
                <div class="wgt-sign-in-content-header-btn" :style="subscribeBtnStyle">
                    <el-image :src="subscribeBtnImage" class="wgt-sign-in-content-header-btn-image" />
                    <span>订阅签到提醒</span>
                </div>
            </div>
            <div class="wgt-sign-in-content-sign-list">
                <div v-for="item in 7" :key="item" class="wgt-sign-in-content-sign-list-item">
                    <div class="wgt-sign-in-content-sign-list-item-body">
                        <div class="wgt-sign-in-content-sign-list-item-day">
                            <span>第{{ item }}天</span>
                        </div>
                        <div class="wgt-sign-in-content-sign-list-item-content">
                            <el-image v-if="item < 4" :src="signEnd"
                                class="wgt-sign-in-content-sign-list-item-content-image-end" />
                            <el-image v-else :src="signStart"
                                class="wgt-sign-in-content-sign-list-item-content-image-start" />
                            <span class="wgt-sign-in-content-sign-list-item-content-number">{{ item == 7 ? 200 : 20
                                }}</span>
                        </div>
                    </div>
                    <div v-if="item == 7" class="wgt-sign-in-content-sign-list-item-tip">+优惠券</div>
                </div>
            </div>
            <div class="wgt-sign-in-content-sign-reward">
                <div class="reward-item-header">
                    <div class="reward-item-header-title">连续签到可领奖励</div>
                    <div class="reward-item-header-rule">
                        <i class="el-icon-warning-outline" />
                        <span>连续签到规则</span>
                    </div>
                </div>
                <div class="reward-item-body">
                    <div v-for="item in rewardList" :key="`reward-item-body-item-${item?.day}`"
                        class="reward-item-body-item">
                        <div class="reward-item-body-item-lable">
                            <span>第{{ item?.day }}天</span>
                            <span>奖励</span>
                        </div>
                        <div class="reward-item-body-item-content">
                            <div class="reward-item-body-item-content-item">
                                <el-image :src="ticketImg" class="reward-item-body-item-content-image" />
                                <span class="reward-item-body-item-content-number">{{ item?.ticket }}</span>
                            </div>
                            <div class="reward-item-body-item-content-item">
                                <el-image :src="signStart" class="reward-item-body-item-content-image" />
                                <span class="reward-item-body-item-content-number">互动分</span>
                                <span class="reward-item-body-item-content-unit">+{{ item?.gift }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="wgt-sign-in-content-sign-btn" :style="signRewardBtnStyle">
                <span>立即签到</span>
            </div>
            <div class="wgt-sign-in-content-sign">
                <div class="wgt-sign-in-content-sign-item">
                    签到记录
                </div>
                <div class="wgt-sign-in-content-sign-item">
                    签到奖励
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import config from './config'
import subscribeBtnImage from '@/assets/imgs/wgt/notifications_active.png'
import signEnd from '@/assets/imgs/wgt/signend.png'
import signStart from '@/assets/imgs/wgt/signstart.png'
import ticketImg from '@/assets/imgs/wgt/ticket.png'


export default {
    name: 'SignIn',
    wgtName: '签到',
    wgtDesc: '',
    wgtIcon: 'wgt-store',
    config: config,
    props: {
        value: [Object, Array]
    },
    data() {
        return {
            subscribeBtnImage,
            signEnd,
            signStart,
            ticketImg,
            rewardList: [
                {
                    day: 3,
                    gift: 100
                },
                {
                    day: 7,
                    gift: 200,
                    ticket: '立减5元券'

                },
                {
                    day: 15,
                    gift: 300,
                    ticket: '满500减60元券'
                },
                {
                    day: 30,
                    gift: 400,
                    ticket: '立减50元券×2'
                }
            ]
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
            const { innerBackground } = this.value
            return {
                backgroundColor: innerBackground.color,
                backgroundImage: innerBackground?.type == 'gradient' ? `linear-gradient(${innerBackground.startColor}, ${innerBackground.endColor})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }
        },
        subscribeBtnStyle() {
            const { color, textColor } = this.value.subscribeBtn
            return {
                backgroundColor: color,
                color: textColor,
            }
        },
        signRewardBtnStyle() {
            const { color, textColor, image } = this.value.signInBtn
            return {
                backgroundColor: color,
                color: textColor,
                backgroundImage: image ? `url(${image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }
        }
    }

}
</script>

<style lang="scss" scoped>
.wgt-sign-in {
    width: 100%;

    .wgt-sign-in-content {
        width: 100%;
        box-sizing: border-box;
        padding: 18px 10px;

        .wgt-sign-in-content-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;

            .wgt-sign-in-content-header-title {
                font-weight: 600;
                font-size: 17px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: center;

                &-line {
                    display: flex;
                    align-items: center;

                    &-text {
                        font-family: PingFang SC;
                        font-weight: 400;
                        font-size: 13px;
                    }

                    &-day {
                        font-family: D-DIN-PRO;
                        font-weight: 600;
                        color: #E54E78;
                    }
                }
            }

            .wgt-sign-in-content-header-btn {
                padding: 3px 6px;
                font-family: PingFang SC;
                font-weight: 500;
                font-size: 12px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;

                &-image {
                    width: 16px;
                    height: 16px;
                    margin-right: 1px;
                }
            }
        }

        .wgt-sign-in-content-sign-list {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 4px;
            padding-top: 9px;

            &-item {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                flex: 1;
                width: 100%;

                &-body {
                    width: 100%;
                    background: #FFF4D9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    border-radius: 4px;
                    padding: 3px;
                }

                &-day {
                    font-family: PingFang SC;
                    font-weight: 500;
                    font-size: 10px;
                    text-align: center;
                    color: #1A1A1A;
                    padding-bottom: 2px;
                    border-bottom: 1px solid #FFFFFF;
                }

                &-content {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    justify-content: center;
                }

                &-content-image-end {
                    width: 20px;
                    height: 20px;
                }

                &-content-image-start {
                    width: 20px;
                    height: 20px;
                }

                &-content-number {
                    font-family: D-DIN-PRO;
                    font-weight: 600;
                    font-size: 12px;
                    line-height: 100%;
                    letter-spacing: 0px;
                    text-align: center;

                }

                &-tip {
                    font-weight: 500;
                    font-size: 9px;
                    line-height: 100%;
                    text-align: center;
                    color: #E54E78;
                    padding-top: 2px;
                }
            }

        }

        .wgt-sign-in-content-sign-reward {
            width: 100%;
            background: #FFF4D9;
            display: flex;
            align-items: center;
            flex-direction: column;
            box-sizing: border-box;
            padding: 9px;
            border-radius: 8px;
            background: #FFE5ED;
            margin-top: 12px;

            .reward-item-header {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;

                &-title {
                    font-family: PingFang SC;
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 100%;
                    letter-spacing: 0px;
                    color: #E54E78;
                }

                &-rule {
                    padding: 2px 6px;
                    border-radius: 11px;
                    background: rgba(0, 0, 0, 0.1);
                    font-family: PingFang SC;
                    font-weight: 500;
                    font-size: 10px;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    gap: 2px;
                }
            }

            .reward-item-body {
                padding-top: 6px;
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: space-between;
                gap: 3px;
                width: 100%;

                &-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    background: #FFFFFF;
                    border-radius: 4px;
                    padding: 0px 12px;
                    height: 21px;

                    &-lable {
                        font-family: PingFang SC;
                        font-weight: 500;
                        font-size: 11px;
                        color: #1A1A1A;
                    }

                    &-content {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        font-family: PingFang SC;
                        font-weight: 500;
                        text-align: right;
                        color: #1A1A1A;
                        gap: 6px;

                        &-item {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 2px;
                        }

                        &-image {
                            width: 16px;
                            height: 16px;
                        }

                        &-number {
                            font-size: 10px;
                        }

                        &-unit {
                            font-size: 11px;
                        }
                    }
                }
            }

        }
    }

    .wgt-sign-in-content-sign-btn {
        width: 217px;
        height: 43px;
        border-radius: 22px;
        margin-top: 15px;
        margin: 15px auto;
        text-align: center;
        font-family: PingFang SC;
        font-weight: 600;
        font-size: 15px;
        line-height: 43px;
    }

    .wgt-sign-in-content-sign {
        display: flex;
        align-items: center;
        justify-content: center;

        &-item {
            font-family: PingFang SC;
            font-weight: 500;
            font-size: 13px;
            line-height: 100%;
            color: var(--link, #576B95);

            &:first-child {
                border-right: 1px solid #576B95;
                padding-right: 12px;
            }

            &:last-child {
                padding-left: 12px;
            }
        }
    }
}
</style>