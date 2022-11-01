<template>
  <div class="section-white content-padded">
    <el-form
      :ref="form"
      v-model="form"
      class="add-form"
    >
      <el-form-item label="活动名称">
        <el-input
          v-model="form.active_name"
          placeholder="请填写活动名称"
        />
      </el-form-item>
      <!-- <el-form-item label="活动主题">
        <el-radio-group v-model="form.active_theme">
          <el-radio :label="1">小程序会员注册送礼</el-radio>
          <el-radio :label="2">全渠道新会员注册送礼</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="起止时间">
        <el-date-picker
          v-model="form.date_range"
          type="datetimerange"
          placeholder="请选择起止时间"
        />
      </el-form-item>
      <el-form-item label="短信提醒">
        <el-switch
          v-model="form.message_remind"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
      <el-form-item label="设置礼品">
        <el-button
          type="primary"
          @click="addGift"
        >
          添加礼品
        </el-button>
        <el-table
          :data="form.activeData"
          class="table"
        >
          <el-table-column
            prop="name"
            label="礼品名称"
          />
          <el-table-column
            prop="type"
            label="类型"
          />
          <el-table-column
            prop="worth"
            label="价值"
          />
          <el-table-column
            prop="validity"
            label="有效期"
          />
          <el-table-column
            prop="num"
            label="发放数量"
          />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text">
                编辑
              </el-button>
              <el-button
                type="text"
                @click="remove(scope.row, scope.$index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div class="section-footer content-center">
      <el-button type="primary">
        保存
      </el-button>
    </div>
    <gift-dialog
      :switch-on="isopen"
      @closeDialog="closeDialog"
    />
  </div>
</template>

<script>
import giftDialog from './giftadddialog.vue'
export default {
  components: {
    giftDialog
  },
  data () {
    return {
      isopen: false,
      form: {
        active_name: '',
        active_theme: 1,
        date_range: '',
        message_remind: true,
        activeData: []
      }
    }
  },
  methods: {
    addGift () {
      this.isopen = true
    },
    remove (row, index) {
      this.form.activeData.splice(index, 1)
    },
    closeDialog () {
      this.isopen = false
    }
  }
}
</script>
<style scoped lang="scss">
.el-table {
  margin-left: 70px;
  width: 90%;
  margin-top: 20px;
}
</style>
<style lang="scss">
.add-form {
  .el-input {
    width: 240px;
  }
  .el-input-number {
    .el-input {
      width: auto;
    }
  }
}
</style>
