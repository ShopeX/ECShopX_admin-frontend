/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { bindThisForFormSchema } from '@/utils/schemaHelper'

export const formSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        type: 'group',
        label: vm.$t('36cbea09.74246c')
      },
      {
        label: vm.$t('36cbea09.819767'),
        key: 'username',
        type: 'input',
        required: true
      },
      {
        label: vm.$t('36cbea09.a81052'),
        key: 'password',
        type: 'input',
        required: true
      },
      {
        label: vm.$t('36cbea09.368480'),
        key: 'appKey',
        type: 'input',
        required: true
      },
      {
        label: vm.$t('36cbea09.bf74fe'),
        key: 'appSecret',
        type: 'input',
        required: true
      },
      {
        label: vm.$t('36cbea09.de07d8'),
        key: 'orgAuthCode',
        type: 'input',
        required: true
      },
      {
        label: vm.$t('36cbea09.c7f1e4'),
        key: 'taxNo',
        type: 'input',
        required: true
      }
    ],
    vm
  )
