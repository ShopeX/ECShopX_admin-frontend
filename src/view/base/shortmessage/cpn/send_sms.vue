<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <div class="alisms_sendSms">
    <tips>
      <ul>
        根据场景配置好短信，用户进入对应场景时即可触发系统发送对应给用户，支持短信验证码，订单通知，快递提醒等场景。
        <li>· 一条完整的短信由「签名+模板」组成。</li>
        <li>· 每一个场景只能启用一条模板。</li>
      </ul>
    </tips>
    <div class="list">
      <div class="serch">
        <el-select
          v-model="query.scene_name"
          clearable
          filterable
          placeholder="请选择"
          @change="onChangeSceneList"
        >
          <el-option
            v-for="(item, index) in templateList"
            :key="`template-item__${index}`"
            :label="item.scene_name"
            :value="item.scene_name"
          />
        </el-select>
      </div>
      <section v-for="item in smsScenarioList" :key="item.id" class="card">
        <nav>
          <h4>短信场景：{{ item.scene_name }}</h4>
          <div class="type">短信类型：{{ item.template_type }}</div>
          <div class="btn">
            <el-button
              v-if="item.itemList.length < 3"
              size="small"
              type="primary"
              @click="fnAddSms(item.id, item.scene_name)"
            >
              添加短信
            </el-button>
          </div>
        </nav>
        <el-table :data="item.itemList" style="width: 100%" border>
          <el-table-column prop="sign_name" label="签名" width="240" />
          <el-table-column prop="template_content" label="模板" />
          <el-table-column prop="status" label="状态" width="180">
            <template slot-scope="scope">
              <div v-if="scope.row.status == '0'" class="fail">未启用</div>
              <div v-if="scope.row.status == '1'" class="success">已启用</div>
            </template>
          </el-table-column>
          <el-table-column prop="sign_name" label="操作" width="140">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="deteleSms(scope.row.id, item.scene_name)">
                移除
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="
                  fnDisablingSms(
                    scope.row.id,
                    scope.row.status == '0' ? true : false,
                    item.scene_name
                  )
                "
              >
                {{ scope.row.status == '0' ? '启用' : '停用' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </section>
    </div>
    <!-- 添加短信 -->
    <el-dialog title="添加短信" :visible="visible" width="30%" :before-close="handleClose">
      <el-form ref="form" :model="form" :rules="rules" label-width="60px">
        <el-form-item label="签名" prop="sign_id">
          <el-select
            v-model="form.sign_id"
            v-scroll="() => pagesSmsSignatureQuery.nextPage()"
            filterable
            reserve-keyword
            placeholder="输入签名名称搜索"
            style="width: 95%"
          >
            <el-option
              v-for="item in SmsSignatureList"
              :key="`signa-item__${item.id}`"
              :label="item.sign_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="模板" prop="template_id">
          <el-select
            v-model="form.template_id"
            v-scroll="() => pagesSmsTemplateQuery.nextPage()"
            filterable
            remote
            reserve-keyword
            placeholder="输入模板名称搜索"
            style="width: 95%"
          >
            <el-option
              v-for="item in SmsTemplateList"
              :key="`template-item__${item.id}`"
              :label="item.template_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="fnPass('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tips from '@/components/tips'
import { requiredRules } from '@/utils/validate'
import Pages from '@/utils/pages'
import {
  offDisablingSms,
  onDisablingSms,
  deletedDisablingSms,
  getSmsSignatureList,
  getSmsTemplateList,
  addSceneItem
} from '@/api/sms'

export default {
  components: {
    tips
  },
  data() {
    return {
      smsScenarioList: [],
      query: {
        scene_name: ''
      },
      count: 24,
      loading: false,
      serchNameList: [],
      //
      visible: false,
      form: {
        scene_id: '',
        sign_id: '',
        template_id: ''
      },
      SmsSignatureList: [], //短信签名
      SmsTemplateList: [], //短信模板
      activeScene_name: '',
      rules: {
        sign_id: [requiredRules('签名', 'change')],
        template_id: [requiredRules('模板', 'change')]
      },
      templateList: []
    }
  },
  created() {
    this.querySearch()

    this.pagesSmsSignatureQuery = new Pages({
      pageSize: 10,
      fetch: this.getSMSSignatureList
    }).nextPage()

    this.pagesSmsTemplateQuery = new Pages({
      pageSize: 10,
      fetch: this.getSMSTemplateList
    }).nextPage()
  },
  mounted() {
    this.getScenarioList()
  },
  methods: {
    async getScenarioList() {
      this.loading = true
      let params = {
        pageSize: 100,
        page: 1
      }
      if (this.query.scene_name) {
        params['scene_name'] = this.query.scene_name
      }
      const { list } = await this.$api.sms.getScenarioList(this.query)
      this.loading = false
      this.smsScenarioList = list
    },
    // 添加短信
    async fnAddSms(id, scene_name) {
      this.visible = true
      this.activeScene_name = scene_name
      // 获取选项
      this.form.scene_id = id
    },
    async getSMSTemplateList({ page, pageSize }) {
      const { list, total_count } = await this.$api.sms.getSmsTemplateList({
        params: { status: '1', scene_id: this.form.scene_id },
        page,
        pageSize
      })
      this.pagesSmsSignatureQuery.setTotal(total_count)
      this.SmsTemplateList = this.SmsTemplateList.concat(list)
    },
    async getSMSSignatureList({ page, pageSize }) {
      const { list, total_count } = await this.$api.sms.getSmsSignatureList({
        params: { status: '1' },
        page,
        pageSize
      })
      this.pagesSmsSignatureQuery.setTotal(total_count)
      this.SmsSignatureList = this.SmsSignatureList.concat(list)
    },
    fnPass(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          await addSceneItem(this.form)
          this.$message.success('添加成功')
          this.activeScene_name = ''
          this.handleClose()
          this.getScenarioList()
        }
      })
    },
    handleClose() {
      this.visible = false
      this.$refs['form'].resetFields()
    },
    // 停用/启用/删除
    fnDisablingSms(id, flag, scene_name) {
      const message = flag
        ? '每个场景仅可启用一条短信。启用后，该短信将作为当前场景短信使用。'
        : '停用后当前场景将不会触发短信；您仍可启用其他短信作为当前场景短信使用。'
      this.$confirm(message, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (flag) {
          //启用
          await onDisablingSms({ id })
          this.$message.success('已启用')
          this.getScenarioList()
        } else {
          await offDisablingSms({ id })
          this.$message.success('已停用')
          this.getScenarioList()
        }
      })
    },

    async deteleSms(id, scene_name) {
      const message =
        '移除后，该短信将不在当前场景。如果移除的是已启用的短信，移除后当前场景可不会触发短信。'
      this.$confirm(message, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await deletedDisablingSms(id)
        this.getScenarioList()
        this.$message.success('删除成功')
      })
    },
    onChangeSceneList() {
      this.getScenarioList()
    },
    async querySearch() {
      const { list } = await this.$api.sms.getScenarioList({
        pageSize: 100,
        page: 1
      })
      this.templateList = list
    }
  }
}
</script>

