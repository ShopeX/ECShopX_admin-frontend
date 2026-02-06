<template>
    <div class="wgt-location-module">
        <!-- 导航栏 -->
        <div class="nav-wrapper" :style="navWrapperStyle">
            <!-- 左滑示意图 -->
            <img v-if="value.leftimgUrl && showLeftIndicator" :src="value.leftimgUrl" class="nav-indicator left" alt="">
            
            <!-- 导航项容器 -->
            <div ref="navScroller" class="nav-scroller" :style="navItemAreaStyle" @scroll="handleScroll">
                <div class="nav-list" :style="navListStyle">
                    <div v-for="(item, index) in navItems" :key="index" 
                        class="nav-item" 
                        :class="{ 'is-active': activeIndex === index }"
                        :style="getNavItemStyle(item, index)"
                        @click="handleNavClick(index)">
                        <!-- 图片类型 -->
                        <img v-if="item.navitemtype === 'image'" 
                            :src="activeIndex === index ? (item.navitemactiveimg || item.imgUrl) : item.imgUrl" 
                            class="nav-item-img" alt="">
                        <!-- 文字类型 -->
                        <span v-else class="nav-item-text">{{ item.navItemName }}</span>
                        <!-- 选中底线 -->
                        <span v-if="value.navitemborder && activeIndex === index" 
                            class="nav-item-border" 
                            :style="{ backgroundColor: value.navitembordercolor }" />
                    </div>
                </div>
            </div>
            
            <!-- 右滑示意图 -->
            <img v-if="value.rightimgUrl && showRightIndicator" :src="value.rightimgUrl" class="nav-indicator right" alt="">
        </div>

        <!-- 内容区域：展示所有导航项的内容 -->
        <div class="content-wrapper">
            <!-- 每个导航项的内容区块 -->
            <div v-for="(navItem, navIndex) in navItems" :key="`nav-content-${navIndex}`" 
                :id="`nav-section-${navIndex}`" class="nav-section">
                <template v-if="navItem.children && navItem.children.length > 0">
                    <component 
                        v-for="(child, idx) in navItem.children" 
                        :key="`widget-${navIndex}-${idx}`"
                        :is="getWidgetComponent(child.name)"
                        :value="child" />
                </template>
            </div>
            <!-- 空状态 -->
            <div v-if="!navItems.length" class="empty-content">
                <span>暂无内容</span>
            </div>
        </div>
    </div>
</template>

<script>
import config from './config'
import gWgts from '../index'
import { getOuterStyle } from '../../comps/style-utils'

