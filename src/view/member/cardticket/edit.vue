<template>
  <div>
    <el-form ref="form" :rules="rules" :model="form" label-width="110px">
      <div v-if="!form.card_id && showTab" class="content-center content-bottom-padded">
        <el-radio-group v-model="form.card_type" @change="handleTypeChange">
          <el-radio-button label="discount"> 折扣券 </el-radio-button>
          <el-radio-button label="cash"> 满减券 </el-radio-button>
          <!-- <el-radio-button label="gift">兑换券</el-radio-button> -->
          <el-radio-button label="new_gift"> 兑换券 </el-radio-button>
        </el-radio-group>
      </div>
      <GiftCoupon v-if="form.card_type === 'new_gift'" @haddleShowTab="haddleShowTab" />
      <template v-else>
        <el-card shadow="never" header="基础信息">
          <el-form-item v-if="form.card_type === 'gift'" label="兑换商品名称" prop="gift">
            <el-input
              v-model="form.gift"
              :maxlength="20"
              placeholder="兑换商品名称"
              style="width: 240px"
              @change="giftChange"
            />&nbsp;<span class="frm-tips"
              >{{ inputValue.gift_length }}/{{ inputValue.gift_max }}</span
            >
          </el-form-item>
          <el-form-item v-if="form.card_type === 'discount'" label="折扣额度" prop="discount">
            <el-input
              v-model="form.discount"
              :disabled="form.card_id ? true : false"
              placeholder="只能是大于等于1,小于10的数字"
              style="width: 240px"
              max="9.9"
              min="1"
            />
          </el-form-item>
          <el-form-item v-if="form.card_type === 'cash'" label="减免金额" prop="reduce_cost">
            <el-input
              v-model="form.reduce_cost"
              type="number"
              :disabled="form.card_id ? true : false"
              placeholder="只能是大于0的数字"
              style="width: 240px"
            />&nbsp;元
          </el-form-item>
          <el-form-item label="发放数量" prop="quantity">
            <el-input
              v-model.number="form.quantity"
              min="1"
              :disabled="form.card_id ? true : false"
              type="number"
              oninput="value=value.replace(/[^\d.]/g,'')"
              placeholder="只能是大于0的数字"
              style="width: 20%"
            />&nbsp;份
          </el-form-item>
          <el-form-item label="券名称" prop="title">
            <el-input
              v-model="form.title"
              :disabled="form.card_id ? true : false"
              placeholder="字数上限为9个汉字"
              style="width: 240px"
              @change="titleChange"
            />&nbsp;<span class="frm-tips"
              >{{ inputValue.title_length }}/{{ inputValue.title_max }}</span
            >
            <!-- <p class="frm-tips">
              建议填写
              {{form.card_type === 'discount' ? '折扣券' : form.card_type === 'cash' ? '满减券' : '兑换券'}}
              “减免金额”及自定义内容，描述卡券提供的具体优惠
            </p> -->
          </el-form-item>
          <el-form-item label="使用条件" prop="useCondition">
            <el-radio-group
              v-model="form.useCondition"
              :disabled="form.card_id ? true : false"
              @change="conditionChange"
            >
              <template v-if="form.card_type != 'cash'">
                <el-radio :label="1"> 不限制 </el-radio>
              </template>
              <template v-if="form.card_type !== 'gift'">
                <el-radio :label="2">
                  满 &nbsp;<el-input
                    v-model="form.least_cost"
                    type="number"
                    min="0"
                    :disabled="form.card_id || form.useCondition == 1 ? true : false"
                    style="width: 100px"
                  />&nbsp; 元可用&nbsp;&nbsp;
                  <template v-if="form.card_type === 'discount'">
                    最高限额&nbsp;<el-input
                      v-model="form.most_cost"
                      :disabled="form.card_id || form.useCondition == 1 ? true : false"
                      style="width: 100px"
                    />&nbsp; 元
                  </template>
                </el-radio>
              </template>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="有效期" prop="date_type">
            <el-radio-group v-model="form.date_type" @change="changeDatetime">
              <div
                v-if="
                  !form.card_id || (form.card_id && form.date_type === 'DATE_TYPE_FIX_TIME_RANGE')
                "
                style="margin-bottom: 20px"
              >
                <el-radio
                  :disabled="
                    form.card_id != '' && form.date_type == 'DATE_TYPE_FIX_TERM' ? true : false
                  "
                  label="DATE_TYPE_FIX_TIME_RANGE"
                >
                  固定日期
                </el-radio>
                <el-date-picker
                  v-model="date_range"
                  type="datetimerange"
                  value-format="timestamp"
                  :picker-options="form.card_id ? '' : pickerOptions"
                  style="width: 380px"
                  :disabled="form.date_type == 'DATE_TYPE_FIX_TERM' ? true : false"
                />
              </div>
              <div
                v-if="!form.card_id || (form.card_id && form.date_type === 'DATE_TYPE_FIX_TERM')"
              >
                <el-radio
                  label="DATE_TYPE_FIX_TERM"
                  :disabled="
                    form.card_id != '' && form.date_type == 'DATE_TYPE_FIX_TIME_RANGE'
                      ? true
                      : false
                  "
                >
                  领取后,&nbsp;
                  <el-select
                    v-model="form.begin_time"
                    :disabled="
                      form.card_id != '' && form.date_type == 'DATE_TYPE_FIX_TERM'
                        ? true
                        : datetimeStatus
                        ? true
                        : false
                    "
                    size="5"
                  >
                    <el-option
                      v-for="item in totalDays"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    />