<style lang="scss" scoped>
.alisms_sendSms {
  .serch {
    // text-align: center;
    margin: 20px 0 10px 0;
  }
  .list {
    overflow: auto;
    // height: 500px;
    height: calc(100vh - 240px);
    padding-bottom: 100px;
    section {
      padding: 20px 30px;
      margin: 20px 3px 20px;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);

      nav {
        display: flex;
        align-items: center;
        color: #000;
        font-size: 14px;
        h4 {
          flex: 2;
          position: relative;
          color: #000;

          &::before {
            position: absolute;
            width: 4px;
            content: '';
            background: #1480e3;
            left: -8px;
            top: 4px;
            bottom: 4px;
          }
        }
        .type {
          flex: 1;
        }
        .btn {
          text-align: right;
          flex: 3;
        }
      }
      .success {
        position: relative;
        margin-left: 20px;
        &::before {
          width: 12px;
          height: 12px;
          content: '';
          position: absolute;
          top: 5px;
          left: -15px;
          background: #ddd;
          border-radius: 50%;
          background: #67c23a;
        }
      }
      .fail {
        position: relative;
        margin-left: 20px;
        &::before {
          width: 12px;
          height: 12px;
          content: '';
          position: absolute;
          top: 5px;
          left: -15px;
          background: #ddd;
          border-radius: 50%;
        }
      }
    }
    .footer {
      width: 100%;
      text-align: center;
    }
  }
}
</style>

<style lang="scss">
.alisms_sendSms {
  .el-form {
    width: 80%;
  }
  .el-dialog {
    min-width: 540px;
  }
  .el-dialog__body {
    display: flex;
    justify-content: center;
  }
  .el-table {
    margin: 20px 0;
    th {
      background: aliceblue;
    }
  }
}
</style>
