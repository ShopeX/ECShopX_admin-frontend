<style lang="scss" scoped>
.sp-image {
  display: inline-block;
  vertical-align: top;
}
.imglist-wrap {
  display: inline-block;
}
</style>

<script>
import { FORM_COMP } from '@/consts'
import { isArray } from '@/utils'
import moment from 'moment'

export default {
  data () {
    return {
      name: '',
      mobile: '',
      extraData: {},
      source:'',
      applyTime:"",
      approveTime:"",
      btnActions: [{ name: '审批', key: 'resolve' }],
      resloveDialog: false,
      resloveForm: {
        approve_status: 1,
        refuse_reason: ''
      },
      resloveFormList: [
        {
          label: '审批:',
          key: 'approve_status',
          type: 'radio',
          options: [
            { label: 1, name: '同意' },
            { label: 2, name: '不同意' }
          ],
          onChange: (e) => {
            if (e == 2) {
              this.resloveFormList[1].isShow = true
            } else {
              this.resloveFormList[1].isShow = false
            }
          }
        },
        {
          label: '拒绝原因:',
          key: 'refuse_reason',
          type: 'input',
          placeholder: '请输入拒绝原因',
          isShow: false,
          validator: (rule, value, callback) => {
            if (this.resloveForm.approve_status == 2 && !value) {
              callback(new Error('不能为空'))
            } else {
              callback()
            }
          }
        }
      ]
    }
  },
  created () {
    this.fetchDetail()
  },
  methods: {
    async fetchDetail () {
      const { apply_id,distributor_id } = this.$route.params
      const { chief_name, chief_mobile, apply_time, extra_data,source,approve_time } = await this.$api.community.getChiefInfoDetail({apply_id,distributor_id})
      this.name = chief_name
      this.mobile = chief_mobile
      this.extraData = JSON.parse(extra_data)
      this.applyTime = apply_time&&moment(apply_time * 1000).format('YYYY-MM-DD HH:mm:ss')
      this.approveTime = approve_time&&moment(approve_time * 1000).format('YYYY-MM-DD HH:mm:ss')
      this.source = this.getSource(source)
    },
    getSource(status) {
      if (status == '0') {
        return '手动导入'
      } else if (status == '1') {
        return '主动申请'
      }
    },
    renderComp ({ type, value }) {
      if (type == FORM_COMP.IMAGE) {
        if (isArray(value)) {
          return (
            <div class='imglist-wrap'>
              {value.map((item) => (
                <SpImage src={item} />
              ))}
            </div>
          )
        } else {
          return <SpImage src={value} />
        }
      } else {
        return value
      }
    },
  },
  render () {
    const { name, mobile, extraData, applyTime, source ,approveTime} = this
    console.log('approve_status', name)
    return (
      <div>
        <el-card class='el-card--normal'>
          <div slot='header'>团长基本信息</div>
          <el-row class='card-panel'>
            <el-col class='card-panel-item' span={24}>
              <span class='card-panel__label'>姓名:</span>
              <span class='card-panel__value'>{name}</span>
            </el-col>
            <el-col class='card-panel-item' span={24}>
              <span class='card-panel__label'>手机:</span>
              <span class='card-panel__value'>{mobile}</span>
            </el-col>
            <el-col class='card-panel-item' span={24}>
              <span class='card-panel__label'>来源:</span>
              <span class='card-panel__value'>{source}</span>
            </el-col>
            <el-col class='card-panel-item' span={24}>
              <span class='card-panel__label'>申请时间:</span>
              <span class='card-panel__value'>{applyTime}</span>
            </el-col>
            <el-col class='card-panel-item' span={24}>
              <span class='card-panel__label'>审批时间:</span>
              <span class='card-panel__value'>{approveTime}</span>
            </el-col>
          </el-row>
        </el-card>

        <el-card class='el-card--normal'>
          <div slot='header'>团长其他信息</div>
          {extraData&&Object.keys(extraData).map((key) => (
            <el-row class='card-panel' key={key}>
              <el-col class='card-panel-item' span={24}>
                <span class='card-panel__label'>{`${extraData[key].label}:`}</span>
                <span class='card-panel__value'>{this.renderComp(extraData[key])}</span>
              </el-col>
            </el-row>
          ))}
        </el-card>
      </div>
    )
  }
}
</script>
