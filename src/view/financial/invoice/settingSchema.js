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
        label: vm.$t('fad40c6c.764f07')
      },
      {
        label: vm.$t('fad40c6c.352b0b'),
        key: 'invoice_method',
        type: 'radio',
        defaultValue: 'offline',
        options: [
          { name: vm.$t('fad40c6c.6be6e5'), label: 'offline' },
          { name: vm.$t('fad40c6c.1f931c'), label: 'online' }
        ]
      },
      {
        label: vm.$t('fad40c6c.6d568f'),
        key: 'invoice_seller_type',
        type: 'radio',
        defaultValue: '1',
        options: [{ name: vm.$t('fad40c6c.498128'), label: '1' }]
      },
      {
        label: vm.$t('fad40c6c.4f0df7'),
        key: 'apply_type',
        type: 'radio',
        defaultValue: '1',
        options: [
          { name: vm.$t('fad40c6c.4fffa8'), label: '1' },
          { name: vm.$t('fad40c6c.8501fa'), label: '2' }
        ]
      },
      {
        label: vm.$t('fad40c6c.c2058f'),
        key: 'freight_invoice',
        type: 'radio',
        defaultValue: '2',
        options: [
          { name: vm.$t('fad40c6c.d93212'), label: '2' },
          { name: vm.$t('fad40c6c.b479c1'), label: '1' }
        ]
      },
      {
        label: vm.$t('fad40c6c.0bca8f'),
        key: 'freight_name',
        type: 'input',
        tip: vm.$t('fad40c6c.28168e')
      },
      {
        label: vm.$t('fad40c6c.1a29c6'),
        key: 'freight_tax_rate',
        type: 'input',
        component({ key }, value) {
          return (
            <el-input
              clearable
              type='number'
              placeholder={vm.$t('fad40c6c.a11cc7')}
              v-model={value[key]}
              min='0'
            >
              <template slot='append'>%</template>
            </el-input>
          )
        }
      },
      {
        label: vm.$t('fad40c6c.0199a1'),
        key: 'invoice_limit',
        type: 'radio',
        defaultValue: 'order',
        options: [{ name: vm.$t('fad40c6c.1dece7'), label: 'order' }]
      },
      {
        label: vm.$t('fad40c6c.cb46d8'),
        key: 'invoice_open_term',
        component({ key }, value) {
          return (
            <div>
              {vm.$t('fad40c6c.6a6e36')}&nbsp;{' '}
              <el-input v-model={value[key]} type='number' min='0' /> &nbsp;
              {vm.$t('fad40c6c.17eae8')}
            </div>
          )
        }
      },
      {
        label: vm.$t('fad40c6c.c3dbd7'),
        key: 'special_invoice',
        type: 'radio',
        defaultValue: '1',
        options: [
          { name: vm.$t('fad40c6c.995978'), label: '1' },
          { name: vm.$t('fad40c6c.32e37f'), label: '2' }
        ]
      },
      {
        label: vm.$t('fad40c6c.c73b4e'),
        key: 'apply_node',
        type: 'radio',
        defaultValue: '2',
        options: [
          { name: vm.$t('fad40c6c.d3247f'), label: '2' },
          { name: vm.$t('fad40c6c.37c61f'), label: '1' }
        ]
      },
      {
        label: vm.$t('fad40c6c.4e3867'),
        key: 'invoice_status',
        type: 'switch'
      }
    ],
    vm
  )
