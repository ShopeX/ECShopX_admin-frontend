<template>
  <div class="page-body">
    <SpRouterView>
      <!-- 橙色的tip -->
      <div class="orange-tip">
        <span>该功能支持微信小程序商城，H5商城，APP商城，支付宝小程序商城。 </span>
      </div>
      <SpFinder
        ref="finder"
        url="/adplace/list"
        fixed-row-action
        row-actions-width="200px"
        :setting="tableSchema"
        :split-count="5"
        :hooks="{
          beforeSearch
        }"
        no-selection
      >
        <template v-slot:tableTop>
          <div class="action-container">
            <div style="height: 20px" />
            <el-button type="primary" plain @click="addHandle">添加弹窗</el-button>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="全部" name="all" />
              <el-tab-pane label="待提审" name="submitting" />
              <el-tab-pane label="待审核" name="processing" />
              <el-tab-pane label="待生效" name="0" />
              <el-tab-pane label="生效中" name="1" />
              <el-tab-pane label="已失效" name="2" />
            </el-tabs>
          </div>
        </template>
      </SpFinder>

      <SpDialog
        ref="dialogRef"
        v-model="dialogShow"
        :title="!editRow ? '添加广告' : '编辑广告'"
        :modal="false"
        class="base-form"
        :form="activityRule"
        :form-list="activityRuleList"
        @onSubmit="onFormSubmit"
      />
    </SpRouterView>
  </div>
</template>

<script>
import { tableSchema, formSchema } from './schema'
import { generatorParams } from '@/utils/schemaHelper.js'
import crowdSelect from '@/components/function/crowdSelect.vue'
import api from '@/api'
import moment from 'moment'
import { isNumber } from '@/utils'
export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    crowdSelect
  },
  data() {
    return {
      // 创建广告
      activityRule: {
        ...generatorParams(formSchema(this))
      },
      editRow: null,
      dialogShow: false,
      imgList: {imgUrl:"",data:[]},
      activeName: 'all',
      areas: []
    }
  },
  computed: {
    tableSchema() {
      return tableSchema(this)
    },
    activityRuleList() {
      return formSchema(this)
    }
  },
  mounted() {
    api.regionauth.getRegionauth().then((res) => {
      this.areas = res?.list?.map((el) => ({
        value: el.regionauth_id,
        label: el.regionauth_name,
        title: el.regionauth_name
      }))
    })
  },
  methods: {
    addHandle() {
      this.editRow = null
      this.dialogShow = true
      this.activityRule = {
        ...generatorParams(formSchema(this))
      }
      this.imgList = { imgUrl: '', data: [] }
    },
    refresh() {
      this.$refs.finder.refresh(true)
    },
    editDistributor(row) {
      this.editRow = row
      this.dialogShow = true
    },
    async onFormSubmit() {
      const _baseParams = {
        ...this.activityRule,
        start_time: moment(this.activityRule?.start_time[0]).unix(),
        end_time: moment(this.activityRule?.start_time[1]).unix(),
        ad_type: 'popup',
        setting: JSON.stringify(this.activityRule.imgList)
      }
      if (this.editRow) {
        await api.wxastats.updatePictureAd(this.editRow.id, _baseParams)
      } else {
        await api.wxastats.createPictureAd(_baseParams)
      }
      this.refresh()
      this.dialogShow = false
    },
    editHandle(row) {
      this.editRow = row
      this.dialogShow = true
      this.activityRule = {
        ...generatorParams(formSchema(this), row),
        start_time: [
          moment(row.start_time * 1000).format('yyyy-MM-DD HH:mm:ss'),
          moment(row.end_time * 1000).format('yyyy-MM-DD HH:mm:ss')
        ],
        pages: row.pages || 'home'
      }
      try {
        this.imgList = JSON.parse(row.setting)
        this.activityRule.imgList = this.imgList
      } catch (error) {
        this.imgList = { imgUrl: '', data: [] }
        this.activityRule.imgList = { imgUrl: '', data: [] }
      }
    },
    deleteHandle(row) {
      this.$confirm('是否确认删除，删除后将无法恢复', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.wxastats.deletePictureAd(row.id).then(() => {
            this.refresh()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    async handleAddImage(index, row) {
      const res = await this.$picker.hotZone({
        title: '设置热区',
        linkMultiple: false,
        linkType: 2,
        data: this.imgList,
        useTabs: [
          { label: '商品', name: 'goods' },
          { label: '营销', name: 'marketing' }
        ]
      })
      this.imgList = res?.data
      this.activityRule.imgList = res?.data
    },
    handleClick() {
      this.$refs.finder.refresh(true)
    },
    // 筛选事件
    beforeSearch(params) {
      params = {
        ...params,
        ad_type: 'popup'
      }
      if (isNaN(Number(this.activeName))) {
        params.audit_status = this.activeName === 'all' ? '' : this.activeName
        params.status = 'all'
      } else {
        params.status = this.activeName
        params.audit_status = ''
      }
      return params
    },
    submitHandle(row) {
      api.wxastats.submitAd(row.id).then(() => {
        this.$message.success('提交审核成功')
        this.refresh()
      })
    },
    cancelHandle(row) {
      api.wxastats.withdrawAd(row.id).then(() => {
        this.$message.success('撤销审核成功')
        this.refresh()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.imagePlace {
  width: 100px;
  height: 100px;
  border: 1px dashed #ccc;
  border-radius: 5px;
}
.img-data {
  min-width: 240px;
  .suffix {
    color: var(--themeColor);
  }
}

.orange-tip {
  background-color: #fdf6ec;
  color: #edc080;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
}
</style>
