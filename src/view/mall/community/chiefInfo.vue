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
import moment from 'moment'
import { i18n } from '@/i18n'

export default {
  data() {
    return {
      name: '',
      mobile: '',
      extraData: {},
      source: '',
      applyTime: '',
      approveTime: '',
      btnActions: [{ name: i18n.t('278c159d.0273ba'), key: 'resolve' }],
      resloveDialog: false,
      resloveForm: {
        approve_status: 1,
        refuse_reason: ''
      },
      resloveFormList: [
        {
          label: i18n.t('278c159d.717b4d'),
          key: 'approve_status',
          type: 'radio',
          options: [
            { label: 1, name: i18n.t('278c159d.e61f2c') },
            { label: 2, name: i18n.t('278c159d.1bf19c') }
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
          label: i18n.t('278c159d.de77c5'),
          key: 'refuse_reason',
          type: 'input',
          placeholder: i18n.t('278c159d.fc955a'),
          isShow: false,
          validator: (rule, value, callback) => {
            if (this.resloveForm.approve_status == 2 && !value) {
              callback(new Error(i18n.t('278c159d.281bad')))
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
      const { apply_id, distributor_id } = this.$route.params
      const { chief_name, chief_mobile, apply_time, extra_data, source, approve_time } =
        await this.$api.community.getChiefInfoDetail({ apply_id, distributor_id })
      this.name = chief_name
      this.mobile = chief_mobile
      this.extraData = JSON.parse(extra_data)
      this.applyTime = apply_time && moment(apply_time * 1000).format('YYYY-MM-DD HH:mm:ss')
      this.approveTime = approve_time && moment(approve_time * 1000).format('YYYY-MM-DD HH:mm:ss')
      this.source = this.getSource(source)
    },
    getSource(status) {
      if (status == '0') {
        return this.$t('278c159d.b4c3b2')
      } else if (status == '1') {
        return this.$t('278c159d.562b1a')
      }
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
    }
  },
  render() {
    const { name, mobile, extraData, applyTime, source, approveTime } = this
    console.log('approve_status', name)
    return (
      <SpPage>
        <el-card class='el-card--normal'>
          <div slot='header'>{this.$t('278c159d.30817b')}</div>
          <el-row class='card-panel'>
            <el-col class='card-panel-item' span={24}>
              <span class='card-panel__label'>{this.$t('278c159d.75d152')}</span>
              <span class='card-panel__value'>{name}</span>
            </el-col>
            <el-col class='card-panel-item' span={24}>
              <span class='card-panel__label'>{this.$t('278c159d.17afda')}</span>
              <span class='card-panel__value'>{mobile}</span>
            </el-col>
            <el-col class='card-panel-item' span={24}>
              <span class='card-panel__label'>{this.$t('278c159d.dc06e2')}</span>
              <span class='card-panel__value'>{source}</span>
            </el-col>
            <el-col class='card-panel-item' span={24}>
              <span class='card-panel__label'>{this.$t('278c159d.796c1b')}</span>
              <span class='card-panel__value'>{applyTime}</span>
            </el-col>
            <el-col class='card-panel-item' span={24}>
              <span class='card-panel__label'>{this.$t('278c159d.c9095f')}</span>
              <span class='card-panel__value'>{approveTime}</span>
            </el-col>
          </el-row>
        </el-card>

        <el-card class='el-card--normal'>
          <div slot='header'>{this.$t('278c159d.ae094f')}</div>
          {extraData &&
            Object.keys(extraData).map((key) => (
              <el-row class='card-panel' key={key}>
                <el-col class='card-panel-item' span={24}>
                  <span class='card-panel__label'>{`${extraData[key].label}:`}</span>
                  <span class='card-panel__value'>{this.renderComp(extraData[key])}</span>
                </el-col>
              </el-row>
            ))}
        </el-card>
      </SpPage>
    )
  }
}
</script>
