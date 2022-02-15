<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-row class="filter-header" :gutter="20">
        <el-col>
          <el-autocomplete
            class="inline-input"
            v-model="currentShop"
            :fetch-suggestions="queryStoreSearch"
            placeholder="请输入店铺名称"
            @select="storeSearch"
          ></el-autocomplete>
          <el-date-picker class="input-m" v-model="create_time" type="daterange" value-format="yyyy/MM/dd" placeholder="选择日期范围" @change="dateChange"></el-date-picker>
          <el-input class="input-m" placeholder="订单号" v-model="identifier">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
          <el-input class="input-m" placeholder="售后单号" v-model="aftersales_bn">
            <el-button slot="append" icon="el-icon-search" @click="aftersalesBnSearch"></el-button>
          </el-input>
          <el-input class="input-m" placeholder="手机号" v-model="mobile">
            <el-button slot="append" icon="el-icon-search" @click="mobileSearch"></el-button>
          </el-input>
          <el-select v-model="aftersales_status" @change="aftersalesStatusSelectHandle" placeholder="售后状态">
            <el-option
              v-for="(item, index) in aftersalesStatusList"
              :key="index"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="aftersales_type" @change="TypeHandle" placeholder="请选择售后类型">
            <el-option
              v-for="(item, index) in $store.getters.login_type=='merchant'?aftersalesTypeList2:aftersalesTypeList"
              :key="index"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
          <export-tip @exportHandle='exportData'>
            <el-button type="primary">导出</el-button>
          </export-tip>
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            content="导出任务会以队列执行，点击导出后，请至‘设置-导出列表’页面中查看及下载数据">
            <i class="el-icon-question" slot="reference"></i>
          </el-popover>
          <el-button v-if="$store.getters.login_type!='merchant' && $store.getters.login_type!='distributor'" type="primary" @click="aftersalesRemindAction">售后提醒内容</el-button>
        </el-col>
      </el-row>
      <el-card>
        <el-table :data="list" v-loading="loading" element-loading-text="数据加载中">
          <el-table-column prop="create_time" width="200" label="售后单">
            <template slot-scope="scope">
              <div class="order-num">
                <router-link target="_blank" 
                :to="{ path: `${$store.getters.login_type}` == 'distributor' && '/shopadmin/order/entitytrade/aftersaleslist/detail' ||
                 `${$store.getters.login_type}` == 'merchant' && '/merchant/order/aftersaleslist/detail' || '/order/entitytrade/aftersaleslist/detail' , query: { aftersales_bn: scope.row.aftersales_bn }}">{{scope.row.aftersales_bn}}</router-link>
                <el-tooltip effect="dark" content="复制" placement="top-start">
                  <i v-clipboard:copy="scope.row.aftersales_bn" v-clipboard:success="onCopy" class="el-icon-document-copy"></i>
                </el-tooltip>
              </div>
              <div class="order-time">
                <el-tooltip effect="dark" content="申请时间" placement="top-start">
                  <i class="el-icon-time"></i>
                </el-tooltip>
                {{scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss')}}
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="150" label="订单">
            <template slot-scope="scope">
              <div class="order-num">
                <router-link target="_blank" :to="{ path: `${$store.getters.login_type}` == 'distributor' && '/shopadmin/order/entitytrade/tradenormalorders/detail' || 
                 `${$store.getters.login_type}` == 'merchant' && '/merchant/order/tradenormalorders/detail' || '/order/entitytrade/tradenormalorders/detail', query: { orderId: scope.row.order_id }}">{{scope.row.order_id}}</router-link>
                <el-tooltip effect="dark" content="复制" placement="top-start">
                  <i v-clipboard:copy="scope.row.order_id" v-clipboard:success="onCopy" class="el-icon-document-copy"></i>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="150" label="手机号">
            <template slot-scope="scope">
              <div class="order-num" v-if="!scope.row.user_delete &&  $store.getters.login_type!=='merchant'">
                <router-link target="_blank" :to="{ path: `${$store.getters.login_type != 'distributor' ? '' : '/shopadmin'}` + '/member/member/detail', query: { user_id: scope.row.user_id }}">{{scope.row.mobile}}</router-link>
              </div>
              <template v-else>
                {{scope.row.mobile}}
              </template>
            </template>
          </el-table-column>
          <el-table-column width="100" label="售后类型">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.aftersales_type == 'ONLY_REFUND'" type="info" size="mini">仅退款</el-tag>
              <el-tag v-if="scope.row.aftersales_type == 'REFUND_GOODS'" type="warning" size="mini">退货退款</el-tag>
              <el-tag v-if="scope.row.aftersales_type == 'EXCHANGING_GOODS'" type="danger" size="mini">换货</el-tag>
            </template>
          </el-table-column>
          <el-table-column width="100" label="售后状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.aftersales_status == '0'" size="mini">待处理</el-tag>
              <el-tag v-if="scope.row.aftersales_status == '1'" size="mini">处理中</el-tag>
              <el-tag v-if="scope.row.aftersales_status == '2'" type="success" size="mini">已处理</el-tag>
              <el-tag v-if="scope.row.aftersales_status == '3'" type="success" size="mini">已驳回</el-tag>
              <el-tag v-if="scope.row.aftersales_status == '4'" type="success" size="mini">已关闭</el-tag>
            </template>
          </el-table-column>
          <el-table-column width="100" label="操作">
            <template slot-scope="scope">
              <router-link :to="{ path: matchHidePage('detail'), query: { aftersales_bn: scope.row.aftersales_bn, resource: $route.path}}">详情</router-link>
              <template v-if="scope.row.distributor_id=='0' ||  $store.getters.login_type=='distributor' "> 
                 <el-button type="text" @click="clickShowRemark(scope.row,'afterList')">备注 </el-button>
              </template>
             
            </template>
         
          </el-table-column>
        </el-table>
        <div class="content-padded content-center">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :current-page.sync="params.page"
            :page-sizes="[10,20,50]"
            :total="total_count"
            :page-size="params.pageSize">
          </el-pagination>
        </div>
      </el-card>
      <!-- 售后提醒内容 -开始 -->
      <el-dialog :title="aftersalesRemindTitle" :visible.sync="aftersalesRemindVisible"  :before-close="handleCancel" width="65%">
        <template>
          <el-form ref="aftersalesRemindForm" :model="aftersalesRemindForm" class="demo-ruleForm" label-width="100px">
            <el-form-item label="提醒内容">
              <template>
                <vue-html5-editor :content="aftersalesRemindForm.intro.toString()" ref="editor" @change="updateContent" :height="360"></vue-html5-editor>
              </template>
              <span class="frm-tips">例如：由于商品的特殊性，如涉及机油类产品需寄回，建议使用京东快递，快递公司联系电话955XX。</span>
            </el-form-item>
            <el-form-item label="是否启用">
              <el-switch v-model="aftersalesRemindForm.is_open" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
              <br />
              <span class="frm-tips">如开启展示，则后台所输入内容将会展示在前端消费者提交售后申请的页面上，内容不超过200字</span>
            </el-form-item>
          </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="handleCancel">取消</el-button>
          <el-button type="primary" @click="submitAftersalesRemind">确定</el-button>
        </div>
      </el-dialog>
      <RemarkModal ref='modalRef' @onDone="handleRemarksDone" />
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { getDistributorList } from '../../../api/marketing'
  import { getAftersalesList, exportList, getAftersalesRemind, setAftersalesRemind } from '../../../api/aftersales'
  import RemarkModal from "@/components/remarkModal";
  import remarkMixin from "@/mixins/remarkMixin";
  export default {
    components: { 
      RemarkModal,
    },
    mixins: [remarkMixin],
    data () {
      return {
        currentShop: '',
        loading: false,
        create_time: '',
        params: {
          page: 1,
          pageSize: 20
        },
        aftersalesStatusList: [
          {name: '待处理', value: '0'},
          {name: '处理中', value: '1'},
          {name: '已处理', value: '2'},
          {name: '已驳回', value: '3'}
        ],
        aftersalesTypeList: [
          {name: '仅退款', value: 'ONLY_REFUND'},
          {name: '退货退款', value: 'REFUND_GOODS'},
          {name: '换货', value: 'EXCHANGING_GOODS'}
        ],
        aftersalesTypeList2: [
          {name: '仅退款', value: 'ONLY_REFUND'},
          {name: '退货退款', value: 'REFUND_GOODS'},
        ],
        aftersales_type: '',
        aftersales_status: '',
        aftersales_bn: '',
        time_start_begin: '',
        time_start_end: '',
        total_count: 0,
        list: [],
        identifier: '',
        mobile: '',
        wxShopsList: [],
        aftersalesRemindForm: {
          intro: '',
          is_open: false
        },
        aftersalesRemindVisible: false,
        aftersalesRemindTitle: '售后提醒内容'
      }
    },
    computed: {
      ...mapGetters([
        'wheight'
      ])
    },
    methods: {
      onCopy () {
        this.$notify.success({
          message: '复制成功',
          showClose: true
        });
      },
      shopHandle (val) {
        this.currentShop = val
        this.params.shop_id = val
        this.params.page = 1
        this.getParams()
        this.getAftersalesList(this.params)
      },
      TypeHandle (val) {
        this.params.aftersales_type = val
        this.getParams()
        this.getAftersalesList(this.params)
      },
      aftersalesStatusSelectHandle () {
        this.params.aftersales_status = this.aftersales_status
        this.params.page = 1
        this.getParams()
        this.getAftersalesList(this.params)
      },
      search (e) {
        this.params.page = 1
        this.getParams()
        this.getAftersalesList(this.params)
      },
      aftersalesBnSearch() {
        this.getParams()
        this.getAftersalesList(this.params)
      },
      mobileSearch() {
        this.params.page = 1
        this.getParams()
        this.getAftersalesList(this.params)
      },
      dateChange (val) {
        if (val.length > 0) {
          this.time_start_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
          this.time_start_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
        } else {
          this.time_start_begin = ''
          this.time_start_end = ''
        }
        this.params.page = 1
        this.getParams()
        this.getAftersalesList(this.params)
      },
      sourceSearch(item) {
        this.params.source_id = item.source_id
        this.params.page = 1
        this.getParams()
        this.getAftersalesList(this.params)
      },
      handleCurrentChange (val) {
        this.params.page = val
        this.loading = false
        this.getParams()
        this.getAftersalesList(this.params)
      },
      handleSizeChange (pageSize) {
        this.loading = false
        this.params.page = 1
        this.params.pageSize = pageSize
        this.getParams()
        this.getAftersalesList(this.params)
      },
      getParams () {
        this.params.time_start_begin = this.time_start_begin
        this.params.time_start_end = this.time_start_end
        this.params.order_type = this.order_type
        this.params.aftersales_bn = this.aftersales_bn
        this.params.order_id = this.identifier
        this.params.mobile = this.mobile
      },
      dateStrToTimeStamp (str) {
        return Date.parse(new Date(str))/1000
      },
      getAftersalesList(filter) {
        this.loading = true
        getAftersalesList(filter).then(response => {
          this.list = response.data.data.list
          this.total_count = Number(response.data.data.total_count)
          this.loading = false
        })
      },
      querySearch(queryString, cb) {
        var restaurants = this.source_list;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        }
      },
      getStoreList () {
        this.loading = true
        let params = {page: 1, pageSize: 500}
        getDistributorList(params).then(response => {
          if(response.data.data.list) {
            response.data.data.list.forEach(row => {
              this.wxShopsList.push({'value': row.name, 'distributor_id': row.distributor_id})
            })
          }
          this.loading = false
        })
      },
      queryStoreSearch(queryString, cb) {
        var restaurants = this.wxShopsList
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      storeSearch(item) {
        this.params.distributor_id = item.distributor_id
        this.params.page = 1
        this.getParams()
        this.getAftersalesList(this.params)
      },
      exportData () {
          this.getParams()
          this.params.page = 1
          exportList(this.params).then(response => {
              if (response.data.data.status) {
                  this.$message({
                      type: 'success',
                      message: '已加入执行队列，请在设置-导出列表中下载'
                  })
                  return
              } else if (response.data.data.url) {
                  this.downloadUrl = response.data.data.url
                  this.downloadName = response.data.data.filename
                  this.downloadView = true
              } else {
                  this.$message({
                      type: 'error',
                      message: '没有相关数据可导出'
                  })
              }
          })
      },
      aftersalesRemindAction () {
        // 请求提醒数据
        getAftersalesRemind().then(response => {
          if(response.data.data) {
            this.aftersalesRemindForm = response.data.data
          }
        })
        this.aftersalesRemindVisible = true
        
      },
      updateContent: function (data) {
        this.aftersalesRemindForm.intro = data
      },
      handleCancel () {
        this.aftersalesRemindVisible = false
        this.aftersalesRemindForm.intro = ''
        this.aftersalesRemindForm.is_open = false
      },
      submitAftersalesRemind () {
        let params = {
          intro: this.aftersalesRemindForm.intro,
          is_open: this.aftersalesRemindForm.is_open,
        }
        setAftersalesRemind(params).then(response => {
          this.$message({
            type: 'success',
            message: '保存成功'
          }),
          this.aftersalesRemindVisible = false
        })
      }
    },
    mounted () {
      this.getStoreList()
      this.getAftersalesList(this.params)
    },
    watch:{
      $route(to,from){
        console.log(to.path);
        this.getAftersalesList(this.params)
      }
    },
  }
</script>
