<style lang="scss" scoped>
.sp-filter-form {
  margin-bottom: 8px;
}
</style>
<style lang="scss">
.activity-status-tabs {
  .el-tabs__header {
    margin-bottom: 0;
  }
}
</style>
<template>
  <div>
    <div class="action-container">
      <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="createActivity">
        新建活动
      </el-button>
    </div>
    <SpFilterForm :model="queryForm" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="name" label="活动名称:">
        <el-input v-model="queryForm.name" placeholder="活动名称关键词" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="datetime" label="活动时间:" size="max">
        <el-date-picker
          v-model="queryForm.datetime"
          clearable
          type="datetimerange"
          align="right"
          format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="defaultTime"
          :picker-options="pickerOptions"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="enterprise_id" label="参与企业:" size="max">
        <el-select
          v-model="queryForm.enterprise_id"
          v-scroll="getEnterpriseList"
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in enterpriseList"
            :key="`enterprise-item__${index}`"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </SpFilterFormItem>
    </SpFilterForm>

    <el-tabs
      v-model="queryForm.activityState"
      class="activity-status-tabs"
      type="card"
      @tab-click="onSearch"
    >
      <el-tab-pane
        v-for="item in activityStatus"
        :key="item.value"
        :label="item.title"
        :name="item.value"
      />
    </el-tabs>

    <SpFinder
      ref="finder"
      no-selection
      :setting="setting"
      :row-actions-align="'left'"
      :hooks="{
        beforeSearch: beforeSearch
      }"
      url="/enterprise"
    />
  </div>
</template>

<script>
import { PICKER_DATE_OPTIONS } from '@/consts'
import Pages from '@/utils/pages'
import { createSetting } from '@shopex/finder'
export default {
  name: '',
  data() {
    return {
      queryForm: {
        name: '',
        datetime: [],
        enterprise_id: [],
        activityState: ''
      },
      defaultTime: ['00:00:00', '23:59:59'],
      pickerOptions: PICKER_DATE_OPTIONS,
      enterpriseList: [],
      activityStatus: [
        { title: '全部', value: '0' },
        { title: '未开始', value: '1' },
        { title: '进行中', value: '2' },
        { title: '已结束', value: '3' }
      ],
      setting: createSetting({
        actions: [
          {
            name: '编辑',
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                Object.keys(this.companyForm).forEach((key) => (this.companyForm[key] = row[key]))
                this.addDialog = true
              }
            }
          },
          {
            name: '商品',
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                Object.keys(this.companyForm).forEach((key) => (this.companyForm[key] = row[key]))
                this.addDialog = true
              }
            }
          },
          {
            name: '商品2',
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                Object.keys(this.companyForm).forEach((key) => (this.companyForm[key] = row[key]))
                this.addDialog = true
              }
            }
          },
          {
            name: '商品3',
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                Object.keys(this.companyForm).forEach((key) => (this.companyForm[key] = row[key]))
                this.addDialog = true
              }
            }
          }
        ],
        columns: [
          { name: '活动名称', key: 'id' },
          {
            name: '员工额度',
            key: 'name'
          },
          {
            name: '亲友额度',
            key: 'enterprise_sn'
          },
          {
            name: '预热时间',
            key: 'enterprise_sn'
          },
          {
            name: '购买时间',
            key: 'enterprise_sn'
          },
          {
            name: '状态',
            key: 'enterprise_sn'
          }
        ]
      })
    }
  },
  created() {
    this.pagesQuery = new Pages()
    this.getEnterpriseList()
  },
  methods: {
    beforeSearch(params) {
      return {
        ...params,
        ...this.queryForm
      }
    },
    onSearch() {},
    createActivity() {
      this.$router.push({ path: '/marketing/employee/purchase/create' })
    },
    async getEnterpriseList() {
      const { page, pageSize, nextPage } = this.pagesQuery.options
      if (nextPage) {
        const { list, total_count } = await this.$api.member.getPurchaseCompanyList({
          page,
          pageSize
        })
        this.pagesQuery.setTotal(total_count)
        this.enterpriseList = this.enterpriseList.concat(list)
      }
    }
  }
}
</script>