</el-select
                  >&nbsp;生效，有效天数&nbsp;

                  <el-input
                    v-model.number="form.days"
                    style="width: 120px"
                    :disabled="
                      form.card_id != '' && form.date_type == 'DATE_TYPE_FIX_TERM'
                        ? true
                        : datetimeStatus
                        ? true
                        : false
                    "
                  >
                    <template slot="append"> 天 </template>
                  </el-input>
                  <!-- <el-select
                  v-model="form.days"
                  :disabled="
                    form.card_id != '' && form.date_type == 'DATE_TYPE_FIX_TERM'
                      ? true
                      : datetimeStatus
                      ? true
                      : false
                  "
                  size="5"
                >
                  <el-option
                    v-for="item in remainDays"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  ></el-option>
                </el-select> -->
                  统一过期时间&nbsp;<el-date-picker
                    v-model="form.end_time"
                    type="datetime"
                    value-format="timestamp"
                    :picker-options="pickerOptions"
                    :disabled="
                      form.card_id != '' && form.date_type == 'DATE_TYPE_FIX_TERM'
                        ? true
                        : datetimeStatus
                        ? true
                        : false
                    "
                  />
                </el-radio>
              </div>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="卡券使用说明" prop="description">
            <el-input
              v-model="form.description"
              required
              type="textarea"
              :rows="6"
              resize="none"
              style="width: 600px"
              placeholder="请填写使用本优惠券的注意事项"
              @change="descriptionChange"
            />&nbsp;<span class="frm-tips"
              >{{ inputValue.description_length }}/{{ inputValue.description_max }}</span
            >
          </el-form-item>
          <!-- <el-form-item label="优惠券模板ID" prop="card_code">
           <el-input :maxlength="255" placeholder="优惠券模板ID" v-model="form.card_code" style="width: 240px;"></el-input>&nbsp;<span class="frm-tips">{{inputValue.card_code}}</span>
        </el-form-item>
        <el-form-item label="优惠券规则ID" prop="card_rule_code">
           <el-input :maxlength="255" placeholder="优惠券规则ID" v-model="form.card_rule_code" style="width: 240px;"></el-input>&nbsp;<span class="frm-tips">{{inputValue.card_rule_code}}</span>
        </el-form-item> -->
        </el-card>
        <el-card shadow="never" header="适用规则">
          <el-form-item label="前台直接领取">
            <el-switch v-model="form.receive" active-color="#13ce66" inactive-color="#d2d4db" />
          </el-form-item>
          <el-form-item label="领券限制">
            <el-input
              v-model="form.get_limit"
              type="number"
              style="width: 120px"
              min="1"
              oninput="value=value.replace(/[^\d.]/g,'')"
            />
            <p class="frm-tips">每个用户领券上限，如不填，则默认为1。</p>
          </el-form-item>
          <el-form-item v-if="is_distributor == false && form.card_type == 'gift'" label="适用平台">
            <el-radio-group
              v-model="form.use_platform"
              :disabled="form.card_id != ''"
              @change="usePlatformChange"
            >
              <el-radio v-if="is_distributor == false" label="store"> 门店专用 </el-radio>
              <el-radio v-if="form.card_type != 'gift'" label="mall"> 线上商城专用 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="is_distributor == false && form.card_type == 'gift'"
            label="核销场景"
            prop="use_scenes"
          >
            <el-radio-group v-model="form.use_scenes" :disabled="form.card_id != ''">
              <el-radio
                v-if="form.card_type != 'gift' && form.use_platform == 'mall'"
                label="ONLINE"
              >
                线上商城使用
              </el-radio>
              <el-radio
                v-if="form.card_type != 'gift' && form.use_platform == 'store'"
                label="QUICK"
              >
                快捷买单使用
              </el-radio>
              <el-radio v-if="form.use_platform == 'store'" label="SELF">
                自助核销（到店使用）
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.use_scenes == 'SELF'" label="验证码">
            <el-radio-group v-model="self_rcode" :disabled="form.card_id != ''">
              <el-radio label="1"> 启用验证码 </el-radio>
              <el-radio label="0"> 不启用验证码 </el-radio>
            </el-radio-group>
            <br>
            <el-input
              v-if="self_rcode === '1'"
              v-model="form.self_consume_code"
              style="width: 220px"
              placeholder="请输入验证码"
              maxlength="4"
              minlength="4"
            />
          </el-form-item>
        </el-card>
        <el-card
          v-if="form.use_platform == 'mall' && form.card_type != 'gift' && form.store_self == false"
          header="商品"
          shadow="naver"
        >
          <el-form-item label="适用商品">
            <el-radio-group v-model="form.use_all_items" @change="itemTypeChange">
              <el-radio label="true"> 全部商品适用 </el-radio>
              <el-radio label="false"> 指定商品适用 </el-radio>
              <el-radio label="category"> 指定管理分类适用 </el-radio>
              <el-radio label="tag"> 指定商品标签适用 </el-radio>
              <el-radio label="brand"> 指定品牌适用 </el-radio>
            </el-radio-group>
          </el-form-item>

          <div v-if="!zdItemHidden" style="position: relative">
            <SkuSelector :data="relItems" @change="getItems" />
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

          <el-col :xs="12" :sm="12" :md="12">
            <div v-if="!categoryHidden" style="height: 350px" class="custom_tree">
              <!-- <treeselect
                v-model="form.item_category"
                :options="categoryList"
                :show-count="true"
                :multiple="true"
                :disable-branch-nodes="true"
              /> -->
              <el-cascader
                v-model="form.item_category"
                style="width: 500px"
                placeholder="请选择"
                clearable
                :options="categoryList"
                :props="{ value: 'category_id', label: 'category_name', checkStrictly: true }"
              />
            </div>
          </el-col>
          <template v-if="!tagHidden">
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
            <div>
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
          </template>
          <template v-if="!brandHidden">
            <div class="selected-tags view-flex">
              <div class="label">已选中品牌：</div>
              <div class="view-flex-item">
                <el-tag
                  v-for="(brand, index) in brand.currentBrands"
                  :key="index"
                  closable
                  size="small"
                  :disable-transitions="false"
                  @close="brandRemove(index)"
                >
                  {{ brand.attribute_name }}
                </el-tag>
              </div>
            </div>
            <div>
              <el-tag
                v-for="(brand, index) in brand.brands"
                :key="index"
                class="tag-item"
                size="medium"
                color="#ffffff"
                :disable-transitions="false"
                @click.native="brandAdd(brand, index)"
              >
                {{ brand.attribute_name }}
              </el-tag>
            </div>
          </template>
        </el-card>
        <el-card
          v-if="is_distributor == false && form.use_platform == 'store'"
          header="门店"
          shadow="naver"
        >
          <el-form-item label="适用门店">
            <el-radio-group v-model="form.use_all_shops" @change="shopTypeChange">
              <el-radio label="true"> 全部门店适用 </el-radio>
              <el-radio label="false"> 指定门店适用 </el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="!zdShopHidden">
            <el-button type="primary" @click="addStoreAction"> 选择门店 </el-button>
            <el-table v-if="relStores.length > 0" :data="relStores" style="line-height: normal">
              <el-table-column label="ID" prop="wxShopId" width="60" />
              <el-table-column label="名称" prop="storeName" />
              <el-table-column prop="address" label="地址" show-overflow-tooltip />
              <el-table-column label="操作" width="50">
                <template slot-scope="scope">
                  <i class="iconfont icon-trash-alt" @click="deleteRow(scope.$index, form.items)" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>

        <el-card
          v-if="VERSION_STANDARD && is_distributor == false && form.use_platform == 'mall'"
          header="店铺"
          shadow="naver"
        >
          <el-form-item label="适用店铺">
            <el-radio-group v-model="form.use_all_shops" @change="shopTypeChange">
              <el-radio label="true"> 全部店铺适用 </el-radio>
              <el-radio label="false"> 指定店铺适用 </el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="!zdShopHidden">
            <el-button type="primary" @click="addDistributorAction"> 选择店铺 </el-button>
            <el-table
              v-if="distributor_info.length > 0"
              :data="distributor_info"
              style="line-height: normal"
            >
              <el-table-column label="ID" prop="distributor_id" width="60" />
              <el-table-column label="名称" prop="name" />
              <el-table-column prop="address" label="地址" show-overflow-tooltip />
              <el-table-column label="操作" width="50">
                <template slot-scope="scope">
                  <i
                    class="iconfont icon-trash-alt"
                    @click="deleteDistritutorRow(scope.$index, form.items)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        <div class="content-center">
          <el-button @click="cancelSubmit"> 取消 </el-button>
          <el-button type="primary" :disabled="submitDisabled" @click="submitForm('form')">
            提交
          </el-button>
        </div>
      </template>
    </el-form>
    <StoreSelect
      :store-visible="storeVisible"
      :is-valid="true"
      :rel-data-ids="relStores"
      :get-status="setStatus"
      @chooseStore="chooseStoreAction"
      @closeStoreDialog="closeStoreDialogAction"
    />

    <DistributorSelect
      :store-visible="distributorVisible"
      :is-valid="true"
      :rel-data-ids="distributor_info"
      :get-status="setDistributorStatus"
      return-type="selectRow"
      @chooseStore="chooseDistributorAction"
      @closeStoreDialog="closeDistributorDialogAction"
    />
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import store from '@/store'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import StoreSelect from '@/components/function/shopSelect'
import DistributorSelect from '@/components/storeListSelect'
import SkuSelector from '@/components/function/skuSelector'
import { getCardDetail, getWechatColor, creatCard, updateCard } from '@/api/cardticket'
import { pushNewsImage, getAuthorizerInfo } from '@/api/wechat'
import { getWxShopsList } from '@/api/shop'
import { getItemsList, getCategory, getTagList, getGoodsAttr } from '@/api/goods'
import { handleUploadFile, exportUploadTemplate } from '../../../api/common'
import GiftCoupon from './coupon/gift.vue'
export default {
  inject: ['refresh'],
  components: {
    StoreSelect,
    SkuSelector,
    DistributorSelect,
    Treeselect,
    GiftCoupon
  },
  data() {
    let tempDays = [{ text: '当天', value: 0 }]
    let tempRemainDays = []
    for (let i = 1; i <= 90; i++) {
      tempDays.push({ text: i + '天', value: i })
      tempRemainDays.push({ text: i + '天', value: i })
    }
    var useConditionChecked = (rule, value, callback) => {
      if (this.form.card_type === 'cash' && this.form.useCondition === 2) {
        var reg = /^\d*$/
        if (this.form.least_cost === '') {
          callback(new Error('请填写金额'))
        } else if (Number(this.form.least_cost) <= Number(this.form.reduce_cost)) {
          callback(new Error('填写金额必须大于减免金额'))
        } else {
          callback()
        }
      }
      if (this.form.card_type === 'discount' && this.form.useCondition === 2) {
        var reg = /^\d*$/
        if (this.form.most_cost === '') {
          callback(new Error('请填写金额'))
        } else if (Number(this.form.most_cost) <= Number(this.form.least_cost)) {
          callback(new Error('最高消费限额必须大于起用金额'))
        } else {
          callback()
        }
      }
      callback()
    }
    var quantityChecked = (rule, value, callback) => {
      let reg = /^\d*$/
      if (value === '') {
        callback(new Error('发放数量不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('发放数量必须为数字'))
      } else {
        callback()
      }
    }
    var dateChecked = (rule, value, callback) => {
      if (value == 'DATE_TYPE_FIX_TIME_RANGE' && this.date_range == '') {
        callback(new Error('固定日期必填'))
      } else {
        callback()
      }
    }
    var titleChecked = (rule, value, callback) => {
      console.log(value)
      if (value == '') {
        callback(new Error('券名称不能为空'))
      } else if (this.inputValue.title_length > this.inputValue.title_max) {
        callback(
          new Error(
            '券名称长度不超过' +
              this.inputValue.title_max +
              '个汉字或' +
              this.inputValue.title_max * 2 +
              '个英文字母'
          )
        )
      } else {
        callback()
      }
    }
    var descriptionChecked = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('卡券使用说明不能为空'))
      } else if (this.inputValue.description_length > this.inputValue.description_max) {
        callback(
          new Error(
            '卡券使用说明长度' +
              this.inputValue.description_max +
              '个汉字或' +
              this.inputValue.description_max * 2 +
              '个英文字母'
          )
        )
      } else {
        callback()
      }
    }
    var discountChecked = (rule, value, callback) => {
      var reg = /(^[1-9]((\.)[0-9])?$)/
      if (value == '') {
        callback(new Error('折扣额度不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('折扣额度为1-9.9之间的数字，精确到小数点后1位'))
      } else {
        callback()
      }
    }
    var reduceCostChecked = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('减免金额不能为空'))
      } else if (parseFloat(value) > 0) {
        callback()
      } else {
        callback(new Error('减免金额必须大于0'))
      }
    }
    var useScenesChecked = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('至少选择一项使用场景'))
      }
      callback()
    }
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      totalDays: tempDays,
      remainDays: tempRemainDays,
      datetimeStatus: true,
      articleItemIndex: -1,
      articleOprHidden: true,
      articleItem: { text: '', image_url: '' },
      addImgDefaultHidden: false,
      zdShopHidden: true,
      storeVisible: false,
      distributorVisible: false,
      itemVisible: false,
      setItemStatus: false,
      date_range: '',
      setStatus: false,
      setDistributorStatus: false,
      relStores: [],
      distributor_info: [],
      relShopIds: [],
      relDistributorIds: [],
      submitDisabled: false,
      is_distributor: false,
      form: {
        color: '#000000',
        card_id: '',
        card_type: 'discount',
        title: '',
        least_cost: 0,
        reduce_cost: '',
        discount: '',
        gift: '',
        quantity: '',
        date_type: 'DATE_TYPE_FIX_TIME_RANGE',
        begin_time: 0,
        days: 30,
        end_time: '',
        time_limit_date: [],
        get_limit: 1,
        use_all_shops: 'true',
        rel_shops_ids: [],
        distributor_id: [],
        text_image_list: [],
        receive: true,
        store_self: false,
        use_scenes: 'ONLINE',
        if_push_wechat: false,
        useCondition: 1,
        self_consume_code: 0,
        use_platform: 'mall',
        rel_item_ids: [],
        use_all_items: 'true',
        most_cost: 999999,
        item_category: [],
        tag_ids: [],
        brand_ids: []
      },
      relItems: [],
      kqhjCheckedItem: '',
      twxxCheckedItem: '',
      zdItemHidden: true,
      rules: {
        gift: [{ required: true, message: '兑换商品名称不能为空', trigger: 'blur' }],
        discount: [{ type: 'number', required: true, validator: discountChecked, trigger: 'blur' }],
        reduce_cost: [
          { type: 'number', required: true, validator: reduceCostChecked, trigger: 'blur' }
        ],
        title: [{ required: true, validator: titleChecked, trigger: 'blur' }],
        date_type: [{ required: true, validator: dateChecked, trigger: 'blur' }],
        useCondition: [{ required: true, validator: useConditionChecked, trigger: 'blur' }],
        description: [{ required: true, validator: descriptionChecked, trigger: 'blur' }],
        quantity: [{ required: true, validator: quantityChecked, trigger: 'blur' }],
        use_scenes: [{ required: true, validator: useScenesChecked, trigger: 'blur' }]
      },
      inputValue: {
        title_length: 0,
        title_max: 9,
        description_length: 0,
        description_max: 300,
        accept_category_length: 0,
        accept_category_max: 5,
        reject_category_length: 0,
        reject_category_max: 15,
        object_use_for_length: 0,
        object_use_for_max: 15,
        gift_length: 0,
        gift_max: 20
      },
      wechatColor: [
        '#63b359',
        '#2c9f67',
        '#509fc9',
        '#5885cf',
        '#9062c0',
        '#d09a45',
        '#e4b138',
        '#ee903c',
        '#f08500',
        '#a9d92d',
        '#dd6549',
        '#cc463d',
        '#cf3e36',
        '#5E6671',
        '#026842'
      ],
      self_rcode: '0',
      categoryHidden: true,
      categoryList: [],
      tagHidden: true,
      tag: {
        list: [],
        form: {
          tag_ids: []
        },
        currentTags: [],
        tags: []
      },
      brandHidden: true,
      brand: {
        list: [],
        form: {
          brand_ids: []
        },
        currentBrands: [],
        brands: []
      },
      showTab: true
    }
  },
  mounted() {
    if (store.getters.login_type === 'distributor') {
      this.is_distributor = true
      this.form.is_distributor = true
      this.form.use_platform = 'mall'
      console.log(this.form.use_platform)
    }
    if (this.$route.query.chooseCardtype) {
      this.form.card_type = this.$route.query.chooseCardtype
    }
    if (this.form.card_type == 'cash') {
      this.form.useCondition = 2
    }
    if (this.$route.query.cardId) {
      this.form.card_id = this.$route.query.cardId
    }
    let params = {
      card_id: this.form.card_id
    }
    if (!this.form.card_id && this.form.card_type == 'gift') {
      this.form.use_scenes = 'SELF'
    }
    if (this.form.card_id) {
      getCardDetail(params).then((res) => {
        this.form = Object.assign({}, this.form, res.data.data)
        if (res.data.data.distributor_id == ',0,') {
          this.form.store_self = true
        } else {
          this.form.store_self = false
        }
        if (this.form.date_type == 'DATE_TYPE_FIX_TIME_RANGE') {
          this.date_range = [this.form.begin_time * 1000, this.form.end_time * 1000]
          this.form.days = 30
        } else {
          if (this.form.end_time <= 0) {
            this.form.end_time = ''
          } else {
            this.form.end_time = this.form.end_time * 1000
          }
        }

        if (this.form.use_all_items === 'false') {
          this.zdItemHidden = false
        }

        if (this.form.use_all_shops === 'false') {
          this.zdShopHidden = false
        }

        if (this.form.use_all_items === 'category') {
          this.categoryHidden = false
        }

        if (this.form.use_all_items === 'tag') {
          this.tagHidden = false
          this.tag.currentTags = res.data.data.tag_list || []
          this.showTags()
        }

        if (this.form.use_all_items === 'brand') {
          this.brandHidden = false
          this.brand.currentBrands = res.data.data.brand_list || []
          this.showBrands()
        }

        if (
          this.form.card_type == 'gift' &&
          this.form.use_scenes != 'SWEEP' &&
          this.form.use_scenes != 'SELF'
        ) {
          this.form.use_scenes = 'SELF'
        }

        if (parseInt(this.form.least_cost)) {
          this.form.useCondition = 2
        } else {
          this.form.useCondition = 1
        }

        if (!this.form.self_consume_code || this.form.self_consume_code == 0) {
          this.self_rcode = '0'
        } else {
          this.self_rcode = '1'
        }

        if (this.form.rel_shops_ids.length > 0) {
          this.shopTypeChange('false')
          let shopParams = {
            wx_shop_id: this.form.rel_shops_ids,
            page: 1,
            pageSize: 500,
            isValid: true
          }
          getWxShopsList(shopParams).then((res) => {
            this.relStores = res.data.data.list
          })
        }
        let response = res.data.data
        this.distributor_info = response.distributor_info
        this.form.distributor_id = []
        for (var i in this.distributor_info) {
          if (
            this.form.distributor_id.indexOf(Number(this.distributor_info[i].distributor_id)) < 0
          ) {
            this.form.distributor_id.push(Number(this.distributor_info[i].distributor_id))
          }
        }
        this.$nextTick(() => {
          this.relItems = response.itemTreeLists
        })
        this.titleChange(this.form.title)
        this.descriptionChange(this.form.description)
      })
    }
    if (this.form.card_type !== 'new_gift') {
      this.fetchMainCate()
      this.getAllTagLists()
      this.getBrandList('', true)
    }
  },
  methods: {
    getItems(data) {
      let ids = []
      data.forEach((item) => {
        ids.push(item.itemId)
      })
      this.form.rel_item_ids = ids
    },
    usePlatformChange(val) {
      if (val == 'mall') {
        this.form.use_scenes = 'ONLINE'
      } else {
        this.form.use_scenes = 'QUICK'
      }
    },
    checkColor(e) {
      this.form.color = e.target.dataset.color
    },
    changeDatetime(val) {
      if (val === 'DATE_TYPE_FIX_TIME_RANGE') {
        this.datetimeStatus = true
      } else {
        this.datetimeStatus = false
        this.date_range = ''
        this.begin_time = 0
      }
    },
    handleTypeChange(val) {
      if (val === 'gift') {
        this.form.use_scenes = 'SELF'
        this.form.use_platform = 'store'
      }
      if (val === 'cash' || val === 'discount') {
        this.form.useCondition = 2
        this.form.use_scenes = 'ONLINE'
        this.form.use_platform = 'mall'
      }
    },
    shopTypeChange(val) {
      this.zdShopHidden = true
      if (val === 'false') {
        this.zdShopHidden = false
      } else {
        this.form.rel_distributor_ids = []
        this.form.distributor_id = []
        this.form.distributor_info = []
      }
    },
    itemTypeChange(val) {
      this.zdItemHidden = true
      this.categoryHidden = true
      this.tagHidden = true
      this.brandHidden = true
      this.form.rel_item_ids = []
      this.form.itemTreeLists = []
      this.form.item_category = []
      this.form.item_category = []
      this.tag.currentTags = []
      if (val === 'false') {
        this.zdItemHidden = false
      } else if (val === 'true') {
        this.form.rel_item_ids = []
        this.form.itemTreeLists = []
        this.form.item_category = []
      } else if (val === 'category') {
        this.form.rel_item_ids = []
        this.form.itemTreeLists = []
        this.categoryHidden = false
        this.form.item_category = []
      } else if (val === 'tag') {
        this.tagHidden = false
        this.tag.currentTags = []
        this.showTags()
      } else if (val === 'brand') {
        this.brandHidden = false
        this.brand.currentBrands = []
        this.showBrands()
      }
    },
    cancelSubmit() {
      this.$router.go(-1)
    },
    submitForm(formName) {
      if (this.form.days <= 0) {
        this.$message.error('有效天数必须大于0')
        return
      }
      if (typeof this.form.days !== 'number') {
        this.$message.error('请输入有效的数字')
        return
      }

      const that = this
      if (this.form.date_type == 'DATE_TYPE_FIX_TIME_RANGE' && this.date_range.length > 0) {
        this.form.begin_time = this.date_range[0]
        this.form.end_time = this.date_range[1]
      }
      if (this.form.use_scenes == 'SELF' && this.self_rcode == '1') {
        if (!this.form.self_consume_code) {
          this.$message.error('选择自助核销并开启验证码后，验证码必填')
          return
        }
        if (this.form.self_consume_code && this.form.self_consume_code.length != 4) {
          this.$message.error('验证码必须为4个数字')
          return
        }
        let reg = /^\d*$/
        if (this.form.self_consume_code && !reg.test(this.form.self_consume_code)) {
          this.$message.error('验证码必须为纯数字')
          return
        }
      }
      if (this.form.use_all_shops === 'false' && !this.form.rel_shops_ids) {
        this.$message.error('请添加适用门店')
        return
      }
      if (this.form.use_scenes == 'SELF' && this.self_rcode == '0') {
        this.form.self_consume_code = 0
      }
      let params = JSON.parse(JSON.stringify(this.form))
      params.tag_list = null //不需要回传的参数
      params.rel_tag_ids = null //不需要回传的参数
      params.rel_brand_ids = null //不需要回传的参数
      params.brand_list = null //不需要回传的参数
      params.tag_ids = JSON.stringify(this.form.tag_ids)
      params.rel_item_ids = JSON.stringify(this.form.rel_item_ids)
      params.brand_ids = JSON.stringify(this.form.brand_ids)
      params.item_category = JSON.stringify(this.form.item_category)
      params.itemTreeLists = []
      params.rel_distributor_ids = JSON.stringify(this.form.rel_distributor_ids)
      params.rel_shops_ids = JSON.stringify(this.form.rel_shops_ids)
      params.distributor_info = []

      if (params.date_type == 'DATE_TYPE_FIX_TIME_RANGE') {
        params.begin_time = params.begin_time / 1000
        params.end_time = params.end_time / 1000
      } else {
        params.end_time = params.end_time / 1000
      }
      // 判断使用条件-是否不限额度
      if (params.useCondition === 1) {
        params.least_cost = 0
        params.most_cost = 999999
      }

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitDisabled = true
          if (this.form.card_id) {
            params.if_push_wechat = false
            updateCard(params)
              .then((res) => {
                if (res.data.data && res.data.data.status) {
                  this.$message({
                    message: '更新成功',
                    type: 'success',
                    duration: 2 * 1000,
                    onClose() {
                      that.refresh()
                      that.$router.go(-1)
                    }
                  })
                } else {
                  this.$message.error('更新优惠券失败!')
                  this.submitDisabled = false
                  return false
                }
              })
              .catch(() => {
                this.submitDisabled = false
              })
          } else {
            creatCard(params)
              .then((res) => {
                if (res.data.data.status) {
                  this.$message({
                    message: '添加成功',
                    type: 'success',
                    duration: 2 * 1000,
                    onClose() {
                      that.refresh()
                      that.$router.go(-1)
                    }
                  })
                } else {
                  this.$message.error('添加优惠券失败!')
                  this.submitDisabled = false
                  return false
                }
              })
              .catch(() => {
                this.submitDisabled = false
              })
          }
        } else {
          return false
        }
      })
    },
    addStoreAction() {
      this.storeVisible = true
      this.setStatus = true
      this.relShopIds = this.form.rel_shops_ids
      console.log(this.form.rel_shops_ids)
    },
    addDistributorAction() {
      this.distributorVisible = true
      this.setDistributorStatus = true
      this.relDistributorIds = this.form.distributor_id
    },
    chooseStoreAction(data) {
      console.warn('data', data)
      this.storeVisible = false
      this.form.rel_shops_ids = []
      if (data === null || data.length <= 0) return
      this.relStores = data
      for (var i = 0; i < data.length; i++) {
        if (this.form.rel_shops_ids.indexOf(Number(data[i].wxShopId)) < 0) {
          this.form.rel_shops_ids.push(Number(data[i].wxShopId))
        }
      }
    },

    chooseDistributorAction(data) {
      this.distributorVisible = false
      if (!data || data === null || data.length <= 0) {
        this.distributor_info = []
        return
      }
      this.distributor_info = data
      this.form.distributor_id = []
      for (let i = 0; i < data.length; i++) {
        const id = data[i].distributor_id
        this.form.distributor_id.push(Number(id))
      }
    },
    closeStoreDialogAction() {
      this.storeVisible = false
    },
    closeDistributorDialogAction() {
      this.distributorVisible = false
    },
    deleteRow(index) {
      this.setStatus = false
      this.relStores.splice(index, 1)
      //this.form.rel_shops_ids = []
      let shopDatas = this.relStores
      for (var i = 0; i < shopDatas.length; i++) {
        if (this.form.rel_shops_ids.indexOf(Number(shopDatas[i].wxShopId)) < 0) {
          this.form.rel_shops_ids.push(Number(shopDatas[i].wxShopId))
        }
      }
    },
    deleteDistritutorRow(index) {
      this.distributor_info.splice(index, 1)
      let shopDatas = this.distributor_info
      this.form.distributor_id = []
      for (let i = 0; i < shopDatas.length; i++) {
        if (this.form.distributor_id.indexOf(Number(shopDatas[i].distributor_id)) < 0) {
          this.form.distributor_id.push(Number(shopDatas[i].distributor_id))
        }
      }
      this.relDistributorIds = this.form.distributor_id
    },
    giftChange(value) {
      this.inputValue.gift_length = this.getValueLength(value)
    },
    titleChange(value) {
      this.inputValue.title_length = this.getValueLength(value)
    },
    descriptionChange(value) {
      this.inputValue.description_length = this.getValueLength(value)
    },
    getValueLength(value) {
      let realLength = 0,
        charCode = -1,
        count = 0
      for (var i = 0; i < value.length; i++) {
        charCode = value.charCodeAt(i)
        if (charCode >= 0 && charCode <= 128) {
          count++
        } else {
          realLength++
        }
      }
      if (count > 0) {
        realLength = realLength + parseInt(count / 2)
        if (count % 2 > 0) {
          realLength += 1
        }
      }
      return realLength
    },
    conditionChange(val) {
      if (val == 1) {
        this.form.least_cost = 0
      }
      if (val == 2 && this.form.card_type === 'discount') {
        this.form.most_cost = 999999
      }
    },
    async fetchMainCate() {
      const res = await this.$api.goods.getCategory({ is_main_category: true, ignore_none: true })
      this.categoryList = res
    },
    addItemTag() {
      this.tag.currentTags = []
      if (this.item_id.length) {
        this.showTags()
        this.tag.form.item_ids = this.item_id
      } else {
        this.$message({
          type: 'error',
          message: '请选择至少一个商品!'
        })
      }
    },
    showTags() {
      this.tag.tags = [...this.tag.list]
      let active_tags = [] //可选标签
      this.tag.tags.forEach((item, index) => {
        let isInArr = this.tag.currentTags.findIndex((n) => n.tag_id == item.tag_id)
        if (isInArr == -1) active_tags.push(item)
      })
      this.tag.tags = active_tags
    },
    tagRemove(index) {
      this.tag.tags.unshift(this.tag.currentTags[index])
      this.tag.currentTags.splice(index, 1)
      this.form.tag_ids = []
      this.tag.currentTags.forEach((item) => {
        this.form.tag_ids.push(item.tag_id)
      })
    },
    tagAdd(item, index) {
      let isInArr = this.tag.currentTags.findIndex((n) => n.tag_id == item.tag_id)
      if (isInArr == -1) {
        this.tag.currentTags.push(item)
        this.tag.tags.splice(index, 1)
      }
      this.form.tag_ids = []
      this.tag.currentTags.forEach((item) => {
        this.form.tag_ids.push(item.tag_id)
      })
    },
    getAllTagLists() {
      let params = {
        page: 1,
        pageSize: 500
      }
      getTagList(params).then((response) => {
        this.tag.list = response.data.data.list
        this.showTags()
      })
    },
    // 获取品牌列表
    getBrandList(searchVal = '', isInit = false) {
      const list = []
      getGoodsAttr({
        page: 1,
        pageSize: 1000,
        attribute_type: 'brand',
        attribute_name: searchVal,
        attribute_ids: isInit ? this.form.brand_id : ''
      }).then((res) => {
        for (let item of res.data.data.list) {
          list.push({ attribute_name: item.attribute_name, attribute_id: item.attribute_id })
        }
        this.brand.list = list
        this.showBrands()
      })
    },
    showBrands() {
      this.brand.brands = [...this.brand.list]
      let active_brands = []
      this.brand.brands.forEach((item, index) => {
        let isInArr = this.brand.currentBrands.findIndex((n) => n.attribute_id == item.attribute_id)
        //if (isInArr != -1) this.brand.brands.splice(index, 1)
        if (isInArr == -1) active_brands.push(item)
      })
      this.brand.brands = active_brands
    },
    brandAdd(item, index) {
      let isInArr = this.brand.currentBrands.findIndex((n) => n.attribute_id == item.attribute_id)
      if (isInArr == -1) {
        this.brand.currentBrands.push(item)
        this.brand.brands.splice(index, 1)
      }
      this.form.brand_ids = []
      this.brand.currentBrands.forEach((item) => {
        this.form.brand_ids.push(item.attribute_id)
      })
    },
    brandRemove(index) {
      this.brand.brands.unshift(this.brand.currentBrands[index])
      this.brand.currentBrands.splice(index, 1)
      this.form.brand_ids = []
      this.brand.currentBrands.forEach((item) => {
        this.form.brand_ids.push(item.attribute_id)
      })
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
    },
    haddleShowTab(value) {
      this.showTab = value
    }
  }
}
</script>
<style scoped lang="scss">
.card-content {
  &-head {
    text-align: center;
    color: #fff;
    padding: 20px 15px;
    font-size: 14px;
    .price {
      font-size: 32px;
    }
    .validity-date {
      color: #efefef;
      font-size: 12px;
    }
  }
  &-body {
    padding: 20px 15px;
    min-height: 400px;
    background: #fff;
    .barcode-img {
      width: 160px;
      height: 80px;
      margin: 0 auto 15px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .code-img {
      width: 120px;
      height: 118px;
      margin: 0 auto 15px;
      img {
        width: 100%;
        height: 100%;
      }
    }

    .txt-title {
      color: #333;
      font-weight: bold;
    }
    .txt-content {
      padding-left: 15px;
      span {
        margin: 0 5px;
      }
    }
  }
}
.bd {
  border-bottom: 1px dashed #ddd;
}
.mb {
  margin-bottom: 10px;
}
.card-edit-detail {
  background: #fff;
  input {
    width: 30%;
  }
}
.affix {
  position: fixed;
  width: 320px;
  overflow: hidden;
}
.section-footer {
  padding: 15px 10px;
  text-align: center;
  .with-border {
    border-top: 1px solid #f8f8f8;
  }
}
.card_article_box .card_article_img {
  background-color: #fff;
}
.media_edit {
  display: block;
  position: relative;
  z-index: 2;
  float: none;
  min-width: 800px;
  margin-left: 340px;
}
.tips {
  margin-left: 2px;
}
.el-select {
  width: 110px;
}
</style>
<style type="text/css" lang="scss">
.color-group {
  li {
    width: 30px;
    height: 30px;
    float: left;
    cursor: pointer;
    &:hover {
      border: 2px solid #fff;
    }
    &.active {
      border: 2px solid #fff;
    }
  }
}
.el-radio-group {
  .el-radio__input.is-checked + .el-radio__label,
  .el-radio__input.is-checked .el-radio__inner {
    color: #606272;
  }
}
.el-checkbox-group {
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #606272;
  }
}
.custom_tree {
}
</style>
