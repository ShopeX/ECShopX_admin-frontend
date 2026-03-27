<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="addClassifyBox">
    <el-dialog :visible.sync="visible" :before-close="handleClose">
      <div slot="title" class="top">
        <template v-if="editInfo && editInfo.type == 'edit'">
          <span class="title">{{ $t('a9d59c48.55d793') }}</span>
        </template>
        <template v-else>
          <template v-if="!parent_name">
            <span class="title">{{ $t('a9d59c48.b6cb2b') }}</span>
            <span class="subtitle">{{ $t('a9d59c48.a776bc') }}</span>
          </template>
          <template v-else>
            <span class="title">{{ $t('a9d59c48.82537d') }}</span>
            <span class="subtitle">{{ $t('a9d59c48.8dda64') }}</span>
          </template>
        </template>
      </div>
      <div class="content">
        <el-form ref="form" :model="form" label-width="80px" class="form" :rules="rules">
          <el-form-item
            :label="!parent_name ? $t('a9d59c48.04d7d8') : $t('a9d59c48.047723')"
            prop="name"
          >
            <el-input v-model="form.name" class="input1" size="small" />
          </el-form-item>
          <el-form-item :label="$t('a9d59c48.afe561')" prop="is_show">
            <el-select
              v-model="form.is_show"
              class="input"
              :placeholder="$t('a9d59c48.708c9d')"
              size="small"
            >
              <el-option :label="$t('a9d59c48.0a60ac')" value="1">
                {{ $t('a9d59c48.0a60ac') }}
              </el-option>
              <el-option :label="$t('a9d59c48.c9744f')" value="0">
                {{ $t('a9d59c48.c9744f') }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('a9d59c48.53eb44')">
            <el-input-number
              v-model="form.sort"
              class="input"
              type="number"
              size="small"
              :min="0"
            />
          </el-form-item>
          <el-form-item v-if="parent_name" :label="$t('a9d59c48.75b228')">
            <el-input v-model="parent_name" class="input1" disabled size="small" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">{{ $t('a9d59c48.c08ab9') }}</el-button>
        <el-button size="small" type="primary" @click="fnConfirm('form')">{{
          $t('a9d59c48.aa7527')
        }}</el-button>
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
  data() {
    return {
      form: {
        name: '',
        is_show: '1',
        sort: 0
      }
    }
  },
  computed: {
    rules() {
      return {
        name: [requiredRules(this.$t('a9d59c48.d7ec2d'))],
        is_show: requiredRules(this.$t('a9d59c48.afe561'), 'change')
      }
    }
  },
  mounted() {
    if (this.editInfo && this.editInfo.type == 'edit') {
      const { name, is_show, sort } = this.editInfo
      this.form.name = name
      this.form.is_show = is_show
      this.form.sort = sort
    }
  },
  methods: {
    fnConfirm(formName) {
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
    handleClose() {
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
