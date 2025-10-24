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
  <SpPage>
    <div class="page-body">
      <template v-if="$route.path.indexOf('detail') === -1">
        <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
          <SpFilterFormItem v-if="!VERSION_B2C()" prop="distributor" label="店铺名称:">
            <el-autocomplete
              v-model="params.distributor.name"
              :fetch-suggestions="queryStoreSearch"
              placeholder="请输入店铺名称"
              @select="handleSelectStore"
            />
          </SpFilterFormItem>
          <SpFilterFormItem prop="create_time" label="日期范围:">
            <el-date-picker
              v-model="params.create_time"
              type="daterange"
              value-format="yyyy/MM/dd"
              placeholder="选择日期范围"
            />
          </SpFilterFormItem>
          <SpFilterFormItem prop="order_id" label="订单号:">
            <el-input v-model="params.order_id" placeholder="订单号" />
          </SpFilterFormItem>
          <SpFilterFormItem prop="aftersales_bn" label="售后单号:">
            <el-input v-model="params.aftersales_bn" placeholder="请填写售后单号" />
          </SpFilterFormItem>
          <SpFilterFormItem prop="mobile" label="手机号:">
            <el-input v-model="params.mobile" placeholder="手机号" />
          </SpFilterFormItem>
          <SpFilterFormItem prop="aftersales_status" label="售后状态:">
            <el-select v-model="params.aftersales_status" clearable placeholder="售后状态">
              <el-option
                v-for="(item, index) in aftersalesStatusList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </SpFilterFormItem>
          <SpFilterFormItem prop="aftersales_type" label="售后类型:">
            <el-select v-model="params.aftersales_type" placeholder="请选择售后类型">
              <el-option
                v-for="(item, index) in $store.getters.login_type == 'merchant'
                  ? aftersalesTypeListOther
                  : aftersalesTypeList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </SpFilterFormItem>
          <SpFilterFormItem prop="item_bn" label="SKU编号:">
            <el-input v-model="params.item_bn" placeholder="SKU编号" />
          </SpFilterFormItem>

          <SpFilterFormItem
            v-if="VERSION_STANDARD() || IS_ADMIN()"
            prop="supplier_name"
            label="来源供应商:"
          >
            <el-input v-model="params.supplier_name" placeholder="请输入来源供应商" />
          </SpFilterFormItem>
          <SpFilterFormItem
            v-if="VERSION_STANDARD() || IS_ADMIN()"
            prop="order_holder"
            label="订单分类:"
          >
            <el-select v-model="params.order_holder" clearable placeholder="请选择">
              <el-option
                v-for="item in orderCategory"
                :key="item.value"
                size="mini"
                :label="item.title"
                :value="item.value"
              />
            </el-select>
          </SpFilterFormItem>
          <SpFilterFormItem v-if="IS_SUPPLIER()" prop="distributor_id" label="来源店铺:">
            <SpSelectShop v-model="params.distributor_id" clearable placeholder="请选择" />
          </SpFilterFormItem>
          <SpFilterFormItem prop="order_class" label="订单类型:">
            <el-select v-model="params.order_class" clearable placeholder="请选择">
              <el-option
                v-for="item in orderType"
                :key="item.value"
                size="mini"
                :label="item.title"
                :value="item.value"
              />
            </el-select>
          </SpFilterFormItem>
          <SpFilterFormItem
            v-if="is_pharma_industry"
            prop="is_prescription_order"
            label="是否处方药:"
          >
            <el-select v-model="params.is_prescription_order" clearable placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </SpFilterFormItem>
          <!-- <SpFilterFormItem v-if="is_pharma_industry" prop="user_family_name" label="用药人姓名:">
          <el-input v-model="params.user_family_name" placeholder="请输入用药人姓名" />
        </SpFilterFormItem> -->
        </SpFilterForm>

        <div class="action-container">
          <el-button type="primary" @click="exportData"> 导出 </el-button>
          <el-button v-if="showAftersale" type="primary" @click="aftersalesRemindAction">
            售后提醒内容
          </el-button>
        </div>

        <el-table v-loading="loading" border :data="tableList" element-loading-text="数据加载中">
          <el-table-column prop="create_time" width="200" label="售后单">
            <template slot-scope="scope">
              <div class="order-num">
                <el-button type="text">
                  <router-link
                    target="_blank"
                    :to="{ path: getUrlPathByLoginType(`/order/order-manage/aftersales-list/detail?aftersales_bn=${scope.row.aftersales_bn}`) }"
                  >
                  {{ scope.row.aftersales_bn }}
                </router-link>
              </el-button>
                <el-tooltip effect="dark" content="复制" placement="top-start">
                  <i
                    v-clipboard:copy="scope.row.aftersales_bn"
                    v-clipboard:success="onCopySuccess"
                    class="el-icon-document-copy"
                  />
                </el-tooltip>
              </div>
              <div v-if="scope.row.distributor_id !== '0'" class="order-store">
                <el-tooltip effect="dark" content="店铺名" placement="top-start">
                  <i class="el-icon-office-building" />
                </el-tooltip>
                {{ scope.row.distributor_info.name }}
              </div>
              <div class="order-time">
                <el-tooltip effect="dark" content="申请时间" placement="top-start">
                  <i class="el-icon-time" />
                </el-tooltip>
                {{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="180" label="订单号">
            <template slot-scope="scope">
              <div class="order-num">
                <el-button type="text">
                  <router-link
                    target="_blank"
                    :to="{ path: getUrlPathByLoginType(`/order/order-manage/order-list/detail?orderId=${scope.row.order_id}`) }"
                  >
                    {{ scope.row.order_id }}
                  </router-link>
                </el-button>
                <el-tooltip effect="dark" content="复制" placement="top-start">
                  <i
                    v-clipboard:copy="scope.row.order_id"
                    v-clipboard:success="onCopySuccess"
                    class="el-icon-document-copy"
                  />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="VERSION_STANDARD() || IS_ADMIN()"
            width="120"
            label="订单分类"
            header-align="center"
            prop="order_holder"
          >
            <template slot-scope="scope">
              {{ getOrderCategoryName(scope.row.order_holder) }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="VERSION_STANDARD() || IS_ADMIN()"
            min-width="100"
            prop="supplier_name"
            label="来源供应商"
          />
          <el-table-column
            width="120"
            label="退款金额（¥）"
            header-align="center"
            prop="refund_fee"
          />
          <el-table-column width="120" label="退款运费（¥）" header-align="center">
            <template slot-scope="scope">
              {{ scope.row.freight / 100 }}
            </template>
          </el-table-column>
          <el-table-column
            width="160"
            label="退款抵扣积分（¥）"
            header-align="center"
            prop="refund_point"
          />
          <el-table-column v-if="!IS_SUPPLIER()" label="配送员">
            <template slot-scope="scope">
              {{ scope.row.self_delivery_operator_name }}
            </template>
          </el-table-column>
          <el-table-column v-if="!IS_SUPPLIER()" prop="mobile" label="业务员">
            <template slot-scope="scope">
              {{ scope.row.salesman_mobile }}
              <el-tooltip
                effect="dark"
                content="复制"
                placement="top-start"
              >
                <i
                  v-clipboard:copy="scope.row.salesman_mobile"
                  v-clipboard:success="onCopySuccess"
                  class="el-icon-document-copy"
                  v-if="scope.row.salesman_mobile"
                />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column v-if="!IS_SUPPLIER()" min-width="150" label="手机号">
            <template slot-scope="scope">
              <div
                v-if="!scope.row.user_delete && $store.getters.login_type !== 'merchant'"
                class="order-num"
              >
                <router-link
                  v-if="
                    $store.getters.login_type != 'supplier' &&
                    $store.getters.login_type != 'distributor'
                  "
                  target="_blank"
                  :to="{
                    path:
                      `${$store.getters.login_type != 'distributor' ? '' : '/shopadmin'}` +
                      '/member/member/memberlist/detail',
                    query: { user_id: scope.row.user_id }
                  }"
                >
                  {{ scope.row.mobile }}
                </router-link>
              </div>
              <template v-else>
                {{ scope.row.mobile }}
              </template>
            </template>
          </el-table-column>
          <el-table-column v-if="IS_SUPPLIER()" min-width="100" prop="contact" label="姓名" />
          <el-table-column v-if="IS_SUPPLIER()" min-width="150" label="SKU编号">
            <template slot-scope="scope">
              <span>{{ scope.row.detail[0].item_bn }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="IS_SUPPLIER()" min-width="100" label="商品名称">
            <template slot-scope="scope">
              <span>{{ scope.row.detail[0].item_name }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="IS_SUPPLIER()" min-width="120" label="售后商品数量">
            <template slot-scope="scope">
              <span>{{ scope.row.detail[0].num }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="IS_SUPPLIER()" min-width="100" label="金额">
            <template slot-scope="scope">
              <span>{{ scope.row.detail[0].refund_fee / 100 }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="IS_SUPPLIER()" min-width="100" label="售后原因" prop="reason" />
          <el-table-column
            v-if="IS_SUPPLIER()"
            min-width="100"
            label="修改时间"
            prop="update_time"
          />
          <el-table-column width="100" label="售后类型">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.aftersales_type == 'ONLY_REFUND'" type="info" size="mini">
                仅退款
              </el-tag>
              <el-tag v-if="scope.row.aftersales_type == 'REFUND_GOODS'" type="warning" size="mini">
                退货退款
              </el-tag>
              <el-tag
                v-if="scope.row.aftersales_type == 'EXCHANGING_GOODS'"
                type="danger"
                size="mini"
              >
                换货
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column width="100" label="售后状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.aftersales_status == '0'" size="mini"> 待处理 </el-tag>
              <el-tag v-if="scope.row.aftersales_status == '1'" size="mini"> 处理中 </el-tag>
              <el-tag v-if="scope.row.aftersales_status == '2'" type="success" size="mini">
                已处理
              </el-tag>
              <el-tag v-if="scope.row.aftersales_status == '3'" type="success" size="mini">
                已驳回
              </el-tag>
              <el-tag v-if="scope.row.aftersales_status == '4'" type="success" size="mini">
                已关闭
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column width="100" label="操作" fixed="left">
            <template slot-scope="scope">
              <el-button type="text">
                <router-link
                  :to="{
                    path: matchRoutePath('detail'),
                    query: { aftersales_bn: scope.row.aftersales_bn, resource: $route.path }
                  }"
                >
                  详情
                </router-link>
              </el-button>
              <template
                v-if="scope.row.distributor_id == '0' || $store.getters.login_type == 'distributor'"
              >
                <el-button type="text" @click="clickShowRemark(scope.row, 'afterList')">
                  备注
                </el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <div class="mt-4 text-right">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :current-page.sync="page.pageIndex"
            :page-sizes="[10, 20, 50]"
            :total="page.total"
            :page-size="page.pageSize"
            @current-change="onCurrentChange"
            @size-change="onSizeChange"
          />
        </div>

        <!-- 售后提醒内容 -开始 -->
        <el-dialog
          :title="aftersalesRemindTitle"
          :visible.sync="aftersalesRemindVisible"
          :before-close="handleCancel"
          width="65%"
        >
          <template>
            <el-form
              ref="aftersalesRemindForm"
              :model="aftersalesRemindForm"
              class="demo-ruleForm"
              label-width="100px"
            >
              <el-form-item label="提醒内容">
                <template>
                  <SpRichText v-model="aftersalesRemindForm.intro" />
                </template>
                <span class="frm-tips"
                  >例如：由于商品的特殊性，如涉及机油类产品需寄回，建议使用京东快递，快递公司联系电话955XX。</span
                >
              </el-form-item>
              <el-form-item label="是否启用">
                <el-switch
                  v-model="aftersalesRemindForm.is_open"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
                <br>
                <span class="frm-tips"
                  >如开启展示，则后台所输入内容将会展示在前端消费者提交售后申请的页面上，内容不超过200字</span
                >
              </el-form-item>
            </el-form>
          </template>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="handleCancel"> 取消 </el-button>
            <el-button type="primary" @click="submitAftersalesRemind"> 确定 </el-button>
          </div>
        </el-dialog>
        <RemarkModal ref="modalRef" @onDone="handleRemarksDone" />
      </template>
      <router-view />
    </div>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import RemarkModal from '@/components/remarkModal'
import mixin, { pageMixin, remarkMixin } from '@/mixins'
import { VERSION_B2C, IS_SUPPLIER, getUrlPathByLoginType } from '@/utils'
import { ORDER_CATEGORY, ORDER_TYPE } from '@/consts'
export default {
  components: {
    RemarkModal
  },
  mixins: [mixin, remarkMixin, pageMixin],
  data() {
    const initialParams = {
      distributor: {
        id: undefined,
        name: undefined
      },
      create_time: '',
      receiver_mobile: '',
      order_id: undefined,
      aftersales_bn: undefined,
      mobile: undefined,
      aftersales_status: undefined,
      aftersales_type: undefined,
      original_order_id: undefined,
      item_bn: undefined,
      supplier_name: undefined,
      order_holder: undefined,
      distributor_id: undefined,
      order_class: undefined,
      yyrname: undefined,
      is_prescription_order: undefined,
      user_family_name: undefined
    }
    return {
      loading: false,
      initialParams,
      params: {
        ...initialParams
      },
      is_pharma_industry: false,
      orderCategory: ORDER_CATEGORY,
      shopList: [],
      aftersalesStatusList: [
        { name: '待处理', value: '0' },
        { name: '处理中', value: '1' },
        { name: '已处理', value: '2' },
        { name: '已驳回', value: '3' }
      ],
      aftersalesTypeList: [
        { name: '仅退款', value: 'ONLY_REFUND' },
        { name: '退货退款', value: 'REFUND_GOODS' }
        // { name: '换货', value: 'EXCHANGING_GOODS' }
      ],
      aftersalesTypeListOther: [
        { name: '仅退款', value: 'ONLY_REFUND' },
        { name: '退货退款', value: 'REFUND_GOODS' }
      ],
      aftersalesRemindForm: {
        intro: '',
        is_open: false
      },
      aftersalesRemindVisible: false,
      aftersalesRemindTitle: '售后提醒内容',
      orderType: ORDER_TYPE
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    showAftersale() {
      return (
        this.$store.getters.login_type != 'merchant' &&
        this.$store.getters.login_type != 'distributor'
      )
    }
  },
  watch: {
    $route(to, from) {},
    'params.distributor': {
      handler: function (val) {
        if (!val.name && val.id) {
          this.params.distributor = {
            id: undefined,
            name: undefined
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    if (this.$route.query.aftersales_status) {
      this.params.aftersales_status = this.$route.query.aftersales_status
    }
    this.getBaseSetting()
    //获取所有店铺
    this.getStoreList()
    this.fetchList()
  },
  methods: {
    async getBaseSetting() {
      const res = await this.$api.company.getGlobalSetting()
      this.is_pharma_industry = res.medicine_setting?.is_pharma_industry == '1'
    },
    handleSelectStore(storeItem) {
      this.params.distributor.id = storeItem.distributor_id
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    dateTransfer(val) {
      let time_start_begin = undefined
      let time_start_end = undefined
      if (val.length > 0) {
        time_start_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        time_start_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      }
      return {
        time_start_begin,
        time_start_end
      }
    },
    getParams() {
      let params = {
        ...this.dateTransfer(this.params.create_time),
        order_id: this.params.order_id || undefined,
        aftersales_bn: this.params.aftersales_bn || undefined,
        mobile: this.params.mobile || undefined,
        receiver_mobile: this.params.receiver_mobile || undefined,
        aftersales_status: this.params.aftersales_status || undefined,
        aftersales_type: this.params.aftersales_type || undefined,
        supplier_name: this.params.supplier_name || undefined,
        order_holder: this.params.order_holder || undefined,
        distributor_id: this.params.distributor_id || undefined,
        order_class: this.params.order_class || undefined,
        yyrname: this.params.yyrname || undefined,
        is_prescription_order: this.params.is_prescription_order || undefined,
        user_family_name: this.params.user_family_name || undefined
      }
      return params
    },
    onReset() {
      this.params = { ...this.initialParams }
      this.params = {
        ...this.params,
        distributor: {
          id: undefined,
          name: undefined
        }
      }
      this.onSearch()
    },
    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.getParams()
      }
      const { list, total_count } = await this.$api.aftersales.getAftersalesList(params)
      this.tableList = list
      this.page.total = total_count
      this.loading = false
    },
    querySearch(queryString, cb) {
      var restaurants = this.source_list
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return restaurant => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    async getStoreList() {
      let params = { page: 1, pageSize: 500 }
      const { list } = await this.$api.marketing.getDistributorList(params)
      if (list) {
        list.forEach(row => {
          this.shopList.push({ value: row.name, distributor_id: row.distributor_id })
        })
      }
    },
    queryStoreSearch(queryString, cb) {
      var restaurants = this.shopList
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    getOrderCategoryName(order_holder) {
      return this.orderCategory.find(item => item.value == order_holder)?.title ?? ''
    },
    async exportData() {
      const { status, url, filename } = await this.$api.aftersales.exportList(this.getParams())
      if (status) {
        this.$message({
          type: 'success',
          message: '已加入执行队列，请在设置-导出列表中下载'
        })
        this.$export_open('aftersale_record_count')
        return
      } else if (url) {
        this.downloadUrl = url
        this.downloadName = filename
        this.downloadView = true
      } else {
        this.$message({
          type: 'error',
          message: '没有相关数据可导出'
        })
      }
    },
    async aftersalesRemindAction() {
      // 请求提醒数据
      const data = await this.$api.aftersales.getAftersalesRemind()

      if (data) {
        this.aftersalesRemindForm = data
      }

      this.aftersalesRemindVisible = true
    },
    updateContent: function (data) {
      this.aftersalesRemindForm.intro = data
    },
    handleCancel() {
      this.aftersalesRemindVisible = false
      this.aftersalesRemindForm.intro = ''
      this.aftersalesRemindForm.is_open = false
    },
    async submitAftersalesRemind() {
      let params = {
        intro: this.aftersalesRemindForm.intro,
        is_open: this.aftersalesRemindForm.is_open
      }
      await this.$api.aftersales.setAftersalesRemind(params)
      this.$message({
        type: 'success',
        message: '保存成功'
      })
      this.aftersalesRemindVisible = false
    }
  }
}
</script>
