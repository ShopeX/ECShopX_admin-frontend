<style lang="scss">
.marketing-employee-purchase {
  .activity-name,
  .activity-title {
    max-width: 480px;
  }
  .link-home {
    margin-right: 4px;
  }
  .company-list {
    width: 480px;
    .el-input {
      max-width: 480px;
    }
    .el-select__tags {
      max-width: 100% !important;
    }
  }
  // .activity-time-field {
  //   margin-top: 10px;
  //   .form-item-content {
  //     margin-top: 10px;
  //     label {
  //       margin-right: 10px;
  //     }
  //   }
  //   .el-range-input {
  //   }
  //   .el-range-separator {
  //     width: 30px;
  //   }
  // }
  .el-range-separator {
    width: 30px;
  }
  .activity-pic-field {
    margin-top: 10px;
    .form-item-tip {
      margin-bottom: 4px;
    }
  }
  .company-list {
    .el-tag {
      margin-right: 8px;
    }
  }
  .preheat-time {
    .el-date-editor--datetime {
      margin: 0 8px;
    }
  }
  .activity-employee-field {
    .form-item-content {
      label {
        margin-right: 10px;
        white-space: nowrap;
      }
    }
    .content-item {
      display: flex;
      align-items: center;
      &:not(:last-child) {
        margin-bottom: 6px;
      }
    }
  }
  .activity-limit-field {
    margin-top: 10px;
    .content-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 10px;
      label {
        margin-right: 10px;
      }
      .sp-input {
        flex: 1;
      }
      .item-wrap {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
<template>
  <div class="marketing-employee-purchase">
    <el-card class="el-card--normal" header="基础信息">
      {{ formBase }}
      <SpForm
        ref="formBase"
        v-model="formBase"
        class="base-form"
        :form-list="formBaseList"
        :submit="false"
      />
    </el-card>
    <el-card class="el-card--normal" header="活动规则">
      <SpForm
        ref="formBase"
        v-model="activityRule"
        class="base-form"
        :form-list="activityRuleList"
        :submit="false"
      />
    </el-card>
    <el-card class="el-card--normal" header="活动商品" />

    <div class="footer-container">
      <el-button
        @click="
          () => {
            this.$router.go(-1)
          }
        "
      >
        取消
      </el-button>
      <el-button
        type="primary"
        @click="
          () => {
            this.$refs['form'].handleSubmit()
          }
        "
      >
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      formBase: {
        name: '',
        title: '',
        linkHome: null,
        pic: []
      },
      formBaseList: [
        {
          label: '活动名称',
          className: 'activity-name',
          key: 'name',
          type: 'input',
          required: true,
          maxlength: 30,
          placeholder: '活动名称，管理活动用，不对消费者展示，最多30个字',
          message: '活动名称不能为空'
        },
        {
          label: '活动标题',
          className: 'activity-title',
          key: 'title',
          type: 'input',
          required: true,
          maxlength: 16,
          placeholder: '活动标题，再活动列表展示，最多16个字',
          message: '活动标题不能为空',
          tip: '活动标题在活动列表展示，也会作为分享小程序的卡片标题使用'
        },
        {
          label: '活动首页',
          key: 'name',
          component: () => (
            <div>
              <span class='link-home'>
                {this.formBase?.linkHome && this.formBase.linkHome.template_title}
              </span>
              <el-button type='text' on-click={this.onPickerTemp}>
                选择首页
              </el-button>
            </div>
          )
        },
        {
          label: '分享活动',
          key: 'name',
          component: () => (
            <div class='activity-pic-field'>
              <div class='form-item-tip'>
                员工通过小程序卡片分享活动时展示，建议尺寸300*240，支持 png、jpg 格式，文件大小为 2M
                内
              </div>
              <SpImagePicker v-model={this.formBase.pic} />
            </div>
          )
        }
      ],
      activityRule: {
        companyList: [],
        preheatTime: '',
        // personnel: [],
        employee: {
          datetime: [],
          quota: ''
        },
        limit: {
          employee: '',
          relatives: {
            type: 1,
            limit: 100,
            shareLimit: 100
          }
        },
        orderMiniAmount: '',
        modifyReceiveAddress: ''
      },
      activityRuleList: [
        {
          label: '参与企业',
          key: 'companyList',
          type: 'input',
          required: true,
          component: () => (
            <div class='company-list'>
              {this.activityRule.companyList.map((item, index) => (
                <el-tag
                  closable
                  disable-transitions
                  key={item.id}
                  type={item.id}
                  on-close={this.closeCompany.bind(this, index)}
                >
                  {item.name}
                </el-tag>
              ))}
              <el-button type='text' on-click={this.onPickerCompany}>
                选择企业
              </el-button>
            </div>
          ),
          placeholder: '活动名称，管理活动用，不对消费者展示，最多30个字',
          message: '活动名称不能为空'
        },
        {
          label: '开始预热',
          key: 'preheatTime',
          required: true,
          component: () => (
            <div class='preheat-time'>
              从
              <el-date-picker
                class=''
                v-model={this.activityRule.preheatTime}
                type='datetime'
                placeholder='选择日期时间'
              ></el-date-picker>
              开始活动将展示在活动列表
            </div>
          ),
          message: '请选择预热时间'
        },
        {
          label: '员工',
          key: 'employee',
          component: () => (
            <div class='activity-employee-field'>
              <div class='form-item-content'>
                <div class='content-item'>
                  <label>购买时间</label>
                  <el-date-picker
                    v-model={this.activityRule.employee.datetime}
                    type='daterange'
                    range-separator='至'
                    start-placeholder='开始时间'
                    end-placeholder='结束时间'
                  ></el-date-picker>
                </div>
                <div class='content-item'>
                  <label>购买额度</label>
                  <SpInput
                    value={this.activityRule.employee.quota}
                    width='100px'
                    placeholder='大于0的整数'
                    prefix='每人最多可购买额度'
                    suffix='元'
                  />
                </div>
              </div>
            </div>
          )
        },
        // {
        //   label: '参与人员',
        //   key: 'personnel',
        //   type: 'checkbox',
        //   options: [
        //     { name: '员工', label: '1' },
        //     { name: '亲友', label: '2' }
        //   ],
        //   message: '活动名称不能为空'
        // },
        // {
        //   label: '购买额度',
        //   key: 'time',
        //   component: () => (
        //     <div class='activity-limit-field'>
        //       <div class='form-item-tip'>活动人员在设置的时间段内可参与活动</div>
        //       <div class='form-item-content'>
        //         <div class='content-item'>
        //           <label>员工</label>
        //           <SpInput width='100px' prefix='每人最多可购买额度' suffix='元' />
        //         </div>
        //         <div class='content-item'>
        //           <label>亲友</label>
        //           <div class='content-item-field'>
        //             <div class='item-wrap'>
        //               <el-radio v-model={this.activityRule.limit.relatives.type} />
        //               <SpInput width='100px' prefix='每人最多可购买额度' suffix='元' />
        //             </div>
        //             <div class='item-wrap'>
        //               <el-radio v-model={this.activityRule.limit.relatives.type} />
        //               <SpInput width='100px' prefix='所有亲友共享额度' suffix='元' />
        //             </div>
        //           </div>
        //         </div>
        //       </div>
        //     </div>
        //   ),
        //   message: '活动名称不能为空'
        // },
        {
          label: '订单最低金额',
          key: 'orderMiniAmount',
          component: () => <SpInput width='100px' prefix='单笔订单不低于' suffix='元' />
        },
        {
          label: '修改收货地址',
          key: 'modifyReceiveAddress',
          component: () => (
            <SpInput width='100px' prefix='活动结束后' suffix='小时内买家可修改收货地址' />
          ),
          tip: '请输入≥0的整数，从活动结束时间开始开始计算，例如24代表活动结束后24个小时(1天)内买家都可以修改收货地'
        }
      ],
      companyList: [
        {
          value: '1',
          label: '企业1'
        },
        {
          value: '2',
          label: '企业2'
        },
        {
          value: '3',
          label: '企业3'
        }
      ]
    }
  },
  created() {},
  methods: {
    async onPickerTemp() {
      const { data } = await this.$picker.template({
        data: this.formBase.linkHome?.pages_template_id || [],
        multiple: false
      })
      this.formBase.linkHome = data ? data[0] : null
    },
    async onPickerCompany() {
      const ids = this.activityRule.companyList.map((item) => item.id)
      const { data } = await this.$picker.company({
        data: ids
      })
      this.activityRule.companyList = data
    },
    closeCompany(index) {
      this.activityRule.companyList.splice(index, 1)
    }
  }
}
</script>
