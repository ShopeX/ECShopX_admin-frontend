<template>
  <div class="page-body">
    <SpRouterView>
      <SpFinder
        ref="finder"
        url="polyv/channel/list"
        fixed-row-action
        row-actions-width="220px"
        :setting="tableSchema"
        :hooks="{
          beforeSearch
        }"
        row-actions-fixed-align="left"
        @select-all="handleSelectionChange"
        @selection-change="handleSelectionChange"
      >
        <template v-slot:tableTop>
          <!-- 操作按钮 -->
          <div class="action-container">
            <div style="height: 20px" />
            <el-button type="primary" plain @click="syncRoomHandle">同步直播数据</el-button>
          </div>

          <!-- 选择tab -->
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane
              v-for="item in aduit_status"
              :key="item.value"
              :label="item.label"
              :name="item.value"
            />
          </el-tabs>
        </template>
      </SpFinder>

      <!-- 关联直播商品 -->
      <SpDialog
        ref="linkPrdDialogRef"
        v-model="linkPrdDialogShow"
        title="关联直播商品"
        :modal="false"
        class="base-form"
        :form="activityRule"
        :form-list="activityRuleList"
        @onSubmit="onGroupFormSubmit"
      />
      <!-- 选择优惠券弹窗 -->
      <SpDialog
        ref="pushLiveCouponDialogRef"
        v-model="selectCouponPackShow"
        title="选择优惠券包"
        :modal="false"
        class="base-form"
        :form="activityRule1"
        :form-list="activityRuleList1"
        @onSubmit="onGroupFormSubmit1"
      />
      <SpDialog
        ref="pushLiveCouponDialogRef"
        v-model="selectLiveCouponShow"
        title="推送优惠券"
        :modal="false"
        class="base-form"
        :form="activityRule4"
        :form-list="activityRuleList4"
        @onSubmit="onGroupFormSubmit4"
      />

      <!-- 选择关联页面 -->
      <SpDialog
        ref="pushLiveCouponDialogRef"
        v-model="linkPagePathShow"
        title="关联页面"
        :modal="false"
        class="base-form"
        :form="activityRule2"
        :form-list="activityRuleList2"
        @onSubmit="onGroupFormSubmit2"
      />

      <!-- 选择优惠券 -->
      <imgPicker
        :dialog-visible="imgDialog"
        :sc-status="isGetImage"
        @chooseImg="pickImg"
        @closeImgDialog="closeImgDialog"
      />
    </SpRouterView>
  </div>
</template>
<script>
import moment from 'moment'
import { debounce } from 'lodash-es'
import api from '@/api'
import imgPicker from '@/components/imageselect'
import { CARD_TYPE } from '@/consts'

import schema from './schema.js'
import { bindThisForFormSchema, generatorParams } from '@/utils/schemaHelper.js'
import { aduit_status, live_status } from './constants'
import { exportUploadTemplate, handleUploadFile } from '@/api/common'

