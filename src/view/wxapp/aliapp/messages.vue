<template>
  <div>
    <div v-if="!wxapp_id" class="content-center no-bind">
      <div>
        <i class="iconfont icon-info-circle" style="font-size: 70px" />
      </div>
      <div class="content-padded">未绑定小程序，请先绑定小程序</div>
    </div>
    <el-dialog
      title="小程序消息模版详情"
      size="tiny"
      :visible.sync="detailDialog"
      :close-on-click-modal="false"
    >
      <div class="section-body">
        <el-form label-width="100px">
          <el-form-item label="是否开启">
            <el-switch
              v-model="currentTemplate.is_open"
              active-text=" "
              inactive-text=" "
              active-color="#13ce66"
              @change="openChange"
            />
          </el-form-item>
          <el-form-item label="模版id">
            {{ currentTemplate.template_id }}
          </el-form-item>
          <el-form-item label="发送时间点">
            {{ currentTemplate.send_time_desc.title }}
            <span v-if="currentTemplate.send_time_desc.time_list">
              <el-select
                v-model="currentTemplate.send_time_desc.value"
                style="width: 80px"
                placeholder="请选择"
                @change="openChange"
              >
                <el-option
                  v-for="item in currentTemplate.send_time_desc.time_list"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
              {{ currentTemplate?.send_time_desc?.time_unit || '分钟' }}
              {{ currentTemplate.send_time_desc.end_title }}
            </span>
          </el-form-item>
          <el-form-item label="内容">
            <el-card class="box-card" shadow="never">
              <div v-for="data in currentTemplate.content" :key="data.column">
                {{ data.title }}
              </div>
            </el-card>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <div class="message-template">
      <div class="section-body">
        <div
          v-for="row in temlateList"
          class="item"
          :class="row.is_open ? 'succ-open-sms' : 'not-open-sms'"
          @click="toDetail(row)"
        >
          <div class="item-title clearfix">{{ row.title }} <i class="el-icon-arrow-right" /></div>
          <div v-if="row.send_time_desc.value" class="item-content">
            {{ row.send_time_desc.title }}{{ row.send_time_desc.value
            }}{{ row?.send_time_desc?.time_unit || '分钟' }}{{ row.send_time_desc.end_title }}
          </div>
          <div v-else class="item-content">
            {{ row.send_time_desc.title }}
          </div>
          <div class="item-footer">
            <el-button v-if="row.is_open" type="default" size="small"> 启用中 </el-button>
            <el-button v-else type="default" size="small"> 未启用 </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getWxaMessageTemplateList, openWxaMessageTemplate } from '@/api/wxa'
export default {
  data() {
    return {
      detailDialog: false,
      temlateList: [],
      currentTemplate: {
        is_open: false,
        content: '',
        send_time_desc: {
          title: ''
        }
      }
    }
  },
  computed: {
    ...mapGetters(['wxapp_id', 'template_name'])
  },
  mounted() {
    if (this.wxapp_id) {
      getWxaMessageTemplateList({
        wxapp_appid: this.wxapp_id,
        template_name: this.template_name
      }).then(res => {
        this.temlateList = res.data.data.list
      })
    }
  },
  methods: {
    closeDialog() {
      this.detailDialog = false
    },
    openChange() {
      let params = {
        template_name: this.template_name,
        wxapp_appid: this.wxapp_id,
        scenes_name: this.currentTemplate.scenes_name,
        is_open: this.currentTemplate.is_open
      }
      if (this.currentTemplate.send_time_desc.value) {
        params.send_time = this.currentTemplate.send_time_desc.value
      }
      openWxaMessageTemplate(params).then(res => {
        this.$message({ message: '保存成功', type: 'success' })
      })
    },
    toDetail(params) {
      this.detailDialog = true
      this.currentTemplate = params
    }
  }
}
</script>
<style scoped type="text/css" lang="scss">
.el-tab-pane {
  min-height: 700px;
}
.message-content {
  button {
    margin-left: 20px;
  }
}
.message-count {
  margin: 0 5px 0 20px;
  font-size: 24px;
  color: #ff5000;
}
.message-template {
  .item {
    display: inline-block;
    width: 210px;
    margin: 0 10px;
    border: 1px solid #dfdfdf;
    &-title {
      padding: 10px;
      color: #fff;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
      i {
        float: right;
        margin-top: 4px;
      }
    }
    &-content {
      height: 140px;
      padding: 20px 10px;
      color: #333;
      font-size: 12px;
    }
    &-footer {
      // border-top: 1px solid #dfdfdf;
      padding: 10px 0;
      text-align: center;
      button {
        width: 50%;
        &:hover {
          border: 1px solid #c4c4c4;
          color: #1f2d3d;
        }
      }
    }
    &:hover {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    }
    &.not-open-sms {
      .item-title {
        background-color: #ff4949;
      }
    }
    &.succ-open-sms {
      .item-title {
        background-color: #13ce66;
      }
    }
  }
}
.message-autograph {
  .el-input {
    width: 240px;
    margin-right: 10px;
  }
  span {
    margin: 0 10px;
  }
  button {
    width: 80px;
  }
}
.message-prompt {
  margin-top: 30px;
  padding-left: 20px;
  .prompt {
    &-title {
      margin-bottom: 10px;
      font-size: 18px;
      color: #333;
      span {
        border-left: 3px solid #20a0ff;
        padding-left: 10px;
      }
    }
    &-content {
      padding-left: 8px;
      line-height: 1.6;
      color: #666;
      .item-title {
        margin-bottom: 5px;
      }
      .item-content {
        padding-left: 14px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
