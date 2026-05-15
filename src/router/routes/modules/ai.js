/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic'

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'ai',
      icon: 'brain',
      keepAlive: true,
      title: 'Ai'
    },
    name: 'ai',
    path: '/ai',
    children: [
      {
        name: 'aiTranslateTasks',
        path: 'ai-translate/translate-tasks',
        meta: {
          aliasName: 'ai-translate-tasks',
          title: '9d1e03c7.c62103',
          icon: 'ordered-list',
          permissions: ['ai.ai-translate.translate-tasks']
        },
        component: () => import('@/views/ai/translate-tasks')
      },
      {
        name: 'aiTranslateSetting',
        path: 'ai-translate/translate-setting',
        meta: {
          aliasName: 'ai-translate-setting',
          title: '9d1e03c7.851905',
          icon: 'setting',
          permissions: ['ai.ai-translate.translate-setting']
        },
        component: () => import('@/views/settings/ai-translate-setting')
      },
      {
        name: 'aiMaterialStudio',
        path: 'ai-resource/material-studio',
        meta: {
          aliasName: 'ai-material-studio',
          title: 'AI素材制作',
          icon: 'picture',
          permissions: ['ai.ai-resource.material-studio']
        },
        component: () => import('@/views/ai/material/material-studio')
      },
      {
        name: 'aiMaterialLibrary',
        path: 'ai-resource/material-library',
        meta: {
          aliasName: 'ai-material-library',
          title: 'AI素材库',
          icon: 'folder-open',
          permissions: ['ai.ai-resource.material-library']
        },
        component: () => import('@/views/ai/material/material-library')
      },
      {
        name: 'shopexAgentCenter',
        path: 'shopex-agent-center',
        meta: {
          aliasName: 'shopex-agent-center', // aliasName 必须是 path 中把斜杠替换为破折号
          title: '商派智能体平台',
          icon: 'appstore',
          permissions: ['ai.shopex-agent-center']
        },
        component: () => import('@/views/ai/shopex-agent-center')
      }
    ]
  }
]

export default routes
