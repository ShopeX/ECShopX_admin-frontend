import Home from '@/view/home'
import Layout from '@/view/layout'
import main from '@/view/wxapp/index'
import template from '@/view/wxapp/template'
import management from '@/view/wxapp/management'
import category from '@/view/wxapp/category'

import dataAnalysis from '@/view/wxapp/statistics/dataanalysis/index'
import dataSource from '@/view/wxapp/statistics/sourcemanagement/index'
import detail from '@/view/wxapp/statistics/sourcemanagement/monito_detail'
import authorize from '@/view/wxapp/authorize/index'

let wxapp = {
  path: '/wxapp',
  name: '小程序',
  component: Home,
  meta: '5',
  children: [
    {
      path: '/wxapp',
      name: '我的小程序',
      component: Layout,
      hidden: true,
      children: [{ path: '/wxapp', component: main, meta: '5', name: '我的小程序模板' }]
    },
    {
      path: '/wxapp/template',
      name: '选择模版',
      component: Layout,
      hidden: true,
      children: [{ path: '/wxapp/template', component: template, meta: '5', name: '选择模板' }]
    },
    {
      path: '/wxapp/template/edit',
      component: Layout,
      meta: 'member',
      name: '小程序管理',
      children: [
        {
          path: '/wxapp/template/edit/dashboard',
          iconCls: 'pie_chart_outlined',
          component: dataAnalysis,
          meta: '5',
          name: '数据分析'
        },
        {
          path: '/wxapp/template/edit/sourcemanagement',
          iconCls: 'vibration',
          component: dataSource,
          meta: '5',
          name: '千人千码'
        },
        {
          path: '/wxapp/template/edit/sourcemanagement/monito_detail',
          component: detail,
          meta: '5',
          name: '来源详情',
          hidden: true
        },
        {
          path: '/wxapp/template/edit/authorize',
          iconCls: 'fingerprint',
          component: authorize,
          meta: '5',
          name: '授权设置'
        },
        {
          path: '/wxapp/template/edit',
          iconCls: 'settings',
          component: management,
          meta: '5',
          name: '模板编辑',
          hidden: true
        },
        {
          path: '/wxapp/template/edit/category',
          iconCls: 'settings',
          component: category,
          meta: '5',
          name: '自定义分类',
          hidden: true
        }
      ]
    }
  ]
}

export default wxapp
