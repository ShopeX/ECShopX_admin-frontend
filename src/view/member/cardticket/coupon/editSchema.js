import { bindThisForFormSchema } from '@/utils/schemaHelper'
import { createSetting } from '@shopex/finder'

export const formSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        label: '基础信息',
        type: 'group'
      },
      {
        label: '区域',
        type: 'select',
        key: 'regionauth_id',
        defaultValue: '',
        options: vm.areas || [],
        required: true,
        disabled: vm.editFlag
      },
      {
        label: '券名称',
        type: 'input',
        key: 'title',
        required: true,
        defaultValue: '',
        placeholder: '请输入',
        maxLength: 9,
        disabled: vm.editFlag
      },
      {
        label: '券介绍',
        type: 'input',
        key: 'intro',
        required: true,
        defaultValue: '',
        placeholder: '请输入',
        maxLength: 256,
        disabled: vm.editFlag
      },
      {
        label: '卡券使用说明',
        type: 'textarea',
        key: 'description',
        required: true,
        defaultValue: '',
        disabled: vm.editFlag,
        maxlength: 300
      },
      {
        label: '券封面图',
        key: 'cover_pic',
        required: true,
        defaultValue: '',
        component(_, value) {
          return <SpImagePicker v-model={value['cover_pic']} size='small' disabled={vm.editFlag} />
        }
      },
      {
        label: '减免金额',
        type: 'input',
        key: 'reduce_cost',
        required: true,
        defaultValue: '',
        component(_, value) {
          return (
            <div>
              <el-input
                v-model={value['reduce_cost']}
                style={{ width: '180px' }}
                type='number'
                disabled={vm.editFlag}
                placeholder='只能是大于0的数字'
              />
              &nbsp;元
            </div>
          )
        }
      },
      {
        label: '发放数量',
        type: 'input',
        key: 'quantity',
        required: true,
        defaultValue: '',
        component(_, value) {
          return (
            <div>
              <el-input
                v-model={value['quantity']}
                style={{ width: '200px' }}
                type='number'
                placeholder='只能是大于0的数字'
                disabled={vm.editFlag}
              />
              &nbsp;份
            </div>
          )
        }
      },
      {
        label: '领取时间',
        key: 'time',
        defaultValue: [],
        required: true,
        component(_, value) {
          return (
            <el-date-picker
              v-model={value['time']}
              type='datetimerange'
              disabled={vm.editFlag}
              placeholder='选择日期范围'
              format='yyyy-MM-dd HH:mm:ss'
            />
          )
        }
      },
      {
        label: '使用条件',
        key: 'least_cost',
        required: true,
        defaultValue: 0,
        component(_, value) {
          return (
            <div>
              满&nbsp;
              <el-input
                disabled={vm.editFlag}
                v-model={value['least_cost']}
                style={{ width: '80px' }}
                type='number'
              />
              &nbsp;元可用
            </div>
          )
        },
        isShow() {
          return vm.card_type === 'cash'
        }
      },
      {
        label: '有效期',
        key: 'date_type',
        required: true,
        defaultValue: 'DATE_TYPE_FIX_TIME_RANGE',
        component(_, value) {
          return (
            <div class='valid-time'>
              <el-radio-group v-model={value['date_type']} onChange={vm.dateTypeChange}>
                <el-radio label='DATE_TYPE_FIX_TIME_RANGE'>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    固定日期&nbsp;
                    <el-date-picker
                      disabled={value['date_type'] !== 'DATE_TYPE_FIX_TIME_RANGE' || vm.editFlag}
                      v-model={value['date_range']}
                      type='datetimerange'
                      placeholder='选择日期范围'
                      format='yyyy-MM-dd HH:mm:ss'
                      angePlaceholder=''
                    />
                  </div>
                </el-radio>
                <el-radio label='DATE_TYPE_FIX_TERM'>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    领取后，
                    <el-select
                      v-model={value['begin_time']}
                      placeholder='请选择'
                      disabled={value['date_type'] !== 'DATE_TYPE_FIX_TERM' || vm.editFlag}
                    >
                      {vm.tempDays?.map((el) => {
                        return <el-option label={el.text} value={el.value} key={el.value} />
                      })}
                    </el-select>
                    &nbsp;生效，有效天数
                    <el-input
                      v-model={value['days']}
                      style={{ width: '80px' }}
                      type='number'
                      disabled={value['date_type'] !== 'DATE_TYPE_FIX_TERM' || vm.editFlag}
                    />
                    &nbsp;天 &nbsp;统一过期时间&nbsp;
                    <el-date-picker
                      disabled={value['date_type'] !== 'DATE_TYPE_FIX_TERM' || vm.editFlag}
                      v-model={value['end_time']}
                      type='datetime'
                      placeholder='选择日期范围'
                      format='yyyy-MM-dd HH:mm:ss'
                    />
                  </div>
                </el-radio>
              </el-radio-group>
            </div>
          )
        },
        validator(rule, value, callback) {
          console.log(vm.form['begin_time'], 'value')
          if (vm.form['date_type'] === 'DATE_TYPE_FIX_TERM') {
            if (vm.form['begin_time'] === null || vm.form['begin_time'] === '') {
              callback(new Error('请选择时间'))
            } else {
              callback()
            }
          } else if (vm.form['date_type'] === 'DATE_TYPE_FIX_TIME_RANGE') {
            if (!vm.form['date_range'] || vm.form['date_range'].length <= 0) {
              callback(new Error('请选择时间'))
            } else {
              callback()
            }
          } else {
            callback()
          }
        }
      },
      {
        label: '是否支持核销后退回',
        key: 'is_returnable',
        defaultValue: '0',
        type: 'radio',
        required: true,
        disabled: vm.editFlag,
        options: [
          {
            label: '1',
            name: '是'
          },
          {
            label: '0',
            name: '否'
          }
        ],
        isShow() {
          return vm.card_type === 'cash'
        }
      },
      {
        label: '售后是否支持退回',
        key: 'is_returnable',
        defaultValue: '0',
        type: 'radio',
        required: true,
        disabled: vm.editFlag,
        options: [
          {
            label: '1',
            name: '是'
          },
          {
            label: '0',
            name: '否'
          }
        ],
        isShow() {
          return vm.card_type === 'minus'
        }
      },
      {
        label: '是否允许与其他优惠券叠加使用',
        key: 'is_stackable',
        defaultValue: '0',
        required: true,
        component(_, value) {
          return (
            <div>
              <el-popover
                placement="right"
                title="是否允许与其他优惠券叠加使用："
                width="240"
                trigger="click"
                content="如果设置为否，则当前订单如果使用该优惠券，不可再叠加使用任何优惠券">
                <el-icon class='el-icon-question' style={{ marginRight: "10px" }} slot='reference' />
              </el-popover>

              <el-radio-group v-model={value['is_stackable']} disabled={vm.editFlag}>
                <el-radio label='1'>是</el-radio>
                <el-radio label='0'>否</el-radio>
              </el-radio-group>
            </div>
          )
        }
      },
      {
        label: '单笔订单核销上限',
        key: 'max_use_num',
        defaultValue: 0,
        component(_, value) {
          return (
            <div>
              <el-popover
                placement="right"
                title="单笔订单核销上限："
                width="240"
                trigger="click"
                content="同个优惠券模板的优惠券，单笔订单的核销上限。">
                <el-icon class='el-icon-question' style={{ marginRight: "10px" }} slot='reference' />
              </el-popover>
              <el-input
                v-model={value['max_use_num']}
                style={{ width: '100px' }}
                type='number'
                disabled={vm.editFlag}
              />
            </div>
          )
        }
      },
      {
        label: '财务配置',
        type: 'group'
      },
      {
        label: 'PO编码',
        type: 'input',
        key: 'po_code',
        required: true,
        defaultValue: '',
        placeholder: '请输入',
        maxLength: 30,
        disabled: vm.editFlag
      },
      {
        label: 'Budget code',
        type: 'input',
        key: 'budget_code',
        required: true,
        defaultValue: '',
        placeholder: '请输入',
        maxLength: 30,
        disabled: vm.editFlag
      },
      {
        label: '承担比例',
        key: 'platform_cost_ratio',
        defaultValue: '',
        component(_, value) {
          return (
            <div>
              <span>
                平台承担&nbsp;
                <el-input
                  v-model={value['platform_cost_ratio']}
                  style={{ width: '80px' }}
                  type='number'
                  disabled={vm.editFlag}
                  onBlur={(e) => {
                    if (e.target.value > 100) {
                      e.target.value = 100
                    } else if (e.target.value < 0) {
                      e.target.value = 0
                    }
                    this.form = {
                      ...this.form,
                      platform_cost_ratio: e.target.value,
                      platform_cost_ratio_1: 100 - e.target.value
                    }
                  }}
                />
                &nbsp;%,
              </span>
              <span>
                店铺承担&nbsp;
                <el-input
                  v-model={value['platform_cost_ratio_1']}
                  style={{ width: '80px' }}
                  type='number'
                  disabled={vm.editFlag}
                  onBlur={(e) => {
                    if (e.target.value > 100) {
                      e.target.value = 100
                    } else if (e.target.value < 0) {
                      e.target.value = 0
                    }
                    this.form = {
                      ...this.form,
                      platform_cost_ratio: e.target.value,
                      platform_cost_ratio_1: 100 - e.target.value
                    }
                  }}
                />
                &nbsp;%
              </span>
            </div>
          )
        }
      },
      {
        label: '是否允许跨店铺分摊',
        key: 'is_cross_shop',
        defaultValue: '1',
        component(_, value) {
          return (
            <span style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
              {/* 问号 */}
              <el-popover placement='right' width='400' trigger='click'>
                <div>
                  <h2>跨店分摊规则说明：</h2>
                  <div>
                    如果允许跨店分摊，则表示多个店铺的可用商品金额总和达到门槛即可使用优惠券；
                    如果不允许跨店分摊，则表示单店铺的适用商品金额总和达到门槛才可使用优惠券；如果多店铺均满足适用，则优先店铺适用商品金额大的店铺使用。
                  </div>
                </div>
                <el-icon class='el-icon-question' slot='reference' />
              </el-popover>
              &nbsp;
              <el-radio-group v-model={value['is_cross_shop']} disabled={vm.editFlag}>
                <el-radio label='1'>是</el-radio>
                <el-radio label='0'>否</el-radio>
              </el-radio-group>
            </span>
          )
        }
      },
      {
        label: '适用规则',
        type: 'group'
      },
      {
        label: '前台直接领取',
        key: 'receive',
        type: 'switch',
        defaultValue: false,
        disabled: vm.editFlag
      },
      {
        label: '领券限制',
        key: 'get_limit',
        defaultValue: 1,
        placeholder: '请输入',
        component(_, value) {
          return (
            <div>
              <el-input
                v-model={value['get_limit']}
                style={{ width: '100px' }}
                type='number'
                disabled={vm.editFlag}
              />
              <div>每个用户领券上限，如不填，则默认为1</div>
            </div>
          )
        }
      },

      {
        label: '适用人群',
        key: 'user_type',
        defaultValue: [],
        component(_, value) {
          return (
            <div>
              <CrowdSelect v-model={vm.form['user_type']} disabled={vm?.editFlag} />
            </div>
          )
        }
      },
      {
        label: '是否支持分享',
        type: 'radio',
        key: 'is_shareable',
        defaultValue: '1',
        required: true,
        disabled: vm.editFlag,
        options: [
          {
            label: '1',
            name: '是'
          },
          {
            label: '0',
            name: '否'
          }
        ],
        require: true
      },
      {
        label: '适用商品',
        type: 'group'
      },
      {
        label: '',
        key: 'use_all_items',
        defaultValue: 'true',
        component(_, value) {
          return (
            <div>
              <el-radio-group
                v-model={value['use_all_items']}
                on-change={vm.usePrdChange}
                disabled={vm.editFlag}
              >
                <el-radio label='true'> 全部商品适用 </el-radio>
                <el-radio label='false'> 指定商品适用 </el-radio>
                <el-radio label='category'>
                  {' '}
                  {vm.is_distributor ? '指定分类适用' : '指定管理分类适用'}{' '}
                </el-radio>
                <el-radio label='distributor'> 指定店铺可用 </el-radio>
              </el-radio-group>
              {value['use_all_items'] === 'false' && (
                <div>
                  <SkuSelector data={vm.relItems} on-change={vm.getItems} />
                  <div style='position: absolute; bottom: 0px; left: 112px'>
                    <el-upload
                      style='display: inline-block; height: 0'
                      action=''
                      on-change={vm.uploadHandleChange}
                      auto-upload={false}
                      show-file-list={false}
                    >
                      <el-button type='primary'> 批量上传 </el-button>
                    </el-upload>
                    <el-button
                      style='margin-left: 10px'
                      type='primary'
                      on-click={vm.uploadHandleTemplate}
                    >
                      下载模板
                    </el-button>
                  </div>
                </div>
              )}
              {value['use_all_items'] === 'category' && (
                <div>
                  <el-cascader
                    v-model={vm['item_category']}
                    style='width: 500px'
                    placeholder='请选择'
                    clearable
                    options={vm.categoryList}
                    attrs={{
                      props: {
                        value: 'category_id',
                        label: 'category_name',
                        checkStrictly: true
                      }
                    }}
                  />
                </div>
              )}
              {value['use_all_items'] === 'distributor' && (
                <div>
                  <el-button type='primary' onClick={vm.addDistributorAction}>
                    {' '}
                    选择店铺{' '}
                  </el-button>
                  {vm.distributorInfo?.length > 0 && (
                    <SpFinder
                      ref='distributorFinderRef'
                      data={vm.distributorInfo}
                      no-selection
                      setting={vm.distributorTableSchema}
                      show-pager={false}
                    />
                  )}
                </div>
              )}
            </div>
          )
        }
      }
    ],
    vm
  )

export const createDistributorTableSchema = (vm) =>
  createSetting({
    actions: [
      {
        name: '删除',
        key: 'delete',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: ([row]) => {
            vm.deleteDistributor(row)
          }
        }
      }
    ],
    columns: [
      {
        label: 'ID',
        key: 'distributor_id'
      },
      {
        label: '名称',
        key: 'name'
      },
      {
        label: '地址',
        key: 'address'
      }
    ]
  })
