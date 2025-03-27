<template>
  <div class="section section-white">
    <el-form
      ref="recorddata"
      :model="recorddata"
      label-width="150px"
      label-position="right"
      class="demo-ruleForm"
    >
      <div class="section-header with-border">
        活动报名信息
      </div>
      <div class="section-body">
        <el-form-item label="活动名称：">
          {{ recorddata.activity_name }}
        </el-form-item>
        <el-form-item
          label="活动有效时间"
          prop="activity_time"
        >
          {{ recorddata.activity_start_time }} ~ {{ recorddata.activity_end_time }}
        </el-form-item>
        <el-form-item label="活动状态：">
          {{ recorddata.status_name }}
        </el-form-item>
        <!-- <el-form-item label="活动城市：">
          {{ recorddata.area_name }}
        </el-form-item> -->
        <el-form-item
          label="申请时间"
          prop="created"
        >
          {{ recorddata.created | datetime('YYYY-MM-DD HH:mm:ss') }}
        </el-form-item>
        <el-form-item label="活动地址：">
          {{ recorddata.place }}
        </el-form-item>
        <el-form-item label="详情地址：">
          {{ recorddata.address }}
        </el-form-item>
        <el-form-item label="手机号：">
          {{ recorddata.mobile }}
        </el-form-item>
        <el-form-item label="获取积分：">
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
        <el-form-item label="活动群组编号：">
          {{ recorddata.group_no }}
        </el-form-item>
        <el-form-item label="进内购企业白名单：">
          {{ recorddata.is_white_list == 1 ? '是' : '否'}}
        </el-form-item>
        <el-form-item label="适用会员" v-if="recorddata.is_white_list == 0">
          <el-checkbox-group v-model="memberLevelList">
            <el-checkbox v-for="grade in memberGrade" :key="grade.grade_id" :label="grade.grade_id+''">
              {{ grade.grade_name }}
            </el-checkbox>
            <el-checkbox v-for="vipdata in vipGrade" :key="vipdata.lv_type" :label="vipdata.lv_type+''">
              付费{{ vipdata.grade_name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="适用店铺：" v-if="recorddata.is_white_list == 0">
          <SpFinder
            :noSelection='true'
            :setting="shopSetting"
            :data="recorddata.distributor_list"
            style="width:80%"
          />
        </el-form-item>
        <el-form-item label="企业：" v-if="recorddata.is_white_list == 1">
          <SpFinder
            :noSelection='true'
            :setting="setting"
            :data="recorddata.enterprise_list"
            style="width:80%"
          />
        </el-form-item>
      </div>
      <div class="section-header with-border">
        报名登记信息
      </div>
      <div class="section-body">
        <el-form-item
          label="审核结果："
          prop="status"
        >
          <el-tag
            v-if="recorddata.status == 'pending'"
            type="warning"
            size="mini"
          >
            待审核
          </el-tag>
          <el-tag
            v-if="recorddata.status == 'passed'"
            type="success"
            size="mini"
          >
            已通过
          </el-tag>
          <el-tag
            v-if="recorddata.status == 'rejected'"
            type="danger"
            size="mini"
          >
            已拒绝
          </el-tag>
        </el-form-item>
        <el-form-item label="报名问卷：">
          <el-card
            v-for="(item, index) in recorddata.content"
            :key="index"
            class="box-card"
            style="width: 90%;"
          >
            <div
              slot="header"
              class="clearfix"
            >
              <span>{{ item.title }}</span>
            </div>
            <div
              v-for="(item, key) in item.formdata"
              :key="key"
              class="text item"
            >
              <el-col style="display: flex;">
                <div>{{ item.field_title }}: </div>
                <div v-if="item.field_name != 'Attendance IDCard' && item.field_name != 'Attachment upload'" style="margin-left: 10px;">{{ item.answer }}</div>
                <div v-if="(item.field_name == 'Attendance IDCard' || item.field_name == 'Attachment upload') && !Array.isArray(item.answer)" style="display: flex;">
                  <div v-for="(itemv, idx) in (item.answer ? item.answer?.split(',') : [])" :key="idx">
                    <el-image
                      style="width: 100px; height: 100px;border-radius: 5px;margin: 10px;"
                      :src="itemv"
                      :preview-src-list="item.answer ? item.answer.split(',') : []">
                    </el-image>
                  </div>
                </div>
              </el-col>
            </div>
          </el-card>
        </el-form-item>
      </div>
      <div class="section-header with-border" v-if="recorddata.status == 'pending' && !IS_DISTRIBUTOR()">
        活动报名审核
      </div>
      <div class="section-body">
        <el-form-item
          v-if="recorddata.status == 'pending'"
          label="是否同意："
        >
          <el-switch v-model="form.status" />
        </el-form-item>
        <el-form-item
          v-if="form.status === false && recorddata.status == 'pending'"
          label="拒绝原因："
        >
          <el-input
            v-model="form.reason"
            type="textarea"
          />
        </el-form-item>
      </div>
      <el-form-item>
        <el-button
          v-if="recorddata.status == 'pending'&& !IS_DISTRIBUTOR()"
          type="primary"
          @click="submitAction"
        >
          提交审核
        </el-button>
        <el-button @click="handleCancel">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { regActivityRecordinfo, registrationReview, regActivityGet } from '@/api/selfhelpform'
import { createSetting } from '@shopex/finder'
import { getGradeList } from '@/api/membercard'
import { listVipGrade } from '@/api/cardticket'

export default {
  inject: ['refresh'],
  data () {
    return {
      activity_date: [],
      memberLevelList: [], // 适用会员等级
      form: {
        record_id: '',
        status: true,
        reason: ''
      },
      recorddata: {},
      shopSetting: {
        columns: [
          { name: 'ID', key: 'distributor_id'  },
          { name: '名称', key: 'name' },
          { name: '地址', key: 'address' },
        ]
      },
      setting: {
        columns: [
          { name: '企业ID', key: 'id'  },
          { name: '企业名称', key: 'enterprise_sn' },
          { name: '登录类型', key: 'login_type' },
          { name: '来源店铺', key: 'distributor_name' },
        ]
      },
      vipGrade: [],
      memberGrade: [],
    }
  },
  mounted () {
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
    getActivityDetail (recordInfo) {
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
          is_white_list : data.is_white_list,
          area_name: data.area_name,
          place: data.place,
          get_points: data.get_points,
          distributor_list: data.distributor_list,
          enterprise_list: data.enterprise_list,
        }
        this.memberLevelList = data.member_level.split(',')
        this.recorddata = {...recordInfo, ...activityInfo}
      })
    },
    getGradeLevelList () {
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
    submitAction () {
      const that = this
      registrationReview(that.form).then((res) => {
        if (res.data.data.status) {
          that.refresh()
          that.$router.go(-1)
        }
      })
    },
    handleCancel () {
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped lang="scss">
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
