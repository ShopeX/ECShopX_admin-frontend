import { BasicLayout } from '@/layout/basic'
import SubLayout from '@/view/sublayout'

const routes = [
    {
        component: BasicLayout,
        meta: {
            aliasName: 'wxapp-template',
            icon: 'shopping-bag',
            keepAlive: true,
            title: '装修'
        },
        name: 'wxapp-template',
        path: '/wxapp-template',
        children:[
            {
                name: 'homepage',
                path: 'homepage',
                meta: {
                    aliasName: 'wxapp-template-edit',
                    icon: 'pay-circle',
                    title: '首页',
                    permissions: ['wxapp-template.wxappmanage.wxapp-template-edit']
                },
                component: () => import('@/view/wxapp/home')
            },{
                name: 'store',
                path: 'nearby/store',
                meta: {
                    aliasName: 'classificationTemplate',
                    icon: 'pay-circle',
                    title: '附近店铺页',
                    permissions: ['wxapp-template.wxappmanage.classificationTemplate']
                },
                component: () => import('@/view/wxapp/classificationTemplate')
            },{
                name: 'category',
                path: 'category',
                meta: {
                    aliasName: 'wxapp-editcategory',
                    icon: 'pay-circle',
                    title: '分类页',
                    permissions: ['wxapp-template.wxappmanage.wxapp-editcategory']
                },
                component: () => import('@/view/wxapp/category/categorize')
            },{
                name: 'customize',
                path: 'customize',
                meta: {
                    aliasName: 'wxapp-custompage',
                    icon: 'pay-circle',
                    title: '自定义页',
                    permissions: ['wxapp-template.wxappmanage.wxapp-custompage']
                },
                component: () => import('@/view/wxapp/customPage')
            },{
                name: 'color-scheme',
                path: 'mall/color-scheme',
                meta: {
                    aliasName: 'colorstyle',
                    icon: 'pay-circle',
                    title: '商城配色',
                    permissions: ['wxapp-template.wxappmanage.colorstyle']
                },
                component: () => import('@/view/wxapp/theme/colorStyle')
            },{
                name: 'center',
                path: 'member/center',
                meta: {
                    aliasName: 'membercentersetting',
                    icon: 'pay-circle',
                    title: '会员中心',
                    permissions: ['wxapp-template.wxappmanage.membercentersetting']
                },
                component: () => import('@/view/wxapp/memberCenter')
            },{
                name: 'information',
                path: 'mall/information',
                meta: {
                    aliasName: 'wxshopsetting',
                    icon: 'pay-circle',
                    title: '商城信息',
                    permissions: ['wxapp-template.wxappmanage.wxshopsetting']
                },
                component: () => import('@/view/wxapp/shopInfo')
            },{
                name: 'advertisement',
                path: 'screen/advertisement',
                meta: {
                    aliasName: 'openscreenad',
                    icon: 'pay-circle',
                    title: '开屏广告',
                    permissions: ['wxapp-template.wxappmanage.openscreenad']
                },
                component: () => import('@/view/base/screen/openScreenAD')
            },{
                name: 'list',
                path: 'template/list',
                meta: {
                    aliasName: 'templatelist',
                    icon: 'pay-circle',
                    title: '模板列表',
                    permissions: ['wxapp-template.pcmall.templatelist']
                },
                component: () => import('@/view/pc/pctemplate')
            },{
                name: 'editing',
                path: 'template/editing',
                meta: {
                    aliasName: 'design',
                    icon: 'pay-circle',
                    title: '模板编辑',
                    permissions: ['wxapp-template.pcmall.design']
                },
                component: () => import('@/view/pc/pctemplate')
            },{
                name: 'page',
                path: 'login/page',
                meta: {
                    aliasName: 'loginPageSetting',
                    icon: 'pay-circle',
                    title: '登录页',
                    permissions: ['wxapp-template.pcmall.loginPageSetting']
                },
                component: () => import('@/view/pc/pctemplate/login')
            },{
                name: 'configuration',
                path: 'seo/configuration',
                meta: {
                    aliasName: 'seo',
                    icon: 'pay-circle',
                    title: 'SEO配置',
                    permissions: ['wxapp-template.pcmall.seo']
                },
                component: () => import('@/view/pc/tdk/globalset')
            },{
                name: 'seo',
                path: 'page/seo',
                meta: {
                    aliasName: 'pageseo',
                    icon: 'pay-circle',
                    title: '页面SEO',
                    permissions: ['wxapp-template.pcmall.pageseo']
                },
                component: () => import('@/view/pc/tdk/givenset')
            },
        ]
    }
]

export default routes