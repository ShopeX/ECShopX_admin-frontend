<template>
  <div>
    <template
      v-if="
        $route.path.indexOf('detail') === -1 &&
        $route.path.indexOf('editor') === -1 &&
        $route.path.indexOf('team') === -1
      "
    >
      <SpPlatformTip />
      <div class="action-container">
        <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addGroups">
          新增拼团活动
        </el-button>
      </div>

      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="regionauth_id" label="区域:">
          <el-select v-model="params.regionauth_id" placeholder="请选择" clearable>
            <el-option
              v-for="item in areasList"
              :key="item.template_id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="marketing_name" label="活动名称:">
          <el-input v-model="params.marketing_name" placeholder="请输入商品名称" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="marketing_id" label="活动ID:">
          <el-input v-model="params.marketing_id" placeholder="请输入活动ID" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="create_time" label="创建时间:">
          <el-date-picker
            v-model="params.create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            start-placeholder="开始日期"
            ange-separator="至"
            end-placeholder="结束日期"
            style="width: 100%"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="po_code" label="PO编码:">
          <el-input v-model="params.po_code" placeholder="请输入PO编码" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="budget_code" label="Budget code:">
          <el-input v-model="params.budget_code" placeholder="请输入Budget code" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="activity_time" label="活动时间:">
          <el-date-picker
            v-model="params.activity_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            start-placeholder="开始日期"
            ange-separator="至"
            end-placeholder="结束日期"
            style="width: 100%"
          />
        </SpFilterFormItem>
      </SpFilterForm>

      <el-tabs v-model="activeName" type="card" style="margin-top:20px;">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.name"
          :name="item.activeName"
        >
          <!-- <groupsList v-if="activeName === 'first'" ref="groupsList" :view="0" />
          <groupsList v-if="activeName === 'second'" :view="1" />
          <groupsList v-if="activeName === 'third'" :view="2" />
          <groupsList v-if="activeName === 'fourth'" :view="3" /> -->
        </el-tab-pane>
      </el-tabs>
      <groupsList ref="groupsList" :view="viewMap[activeName]" :search-params="searchParams" />
    </template>
    <router-view />
  </div>
</template>

<script>
import groupsList from './list/groupsList'

export default {
  provide() {
    return {
      refresh: this.refresh
    }
  },
  components: {
    groupsList
  },
  data() {

    const initialParams = {
      activity_time: [],
      create_time:[],
      regionauth_id:undefined,
      marketing_name:undefined,
      marketing_id:undefined,
      po_code:undefined,
      budget_code:undefined,
    }

    return {
      loading: false,
      view: 0,
      activeName: 'first',
      params: {
        ...initialParams
      },
      viewMap:{
        first:0,
        second:1,
        third:2,
        fourth:3
      },
      tabList: [
        { name: '全部', activeName: 'first' },
        { name: '未开始', activeName: 'second' },
        { name: '进行中', activeName: 'third' },
        { name: '已结束', activeName: 'fourth' }
      ],
      areasList:[],
      searchParams: {}
    }
  },
  mounted() {
    if ('undefined' != typeof this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
    this.getAreaList()
    this.getParams()
  },
  methods: {
    onReset() {
      this.params = { ...this.initialParams }
      this.onSearch()

    },
    onSearch() {
      this.getParams()
      this.$nextTick(() => {
        this.refresh()
      })
    },
    getParams() {
      const time = {}
      const activity_time = this.params.activity_time
      if (activity_time && activity_time.length > 0) {
        time.start_time = this.dateStrToTimeStamp(activity_time[0] + ' 00:00:00')
        time.end_time = this.dateStrToTimeStamp(activity_time[1] + ' 23:59:59')
      }

      const create_time = this.params.create_time
      if (create_time && create_time.length > 0) {
        time.create_start_time = this.dateStrToTimeStamp(create_time[0] + ' 00:00:00')
        time.create_end_time = this.dateStrToTimeStamp(create_time[1] + ' 23:59:59')
      }

      let params = {
        ...this.params,
        activity_time: [],
        create_time:[],
        ...time
      }
      this.searchParams = {...params}
      return params
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    async getAreaList(){
      // 查询区域数据
     const res = await this.$api.regionauth.getRegionauth()
     this.areasList =  res?.list?.map((el) => ({
          value: el.regionauth_id,
          label: el.regionauth_name
        }))
    },
    addGroups() {
      // 添加运费模板
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    refresh() {
      return this.$refs['groupsList'].getGroupsList()
    }
  }
}
</script>

<style lang="scss">
.sp-filter-form-item.label .form-item__label {
  white-space: nowrap !important;
}</style>