export default {
  components: {
    imgPicker
  },
  data() {
    return {
      // 关联直播商品
      activityRule: {
        ...generatorParams(schema.pickLinkLivePrdSchema)
      },
      // 关联券包
      activityRule1: {
        ...generatorParams(schema.pushLiveCouponFormSchema)
      },
      // 关联页面
      activityRule2: {
        ...generatorParams(schema.linkUrlPathFormSchema)
      },
      // 推送优惠券
      activityRule4: {
        ...generatorParams(schema.selectCouponFormSchema)
      },
      // 以上是schema数据
      aduit_status,
      live_status,
      //以上是静态数据
      // 审核状态
      audit_status: '审核通过',
      // 选择tab数据
      activeName: 'all',
      // 关联商品弹窗
      linkPrdDialogShow: false,
      // 选择优惠券弹窗
      selectLiveCouponShow: false,
      // 选择券包弹窗
      selectCouponPackShow: false,
      // 选择关联页面
      linkPagePathShow: false,
      editPageRowData: null,
      // 选择的直播间数据
      multipleSelection: [],
      // 以上是页面维护状态
      // 关联页面表格数据
      pagesData: [],
      //
      selectlivePrdData: [],
      // 区域数据
      areas: [],
      imgDialog: false,
      isGetImage: false,
      // 优惠券列表数据
      couponTableData: [],
      // 券包列表数据
      packageTableData: []
    }
  },
  computed: {
    tableSchema() {
      return schema.tableSchema(this)
    },
    activityRuleList() {
      return bindThisForFormSchema(schema.pickLinkLivePrdSchema, this)
    },
    activityRuleList1() {
      return bindThisForFormSchema(schema.pushLiveCouponFormSchema, this)
    },
    activityRuleList2() {
      return bindThisForFormSchema(schema.linkUrlPathFormSchema, this)
    },
    activityRuleList4() {
      return bindThisForFormSchema(schema.selectCouponFormSchema, this)
    },
    // 关联直播商品
    prdTableSchema() {
      return schema.prdTableSchema(this)
    },
    // 推送优惠券
    pushCouponTableSchema() {
      return schema.pushCouponTableSchema(this)
    },
    selectCouponTableSchema() {
      return schema.selectCouponTableSchema(this)
    },
    // 关联页面
    linkUrlPathTableSchema() {
      return schema.linkUrlPathTableSchema(this)
    }
  },
  watch: {
    '$route'(to, from) {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 页面初始化
    init() {
      // 查询区域数据
      api.regionauth.getRegionauth().then((res) => {
        this.areas = res?.list?.map((el) => ({
          value: el.regionauth_id,
          label: el.regionauth_name
        }))
      })
    },
    refresh() {
      this.$refs.finder.refresh(true)
    },
    // 切换tab
    handleClick() {
      this.refresh()
    },
    // 筛选事件
    beforeSearch(params) {
      params = {
        ...params,
        audit_status: this.activeName
      }
      if (params?.live_time?.length) {
        params.live_time_start = moment(
          moment(params.live_time[0]).format('yyyy-MM-DD 00:00:00')
        ).unix()
        params.live_time_end = moment(
          moment(params.live_time[1]).format('yyyy-MM-DD 23:59:59')
        ).unix()
        delete params.live_time
      }
      return params
    },
    // 表格选择事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 同步直播数据事件
    async syncRoomHandle() {
      try {
        const res = await api.channel.channelSync()
        if (res.status) {
          this.refresh()
        }
        this.$message({
          message: '同步' + res.status ? '成功' : '失败',
          duration: 5 * 1000
        })
      } catch (error) {
        console.log(error)
      }
    },
    // 直播配置点击事件
    async editConfigHandle(row) {
      try {
        const { url } = await api.channel.getChannelssoAuthUrl(row.id)
        window.open(url)
      } catch (error) {
        console.log(error)
      }
    },
    // 编辑主表格数据
    editRowDataHandle(row) {
      this.$router.push({
        path: `/applications/polyv/live/management/detail/${row.id}?shopId=${row.distributor_id}`
      })
    },
    // 删除
    deleteRowDataHandle(row) {
      this.$confirm('是否确认删除，删除后将无法恢复', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.channel.deleteChannelInfo(row.id).then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 5 * 1000
            })
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
    // 表格里面单独修改审核状态
    changeAuditStatus(val) {
      this.audit_status = val
    },
    async saveAuditStatus(row) {
      if (row.audit_status == this.audit_status) {
        return
      }
      api.channel
        .editChannelStatus(row.id, {
          audit_status: this.audit_status
        })
        .then((res) => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.refresh()
          console.log(res)
        })
    },
    onAuditShow(row) {
      this.audit_status = row?.audit_status
    },
    // 以上是主页面表格操作
    // 选择直播商品
    async openSelectPrdDialog() {
      const { data } = await this.$picker.goodsLive({
        multiple: true,
        data: this.selectlivePrdData?.map((el) => ({ item_id: el.item_id })),
        params: {
          approve_status: 'instock',
          regionauth_id: this.editPageRowData?.regionauth_id,
          distributor_id:
            this.editPageRowData?.distributor_id > 0 ? this.editPageRowData?.distributor_id : ''
        }
      })
      this.selectlivePrdData = data
      this.createSelectPrdMap()
    },
    createSelectPrdMap() {
      const _selectMap = {}
      this.selectlivePrdData.forEach((el) => {
        _selectMap[el.item_id] = el
      })
      this._selectPrdMap = _selectMap
    },
    // 选择关联商品
    onGroupFormSubmit: debounce(
      async function () {
        try {
          const res = await api.channel.editChannelRelItems(this.editPageRowData.id, {
            goods_id: this.selectlivePrdData?.map((el) => el.item_id)
          })
          this.linkPrdDialogShow = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 5 * 1000
          })
          console.log(res)
        } catch (error) {
          console.log(error)
        }
      },
      1000,
      {
        leading: true
      }
    ),
    // 关联商品点击事件
    async linkProductHandle(row) {
      this.linkPrdDialogShow = true
      try {
        const res = await api.channel.getChannelRelItems(row.id)
        this.selectlivePrdData = res
        this.createSelectPrdMap()
        this.editPageRowData = row
      } catch (error) {
        console.log(error)
      }
    },
    // 批量上传
    openBatchUploadDialog(e) {
      const { file } = e
      let params = { isUploadFile: true, file_type: 'polyv_channel_goods', file: file }
      handleUploadFile(params)
        .then((response) => {
          this.$message({
            type: 'success',
            message: '上传成功'
          })

          let { data } = response.data

          if (data.fail.length > 0) {
            let str = data.fail.map((item) => {
              return item.item_bn
            })

            setTimeout(() => {
              this.$message({
                showClose: true,
                message: `以下商品编号不存在：${str}`,
                type: 'error',
                duration: 5000
              })
            }, 1500)
          }
          if (data.succ.length <= 0) return
          this.relItems = data.succ
          let list = []
          data.succ.forEach((item) => {
            if (!item.nospec) {
              list.push(Object.assign(item, { spec_items: [] }))
            } else {
              list.push(item)
            }
          })
          this.selectlivePrdData = [
            ...this.selectlivePrdData,
            ...list?.filter((el) => !this._selectPrdMap[el.item_id])
          ]
          this.createSelectPrdMap()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 下载模板
    downloadTemplateFile() {
      let params = { file_type: 'polyv_channel_goods', file_name: '商品模板' }
      exportUploadTemplate(params).then((response) => {
        let { data } = response.data
        if (data.file) {
          var a = document.createElement('a')
          a.href = data.file
          a.download = data.name
          document.body.appendChild(a)
          a.click()
          a.remove()
        } else {
          this.$message({
            type: 'error',
            message: '没有相关数据可导出'
          })
        }
      })
    },
    // 以上是关联直播商品操作
    getCardValidate(beginDate, endDate) {
      return `${moment(beginDate * 1000).format('YYYY-MM-DD HH:mm:ss')} ~ ${moment(
        endDate * 1000
      ).format('YYYY-MM-DD HH:mm:ss')}`
    },
    cardTypeFormatter({ card_type }) {
      return CARD_TYPE[card_type]
    },
    // 选择优惠券
    async openSelectCouponDialog() {
      const res = await this.$picker.couponV2({
        data: this.couponTableData?.map((el) => el.card_id),
        multiple: true,
        params: {
          regionauth_id: this.editPageRowData?.regionauth_id,
          distributor_id: this.editPageRowData?.distributor_id
        }
      })
      const { data } = res
      this.couponTableData = data?.map((el) => {
        return {
          ...el,
          'cover':
            'https://shopex-onex-yundian-image.oss-cn-shanghai.aliyuncs.com/demo-ecshopx/image/38/2025/04/02/8e6ff39e0169d93052c0c138494772f41743569470419.4af6677e-8d6b-4521-a4d7-c86e0a0be62a.png'
        }
      })
    },
    // 推送优惠券
    async pushCouponHandle(row) {
      this.selectLiveCouponShow = true
      try {
        const res = await api.channel.getChannelRelCoupon(row.id)
        this.couponTableData = res?.map((el) => {
          return {
            ...el,
            rule_text: el.rule,
            card_type: el.type,
            card_id: el.rel_id,
            takeEffect: el.expire_date_text
          }
        })
        this.editPageRowData = row
      } catch (error) {
        console.log(error)
      }
    },
    // 提交优惠券
    onGroupFormSubmit4: debounce(async function () {
      try {
        await api.channel.saveChannelRelCoupon(this.editPageRowData.id, {
          content: JSON.stringify(
            this.couponTableData?.map((el) => {
              return {
                'rel_id': el.card_id,
                'title': el.title,
                'type': el.card_type,
                'rule': el.rule_text,
                cover: el.cover,
                'expire_date_text': el?.takeEffect
                  ? el.takeEffect
                  : this.getCardValidate(el.begin_time, el.end_time)
              }
            })
          )
        })
        this.selectLiveCouponShow = false
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 5 * 1000
        })
      } catch (error) {
        console.log(error)
      }
    }),
    // 推送优惠券包
    async pushCouponPackHandle(row) {
      this.selectCouponPackShow = true
      try {
        const res = await api.channel.getChannelRelCouponPackage(row.id)
        this.packageTableData = res?.map((el) => {
          return {
            ...el,
            package_describe: el.description,
            package_id: el.rel_id
          }
        })
        this.editPageRowData = row
      } catch (error) {
        console.log(error)
      }
    },
    // 选择优惠包
    async openSelectCouponPackageDialog() {
      const res = await this.$picker.couponPackage({
        data: this.packageTableData?.map((el) => el.package_id),
        multiple: true,
        params: {
          regionauth_id: this.editPageRowData?.regionauth_id,
          distributor_id: this.editPageRowData?.distributor_id
        }
      })
      const { data } = res
      this.packageTableData = data?.map((el) => {
        return {
          ...el,
          'cover':
            'https://shopex-onex-yundian-image.oss-cn-shanghai.aliyuncs.com/demo-ecshopx/image/38/2025/04/02/8e6ff39e0169d93052c0c138494772f41743569470419.4af6677e-8d6b-4521-a4d7-c86e0a0be62a.png'
        }
      })
    },
    // 提交券包
    onGroupFormSubmit1: debounce(async function () {
      try {
        const res = await api.channel.saveChannelRelCouponPackage(this.editPageRowData.id, {
          content: JSON.stringify(
            this.packageTableData?.map((el) => {
              return {
                title: el.title,
                rel_id: el.package_id,
                cover: el.cover,
                description: el.package_describe
              }
            })
          )
        })
        this.selectCouponPackShow = false
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 5 * 1000
        })
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    }),
    // 弹窗里面删除
    deleteHandle(row, type) {
      this.$confirm('是否确认删除?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (type == 'liveUrl') {
            this.pagesData = this.pagesData?.filter((el) => el.rel_id !== row.rel_id)
          }
          if (type == 'livePrd') {
            this.selectlivePrdData = this.selectlivePrdData?.filter(
              (el) => el.itemId !== row.itemId
            )
          }
          if (type == 'coupon') {
            console.log(this.couponTableData, row)
            this.couponTableData = this.couponTableData?.filter((el) => el.card_id !== row.card_id)
          }
          if (type == 'couponPackage') {
            this.packageTableData = this.packageTableData?.filter(
              (el) => el.package_id !== row.package_id
            )
          }
        })
        .catch(() => {})
    },
    //以上是推送优惠券
    // 关联页面链接
    async linkPageUrlHandle(row) {
      this.linkPagePathShow = true
      try {
        const res = await api.channel.getChannelRelPages(row.id)
        this.editPageRowData = row
        this.pagesData = res
        const _pagesMap = {}
        res.map((el) => {
          _pagesMap[el.rel_id] = el
        })
        this._pagesMap = _pagesMap
      } catch (error) {
        console.log(error)
      }
    },
    onGroupFormSubmit2: debounce(
      async function () {
        try {
          await api.channel.saveChannelRelPages(this.editPageRowData.id, {
            content: JSON.stringify(this.pagesData)
          })
          this.linkPagePathShow = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 5 * 1000
          })
        } catch (error) {
          console.log(error)
        }
      },
      1000,
      {
        leading: true
      }
    ),
    async openSelectPagePathDialog() {
      const tabs = [
        { label: '自定义页面', name: 'custom_page' },
        { label: '店铺', name: 'store' }
      ]
      const res = await this.$picker.pathV2({
        multiple: true,
        tabs,
        data: this.pagesData.map((el) => el.rel_id),
        params: {
          regionauth_id: this.editPageRowData?.regionauth_id,
          distributor_id: this.editPageRowData?.distributor_id
        }
      })

      this.pagesData = res?.map((item) => {
        if (this._pagesMap[item.id]) {
          return this._pagesMap[item.id]
        }
        return {
          ...item,
          page_type: item.linkPage,
          page_name: item?.title,
          custom_name: '',
          image: '',
          rel_id: item.id
        }
      })
    },
    // 页面地址 - 修改自定义名称
    changeCustomName(val, row) {
      this.changeTableInput(
        {
          custom_name: val
        },
        row
      )
    },
    changeTableInput(afterVal, row) {
      const _id = this.pagesData.findIndex((el) => el.id == row.id)
      const _newItem = {
        ...this.pagesData[_id],
        ...afterVal
      }
      this.pagesData.splice(_id, 1, _newItem)
    },
    // 自定义上传
    handleImgChange(row) {
      this.imgDialog = true
      this.isGetImage = true
      this.pickImgRowData = row
    },
    pickImg(data) {
      this.changeTableInput(
        {
          image: data.url
        },
        this.pickImgRowData
      )
      this.imgDialog = false
      // this.pickImgRowData = null
    },
    closeImgDialog() {
      this.isGetImage = false
      this.imgDialog = false
      this.pickImgRowData = null
    }
  }
}
</script>
<style scoped>
.base-form >>> .el-form {
  margin-right: 0px;
}
</style>
