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
      }
    ],
    columns: [
      {
        name: '开票方名称',
        key: 'seller_company_name',
        width: '120'
      },
      {
        name: '开票方税号',
        key: 'seller_tax_no',
        width: '120'
      },
      {
        name: '开票方电话',
        key: 'seller_phone',
        width: '120'
      },
      // {
      //   name: '开票渠道',
      //   key: 'seller_name',
      //   width: '120'
      // },
      {
        name: '管理分类',
        key: 'invoice_apply_bn',
        width: '120'
      },
      {
        name: '税率',
        key: 'payee',
        width: '80'
      },
      {
        name: '开票人',
        key: 'seller_name',
        width: '100'
      },
      {
        name: '收款人',
        key: 'payee',
        width: '100'
      },
      {
        name: '复核人',
        key: 'reviewer',
        width: '100'
      },
      {
        name: '开票方地址',
        key: 'seller_address',
        width: '120'
      },
      {
        name: '添加时间',
        key: 'created',
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
        key: 'alipay_fee_type',
        type: 'select',
        tip:'下拉选择配置销方开票信息',
        options:vm.invoiceSellerList,
        required: true
      },
      {
        label: '配置税率分类',
        key: 'category_type',
        validator: (rule, value, callback) => {
          console.log(123,value,vm.dialogForm)
          if(value == 2 &&  !vm.dialogForm.main_cat_id?.length){
            callback(new Error('指定分类不能为空'))
          }else{
            callback()
          }
        },
        defaultValue: '1',
        component({ key }, value) {
          return (
            <div>
              <el-radio-group v-model={value['category_type']}>
                <el-radio label='1'>全部分类</el-radio>
                <el-radio label='2'>指定分类</el-radio>
              </el-radio-group>
              <div>
                {value['category_type'] == 2 && (
                  <el-cascader
                    v-model={value['main_cat_id']}
                    placeholder='请选择'
                    style={{width:'300px'}}
                    clearable
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
                )}
              </div>
            </div>
          )
        }
      },
      {
        label: '发票税率',
        key: 'alipay_fee_ty',
        type: 'input',
        required: true,
        component({ key }, value) {
          return (
            <div>
              <el-input v-model={value[key]} type='number' min={0} /> &nbsp;%
            </div>
          )
        }
      }
    ],
    vm
  )
