import { BasicLayout } from '@/layout/basic'
import SubLayout from '@/view/sublayout'

const routes = [
    {
        component: BasicLayout,
        meta: {
            aliasName: 'site',
            icon: 'shopping-bag',
            keepAlive: true,
            title: '装修'
        },
        name: 'site',
        path: '/site',
        children: [
            {
                name: 'list',
                path: 'soft-article/list',
                meta: {
                    aliasName: 'planting',
                    icon: 'pay-circle',
                    title: '软文列表',
                    permissions: ['site.article.planting']
                },
                component: () => import('@/view/content/soft-article'),
                children: [
                    {
                        path: 'editor/:itemId?',
                        name: '软文-编辑',
                        component: () => import('@/view/content/soft-article-id')
                    }
                ]
            }, {
                name: 'channel',
                path: 'soft-article/channel',
                meta: {
                    aliasName: 'articlecolumns',
                    icon: 'pay-circle',
                    title: '软文频道',
                    permissions: ['site.article.articlecolumns']
                },
                component: () => import('@/view/base/article/columns')
            }, {
                name: 'management',
                path: 'material/management',
                meta: {
                    aliasName: 'brandmaterial',
                    icon: 'pay-circle',
                    title: '素材管理',
                    permissions: ['site.material.brandmaterial']
                },
                component: () => import('@/view/brand/wechat/aterialmanagement'),
                children: [
                    {
                        path: 'editor/:id?',
                        component: () => import('@/view/brand/wechat/artical/new_artical')
                    }
                ]
            }, {
                name: 'list',
                path: 'article/list',
                meta: {
                    aliasName: 'basearticle',
                    icon: 'pay-circle',
                    title: '文章列表',
                    permissions: ['site.text.basearticle']
                },
                component: () => import('@/view/base/article/index'),
                children: [
                    {
                        path: 'editor',
                        name: '软文-编辑',
                        component: () => import('@/view/base/article/editor')
                    }
                ]
            }, {
                name: 'category',
                path: 'article/category',
                meta: {
                    aliasName: 'Articlegeneralcolumns',
                    icon: 'pay-circle',
                    title: '文章分类',
                    permissions: ['site.text.Articlegeneralcolumns']
                },
                component: () => import('@/view/base/article/generalcolumns')
            }, {
                name: 'management',
                path: 'note/management',
                meta: {
                    aliasName: 'ugcindex',
                    icon: 'pay-circle',
                    title: '笔记管理',
                    permissions: ['site.ugc.ugcindex']
                },
                component: () => import('@/view/member/ugc/ugcIndex'),
                children: [
                    {
                        path: 'editor',
                        component: () => import('@/view/member/ugc/ugcNotesEditor')
                    }
                ]
            }, {
                name: 'management',
                path: 'corner/management',
                meta: {
                    aliasName: 'ugcflags',
                    icon: 'pay-circle',
                    title: '角标管理',
                    permissions: ['site.ugc.ugcflags']
                },
                component: () => import('@/view/member/ugc/ugcFlags')
            },  {
                name: 'topic',
                path: 'note/topic',
                meta: {
                    aliasName: 'ugctopic',
                    icon: 'pay-circle',
                    title: '笔记话题',
                    permissions: ['site.ugc.ugctopic']
                },
                component: () => import('@/view/member/ugc/ugcTopic')
            }, {
                name: 'comments',
                path: 'notes/comments',
                meta: {
                    aliasName: 'ugcreview',
                    icon: 'pay-circle',
                    title: '笔记评论',
                    permissions: ['site.ugc.ugcreview']
                },
                component: () => import('@/view/member/ugc/ugcReview')
            }, {
                name: 'settings',
                path: 'comment/settings',
                meta: {
                    aliasName: 'ugcpoint',
                    icon: 'pay-circle',
                    title: '评论设置',
                    permissions: ['site.ugc.ugcpoint']
                },
                component: () => import('@/view/member/ugc/ugcPoint')
            }, {
                name: 'settings',
                path: 'sharing/settings',
                meta: {
                    aliasName: 'sharesetting',
                    icon: 'pay-circle',
                    title: '分享设置',
                    permissions: ['site.share.sharesetting']
                },
                component: () => import('@/view/base/setting/sharesetting')
            },{
                name: 'evaluate',
                path: 'goods/evaluate',
                meta: {
                    aliasName: 'rate',
                    icon: 'pay-circle',
                    title: '商品评价',
                    permissions: ['site.evaluate.rate']
                },
                component: () => import('@/view/goods/rate')
            },
        ]
    }
]

export default routes