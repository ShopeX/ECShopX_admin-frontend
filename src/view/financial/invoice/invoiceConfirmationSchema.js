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
        label: vm.$t('82053bba.30117a')
      },
      {
        label: vm.$t('82053bba.26d40f'),
        key: 'special_invoice_confirm_open',
        type: 'switch'
      },
      {
        label: vm.$t('82053bba.206057'),
        key: 'title',
        type: 'input',
        maxlength: 15
      },
      {
        label: vm.$t('82053bba.3c0397'),
        key: 'content',
        type: 'richText'
      }
    ],
    vm
  )
