<template>
  <el-form ref="form" :model="form" class="box-set" label-width="120px">
    <el-card header="活动商品信息" shadow="never">
      <el-form-item
        label="区域"
        prop="regionauth_id"
        :rules="{ required: true, message: '区域必填', trigger: 'change' }"
      >
        <el-col :span="20">
          <el-select v-model="form.regionauth_id" placeholder="请选择" clearable>
            <el-option
              v-for="item in areasList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="活动封面">
        <div class="frm-tips">
          文件格式为bmp、png、jpeg、jpg或gif，大小不超过2M（建议尺寸：500px * 500px）
        </div>
        <div>
          <imgBox :img-url="wximageurl + form.pics" @click="handleImgChange" />
        </div>
        <imgPicker
          :dialog-visible="imgDialog"
          :sc-status="isGetImage"
          @chooseImg="pickImg"
          @closeImgDialog="closeImgDialog"
        />
      </el-form-item>
      <!-- <el-form-item label="拼团商品">
        <el-row :gutter="20">
          <el-col :span="20">
            <p class="frm-tips" />
            <div class="logo-box" @click="changeItem">
              <div class="bran-img">
                <div v-if="goods.pics" class="groups-addgoods">
                  <img :src="wximageurl + goods.pics[0]" class="groups-goodspic">
                  <div class="gooups-goodsmsg">
                    <div>{{ goods.itemName }}</div>
                    <div>原价：{{ goods.price }}</div>
                    <div v-if="goods.item_type == 'normal'">库存：{{ goods.store }}</div>
                  </div>
                </div>
                <div v-else tabindex="0" class="el-upload el-upload--picture-card">
                  <i class="el-icon-plus" />
                </div>
              </div>
              <el-button size="small" type="primary" @click="changeItem">选择商品</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form-item> -->
      <el-form-item label="活动名称" prop="act_name" :rules="rules.act_name">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input v-model="form.act_name" :maxlength="30" placeholder="拼团活动名称" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="活动说明">
        <el-col :span="20">
          <el-input v-model="form.marketing_desc" placeholder="请输入" />
        </el-col>
      </el-form-item>
      <el-form-item label="活动时间" prop="date" :rules="rules.date">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-date-picker
              v-model="form.date"
              type="datetimerange"
              range-separator="至"
              start-placeholder="生效时间"
              end-placeholder="过期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
            />
          </el-col>
        </el-row>
      </el-form-item>

      <!-- 拼团商品 -->
      <el-card header="拼团商品" shadow="naver">
        <el-form-item label="适用商品">
          <el-radio-group v-model="form.use_bound">
            <el-radio label="goods"> 指定商品适用 </el-radio>
          </el-radio-group>
        </el-form-item>
        <div style="position: relative">
          <SkuSelector :data="relItems" :is-sort="true" @change="getItems" />
          <div style="position: absolute; bottom: 0px; left: 112px">
            <el-upload
              style="display: inline-block; height: 0"
              action=""
              :on-change="uploadHandleChange"
              :auto-upload="false"
              :show-file-list="false"
            >
              <el-button type="primary"> 批量上传 </el-button>
            </el-upload>
            <el-button style="margin-left: 10px" type="primary" @click="uploadHandleTemplate()">
              下载模板
            </el-button>
          </div>
        </div>
      </el-card>
      <el-card header="设置商品" shadow="naver">
        <el-table v-if="form.items.length > 0" :data="form.items" style="line-height: normal">
          <el-table-column label="SKU编码" prop="item_bn" width="180" />
          <el-table-column label="名称" prop="item_title" />
          <el-table-column label="规格" prop="item_spec_desc" />
          <el-table-column label="市场价（吊牌价）">
            <template slot-scope="scope"> ¥{{ scope.row.market_price }} </template>
          </el-table-column>
          <el-table-column label="销售价（奥莱价）">
            <template slot-scope="scope"> ¥{{ scope.row.price }} </template>
          </el-table-column>
          <el-table-column label="拼团价" width="100">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.activity_price"
                min="0.01"
                size="mini"
                onkeyup="value=value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')"
              >
                <i slot="prefix" class="el-input__icon">{{ cursymbol }}</i>
              </el-input>
            </template>
          </el-table-column>
          <!-- <el-table-column
          label="每人限购"
          width="80"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.limit_num"
              size="mini"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
            />
          </template>
        </el-table-column> -->
          <!-- <el-table-column
          label="排序"
          width="80"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.sort"
              size="mini"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
            />
          </template>
        </el-table-column> -->
          <!-- <el-table-column label="操作" width="50">
                  <template slot-scope="scope">
                    <i class="iconfont icon-trash-alt" @click="deleteItemRow(scope.$index, form.items)"></i>
                  </template>
                </el-table-column> -->
        </el-table>
      </el-card>

      <!-- <el-form-item label="拼团库存" prop="store" :rules="rules.store">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input v-model="form.store" placeholder="" />
          </el-col>
          <el-col :span="2"> 件 </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="拼团价格" prop="act_price" :rules="rules.act_price">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input v-model="form.act_price" placeholder=""> 元 </el-input>
          </el-col>
          <el-col :span="2"> 元 </el-col>
        </el-row>
      </el-form-item> -->
      <el-form-item
        label="PO编码"
        prop="finance_data.po_code"
        :rules="{ required: true, message: 'PO编码必填', trigger: 'blur' }"
      >
        <el-col :span="6">
          <el-input v-model="form.finance_data.po_code" placeholder="请输入" />
        </el-col>
      </el-form-item>
      <el-form-item
        label="Budget code"
        prop="finance_data.budget_code"
        :rules="{ required: true, message: 'Budget code必填', trigger: 'blur' }"
      >
        <el-col :span="6">
          <el-input v-model="form.finance_data.budget_code" placeholder="请输入" />
        </el-col>
      </el-form-item>
      <el-form-item
        label="承担比例"
        prop="finance_data.platform_ratio"
        :rules="{ required: true, message: 'platform_ratio必填', trigger: 'blur' }"
      >
        <div style="display: flex">
          平台承担&nbsp;
          <el-input
            v-model="form.finance_data.platform_ratio"
            type="number"
            style="width: 120px"
            min="0"
            max="100"
            placeholder="请输入"
            @change="handlePlatRatioChange"
          />
          &nbsp; %，店铺承担&nbsp;
          <el-input
            v-model="form.finance_data.shop_ratio"
            type="number"
            style="width: 120px"
            disabled
            min="0"
            max="100"
            placeholder="请输入"
          />
          &nbsp; %
        </div>
      </el-form-item>
      <el-form-item label="成团人数" prop="person_num" :rules="rules.person_num">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input v-model="form.person_num" placeholder=""> 人 </el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="成团时效" prop="limit_time" :rules="rules.limit_time">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input v-model="form.limit_time" placeholder="小时" />
          </el-col>
          <el-col :span="2"> 小时 </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="拼团限制" prop="limit_buy_num" :rules="rules.limit_buy_num">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input v-model="form.limit_buy_num" placeholder="" />
            <p class="frm-tips">(限制一人只能参加X次活动，为0表示无限制)</p>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="成团机器人">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-switch v-model="form.robot" active-value="1" inactive-value="0" />
            <p class="frm-tips">
              (开启成团机器人后，成团时效内人数未满的团，系统将会使用机器人凑满人数，使该团成团。商家只需对真实订单进行发货处理。)
            </p>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="凑团">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-switch v-model="form.rig_up" active-value="1" inactive-value="0" />
            <p class="frm-tips">
              (开启凑团后，消费者可以在拼团商品详情页看到未成团的团列表，可选择其中一个参团。有效提高成团成功率)
            </p>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item v-if="goods.item_type == 'normal'" label="包邮">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-switch v-model="form.free_post" active-value="1" inactive-value="0" />
            <p class="frm-tips">(如果不开启包邮，那么运费按照商品的运费模版计算运费)</p>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="分享描述" prop="share_desc" :rules="rules.share_desc">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input
              v-model="form.share_desc"
              :maxlength="25"
              placeholder="请输入拼团活动分享文字"
            >
              （最多25个字）
            </el-input>
          </el-col>
        </el-row>
      </el-form-item>
    </el-card>
    <div class="content-center">
      <el-button @click.native="handleCancel"> 返回 </el-button>
      <el-button v-if="true == show" type="primary" :loading="saveLoading" @click.prevent="submitItemsAction('form')">
        保存
      </el-button>
    </div>
    <el-dialog title="选择商品" :visible.sync="goodsDialogVisible" center>
      <!-- <el-button-group class="tab-group">
        <el-button
          class="tab-btn"
          @click="changeGoods('every')"
          :class="goodsTypeTitle === '服务类商品' ? 'on' : ''"
          >服务类商品</el-button
        >
        <el-button
          class="tab-btn"
          @click="changeGoods('normal')"
          :class="goodsTypeTitle === '实体类商品' ? 'on' : ''"
          >实体类商品</el-button
        >
      </el-button-group> -->
      <el-row class="content-bottom-padded" :gutter="20">
        <el-col :span="12">
          <el-input v-model="itemsParams.keywords" placeholder="商品名称">
            <el-button slot="append" icon="el-icon-search" @click="goodsSearch" />
          </el-input>
        </el-col>
      </el-row>
      <el-table v-loading="itemsLoading" :data="itemsList" style="width: 100%" border height="500">
        <el-table-column prop="itemName" label="商品名称" />
        <el-table-column label="缩略图">
          <template slot-scope="scope">
            <img width="20" :src="wximageurl + scope.row.pics[0]" />
          </template>
        </el-table-column>
        <el-table-column prop="price" label="销售价" :formatter="priceformatter" />
        <el-table-column prop="itemName" label="状态">
          <template slot-scope="scope">
            <el-button
              v-if="form.goods_id != scope.row.itemId"
              type="text"
              @click="chooseItem(scope.row)"
            >
              选择
            </el-button>
            <span v-else>已选择</span>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="itemsTotalCount > itemsParams.pageSize" class="content-center content-top-padded">
        <el-pagination
          layout="prev, pager, next"
          :current-page.sync="itemsParams.page"
          :total="itemsTotalCount"
          :page-size="itemsParams.pageSize"
          @current-change="goodsHandleCurrentChange"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="goodsDialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="goodsDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <CompConflictActivities v-model="cActivityVis" :list="cActivityList" />
  </el-form>
