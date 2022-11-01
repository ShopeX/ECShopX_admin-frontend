<template>
  <div class="section-white content-padded">
    <div class="content-bottom-padded">
      <el-button
        type="primary"
        @click="showDialog"
      >
        添加面额({{ dataList.length }}/14)
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="dataList"
      :height="wheight - 200"
    >
      <el-table-column
        prop="money"
        label="固定面额数(元)"
      />
      <el-table-column label="赠送">
        <template slot-scope="scope">
          <span v-if="scope.row.ruleType == 'money'">充值送钱</span>
          <span v-if="scope.row.ruleType == 'point'">充值送积分</span>
        </template>
      </el-table-column>
      <el-table-column label="赠送说明">
        <template slot-scope="scope">
          <span
            v-if="scope.row.ruleType == 'money'"
          >充值{{ scope.row.money }}元送{{ scope.row.ruleData }}元</span>
          <span
            v-if="scope.row.ruleType == 'point'"
          >充值{{ scope.row.money }}元送{{ scope.row.ruleData }}积分</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <a
            href="#"
            @click="edit(scope.row, scope.$index)"
          >编辑</a>
          <a
            href="#"
            @click="remove(scope.row, scope.$index)"
          >删除</a>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="添加面额"
      :visible="dialogVisible"
      :close-on-click-modal="false"
      :before-close="cancelAction"
    >
      <div>
        <el-form
          ref="form"
          :rules="rules"
          :model="form"
          label-width="120px"
        >
          <el-form-item
            label="固定面额数(元)"
            prop="fixed_money"
          >
            <el-input
              v-model="form.fixed_money"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item label="赠送">
            <el-select v-model="form.rule_type">
              <el-option
                v-for="(item, index) in giftType"
                :key="item.rule_type"
                :label="item.text"
                :value="item.rule_type"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-show="form.rule_type == 'money'"
            label="赠送金额(元)"
          >
            <el-input
              v-model="form.rule_data"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item
            v-show="form.rule_type == 'point'"
            label="赠送积分(分)"
          >
            <el-input
              v-model="form.rule_data"
              style="width: 200px"
            />
          </el-form-item>
        </el-form>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="add"
        >
          确定
        </el-button>
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
  data () {
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
        { id: 1, text: '充值送钱', rule_type: 'money' },
        { id: 2, text: '充值送积分', rule_type: 'point' }
      ],
      rules: {
        fixed_money: [{ required: true, message: '请输入固定面额数', trigger: 'blur' }],
        rule_data: [{ required: true, message: '请输入赠送金额', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    getStatus (newVal, oldVal) {
      if (newVal) {
        this.getlist()
      }
    }
  },
  methods: {
    showDialog () {
      this.form.id = ''
      this.form.fixed_money = ''
      this.form.rule_data = ''
      if (this.dataList.length >= 14) {
        this.$message({ message: '最多添加14个面额', type: 'error' })
        return
      }
      this.dialogVisible = true
    },
    edit (row, index) {
      this.form.fixed_money = row.money
      this.form.rule_type = row.ruleType
      this.form.rule_data = row.ruleData
      this.form.id = row.id
      this.dialogVisible = true
    },
    remove (row, index) {
      deleteRechargeRuleById(row.id).then((res) => {
        this.$message({
          message: '删除成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
      this.dataList.splice(index, 1)
    },
    getlist () {
      this.loading = true
      getRechargeRuleList().then((res) => {
        this.dataList = []
        for (var i in res.data.data.list) {
          this.dataList.push({
            'id': res.data.data.list[i].id,
            'money': res.data.data.list[i].money / 100,
            'ruleType': res.data.data.list[i].ruleType,
            'ruleData': res.data.data.list[i].ruleData
          })
        }
        this.loading = false
      })
    },
    add () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            editRechargeRuleById(this.form).then((res) => {
              this.$message({
                message: '保存成功',
                type: 'success',
                duration: 5 * 1000
              })
              this.getlist()
            })
          } else {
            createRechargeRule(this.form).then((res) => {
              this.$message({
                message: '保存成功',
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
    cancelAction () {
      this.dialogVisible = false
    }
  }
}
</script>
