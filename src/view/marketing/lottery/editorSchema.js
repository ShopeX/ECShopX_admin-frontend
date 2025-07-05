import { bindThisForFormSchema } from '@/utils/schemaHelper'
import { createSetting } from '@shopex/finder'

export const formList = (vm) =>
  bindThisForFormSchema(
    [
      {
        type: 'group',
        label: '活动基础配置'
      },
      // {
      //   label: '区域',
      //   key: 'area_id',
      //   placeholder: '请选择',
      //   defaultValue: '',
      //   required: true,
      //   type: 'select',
      //   options: vm?.areas || []
      // },
      {
        label: '活动标题',
        key: 'activity_name',
        type: 'input',
        required: true,
        placeholder: '请输入活动标题',
        defaultValue: ''
      },
      {
        label: '活动时间',
        key: 'start_time',
        required: true,
        placeholder: '请选择活动时间',
        defaultValue: '',
        component(_) {
          return (
            <el-date-picker
              v-model={vm.form['start_time']}
              type='datetimerange'
              on-change={(val) => vm.handleDateInput(val)}
              range-separator='至'
              start-placeholder='开始时间'
              end-placeholder='结束时间'
              value-format='yyyy-MM-dd HH:mm:ss'
              default-time={['00:00:00', '23:59:59']}
            />
          )
        }
      },
      {
        label: '抽奖消耗',
        key: 'cost_type',
        type: 'input',
        required: true,
        placeholder: '请输入抽奖消耗',
        defaultValue: '2',
        component(_) {
          return (
            <div>
              <el-radio-group v-model={vm.form['cost_type']}>
                {/* <el-radio-button label='1'>互动分</el-radio-button> */}
                <el-radio-button label='2'>积分</el-radio-button>
              </el-radio-group>
              <el-input
                v-model={vm.form['cost_value']}
                placeholder='请输入分值'
                style={{ width: '120px', marginLeft: '20px' }}
              />
            </div>
          )
        }
      },
      {
        label: '抽奖限额',
        key: 'limit_total',
        type: 'input',
        placeholder: '请输入抽奖限额',
        defaultValue: '',
        required: true,
        component() {
          return (
            <div>
              <el-input v-model={vm.form['limit_total']} style={{ width: '120px' }} />
              <div style={{ marginTop: '20px' }}>
                每日可抽奖 &nbsp;
                <el-input v-model={vm.form['limit_day']} style={{ width: '120px' }} />
                &nbsp; 次
              </div>
            </div>
          )
        }
      },
      {
        label: '活动说明',
        key: 'intro',
        type: 'richText',
        required: true,
        placeholder: '请输入活动说明',
        defaultValue: ''
      },
      {
        type: 'group',
        label: '抽奖配置',
        defaultValue: ''
      },
      {
        label: '抽奖形式',
        defaultValue: 'wheel',
        required: true,
        key: 'activity_type',
        component(_) {
          return (
            <el-radio-group v-model={vm.form['activity_type']}>
              <el-radio-button label='wheel'>大转盘</el-radio-button>
              {/* <el-radio-button label='slotMachine'>老虎机</el-radio-button>
              <el-radio-button label='grid'>九宫格</el-radio-button> */}
            </el-radio-group>
          )
        }
      },
      {
        label: '抽奖配置',
        key: 'prize_data',
        defaultValue: [],
        required: true,
        component() {
          return (
            <SpFinder
              ref='finder'
              data={vm.form['prize_data']}
              no-selection
              setting={innerSchema(vm)}
              row-actions-width='50px'
              show-pager={false}
              class='prize_data'
            >
              <div slot='tableTop'>
                <el-button plain onClick={() => vm.addHandle()}>
                  添加奖项
                </el-button>
                <span>&nbsp;最多添加8项</span>
                <div style={{ height: '20px' }}></div>
              </div>
            </SpFinder>
          )
        },
        validator(rule, value, callback) {
          // 统计概率 必须 ==100
          const total = value?.reduce((acc, item) => acc + (item.prize_probability * 1 || 0), 0)
          console.log('🚀 ~ validator ~ total:', total)
          if (total != 100) {
            callback(new Error('概率总和必须等于100'))
          } else if (value?.filter((item) => item.prize_type).length <= 0) {
            callback(new Error('请设置奖品'))
          } else {
            callback()
          }
        }
      },
      {
        label: '页面背景',
        key: 'back',
        defaultValue: '',
        component({ key }, value) {
          return (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '20px' }}>
                <span>背景色</span>
                <span>背景图</span>
                <span
                  style={{ marginLeft: '40px' }}
                  onClick={() => {
                    vm.form = {
                      ...vm.form,
                      background: '',
                      backgroundColor: ''
                    }
                  }}
                >
                  恢复默认
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '20px' }}>
                <div>
                  <el-color-picker
                    value={vm.form['background']}
                    onChange={(val) => {
                      vm.form['background'] = val
                    }}
                  />
                </div>
                <div>
                  <SpImagePicker
                    value={vm.form['background']}
                    onChange={(val) => {
                      vm.form['background'] = val
                    }}
                  />
                </div>
              </div>
            </div>
          )
        }
      },
      {
        label: '抽奖区域',
        key: 'hotArea',
        defaultValue: null,
        component({ key }, value) {
          return (
            <div class='inputWrap'>
              <div>{vm['hotAreaConfig']?.img ? '已设置' : '未设置'}</div>
              <div style={{ display: 'flex', fontSize: '14px' }}>
                <div onClick={() => (vm.hotAreasDialogShow = true)}>设置&nbsp;</div>
                <div
                  onClick={() => {
                    vm.hotArea = {
                      backImg: '',
                      padding: 0,
                      background: '#ffffff',
                      img: ''
                    }
                  }}
                >
                  恢复默认
                </div>
              </div>
            </div>
          )
        }
      },
      // {
      //   label: '抽奖规则按钮',
      //   key: 'ruleBtnStyle',
      //   defaultValue: '',
      //   component({ key }, value) {
      //     return (
      //       <div class='inputWrap'>
      //         <div>{vm['ruleFormConfig']?.img ? '已设置' : '未设置'}</div>
      //         <div style={{ display: 'flex', fontSize: '14px' }}>
      //           <div onClick={() => (vm.ruleDialogShow = true)}>设置&nbsp;</div>
      //           <div
      //             onClick={() => {
      //               vm.ruleForm = {
      //                 rule: ['#000000', '#000000'],
      //                 img: ''
      //               }
      //             }}
      //           >
      //             恢复默认
      //           </div>
      //         </div>
      //       </div>
      //     )
      //   }
      // },
      {
        label: '抽奖记录按钮',
        key: 'recordBtnStyle',
        defaultValue: '',
        component({ key }, value) {
          return (
            <div class='inputWrap'>
              <div>{vm['recordFormConfig']?.img ? '已设置' : '未设置'}</div>
              <div style={{ display: 'flex' }}>
                <div onClick={() => (vm.recordDialogShow = true)}>设置&nbsp;</div>
              </div>
            </div>
          )
        }
      }
      // {
      //   label: '',
      //   key: 'lotteryMonitor',
      //   defaultValue: '',
      //   component(_) {
      //     return (
      //       <div class='lottery-editor-content'>
      //         <LuckyWheel ref='luckyWheelRef' config={vm.lotteryConfig} />
      //       </div>
      //     )
      //   }
      // }
    ],
    vm
  )

