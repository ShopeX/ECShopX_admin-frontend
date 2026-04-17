<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section section-white">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-button type="primary" icon="plus" @click="handleEditWeapp">
          {{ $t('bba767c5.512e5d') }}
        </el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="list"
      style="width: 100%"
      :element-loading-text="$t('bba767c5.f09b12')"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="主体名称：">
              <span>{{ props.row.principal_name }}</span>
            </el-form-item>
            <el-form-item label="模版：">
              <span v-if="props.row.weappTemplate.name">{{ props.row.weappTemplate.name }}</span>
              <span v-else>未绑定小程序</span>
            </el-form-item>
            <el-form-item label="线上版本：">
              <span
                v-if="
                  props.row.weappTemplate.version &&
                  props.row.weappTemplate.version == props.row.weapp.release_ver
                "
                >最新版本</span
              >
              <span v-else-if="props.row.weapp.release_ver">{{ props.row.weapp.release_ver }}</span>
              <span v-else>无</span>
            </el-form-item>
            <el-form-item
              v-if="props.row.weapp.reason && props.row.weapp.audit_status == '1'"
              label="审核失败原因："
            >
              <span>{{ props.row.weapp.reason }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column :label="$t('bba767c5.75688e')" width="120">
        <template slot-scope="img">
          <div v-if="img.row.head_img">
            <img :src="img.row.head_img" height="60" />
          </div>
          <div v-else>
            <i class="el-icon-picture fa-3x" aria-hidden="true" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="authorizer_appid" :label="$t('bba767c5.d70fe9')" />
      <el-table-column prop="nick_name" :label="$t('bba767c5.d34f1f')">
        <template slot-scope="scope_name">
          <div v-if="scope_name.row.nick_name">
            {{ scope_name.row.nick_name }}
          </div>
          <div v-else>{{ $t('bba767c5.fe2d26') }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="weappTemplate.name" :label="$t('bba767c5.1917d3')" />
      <el-table-column :label="$t('bba767c5.869efb')">
        <template slot-scope="verify_type_info">
          <el-tag v-if="verify_type_info.row.weapp.release_status == '1'" type="success">
            {{ $t('bba767c5.2390fa') }}
          </el-tag>

          <el-tag v-if="verify_type_info.row.weapp.audit_status == '1'" type="gray">
            {{ $t('bba767c5.fe3661') }}
          </el-tag>
          <!--审核成功并且已经上架则不需要显示-->
          <el-tag
            v-else-if="
              verify_type_info.row.weapp.audit_status == '0' &&
              verify_type_info.row.weapp.release_status != '1'
            "
            type="success"
          >
            {{ $t('bba767c5.94129a') }}
          </el-tag>
          <el-tag v-else-if="verify_type_info.row.weapp.audit_status == '2'" type="primary">
            {{ $t('bba767c5.b720a6') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('bba767c5.2b6bc0')" width="200px">
        <template slot-scope="scope">
          <el-button circle type="primary" icon="el-icon-edit" @click="handleUpdate(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="$t(dialogTitleWeapp)"
      :visible.sync="editWxaVisible"
      :before-close="handleEditWeappCancel"
    >
      <el-form ref="weappForm" :model="weappForm" label-position="left" label-width="180px">
        <div class="section-body">
          <el-form-item :label="$t('bba767c5.0d425f')">
            <el-select v-model="weappForm.template_name" :placeholder="$t('bba767c5.9c2e12')">
              <el-option
                v-for="(item, index) in templateList"
                :key="index"
                :label="item.tag"
                :value="item.key_name"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('bba767c5.79e85e')">
            <el-col :span="18">
              <el-input v-model="weappForm.nick_name" :placeholder="$t('bba767c5.7437cc')" />
            </el-col>
          </el-form-item>
          <el-form-item label="appid：">
            <el-col :span="18">
              <el-input v-model="weappForm.authorizer_appid" :placeholder="$t('bba767c5.f14601')" />
            </el-col>
          </el-form-item>
          <el-form-item label="appsecret：">
            <el-col :span="18">
              <el-input
                v-model="weappForm.authorizer_appsecret"
                :placeholder="$t('bba767c5.ede01a')"
                show-password
              />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('bba767c5.d50394')">
            <el-col :span="18">
              <el-input v-model="weappForm.signature" :placeholder="$t('bba767c5.7efb18')" />
            </el-col>
          </el-form-item>
        </div>
        <div class="section-footer with-border content-center">
          <el-button type="primary" @click="handleSubmitWxapp">
            {{ $t('bba767c5.56df61') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog
      :title="$t(dialogTitle)"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="55%"
    >
      <el-form label-width="100px">
        <el-form-item label="名称：">
          <!-- <el-input v-model="updateRow.nick_name" placeholder=""></el-input> -->
          <span>{{ updateRow.nick_name }}</span>
        </el-form-item>
        <el-form-item label="appid：">
          <!-- <el-input v-model="updateRow.authorizer_appid" placeholder=""></el-input> -->
          <span>{{ updateRow.authorizer_appid }}</span>
        </el-form-item>
        <!--       <el-form-item label="小程序模板">
        <el-input v-model="updateRow.nick_name" placeholder=""></el-input>
      </el-form-item> -->
        <el-form-item label="appsecret：">
          <el-col :span="13">
            <el-input
              v-model="updateRow.authorizer_appsecret"
              :placeholder="$t('bba767c5.ede01a')"
              show-password
            />
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t('bba767c5.c08ab9') }}</el-button>
        <el-button type="primary" @click="handleUpdateSubmit">{{
          $t('bba767c5.aa7527')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getTemplateList, templateList } from '@/api/template'
import { getWxaAuthList, submitWxa, configSubmitHandle, addWxapp } from '../../../api/wxa'
export default {
  data() {
    return {
      loading: false,
      templateName: '',
      editWxaVisible: false,
      dialogTitleWeapp: 'bba767c5.1880be',
      weappForm: {
        auto_publish: '',
        nick_name: '',
        authorizer_appid: '',
        authorizer_appsecret: '',
        signature: ''
      },
      submitWeappForm: {
        wxaAppId: '',
        templateName: '',
        wxa_name: ''
      },
      templateList: [],
      list: [],
      dialogTitle: 'bba767c5.1880be',
      dialogVisible: false,
      updateRow: {}
    }
  },
  mounted() {
    this.getWxaList()
    templateList().then((response) => {
      var res = response.data.data.list
      res.forEach((item) => {
        console.log(item)
        if (item.key_name == 'yykweishop') {
          this.templateList.push(item)
        }
      })
    })
  },
  methods: {
    getWxaList() {
      this.loading = true
      getWxaAuthList().then((response) => {
        this.list = response.data.data.list
        this.loading = false
      })
    },
    handleEditWeapp() {
      this.editWxaVisible = true
    },
    handleEditWeappCancel() {
      this.editWxaVisible = false
      this.weappForm = {}
    },
    handleSubmitWxapp() {
      addWxapp(this.weappForm).then((response) => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 2 * 1000
        })
        this.handleClose()
        this.editWxaVisible = false
        this.getWxaList()
      })
    },
    handleUpdate(row) {
      this.dialogVisible = true
      this.updateRow = Object.assign({}, row)
      this.dialogTitle = '修改小程序'
    },
    handleClose() {
      this.updateRow = {}
      this.dialogVisible = false
    },
    handleUpdateSubmit() {
      let params = { authorizer_appsecret: this.updateRow.authorizer_appsecret }
      configSubmitHandle(this.updateRow.authorizer_appid, params).then((response) => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 2 * 1000
        })
        this.handleClose()
      })
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 10px;
  .frm-tips {
    color: #8d8d8d;
  }
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.wxa-select {
  padding: 0 25px 25px;
}
.webchat-box {
  padding: 10px 0;
}
</style>
