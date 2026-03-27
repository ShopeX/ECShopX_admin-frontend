<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section-white content-padded">
    <el-form :ref="form" v-model="form" class="add-form">
      <el-form-item :label="$t('8e88d5e8.39834b')">
        <el-input v-model="form.active_name" :placeholder="$t('8e88d5e8.7e726b')" />
      </el-form-item>
      <el-form-item :label="$t('8e88d5e8.a4a94f')">
        <el-input
          v-model="form.member"
          :placeholder="$t('8e88d5e8.c0e45d')"
          disabled
          style="width: 420px"
        /><!-- &nbsp;<span class="frm-tips">多个手机号逗号（英文字符）分隔</span> -->
        <div>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <el-checkbox
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange"
              >
                {{ $t('8e88d5e8.66eeac') }}
</el-checkbox
              ><span style="line-height: 36px">{{ $t('8e88d5e8.816fa4') }}</span>
              <el-button type="text" class="f_r" @click="showAddMobile">
                {{ $t('8e88d5e8.3a126e') }}
              </el-button>
            </div>
            <el-checkbox-group v-model="checkedMobile" @change="handleCheckedMobileChange">
              <div>
                <el-checkbox v-for="item in mobileData" :key="item" :label="item">
                  {{ item }}
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </el-card>
        </div>
      </el-form-item>
      <el-form-item :label="$t('8e88d5e8.ea549e')">
        <el-switch v-model="form.message_remind" active-color="#13ce66" inactive-color="#ff4949" />
      </el-form-item>
      <el-form-item :label="$t('8e88d5e8.047ac1')">
        <el-button type="primary" @click="addGift"> {{ $t('8e88d5e8.874fa7') }} </el-button>
        <el-table :data="form.activeData" class="table">
          <el-table-column prop="name" :label="$t('8e88d5e8.e8d2de')" />
          <el-table-column prop="type" :label="$t('8e88d5e8.226b09')" />
          <el-table-column prop="worth" :label="$t('8e88d5e8.021ac9')" />
          <el-table-column prop="validity" :label="$t('8e88d5e8.bb114a')" />
          <el-table-column prop="num" :label="$t('8e88d5e8.c3c2e5')" />
          <el-table-column :label="$t('8e88d5e8.2b6bc0')">
            <template slot-scope="scope">
              <el-button type="text"> {{ $t('8e88d5e8.95b351') }} </el-button>
              <el-button type="text" @click="remove(scope.row, scope.$index)">
                {{ $t('8e88d5e8.2f4aad') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div class="section-footer content-center">
      <el-button type="primary"> {{ $t('8e88d5e8.be5fbb') }} </el-button>
    </div>
    <gift-dialog :switch-on="isopen" @closeDialog="closeDialog" />

    <el-dialog :title="$t('8e88d5e8.3a126e')" :visible.sync="addmobileVisible">
      <div>
        <span>{{ $t('8e88d5e8.41fe81') }}</span
        ><el-input v-model="mobile" :placeholder="$t('8e88d5e8.6e4f4b')" style="width: 240px" />
      </div>
      <div slot="footer" class="dialog-footer content-center">
        <el-button @click="addmobileVisible = false"> {{ $t('8e88d5e8.625fb2') }} </el-button>
        <el-button type="primary" @click="addMobile"> {{ $t('8e88d5e8.38cf16') }} </el-button>
      </div>
    </el-dialog>
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
      form: {
        active_name: '',
        member: '',
        message_remind: true,
        activeData: []
      },
      isopen: false,
      isIndeterminate: false,
      checkAll: false,
      checkedMobile: [],
      mobileData: ['18751966005', '18516539406', '18871236792'],
      addmobileVisible: false,
      mobile: ''
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
    },
    handleCheckAllChange(event) {
      this.checkedMobile = event.target.checked ? this.mobileData : []
      this.isIndeterminate = false
      this.form.member = this.checkedMobile.length == 0 ? '' : this.checkedMobile.join(',')
      // this.mobileChoose()
    },
    handleCheckedMobileChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.mobileData.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.mobileData.length
      this.form.member = this.checkedMobile.length == 0 ? '' : this.checkedMobile.join(',')
      // this.mobileChoose()
    },
    mobileChoose() {
      // if (this.checkedMobile.length == 0 && this.form.member != '') {
      //   let tempArr = []
      //   tempArr = this.form.member.indexOf(',') > 0 ? this.form.member.split(',') : tempArr.push(this.form.member)
      //   let mobileTemp = tempArr
      //   for(var i = 0; i < this.mobileData.length; i++) {
      //     for (var j = 0; j < tempArr.length; j++) {
      //       if (tempArr[j] == this.mobileData[i]) {
      //         mobileTemp.splice(j, 1)
      //       }
      //     }
      //   }
      //   console.log(mobileTemp)
      //   this.form.member = mobileTemp.join(',')
      // } else {
      //   let tempChoose = []
      //   for (var i = 0; i < this.checkedMobile.length; i++) {
      //     if (this.form.member.indexOf(this.checkedMobile[i]) < 0) {
      //       tempChoose.push(this.checkedMobile[i])
      //     }
      //   }
      //   this.form.member = this.form.member.indexOf(',') == this.form.member.length - 1 ? this.form.member + tempChoose.join(',') : this.form.member + ',' + tempChoose.join(',')
      // }
      // var tempArr = []
      // tempArr = this.form.member == '' ? [] : this.form.member.indexOf(',') > 0 ? this.form.member.split(',') : tempArr.push(this.form.member)
      // for (var i = 0; i < this.checkedMobile.length; i++) {
      //   if (this.form.member.indexOf(this.checkedMobile[i]) < 0) {
      //     tempChoose.push(this.checkedMobile[i])
      //   }
      // }
    },
    showAddMobile() {
      this.addmobileVisible = true
    },
    addMobile() {
      this.addmobileVisible = false
      if (this.mobile != '') {
        this.mobileData.push(this.mobile)
      }
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
.frm-tips {
  color: #ff5000;
  font-size: 14px;
}
.el-card {
  width: 50%;
  margin: 10px 0 0 70px;
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
  .el-card__header {
    padding: 5px 20px;
  }
}
.section-footer {
  padding: 15px 10px;
  text-align: center;
}
</style>
