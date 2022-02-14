<style scoped lang="scss">
.store-name {
  padding-bottom: 5px;
  font-size: 16px;
}
.store-contact {
  color: #888;
  span {
    margin-right: 10px;
  }
}
.store-address {
  color: #888;
}

</style>

<template>
  <div>
    <div v-if="$route.path.indexOf('editor') === -1 && $route.path.indexOf('details') === -1 && $route.path.indexOf('template') === -1">
      <div class="content-bottom-padded" v-if="system_mode === 'standard'">
         <el-alert type="info" title="操作说明" show-icon >
           <div> 自动同步：开启自动同步后，总部添加编辑商品会自动同步上架到到店铺，保留开启前的商品状态。关闭同步后将保留已同步的商品数据 </div>
         </el-alert>
      </div>
      <div style="margin-bottom:10px" v-if="$store.getters.login_type === 'merchant'">
         <el-alert type="info" title="" show-icon >
           <div> 可在设置-店铺管理员添加店铺端账号，登录地址 【 {{origin}}/shopadmin/login 】</div>
         </el-alert>
      </div>
      <el-row class="filter-header" :gutter="20">
        <el-col>
          <el-select v-model="params.is_valid" @change="isValidSelectHandle" placeholder="是否启用">
            <el-option
              v-for="(item, index) in isValidList"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
          <!-- <el-cascader
            placeholder="根据地区筛选"
            :options="regions"
            filterable
            :props="{ checkStrictly: true }"
            @change="RegionChangeSearch"
          ></el-cascader>
          <el-input class="input-m" placeholder="店铺名称" v-model="params.name"></el-input> -->
          <!-- <shop-select distributors @update="storeSearch" :shopIdDefault="form.distributor_id"></shop-select> -->
          <shop-select distributors @update="storeSearch" :shopIdDefault="params.distributor_id"></shop-select>
          <el-cascader
            v-if="system_mode === 'platform'"
            placeholder="选择标签"
            :options="tag.list"
            :props="{value:'tag_id', label: 'tag_name'}"
            v-model="select_tags_value"
            clearable
            @change="TagChangeAction"
          ></el-cascader>
          <el-input class="input-m" placeholder="联系人手机号" v-model="params.mobile">
            <el-button slot="append" icon="el-icon-search" @click="numberSearch"></el-button>
          </el-input>
          <el-select v-model="params.distribution_type" clearable placeholder="选择店铺类型" @change="distribution_typeHandle" v-if="$store.getters.login_type=='normal'">
            <el-option label="加盟" value='1'>加盟</el-option>
            <el-option label="自营" value='0'>自营</el-option>
          </el-select>
          <el-input class="input-m" placeholder="所属商家" v-model="params.merchant_name" v-if="$store.getters.login_type=='normal'">
            <el-button slot="append" icon="el-icon-search" @click="merchant_nameSearch"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col>
          <el-button-group v-if="!is_distributor">
            <el-button type="primary" @click="addDistributorSelf()" v-if="!distributor_self">新增总部自提点</el-button>
            <template v-else>
               <el-button type="primary" @click="editDistributorSelf()" v-if="$store.getters.login_type!='merchant'">编辑总部自提点</el-button>
            </template>
            <el-button
              type="primary"
              v-if="system_mode === 'platform'"
              @click="addDistributorTag"
            >打标签</el-button>
          </el-button-group>
          <el-button
            v-if="!is_distributor"
            :disabled="$store.getters.login_type!='merchant'"
            type="primary"
            plain
            icon="el-icon-circle-plus"
            @click="dialogOpen()"
          >添加店铺</el-button>
          <el-button
            v-if="!is_distributor && $store.getters.login_type!='merchant'"
            type="primary"
            icon="el-icon-circle-plus"
            @click="showSettingDistance()"
          >店铺范围配置</el-button>
        </el-col>
      </el-row>
      <el-card>
        <el-table :data="list" @selection-change="handleSelectionChange" v-loading="loading">
          <el-table-column type="selection" align="center" label="全选"></el-table-column>
          <el-table-column width="50" prop="distributor_id" label="ID"></el-table-column>
          <el-table-column label="店铺">
            <template slot-scope="scope">
              <div class="store-name">{{scope.row.name}}</div>
              <div class="store-contact">
                <span v-if="scope.row.contact">
                  <i class="el-icon-user"></i>
                  {{scope.row.contact}}
                </span>
                <span>
                  <i class="el-icon-mobile"></i>
                  {{scope.row.mobile}}
                </span>
              </div>
              <div v-if="scope.row.store_address" class="store-address">
                <i class="el-icon-place"></i>
                {{scope.row.store_address}}
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column width="80" label="是否分账" v-if="isOpen">
            <template slot-scope="scope" v-if="scope.row.is_valid !== 'delete'">
              <el-switch
                v-model="scope.row.is_open"
                active-color="#13ce66"
                inactive-color="#cccccc"
                active-value="true"
                inactive-value="false"
                @change="switchChangeOpen(scope.$index, scope.row)"
              ></el-switch>
            </template>
          </el-table-column> -->
          <el-table-column width="80" label="商品自动上架且总部发货" v-if="system_mode === 'standard'">
            <template slot-scope="scope" v-if="scope.row.is_valid !== 'delete'">
              <el-switch
                
                v-model="scope.row.auto_sync_goods"
                active-color="#13ce66"
                inactive-color="#cccccc"
                @change="switchChangeAutoSyncGoods(scope.$index, scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <!-- <el-table-column label="审核商品">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.is_audit_goods"  active-color="#13ce66" inactive-color="#cccccc" @change="switchChangeAuditGoods(scope.$index, scope.row)"></el-switch>
            </template>
          </el-table-column>-->
          <el-table-column width="80" label="是否自提">
            <template slot-scope="scope" v-if="scope.row.is_valid !== 'delete'">
              <el-tooltip
                v-if="!scope.row.lng && !scope.row.lat"
                effect="dark"
                content="请先设置店铺坐标"
                placement="top-start"
              >
                <el-switch
                  disabled
                  v-model="scope.row.is_ziti"
                  active-color="#13ce66"
                  inactive-color="#cccccc"
                ></el-switch>
              </el-tooltip>
              <el-switch
                v-else
                v-model="scope.row.is_ziti"
                active-color="#13ce66"
                inactive-color="#cccccc"
                @change="switchChange(scope.$index, scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column width="80" label="快递配送">
            <template slot-scope="scope" v-if="scope.row.is_valid !== 'delete'">
              <el-switch
                v-model="scope.row.is_delivery"
                active-color="#13ce66"
                inactive-color="#cccccc"
                @change="switchChange(scope.$index, scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column width="70" label="状态">
            <template slot-scope="scope">
              <el-button
                @click="editValid(scope.row)"
                v-if="scope.row.is_valid !== 'delete'"
                type="text"
              >
                <span class="green" v-if="scope.row.is_valid == 'true'">
                  启用
                  <i class="el-icon-s-tools"></i>
                </span>
                <span class="red" v-else>
                  禁用
                  <i class="el-icon-s-tools"></i>
                </span>
              </el-button>
              <span v-else class="muted">废弃</span>
            </template>
          </el-table-column>
          <el-table-column label="店铺类型" width="80" v-if="$store.getters.login_type=='normal'">
               <template slot-scope="scope">
                 <span v-if="scope.row.distribution_type=='1'">加盟</span>
                 <span v-else-if="scope.row.distribution_type=='0'">自营</span>
               </template>
          </el-table-column>
          <el-table-column width="80" label="是否默认" v-if="$store.getters.login_type=='normal'">
            <template slot-scope="scope" v-if="scope.row.is_valid !== 'delete'">
              <el-tooltip effect="dark" content="请先启用店铺" placement="top-start">
                <el-switch
                  v-model="scope.row.is_default"
                  active-color="#13ce66"
                  inactive-color="#cccccc"
                  :disabled="(scope.row.is_default || scope.row.is_valid != 'true') ? true : false"
                  @change="defaultSwitchChange(scope.row)"
                ></el-switch>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column v-if="system_mode === 'platform'" prop="tagList" label="标签" class="tab">
            <template slot-scope="scope">
              <el-tag
                closable
                v-for="(taglist) in scope.row.tagList"
                :key="taglist.index"
                :color="taglist.tag_color"
                size="mini"
                :style="'color:'+ taglist.font_color"
                style="display: inline-block; margin-right:3px;"
                @close="handleClose(tag,scope.row,taglist)"
              >{{taglist.tag_name}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="所属商家" width="80" v-if="$store.getters.login_type!='merchant'">
               <template slot-scope="scope">
                 <span>{{scope.row.merchant_name || '-'}}</span>
               </template>
          </el-table-column>
          <el-table-column width="180" label="操作">
            <template slot-scope="scope">
              <router-link
                v-if="scope.row.is_valid !== 'delete' && datapass_block=='0'"
                :to="{ path: matchHidePage('editor'), query: { distributor_id: scope.row.distributor_id}}"
              ><span style="margin-right: 5px">编辑</span></router-link>
              
              <router-link
                v-if="system_mode !== 'platform' && $store.getters.login_type == 'distributor'"
                :to="{ path: $store.getters.login_type == 'distributor' ? '/shopadmin/entity/goodsphysical' : '/store/storemanager/Storeshopitemanagement', query: {distributor_id: scope.row.distributor_id}}"
                style="margin: 0px 5px;"
              >商品</router-link>
              
              <el-button type="text" @click="linkTemplates(scope.row)">店铺装修</el-button>
              <!-- <el-button v-if="system_mode == 'platform'" type="text" @click="dialogShow(scope.row.distributor_id)">店铺装修</el-button> -->
              <!-- <el-button
                v-if="system_mode === 'platform'"
                type="text"
                @click="dialogShow(scope.row.distributor_id,'pc')"
                style="margin-left:0px;margin-top:5px;"
              >PC店铺装修</el-button> -->
              <el-button type="text" @click="showSettingMeiQia(scope.row.distributor_id)">客服</el-button>
              <el-button type="text" v-if="system_mode === 'platform'" @click="downDistributor(scope.row,'store')" >下载店铺码</el-button>
              <el-button type="text" v-else @click="downDistributor(scope.row,'index')" >下载店铺码</el-button>
              <router-link :to="{ path: matchHidePage('details'), query: { distributor_id: scope.row.distributor_id}}" v-if="scope.row.is_openAccount">
                <span style="padding: 0px 5px">详情</span>
              </router-link>
              <el-button class="copy-btn"
                type="text"
                v-clipboard:copy="scope.row.link"
                v-clipboard:success="onCopy">
                <input class="copy-link" type="text" v-model="scope.row.link" />复制店铺链接
              </el-button>
              <!--<el-button type="text" @click="downDistributor(scope.row, 'scancode')">扫码购页面码(微商城)</el-button>-->
              <!-- <router-link :to="{  path: matchInternalRoute('Storeshopitemanagement'), query: {distributor_id: scope.row.distributor_id}}">商品码</router-link> -->
              <!--router-link :to="{ path: matchHidePage('detail'), query: { distributor_id: scope.row.distributor_id, distributor_name: scope.row.name,parentPath: '/mall/marketing/distributor'}}">商品码</router-link-->
            </template>
          </el-table-column>
        </el-table>
        <div class="content-padded content-center">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="params.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="params.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total_count"
          ></el-pagination>
        </div>
      </el-card>
      <el-dialog title="下载店铺码" :visible.sync="downDistributorVal" :close-on-click-modal="false">
        <el-row>
          <el-col :span="8">
            <el-button type="text" @click="downDistributorCode(rowdata,'yykweishop')">微商城小程序</el-button>
          </el-col>
        </el-row>
      </el-dialog>
      <el-dialog :visible.sync="dialogVisible" width="80%" title="编辑店铺首页" fullscreen lock-scroll>
        <shopDecoration :id="current" @saved="closeDialog" />
      </el-dialog>
      <el-dialog
        :visible.sync="pcDialogVisible"
        width="80%"
        title="编辑PC店铺首页"
        fullscreen
        lock-scroll
      >
        <pc-decoration v-if="pcDialogVisible" :id="current" @saved="closeDialog" usage="store" />
      </el-dialog>

      <el-dialog
        title="为商品打标签"
        class="right-dialog"
        :visible.sync="tag.dialog"
        :before-close="handleCancelLabelsDialog"
      >
        <div class="tag-users view-flex view-flex-middle">
          <i class="iconfont icon-user-circle1"></i>
          <div class="view-flex-item">
            <span v-for="item in tag.editItem" :key="item">{{item}}，</span>
          </div>
        </div>
       
        <div class="selected-tags view-flex">
          <div class="label">已选中标签：</div>
          <div class="view-flex-item">
            <el-tag
              :key="index"
              v-for="(tag, index) in tag.currentTags"
              closable
              size="small"
              :disable-transitions="false"
              @close="tagRemove(index)"
            >{{tag.tag_name}}</el-tag>
          </div>
        </div>
        <hr>
        <div>
           <div class="label">全部标签：</div>
          <el-tag
            class="tag-item"
            :key="index"
            v-for="(tag, index) in tag.tags"
            size="medium"
            color="#ffffff"
            :disable-transitions="false"
            @click.native="tagAdd(tag, index)"
          >{{tag.tag_name}}</el-tag>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="tag.dialog = false">取 消</el-button>
          <el-button type="primary" @click="submitItemTag">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="修改状态"
        width="18%"
        :visible.sync="editValidDialog"
        :before-close="handleCancelLabelsDialog"
      >
        <template>
          <el-radio-group v-model="editValidData.is_valid" @change="editValidSubmit">
            <el-radio label="true">启用</el-radio>
            <el-radio label="false">禁用</el-radio>
            <el-radio label="delete">废弃</el-radio>
          </el-radio-group>
        </template>
      </el-dialog>
      <!-- 添加、编辑标识-开始 -->
      <el-dialog
        title="设置美洽参数"
        width="50%"
        :visible.sync="setMeiQiaVisible"
        :before-close="handleMeiQiaCancel"
      >
        <template>
          <el-form ref="meiqia_form" :model="meiqia_form" class="demo-ruleForm" label-width="90px">
            <el-form-item label="企业ID">
              <el-col :span="14">
                <el-input v-model="meiqia_form.meiqia_id" :maxlength="30" placeholder="企业ID"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="客服token">
              <el-col :span="14">
                <el-input v-model="meiqia_form.meiqia_token" :maxlength="50" placeholder="toekn"></el-input>
              </el-col>
            </el-form-item>
          </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="handleMeiQiaCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmitMeiQia">保存</el-button>
        </div>
      </el-dialog>
      <!-- 添加、编辑基础物料-结束 -->

      <!-- 编辑距离-开始 -->
      <el-dialog
        title="店铺范围配置"
        width="50%"
        :visible.sync="setDistanceVisible"
        :before-close="handleDistanceCancel"
      >
        <template>
          <el-form
            ref="distanceForm"
            :model="distanceForm"
            class="demo-ruleForm"
            label-width="90px"
          >
            <el-form-item label="距离">
              <el-input
                min="1"
                type="number"
                oninput="value=value.replace(/[^\d.]/g,'')"
                v-model.number="distanceForm.distance"
                placeholder="只能是大于0的数字"
                style="width: 30%;"
              ></el-input>&nbsp;km
            </el-form-item>
          </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="handleDistanceCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmitDistance">保存</el-button>
        </div>
      </el-dialog>
      <!-- 编辑距离-结束 -->
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { saveDistributor, getDistributorList, getWxaDristributorCodeStream, setDefaultDistributor, saveOpen,NewdeleteTag } from '@/api/marketing'
import { getTagList, distributorRelTags, getDistance, setDistance } from '@/api/marketing'
import { getDistributorMeiQia, setDistributorMeiQia } from '@/api/im'
import district from '../../../common/district.json'
import shopDecoration from '@/components/function/shopDecoration'
import pcDecoration from '@/view/pc/homePage/default'
import { getSetting} from '@/api/fenzhang'
import shopSelect from '@/components/shopSelect'

import store from '@/store'
// 取选中地区的值
function getCascaderObj(val, opt) {
  return val.map(function (value, index, array) {
    for (var itm of opt) {
      if (itm.value === value) {
        opt = itm.children
        return itm
      }
    }
    return null
  })
}

export default {
  data() {
    return {
      origin:'',
      datapass_block:1,
      is_distributor: false,
      dialogVisible: false,
      current: '', // 当前店铺id
      isValidList: [
        { name: '全部', value: '' },
        { name: '启用', value: 'true' },
        { name: '禁用', value: 'false' },
        { name: '废弃', value: 'delete' },
      ],
      changeStatus: true,
      activeName: 'first',
      total_count: 0,
      distributor_self: '',
      detailDialog: false,
      pcDialogVisible: false,
      dialogTitle: '',
      select_tags_value: '',
      loading: false,
      params: {
        page: 1,
        pageSize: 20,
        name: '',
        mobile: '',
        is_valid: '',
        province: '',
        city: '',
        area: '',
        distribution_type:'',
        merchant_name:'',
      },
      form: {
        distributor_id: null,
        mobile: '',
        address: '',
        name: '',
        is_valid: 'true',
        regions_id: [],
        regions: [],
        shop_id: 0,
        contact: '',
        is_distributor: 'true',
      },
      list: [],
      regions: district,
      codetype: 'index',
      rowdata: {},
      downDistributorVal: false,
      distributor_id: [],
      tag: {
        dialog: false,
        editItem: [],
        list: [],
        form: {
          tag_ids: [],
          distributor_id: [],
        },
        currentTags: [],
        tags: [],
      },
      editValidDialog: false,
      editValidData: {
        distributor_id: '',
        is_valid: '',
      },
      setMeiQiaVisible: false,
      setMeiQiaDialog: false,
      meiqia_form: {
        distributor_id: '',
        meiqia_id: '',
        meiqia_token: '',
      },
      setDistanceVisible: false,
      setDistanceDialog: false,
      distanceForm: {
        distance: '',
      },
      isOpen:false,
    }
  },
  components: { shopDecoration, pcDecoration,shopSelect },
  computed: {
    ...mapGetters(['wheight']),
  },
  methods: {
    async handleClose(tag,{distributor_id},{tag_id}){
      const obj ={
        distributor_ids:[distributor_id],
        tag_ids:[tag_id]
      }
      
      const result = await NewdeleteTag(obj);
      this.$message.success('删除成功')
      this.getList();
      console.log(result);

    },
    linkTemplates(distributor) {
      const { distributor_id, address, name } = distributor
      this.$store.dispatch('setTemplateName', 'yykweishop')
      this.$router.push({
        path: this.matchHidePage('template'),
        query: { distributor_id, address, name },
      })
    },
    dialogShow(id, type) {
      this.current = id
      type === 'pc' ? (this.pcDialogVisible = true) : (this.dialogVisible = true)
    },
    closeDialog() {
      this.dialogVisible = false
      this.pcDialogVisible = false
    },
    isValidSelectHandle() {
      this.params.page = 1
      this.getList()
    },
    distribution_typeHandle(){
       this.params.page = 1
       this.getList()
    },
    numberSearch(e) {
      this.params.page = 1
      this.getList()
    },
    merchant_nameSearch(){
      this.params.page = 1;
      this.getList()
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getList()
    },
    dialogOpen(detail = null) {
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    handleDistance() {
      this.distanceForm.distance = ''
      // this.resetInfo();
      // this.operate = "create";
      // this.dialogVisible = true;
    },
    addDistributorSelf() {
      this.$router.push({ path: this.matchHidePage('editor'), query: { distributor_type: 'distributor_self' } })
    },
    editDistributorSelf() {
      this.$router.push({ path: this.matchHidePage('editor'), query: { distributor_type: 'distributor_self', distributor_id: this.distributor_self } })
    },
    getList() {
      // debugger
      this.loading = true
      getDistributorList(this.params).then((response) => {
        // if (response.data.data.list) {
          this.list = response.data.data.list
          this.total_count = response.data.data.total_count
          this.distributor_self = response.data.data.distributor_self
          this.datapass_block = response.data.data.datapass_block;
        // }
        this.loading = false
      })
    },
    downDistributorCode(row, template_name) {
      let params = { distributor_id: row.distributor_id, codetype: this.codetype }
      if (template_name) {
        params.template_name = template_name
      }
      getWxaDristributorCodeStream(params).then((response) => {
        var a = document.createElement('a')
        var temp = '微商城'
        a.href = response.data.data.base64Image
        if (response.data.data.tempname) {
          var temp = response.data.data.tempname
        }
        a.download = temp + row.name + '.png'
        a.click()
      })
    },
    storeSearch(val) {
      // this.RegionChangeSearch(val.regions_value)
      // this.params.distributor_id = val.shop_id
      // this.getList()
      this.params.page = 1;
      val && val.shop_id;
      this.params.distributor_id = val.shop_id;
      this.getList();
    },
    
    RegionChangeSearch(value) {
      var vals = getCascaderObj(value, this.regions)
      if (vals.length == 1) {
        this.params.province = vals[0].label
        this.params.city = ''
        this.params.area = ''
      } else if (vals.length == 2) {
        this.params.province = vals[0].label
        this.params.city = vals[1].label
        this.params.area = ''
      } else if (vals.length == 3) {
        this.params.province = vals[0].label
        this.params.city = vals[1].label
        this.params.area = vals[2].label
      }
      this.params.page = 1
      // this.getList()
    },
    TagChangeAction(value) {
      this.params.tag_id = value
      this.params.page = 1
      this.getList()
    },
    downDistributor(row, codetype) {
      this.codetype = codetype
      this.rowdata = row
      this.downDistributorVal = true
    },
    defaultSwitchChange(row) {
      var params = {
        distributor_id: row.distributor_id,
      }
      setDefaultDistributor(params).then((response) => {
        if (response.data.data.status) {
          for (var i = this.list.length - 1; i >= 0; i--) {
            if (this.list[i].distributor_id != row.distributor_id) {
              this.list[i].is_default = false
            }
          }
        }
      })
    },
    switchChangeAuditGoods(index, row) {
      var params = {
        distributor_id: row.distributor_id,
        is_audit_goods: row.is_audit_goods,
      }
      saveDistributor(params).then((response) => {
        this.detailDialog = false
        this.getList()
        this.$message({
          type: 'success',
          message: '保存成功',
        })
      })
    },
    switchChangeAutoSyncGoods(index, row) {
      var params = {
        distributor_id: row.distributor_id,
        auto_sync_goods: row.auto_sync_goods,
      }
      saveDistributor(params).then((response) => {
        this.detailDialog = false
        this.getList()
        this.$message({
          type: 'success',
          message: '保存成功',
        })
      })
    },
    switchChangeOpen(index, row) {
      var params = {
        distributor_id: row.distributor_id,
        is_open: row.is_open,
      }
      saveOpen(params).then((response) => {
        this.detailDialog = false
        this.getList()
        this.$message({
          type: 'success',
          message: '保存成功',
        })
      })
    },
    switchChange(index, row) {
      var params = {
        distributor_id: row.distributor_id,
        is_ziti: row.is_ziti,
        is_delivery: row.is_delivery,
      }
      saveDistributor(params).then((response) => {
        this.detailDialog = false
        this.getList()
        this.$message({
          type: 'success',
          message: '保存成功',
        })
      })
    },
    handleSelectionChange(val) {
      let distributor_id = []
      for (let i in val) {
        distributor_id.push(val[i].distributor_id)
      }
      this.distributor_id = distributor_id
    },
    getAllTagList() {
      let params = {
        page: 1,
        pageSize: 500,
      }
      getTagList(params).then((response) => {
        this.tag.list = response.data.data.list
      })
    },
    handleCancelLabelsDialog() {
      this.editValidDialog = false
      this.tag.dialog = false
      this.getList()
    },
    tagUpdate(row) {
      this.tag.editItem = [row.itemName]
      this.tag.currentTags = row.tagList || []
      this.tag.form.distributor_id = row.distributor_id
      this.showTags()
    },
    addDistributorTag() {
      this.tag.currentTags = []
      if (this.distributor_id.length) {
        this.showTags()
        this.tag.form.distributor_id = this.distributor_id
      } else {
        this.$message({
          type: 'error',
          message: '请选择至少一个店铺!',
        })
      }
    },
    showTags() {
      this.tag.tags = [...this.tag.list]
      this.tag.tags.forEach((item, index) => {
        let isInArr = this.tag.currentTags.findIndex((n) => n.tag_id == item.tag_id)
        if (isInArr != -1) this.tag.tags.splice(index, 1)
      })
      this.tag.dialog = true
    },
    tagRemove(index) {
      this.tag.tags.unshift(this.tag.currentTags[index])
      this.tag.currentTags.splice(index, 1)
    },
    tagAdd(item, index) {
      let isInArr = this.tag.currentTags.findIndex((n) => n.tag_id == item.tag_id)
      if (isInArr == -1) {
        this.tag.currentTags.push(item)
        this.tag.tags.splice(index, 1)
      }
    },
    submitItemTag() {
      this.tag.form.tag_ids = []
      this.tag.currentTags.forEach((item) => {
        this.tag.form.tag_ids.push(item.tag_id)
      })
      if (this.tag.form.tag_ids.length <= 0) {
        this.$message({
          type: 'error',
          message: '请选择店铺标签',
        })
        return false
      }
      this.tag.dialog = false
      distributorRelTags(this.tag.form).then((res) => {
        if (res.data.data.status) {
          this.$message({
            type: 'success',
            message: '打标签完成',
          })
          this.getList()
        }
      })
    },
    tagSearchUserChange() {
      this.currentPage = 1
      this.getParams()
      this.getItemsList(this.params)
      this.loading = false
    },
    editValid(row) {
      this.editValidDialog = true
      this.editValidData = row
    },
    editValidSubmit(val) {
      let msg = ''
      if (val === 'true') {
        msg = '确定开启店铺？'
      } else if (val === 'false') {
        msg = '禁用后该店铺的订单将无法处理，同时如首页装修有该店铺或店铺商品将无法正常购买，请确认是否禁用？'
      } else if (val === 'delete') {
        msg = '废弃后该店铺的订单将无法处理，同时如首页装修有该店铺或店铺商品将无法正常购买，且该店铺废弃后不可找回，请确认是否废弃？'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          let params = {
            distributor_id: this.editValidData.distributor_id,
            is_valid: this.editValidData.is_valid,
          }
          saveDistributor(params).then((response) => {
            this.detailDialog = false
            this.getList()
            this.$message({
              type: 'success',
              message: '已修改',
            })
            this.editValidDialog = false

          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          })
        })
      },
      showSettingMeiQia (distributor_id) { // 设置美洽参数
        this.setMeiQiaVisible = true
        let that = this
        getDistributorMeiQia(distributor_id).then(response => {
          that.meiqia_form.meiqia_id = response.data.data.meiqia_id
          that.meiqia_form.meiqia_token = response.data.data.meiqia_token
        })
        that.meiqia_form.distributor_id = distributor_id
        console.log(this.meiqia_form)
      },
      handleMeiQiaCancel () { // 美洽设置窗口关闭
        this.setMeiQiaVisible = false
        this.meiqia_form.distributor_id = ''
        this.meiqia_form.meiqia_id = ''
        this.meiqia_form.meiqia_token = ''
      },
      handleSubmitMeiQia () { // 提交美洽配置
        let params = {
          meiqia_id: this.meiqia_form.meiqia_id,
          meiqia_token: this.meiqia_form.meiqia_token,
        }
        setDistributorMeiQia(this.meiqia_form.distributor_id, params).then(response => {
            this.$message({
              type: 'success',
              message: '已提交'
            })
          this.handleMeiQiaCancel()
        })
      },
      showSettingDistance () { // 设置距离参数
        this.setDistanceVisible = true
        let that = this
        getDistance().then(response => {
          that.distanceForm.distance = response.data.data.distance
        })
        console.log(this.distanceForm)
      },
      handleDistanceCancel () { // 距离设置窗口关闭
        this.setDistanceVisible = false
        this.distanceForm.distance = ''
      },
      handleSubmitDistance () { // 提交距离配置
        let params = {
          distance: this.distanceForm.distance,
        }
        setDistance(params).then(response => {
            this.$message({
              type: 'success',
              message: '提交成功'
            })
          this.handleDistanceCancel()
        })
      },
      handleSizeChange (pageSize) {
        this.params.page = 1
        this.params.pageSize = pageSize
        this.getList()
      },
      onCopy () {
        this.$notify.success({
          message: '复制成功',
          showClose: true
        });
      },
    },
    
  mounted() {
    this.origin = window.location.origin;
    if (store.getters.login_type === 'distributor') {
      this.is_distributor = true
    }
    this.getList()
    this.getAllTagList()
    getSetting().then(res=>{
      let data = res.data.data
      this.isOpen = data.is_open == 'true' 
    })
    
  },
  beforeRouteUpdate(to, from, next) {
    next()
    if (to.path.indexOf('editor') === -1 && to.path.indexOf('details') === -1) {
      this.getList()
      this.getAllTagList()
    }
  },
}
</script>
