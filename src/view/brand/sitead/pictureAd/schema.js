import { bindThisForFormSchema } from '@/utils/schemaHelper'
import { createSetting } from '@shopex/finder'
import dImage from '@/assets/imgs/default.jpg'
import moment from 'moment'
import AttrHotSetting from '@/view/decorate/wgts/wgt_hotzone/attr-hotsetting.vue'
import auditDialog from './comps/auditdialog.vue'

const mapStatus = {
  submitting: '待提审',
  processing: '审核中',
  approved: '已通过',
  rejected: '已驳回'
}

const statusText = (status, audit_status) => {
  if(status == 2) {
    return '已失效'
  }
  if(audit_status == 'submitting') {
    return '待提审'
  }
  if(audit_status == 'processing') {
    return '待审核'
  }
  if(audit_status == 'approved'&&status == 1) {
    return '生效中'
  }
  if(audit_status == 'approved'&&status == 0) {
    return '待生效'
  }
  if(audit_status == 'rejected') {
    return '已驳回'
  }
  if(status == 2) {
    return '已失效'
  }
  
}

export const tableSchema = (vm) =>
  createSetting({
    search: [
      { key: 'regionauth_id', name: '', type: 'select', options: vm?.areas },
      { key: 'id', name: '', placeholder: '广告ID' },
      { key: 'name', name: '', placeholder: '广告名称' }
    ],
    actions: [
      {
        name: '编辑',
        key: 'edit',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: ([row]) => {
            vm.editHandle(row)
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
      },
      {
        name: "提交审核",
        key: 'submit',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: ([row]) => {
            vm.submitHandle(row)
          }
        },
        visible: (row) => {
          return row.audit_status === 'submitting'&&row.status != 2
        }
      },
      {
        name: '撤销审核',
        key: 'cancel',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: ([row]) => {
            vm.cancelHandle(row)
          }
        },
        visible: (row) => {
          return row.audit_status === 'processing'&&row.status != 2
        }
      },
      {
        name: '审核',
        key: 'audit',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'dialog',
          width: '1060px',
          title: '审核',
          onClose: () => {
            console.log('撤销审核')
            vm.refresh()
          },
          component: auditDialog,   
          handler: () => {
            return true
          },
          actions: [
            { label: '取消', key: 'close' },
            { label: '提交', key: 'save', type: 'primary' }
          ]
        },
        visible: (row) => {
          return row.audit_status === 'processing'&&row.status != 2
        }
      }
    ],
    columns: [
      {
        name: '广告ID',
        key: 'id',
        width: '80'
      },
      {
        name: '广告名称',
        key: 'name'
      },
      {
        name: '广告内容',
        key: 'cover_image_url',
        width: '200',
        render(h, { row }) {
          let imgUrl = ''
          try {
            const setting = JSON.parse(row.setting)
            imgUrl = setting?.imgUrl
          } catch (error) {
            imgUrl = ''
          }
          return (
            <div>
              {imgUrl && (
                <el-image
                  src={imgUrl}
                  fit='cover'
                  style={{
                    width: '100px',
                    height: '100px'
                  }}
                />
              )}
            </div>
          )
        }
      },
      {
        name: '可见人群',
        key: 'rel_tags',
        width: '200',
        render(h, { row }) {
          return (
            <div>
              {
                row.rel_tags?.map((el) => {
                  return <el-tag effect='light'>{el.tag_name}</el-tag>
                })
              }
            </div>
          )
        }
      },
      {
        name: '应用页面',
        key: 'pages',
        width: '160',
        render(h, { row }) {
          const pageMap = {
            product_detail: '商品详情页',
            pay_success: '支付成功页',
            lottery: '抽奖页'
          }
          return <span>{pageMap[row.pages]}</span>
        }
      },
      {
        name: '适用店铺',
        key: 'rel_distributors',
        width: '160',
        render(h, { row }) {
          return <span>{row.rel_distributors.length>0 ? '指定店铺' : '全部店铺'}
            {row.rel_distributors.length>0 ? <el-button type='text' size='mini' onClick={() => {
              vm.editDistributor(row)
            }}>查看</el-button> : null}</span>
        }
      },
      {
        name: '有效期',
        key: 'created',
        minWidth: '320',
        render(h, { row }) {
          return (
            <span>
              {moment(row.start_time * 1000).format('yyyy-MM-DD HH:mm:ss')} ~
              {moment(row.end_time * 1000).format('yyyy-MM-DD HH:mm:ss')}
            </span>
          )
        }
      },
      {
        name: '状态',
        key: 'status',
        render(h, { row }) {
            return <span>{statusText(row.status, row.audit_status)}</span>
        },
        width: '100'
      },
    ]
  })

