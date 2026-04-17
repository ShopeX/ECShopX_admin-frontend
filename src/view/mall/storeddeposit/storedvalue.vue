<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section-white content-padded">
    <div class="content-bottom-padded">
      <el-button type="primary" @click="showDialog">
        {{ $t('4171686f.5b102f', [dataList.length]) }}
      </el-button>
    </div>
    <el-table v-loading="loading" :data="dataList" :height="wheight - 200">
      <el-table-column prop="money" :label="$t('4171686f.3df354')" />
      <el-table-column :label="$t('4171686f.34ce20')">
        <template slot-scope="scope">
          <span v-if="scope.row.ruleType == 'money'">{{ $t('4171686f.da5072') }}</span>
          <span v-if="scope.row.ruleType == 'point'">{{ $t('4171686f.d81f65') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('4171686f.03c8c2')">
        <template slot-scope="scope">
          <span v-if="scope.row.ruleType == 'money'">{{
            $t('4171686f.48e45e', [scope.row.money, scope.row.ruleData])
          }}</span>
          <span v-if="scope.row.ruleType == 'point'">{{
            $t('4171686f.1874c6', [scope.row.money, scope.row.ruleData])
          }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('4171686f.2b6bc0')">
        <template slot-scope="scope">
          <a href="#" @click="edit(scope.row, scope.$index)">{{ $t('4171686f.95b351') }}</a>
          <a href="#" @click="remove(scope.row, scope.$index)">{{ $t('4171686f.2f4aad') }}</a>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="$t('4171686f.164405')"
      :visible="dialogVisible"
      :close-on-click-modal="false"
      :before-close="cancelAction"
    >
      <div>
        <el-form ref="form" :rules="rules" :model="form" label-width="120px">
          <el-form-item :label="$t('4171686f.3df354')" prop="fixed_money">
            <el-input v-model="form.fixed_money" style="width: 240px" />
          </el-form-item>
          <el-form-item :label="$t('4171686f.34ce20')">
            <el-select v-model="form.rule_type">
              <el-option
                v-for="(item, index) in giftType"
                :key="item.rule_type"
                :label="$t(item.textKey)"
                :value="item.rule_type"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="form.rule_type == 'money'" :label="$t('4171686f.2b0313')">
            <el-input v-model="form.rule_data" style="width: 200px" />
          </el-form-item>
          <el-form-item v-show="form.rule_type == 'point'" :label="$t('4171686f.6d3bc6')">
            <el-input v-model="form.rule_data" style="width: 200px" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('4171686f.625fb2') }}</el-button>
        <el-button type="primary" @click="add">{{ $t('4171686f.38cf16') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  createRechargeRule,
  getRechargeRuleList,
  deleteRechargeRuleById,
  editRechargeRuleById
} from '../../../api/deposit'
export default {
  props: ['getStatus'],
  data() {
    return {
      loading: false,
      dialogVisible: false,
      pageSize: 20,
      editIndex: -1,
      form: {
        id: '',
        fixed_money: '',
        rule_type: 'money',
        rule_data: ''
      },
      dataList: [],
      giftType: [
        { id: 1, textKey: '4171686f.da5072', rule_type: 'money' },
        { id: 2, textKey: '4171686f.d81f65', rule_type: 'point' }
      ],
      rules: {
        fixed_money: [
          { required: true, message: () => this.$t('4171686f.5bf8a2'), trigger: 'blur' }
        ],
        rule_data: [{ required: true, message: () => this.$t('4171686f.b8ff00'), trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    getStatus(newVal, oldVal) {
      if (newVal) {
        this.getlist()
      }
    }
  },
  methods: {
    showDialog() {
      this.form.id = ''
      this.form.fixed_money = ''
      this.form.rule_data = ''
      if (this.dataList.length >= 14) {
        this.$message({ message: this.$t('4171686f.339154'), type: 'error' })
        return
      }
      this.dialogVisible = true
    },
    edit(row, index) {
      this.form.fixed_money = row.money
      this.form.rule_type = row.ruleType
      this.form.rule_data = row.ruleData
      this.form.id = row.id
      this.dialogVisible = true
    },
    remove(row, index) {
      deleteRechargeRuleById(row.id).then((res) => {
        this.$message({
          message: this.$t('4171686f.0007d1'),
          type: 'success',
          duration: 5 * 1000
        })
      })
      this.dataList.splice(index, 1)
    },
    getlist() {
      this.loading = true
      getRechargeRuleList().then((res) => {
        this.dataList = []
        for (var i in res.data.data.list) {
          this.dataList.push({
            id: res.data.data.list[i].id,
            money: res.data.data.list[i].money / 100,
            ruleType: res.data.data.list[i].ruleType,
            ruleData: res.data.data.list[i].ruleData
          })
        }
        this.loading = false
      })
    },
    add() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            editRechargeRuleById(this.form).then((res) => {
              this.$message({
                message: this.$t('4171686f.3b1083'),
                type: 'success',
                duration: 5 * 1000
              })
              this.getlist()
            })
          } else {
            createRechargeRule(this.form).then((res) => {
              this.$message({
                message: this.$t('4171686f.3b1083'),
                type: 'success',
                duration: 5 * 1000
              })
              this.getlist()
            })
          }
          this.dialogVisible = false
        }
      })
    },
    cancelAction() {
      this.dialogVisible = false
    }
  }
}
</script>
