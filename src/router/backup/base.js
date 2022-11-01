import Home from '@/view/home'
import Layout from '@/view/layout'
import Main from '@/view/base/index'

import editshop from '@/view/base/shop/editshop'
import wxshop from '@/view/base/shop/wxshop'
import setwxshop from '@/view/base/shop/shopsetting'
import shopcomments from '@/view/base/shop/comments'

import wxaIndex from '@/view/base/wxa/index'
import wxaPromotion from '@/view/base/wxa/promotion'
import wxaMendianConf from '@/view/base/wxa/mendian'

import paymentList from '@/view/base/setting/list'
import wxpay from '@/view/base/setting/payment/wxpay'
import alipay from '@/view/base/setting/payment/alipay'

import accountActivation from '@/view/base/asset/accountactivation/index'

import unbind from '@/view/base/empty/unbind'

// 核销员列表管理
import staffleader from '@/view/base/shopstaff/salesperson/leaderlist'

import dataAnalysis from '@/view/wxapp/statistics/dataanalysis/index'
import dataSource from '@/view/wxapp/statistics/sourcemanagement/index'
import dataDetail from '@/view/wxapp/statistics/sourcemanagement/monito_detail'

//短信账户
import shorMessage from '@/view/base/shortmessage/index'

import accountManagement from '@/view/base/account/management'
import rolesManagement from '@/view/base/account/roles'

//文章管理
import articles from '@/view/base/article/index'
import articleEditor from '@/view/base/article/editor'

import CurrencyExchangeRate from '@/view/base/currency/index'

import exportLogList from '@/view/base/exportlog/index'

let base = {
  path: '/',
  //name: '基础营运',
  component: Home,
  meta: '1',
  children: [
    {
      path: '/',
      //name: '运营概况',
      component: Layout,
      iconCls: 'dashboard',
      leaf: true,
      children: [{ path: '/', component: Main, meta: '1', name: '概况' }]
    },
    {
      path: '/base/shop',
      name: '门店',
      component: Layout,
      iconCls: 'store',
      children: [
        { path: '/base/shop/wxshop/setting', component: setwxshop, meta: '1', name: '配置门店' },
        { path: '/base/shop/wxshop', component: wxshop, meta: '1', name: '微信门店' },
        {
          path: '/base/shop/wxshop/comments',
          component: shopcomments,
          meta: '1',
          name: '门店评论',
          hidden: true
        },
        {
          path: '/base/shop/editshop',
          component: editshop,
          meta: '1',
          name: '添加微信门店',
          hidden: true
        },
        {
          path: '/base/shop/editshop/:wxShopId',
          component: editshop,
          meta: '1',
          name: '编辑微信门店',
          hidden: true
        }
      ]
    },
    {
      path: '/base/staff',
      name: '账号管理',
      component: Layout,
      iconCls: 'supervisor_account',
      children: [
        { path: '/base/staff/leader', component: staffleader, meta: '1', name: '门店管理员' },
        {
          path: '/base/account/management',
          component: accountManagement,
          meta: '1',
          name: '平台管理员'
        },
        {
          path: '/base/account/roles',
          component: rolesManagement,
          meta: '1',
          name: '平台管理员角色'
        }
      ]
    },
    //{
    //  path: '/base/log',
    //  name: '日志',
    //  component: Layout,
    //  iconCls: 'settings_ethernet',
    //  children: [
    //    { path: '/base/log', component: Main, meta: '1', name: '接口日志' },
    //    { path: '/base/log/operation', component: Main, meta: '1', name: '操作日志' }
    //  ]
    //},
    {
      path: '/base/article',
      //name: '文章管理',
      component: Layout,
      iconCls: 'burst_mode',
      leaf: true,
      children: [
        { path: '/base/article', component: articles, meta: '1', name: '文章管理' },
        {
          path: '/base/article/editor',
          component: articleEditor,
          meta: '1',
          name: '添加文章',
          hidden: true
        },
        {
          path: '/base/article/editor/:wxShopId',
          component: articleEditor,
          meta: '1',
          name: '编辑文章',
          hidden: true
        }
      ]
    },
    {
      path: '/base/asset',
      name: '我的账户',
      component: Layout,
      iconCls: 'account_box',
      children: [
        //{ path: '/base/asset', component: Main, meta: '1', name: '公司信息' },
        {
          path: '/base/asset/accountactivation',
          component: accountActivation,
          meta: '1',
          name: '门店订购'
        },
        { path: '/base/asset/payment/list', component: paymentList, meta: '1', name: '支付账户' },
        {
          path: '/base/asset/payment/wxpay',
          component: wxpay,
          meta: '1',
          name: '微信支付',
          hidden: true
        },
        {
          path: '/base/asset/payment/alipay',
          component: alipay,
          meta: '1',
          name: '支付宝支付',
          hidden: true
        },
        { path: '/base/data/message', component: shorMessage, meta: '1', name: '短信账户' }
      ]
    },
    //{
    //  path: '/base/wxa',
    //  name: '小程序',
    //  component: Layout,
    //  iconCls: 'settings_ethernet',
    //  leaf: true,
    //  children: [
    //    { path: '/base/wxa', component: wxaIndex, meta: '1', name: '小程序管理' }
    //  ]
    //},
    {
      path: '/base/empty',
      name: '空数据',
      component: Layout,
      hidden: true,
      children: [
        { path: '/base/unbind', component: unbind, meta: '1', name: '未绑定', hidden: false }
      ]
    },
    {
      path: '/base/currency',
      name: '货币管理',
      iconCls: 'account_box',
      component: Layout,
      children: [
        { path: '/base/currency', component: CurrencyExchangeRate, meta: '1', name: '货币列表' }
      ]
    },
    {
      path: '/base/export',
      name: '下载导出管理',
      iconCls: '',
      component: Layout,
      children: [
        { path: '/base/export', component: exportLogList, meta: '1', name: '导出日志列表' }
      ]
    }
  ]
}

export default base