export default {
    name: 'LocationModule',
    wgtName: '电梯',
    wgtDesc: '',
    wgtIcon: 'elevator',
    config: config,
    props: {
        value: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            activeIndex: 0,
            showLeftIndicator: false,
            showRightIndicator: true,
            widgetComponents: {}
        }
    },
    computed: {
        navItems() {
            return this.value.data || []
        },
        outerStyle() {
            return getOuterStyle(this.value)
        },
        // 整体模块样式
        moduleStyle() {
            return {
                ...this.outerStyle,
                position: this.value.navSticky ? 'sticky' : 'relative',
                top: this.value.navSticky ? '0' : 'auto',
                zIndex: this.value.navSticky ? '100' : 'auto'
            }
        },
        // 导航栏外层样式
        navWrapperStyle() {
            const outerMargin = this.value.outerMargin || {}
            const activeItem = this.navItems[this.activeIndex]
            
            // 从 outerMargin 读取背景和内边距（CompStyle 组件的数据结构）
            const bgType = outerMargin.bgType
            let backgroundColor = ''
            let backgroundImage = 'none'
            
            // 根据 bgType 处理背景
            if (bgType === 'gradient') {
                backgroundImage = `linear-gradient(to bottom, ${outerMargin.startColor || ''}, ${outerMargin.endColor || ''})`
            } else if (bgType === 'pic') {
                backgroundImage = outerMargin.bgPic ? `url(${outerMargin.bgPic})` : 'none'
                backgroundColor = ''
            } else if (bgType === 'color' || !bgType) {
                backgroundColor = outerMargin.bgColor || '#ffffff'
            }
            
            // 根据当前选中项的配置决定背景（优先级更高）
            if (activeItem) {
                if (activeItem.navactivebgimg) {
                    backgroundImage = `url(${activeItem.navactivebgimg})`
                    backgroundColor = ''
                } else if (activeItem.navactivebg) {
                    backgroundColor = activeItem.navactivebg
                    backgroundImage = 'none'
                }
            }
            
            return {
                paddingTop: `${outerMargin.paddedt || 0}px`,
                paddingBottom: `${outerMargin.paddedb || 0}px`,
                paddingLeft: `${outerMargin.paddedl || 0}px`,
                paddingRight: `${outerMargin.paddedr || 0}px`,
                backgroundColor: backgroundColor || undefined,
                backgroundImage: backgroundImage !== 'none' ? backgroundImage : undefined,
                backgroundSize: backgroundImage !== 'none' ? 'cover' : undefined,
                backgroundPosition: backgroundImage !== 'none' ? 'center' : undefined,
                backgroundRepeat: backgroundImage !== 'none' ? 'no-repeat' : undefined,
            }
        },
        // 导航项区域样式
        navItemAreaStyle() {
            const navitemarea = this.value.navitemarea || {}
            
            // 从 navitemarea 读取背景和内边距（CompStyle 组件的数据结构）
            const bgType = navitemarea.bgType
            let backgroundColor = ''
            let backgroundImage = 'none'
            
            // 根据 bgType 处理背景
            if (bgType === 'gradient') {
                backgroundImage = `linear-gradient(to bottom, ${navitemarea.startColor || ''}, ${navitemarea.endColor || ''})`
            } else if (bgType === 'pic') {
                backgroundImage = navitemarea.bgPic ? `url(${navitemarea.bgPic})` : 'none'
                backgroundColor = ''
            } else if (bgType === 'color' || !bgType) {
                backgroundColor = navitemarea.bgColor || 'transparent'
            }
            
            return {
                paddingTop: `${navitemarea.paddedt || 0}px`,
                paddingBottom: `${navitemarea.paddedb || 0}px`,
                paddingLeft: `${navitemarea.paddedl || 0}px`,
                paddingRight: `${navitemarea.paddedr || 0}px`,
                backgroundColor: backgroundColor || undefined,
                backgroundImage: backgroundImage !== 'none' ? backgroundImage : undefined,
                backgroundSize: backgroundImage !== 'none' ? 'cover' : undefined,
                backgroundPosition: backgroundImage !== 'none' ? 'center' : undefined,
                backgroundRepeat: backgroundImage !== 'none' ? 'no-repeat' : undefined,
                borderRadius: `${this.value.navitemradius || 0}px`
            }
        },
        // 导航列表样式
        navListStyle() {
            return {
                height: `${this.value.navitemheight || 40}px`
            }
        }
    },
    created() {
        // 在创建时立即加载挂件组件，确保内容可以显示
        this.loadWidgetComponents()
    },
    mounted() {
        this.$nextTick(() => {
            this.checkScrollIndicators()
            // 找到默认激活的导航项，如果没有则使用第一个
            const activeIdx = this.navItems.findIndex(item => item.isActive)
            if (activeIdx > -1) {
                this.activeIndex = activeIdx
            } else if (this.navItems.length > 0) {
                // 如果没有标记为激活的项，默认显示第一项
                this.activeIndex = 0
            }
        })
    },
    methods: {
        // 加载所有挂件组件
        loadWidgetComponents() {
            const scene = this.$route?.query?.scene || '1001'
            const wgts = gWgts[scene] || gWgts['1001'] || {}
            Object.keys(wgts).forEach(key => {
                const wgt = wgts[key]
                if (wgt && wgt.name) {
                    this.widgetComponents[wgt.name.toLowerCase()] = wgt
                }
            })
        },
        // 获取挂件组件
        getWidgetComponent(name) {
            if (!name) return null
            const wgt = this.widgetComponents[name.toLowerCase()]
            return wgt || null
        },
        // 获取单个导航项样式
        getNavItemStyle(item, index) {
            const isActive = this.activeIndex === index
            const navitemmargin = this.value.navitemmargin || {}
            return {
                height: `${this.value.navitemheight || 40}px`,
                paddingLeft: `${navitemmargin}px`,
                paddingRight: `${navitemmargin}px`,
                color: isActive ? (item.navitemactivecolor || '#1A1A1A') : (item.navitemcolor || '#666666'),
                backgroundColor: isActive ? (item.navitemactivebg || 'transparent') : (item.navitembg || 'transparent'),
                borderRadius: `${item.navitemradius || 0}px`
            }
        },
        // 点击导航项，滚动到对应区块
        handleNavClick(index) {
            this.activeIndex = index
            this.$nextTick(() => {
                const section = document.getElementById(`nav-section-${index}`)
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
            })
        },
        // 监听滚动
        handleScroll() {
            this.checkScrollIndicators()
        },
        // 检查滚动指示器显示状态
        checkScrollIndicators() {
            const scroller = this.$refs.navScroller
            if (!scroller) return
            
            const { scrollLeft, scrollWidth, clientWidth } = scroller
            this.showLeftIndicator = scrollLeft > 0
            this.showRightIndicator = scrollLeft + clientWidth < scrollWidth - 1
        }
    }
}
</script>

<style lang="scss" scoped>
.wgt-location-module {
    width: 100%;

    .nav-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    .nav-indicator {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 24px;
        height: 24px;
        object-fit: contain;
        z-index: 2;
        pointer-events: none;

        &.left {
            left: 4px;
        }

        &.right {
            right: 4px;
        }
    }

    .nav-scroller {
        flex: 1;
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: none;
        -ms-overflow-style: none;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .nav-list {
        display: flex;
        align-items: center;
        white-space: nowrap;
    }

    .nav-item {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        flex-shrink: 0;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;

        &.is-active {
            font-weight: 500;
        }

        .nav-item-img {
            max-height: 100%;
            object-fit: contain;
        }

        .nav-item-text {
            white-space: nowrap;
        }

        .nav-item-border {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            display: block;
            width: 20px;
            height: 2px;
            border-radius: 1px;
        }
    }

    .content-wrapper {
        width: 100%;
        min-height: 100px;
    }

    .nav-section {
        width: 100%;
    }

    .empty-content {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        color: #c0c4cc;
        font-size: 14px;
        background: #fafafa;
    }
}
</style>
