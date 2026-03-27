<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section-white content-padded">
    <el-form :ref="form" v-model="form" class="add-form">
      <el-form-item :label="$t('d2280f8c.39834b')">
        <el-input v-model="form.active_name" :placeholder="$t('d2280f8c.7e726b')" />
      </el-form-item>
      <!-- <el-form-item label="活动主题">
        <el-radio-group v-model="form.active_theme">
          <el-radio :label="1">小程序会员注册送礼</el-radio>
          <el-radio :label="2">全渠道新会员注册送礼</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item :label="$t('d2280f8c.0292a0')">
        <el-date-picker
          v-model="form.date_range"
          type="datetimerange"
          :placeholder="$t('d2280f8c.7940b4')"
        />
      </el-form-item>
      <el-form-item :label="$t('d2280f8c.ea549e')">
        <el-switch v-model="form.message_remind" active-color="#13ce66" inactive-color="#ff4949" />
      </el-form-item>
      <el-form-item :label="$t('d2280f8c.047ac1')">
        <el-button type="primary" @click="addGift"> {{ $t('d2280f8c.874fa7') }} </el-button>
        <el-table :data="form.activeData" class="table">
          <el-table-column prop="name" :label="$t('d2280f8c.e8d2de')" />
          <el-table-column prop="type" :label="$t('d2280f8c.226b09')" />
          <el-table-column prop="worth" :label="$t('d2280f8c.021ac9')" />
          <el-table-column prop="validity" :label="$t('d2280f8c.bb114a')" />
          <el-table-column prop="num" :label="$t('d2280f8c.c3c2e5')" />
          <el-table-column :label="$t('d2280f8c.2b6bc0')">
            <template slot-scope="scope">
              <el-button type="text"> {{ $t('d2280f8c.95b351') }} </el-button>
              <el-button type="text" @click="remove(scope.row, scope.$index)">
                {{ $t('d2280f8c.2f4aad') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div class="section-footer content-center">
      <el-button type="primary"> {{ $t('d2280f8c.be5fbb') }} </el-button>
    </div>
    <gift-dialog :switch-on="isopen" @closeDialog="closeDialog" />
  </div>
</template>

<script>
import giftDialog from './giftadddialog.vue'
export default {
  components: {
    giftDialog
  },
  data() {
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
    addGift() {
      this.isopen = true
    },
    remove(row, index) {
      this.form.activeData.splice(index, 1)
    },
    closeDialog() {
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
