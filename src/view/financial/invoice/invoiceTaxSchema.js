/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { createSetting } from '@shopex-ui/finder'
import moment from 'moment'
import { debounce } from 'lodash-es'
import { bindThisForFormSchema } from '@/utils/schemaHelper'

export const tableSchema = (vm) =>
  createSetting({
    actions: [
      {
        name: vm.$t('7350de2d.95b351'),
        key: 'edit',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row]) => {
              vm.editRowHandle(row)
            },
            2000,
            {
              leading: true
            }
          )
        }
      },
      {
        name: vm.$t('7350de2d.2f4aad'),
        key: 'delete',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row]) => {
              vm.deleteRowHandle(row)
            },
            2000,
            {
              leading: true
            }
          )
        }
      }
    ],
    columns: [
      {
        name: vm.$t('7350de2d.29b041'),
        key: 'seller_company_name',
        width: '160',
        render(h, { row }) {
          return <span> {row.sales_party_info?.seller_company_name} </span>
        }
      },
      {
        name: vm.$t('7350de2d.ca2be5'),
        key: 'seller_tax_no',
        width: '160',
        render(h, { row }) {
          return <span> {row.sales_party_info?.seller_tax_no} </span>
        }
      },
      {
        name: vm.$t('7350de2d.eff7dc'),
        key: 'seller_phone',
        width: '160',
        render(h, { row }) {
          return <span> {row.sales_party_info?.seller_phone} </span>
        }
      },
      // {
      //   name: '开票渠道',
      //   key: 'seller_name',
      //   width: '120'
      // },
      {
        name: vm.$t('7350de2d.b3ed9f'),
        key: 'invoice_apply_bn',
        width: '300',
        render(h, { row }) {
          if (row.tax_rate_type == 'ALL') {
            return vm.$t('7350de2d.1a7503')
          }
          const categoryNames =
            (row.category_ids &&
              vm.getCategoryPathsName(vm.itemCategoryList, JSON.parse(row.category_ids))) ||
            []
          return (
            <div>
              {categoryNames.map((item) => (
                <div>{item}</div>
              ))}
            </div>
          )
        }
      },
      {
        name: vm.$t('7350de2d.2a79a7'),
        key: 'invoice_tax_rate',
        width: '80',
        render(h, { row }) {
          return <span> {row.invoice_tax_rate} % </span>
        }
      },
      {
        name: vm.$t('7350de2d.68346c'),
        key: 'seller_name',
        width: '120',
        render(h, { row }) {
          return <span> {row.sales_party_info?.seller_name} </span>
        }
      },
      {
        name: vm.$t('7350de2d.ba2c38'),
        key: 'payee',
        width: '120',
        render(h, { row }) {
          return <span> {row.sales_party_info?.payee} </span>
        }
      },
      {
        name: vm.$t('7350de2d.24045b'),
        key: 'reviewer',
        width: '120',
        render(h, { row }) {
          return <span> {row.sales_party_info?.reviewer} </span>
        }
      },
      {
        name: vm.$t('7350de2d.210c86'),
        key: 'seller_address',
        width: '160',
        render(h, { row }) {
          return <span> {row.sales_party_info?.seller_address} </span>
        }
      },
      {
        name: vm.$t('7350de2d.ffc7ed'),
        key: 'created',
        width: '160',
        render(h, { row }) {
          return <span> {moment(row.created_at * 1000).format('yyyy-MM-DD HH:mm:ss')} </span>
        }
      }
    ]
  })

export const formSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        label: vm.$t('7350de2d.29b041'),
        key: 'sales_party_id',
        type: 'select',
        tip: vm.$t('7350de2d.ce7c10'),
        options: vm.invoiceSellerList,
        required: true
      },
      {
        label: vm.$t('7350de2d.2fc8ee'),
        key: 'tax_rate_type',
        validator: (rule, value, callback) => {
          if (value == 'SPECIFIED' && !vm.dialogForm.category_ids?.length) {
            callback(new Error(vm.$t('7350de2d.4dbf37')))
          } else {
            callback()
          }
        },
        defaultValue: 'ALL',
        component({ key }, value) {
          return (
            <div>
              <el-radio-group
                v-model={value['tax_rate_type']}
                onChange={() => {
                  value['category_ids'] = ''
                }}
              >
                <el-radio label='ALL'>{vm.$t('7350de2d.1a7503')}</el-radio>
                <el-radio label='SPECIFIED'>{vm.$t('7350de2d.9f7160')}</el-radio>
              </el-radio-group>
              <div>
                {value['tax_rate_type'] == 'SPECIFIED' && (
                  <el-cascader
                    v-model={value['category_ids']}
                    placeholder={vm.$t('7350de2d.708c9d')}
                    clearable
                    class='invoice-cascader'
                    options={vm.itemCategoryList}
                    props={{
                      props: {
                        value: 'category_id',
                        label: 'category_name',
                        multiple: true,
                        // checkStrictly: true,
                        children: 'children'
                      }
                    }}
                  />
                  // <el-tree
                  //   data={vm.itemCategoryList}
                  //   show-checkbox
                  //   default-expand-all
                  //   node-key="category_id"
                  //   ref="tree"
                  //   highlight-current
                  //   props={{
                  //     props: {
                  //       value: 'category_id',
                  //       label: 'category_name',
                  //       multiple: true,
                  //       // checkStrictly: true,
                  //       children: 'children'
                  //     }
                  //   }}
                  //   onCheck={vm.handleTreeCheck}>
                  // </el-tree>
                )}
              </div>
            </div>
          )
        }
      },
      {
        label: vm.$t('7350de2d.a731f8'),
        key: 'invoice_tax_rate',
        type: 'input',
        required: true,
        component({ key }, value) {
          return (
            <div>
              <el-input v-model={value[key]} type='number' min={0}>
                <template slot='append'>%</template>
              </el-input>
            </div>
          )
        }
      }
    ],
    vm
  )
