<template>
    <div class="wgt-task" :style="outerStyle">
        <div class="wgt-task-content" :style="innerStyle">
            <div class="wgt-task-content-header">
                <div class="wgt-task-content-header-title">
                    <span class="wgt-task-content-header-title-text" :style="{ color: value.titleColor }">做任务领福利</span>
                    <span class="wgt-task-content-header-title-more" :style="{ color: value.moreColor }">更多
                        <i class="el-icon-right" /></span>
                </div>
            </div>
            <div class="wgt-task-content-body">
                <div v-for="(item, index) in 3" :key="index" class="wgt-task-content-body-item">
                    <div class="task-item-left">
                        <div class="task-img">
                            <el-image :src="value.taskImg" class="icon-task-img">
                                <div slot="error" class="task-img-error" />
                            </el-image>
                            <!-- <img src="@/assets/imgs/decorate/default-task-icon.png" alt="任务图标"> -->
                        </div>
                        <div class="task-info">
                            <div class="task-title">任务名称最多十二个字字符</div>
                            <div class="task-rewards">
                                <div class="reward-tag gold">
                                    <el-image :src="signStart" class="reward-icon" />
                                    互动分+20
                                </div>
                                <div class="reward-tag coupon">
                                    <el-image :src="ticketImg" class="reward-icon" />
                                    3件8折券
                                </div>
                            </div>
                            <div class="task-desc">任务说明最多展示两行内容</div>
                        </div>
                    </div>
                    <div class="task-item-right">
                        <div class="task-btn" :style="taskBtnStyle">去完成</div>
                        <div class="task-condition">时间条件</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import config from './config'
import signStart from '@/assets/imgs/wgt/signstart.png'
import ticketImg from '@/assets/imgs/wgt/ticket.png'

export default {
    name: 'Task',
    wgtName: '任务',
    wgtDesc: '',
    wgtIcon: 'wgt-store',
    config: config,
    props: {
        value: [Object, Array]
    },
    data() {
        return {
            signStart: signStart,
            ticketImg: ticketImg,
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
                // background: linear-gradient(180deg, #FFF1CE 0%, #FFFFFF 34.62%, #FFFFFF 99.52%);
                backgroundColor: innerBackground.color,
                backgroundImage: innerBackground?.type == 'gradient' ? `linear-gradient(180deg, ${innerBackground.startColor} 0%, ${innerBackground.endColor} 34.62%, ${innerBackground.endColor} 100%)` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }
        },
        taskBtnStyle() {
            const { color, textColor, image } = this.value.taskBtn
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
.wgt-task {
    width: 100%;

    .wgt-task-content {
        width: 100%;
        box-sizing: border-box;
        padding: 12px;
    }

    .wgt-task-content-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 42px;
    }

    .wgt-task-content-header-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        .wgt-task-content-header-title-text {
            font-family: PingFang SC;
            font-weight: 600;
            font-size: 17px;
        }

        .wgt-task-content-header-title-more {
            font-family: PingFang SC;
            font-weight: 500;
            font-size: 14px;
            cursor: pointer;
        }
    }

    .wgt-task-content-body-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 12px 0 18px;

        .task-item-left {
            display: flex;
            align-items: flex-start;
            gap: 6px;

            .task-img {
                width: 42px;
                height: 42px;
                border-radius: 8px;
                background-color: #EBEBEB;
                overflow: hidden;


                img {
                    width: 100%;
                    height: 100%;
                }
            }


            .task-info {
                display: flex;
                flex-direction: column;
                gap: 1px;


                .task-title {
                    font-family: PingFang SC;
                    font-weight: 500;
                    font-size: 15px;
                    line-height: 100%;
                    color: #1A1A1A;
                    line-height: 21px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                }

                .task-desc {
                    color: #999999;
                    font-size: 12px;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }


                .task-rewards {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }

                .reward-tag {
                    display: flex;
                    align-items: center;
                    padding-right: 6px;
                    height: 20px;
                    font-family: PingFang SC;
                    font-size: 10px;
                    border-radius: 10px;

                    &.gold {
                        background: linear-gradient(90deg, rgba(255, 244, 217, 0) 0%, #FFF4D9 100%);
                        color: #FFC107;

                        .reward-icon {
                            width: 20px;
                            height: 20px;
                            margin-right: 2px;
                        }
                    }

                    &.coupon {
                        background: linear-gradient(90deg, rgba(255, 229, 237, 0) 0%, #FFE6ED 100%);
                        color: #E54E78;

                        .reward-icon {
                            width: 20px;
                            height: 20px;
                            margin-right: 2px;
                        }
                    }
                }
            }
        }

        .task-item-right {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;


            .task-btn {
                width: 70px;
                height: 30px;
                border-radius: 15px;
                background: #404040;
                font-weight: 500;
                font-size: 13px;
                color: #FFFFFF;
                display: flex;
                align-items: center;
                justify-content: center;

            }

            .task-condition {
                font-family: PingFang SC;
                font-weight: 400;
                font-size: 10px;
                line-height: 14px;
                color: #BFBFBF;

            }
        }


    }
}
</style>