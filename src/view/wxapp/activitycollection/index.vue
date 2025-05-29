<style lang="scss" scoped>
.sp-filter-form {
  margin-bottom: 16px;
}
.page-code {
  text-align: center;
}
.page-code-img {
  width: 200px;
  height: 200px;
}
</style>
<template>
  <div>
    <SpRouterView>
      <SpFilterForm :model="formQuery" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="regionauth_id" label="区域">
          <el-select v-model="formQuery.regionauth_id" placeholder="请选择" clearable>
            <el-option
              v-for="item in areasList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="activity_type" label="活动类型">
          <el-select v-model="formQuery.activity_type" placeholder="请选择" clearable>
            <el-option label="限时特惠" value="seckill" />
            <el-option label="拼团活动" value="groups" />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="is_enabled" label="状态">
          <el-select v-model="formQuery.is_enabled" placeholder="请选择" clearable>
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="collection_id" label="页面ID">
          <el-input v-model="formQuery.collection_id" placeholder="请输入" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="collection_name" label="页面名称">
          <el-input v-model="formQuery.collection_name" placeholder="请输入" />
        </SpFilterFormItem>
      </SpFilterForm>
      <SpFinder
        ref="finder"
        no-selection
        :split-count="4"
        :setting="setting"
        :hooks="{
          beforeSearch: beforeSearch
        }"
        url="/promotions/collection/list"
      />
    </SpRouterView>

    <el-dialog :title="sunCodeTitle" :visible.sync="sunCode" width="360px">
        <div class="page-code">
          <img class="page-code-img" :src="appCodeUrl" />
          <div class="page-btns">
            <el-button type="primary" plain @click="handleDownload(sunCodeTitle)">
              下载码
            </el-button>
            <el-button v-clipboard:copy="curPageUrl" type="primary" plain> 复制链接 </el-button>
          </div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="sunCode = false">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import { PICKER_DATE_OPTIONS, PAY_TYPE } from '@/consts'
import { createSetting } from '@shopex/finder'
import moment from 'moment'
export default {
  provide() {
    return {
      refresh: () => this.$refs.finder.refresh(true)
    }
  },
  data() {
    return {
      formQuery: {
        regionauth_id:'',
        activity_type:'',
        is_enabled:'',
        collection_id:'',
        collection_name:''
      },
      id: '',
      defaultTime: ['00:00:00', '23:59:59'],
      pickerOptions: PICKER_DATE_OPTIONS,
      merchantLoading: false,
      merchantList: [],
      areasList: [],
      categoryOption:[],
      appID: '',
      sunCode: false,
      sunCodeTitle: '',
      appCodeUrl: '',
      curPageUrl: '',
      setting: createSetting({
        actions: [
          {
            name: '添加页面',
            key: 'action',
            type: 'button',
            slot: 'header',
            buttonType: 'primary',
            action: {
              handler: async (val) => {
                this.$router.push({ path: this.matchHidePage('editor') })
              }
            }
          },
          {
            name: '编辑',
            key: 'edit',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([row]) => {
                this.$router.push({ path: this.matchHidePage('editor/') + row.collection_id })
              }
            }
          },
          {
            name: '投放',
            key: 'push',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([row]) => {
                this.handleShow(row)
              }
            }
          },
          {
            name: '删除',
            key: 'delete',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([row]) => {
                this.handleDelete(row)
              }
            }
          }
        ],
        columns: [
          { name: '页面ID', key: 'collection_id' },
          {
            name: '页面名称',
            key: 'collection_name'
          },
          {
            name: '区域',
            key: 'regionauth_name',
          },
          {
            name: '活动类型',
            key: 'activity_type',
            render: (h, { row }) => h('span', {}, row.activity_type == 'seckill' ? '限时特惠' : '拼团活动' )
          },
          {
            name: '状态',
            key: 'is_enabled',
            render: (h, { row }) => {
              return <el-tag  type={row.is_enabled == '1' ? 'warning' : 'info'}>{row.is_enabled == '1' ? '启用' : '禁用'}</el-tag>
            }
          }
        ]
      })
    }
  },
  created() {
    this.id = this.$route.query.id
  },
  mounted() {
    this.getAreaList()
    this.fetchWechatList()
  },
  methods: {
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    beforeSearch(params) {
      return { ...params,...this.formQuery }
    },
    afterSearch(response) {},
    async getAreaList() {
      // 查询区域数据
      const res = await this.$api.regionauth.getRegionauth()
      this.areasList = res?.list?.map((el) => ({
        value: el.regionauth_id,
        label: el.regionauth_name
      }))
      this.formQuery.regionauth_id = this.areasList[0]?.value
      this.$refs.finder.refresh(true)
    },
    async fetchWechatList() {
      const { list } = await this.$api.minimanage.gettemplateweapplist()
      list.forEach((item, i) => {
        if (item.name == 'yykweishop') {
          this.appID = item.authorizer.authorizer_appid
        }
      })
    },
    getPayment(pay_channel, pay_type) {
      return pay_channel ? PAY_TYPE[pay_channel] : PAY_TYPE[pay_type]
    },
    async handleShow({ collection_id,activity_type }) {
      const page = activity_type == 'seckill' ? 'subpages/marketing/limited-sale' : 'subpages/marketing/group-list'
      this.curPageUrl = `${page}`
      let params = {
        wxaAppId: this.appID,
        page,
        collection_id
      }
      const { base64Image } = await this.$api.marketing.getPageCode(params)
      this.appCodeUrl = base64Image
      this.sunCode = true
    },
    handleDownload(name) {
      var a = document.createElement('a')
      var temp = name
      if (this.appCodeUrl) {
        a.href = this.appCodeUrl
        a.download = temp + '.png'
        a.click()
      }
    },
    async handleDelete(row) {
      this.$confirm('你确定要删除该活动吗?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            this.$api.promotions.deleteCollection(row.collection_id).then((res) => {
              this.$refs.finder.refresh(true)
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 5 * 1000
              })
            })
          }
          done()
        }
      })
    }
  }
}
</script>
