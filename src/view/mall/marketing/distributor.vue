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
.sp-filter-form {
  margin-bottom: 16px;
}
.tips {
  font-size: 12px;
  color: #777;
  line-height: initial;
}
</style>

<template>
  <div class="page-body">
    <SpRouterView>
      <SpPlatformTip h5 app alipay />
      <div v-if="VERSION_STANDARD" class="content-bottom-padded">
        <el-alert type="info" title="操作说明" show-icon>
          <div>
            自动同步：开启自动同步后，总部添加编辑商品会自动同步上架到到店铺，保留开启前的商品状态。关闭同步后将保留已同步的商品数据
          </div>
        </el-alert>
      </div>
      <div v-if="IS_MERCHANT()" style="margin-bottom: 10px">
        <el-alert type="info" title="" show-icon>
          <div>可在设置-店铺管理员添加店铺端账号，登录地址 【 {{ origin }}/shopadmin/login 】</div>
        </el-alert>
      </div>

      <div v-if="!IS_DISTRIBUTOR()" class="action-container">
        <el-button type="primary" icon="ecx-icon icon-xinzeng" @click="dialogOpen()">
          添加店铺
        </el-button>

        <el-button v-if="!distributor_self" type="primary" @click="addDistributorSelf()">
          新增总部自提点
        </el-button>
        <template v-else>
          <el-button v-if="!IS_MERCHANT()" type="primary" @click="editDistributorSelf()">
            编辑总部自提点
          </el-button>
        </template>
      </div>

      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="is_valid" label="启用状态:">
          <el-select v-model="params.is_valid" placeholder="是否启用">
            <el-option
              v-for="(item, index) in isValidList"
              :key="index"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="distributor_id" label="店铺:">
          <SpSelectShop v-model="params.distributor_id" clearable placeholder="请选择" />
        </SpFilterFormItem>
        <SpFilterFormItem v-if="VERSION_PLATFORM" prop="tag_id" label="标签:">
          <el-cascader
            v-model="params.tag_id"
            placeholder="选择标签"
            :options="tag.list"
            :props="{ value: 'tag_id', label: 'tag_name' }"
            clearable
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="mobile" label="联系手机:">
          <el-input v-model="params.mobile" placeholder="联系人手机号" />
        </SpFilterFormItem>
        <SpFilterFormItem v-if="!VERSION_STANDARD" prop="distribution_type" label="店铺类型:">
          <el-select v-model="params.distribution_type" clearable placeholder="选择店铺类型">
            <el-option label="加盟" value="1"> 加盟 </el-option>
            <el-option label="自营" value="0"> 自营 </el-option>
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem
          v-if="!VERSION_STANDARD && $store.getters.login_type == 'admin'"
          prop="merchant_name"
          label="所属商家:"
        >
          <el-input v-model="params.merchant_name" placeholder="所属商家" />
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <!-- <el-button
          v-if="VERSION_PLATFORM && !is_distributor && !IS_MERCHANT()"
          plain
          type="primary"
          @click="addDistributorTag"
        >
          打标签
        </el-button> -->
        <el-button
          v-if="VERSION_PLATFORM && !is_distributor && !IS_MERCHANT()"
          plain
          type="primary"
          @click="addDistributorTag"
        >
          打标签
        </el-button>
        <el-button
          v-if="IS_ADMIN() || IS_MERCHANT()"
          type="primary"
          plain
          @click="showSettingDistance('')"
        >
          全部店铺范围配置
        </el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="tableList"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          v-if="VERSION_PLATFORM && !is_distributor && $store.getters.login_type != 'merchant'"
          type="selection"
          align="center"
          label="全选"
        />
        <el-table-column width="50" prop="distributor_id" label="ID" />
        <el-table-column label="店铺">
          <template slot-scope="scope">
            <div class="store-name">
              {{ scope.row.name }}
            </div>
            <div class="store-contact">
              <span v-if="scope.row.contact">
                <i class="el-icon-user" />
                {{ scope.row.contact }}
              </span>
              <span>
                <i class="el-icon-mobile" />
                {{ scope.row.mobile }}
              </span>
            </div>
            <div v-if="scope.row.store_address" class="store-address">
              <i class="el-icon-place" />
              {{ scope.row.store_address }}
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="VERSION_STANDARD" width="200" label="自动同步商品至店铺">
          <template v-if="scope.row.is_valid !== 'delete'" slot-scope="scope">
            <el-switch
              v-model="scope.row.auto_sync_goods"
              active-color="#13ce66"
              inactive-color="#cccccc"
              @change="switchChangeAutoSyncGoods(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <!-- <el-table-column v-if="VERSION_STANDARD" width="200" label="商品自动上架且总部发货">
          <template v-if="scope.row.is_valid !== 'delete'" slot-scope="scope">
            <el-switch
              v-model="scope.row.auto_sync_goods"
              active-color="#13ce66"
              inactive-color="#cccccc"
              @change="switchChangeAutoSyncGoods(scope.$index, scope.row)"
            />
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="审核商品">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.is_audit_goods"  active-color="#13ce66" inactive-color="#cccccc" @change="switchChangeAuditGoods(scope.$index, scope.row)"></el-switch>
            </template>
          </el-table-column>-->
        <el-table-column width="80" label="是否自提">
          <template v-if="scope.row.is_valid !== 'delete'" slot-scope="scope">
            <el-tooltip
              v-if="!scope.row.lng && !scope.row.lat"
              effect="dark"
              content="请先设置店铺坐标"
              placement="top-start"
            >
              <el-switch
                v-model="scope.row.is_ziti"
                disabled
                active-color="#13ce66"
                inactive-color="#cccccc"
              />
            </el-tooltip>
            <el-switch
              v-else
              v-model="scope.row.is_ziti"
              active-color="#13ce66"
              inactive-color="#cccccc"
              @change="switchChange(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column width="80" label="快递配送">
          <template v-if="scope.row.is_valid !== 'delete'" slot-scope="scope">
            <el-switch
              v-model="scope.row.is_delivery"
              active-color="#13ce66"
              inactive-color="#cccccc"
              @change="switchChange(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column width="100" label="开启业务员">
          <template v-if="scope.row.is_valid !== 'delete'" slot-scope="scope">
            <el-switch
              v-model="scope.row.is_open_salesman"
              active-color="#13ce66"
              inactive-color="#cccccc"
              @change="switchChange(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column width="100" label="商家自配送">
          <template slot-scope="scope">
            {{ scope.row.is_self_delivery ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column width="70" label="状态">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.is_valid !== 'delete'"
              type="text"
              @click="editValid(scope.row)"
            >
              <span v-if="scope.row.is_valid == 'true'" class="green">
                启用
                <i class="el-icon-s-tools" />
              </span>
              <span v-else class="red">
                禁用
                <i class="el-icon-s-tools" />
              </span>
            </el-button>
            <span v-else class="muted">废弃</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="!VERSION_STANDARD && $store.getters.login_type == 'admin'"
          label="店铺类型"
          width="80"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.distribution_type == '1'">加盟</span>
            <span v-else-if="scope.row.distribution_type == '0'">自营</span>
          </template>
        </el-table-column>
        <el-table-column v-if="$store.getters.login_type == 'admin'" width="80" label="是否默认">
          <template v-if="scope.row.is_valid !== 'delete'" slot-scope="scope">
            <el-tooltip effect="dark" content="请先启用店铺" placement="top-start">
              <el-switch
                v-model="scope.row.is_default"
                active-color="#13ce66"
                inactive-color="#cccccc"
                :disabled="scope.row.is_default || scope.row.is_valid != 'true' ? true : false"
                @change="defaultSwitchChange(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="VERSION_PLATFORM" prop="tagList" label="标签" class="tab">
          <template slot-scope="scope">
            <el-tag
              v-for="taglist in scope.row.tagList"
              :key="taglist.index"
              closable
              :color="taglist.tag_color"
              size="mini"
              :style="'color:' + taglist.font_color"
              style="display: inline-block; margin-right: 3px"
              @close="handleClose(tag, scope.row, taglist)"
            >
              {{ taglist.tag_name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          v-if="!VERSION_STANDARD && $store.getters.login_type != 'merchant'"
          label="所属商家"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.merchant_name || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text">
              <router-link
                v-if="scope.row.is_valid !== 'delete' && datapass_block == '0'"
                :to="{
                  path: matchHidePage('editor'),
                  query: { distributor_id: scope.row.distributor_id }
                }"
              >
                编辑
              </router-link>
            </el-button>
            <el-button type="text" @click="linkTemplates(scope.row)"> 店铺装修 </el-button>

            <el-popover placement="top-start" trigger="hover">
              <div>
                <el-button type="text" @click="showSettingMeiQia(scope.row.distributor_id)">
                  客服
                </el-button>
                <el-button
                  v-if="VERSION_PLATFORM"
                  type="text"
                  @click="downDistributor(scope.row, 'store')"
                >
                  下载店铺码
                </el-button>
                <el-button v-else type="text" @click="downDistributor(scope.row, 'index')">
                  下载店铺码
                </el-button>
                <router-link
                  v-if="scope.row.is_openAccount"
                  :to="{
                    path: matchHidePage('details'),
                    query: { distributor_id: scope.row.distributor_id }
                  }"
                >
                  <span style="padding: 0px 5px">详情</span>
                </router-link>
                <el-button
                  v-clipboard:copy="scope.row.link"
                  v-clipboard:success="onCopy"
                  class="copy-btn"
                  type="text"
                >
                  <input v-model="scope.row.link" class="copy-link" type="text" />复制店铺链接
                </el-button>
                <el-button type="text" @click="linkWxpaysettting(scope.row)">
                  微信支付配置
                </el-button>
                <el-button type="text" @click="linkAlipaysettting(scope.row)">
                  支付宝配置
                </el-button>
                <el-button type="text" @click="showSettingChinaumspay(scope.row.distributor_id)">
                  银联商务支付配置
                </el-button>
                <!-- <el-button v-if="scope.row.distribution_type == '0' || IS_DISTRIBUTOR()" type="text" @click="showSettingDistance(scope.row.distributor_id)">
              店铺范围配置
            </el-button> -->
                <el-button type="text" @click="showSettingDistance(scope.row.distributor_id)">
                  店铺范围配置
                </el-button>
              </div>
              <el-button slot="reference" type="text">更多>></el-button>
            </el-popover>

            <!-- <router-link
              v-if="scope.row.is_valid !== 'delete' && datapass_block == '0'"
              :to="{
                path: matchHidePage('wxpay'),
                query: { distributor_id: scope.row.distributor_id }
              }"
            >
              <span style="margin-right: 5px">微信支付配置</span>
            </router-link> -->
            <!--<el-button type="text" @click="downDistributor(scope.row, 'scancode')">扫码购页面码(微商城)</el-button>-->
            <!-- <router-link :to="{  path: matchInternalRoute('Storeshopitemanagement'), query: {distributor_id: scope.row.distributor_id}}">商品码</router-link> -->
            <!--router-link :to="{ path: matchHidePage('detail'), query: { distributor_id: scope.row.distributor_id, distributor_name: scope.row.name,parentPath: '/mall/marketing/distributor'}}">商品码</router-link-->
          </template>
        </el-table-column>
      </el-table>

      <div class="content-padded content-center">
        <el-pagination
          background
          :current-page.sync="page.pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
          @current-change="onCurrentChange"
          @size-change="onSizeChange"
        />
      </div>

      <el-dialog
        title="下载店铺码"
        :visible.sync="downDistributorVal"
        :close-on-click-modal="false"
      >
        <el-row>
          <el-col :span="8">
            <el-button type="text" @click="downDistributorCode(rowdata, 'yykweishop')">
              微商城小程序
            </el-button>
          </el-col>
        </el-row>
      </el-dialog>

      <el-dialog
        :visible.sync="dialogVisible"
        width="80%"
        title="编辑店铺首页"
        fullscreen
        lock-scroll
      >
        <shopDecoration :id="current" @saved="closeDialog" />
      </el-dialog>

      <el-dialog
        :visible.sync="pcDialogVisible"
        width="80%"
        title="编辑PC店铺首页"
        fullscreen
        lock-scroll
      >
        <pc-decoration v-if="pcDialogVisible" :id="current" usage="store" @saved="closeDialog" />
      </el-dialog>

      <el-dialog
        title="为店铺打标签"
        class="right-dialog"
        :visible.sync="tag.dialog"
        :before-close="handleCancelLabelsDialog"
      >
        <div class="tag-users view-flex view-flex-middle">
          <i class="iconfont icon-user-circle1" />
          <div class="view-flex-item">
            <span v-for="item in tag.editItem" :key="item">{{ item }}，</span>
          </div>
        </div>

        <div class="selected-tags view-flex">
          <div class="label">已选中标签：</div>
          <div class="view-flex-item">
            <el-tag
              v-for="(tag, index) in tag.currentTags"
              :key="index"
              closable
              size="small"
              :disable-transitions="false"
              @close="tagRemove(index)"
            >
              {{ tag.tag_name }}
            </el-tag>
          </div>
        </div>
        <hr />
        <div>
          <div class="label">全部标签：</div>
          <el-tag
            v-for="(tag, index) in tag.tags"
            :key="index"
            class="tag-item"
            size="medium"
            color="#ffffff"
            :disable-transitions="false"
            @click.native="tagAdd(tag, index)"
          >
            {{ tag.tag_name }}
          </el-tag>
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
            <el-radio label="true"> 启用 </el-radio>
            <el-radio label="false"> 禁用 </el-radio>
            <el-radio label="delete"> 废弃 </el-radio>
          </el-radio-group>
        </template>
      </el-dialog>
      <!-- 编辑距离-开始 -->
      <!-- <el-dialog
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
                v-model.number="distanceForm.distance"
                min="1"
                type="number"
                oninput="value=value.replace(/[^\d.]/g,'')"
                placeholder="输入大于等于0的数字，为0则显示所有店铺"
                style="width: 30%"
              />&nbsp;km
            </el-form-item>
          </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="handleDistanceCancel"> 取消 </el-button>
          <el-button type="primary" @click="handleSubmitDistance"> 保存 </el-button>
        </div>
      </el-dialog> -->
      <el-dialog
        title="店铺范围配置"
        width="35%"
        :visible.sync="setDistanceVisible"
        :before-close="handleDistanceCancel"
      >
        <SpForm
          v-model="distanceForm"
          :form-list="formList"
          :submit="true"
          @resetForm="handleDistanceCancel"
          @onSubmit="handleSubmitDistance"
        />
      </el-dialog>
      <!-- 编辑距离-结束 -->

      <!-- 银联商务支付配置-开始 -->
      <el-dialog
        title="银联商务支付配置"
        width="50%"
        :visible.sync="setChinaumspayVisible"
        :before-close="handleChinaumspayCancel"
      >
        <template>
          <el-form
            ref="chinaumspayForm"
            :model="chinaumspayForm"
            class="demo-ruleForm"
            label-width="90px"
          >
            <el-form-item label="商户号">
              <el-input v-model="chinaumspayForm.mid" placeholder="请输入内容" style="width: 30%" />
            </el-form-item>
            <el-form-item label="终端号">
              <el-input v-model="chinaumspayForm.tid" placeholder="请输入内容" style="width: 30%" />
            </el-form-item>
            <el-form-item label="企业用户号">
              <el-input
                v-model="chinaumspayForm.enterpriseid"
                placeholder="请输入内容"
                style="width: 30%"
              />
            </el-form-item>
          </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="handleChinaumspayCancel"> 取消 </el-button>
          <el-button type="primary" @click="handleSubmitChinaumspay"> 保存 </el-button>
        </div>
      </el-dialog>
      <!-- 银联商务支付配置-结束 -->

      <!-- 添加分组 -->
      <SpDialog
        ref="kfRef"
        v-model="keFuDialog"
        title="设置客服"
        :modal="false"
        :form="keFuForm"
        :form-list="keFuFormList"
        @onSubmit="onKeFuFormSubmit"
      />
    </SpRouterView>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import SpForm from '@/components/sp-form'
import {
  saveDistributor,
  getWxaDristributorCodeStream,
  setDefaultDistributor,
  saveOpen,
  NewdeleteTag
} from '@/api/marketing'
import { getTagList, distributorRelTags, getDistance, setDistance } from '@/api/marketing'
import { getDistributorMeiQia, setDistributorMeiQia } from '@/api/im'
import district from '../../../common/district.json'
import shopDecoration from '@/components/function/shopDecoration'
import pcDecoration from '@/view/pc/homePage/default'
import { getSetting } from '@/api/fenzhang'
import { setPaymentSetting, getPaymentSetting } from '@/api/trade'
import shopSelect from '@/components/shopSelect'
import mixin, { pageMixin } from '@/mixins'
import { IS_ADMIN } from '@/utils'

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
  components: { shopDecoration, pcDecoration, shopSelect },
  mixins: [mixin, pageMixin],
  data() {
    const initialParams = {
      is_valid: undefined,
      distributor_id: undefined,
      tag_id: []
    }

    const validateLink = (rule, value, callback) => {
      const { channel, wxapp, h5, app, aliapp, pc } = this.keFuForm
      if (channel == 'multi') {
        if (wxapp || h5 || app || aliapp || pc) {
          callback()
        } else {
          callback(new Error('至少一项不能为空'))
        }
      } else {
        callback()
      }
    }
    return {
      formList: [
        {
          label: '距离',
          key: 'distance',
          component: () => (
            <div>
              <el-input
                placeholder='输入大于等于0的数字，为0则显示所有店铺'
                width='60%'
                v-model={this.distanceForm.distance}
              />
              &nbsp;km
            </div>
          ),
          validator: (rule, value, callback) => {
            const { distance } = this.distanceForm
            const regex = /^\d+$/
            if (regex.test(distance)) {
              callback()
            } else {
              callback(new Error('请输入数字'))
            }
          }
        }
      ],
      distributorIds: '',
      initialParams,
      params: {
        ...initialParams
      },
      origin: '',
      datapass_block: 1,
      is_distributor: false,
      dialogVisible: false,
      current: '', // 当前店铺id
      isValidList: [
        { name: '全部', value: undefined },
        { name: '启用', value: 'true' },
        { name: '禁用', value: 'false' },
        { name: '废弃', value: 'delete' }
      ],
      changeStatus: true,
      activeName: 'first',
      total_count: 0,
      distributor_self: '',
      detailDialog: false,
      pcDialogVisible: false,
      dialogTitle: '',
      loading: false,
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
        is_distributor: 'true'
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
          distributor_id: []
        },
        currentTags: [],
        tags: []
      },
      editValidDialog: false,
      editValidData: {
        distributor_id: '',
        is_valid: ''
      },
      setMeiQiaVisible: false,
      setMeiQiaDialog: false,
      meiqia_form: {
        distributor_id: '',
        meiqia_id: '',
        meiqia_token: ''
      },
      setDistanceVisible: false,
      setDistanceDialog: false,
      distanceForm: {
        distance: ''
      },
      setChinaumspayVisible: false,
      chinaumspayForm: {
        distributor_id: 0,
        mid: '',
        tid: '',
        enterpriseid: ''
      },
      isOpen: false,
      keFuDialog: false,
      keFuForm: {
        distributor_id: '',
        channel: 'single', // single、multi
        common: '',
        wxapp: '',
        h5: '',
        app: '',
        aliapp: '',
        pc: ''
      },
      keFuFormList: [
        {
          label: '店铺客服',
          key: 'channel',
          type: 'radio',
          options: [
            { label: 'single', name: '按店铺配置' },
            { label: 'multi', name: '按店铺和渠道配置' }
          ]
        },
        {
          label: '客服链接',
          key: 'common',
          component: () => (
            <div class='kf-link'>
              <el-input type='text' placeholder='请输入客服链接' v-model={this.keFuForm.common} />
              <div class='tips'>
                如实际运营中有多个客服人员接待咨询，建议配置为美洽客服组链接，在美洽客服组内添加客服人员坐席。
              </div>
            </div>
          ),
          validator: (rule, value, callback) => {
            const { channel, common } = this.keFuForm
            if (channel == 'single' && !common) {
              callback(new Error('客服链接不能为空'))
            } else {
              callback()
            }
          },
          isShow: () => {
            return this.keFuForm.channel == 'single'
          }
        },
        {
          label: '微信小程序',
          key: 'wxapp',
          type: 'input',
          validator: validateLink,
          isShow: () => {
            return this.keFuForm.channel == 'multi'
          }
        },
        {
          label: 'H5商城',
          key: 'h5',
          type: 'input',
          validator: validateLink,
          isShow: () => {
            return this.keFuForm.channel == 'multi'
          }
        },
        {
          label: 'APP商城',
          key: 'app',
          type: 'input',
          validator: validateLink,
          isShow: () => {
            return this.keFuForm.channel == 'multi'
          }
        },
        {
          label: '支付宝小程序',
          key: 'aliapp',
          type: 'input',
          validator: validateLink,
          isShow: () => {
            return this.keFuForm.channel == 'multi'
          }
        },
        {
          label: 'PC网页版',
          key: 'pc',
          type: 'input',
          validator: validateLink,
          isShow: () => {
            return this.keFuForm.channel == 'multi'
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    isLoginTypeNormal() {
      return (
        this.$store.getters.login_type === 'admin' || this.$store.getters.login_type === 'admin'
      )
    }
  },

  mounted() {
    this.origin = window.location.origin
    if (store.getters.login_type === 'distributor') {
      this.is_distributor = true
    }
    this.fetchList()
    this.getAllTagList()
    getSetting().then((res) => {
      let data = res.data.data
      this.isOpen = data.is_open == 'true'
    })
  },
  methods: {
    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    onReset() {
      this.params = { ...this.initialParams }
      this.onSearch()
    },
    getParams() {
      let params = {
        ...this.params
      }
      return params
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.getParams()
      }
      const { list, total_count, distributor_self, datapass_block } =
        await this.$api.marketing.getDistributorList(params)
      this.tableList = list.map((item) => {
        item.link = `${process.env.VUE_APP_H5_HOST}/${item.link}`
        return item
      })
      this.page.total = total_count
      this.distributor_self = distributor_self
      this.datapass_block = datapass_block
      this.loading = false
    },
    async handleClose(tag, { distributor_id }, { tag_id }) {
      const obj = {
        distributor_ids: [distributor_id],
        tag_ids: [tag_id]
      }

      const result = await NewdeleteTag(obj)
      this.$message.success('删除成功')
      this.fetchList()
      console.log(result)
    },
    linkTemplates(distributor) {
      const { distributor_id, address, name, distribution_type } = distributor
      this.$store.dispatch('setTemplateName', 'yykweishop')
      this.$router.push({
        path: this.matchHidePage('template'),
        query: { distributor_id, address, name, distribution_type }
      })
    },
    linkWxpaysettting(distributor) {
      const { distributor_id, name } = distributor
      this.$router.push({
        path: this.matchHidePage('wxpaysetting'),
        query: { distributor_id, name }
      })
    },
    linkAlipaysettting(distributor) {
      const { distributor_id, name } = distributor
      this.$router.push({
        path: this.matchHidePage('alipaysetting'),
        query: { distributor_id, name }
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
      this.$router.push({
        path: this.matchHidePage('editor'),
        query: { distributor_type: 'distributor_self' }
      })
    },
    editDistributorSelf() {
      this.$router.push({
        path: this.matchHidePage('editor'),
        query: { distributor_type: 'distributor_self', distributor_id: this.distributor_self }
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
      this.params.page = 1
      val && val.shop_id
      this.params.distributor_id = val.shop_id
      this.fetchList()
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
    },
    downDistributor(row, codetype) {
      this.codetype = codetype
      this.rowdata = row
      this.downDistributorVal = true
    },
    defaultSwitchChange(row) {
      var params = {
        distributor_id: row.distributor_id
      }
      setDefaultDistributor(params).then((response) => {
        if (response.data.data.status) {
          for (var i = this.list.length - 1; i >= 0; i--) {
            if (this.list[i].distributor_id != row.distributor_id) {
              this.list[i].is_default = false
            }
          }
        }
        this.onSearch()
      })
    },
    switchChangeAuditGoods(index, row) {
      var params = {
        distributor_id: row.distributor_id,
        is_audit_goods: row.is_audit_goods
      }
      saveDistributor(params).then((response) => {
        this.detailDialog = false
        this.fetchList()
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      })
    },
    switchChangeAutoSyncGoods(index, row) {
      var params = {
        distributor_id: row.distributor_id,
        auto_sync_goods: row.auto_sync_goods
      }
      saveDistributor(params).then((response) => {
        this.detailDialog = false
        this.fetchList()
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      })
    },
    switchChangeOpen(index, row) {
      var params = {
        distributor_id: row.distributor_id,
        is_open: row.is_open
      }
      saveOpen(params).then((response) => {
        this.detailDialog = false
        this.fetchList()
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      })
    },
    switchChange(index, row) {
      var params = {
        distributor_id: row.distributor_id,
        is_ziti: row.is_ziti,
        is_delivery: row.is_delivery,
        is_open_salesman: row.is_open_salesman
      }
      saveDistributor(params).then((response) => {
        this.detailDialog = false
        this.fetchList()
        this.$message({
          type: 'success',
          message: '保存成功'
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
        pageSize: 500
      }
      getTagList(params).then((response) => {
        this.tag.list = response.data.data.list
      })
    },
    handleCancelLabelsDialog() {
      this.editValidDialog = false
      this.tag.dialog = false
      this.fetchList()
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
        let res = []
        this.tableList.forEach((item) => {
          this.distributor_id.forEach((n) => {
            if (item.distributor_id == n) {
              res = [...res, ...item.tagList]
            }
          })
        })
        res = Array.from(new Map(res.map((item) => [item.tag_id, item])).values())
        this.tag.currentTags = res
        this.showTags()
        this.tag.form.distributor_id = this.distributor_id
      } else {
        this.$message({
          type: 'error',
          message: '请选择至少一个店铺!'
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
          message: '请选择店铺标签'
        })
        return false
      }
      this.tag.dialog = false
      distributorRelTags(this.tag.form).then((res) => {
        if (res.data.data.status) {
          this.$message({
            type: 'success',
            message: '打标签完成'
          })
          this.fetchList()
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
        msg =
          '禁用后该店铺的订单将无法处理，同时如首页装修有该店铺或店铺商品将无法正常购买，请确认是否禁用？'
      } else if (val === 'delete') {
        msg =
          '废弃后该店铺的订单将无法处理，同时如首页装修有该店铺或店铺商品将无法正常购买，且该店铺废弃后不可找回，请确认是否废弃？'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            distributor_id: this.editValidData.distributor_id,
            is_valid: this.editValidData.is_valid
          }
          saveDistributor(params).then((response) => {
            this.detailDialog = false
            this.fetchList()
            this.$message({
              type: 'success',
              message: '已修改'
            })
            this.editValidDialog = false
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    async showSettingMeiQia(distributor_id) {
      this.keFuForm.distributor_id = distributor_id
      this.keFuDialog = true
      const {
        channel,
        meiqia_url: { aliapp, app, common, h5, pc, wxapp }
      } = await this.$api.im.getDistributorMeiQia(distributor_id)

      this.keFuForm = {
        ...this.keFuForm,
        channel,
        common,
        wxapp,
        h5,
        app,
        aliapp,
        pc
      }
    },
    async onKeFuFormSubmit() {
      const { channel, common, wxapp, h5, app, aliapp, pc } = this.keFuForm
      const params = {
        channel,
        common,
        wxapp,
        h5,
        app,
        aliapp,
        pc
      }
      await this.$api.im.setDistributorMeiQia(this.keFuForm.distributor_id, params)
      this.keFuDialog = false
      this.$message.success('保存成功')
    },
    showSettingDistance(distributor_id) {
      // 设置距离参数
      this.setDistanceVisible = true
      let that = this
      that.distributorIds = distributor_id
      that.distanceForm.distance = 0
      if (distributor_id) {
        getDistance({ distributor_id }).then((response) => {
          that.distanceForm.distance = response.data.data.distance
        })
      }
    },
    handleDistanceCancel() {
      // 距离设置窗口关闭
      this.setDistanceVisible = false
      this.distanceForm.distance = ''
    },
    handleSubmitDistance() {
      // 提交距离配置
      let params = {
        distance: this.distanceForm.distance,
        distributor_id: this.distributorIds
      }
      setDistance(params).then((response) => {
        this.$message({
          type: 'success',
          message: '提交成功'
        })
        this.handleDistanceCancel()
      })
    },
    showSettingChinaumspay(distributor_id) {
      // 设置银联商务支付配置
      this.setChinaumspayVisible = true
      let that = this
      let query = { pay_type: 'chinaumspay', distributor_id: distributor_id }
      getPaymentSetting(query).then((response) => {
        that.chinaumspayForm = response.data.data
        that.chinaumspayForm.distributor_id = query.distributor_id
      })
      console.log(this.chinaumspayForm)
    },
    handleChinaumspayCancel() {
      // 银联商务支付设置窗口关闭
      this.setChinaumspayVisible = false
      this.chinaumspayForm.mid = ''
      this.chinaumspayForm.tid = ''
    },
    handleSubmitChinaumspay() {
      // 提交银联支付配置
      let params = {
        pay_type: 'chinaumspay',
        distributor_id: this.chinaumspayForm.distributor_id,
        mid: this.chinaumspayForm.mid,
        tid: this.chinaumspayForm.tid,
        enterpriseid: this.chinaumspayForm.enterpriseid
      }
      setPaymentSetting(params).then((response) => {
        this.$message({
          type: 'success',
          message: '提交成功'
        })
        this.handleChinaumspayCancel()
      })
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.fetchList()
    },
    onCopy() {
      this.$notify.success({
        message: '复制成功',
        showClose: true
      })
    }
  },
  beforeRouteUpdate(to, from, next) {
    next()
    if (to.path.indexOf('editor') === -1 && to.path.indexOf('details') === -1) {
      this.fetchList()
      this.getAllTagList()
    }
  }
}
</script>
