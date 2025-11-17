/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'member',
      icon: 'light-member',
      keepAlive: true,
      title: '会员'
    },
    name: 'shopadminMember',
    path: '/shopadmin/member',
    children: [
      {
        name: 'memberList',
        path: 'member-manage/member-list',
        component: () => import('@/view/member/members/list'),
        meta: {
          aliasName: 'members-lists',
          icon: 'icon-member',
          title: '会员列表',
          permissions: ['member.member-list-view.members-lists']
        },
        children: [
          {
            path: 'detail/:user_id?',
            component: () => import('@/view/member/members/detail'),
            meta: {
              title: '会员详情',
              hidden: true
            }
          },
          {
            path: 'chiefupload',
            component: () => import('@/view/member/members/upload_chief'),
            meta: {
              title: '会员导入',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'manageTag',
        path: 'Managetag',
        component: () => import('@/view/member/members/tags'),
        meta: {
          aliasName: 'managetag',
          icon: 'icon-tag',
          title: '会员标签',
          permissions: ['member.Managetag']
        }
      },
      {
        name: 'purchaseEmployee',
        path: 'purchase/employee',
        component: () => import('@/view/member/purchase/employee'),
        meta: {
          aliasName: 'purchaseemployee',
          icon: 'icon-employee',
          title: '员工管理',
          permissions: ['shopadmin.member.purchase.employee']
        },
        children: [
          {
            path: 'import',
            component: () => import('@/view/member/purchase/employeeImport'),
            meta: {
              title: '白名单导入',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'purchaseCompany',
        path: 'purchase/company',
        component: () => import('@/view/member/purchase/company'),
        meta: {
          aliasName: 'purchasecompany',
          icon: 'icon-company',
          title: '企业管理',
          permissions: ['shopadmin.member.purchase.company']
        }
      }
    ]
  }
]

export default routes
