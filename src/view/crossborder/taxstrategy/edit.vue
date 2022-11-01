<template>
  <div class="section section-white">
    <el-form
      ref="form"
      :model="form"
      label-width="auto"
      label-position="left"
      class="demo-ruleForm"
    >
      <el-card
        v-loading="loader"
        shadow="never"
        header="税费策略"
      >
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
        >
          <el-form-item label="规则名称">
            <el-input
              v-model="form.taxstrategy_name"
              :maxlength="30"
              placeholder="请输入内容"
            />
          </el-form-item>
        </el-col>

        <el-col
          :xs="24"
          :sm="24"
          :md="24"
        >
          <el-button
            type="primary"
            @click="addRule"
          >
            添加规则
          </el-button>
          <div style="height: 20px" />
          <div v-for="(row, key) in form.taxstrategy_content">
            <el-form-item label="规则">
              <div style="display: flex">
                {{ key + 1 }}
                <el-input-number
                  v-model="row.start"
                  style="margin: 0 5px"
                  controls-position="right"
                  :controls="false"
                  :precision="2"
                  :step="0.1"
                  :min="0"
                />
                —
                <el-input-number
                  v-model="row.end"
                  style="margin: 0 5px"
                  controls-position="right"
                  :controls="false"
                  :precision="2"
                  :step="0.1"
                  :min="0"
                />
                元，税率
                <el-input-number
                  v-model="row.tax_rate"
                  style="margin: 0 5px"
                  controls-position="right"
                  :controls="false"
                  :precision="2"
                  :step="0.1"
                  :min="0"
                  :max="100"
                />
                %
                <el-button
                  v-if="key !== 0"
                  style="margin-left: 50px"
                  type="danger"
                  @click="delRule(key)"
                >
                  删除
                </el-button>
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-card>

      <div class="section-footer with-border content-center">
        <!--        <el-button @click.native="handleCancel">取消</el-button>-->
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="save"
        >
          {{
            submitLoading ? '提交中' : '保存'
          }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { addTaxstrategy, updateTaxstrategy, getTaxstrategyInfo } from '../../../api/crossborder'

export default {
  inject: ['refresh'],
  components: {},

  data () {
    return {
      taxstrategy_id: '',
      submitLoading: false,
      loader: false,
      // 提交数据
      form: {
        taxstrategy_name: '',
        taxstrategy_content: []
      },
      // 列表数据
      list: []
    }
  },
  mounted () {
    // 判断添加还是修复
    if (this.$route.params.id === undefined) {
      console.log('添加')
      this.initData()
    } else {
      console.log('修改')
      this.taxstrategy_id = this.$route.params.id
      this.getInfo()
    }
  },
  methods: {
    // 初始化数据（添加）
    initData () {
      this.form = {
        taxstrategy_name: '',
        taxstrategy_content: [{ start: 0, end: 0, tax_rate: 0 }]
      }
    },
    // 获取数据
    getInfo () {
      this.submitLoading = true
      this.loader = true
      getTaxstrategyInfo(this.taxstrategy_id, {}).then((res) => {
        this.submitLoading = false
        this.loader = false
        this.form = {
          taxstrategy_name: res.data.data.taxstrategy_name,
          taxstrategy_content: res.data.data.taxstrategy_content
        }
      })
    },
    // 添加规则
    addRule () {
      let sum = 10
      if (this.form.taxstrategy_content.length < sum) {
        this.form.taxstrategy_content.push({ start: 0, end: 0, tax_rate: 0 })
      } else {
        this.$message({ type: 'error', message: `最多添加${sum}条规则` })
      }
    },
    // 删除规则
    delRule (key) {
      this.form.taxstrategy_content.splice(key, 1)
    },
    // 保存
    save () {
      this.submitLoading = true
      this.loader = true
      if (this.taxstrategy_id !== '') {
        this.isUpdate()
      } else {
        this.isAdd()
      }
    },
    // 添加
    isAdd () {
      const _this = this
      const _taxContent = []
      this.form.taxstrategy_content.forEach((item) => {
        _taxContent.push(JSON.stringify(item))
      })
      addTaxstrategy({
        ...this.form,
        taxstrategy_content: _taxContent
      }).then((res) => {
        this.$message({ type: 'success', message: '操作成功' })
        this.submitLoading = false
        this.loader = false
        _this.refresh()
        this.$router.go(-1)
      })
    },
    // 修改
    isUpdate () {
      const _this = this
      const _taxContent = []
      this.form.taxstrategy_content.forEach((item) => {
        _taxContent.push(JSON.stringify(item))
      })
      updateTaxstrategy(this.taxstrategy_id, {
        ...this.form,
        taxstrategy_content: _taxContent
      }).then((res) => {
        this.$message({ type: 'success', message: '操作成功' })
        this.submitLoading = false
        this.loader = false
        _this.refresh()
        this.$router.go(-1)
      })
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  }
}
</script>
<style scoped lang="scss">
.upload-box {
  width: 100px;
  height: 100px;

  .avatar-uploader-icon {
    line-height: 100px;
  }
}
</style>
