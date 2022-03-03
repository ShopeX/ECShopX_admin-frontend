<template>
  <div class="section section-white">
    <div class="section-header with-border">
      报名详情及审核
    </div>
    <div class="section-body">
      <el-form
        ref="recorddata"
        :model="recorddata"
        label-width="150px"
        label-position="right"
        class="demo-ruleForm"
      >
        <el-form-item label="活动名称">
          {{ recorddata.activity_name }}
        </el-form-item>
        <el-form-item
          label="活动有效时间"
          prop="activity_time"
        >
          {{ recorddata.start_date }} ~ {{ recorddata.end_date }}
        </el-form-item>
        <el-form-item
          label="审核结果"
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
        <el-form-item label="报名问卷">
          <el-card
            v-for="(item, index) in recorddata.content"
            :key="index"
            class="box-card"
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
              {{ item.field_title }}: {{ item.answer }}
            </div>
          </el-card>
        </el-form-item>
        <el-form-item
          v-if="recorddata.status == 'pending'"
          label="是否拒绝"
        >
          <el-switch v-model="form.status" />
        </el-form-item>
        <el-form-item
          v-if="form.status === false && recorddata.status == 'pending'"
          label="拒绝原因"
        >
          <el-input
            v-model="form.reason"
            type="textarea"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="recorddata.status == 'pending'"
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
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { regActivityRecordinfo, registrationReview } from '@/api/selfhelpform'

export default {
  inject: ['refresh'],
  data () {
    return {
      activity_date: [],
      form: {
        record_id: '',
        status: true,
        reason: ''
      },
      recorddata: {}
    }
  },
  mounted () {
    if (this.$route.query.id) {
      let filter = { record_id: this.$route.query.id }
      regActivityRecordinfo(filter).then((res) => {
        this.recorddata = res.data.data
        this.form.record_id = this.recorddata.record_id
      })
    }
  },
  methods: {
    submitAction () {
      const that = this
      registrationReview(that.form).then((res) => {
        if (res.data.data.status) {
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
