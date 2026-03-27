<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

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
import { i18n } from '@/i18n'

export default {
  data() {
    return {
      name: '',
      mobile: '',
      extraData: {},
      approve_status: 0,
      btnActions: [
        { name: i18n.t('ab0b4593.23c1f3'), key: 'resolve' },
        { name: i18n.t('ab0b4593.325254'), key: 'reject' }
      ],
      resloveDialog: false,
      resloveForm: {
        approve_status: 1,
        refuse_reason: ''
      },
      resloveFormList: [
        // {
        //   label: '审批:',
        //   key: 'approve_status',
        //   type: 'radio',
        //   options: [
        //     { label: 1, name: '同意' },
        //     { label: 2, name: '不同意' }
        //   ],
        //   onChange: (e) => {
        //     if (e == 2) {
        //       this.resloveFormList[1].isShow = true
        //     } else {
        //       this.resloveFormList[1].isShow = false
        //     }
        //   }
        // },
        {
          label: i18n.t('ab0b4593.f48f94'),
          key: 'refuse_reason',
          type: 'input',
          placeholder: i18n.t('ab0b4593.fc955a'),
          // isShow: false,
          validator: (rule, value, callback) => {
            if (this.resloveForm.approve_status == 2 && !value) {
              callback(new Error(i18n.t('ab0b4593.281bad')))
            } else {
              callback()
            }
          }
        }
      ]
    }
  },
  created() {
    this.fetchDetail()
  },
  methods: {
    async fetchDetail() {
      const { apply_id } = this.$route.params
      const { chief_name, chief_mobile, approve_status, extra_data } =
        await this.$api.community.getChiefDetail(apply_id)
      this.name = chief_name
      this.mobile = chief_mobile
      this.extraData = extra_data
      this.approve_status = approve_status
    },
    renderComp({ type, value }) {
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
    handleAction(e) {
      if (e.key === 'reject') {
        this.$set(this.resloveForm, 'approve_status', 2)
        this.resloveDialog = true
      } else {
        this.$set(this.resloveForm, 'approve_status', 1)
        this.onResloveSubmit()
      }
    },
    async onResloveSubmit() {
      const { apply_id } = this.$route.params
      const { approve_status, refuse_reason } = this.resloveForm
      await this.$api.community.approveChief(apply_id, {
        approve_status,
        refuse_reason
      })
      this.resloveDialog = false
      this.fetchDetail()
    }
  },
  render() {
    const { name, mobile, extraData, btnActions, approve_status } = this
    console.log('approve_status', approve_status)
    return (
      <SpPage>
        <el-card class='el-card--normal'>
          <div slot='header'>{this.$t('ab0b4593.30817b')}</div>
          <el-row class='card-panel'>
            <el-col class='card-panel-item' span={24}>
              <span class='card-panel__label'>{this.$t('ab0b4593.75d152')}</span>
              <span class='card-panel__value'>{name}</span>
            </el-col>
            <el-col class='card-panel-item' span={24}>
              <span class='card-panel__label'>{this.$t('ab0b4593.17afda')}</span>
              <span class='card-panel__value'>{mobile}</span>
            </el-col>
          </el-row>
        </el-card>

        <el-card class='el-card--normal'>
          <div slot='header'>{this.$t('ab0b4593.ae094f')}</div>
          {Object.keys(extraData).map((key) => (
            <el-row class='card-panel' key={key}>
              <el-col class='card-panel-item' span={24}>
                <span class='card-panel__label'>{`${extraData[key].label}:`}</span>
                <span class='card-panel__value'>{this.renderComp(extraData[key])}</span>
              </el-col>
            </el-row>
          ))}
        </el-card>

        {this.approve_status == 0 && (
          <div class='footer-container'>
            {btnActions.map((btn, index) => (
              <el-button
                key={`btn-item__${index}`}
                type='primary'
                plain
                on-click={this.handleAction.bind(this, btn)}
              >
                {btn.name}
              </el-button>
            ))}
          </div>
        )}

        <SpDialog
          ref='resloveDialogRef'
          v-model={this.resloveDialog}
          title={this.$t('ab0b4593.0273ba')}
          form={this.resloveForm}
          form-list={this.resloveFormList}
          on-onSubmit={this.onResloveSubmit}
        />
      </SpPage>
    )
  }
}
</script>
