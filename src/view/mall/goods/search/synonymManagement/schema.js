import { bindThisForFormSchema } from '@/utils/schemaHelper'
import { createSetting } from '@shopex/finder'

export const createTableSchema = (vm) =>
  createSetting({
    search: [{ key: 'synonym', name: '同义词' }],
    actions: [
      {
        name: '编辑',
        key: 'edit',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: ([row]) => {
            vm.editConfigHandle(row)
          }
        }
      },
      {
        name: '删除',
        key: 'delete',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: ([row]) => {
            vm.deleteHandle(row)
          }
        }
      }
    ],
    columns: [
      {
        name: '同义词',
        key: 'word',
        render(_, { row }) {
          const str = row?.synonyms?.split(',').join('、')
          return <span>{str}</span>
        }
      }
    ]
  })

export const createFormSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        label: '',
        key: 'select',
        defaultValue: '',
        component() {
          return (
            <div className='page-body'>
              <el-row gutter={20}>
                {vm.formList?.map((_item, index) => {
                  return (
                    <el-col key={index} span={6}>
                      <el-input v-model={vm.formList[index]} clearable />
                    </el-col>
                  )
                })}
                <i class='el-icon-circle-plus-outline' onClick={() => vm.appendHandle()} />
              </el-row>
            </div>
          )
        }
      }
    ],
    vm
  )
