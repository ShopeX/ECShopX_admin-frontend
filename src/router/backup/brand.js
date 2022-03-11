import Home from '@/view/home'
import Layout from '@/view/layout'

/** 微信公众号 **/
import open from '@/view/brand/wechat/open'
import customservice from '@/view/brand/wechat/customservice'
import customMenu from '@/view/brand/wechat/custommenu'
import ReplyMsg from '@/view/brand/wechat/reply'
import fans from '@/view/brand/wechat/fans'
import AterialManagement from '@/view/brand/wechat/aterialmanagement'
import articalLayout from '@/view/brand/wechat/artical/index'
import newArtical from '@/view/brand/wechat/artical/new_artical'
import NewList from '@/view/brand/wechat/artical/list'

/** 一物一码 **/
import thingsList from '@/view/brand/codegoods/thingslist'
import thingsEdit from '@/view/brand/codegoods/thingsedit'
import batchsEdit from '@/view/brand/codegoods/batchsedit'
import thingsBatchsDetail from '@/view/brand/codegoods/thingsbatchsdetail'

export default {
  path: '/brand',
  name: '品牌宣传',
  component: Home,
  meta: '2',
  children: [
    {
      path: '/brand',
      name: '微信公众号',
      component: Layout,
      iconCls: 'sms',
      children: [
        { path: '/brand', component: open, meta: '2', name: '公众号授权' },
        { path: '/brand/fans', component: fans, meta: '2', name: '粉丝管理' },
        { path: '/brand/menu', component: customMenu, meta: '2', name: '自定义菜单' },
        { path: '/brand/reply', component: ReplyMsg, meta: '2', name: '消息回复' },
        { path: '/brand/customer', component: customservice, meta: '2', name: '客服管理' },
        { path: '/brand/material', component: AterialManagement, meta: '2', name: '素材管理' },
        {
          path: '/brand/material/artical',
          component: newArtical,
          meta: '1',
          name: '新增图文消息',
          hidden: true
        },
        {
          path: '/brand/material/artical:media_id',
          component: newArtical,
          meta: '1',
          name: '编辑图文消息',
          hidden: true
        }
      ]
    },
    {
      path: '/brand/onecode',
      name: '一物一码',
      component: Layout,
      iconCls: 'apps',
      children: [
        { path: '/brand/onecode', component: thingsList, meta: '2', name: '商品码管理' },
        {
          path: '/brand/onecode/things',
          component: thingsEdit,
          meta: '2',
          name: '新建物品',
          hidden: true
        },
        {
          path: '/brand/onecode/things/:thing_id',
          component: thingsEdit,
          meta: '2',
          name: '编辑物品',
          hidden: true
        },
        {
          path: '/brand/onecode/batchs',
          component: batchsEdit,
          meta: '2',
          name: '批次管理',
          hidden: true
        },
        {
          path: '/brand/onecode/batchs/:id',
          component: batchsEdit,
          meta: '2',
          name: '编辑管理',
          hidden: true
        },
        {
          path: '/brand/onecode/thingsbatchsdetail',
          component: thingsBatchsDetail,
          meta: '2',
          name: '物品批次详情',
          hidden: true
        },
        {
          path: '/brand/onecode/thingsbatchsdetail/:id',
          component: thingsBatchsDetail,
          meta: '2',
          name: '物品批次详情-1',
          hidden: true
        }
        // { path: '/brand/onecodepage', component: Main, meta: '2', name: '商品码页面' }
      ]
    }
    //{
    //  path: '/brand/surveillance',
    //  name: '全渠道舆情监控',
    //  component: Layout,
    //  iconCls: 'record_voice_over',
    //  leaf: true,
    //  children: [
    //    { path: '/brand/surveillance', component: Main, meta: '2', name: '全渠道舆情监控' }
    //  ]
    //}
  ]
}
