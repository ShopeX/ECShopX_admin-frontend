<template>
  <div class="section section-white">
    <el-form ref="form" :label-position="'left'" :model="form" :rules="rules" label-width="160px">
      <div class="section-body">
        <el-form-item label="开票方名称" prop="resourceName">
          <el-input
            v-model="form.resourceName"
            placeholder="请输入开票方名称"
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item label="税率" prop="resourceName">
          <el-input v-model="form.title_date" placeholder="请输入税率" style="width: 340px" />
        </el-form-item>
        <el-form-item label="开票方税率" prop="resourceName">
          <el-input v-model="form.title_time" placeholder="请输入开票方税率" style="width: 340px" />
        </el-form-item>
        <el-form-item label="开票方银行" prop="reservationName">
          <el-input v-model="form.title_time" placeholder="请输入开票方银行" style="width: 340px" />
        </el-form-item>
        <el-form-item label="开票方银行账号" prop="interval">
          <el-input
            v-model="form.title_time"
            placeholder="请输入开票方银行账号"
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item label="开票方联系电话" prop="resourceName">
          <el-input
            v-model="form.title_time"
            placeholder="请输入开票方联系电话"
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item label="开票人" prop="resourceName">
          <el-input v-model="form.title_time" placeholder="请输入开票人" style="width: 340px" />
        </el-form-item>
        <el-form-item label="开票联系地址" prop="resourceName">
          <el-input
            v-model="form.title_time"
            placeholder="请输入开票联系地址"
            style="width: 340px"
          />
        </el-form-item>
      </div>
      <div class="section-footer with-border content-center">
        <el-button type="primary" @click="save"> 保存 </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { getFapiaoset, saveFapiaoset } from '@/api/fapiao'
export default {
  inject: ['refresh'],
  data() {
    return {
      timeIntervals: [
        { value: 15, label: '15分钟' },
        { value: 30, label: '30分钟' },
        { value: 60, label: '60分钟' },
        { value: 90, label: '90分钟' }
      ],
      attrList: [], //服务类目ID
      form: {
        id: 1,
        resourceName: '',
        reservationMode: '',
        reservationName: '',
        title_date: '',
        title_time: '',
        interval: 30,
        maxLimitDay: 10,
        minLimitHour: 30
      },
      rules: {
        resourceName: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        reservationName: [{ required: true, message: '服务类目不能为空', trigger: 'blur' }],
        interval: [{ required: true, message: '预约时间间隔不能为空', trigger: 'blur' }],
        maxLimitDay: [{ required: true, validator: maxLimitChecked, trigger: 'blur' }],
        minLimitHour: [{ required: true, validator: minLimitChecked, trigger: 'blur' }]
      }
    }
  },
  mounted() {
    // this.getData()
    // this.getAttr()
  },
  methods: {
    save() {
      const that = this
      saveSettingData(this.form).then(res => {
        if (res.data.data) {
          this.$message({
            type: 'success',
            message: '保存预约配置成功',
            duration: 2 * 1000,
            onClose() {
              that.refresh()
              that.$router.go(-1)
            }
          })
        }
        //this.getData()
      })
    },
    getData() {
      let params = { id: 0 }
      this.loading = true
      if (this.$router.currentRoute.query.id) {
        params.id = this.$router.currentRoute.query.id
        getListSetting(params).then(res => {
          if (res.data.data.list) {
            var data = res.data.data.list
            data.map(item => {
              ;(this.form.id = item.id),
                (this.form.resourceName = item.resourceName),
                (this.form.title_date = item.title_date),
                (this.form.title_time = item.title_time),
                (this.form.reservationMode = item.reservationModeKV.value),
                (this.form.reservationName = item.reservationModeKV.label),
                (this.form.interval = item.timeInterval),
                (this.form.maxLimitDay = item.maxLimitDay)
              this.form.minLimitHour = item.minLimitHour
            })
          }
          this.loading = false
        })
      }
    }
  }
}
</script>
<style scoped></style>
