<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage no-sticky class="section section-whit page-registrationrecordetail">
    <el-form
      ref="recorddata"
      :model="recorddata"
      label-width="150px"
      label-position="right"
      class="demo-ruleForm"
    >
      <el-card :header="$t('b20b6711.e38333')" shadow="naver">
        <el-form-item :label="$t('b20b6711.eb2f99')">
          {{ recorddata.activity_name }}
        </el-form-item>
        <el-form-item :label="$t('b20b6711.08256c')" prop="activity_time">
          {{ recorddata.activity_start_time | datetime('YYYY-MM-DD HH:mm:ss') }} ~
          {{ recorddata.activity_end_time | datetime('YYYY-MM-DD HH:mm:ss') }}
        </el-form-item>
        <el-form-item :label="$t('b20b6711.da2549')">
          {{ recorddata.status_name }}
        </el-form-item>
        <!-- <el-form-item label="活动城市：">
          {{ recorddata.area_name }}
        </el-form-item> -->
        <el-form-item :label="$t('b20b6711.5ba072')" prop="created">
          {{ recorddata.created | datetime('YYYY-MM-DD HH:mm:ss') }}
        </el-form-item>
        <el-form-item :label="$t('b20b6711.982708')">
          {{ recorddata.place }}
        </el-form-item>
        <el-form-item :label="$t('b20b6711.b9131a')">
          {{ recorddata.address }}
        </el-form-item>
        <el-form-item :label="$t('b20b6711.41fe81')">
          {{ recorddata.mobile }}
        </el-form-item>
        <el-form-item :label="$t('b20b6711.12635a')">
          {{ recorddata.get_points }}
        </el-form-item>
        <!-- <el-form-item label="可重复报名：">
          {{ recorddata.is_allow_duplicate == 1 ? '是' : '否'}}
        </el-form-item>
        <el-form-item label="是否审核：">
          {{ recorddata.is_need_check == 1 ? '是' : '否'}}
        </el-form-item>
        <el-form-item label="线下核销：">
          {{ recorddata.is_offline_verify == 1 ? '是' : '否'}}
        </el-form-item>
        <el-form-item label="允许取消报名：">
          {{ recorddata.is_allow_cancel == 1 ? '是' : '否'}}
        </el-form-item> -->
        <el-form-item :label="$t('b20b6711.d151a7')">
          {{ recorddata.group_no }}
        </el-form-item>
        <el-form-item :label="$t('b20b6711.e5b125')">
          {{ recorddata.is_white_list == 1 ? $t('15ecc99b.0a60ac') : $t('15ecc99b.c9744f') }}
        </el-form-item>
        <el-form-item :label="$t('b20b6711.6dbb6f')" v-if="recorddata.is_white_list == 0">
          <el-checkbox-group v-model="memberLevelList">
            <el-checkbox
              v-for="grade in memberGrade"
              :key="grade.grade_id"
              :label="grade.grade_id + ''"
            >
              {{ grade.grade_name }}
            </el-checkbox>
            <el-checkbox
              v-for="vipdata in vipGrade"
              :key="vipdata.lv_type"
              :label="vipdata.lv_type + ''"
            >
              {{ $t('b20b6711.310f84') }}{{ vipdata.grade_name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('b20b6711.a0162c')" v-if="recorddata.is_white_list == 0">
          <SpFinder
            :no-selection="true"
            :setting="shopSetting"
            :data="recorddata.distributor_list"
            style="width: 80%"
            :show-pager="false"
          />
        </el-form-item>
        <el-form-item :label="$t('b20b6711.aa1329')" v-if="recorddata.is_white_list == 1">
          <SpFinder
            :no-selection="true"
            :setting="setting"
            :data="recorddata.enterprise_list"
            style="width: 80%"
            :show-pager="false"
          />
        </el-form-item>
      </el-card>
      <el-card :header="$t('b20b6711.c7557f')" shadow="naver">
        <el-form-item :label="$t('b20b6711.0dee1e')" prop="status">
          <el-tag v-if="recorddata.status == 'pending'" type="warning" size="mini">
{{
            $t('a0d7a294.5cb424')
          }}
</el-tag>
          <el-tag v-if="recorddata.status == 'passed'" type="success" size="mini">
{{
            $t('b20b6711.ecfa64')
          }}
</el-tag>
          <el-tag v-if="recorddata.status == 'rejected'" type="danger" size="mini">
{{
            $t('a0d7a294.81233d')
          }}
</el-tag>
        </el-form-item>
        <el-form-item :label="$t('b20b6711.2271f0')">
          <el-card
            v-for="(item, index) in recorddata.content"
            :key="index"
            class="box-card"
            style="width: 90%"
          >
            <div slot="header" class="clearfix">
              <span>{{ item.title }}</span>
            </div>
            <div v-for="(item, key) in item.formdata" :key="key" class="text item">
              <el-col style="display: flex">
                <div>{{ item.field_title }}:</div>
                <div
                  v-if="
                    (item.field_name == 'Attendance IDCard' ||
                      item.field_name == 'Attachment upload') &&
                    (item.form_element == 'idcard' || item.form_element == 'otherfile') &&
                    !Array.isArray(item.answer)
                  "
                  style="display: flex"
                >
                  <div
                    v-for="(itemv, idx) in item.answer ? item.answer?.split(',') : []"
                    :key="idx"
                  >
                    <el-image
                      style="width: 100px; height: 100px; border-radius: 5px; margin: 10px"
                      :src="itemv"
                      :preview-src-list="item.answer ? item.answer.split(',') : []"
                    />
                  </div>
                </div>
                <div v-else style="margin-left: 10px">{{ item.answer }}</div>
              </el-col>
            </div>
          </el-card>
        </el-form-item>
      </el-card>
      <el-card
        :header="$t('b20b6711.9cb5bf')"
        shadow="naver"
        v-if="recorddata.status == 'pending' && !IS_DISTRIBUTOR()"
      >
        <el-form-item v-if="recorddata.status == 'pending'" :label="$t('b20b6711.db1690')">
          <el-switch v-model="form.status" />
        </el-form-item>
        <el-form-item
          v-if="form.status === false && recorddata.status == 'pending'"
          :label="$t('b20b6711.2624eb')"
        >
          <el-input v-model="form.reason" type="textarea" />
        </el-form-item>
      </el-card>
    </el-form>

    <template slot="page-footer">
      <div class="text-center">
        <el-button
          v-if="recorddata.status == 'pending' && !IS_DISTRIBUTOR()"
          type="primary"
          @click="submitAction"
        >
          {{ $t('b20b6711.646db0') }}
        </el-button>
        <el-button @click="handleCancel">{{ $t('b20b6711.625fb2') }}</el-button>
      </div>
    </template>
  </SpPage>
</template>

<script>
import { Message } from 'element-ui'
import { regActivityRecordinfo, registrationReview, regActivityGet } from '@/api/selfhelpform'
import { createSetting } from '@shopex-ui/finder'
import { getGradeList } from '@/api/membercard'
import { listVipGrade } from '@/api/cardticket'

export default {
  inject: ['refresh'],
  data() {
    return {
      activity_date: [],
      memberLevelList: [], // 适用会员等级
      form: {
        record_id: '',
        status: true,
        reason: ''
      },
      recorddata: {},
      vipGrade: [],
      memberGrade: []
    }
  },
  computed: {
    shopSetting() {
      return {
        columns: [
          { name: 'ID', key: 'distributor_id' },
          { name: this.$t('b20b6711.d7ec2d'), key: 'name' },
          { name: this.$t('b20b6711.765048'), key: 'address' }
        ]
      }
    },
    setting() {
      const vm = this
      return {
        columns: [
          { name: vm.$t('b20b6711.5a83cb'), key: 'id' },
          { name: vm.$t('b20b6711.f47e27'), key: 'name' },
          {
            name: vm.$t('b20b6711.78cbe8'),
            key: 'auth_type',
            formatter(value, { auth_type }, col) {
              const VALIDATE_TYPES = [
                { nameKey: 'ac2a6290.a8b0c2', value: '' },
                { nameKey: '6b57cb80.8098e2', value: 'mobile' },
                { nameKey: 'b20b6711.bc1f2d', value: 'account' },
                { nameKey: 'b20b6711.3bc5e6', value: 'email' },
                { nameKey: 'b20b6711.22b03c', value: 'qr_code' }
              ]
              const item = VALIDATE_TYPES.find((i) => i.value == auth_type)
              return item ? vm.$t(item.nameKey) : value
            }
          },
          { name: vm.$t('3aa73191.53cc55'), key: 'distributor_name' }
        ]
      }
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.form.record_id = this.$route.query.id
      let filter = { record_id: this.$route.query.id }
      regActivityRecordinfo(filter).then((res) => {
        this.getActivityDetail(res.data.data)
      })
      this.getGradeLevelList()
    }
  },
  methods: {
    getActivityDetail(recordInfo) {
      const activity_id = this.$route.query.activity_id
      let activityInfo = {}
      regActivityGet({ activity_id }).then((res) => {
        const data = res.data.data
        activityInfo = {
          activity_name: data.activity_name,
          activity_type: data.activity_type,
          activity_start_time: data.start_time,
          activity_end_time: data.end_time,
          address: data.address,
          is_allow_cancel: data.is_allow_cancel,
          is_allow_duplicate: data.is_allow_duplicate,
          is_need_check: data.is_need_check,
          is_offline_verify: data.is_offline_verify,
          is_allow_cancel: data.is_allow_cancel,
          group_no: data.group_no,
          is_white_list: data.is_white_list,
          area_name: data.area_name,
          place: data.place,
          get_points: data.get_points,
          distributor_list: data.distributor_list,
          enterprise_list: data.enterprise_list
        }
        this.memberLevelList = data.member_level.split(',')
        this.recorddata = { ...recordInfo, ...activityInfo }
      })
    },
    getGradeLevelList() {
      listVipGrade().then((response) => {
        if (response != undefined && response.data.data && response.data.data.length > 0) {
          this.vipGrade = response.data.data
        }
      })
      getGradeList().then((response) => {
        if (response != undefined && response.data.data && response.data.data.length > 0) {
          this.memberGrade = response.data.data
        }
      })
    },
    submitAction() {
      const that = this

      registrationReview(this.form).then((res) => {
        if (res.data.data.status) {
          that.refresh()
          that.$router.go(-1)
        }
      })
    },
    handleCancel() {
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped lang="scss">
.page-registrationrecordetail ::v-deep .el-card {
  margin-bottom: 20px;
}
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 1px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
.box-card {
  width: 480px;
}
</style>
