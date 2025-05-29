import { bindThisForFormSchema } from '@/utils/schemaHelper'

export const createFormBaseList = (vm) => bindThisForFormSchema(
 [
  {
   label: '基础信息',
   type: 'group'
  },
  {
   label: '直播名称',
   className: 'activity-name',
   key: 'name',
   placeholder: '请输入',
   defaultValue: '',
   type: 'input',
   required: true,
   maxlength: 30,
   disabled: false,
   message: '活动名称不能为空'
  },
  {
   label: '直播封面',
   key: 'cover_image_url',
   defaultValue: '',
   component({ key }, value) {
    return (
     <div class='activity-pic-field'>
      <SpImagePicker v-model={value['cover_image_url']} />
     </div>
    )
   },
   validator(rule, value, callback) {
    if (!vm.formBase.cover_image_url) {
     callback(new Error('请选择图片'))
    } else {
     callback()
    }
   }
  },
  {
   label: '开播时间',
   key: 'start_time',
   defaultValue: '',
   component({ disabled }) {
    return (
     <div class='preheat-time'>
      <el-date-picker
       v-model={vm.formBase.start_time}
       type='datetime'
       placeholder='选择日期范围'
       format='yyyy-MM-dd HH:mm:ss'
       angePlaceholder=''
      />
     </div>
    )
   },
   disabled: false,
   validator(rule, value, callback) {
    if (!vm.formBase.start_time) {
     callback(new Error('请选择开播时间'))
    } else {
     callback()
    }
   }
  },
  {
   label: '区域',
   key: 'regionauth_id',
   placeholder: '请选择',
   defaultValue: '',
   required: true,
   component({ key }, value) {
    return (
     <div class='refund-address'>
      <el-select
       v-model={value['regionauth_id']}
       placeholder='请选择'
       disabled={vm.formBase.regionauth_id === null || vm.formBase.regionauth_id === undefined || vm.formBase.regionauth_id === ''}
      >
       {(vm.areas || [])?.map((el, index) => {
        return <el-option key={index} label={el.label} value={el.value} />
       })}
      </el-select>
     </div>
    )
   }
  },
  {
   label: '店铺',
   key: 'distributor_id',
   placeholder: '选择店铺',
   defaultValue: '',
   component({ key }, value) {
    return (
     <div class='refund-address'>
      <el-button
       disabled={!!vm?.formBase?.distributor_id}
       onclick={() => {
        vm.handleClick()
       }}
      >
       选择店铺
      </el-button>
      {vm.distributor ? (
       <div style={{ width: '200px', height: '50px', display: 'flex' }}>
        <el-image
         src={vm.distributor?.logo || require('@/assets/img/shop_logo_default.png')}
         style={{
          width: '60px',
          height: '60px'
         }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '25px' }}>
         <div>{vm.distributor?.name}</div>
         <div>ID:{vm.distributor?.shop_code}</div>
        </div>
       </div>
      ) : null}
     </div>
    )
   }
  },
  {
   label: '主持人',
   key: 'publisher',
   placeholder: '请输入',
   defaultValue: '',
   type: 'input'
  },
  {
   label: '账号',
   className: 'activity-name',
   key: 'anchor_account',
   placeholder: '',
   defaultValue: '',
   type: 'input',
   disabled: true
  },
  {
   label: '优先级',
   key: 'sort',
   spanCount: 2,
   type: 'number',
   defaultValue: 0
  },
  {
   label: '直播设置',
   type: 'group'
  },
  {
   label: '直播场景',
   key: 'new_scene',
   type: 'radio',
   options: [
    {
     label: 'alone',
     name: '活动营销'
    }
   ],
   required: true,
   defaultValue: 'alone'
  },
  {
   label: '直播模板',
   key: 'live_template',
   type: 'radio',
   defaultValue: 'alone',
   required: true,
   options: [{ name: '纯视频', label: 'alone' }]
  },
  {
   label: '观看模板',
   key: 'watch_template',
   type: 'radio',
   options: [
    {
     label: 'portrait',
     name: '竖屏'
    }
   ],
   required: true,
   defaultValue: 'portrait'
  },
  {
   label: '直播延迟',
   key: 'pure_rtc_enabled',
   type: 'radio',
   options: [
    {
     label: 'Y',
     name: '无延迟'
    },
    {
     label: 'N',
     name: '正常延迟'
    }
   ],
   defaultValue: 'Y'
  }
 ],
 vm
)