</template>
<script>
import { uploadMaterial } from '../../../api/wechat'
import { getItemsList } from '../../../api/goods'
import { getDefaultCurrency } from '../../../api/company'
import SkuSelector from '@/components/function/skuSelector'
import { createGroupActivity, updateGroupActivity, getGroupsInfo,batchGetActivityList } from '../../../api/promotions'
import imgPicker from '../../../components/imageselect'
import imgBox from '@/components/element/imgBox'
import { handleUploadFile, exportUploadTemplate } from '@/api/common'
import CompConflictActivities from '../promotions/comps/comp-conflict-activities.vue'
import moment from 'moment'

export default {
  inject: ['refresh'],
  components: {
    imgPicker,
    imgBox,
    SkuSelector,
    CompConflictActivities,
  },
  data() {
    return {
      saveLoading:false,
      show: true,
      itemsLoading: false,
      groups_activity_id: '',
      areasList: [],
      relItems: [],
      addedItems: [],
      cActivityVis:false,
      cActivityList:[],
      form: {
        pics: '',
        goods_id: '',
        act_name: '',
        date: '',
        store: '',
        act_price: '',
        person_num: '',
        limit_time: '',
        limit_buy_num: '',
        robot: '1',
        rig_up: '1',
        free_post: '1',
        regionauth_id: '',
        share_desc: '',
        marketing_desc: '',
        use_bound: 'goods',
        finance_data: {
          po_code: '',
          budget_code: '',
          platform_ratio: 100,
          shop_ratio: 0
        },
        items: []
      },
      goods: {},
      itemsList: [],
      itemsParams: {
        page: 1,
        pageSize: 20,
        // consume_type: 'every',
        item_type: 'normal',
        nospec: true,
        keywords: ''
      },
      itemsTotalCount: 0,
      logo_url: '',
      dialogVisible: false,
      dialogImageUrl: '',
      goodsDialogVisible: false,
      rules: {
        act_name: [{ required: true, message: '请输入拼团活动名称',  trigger: 'blur'}],
        date: [{ required: true, message: '请输入活动时间', trigger: 'change' }],
        store: [
          { required: true, message: '请输入拼团库存' },
          { pattern: /^[1-9]\d{0,4}$/, message: '库存最少为1，最多99999' }
        ],
        act_price: [
          { required: true, message: '请输入拼团价格' },
          { pattern: /^(?=.*[1-9])\d+(\.\d{1,2})?$/, message: '拼团价格最少0.01' }
        ],
        person_num: [
          { required: true, message: '请输入成团人数' },
          { pattern: /^([2-9]|[1-9]\d{1})$/, message: '最少2人成团,最多99人成团' }
        ],
        limit_time: [
          { required: true, message: '请输入成团时效' },
          { pattern: /^[1-9]\d{0,1}$/, message: '成团时效至少1小时，最多99小时' }
        ],
        limit_buy_num: [
          { required: true, message: '请输入限购数量' },
          { pattern: /^\d{0,2}$/, message: '最多99' }
        ],
        share_desc: [{ required: true, message: '请输入分享描述' }]
      },
      imgDialog: false,
      isGetImage: false,
      currency: {},
      cursymbol: '￥',
      goodsTypeTitle: '服务类商品'
    }
  },
  mounted() {
    if (this.$route.query.show) {
      this.show = false
    }
    if (this.$route.params.groups_id) {
      this.groups_activity_id = this.$route.params.groups_id
      this.getGroupsInfo()
    }
    this.getCurrencyInfo()
    this.getAreaList()
  },
  methods: {
    async getAreaList() {
      // 查询区域数据
      const res = await this.$api.regionauth.getRegionauth()
      this.areasList = res?.list?.map((el) => ({
        value: el.regionauth_id,
        label: el.regionauth_name
      }))
    },
    getItems(data,isSort) {
      let arr = []
      data.forEach((item, index) => {
        let newData = ''
        let isInArr = this.addedItems.findIndex((n) => n.item_id == item.itemId)
        if (isInArr == -1) {
          newData = {
            item_id: item.itemId,
            item_bn:item.itemBn,
            item_title: item.itemName,
            activity_store: item.store,
            price:item.price / 100,
            market_price:item.market_price / 100,
            activity_price: item.price / 100,
            item_spec_desc: item.item_spec_desc,
            sort: item.sort,
            limit_num: item.limit_num || 0,
            item_type: item.item_type
          }
        } else {
          newData = this.addedItems[isInArr]
           // isSort，强制更新sort
           if(isSort){
            newData.sort = item.sort
          }
        }
        if (newData) {
          arr.push(newData)
        }
      })
      this.form.items = arr
    },
    submitItemsAction(formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.form.pics) {
            this.$message.error('请上传活动封面')
            return false
          }
          if (!this.form.items.length) {
            this.$message.error('请选择商品')
            return false
          }

          let params =  JSON.parse(JSON.stringify(this.form))
          params.items = JSON.stringify(params.items)
          console.log(params)
          this.saveLoading = true
          if (this.groups_activity_id) {
            updateGroupActivity(this.groups_activity_id, params).then((res) => {
              if (res.data.data) {
                this.$message({
                  message: '更新成功',
                  type: 'success',
                  duration: 2 * 1000,
                  onClose() {
                    that.refresh()
                    that.$router.go(-1)
                  }
                })
              }
            }).catch((err)=>{
            console.log('err',err)
            let marketing_ids = err.data?.data?.errors?.marketing_ids ?? []
            if(marketing_ids.length){
              marketing_ids = marketing_ids.join(',')
              this.fetchGetActivityList(marketing_ids)
            }
          }).finally(()=>{
              this.saveLoading = false
            })
          } else {
            createGroupActivity(params).then((res) => {
              if (res.data.data) {
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  duration: 2 * 1000,
                  onClose() {
                    that.refresh()
                    that.$router.go(-1)
                  }
                })
              }
            }).catch((err)=>{
          console.log('err',err)
          let marketing_ids = err.data?.data?.errors?.marketing_ids ?? []
          if(marketing_ids.length){
            marketing_ids = marketing_ids.join(',')
            this.fetchGetActivityList(marketing_ids)
          }
        }).finally(()=>{
              this.saveLoading = false
            })
          }
        } else {
          return false
        }
      })
    },
    fetchGetActivityList(marketing_ids){
      batchGetActivityList({ marketing_ids }).then(res=>{
        let response = res.data.data
        this.cActivityVis = true
        this.cActivityList = response.map(item=>({
          ...item,
          start_date: moment(item.start_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
          end_date: moment(item.end_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
        }))
      })
    },
    handleCancel() {
      this.$router.go(-1)
    },
    //老的活动封面上传
    // handlePicChange (file) {
    //   let that = this
    //   if (file && file.raw) {
    //     if (file.raw.type !== 'image/jpeg' && file.raw.type !== 'image/png') {
    //       that.$message.error('上传图片只能是 JPG 或者 PNG 格式!')
    //     }
    //     if (file.raw.size / 1024 / 1024 > 5) {
    //       that.$message.error('上传图片大小不能超过 5MB!')
    //     }
    //   }

    //   let params = {isUploadFile: true, file: file.raw, type: 'image'}
    //   uploadMaterial(params).then(res => {
    //     file.url = this.wximageurl + res.data.data.url
    //     that.form.pics = res.data.data.url
    //     that.logo_url = file.url
    //   })
    // },
    changeItem() {
      if (!this.show) return
      this.goodsDialogVisible = true
      this.getGoodsList()
    },
    chooseItem(row) {
      this.goodsDialogVisible = false
      this.goods = row
      this.goods.price = this.goods.price / 100
      this.form.goods_id = row.itemId
    },
    goodsHandleCurrentChange(val) {
      this.itemsParams.page = val
      this.getGoodsList()
    },
    goodsSearch() {
      this.getGoodsList()
    },
    getGoodsList() {
      this.itemsLoading = true

      let where = this.itemsParams
      where.approve_status = ['onsale', 'offline_sale']
      where.is_gift = false
      getItemsList(where)
        .then((response) => {
          this.itemsLoading = false
          this.itemsList = response.data.data.list
          this.itemsTotalCount = response.data.data.total_count
        })
        .catch((error) => {
          this.itemsLoading = false
          this.$message({
            type: 'error',
            message: '获取商品列表列表信息出错'
          })
        })
    },
    handlePlatRatioChange(val) {
      if (val > 100) {
        this.form.finance_data.platform_ratio = 100
        this.form.finance_data.shop_ratio = 0
        return
      }
      if (val < 0 || !val) {
        this.form.finance_data.platform_ratio = 0
        this.form.finance_data.shop_ratio = 100
        return
      }
      this.form.finance_data.shop_ratio = 100 - val
    },
    generateSku() {
      let noSkuItem = []
      let response = []
      let goodsList = JSON.parse(JSON.stringify(this.relItems))
      goodsList.forEach((item) => {
        if (!item.nospec && item.spec_items.length === 0) {
          noSkuItem.push(item.default_item_id)
        }
      })
      if (noSkuItem.length > 0) {
        let param = this.params
        param.item_id = noSkuItem
        getItemsList(this.params).then((res) => {
          goodsList.forEach((item) => {
            if (!item.nospec) {
              res.data.data.list.forEach((sku) => {
                if (item.item_id === sku.default_item_id) {
                  item.spec_items.push(sku)
                }
              })
            }
          })
          goodsList.forEach((item) => {
            if (!item.nospec) {
              response = [...response, ...item.spec_items]
            } else {
              response = [...response, item]
            }
          })
          this.ItemsList = response
          this.getItems(response)
        })
      } else {
        goodsList.forEach((item) => {
          if (!item.nospec) {
            response = [...response, ...item.spec_items]
          } else {
            response = [...response, item]
          }
        })
        this.ItemsList = response
        this.getItems(response)
      }
    },
    getGroupsInfo() {
      getGroupsInfo(this.groups_activity_id)
        .then((response) => {
          this.form = response.data.data
          this.form.act_price = this.form.act_price / 100
          this.form.goods.price = this.form.goods.price / 100
          this.form.goods.market_price = this.form.goods.market_price / 100
          this.form.date = [
            new Date(response.data.data.begin_time * 1000),
            new Date(response.data.data.end_time * 1000)
          ]
          this.form.robot = response.data.data.robot == 1 ? '1' : '0'
          this.form.rig_up = response.data.data.rig_up == 1 ? '1' : '0'
          this.form.free_post = response.data.data.free_post == 1 ? '1' : '0'
          this.logo_url = this.wximageurl + response.data.data.pics
          // this.goods = response.data.data.goods
          this.relItems = response.itemTreeLists || []
          this.generateSku()
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: '获取拼团活动详情失败'
          })
        })
    },
    priceformatter(row, column) {
      return this.cursymbol + row.price / 100
    },
    getCurrencyInfo() {
      getDefaultCurrency().then((res) => {
        this.currency = res.data.data
        this.cursymbol = this.currency.symbol
      })
    },
    //活动封面
    handleImgChange() {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg(data) {
      console.log(data.url)
      this.form.pics = data.url
      console.log(this.form.pics)
      this.imgDialog = false
    },
    closeImgDialog() {
      this.imgDialog = false
    },
    changeGoods(type) {
      switch (type) {
        case 'every':
          this.$set(this.itemsParams, 'consume_type', 'every')
          this.$delete(this.itemsParams, 'item_type')
          this.goodsTypeTitle = '服务类商品'
          break
        case 'normal':
          this.$set(this.itemsParams, 'item_type', 'normal')
          this.$delete(this.itemsParams, 'consume_type')
          this.goodsTypeTitle = '实体类商品'
          break
      }
      this.getGoodsList()
    },
    /**
     * 下载模板
     * */
    uploadHandleTemplate() {
      let params = { file_type: 'marketing_goods', file_name: '商品模板' }
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
    /**
     * 上传模板
     * */
    uploadHandleChange(file, fileList) {
      let params = { isUploadFile: true, file_type: 'marketing_goods', file: file.raw }
      handleUploadFile(params).then((response) => {
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
      })
    }
  }
}
</script>

<style scoped lang="scss">
.groups-addgoods {
  display: flex;
  .groups-goodspic {
    float: left;
    width: 120px;
    height: 120px;
    border: 1px solid #ddd;
  }
  .gooups-goodsmsg {
    float: left;
    max-width: 670px;
    margin-left: 10px;
    margin-top: 15px;
    overflow: hidden;
  }
}
.form-view {
  float: left;
  width: 25%;
  margin-right: 40px;
  min-width: 387px;
}

.form-wrapper {
  margin-top: 10px;
  display: flow-root;
  margin-left: 20px;
  float: left;
  min-width: 750px;
}
.upload-box {
  display: inline-block;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  width: 150px;
  height: 150px;
  .avatar {
    max-width: 100%;
    max-height: 100%;
  }
  .avatar-uploader-icon {
    width: 100%;
    height: 100%;
    line-height: 150px;
  }
  .avatar-uploader-icon {
    font-size: 38px;
  }
}
.tab-group {
  margin-bottom: 20px;
  .tab-btn {
    &.on {
      border-color: #e6a23c;
      background-color: #e6a23c;
      color: #fff;
    }
  }
}
</style>
