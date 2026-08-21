<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="alisms_sendSms">
    <tips>
      <ul>
        {{
          $t('e00a2569.bd8455')
        }}
        <li>{{ $t('e00a2569.05522f') }}</li>
        <li>{{ $t('e00a2569.b99f90') }}</li>
      </ul>
    </tips>
    <div class="list">
      <div class="serch">
        <el-select
          v-model="query.scene_name"
          clearable
          filterable
          :placeholder="$t('e00a2569.708c9d')"
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
          <h4>{{ $t('e00a2569.93fec5') }}{{ item.scene_name }}</h4>
          <div class="type">{{ $t('e00a2569.98cf61') }}{{ item.template_type }}</div>
          <div class="btn">
            <el-button
              v-if="item.itemList.length < 3"
              type="primary"
              @click="fnAddSms(item.id, item.scene_name)"
            >
              {{ $t('e00a2569.b81ac1') }}
            </el-button>
          </div>
        </nav>
        <el-table :data="item.itemList" style="width: 100%" border>
          <el-table-column prop="sign_name" :label="$t('e00a2569.be2525')" width="240" />
          <el-table-column prop="template_content" :label="$t('e00a2569.59cf15')" />
          <el-table-column prop="status" :label="$t('e00a2569.3fea7c')" width="180">
            <template slot-scope="scope">
              <div v-if="scope.row.status == '0'" class="fail">{{ $t('e00a2569.463776') }}</div>
              <div v-if="scope.row.status == '1'" class="success">{{ $t('e00a2569.53ace4') }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="sign_name" :label="$t('e00a2569.2b6bc0')" width="140">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="deteleSms(scope.row.id, item.scene_name)">
                {{ $t('e00a2569.86048b') }}
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
                {{ scope.row.status == '0' ? $t('e00a2569.7854b5') : $t('e00a2569.5c56a8') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </section>
    </div>
    <!-- 添加短信 -->
    <el-dialog
      :title="$t('e00a2569.b81ac1')"
      :visible="visible"
      width="30%"
      :before-close="handleClose"
    >
      <SpFormPlus
        ref="form"
        v-model="form"
        :form-items="formItems"
        :show-default-actions="false"
        form-type="form"
        label-width="60px"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t('e00a2569.c08ab9') }}</el-button>
        <el-button type="primary" @click="fnPass">{{ $t('e00a2569.aa7527') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tips from '@/components/tips'
import SpFormPlus from '@/components/sp-form-plus'
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
    tips,
    SpFormPlus
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
      templateList: []
    }
  },
  computed: {
    formItems() {
      return [
        {
          fieldName: 'sign_id',
          label: this.$t('e00a2569.be2525'),
          component: ({ h, value, onInput }) => {
            return h(
              'el-select',
              {
                props: {
                  value: value,
                  filterable: true,
                  'reserve-keyword': true,
                  placeholder: this.$t('e00a2569.46e70c')
                },
                style: { width: '95%' },
                directives: [
                  {
                    name: 'scroll',
                    value: () => this.pagesSmsSignatureQuery.nextPage()
                  }
                ],
                on: {
                  input: onInput
                }
              },
              [
                this.SmsSignatureList.map((item) =>
                  h('el-option', {
                    key: `signa-item__${item.id}`,
                    props: {
                      label: item.sign_name,
                      value: item.id
                    }
                  })
                )
              ]
            )
          },
          rules: [requiredRules(this.$t('e00a2569.be2525'), 'change')]
        },
        {
          fieldName: 'template_id',
          label: this.$t('e00a2569.59cf15'),
          component: ({ h, value, onInput }) => {
            return h(
              'el-select',
              {
                props: {
                  value: value,
                  filterable: true,
                  remote: true,
                  'reserve-keyword': true,
                  placeholder: this.$t('e00a2569.6d185e')
                },
                style: { width: '95%' },
                directives: [
                  {
                    name: 'scroll',
                    value: () => this.pagesSmsTemplateQuery.nextPage()
                  }
                ],
                on: {
                  input: onInput
                }
              },
              [
                this.SmsTemplateList.map((item) =>
                  h('el-option', {
                    key: `template-item__${item.id}`,
                    props: {
                      label: item.template_name,
                      value: item.id
                    }
                  })
                )
              ]
            )
          },
          rules: [requiredRules(this.$t('e00a2569.59cf15'), 'change')]
        }
      ]
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
        params: { status: '1', scene_id: this.form.scene_id, scene_id_assigned: '1' },
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
    async fnPass() {
      try {
        await this.$refs.form.validate()
        await addSceneItem(this.form)
        this.$message.success(this.$t('e00a2569.3fdaea'))
        this.activeScene_name = ''
        this.handleClose()
        this.getScenarioList()
      } catch (error) {
        // 验证失败，不处理
      }
    },
    handleClose() {
      this.visible = false
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
    },
    // 停用/启用/删除
    fnDisablingSms(id, flag, scene_name) {
      const message = flag ? this.$t('e00a2569.3eb749') : this.$t('e00a2569.198ae1')
      this.$confirm(message, '', {
        confirmButtonText: this.$t('e00a2569.38cf16'),
        cancelButtonText: this.$t('e00a2569.625fb2'),
        type: 'warning'
      }).then(async () => {
        if (flag) {
          //启用
          await onDisablingSms({ id })
          this.$message.success(this.$t('e00a2569.53ace4'))
          this.getScenarioList()
        } else {
          await offDisablingSms({ id })
          this.$message.success(this.$t('e00a2569.69b0f6'))
          this.getScenarioList()
        }
      })
    },

    async deteleSms(id, scene_name) {
      const message = this.$t('e00a2569.dd4559')
      this.$confirm(message, '', {
        confirmButtonText: this.$t('e00a2569.38cf16'),
        cancelButtonText: this.$t('e00a2569.625fb2'),
        type: 'warning'
      }).then(async () => {
        await deletedDisablingSms(id)
        this.getScenarioList()
        this.$message.success(this.$t('e00a2569.0007d1'))
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