export const formSchema = (vm) => bindThisForFormSchema([
  {
    label: '区域',
    key: 'regionauth_id',
    placeholder: '请选择',
    defaultValue: '',
    required: true,
    type: 'select',
    options: vm?.areas,
    onChange(val) {
      vm.$set(vm.activityRule, 'imgList', {imgUrl: vm.activityRule.imgList.imgUrl, data: []})
      vm.$set(vm.imgList, 'data', [])
    }
  },
  {
    type: 'input',
    label: '广告名称',
    key: 'name',
    required: true
  },
  {
    label: '有效期',
    key: 'start_time',
    defaultValue: [],
    component({ disabled }) {
      return (
        <div class='preheat-time'>
          <el-date-picker
            v-model={vm.activityRule.start_time}
            type='datetimerange'
            start-placeholder='开始日期'
            end-placeholder='结束日期'
            range-separator='至'
          />
        </div>
      )
    },
    required: true,
    validator(rule, value, callback) {
      if (!vm.activityRule.start_time?.length) {
        callback(new Error('请选择有效期'))
      } else {
        callback()
      }
    }
  },
  {
    label: '广告图片',
    key: 'imgList',
    required: true,
    defaultValue: [],
    component({ disabled }) {
      console.log('vm.imgList', vm.activityRule.regionauth_id)
      return (
        <div style={{ display: 'flex', gap: '5px' }}>
          <el-image style={{ width: '100px', height: '100px' }} src={vm.imgList.imgUrl || dImage} />
          <AttrHotSetting v-model={vm.imgList} regionauthid={vm.activityRule.regionauth_id}/>
{/* 
          <div class='img-data'>
            <div onClick={() => vm.handleAddImage()}>
              <el-input
                value={vm.imgList.data?.length ? `已设置${vm.imgList.data.length}个热区` : ''}
                placeholder='请设置广告图热区及链接'
                class='suffix'
              >
                <span slot='suffix' class='suffix'>设置</span>
              </el-input>
            </div>
          </div> */}
        </div>
      )
    },
    validator(rule, value, callback) {
      if (!vm.imgList?.imgUrl) {
        callback(new Error('选择广告图片'))
      } else {
        callback()
      }
    }
  },
  {
    label: '排序',
    key: 'sort',
    defaultValue: 0,
    component({ disabled }) {
      return <el-input v-model={vm.activityRule.sort} type='number' />
    }
  },
  {
    label: '可见人群',
    key: 'rel_tags',
    defaultValue: [],
    component({ disabled }) {
      return <crowdSelect v-model={vm.activityRule.rel_tags} disabled={disabled} />
    }
  },
  {
    label: '应用页面',
    key: 'pages',
    defaultValue: 'product_detail',
    component({ disabled }) {
      return (
        <el-radio-group v-model={vm.activityRule.pages} size='mini' disabled={disabled}>
          <el-radio label='product_detail' value='product_detail' >商品详情页 </el-radio>
          <el-radio label='pay_success' value='pay_success' >支付成功页 </el-radio>
          <el-radio label='lottery' value='lottery' >抽奖页 </el-radio>
        </el-radio-group>
      )
    }
  },
  {
    label: '展示店铺',
    key: 'distributor_id',
    defaultValue: [],
    component({ disabled }, value) {
      return <SpSelectShopV2
        v-model={value['distributor_id']}
        names={value['distributor_id']?.length ? `已选择${value['distributor_id']?.length}个店铺` : ''}
        multiple
        clearable
        placeholder="请选择店铺"
      />
    },
    isShow() {
      return vm.activityRule.pages === 'product_detail'
    }
  },
],
  vm
)