// 抽奖奖品配置
export const innerSchema = (vm) =>
  createSetting({
    actions: [
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
        name: '奖项名称',
        key: 'text',
        width: '300px',
        render(_, { row, $index }) {
          return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <el-input
                value={row['text']}
                style={{ width: '200px' }}
                on-input={(val) => vm.handleInput(val, row, $index, 'text')}
              />
            </div>
          )
        }
      },
      {
        name: '中奖概率',
        key: 'prize_probability',
        width: '140px',
        render(_, { row, $index }) {
          return (
            <div>
              <el-input
                value={row['prize_probability']}
                on-input={(val) => vm.handleInput(val, row, $index, 'prize_probability')}
              />
            </div>
          )
        }
      },
      {
        name: '奖品',
        key: 'prize_type',
        width: '300px',
        render(_, { row, $index }) {
          return (
            <div style={{ display: 'flex', alignItems: 'center' }} key={row['prize_type']}>
              <el-select
                value={row['prize_type']}
                placeholder='请选择'
                style={{ width: '100px' }}
                on-change={(val) => vm.handleInput(val, row, $index, 'prize_type')}
              >
                {vm?.options?.map((item) => {
                  return (
                    <el-option label={item.label} value={item.value} key={item.value}></el-option>
                  )
                })}
              </el-select>
              {row['prize_type'] == 'coupon' && (
                <div style={{ paddingLeft: '10px' }}>
                  {row['prize_value']?.title}
                  {row['prize_detail']?.title}
                  <span
                    style={{ color: '#ff0000', marginLeft: '4px' }}
                    onClick={() => vm.onCouponSubmit(row, $index, 'prize_value')}
                  >
                    选择
                  </span>
                </div>
              )}
              {row['prize_type'] == 'coupons' && (
                <div style={{ paddingLeft: '10px' }}>
                  {row['prize_value']?.title}
                  {row['prize_detail']?.title}
                  <span
                    style={{ color: '#ff0000', marginLeft: '4px' }}
                    onClick={() => vm.onCouponPackSubmit(row, $index, 'prize_value')}
                  >
                    选择
                  </span>
                </div>
              )}
              {row['prize_type'] == 'points' && (
                <el-input
                  value={row['prize_value']}
                  on-input={(val) => vm.handleInput(val, row, $index, 'prize_value')}
                  style={{ width: '80px', marginLeft: '4px' }}
                />
              )}
            </div>
          )
        }
      },
      {
        name: '每日奖品库存',
        key: 'stock',
        width: '140px',
        render(_, { row, $index }) {
          if (row['prize_type'] == 'thanks' || !row['prize_type']) {
            return null
          }
          return (
            <div>
              <el-input
                value={row['stock']}
                on-input={(val) => vm.handleInput(val, row, $index, 'stock')}
                type='number'
              />
            </div>
          )
        }
      },
      {
        name: '奖项底色',
        key: 'background',
        width: '80px',
        render(_, { row, $index }) {
          return (
            <div>
              <el-color-picker
                value={row['background']}
                on-change={(val) => vm.handleInput(val, row, $index, 'background')}
              />
            </div>
          )
        }
      },
      {
        name: '奖品图',
        key: 'img',
        width: '80px',
        render(_, { row, $index }) {
          return (
            <div class='imgWrap'>
              <SpImagePicker
                size='mini'
                value={row['img'] || ''}
                on-input={(val) => vm.handleInput(val, row, $index, 'img')}
              />
            </div>
          )
        }
      }
    ]
  })

