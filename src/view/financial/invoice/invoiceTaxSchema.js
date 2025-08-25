import { createSetting } from '@shopex/finder'
import moment from 'moment'
import { debounce } from 'lodash-es'
import { bindThisForFormSchema } from '@/utils/schemaHelper'

export const tableSchema = (vm) =>
  createSetting({
    actions: [
      {
        name: '编辑',
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
        name: '删除',
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
        name: '开票方名称',
        key: 'seller_company_name',
        width: '160',
        render(h, { row }) {
          return <span> {row.sales_party_info?.seller_company_name} </span>
        }
      },
      {
        name: '开票方税号',
        key: 'seller_tax_no',
        width: '160',
        render(h, { row }) {
          return <span> {row.sales_party_info?.seller_tax_no} </span>
        }
      },
      {
        name: '开票方电话',
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
        name: '管理分类',
        key: 'invoice_apply_bn',
        width: '300',
        render(h, { row }) {
          if(row.tax_rate_type == 'ALL'){
            return '全部分类'
          }
          const categoryNames = (row.category_ids && vm.getCategoryPathsName(vm.itemCategoryList,JSON.parse(row.category_ids))) || []
          return <div>
            {
              categoryNames.map(item=>(
                <div>{item}</div>
              ))
            }
          </div>
        }
      },
      {
        name: '税率',
        key: 'invoice_tax_rate',
        width: '80',
        render(h, { row }) {
          return <span> {row.invoice_tax_rate} % </span>
        }
      },
      {
        name: '开票人',
        key: 'seller_name',
        width: '120',
        render(h, { row }) {
          return <span> {row.sales_party_info?.seller_name} </span>
        }
      },
      {
        name: '收款人',
        key: 'payee',
        width: '120',
        render(h, { row }) {
          return <span> {row.sales_party_info?.payee} </span>
        }
      },
      {
        name: '复核人',
        key: 'reviewer',
        width: '120',
        render(h, { row }) {
          return <span> {row.sales_party_info?.reviewer} </span>
        }
      },
      {
        name: '开票方地址',
        key: 'seller_address',
        width: '160',
        render(h, { row }) {
          return <span> {row.sales_party_info?.seller_address} </span>
        }
      },
      {
        name: '添加时间',
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
        label: '开票方名称',
        key: 'sales_party_id',
        type: 'select',
        tip:'下拉选择配置销方开票信息',
        options:vm.invoiceSellerList,
        required: true
      },
      {
        label: '配置税率分类',
        key: 'tax_rate_type',
        validator: (rule, value, callback) => {
          console.log(123,value,vm.dialogForm)
          if(value == 'SPECIFIED' &&  !vm.dialogForm.category_ids?.length){
            callback(new Error('指定分类不能为空'))
          }else{
            callback()
          }
        },
        defaultValue: 'ALL',
        component({ key }, value) {
          return (
            <div>
              <el-radio-group v-model={value['tax_rate_type']} onChange={()=>{
                value['category_ids'] = ''
              }}>
                <el-radio label='ALL'>全部分类</el-radio>
                <el-radio label='SPECIFIED'>指定分类</el-radio>
              </el-radio-group>
              <div>
                {value['tax_rate_type'] == 'SPECIFIED' && (
                  <el-cascader
                    v-model={value['category_ids']}
                    placeholder='请选择'
                    clearable
                    class="invoice-cascader"
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
        label: '发票税率',
        key: 'invoice_tax_rate',
        type: 'input',
        required: true,
        component({ key }, value) {
          return (
            <div>
              <el-input v-model={value[key]} type='number' min={0} > 
                <template slot='append'>%</template>
              </el-input>
            </div>
          )
        }
      }
    ],
    vm
  )
