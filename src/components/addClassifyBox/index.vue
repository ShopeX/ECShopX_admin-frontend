/* 新增分类弹框 */
<template>
  <div class="addClassifyBox">
    <el-dialog
      :visible.sync="visible"
      :before-close="handleClose"
    >
      <div
        slot="title"
        class="top"
      >
        <template v-if="editInfo && editInfo.type == 'edit'">
          <span class="title">编辑分类</span>
        </template>
        <template v-else>
          <template v-if="!parent_name">
            <span class="title">新增分类</span>
            <span class="subtitle">商户类型，例：贸易类</span>
          </template>
          <template v-else>
            <span class="title">新增子类</span>
            <span class="subtitle">经营范围，例：五金交电</span>
          </template>
        </template>
      </div>
      <div class="content">
        <el-form
          ref="form"
          :model="form"
          label-width="80px"
          class="form"
          :rules="rules"
        >
          <el-form-item
            :label="!parent_name ? '分类名称' : '子类名称'"
            prop="name"
          >
            <el-input
              v-model="form.name"
              class="input1"
              size="small"
            />
          </el-form-item>
          <el-form-item
            label="是否可见"
            prop="is_show"
          >
            <el-select
              v-model="form.is_show"
              class="input"
              placeholder="请选择"
              size="small"
            >
              <el-option
                label="是"
                value="1"
              >
                是
              </el-option>
              <el-option
                label="否"
                value="0"
              >
                否
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分类排序">
            <el-input-number
              v-model="form.sort"
              class="input"
              type="number"
              size="small"
              :min="0"
            />
          </el-form-item>
          <el-form-item
            v-if="parent_name"
            label="父类名称"
          >
            <el-input
              v-model="parent_name"
              class="input1"
              disabled
              size="small"
            />
          </el-form-item>
        </el-form>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="small"
          @click="handleClose"
        >取 消</el-button>
        <el-button
          size="small"
          type="primary"
          @click="fnConfirm('form')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { MaxRules, requiredRules } from '@/view/base/setting/dealer/tools'
export default {
  props: {
    visible: {
      type: Boolean
    },
    parent_id: {
      default: 0
    },
    parent_name: {
      type: String
    },
    editInfo: {
      default: null
    }
  },
  data () {
    return {
      form: {
        name: '',
        is_show: '1',
        sort: 0
      },
      rules: {
        name: [requiredRules('名称')],
        is_show: requiredRules('是否可见', 'change')
      }
    }
  },
  mounted () {
    if (this.editInfo && this.editInfo.type == 'edit') {
      const { name, is_show, sort } = this.editInfo
      this.form.name = name
      this.form.is_show = is_show
      this.form.sort = sort
    }
  },
  methods: {
    fnConfirm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.$emit(
            'callbackConfirm',
            { ...this.form, parent_id: this.parent_id },
            this.editInfo && this.editInfo.type
          )
        }
      })
    },
    handleClose () {
      this.$emit('switchBoxHandle', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.addClassifyBox {
  .title {
    font-size: 16px;
    margin-right: 20px;
  }
  .subtitle {
    font-size: 12px;
  }
  .input1 {
    width: 300px;
  }
  .input {
    width: 150px;
  }
}
</style>

<style lang="scss">
.addClassifyBox {
  .el-form-item {
    margin-bottom: 14px;
  }
  .el-dialog__header {
    border-bottom: 1px solid #ccc;
  }
  .el-dialog__footer {
    border-top: 1px solid #ccc;
  }
  .el-dialog {
    width: 500px;
  }
}
</style>
