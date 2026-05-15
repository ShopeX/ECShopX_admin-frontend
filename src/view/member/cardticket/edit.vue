<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage class="page-cardticket">
    <el-form ref="form" :rules="rules" :model="form" label-width="110px">
      <div v-if="!form.card_id && showTab" style="margin-bottom: 20px">
        <el-radio-group v-model="form.card_type" @change="handleTypeChange">
          <el-radio-button label="discount">{{ $t('dba53da0.9268f9') }}</el-radio-button>
          <el-radio-button label="cash">{{ $t('dba53da0.f23195') }}</el-radio-button>
          <!-- <el-radio-button label="gift">兑换券</el-radio-button> -->
          <el-radio-button v-if="!VERSION_SHUYUN()" label="new_gift">
            {{ $t('dba53da0.8bc752') }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <GiftCoupon v-if="form.card_type === 'new_gift'" @haddleShowTab="haddleShowTab" />
      <template v-else>
        <el-card shadow="never" :header="$t('dba53da0.6ea1fe')">
          <el-form-item v-if="form.card_type === 'gift'" :label="$t('dba53da0.44da82')" prop="gift">
            <el-input
              v-model="form.gift"
              :maxlength="20"
              :placeholder="$t('dba53da0.44da82')"
              style="width: 240px"
              @change="giftChange"
            />&nbsp;<span class="frm-tips"
              >{{ inputValue.gift_length }}/{{ inputValue.gift_max }}</span
            >
          </el-form-item>
          <el-form-item
            v-if="form.card_type === 'discount'"
            :label="$t('dba53da0.878d1f')"
            prop="discount"
          >
            <el-input
              v-model="form.discount"
              :disabled="form.card_id ? true : false"
              :placeholder="$t('dba53da0.64c7d6')"
              style="width: 240px"
              max="9.9"
              min="1"
            />
          </el-form-item>
          <el-form-item
            v-if="form.card_type === 'cash'"
            :label="$t('dba53da0.2fc887')"
            prop="reduce_cost"
          >
            <el-input
              v-model="form.reduce_cost"
              type="number"
              :disabled="form.card_id ? true : false"
              :placeholder="$t('dba53da0.922c27')"
              style="width: 240px"
            />&nbsp;{{ $t('dba53da0.c16655') }}
          </el-form-item>
          <el-form-item :label="$t('dba53da0.c3c2e5')" prop="quantity">
            <el-input
              v-model.number="form.quantity"
              min="1"
              :disabled="form.card_id ? true : false"
              type="number"
              oninput="value=value.replace(/[^\d.]/g,'')"
              :placeholder="$t('dba53da0.922c27')"
              style="width: 20%"
            />&nbsp;{{ $t('dba53da0.2a5da6') }}
          </el-form-item>
          <el-form-item :label="$t('dba53da0.a15f31')" prop="title">
            <el-input
              v-model="form.title"
              :disabled="form.card_id ? true : false"
              :placeholder="$t('dba53da0.81a736')"
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
          <el-form-item :label="$t('dba53da0.2f99a3')" prop="useCondition">
            <el-radio-group
              v-model="form.useCondition"
              :disabled="form.card_id ? true : false"
              @change="conditionChange"
            >
              <template v-if="form.card_type != 'cash'">
                <el-radio :label="1">{{ $t('dba53da0.c9fc99') }}</el-radio>
              </template>
              <template v-if="form.card_type !== 'gift'">
                <el-radio :label="2">
                  {{ $t('dba53da0.73325c') }} &nbsp;<el-input
                    v-model="form.least_cost"
                    type="number"
                    min="0"
                    :disabled="form.card_id || form.useCondition == 1 ? true : false"
                    style="width: 100px"
                  />&nbsp; {{ $t('dba53da0.a92c8d') }}&nbsp;&nbsp;
                  <template v-if="form.card_type === 'discount'">
                    {{ $t('dba53da0.953241') }}&nbsp;<el-input
                      v-model="form.most_cost"
                      :disabled="form.card_id || form.useCondition == 1 ? true : false"
                      style="width: 100px"
                    />&nbsp; {{ $t('dba53da0.c16655') }}
                  </template>
                </el-radio>
              </template>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('dba53da0.bb114a')" prop="date_type">
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
                  {{ $t('dba53da0.0f7001') }}
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
                  {{ $t('dba53da0.1aa2d7') }}&nbsp;
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
                  </el-select>
                  >&nbsp;{{ $t('dba53da0.b1aca7') }}&nbsp;

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
                    <template slot="append">{{ $t('dba53da0.249aba') }}</template>
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
                  {{ $t('dba53da0.071599') }}&nbsp;<el-date-picker
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
          <el-form-item :label="$t('dba53da0.f0772c')" prop="description">
            <el-input
              v-model="form.description"
              required
              type="textarea"
              :rows="6"
              resize="none"
              style="width: 600px"
              :placeholder="$t('dba53da0.7495c2')"
              @change="descriptionChange"
            />&nbsp;<span class="frm-tips"
              >{{ inputValue.description_length }}/{{ inputValue.description_max }}</span
            >
          </el-form-item>
          <el-form-item :label="$t('dba53da0.63629e')" prop="coupon_type">
            <el-radio-group v-model="form.coupon_type" @change="couponTypeChange">
              <el-radio label="mall">{{ $t('dba53da0.026087') }}</el-radio>
              <el-radio label="guide">{{ $t('dba53da0.fbf949') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            :label="$t('dba53da0.54ba9c')"
            prop="guide_issue_quantity"
            v-if="form.coupon_type == 'guide'"
          >
            <el-input
              v-model.number="form.guide_issue_quantity"
              type="number"
              min="1"
              :placeholder="$t('dba53da0.7acf30')"
              style="width: 240px"
              oninput="value=value.replace(/[^\d.]/g,'')"
            />
            <span class="frm-tips" style="margin-left: 10px; color: #909399">
              {{ $t('dba53da0.a146c1') }}
            </span>
          </el-form-item>

          <!-- <el-form-item label="优惠券模板ID" prop="card_code">
           <el-input :maxlength="255" placeholder="优惠券模板ID" v-model="form.card_code" style="width: 240px;"></el-input>&nbsp;<span class="frm-tips">{{inputValue.card_code}}</span>
        </el-form-item>
        <el-form-item label="优惠券规则ID" prop="card_rule_code">
           <el-input :maxlength="255" placeholder="优惠券规则ID" v-model="form.card_rule_code" style="width: 240px;"></el-input>&nbsp;<span class="frm-tips">{{inputValue.card_rule_code}}</span>
        </el-form-item> -->
        </el-card>
        <el-card shadow="never" :header="$t('dba53da0.602ab6')">
          <el-form-item :label="$t('dba53da0.466af0')">
            <el-switch v-model="form.receive" active-color="#13ce66" inactive-color="#d2d4db" />
          </el-form-item>
          <el-form-item :label="$t('dba53da0.92cb2f')">
            <el-input
              v-model="form.get_limit"
              type="number"
              style="width: 120px"
              min="1"
              oninput="value=value.replace(/[^\d.]/g,'')"
            />
            <p class="frm-tips">{{ $t('dba53da0.727b1d') }}</p>
          </el-form-item>
          <el-form-item
            v-if="is_distributor == false && form.card_type == 'gift'"
            :label="$t('dba53da0.b90304')"
          >
            <el-radio-group
              v-model="form.use_platform"
              :disabled="form.card_id != ''"
              @change="usePlatformChange"
            >
              <el-radio v-if="is_distributor == false" label="store">
                {{ $t('dba53da0.1b38a1') }}
              </el-radio>
              <el-radio v-if="form.card_type != 'gift'" label="mall">
                {{ $t('dba53da0.4448af') }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="is_distributor == false && form.card_type == 'gift'"
            :label="$t('dba53da0.b38589')"
            prop="use_scenes"
          >
            <el-radio-group v-model="form.use_scenes" :disabled="form.card_id != ''">
              <el-radio
                v-if="form.card_type != 'gift' && form.use_platform == 'mall'"
                label="ONLINE"
              >
                {{ $t('dba53da0.246cd4') }}
              </el-radio>
              <el-radio
                v-if="form.card_type != 'gift' && form.use_platform == 'store'"
                label="QUICK"
              >
                {{ $t('dba53da0.528132') }}
              </el-radio>
              <el-radio v-if="form.use_platform == 'store'" label="SELF">
                {{ $t('dba53da0.740624') }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.use_scenes == 'SELF'" :label="$t('dba53da0.983f59')">
            <el-radio-group v-model="self_rcode" :disabled="form.card_id != ''">
              <el-radio label="1">{{ $t('dba53da0.dedaee') }}</el-radio>
              <el-radio label="0">{{ $t('dba53da0.2a9882') }}</el-radio>
            </el-radio-group>
            <br />
            <el-input
              v-if="self_rcode === '1'"
              v-model="form.self_consume_code"
              style="width: 220px"
              :placeholder="$t('dba53da0.d0c06a')"
              maxlength="4"
              minlength="4"
            />
          </el-form-item>
        </el-card>
        <el-card
          v-if="form.use_platform == 'mall' && form.card_type != 'gift' && form.store_self == false"
          :header="$t('dba53da0.9897d8')"
          shadow="naver"
        >
          <el-form-item :label="$t('dba53da0.409ea3')">
            <el-radio-group v-model="form.use_all_items" @change="itemTypeChange">
              <el-radio label="true">{{ $t('dba53da0.a82c05') }}</el-radio>
              <el-radio label="false">{{ $t('dba53da0.1e0568') }}</el-radio>
              <el-radio label="category">
                {{ is_distributor ? $t('dba53da0.4e4c10') : $t('dba53da0.d66fdf') }}
              </el-radio>
              <el-radio label="tag">{{ $t('dba53da0.d61cbb') }}</el-radio>
              <el-radio label="brand">{{ $t('dba53da0.8f5e18') }}</el-radio>
            </el-radio-group>
          </el-form-item>

          <div v-if="!zdItemHidden" style="position: relative">
            <SkuSelector :data="relItems" @change="getItems">
              <template #selectGoodsButton>
                <el-upload
                  style="display: inline-block"
                  action=""
                  :on-change="uploadHandleChange"
                  :auto-upload="false"
                  :show-file-list="false"
                >
                  <el-button type="primary">{{ $t('dba53da0.c3202e') }}</el-button>
                </el-upload>
                <el-button type="primary" @click="uploadHandleTemplate()">
                  {{ $t('dba53da0.c3f9a1') }}
                </el-button>
              </template>
            </SkuSelector>
          </div>

          <el-col :xs="12" :sm="12" :md="12">
            <div v-if="!categoryHidden" style="height: 350px" class="custom_tree">
              <el-cascader
                v-model="form.item_category"
                style="width: 500px"
                :placeholder="$t('dba53da0.708c9d')"
                clearable
                :options="categoryList"
                :props="{
                  value: 'category_id',
                  label: 'category_name',
                  checkStrictly: false,
                  multiple: true
                }"
              />
            </div>
          </el-col>
          <template v-if="!tagHidden">
            <div class="selected-tags view-flex">
              <div class="label">{{ $t('dba53da0.e98819') }}</div>
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
              <div class="label">{{ $t('dba53da0.f5bf1f') }}</div>
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
          :header="$t('dba53da0.a7da92')"
          shadow="naver"
        >
          <el-form-item :label="$t('dba53da0.a874b0')">
            <el-radio-group v-model="form.use_all_shops" @change="shopTypeChange">
              <el-radio label="true">{{ $t('dba53da0.fcbbf2') }}</el-radio>
              <el-radio label="false">{{ $t('dba53da0.540e03') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="!zdShopHidden">
            <el-button type="primary" @click="addStoreAction">
              {{ $t('dba53da0.86c570') }}
            </el-button>
            <el-table v-if="relStores.length > 0" :data="relStores" style="line-height: normal">
              <el-table-column label="ID" prop="wxShopId" width="60" />
              <el-table-column :label="$t('dba53da0.d7ec2d')" prop="storeName" />
              <el-table-column
                prop="address"
                :label="$t('dba53da0.765048')"
                show-overflow-tooltip
              />
              <el-table-column :label="$t('dba53da0.2b6bc0')" width="50">
                <template slot-scope="scope">
                  <i class="el-icon-delete" @click="deleteRow(scope.$index, form.items)" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>

        <el-card
          v-if="VERSION_STANDARD() && is_distributor == false && form.use_platform == 'mall'"
          :header="$t('dba53da0.295713')"
          shadow="naver"
        >
          <el-form-item :label="$t('dba53da0.eb4307')">
            <el-radio-group v-model="form.use_all_shops" @change="shopTypeChange">
              <el-radio label="true">{{ $t('dba53da0.87e0ad') }}</el-radio>
              <el-radio label="false">{{ $t('dba53da0.3640e1') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="!zdShopHidden">
            <el-button type="primary" @click="addDistributorAction">
              {{ $t('dba53da0.afa2e6') }}
            </el-button>
            <el-table
              v-if="distributor_info.length > 0"
              :data="distributor_info"
              style="line-height: normal"
            >
              <el-table-column label="ID" prop="distributor_id" width="60" />
              <el-table-column :label="$t('dba53da0.d7ec2d')" prop="name" />
              <el-table-column
                prop="address"
                :label="$t('dba53da0.765048')"
                show-overflow-tooltip
              />
              <el-table-column :label="$t('dba53da0.2b6bc0')" width="50">
                <template slot-scope="scope">
                  <i
                    class="el-icon-delete"
                    @click="deleteDistritutorRow(scope.$index, form.items)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        <div class="content-center">
          <el-button @click="cancelSubmit">{{ $t('dba53da0.625fb2') }}</el-button>
          <el-button type="primary" :disabled="submitDisabled" @click="submitForm('form')">
            {{ $t('dba53da0.939d53') }}
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

    <SpTranslatePopup
      ref="translatePopup"
      table-name="kaquan_discount_cards"
      :data-id="translateContext.dataId"
      :fields="translateContext.fields"
      :values="translateContext.values"
      :source-language="translateContext.sourceLang"
      @done="onTranslateDone"
      @save-only="onTranslateSaveOnly"
      @cancel="onTranslateCancel"
    />
  </SpPage>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import store from '@/store'
import StoreSelect from '@/components/function/shopSelect'
import DistributorSelect from '@/components/storeListSelect'
import SkuSelector from '@/components/function/skuSelector'
import { getCardDetail, getWechatColor, creatCard, updateCard } from '@/api/cardticket'
import { pushNewsImage, getAuthorizerInfo } from '@/api/wechat'
import { getWxShopsList } from '@/api/shop'
import { getItemsList, getCategory, getTagList, getGoodsAttr } from '@/api/goods'
import { handleUploadFile, exportUploadTemplate } from '../../../api/common'
import GiftCoupon from './coupon/gift.vue'
import SpTranslatePopup from '@/components/sp-translate-popup'
import translateMixin from '@/mixins/translateMixin'
export default {
  mixins: [translateMixin],
  components: {
    StoreSelect,
    SkuSelector,
    DistributorSelect,
    Treeselect,
    GiftCoupon,
    SpTranslatePopup
  },
  inject: ['refresh'],
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
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
        brand_ids: [],
        coupon_type: 'mall', // 券类型：'mall'-商城券，'guide'-导购专属券
        guide_issue_quantity: '' // 导购发放数量
      },
      relItems: [],
      kqhjCheckedItem: '',
      twxxCheckedItem: '',
      zdItemHidden: true,
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
  computed: {
    totalDays() {
      const arr = [{ text: this.$t('dba53da0.c8bc7c'), value: 0 }]
      for (let i = 1; i <= 90; i++) {
        arr.push({ text: i + this.$t('dba53da0.249aba'), value: i })
      }
      return arr
    },
    remainDays() {
      const arr = []
      for (let i = 1; i <= 90; i++) {
        arr.push({ text: i + this.$t('dba53da0.249aba'), value: i })
      }
      return arr
    },
    rules() {
      return {
        gift: [{ required: true, message: this.$t('dba53da0.ae1987'), trigger: 'blur' }],
        discount: [
          { type: 'number', required: true, validator: this.discountChecked, trigger: 'blur' }
        ],
        reduce_cost: [
          { type: 'number', required: true, validator: this.reduceCostChecked, trigger: 'blur' }
        ],
        title: [{ required: true, validator: this.titleChecked, trigger: 'blur' }],
        date_type: [{ required: true, validator: this.dateChecked, trigger: 'blur' }],
        useCondition: [{ required: true, validator: this.useConditionChecked, trigger: 'blur' }],
        description: [{ required: true, validator: this.descriptionChecked, trigger: 'blur' }],
        quantity: [{ required: true, validator: this.quantityChecked, trigger: 'blur' }],
        use_scenes: [{ required: true, validator: this.useScenesChecked, trigger: 'blur' }]
      }
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
    useConditionChecked(rule, value, callback) {
      if (this.form.card_type === 'cash' && this.form.useCondition === 2) {
        if (this.form.least_cost === '') {
          callback(new Error(this.$t('dba53da0.41a4d5')))
        } else if (Number(this.form.least_cost) <= Number(this.form.reduce_cost)) {
          callback(new Error(this.$t('dba53da0.a90e1e')))
        } else {
          callback()
        }
      }
      if (this.form.card_type === 'discount' && this.form.useCondition === 2) {
        if (this.form.most_cost === '') {
          callback(new Error(this.$t('dba53da0.41a4d5')))
        } else if (Number(this.form.most_cost) <= Number(this.form.least_cost)) {
          callback(new Error(this.$t('dba53da0.7afa6c')))
        } else {
          callback()
        }
      }
      callback()
    },
    quantityChecked(rule, value, callback) {
      const reg = /^\d*$/
      if (value === '') {
        callback(new Error(this.$t('dba53da0.7faaf9')))
      } else if (!reg.test(value)) {
        callback(new Error(this.$t('dba53da0.f4302e')))
      } else {
        callback()
      }
    },
    dateChecked(rule, value, callback) {
      if (value == 'DATE_TYPE_FIX_TIME_RANGE' && this.date_range == '') {
        callback(new Error(this.$t('dba53da0.018459')))
      } else {
        callback()
      }
    },
    titleChecked(rule, value, callback) {
      if (value == '') {
        callback(new Error(this.$t('dba53da0.e3996f')))
      } else if (this.inputValue.title_length > this.inputValue.title_max) {
        callback(
          new Error(
            this.$t('dba53da0.d74495') +
              this.inputValue.title_max +
              this.$t('dba53da0.1c4c48') +
              this.inputValue.title_max * 2 +
              this.$t('dba53da0.f8cc05')
          )
        )
      } else {
        callback()
      }
    },
    descriptionChecked(rule, value, callback) {
      if (value == '') {
        callback(new Error(this.$t('dba53da0.8ca388')))
      } else if (this.inputValue.description_length > this.inputValue.description_max) {
        callback(
          new Error(
            this.$t('dba53da0.77034b') +
              this.inputValue.description_max +
              this.$t('dba53da0.1c4c48') +
              this.inputValue.description_max * 2 +
              this.$t('dba53da0.f8cc05')
          )
        )
      } else {
        callback()
      }
    },
    discountChecked(rule, value, callback) {
      const reg = /(^[1-9]((\.)[0-9])?$)/
      if (value == '') {
        callback(new Error(this.$t('dba53da0.ba0898')))
      } else if (!reg.test(value)) {
        callback(new Error(this.$t('dba53da0.5eefc7')))
      } else {
        callback()
      }
    },
    reduceCostChecked(rule, value, callback) {
      if (value == '') {
        callback(new Error(this.$t('dba53da0.566c5c')))
      } else if (parseFloat(value) > 0) {
        callback()
      } else {
        callback(new Error(this.$t('dba53da0.0c4033')))
      }
    },
    useScenesChecked(rule, value, callback) {
      if (value.length === 0) {
        callback(new Error(this.$t('dba53da0.06cb04')))
      }
      callback()
    },
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
        this.$message.error(this.$t('dba53da0.ea1a0b'))
        return
      }
      if (typeof this.form.days !== 'number') {
        this.$message.error(this.$t('dba53da0.fde53c'))
        return
      }

      const that = this
      if (this.form.date_type == 'DATE_TYPE_FIX_TIME_RANGE' && this.date_range.length > 0) {
        this.form.begin_time = this.date_range[0]
        this.form.end_time = this.date_range[1]
      }
      if (this.form.use_scenes == 'SELF' && this.self_rcode == '1') {
        if (!this.form.self_consume_code) {
          this.$message.error(this.$t('dba53da0.88ce76'))
          return
        }
        if (this.form.self_consume_code && this.form.self_consume_code.length != 4) {
          this.$message.error(this.$t('dba53da0.5c37f6'))
          return
        }
        let reg = /^\d*$/
        if (this.form.self_consume_code && !reg.test(this.form.self_consume_code)) {
          this.$message.error(this.$t('dba53da0.2f523c'))
          return
        }
      }
      if (this.form.use_all_shops === 'false' && !this.form.rel_shops_ids) {
        this.$message.error(this.$t('dba53da0.ed4945'))
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
      params.item_category = JSON.stringify(
        this.form.item_category.map((item) => item[item.length - 1])
      )
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
                    message: this.$t('dba53da0.55aa63'),
                    type: 'success',
                    duration: 2 * 1000
                  })
                  this.refresh()
                  this.openTranslate(this.form.card_id, ['title', 'description'], [this.form.title || '', this.form.description || ''])
                } else {
                  this.$message.error(this.$t('dba53da0.445eb0'))
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
                    message: this.$t('dba53da0.3fdaea'),
                    type: 'success',
                    duration: 2 * 1000
                  })
                  this.refresh()
                  // 创建/编辑保持一致：弹「同步翻译」弹框；仅保存/取消由 mixin 跳回列表
                  const newCardId = (res.data.data && res.data.data.card_id) || this.form.card_id
                  this.openTranslate(newCardId, ['title', 'description'], [this.form.title || '', this.form.description || ''])
                } else {
                  this.$message.error(this.$t('dba53da0.be28db'))
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
      if (this.is_distributor) {
        const res = await this.$api.goods.getCategory({ is_show: false })
        this.categoryList = res
        this.getCategoryVal()
        return
      }
      const res = await this.$api.goods.getCategory({ is_main_category: true, ignore_none: true })
      this.categoryList = res
      this.getCategoryVal()
    },
    getCategoryPaths(categories, targetIds) {
      // 存储每个目标ID的路径
      const paths = {}

      // 递归查找路径
      function findPath(node, currentPath) {
        const newPath = [...currentPath, node.category_id]

        // 如果当前节点是目标ID，记录路径
        if (targetIds.includes(node.category_id)) {
          paths[node.category_id] = newPath
        }

        // 继续遍历子节点
        if (node.children && node.children.length > 0) {
          node.children.forEach((child) => findPath(child, newPath))
        }
      }

      // 从根节点开始遍历
      categories.forEach((root) => findPath(root, []))

      // 构建结果数组，按目标ID的顺序排列
      return targetIds.map((id) => paths[id] || [])
    },
    getCategoryVal() {
      if (this.form.card_id) {
        this.form.item_category = this.getCategoryPaths(this.categoryList, this.form.item_category)
      }
    },
    addItemTag() {
      this.tag.currentTags = []
      if (this.item_id.length) {
        this.showTags()
        this.tag.form.item_ids = this.item_id
      } else {
        this.$message({
          type: 'error',
          message: this.$t('dba53da0.c5f66d')
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
      let params = { file_type: 'marketing_goods', file_name: this.$t('dba53da0.e07423') }
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
            message: this.$t('dba53da0.bfd8d5')
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
          message: this.$t('dba53da0.a7699b')
        })

        let { data } = response.data

        if (data.fail.length > 0) {
          let str = data.fail.map((item) => {
            return item.item_bn
          })

          setTimeout(() => {
            this.$message({
              showClose: true,
              message: `${this.$t('dba53da0.ef474d')}${str}`,
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
    },
    couponTypeChange(value) {
      if (value === 'guide') {
        this.form.receive = false
      }
    }
  }
}
</script>
<style scoped lang="scss">
.page-cardticket ::v-deep .el-card {
  margin-bottom: 20px;
}
// .card-content {
//   &-head {
//     text-align: center;
//     color: #fff;
//     padding: 20px 15px;
//     font-size: 14px;
//     .price {
//       font-size: 32px;
//     }
//     .validity-date {
//       color: #efefef;
//       font-size: 12px;
//     }
//   }
//   &-body {
//     padding: 20px 15px;
//     min-height: 400px;
//     background: #fff;
//     .barcode-img {
//       width: 160px;
//       height: 80px;
//       margin: 0 auto 15px;
//       img {
//         width: 100%;
//         height: 100%;
//       }
//     }
//     .code-img {
//       width: 120px;
//       height: 118px;
//       margin: 0 auto 15px;
//       img {
//         width: 100%;
//         height: 100%;
//       }
//     }

//     .txt-title {
//       color: #333;
//       font-weight: bold;
//     }
//     .txt-content {
//       padding-left: 15px;
//       span {
//         margin: 0 5px;
//       }
//     }
//   }
// }
// .bd {
//   border-bottom: 1px dashed #ddd;
// }
// .mb {
//   margin-bottom: 10px;
// }
// .card-edit-detail {
//   background: #fff;
//   input {
//     width: 30%;
//   }
// }
// .affix {
//   position: fixed;
//   width: 320px;
//   overflow: hidden;
// }
// .section-footer {
//   padding: 15px 10px;
//   text-align: center;
//   .with-border {
//     border-top: 1px solid #f8f8f8;
//   }
// }
// .card_article_box .card_article_img {
//   background-color: #fff;
// }
// .media_edit {
//   display: block;
//   position: relative;
//   z-index: 2;
//   float: none;
//   min-width: 800px;
//   margin-left: 340px;
// }
// .tips {
//   margin-left: 2px;
// }
// .el-select {
//   width: 110px;
// }
</style>
<style type="text/css" lang="scss">
// .color-group {
//   li {
//     width: 30px;
//     height: 30px;
//     float: left;
//     cursor: pointer;
//     &:hover {
//       border: 2px solid #fff;
//     }
//     &.active {
//       border: 2px solid #fff;
//     }
//   }
// }
// .el-radio-group {
//   .el-radio__input.is-checked + .el-radio__label,
//   .el-radio__input.is-checked .el-radio__inner {
//     color: #606272;
//   }
// }
// .el-checkbox-group {
//   .el-checkbox__input.is-checked + .el-checkbox__label {
//     color: #606272;
//   }
// }
// .custom_tree {
// }
</style>