// 抽奖区域
export const lotteryAreaSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        label: '背景图片',
        key: 'backImg',
        required: true,
        defaultValue: '',
        component(_) {
          return (
            <div key='backImg'>
              <SpImagePicker v-model={vm.hotArea['backImg']} />
            </div>
          )
        }
      },
      {
        label: '内边距',
        key: 'padding',
        required: true,
        defaultValue: 0,
        component(_) {
          return (
            <div key='padding'>
              <el-input v-model={vm.hotArea['padding']} type='number' />
              <div>最大不可超过50</div>
            </div>
          )
        }
      },
      {
        label: '奖项默认底色',
        key: 'background',
        required: true,
        defaultValue: '#ffffff',
        component(_) {
          return (
            <div>
              <el-color-picker v-model={vm.hotArea['background']} />
            </div>
          )
        }
      },
      {
        label: '抽奖按钮图片',
        key: 'img',
        required: true,
        defaultValue: [],
        component(_) {
          return (
            <div>
              <SpImagePicker v-model={vm.hotArea['img']} key='img' />
              <div>建议尺寸 160px * 160px 像素</div>
            </div>
          )
        }
      }
      // {
      //   label: '中奖抽奖图片',
      //   key: 'icon',
      //   required: true,
      //   defaultValue: '',
      //   component(_) {
      //     return <div>
      //       <SpImagePicker v-model={vm.hotArea['icon']} key='icon' />
      //       <div>建议尺寸 270px * 270px 像素</div>
      //     </div>
      //   }
      // }
    ],
    vm
  )

// 抽奖规则按钮
export const ruleFormSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        label: '按钮配色',
        key: 'rule',
        required: true,
        defaultValue: ['#000000', '#000000'],
        component(_) {
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <el-color-picker v-model={vm.ruleForm['rule'][0]} /> &nbsp;按钮底色&nbsp;
              <el-color-picker v-model={vm.ruleForm['rule'][1]} /> &nbsp;按钮文字颜色
            </div>
          )
        }
      },
      {
        label: '按钮图片',
        key: 'img',
        required: true,
        defaultValue: '',
        component(_) {
          return (
            <div>
              <SpImagePicker v-model={vm.ruleForm['img']} />
              <div>建议尺寸：宽度 150 像素，高度自适应</div>
            </div>
          )
        }
      }
    ],
    vm
  )

// 抽奖记录按钮
export const recordFormSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        label: '按钮配色',
        key: 'rule',
        required: true,
        defaultValue: ['#000000', '#000000'],
        component(_) {
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <el-color-picker v-model={vm.recordForm['rule'][0]} /> &nbsp;按钮底色&nbsp;
              <el-color-picker v-model={vm.recordForm['rule'][1]} /> &nbsp;按钮文字颜色
            </div>
          )
        }
      },
      {
        label: '按钮图片',
        key: 'img',
        required: true,
        defaultValue: '',
        component(_) {
          return (
            <div>
              <SpImagePicker v-model={vm.recordForm['img']} />
              <div>建议尺寸：宽度 150 像素，高度自适应</div>
            </div>
          )
        }
      }
    ],
    vm
  )
