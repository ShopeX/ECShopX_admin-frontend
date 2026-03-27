<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div class="alisms_baseConfig">
      <tips>
        <p>
          {{ $t('8cc9220c.26cd59')
          }}<a
            href="https://www.aliyun.com/product/sms?spm=a2c4g.11186623.0.0.659712cdoHMKdV"
            target="_blank"
            >{{ $t('8cc9220c.57a9aa') }}</a
          >
        </p>
      </tips>
      <el-form label-width="200px" :model="form">
        <section class="card">
          <nav>
            <el-form-item :label="$t('8cc9220c.9e44e3')" label-width="60px">
              <el-switch
                v-model="info.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                style="margin-left: 40px; margin-right: 20px"
                @change="fnSwitch"
              />
              <span v-if="info.status">{{ $t('8cc9220c.53ace4') }}</span>
              <span v-else>{{ $t('8cc9220c.463776') }}</span>
            </el-form-item>
          </nav>
          <div class="content">
            <div class="title">{{ $t('8cc9220c.b6453a') }}</div>
            <div class="info">
              <div class="left">
                <el-form-item label="AccessKey ID：">
                  <span>{{ form.accesskey_id }}</span>
                </el-form-item>
                <el-form-item label="AccessKey Secret：">
                  <span>{{ form.accesskey_secret }}</span>
                </el-form-item>

                <a href="https://help.aliyun.com/document_detail/53045.html" target="_blank">{{
                  $t('8cc9220c.81fbaa')
                }}</a>
              </div>
              <div class="right">
                <el-button type="primary" class="btn" plain @click="fnEdit">
{{
                  $t('8cc9220c.95b351')
                }}
</el-button>
              </div>
            </div>
          </div>
        </section>
        <section v-for="item in cardData" :key="item.titleKey" class="card">
          <div class="content">
            <div class="title">
              {{ $t(item.titleKey) }}
            </div>
            <div class="info">
              <div class="left">
                <el-form-item :label="$t(item.infoKey)">
                  <span>{{ info[item.label] || 0 }}</span>
                </el-form-item>
              </div>
              <div class="right">
                <el-button type="primary" class="btn" plain @click="fnGo(item.tabName)">
                  {{ $t(item.btnKey) }}
                </el-button>
              </div>
            </div>
          </div>
        </section>
      </el-form>
      <!-- 添加短信 -->

      <el-dialog
        :title="$t('8cc9220c.40d841')"
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
          label-width="140px"
        />
        <div style="margin-top: 10px">
          <a href="https://help.aliyun.com/document_detail/53045.html" target="_blank">{{
            $t('8cc9220c.81fbaa')
          }}</a>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">{{ $t('8cc9220c.c08ab9') }}</el-button>
          <el-button type="primary" @click="fnPass">{{ $t('8cc9220c.aa7527') }}</el-button>
        </span>
      </el-dialog>
    </div>
  </SpPage>
</template>

<script>
import tips from '@/components/tips'
import SpFormPlus from '@/components/sp-form-plus'
import { getSmsConfig, setSmsConfig, setAlisms } from '@/api/sms'
import { requiredRules } from '@/utils/validate'

export default {
  components: {
    tips,
    SpFormPlus
  },
  data() {
    return {
      form: {
        accesskey_id: '',
        accesskey_secret: ''
      },
      cardData: [
        {
          titleKey: '8cc9220c.a894ba',
          infoKey: '8cc9220c.ec93d6',
          btnKey: '8cc9220c.a3d64c',
          label: 'scene_num',
          tabName: 'send_sms'
        },
        {
          titleKey: '8cc9220c.f32c04',
          infoKey: '8cc9220c.8ff2c7',
          btnKey: '8cc9220c.fe318d',
          label: 'sign_num',
          tabName: 'sms_signatures'
        },
        {
          titleKey: '8cc9220c.dbe8ba',
          infoKey: '8cc9220c.2c52cd',
          btnKey: '8cc9220c.8a71f7',
          label: 'template_num',
          tabName: 'sms_template'
        }
      ],
      info: {
        scene_num: '',
        sign_num: '',
        status: '',
        template_num: ''
      },
      visible: false
    }
  },
  computed: {
    formItems() {
      return [
        {
          fieldName: 'accesskey_id',
          label: 'AccessKey ID',
          component: 'input',
          componentProps: {
            placeholder: this.$t('8cc9220c.2b2afe')
          },
          rules: [requiredRules('Accesskey ID', 'change')]
        },
        {
          fieldName: 'accesskey_secret',
          label: 'Accesskey Secret',
          component: 'input',
          componentProps: {
            placeholder: this.$t('8cc9220c.d5ffd7')
          },
          rules: [requiredRules('Accesskey secret', 'change')]
        }
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const result = await getSmsConfig()
      const { accesskey_id, accesskey_secret, template_num, status, sign_num, scene_num } =
        result.data.data
      this.info = { scene_num, sign_num, status, template_num }
      this.form = { accesskey_id, accesskey_secret }
    },
    fnEdit() {
      this.visible = true
    },
    async fnPass() {
      try {
        await this.$refs.form.validate()
        await setSmsConfig(this.form)
        this.$message.success(this.$t('8cc9220c.330363'))
        this.handleClose()
        this.init()
      } catch (error) {
        // 验证失败，不处理
      }
    },
    async fnSwitch(status) {
      let message = this.$t('8cc9220c.cdb1c2')
      if (status) {
        message = this.$t('8cc9220c.d3496b')
        this.$confirm(message, '', {
          confirmButtonText: this.$t('8cc9220c.38cf16'),
          cancelButtonText: this.$t('8cc9220c.625fb2'),
          type: 'warning'
        })
          .then(async () => {
            const result = await setAlisms({ status })
            this.$message.success(this.$t('8cc9220c.330363'))
            this.init()
          })
          .catch(() => {
            this.info.status = !status
          })
      } else {
        this.$confirm(message, '', {
          confirmButtonText: this.$t('8cc9220c.38cf16'),
          cancelButtonText: this.$t('8cc9220c.625fb2'),
          type: 'warning'
        })
          .then(async () => {
            const result = await setAlisms({ status })
            this.$message.success(this.$t('8cc9220c.330363'))
            this.init()
          })
          .catch(() => {
            this.info.status = !status
          })
      }
      console.log(status)
    },
    handleClose() {
      this.visible = false
      this.init()
    },
    fnGo(tabName) {
      this.$router.push({ path: `/setting/system-config/sms-service/${tabName}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.alisms_baseConfig {
  padding-bottom: 50px;
  .card {
    padding: 24px;
    margin: 20px 3px 20px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    // box-shadow:-5px 0px 0px #333;
    nav {
      margin-bottom: 20px;
    }
    .content {
      .title {
        position: relative;
        color: #000;
        &::before {
          content: '';
          display: block;
          position: absolute;
          width: 5px;
          left: -8px;
          top: 4px;
          bottom: 4px;
          background: #1480e3;
        }
      }
      .info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .right {
          .btn {
            margin-right: 50px;
            padding: 8px 30px;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.alisms_baseConfig {
  .form {
    width: 85%;
    .el-form-item {
      margin-bottom: 22px;
    }
  }
  .el-form-item__label {
    color: #000;
  }
  .el-form-item {
    margin-bottom: 4px;
  }
  .el-dialog {
    min-width: 600px;
    .el-dialog__body {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
