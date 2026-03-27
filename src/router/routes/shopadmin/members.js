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
      title: '844e05b4.4d9dd5'
    },
    name: 'shopadminMember',
    path: '/shopadmin/member',
    children: [
      {
        name: 'memberList',
        path: 'member-manage/member-list',
        component: () => import('@/views/members/member_list'),
        meta: {
          aliasName: 'members-lists',
          icon: 'icon-member',
          title: '844e05b4.5386bb',
          permissions: ['member.member-list-view.members-lists']
        },
        children: [
          {
            path: 'detail/:user_id?',
            component: () => import('@/view/member/members/detail'),
            meta: {
              title: '844e05b4.9fee8f',
              hidden: true
            }
          },
          {
            path: 'chiefupload',
            component: () => import('@/view/member/members/upload_chief'),
            meta: {
              title: '844e05b4.bc15f6',
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
          title: '844e05b4.3cc026',
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
          title: '844e05b4.b33603',
          permissions: ['shopadmin.member.purchase.employee']
        },
        children: [
          {
            path: 'import',
            component: () => import('@/view/member/purchase/employeeImport'),
            meta: {
              title: '844e05b4.eba44e',
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
          title: '844e05b4.07c516',
          permissions: ['shopadmin.member.purchase.company']
        }
      }
    ]
  }
]

export default routes
