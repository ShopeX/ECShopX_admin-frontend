<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style scoped lang="scss">
.tag-users {
  padding-bottom: 10px;
  line-height: 1.2;
  .icon-user-circle1 {
    margin-right: 10px;
    font-size: 24px;
    color: #ccc;
  }
}
.sp-filter-form {
  margin-bottom: 16px;
}
.selected-tags {
  padding-top: 15px;
  margin-bottom: 15px;
  border-top: 1px solid #efefef;
  border-bottom: 1px solid #efefef;
  .label {
    margin-bottom: 15px;
  }
  .el-tag {
    margin-right: 10px;
    margin-bottom: 15px;
  }
}
.tag-item {
  cursor: pointer;
  color: #666;
  border-color: #dadadd;
  margin-right: 10px;
  margin-top: 10px;
}
.dialog-list li {
  width: 50%;
  float: left;
  padding-left: 30px;
  padding-right: 20px;
  line-height: 30px;
  cursor: pointer;
  &.checked {
    color: #ff5000;
  }
  &:hover {
    background: #f8f8f8;
  }
}
.filter-header {
  padding-right: 50px;
  height: 40px;
  overflow: hidden;
  &.open {
    height: auto;
  }
  .collapse-btn {
    position: absolute;
    right: 20px;
    top: 0;
  }
}
</style>

<style>
.form-item__label {
  white-space: nowrap;
}
</style>

<template>
  <SpPage>
    <SpRouterView>
      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset" :label-width="110">
        <SpFilterFormItem prop="mobile" :label="$t('ff557c54.ce2bf3')">
          <el-input v-model="params.mobile" :placeholder="$t('ff557c54.6e4f4b')" />
        </SpFilterFormItem>
        <SpFilterFormItem v-if="!VERSION_SHUYUN()" prop="username" :label="$t('ff557c54.652ced')">
          <el-input v-model="params.username" :placeholder="$t('ff557c54.32b6e8')" />
        </SpFilterFormItem>
        <SpFilterFormItem
          v-if="!VERSION_IN_PURCHASE()"
          prop="vip_grade"
          :label="!VERSION_SHUYUN() ? $t('ff557c54.71d220') : $t('ff557c54.939890')"
        >
          <el-select v-model="params.vip_grade" clearable :placeholder="$t('ff557c54.708c9d')">
            <el-option
              v-for="item in vipGrade"
              :key="item.lv_type"
              :label="item.grade_name"
              :value="item.lv_type"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem
          v-if="!VERSION_IN_PURCHASE()"
          prop="grade_id"
          :label="$t('ff557c54.3b387e')"
        >
          <el-select v-model="params.grade_id" clearable :placeholder="$t('ff557c54.708c9d')">
            <el-option
              v-for="item in levelData"
              :key="item.grade_id"
              :label="item.grade_name"
              :value="item.grade_id"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem
          v-if="!VERSION_IN_PURCHASE()"
          prop="reg_salesperson"
          :label="$t('ff557c54.645caa')"
        >
          <el-input v-model="params.reg_salesperson" :placeholder="$t('ff557c54.6ebdc6')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="created" :label="$t('ff557c54.38d169')">
          <el-date-picker
            v-model="created"
            unlink-panels
            type="daterange"
            align="right"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :range-separator="$t('ff557c54.981cbe')"
            :start-placeholder="$t('ff557c54.b44c0f')"
            :end-placeholder="$t('ff557c54.1d468b')"
            prefix-icon="null"
            :picker-options="pickerOptions"
            @change="dateChange"
          />
        </SpFilterFormItem>
        <!-- <SpFilterFormItem prop="wechat_nickname" label="微信昵称:">
            <el-input v-model="params.wechat_nickname" placeholder="请输入微信昵称" />
          </SpFilterFormItem> -->
        <SpFilterFormItem prop="remarks" :label="$t('ff557c54.55bea7')">
          <el-input v-model="params.remarks" :placeholder="$t('ff557c54.2432b5')" />
        </SpFilterFormItem>
        <SpFilterFormItem
          v-if="!VERSION_IN_PURCHASE()"
          prop="have_consume"
          :label="$t('ff557c54.51a5cd')"
        >
          <el-select v-model="params.have_consume" :placeholder="$t('ff557c54.708c9d')" clearable>
            <el-option :label="$t('ff557c54.e64690')" value="true" />
            <el-option :label="$t('ff557c54.edd98a')" value="false" />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="role" :label="$t('ff557c54.e1f833')">
          <el-select v-model="params.role" :placeholder="$t('ff557c54.708c9d')" clearable>
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="$t(item.label)"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="reg_distributor" :label="$t('ff557c54.163992')">
          <SpSelectShop
            v-model="params.reg_distributor"
            clearable
            :placeholder="$t('ff557c54.708c9d')"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="store_name" :label="$t('ff557c54.69837d')">
          <SpSelectShop
            v-model="params.store_name"
            clearable
            :placeholder="$t('ff557c54.708c9d')"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="employee_number" :label="$t('ff557c54.ee1fb4')">
          <el-input v-model="params.employee_number" :placeholder="$t('ff557c54.6ebdc6')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="birthday" :label="$t('ff557c54.803b81')">
          <el-date-picker
            v-model="birthday"
            unlink-panels
            type="daterange"
            align="right"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :range-separator="$t('ff557c54.981cbe')"
            :start-placeholder="$t('ff557c54.b44c0f')"
            :end-placeholder="$t('ff557c54.1d468b')"
            prefix-icon="null"
            :picker-options="pickerOptions"
            @change="birthdayChange"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="tag_id" :label="$t('ff557c54.4d4b82')">
          <div class="flex items-center gap-2">
            <el-input
              readonly
              :value="tagSelectValue"
              :placeholder="$t('ff557c54.278c26')"
              style="flex: 1"
              @click.native="showCrowdTagDialog = true"
            >
              <template slot="suffix">
                <i
                  v-if="clearTagBtnVisible"
                  key="clear"
                  class="el-input__icon el-icon-circle-close"
                  @click.stop="handleClearTag"
                />
                <i
                  v-else
                  key="add"
                  class="el-input__icon el-icon-circle-plus"
                  style="cursor: pointer"
                />
              </template>
            </el-input>
          </div>
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" @click="showTagDialog = true">
{{
          $t('ff557c54.fedbca')
        }}
</el-button>
        <el-button v-if="!VERSION_IN_PURCHASE()" type="primary" @click="onSelectCoupon">
          {{ $t('ff557c54.afa583') }}
        </el-button>
        <el-button v-if="!IS_DISTRIBUTOR()" type="primary" @click="batchActionDialog('send_sms')">
          {{ $t('ff557c54.43e10b') }}
        </el-button>
        <el-button
          v-if="!IS_DISTRIBUTOR() && !VERSION_IN_PURCHASE()"
          type="primary"
          @click="handleVipGradeDelay(false)"
        >
          {{ $t('ff557c54.54dfae') }}
        </el-button>
        <el-button
          v-if="!IS_DISTRIBUTOR() && !VERSION_IN_PURCHASE() && !VERSION_SHUYUN()"
          type="primary"
          @click="batchActionDialog('set_grade')"
        >
          {{ $t('ff557c54.1eaeee') }}
        </el-button>
        <el-button type="primary" @click="batchActionDialog('change_shop')">
{{
          $t('ff557c54.2b518f')
        }}
</el-button>
        <el-button type="primary" @click="exportData">{{ $t('ff557c54.55405e') }}</el-button>
      </div>

      <SpFinder
        ref="finder"
        :setting="setting"
        :row-key="getRowKeys"
        url="/members"
        reserve-selection
        fixed-row-action
        :page-size="pageSize"
        row-actions-width="180px"
        row-actions-fixed-align="left"
        :hooks="{
          beforeSearch: beforeSearch
        }"
        @selection-change="handleSelectionChange"
      />

      <el-dialog
        :title="$t('ff557c54.d6d933')"
        :visible.sync="downloadView"
        :close-on-click-modal="false"
      >
        <template v-if="downloadUrl">
          <a :href="downloadUrl" download>{{ downloadName }}</a>
        </template>
      </el-dialog>

      <el-dialog
        width="50%"
        :title="dialogTitle"
        :before-close="handleCancelLabelsDialog"
        :visible.sync="dialogIsShow"
      >
        <template v-if="params.action_type == 'send_sms'">
          <el-form>
            <el-form-item class="content-center">
              <el-input
                v-model="sms_content"
                focus
                type="textarea"
                :rows="4"
                :placeholder="$t('ff557c54.56ad80')"
                @blur="checkNum"
              />
              <span>{{ sms_content.length }}</span>
            </el-form-item>
            <el-form-item class="content-center">
              <el-button type="primary" @click="onSmsSends">{{ $t('ff557c54.3ceeb0') }}</el-button>
            </el-form-item>
          </el-form>
          <template>
            <el-alert
              :title="$t('ff557c54.5703c0')"
              type="info"
              :description="$t('ff557c54.7620dc')"
            />
            <el-alert
              :title="$t('ff557c54.fe1e74')"
              type="info"
              :description="$t('ff557c54.3dd7a6')"
            />
            <el-alert
              :title="$t('ff557c54.d2a1b2')"
              type="info"
              :description="$t('ff557c54.c06d10')"
            />
          </template>
        </template>

        <template v-if="params.action_type == 'vip_delay'">
          <el-form label-width="100px">
            <el-form-item class="content-center" :label="$t('ff557c54.ae0bd7')">
              <el-row>
                <el-col :span="8">
                  <el-select v-model="vipGradeDelay.vip_grade_id" style="width: 100%">
                    <el-option
                      v-for="item in vipGrade"
                      :key="item.lv_type"
                      :label="item.grade_name"
                      :value="item.vip_grade_id"
                    />
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item class="content-center" :label="$t('ff557c54.480f8d')">
              <el-row>
                <el-col :span="8">
                  <el-select v-model="vipGradeDelay.filter" style="width: 100%">
                    <el-option key="users" :label="$t('ff557c54.715055')" value="users" />
                    <el-option key="expired" :label="$t('ff557c54.f659da')" value="expired" />
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item class="content-center" :label="$t('ff557c54.e279cb')">
              <el-row>
                <el-col :span="8">
                  <el-input v-model="vipGradeDelay.add_day" />
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item class="content-center">
              <el-button type="primary" @click="handleVipGradeDelay(true)">
{{
                $t('ff557c54.bb47cb')
              }}
</el-button>
            </el-form-item>
          </el-form>
        </template>

        <template v-if="params.action_type == 'set_grade'">
          <el-form label-width="100px">
            <el-form-item class="content-center" :label="$t('ff557c54.6c1583')">
              <el-row>
                <el-col :span="8">
                  <el-select v-model="gradeForm.grade_id" style="width: 100%">
                    <el-option
                      v-for="item in gradeList"
                      :key="item.grade_id"
                      :label="item.grade_name"
                      :value="item.grade_id"
                    />
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item class="content-center" :label="$t('ff557c54.2432b5')">
              <el-row>
                <el-col :span="20">
                  <el-input v-model="gradeForm.remarks" focus type="textarea" :rows="3" />
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item class="content-center">
              <el-button type="primary" @click="gradeUpdateSubmit">
{{
                $t('ff557c54.49d2ff')
              }}
</el-button>
            </el-form-item>
          </el-form>
        </template>

        <template v-if="params.action_type == 'set_saleman'">
          <el-col :gutter="20">
            <el-input
              v-model="salesmanPaging.mobile"
              class="input-m"
              :placeholder="$t('ff557c54.d3ef8d')"
              clearable
            >
              <el-button slot="append" icon="el-icon-search" @click="salesmanSearch" />
            </el-input>
            <el-input
              v-model="salesmanPaging.name"
              class="input-m"
              :placeholder="$t('ff557c54.cf6d0a')"
              clearable
            >
              <el-button slot="append" icon="el-icon-search" @click="salesmanSearch" />
            </el-input>
          </el-col>
          <el-table
            v-loading="loadingSalesman"
            :data="salesman"
            highlight-current-row
            @row-click="handleSalesmanChange"
          >
            <el-table-column label="ID" prop="salesperson_id" />
            <el-table-column :label="$t('ff557c54.a6d9eb')" prop="salesman_name" />
            <el-table-column :label="$t('ff557c54.8098e2')" prop="mobile" />
          </el-table>
          <el-pagination
            class="content-center content-padded"
            background
            :current-page="salesmanPaging.page"
            :page-sizes="[10, 30, 50]"
            :page-size="salesmanPaging.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="salesmanPaging.total_count"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
          <div class="content-padded content-center">
            <el-button type="default" @click="dialogIsShow = false">
{{
              $t('ff557c54.625fb2')
            }}
</el-button>
            <el-button type="primary" @click="setSalesman(true)">
{{
              $t('ff557c54.38cf16')
            }}
</el-button>
          </div>
        </template>

        <template v-if="params.action_type == 'basic_info'">
          <el-form :model="membersSetting" label-width="100px">
            <el-form-item
              v-for="(item, key) in membersSetting"
              :key="key"
              class="content-center"
              :label="item.name"
            >
              <template v-if="item.element_type == 'input'">
                <el-input
                  v-model="basicInfo[key]"
                  :disabled="
                    key == 'mobile' ||
                    key == 'username' ||
                    (key == 'address' && datapass_block == 1)
                  "
                />
              </template>
              <template v-if="item.element_type == 'date'">
                <template v-if="key == 'birthday'">
                  <el-date-picker
                    v-model="basicInfo[key]"
                    style="width: 100%"
                    type="date"
                    :placeholder="$t('ff557c54.2bebdd')"
                    :disabled="datapass_block == 1"
                    :clearable="false"
                    :editable="false"
                    value-format="yyyy-MM-dd"
                  />
                </template>
              </template>
              <template v-if="item.element_type == 'select'">
                <template v-if="key == 'sex'">
                  <el-select
                    v-model="basicInfo[key]"
                    style="width: 100%"
                    :disabled="datapass_block == 1"
                  >
                    <el-option
                      v-for="sex in sexoptionList"
                      :key="sex.value"
                      :label="sex.label"
                      :value="sex.value"
                    />
                  </el-select>
                </template>
                <template v-else>
                  <el-select v-model="basicInfo[key]" style="width: 100%">
                    <el-option
                      v-for="(op_item, op_key) in item.items"
                      :key="op_key"
                      :label="op_item"
                      :value="op_key.toString()"
                    />
                  </el-select>
                </template>
              </template>
              <template v-if="item.element_type == 'checkbox'">
                <template v-if="key == 'habbit'">
                  <el-select
                    v-model="basicInfo[key]"
                    style="width: 100%"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    :placeholder="$t('ff557c54.f3f8dd')"
                  >
                    <el-option
                      v-for="ha_item in item.items"
                      :key="ha_item.name"
                      :label="ha_item.name"
                      :value="ha_item.name"
                    />
                  </el-select>
                </template>
              </template>
            </el-form-item>
            <el-form-item class="content-center">
              <el-button type="primary" @click="infoUpdateSubmit">
{{
                $t('ff557c54.49d2ff')
              }}
</el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-dialog>

      <el-dialog
        :title="$t('ff557c54.c62ca6')"
        class="right-dialog"
        :visible.sync="editMobileDialog"
        :before-close="handleCancelLabelsDialog"
      >
        <template>
          <el-form>
            <el-form-item label-width="100px" :label="$t('ff557c54.5b0f22')">
              {{ form.username }}
            </el-form-item>
            <el-form-item label-width="100px" :label="$t('ff557c54.1c6fb6')">
              {{ form.oldMobile }}
            </el-form-item>
            <el-form-item label-width="100px" :label="$t('ff557c54.0c228e')">
              <el-input v-model="form.newMobile" :placeholder="$t('ff557c54.8098e2')" />
            </el-form-item>
            <el-form-item class="content-center ml-[30px]">
              <el-button type="primary" @click="onEditMobileSubmit">
{{
                $t('ff557c54.b04fcb')
              }}
</el-button>
            </el-form-item>
          </el-form>
        </template>
        <template>
          <el-table v-loading="loading" :data="operateLog" height="580" border>
            <el-table-column prop="old_data" :label="$t('ff557c54.1c6fb6')" />
            <el-table-column prop="new_data" :label="$t('ff557c54.5c725a')" />
            <el-table-column prop="operater" :label="$t('ff557c54.676e59')" />
            <el-table-column prop="created" :label="$t('ff557c54.7e951d')">
              <template slot-scope="scope">
                <span>{{ scope.row.created | formatTimestamp }}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-dialog>

      <el-dialog
        :title="remarksForm.title"
        class="right-dialog"
        :visible.sync="isEditRemarks"
        :before-close="handleCancelLabelsDialog"
      >
        <template>
          <el-form>
            <el-form-item label-width="100px" :label="remarksForm.label">
              <el-input v-model="remarksForm.input" :placeholder="remarksForm.placeholder" />
            </el-form-item>
            <el-form-item class="content-center ml-[50px]">
              <el-button type="primary" @click="editRemarks()">
{{
                $t('ff557c54.38cf16')
              }}
</el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-dialog>

      <!-- 调整上下级弹框 -->
      <el-dialog
        :title="$t('ff557c54.23ced7')"
        :visible.sync="editSuperiorVisible"
        :before-close="handleCancelSuperior"
      >
        <el-row :gutter="10">
          <el-col :md="8" :lg="10">
            <el-input v-model="identifierModal" :placeholder="$t('ff557c54.6e4f4b')">
              <el-button slot="append" icon="el-icon-search" @click="numberSearchModal" />
            </el-input>
          </el-col>
        </el-row>

        <el-table
          v-loading="modalLoading"
          :data="modalList"
          style="width: 100%"
          :height="400"
          :element-loading-text="$t('ff557c54.6d7faa')"
          highlight-current-row
          @current-change="handleCurrentChangeUpLV"
        >
          <el-table-column type="index" width="50" />
          <el-table-column prop="username" :label="$t('ff557c54.60d045')" />
          <el-table-column prop="mobile" :label="$t('ff557c54.8098e2')" />
          <el-table-column prop="disabled" :label="$t('ff557c54.3fea7c')">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.disabled == '0'" type="success" size="mini">
{{
                $t('ff557c54.c6cc39')
              }}
</el-tag>
              <el-tag v-else type="info" size="mini">{{ $t('ff557c54.1abbb1') }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="modal_total_count > paramsModal.pageSize" class="mt-4 text-right">
          <el-pagination
            layout="prev, pager, next"
            :current-page.sync="paramsModal.page"
            :total="modal_total_count"
            :page-size="paramsModal.pageSize"
            @current-change="handleModalPage"
          />
        </div>
        <div slot="footer" class="dialog-footer content-center">
          <el-button @click.native="handleCancelSuperior">{{ $t('ff557c54.625fb2') }}</el-button>
          <el-button type="primary" @click="submitSuperiorAction">
{{
            $t('ff557c54.38cf16')
          }}
</el-button>
        </div>
      </el-dialog>

      <template v-if="aliyunsmsDialogVisible">
        <aliyunsmsDialog
          :exterior="true"
          :visible="aliyunsmsDialogVisible"
          :user_id="user_id"
          :info="aliyunsmsDialogInfo"
          @smsMassLogEditHandler="switchAliyunsmsDialog"
        />
      </template>

      <!-- 批量打标签弹框 -->
      <CompTagsMore
        :title="$t('ff557c54.4f1e39')"
        :visible.sync="showTagDialog"
        @confirm="handleTagConfirm"
      />

      <!-- 人群达标标签选择弹框 -->
      <CompTagsMore
        :title="$t('ff557c54.fb7b49')"
        :visible.sync="showCrowdTagDialog"
        :selected-tags="selectedCrowdTags"
        @confirm="handleCrowdTagConfirm"
      />
    </SpRouterView>
  </SpPage>
</template>

<script>
import exportTip from '@/components/export_tips'
import aliyunsmsDialog from '@/views/settings/systemConfig/smsService/sms_MassLog_edit.vue'

import { mapGetters } from 'vuex'
import {
  updateMemberMobile,
  getMemberOperateLog,
  memberExport,
  updateMemberGrade,
  getMemberRegisterSetting,
  updateMemberBasicInfo,
  setCheif,
  batchOperating,
  updateMemberInfo
} from '@/api/member'
import { getSalesmanList } from '@/api/marketing'
import { getEffectiveCardList } from '@/api/cardticket'
import shopSelect from '@/components/shopSelect'
import { ROLE_LIST } from '@/consts'
import { finderSetting } from './config/member_list_schema'
import CompTagsMore from '@/views/members/components/CompTagsMore.vue'

export default {
  components: {
    shopSelect,
    exportTip,
    aliyunsmsDialog,
    CompTagsMore
  },
  data() {
    return {
      editSuperiorVisible: false,
      modalLoading: false,
      paramsModal: {
        page: 1,
        pageSize: 14,
        mobile: ''
      },
      identifierModal: '',
      modalList: [],
      modal_total_count: 0,

      aliyunsms_status: false, //ali 短信状态
      aliyunsmsDialogVisible: false,
      aliyunsmsDialogInfo: {
        type: 'add'
      },
      roleList: ROLE_LIST,
      panel: {
        search: false
      },
      isEditRemarks: false,
      loading: false,
      mobile: '',
      total_count: 0,
      vipGradeDelay: {
        vip_grade_id: '',
        add_day: 0,
        filter: 'users'
      },
      levelData: [],
      user_id: [],
      dialogTitle: '',
      dialogIsShow: false,
      card_type: 'all',
      staffCoupons: {
        dialog: false,
        temp: [],
        list: [],
        checked: [],
        page: {
          pageSize: 20,
          currentPage: 1,
          total: 0
        }
      },
      remarksForm: {
        user_id: '',
        title: '',
        label: '',
        placeholder: '',
        type: '',
        input: ''
      },
      gradeForm: {
        user_id: '',
        grade_id: '',
        old_grade_id: '',
        remarks: ''
      },
      smsUserData: [],
      sms_content: '',
      editMobileDialog: false,
      form: {
        oldMobile: '',
        user_id: '',
        newMobile: ''
      },
      params: {
        vip_grade: '',
        tag_id: '',
        mobile: '',
        have_consume: '',
        role: '',
        reg_distributor: '',
        store_name: '',
        employee_number: '',
        birthday_start: '',
        birthday_end: '',
        reg_salesperson: ''
      },
      operateLog: [],
      currentShop: '',
      salesman: [],
      loadingSalesman: false,
      salesmanPaging: {
        name: '',
        mobile: '',
        page: 1,
        pageSize: 10,
        total_count: 0
      },
      salesperson_id: '',
      salesperson_name: '',
      salesperson_mobile: '',
      is_batch: false,
      currentDistributor: '',
      downloadView: false,
      downloadUrl: '',
      downloadName: '',
      wxShopsList: [],
      distributorShopList: [],
      performInit: false,
      created: '',
      birthday: '',
      pickerOptions: {
        shortcuts: [
          {
            text: this.$t('ff557c54.56ee10'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: this.$t('ff557c54.335dfc'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: this.$t('ff557c54.d96eb4'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      sexoption: [
        { value: '0', label: '未知' },
        { value: '1', label: '男' },
        { value: '2', label: '女' }
      ],
      membersSetting: [],
      basicInfo: {
        user_id: '',
        username: '',
        sex: '',
        birthday: '',
        address: '',
        email: '',
        industry: '',
        income: '',
        edu_background: '',
        habbit: []
      },
      datapass_block: 1,
      gradeList: [], // 普通会员等级列表
      vipGrade: [], // 付费会员等级列表
      dmcrmIsOpen: false,
      changeStoreId: '',
      selectedCoupons: [],
      showTagDialog: false,
      showCrowdTagDialog: false,
      selectedCrowdTags: [], // 人群达标选中的标签
      pageSize: 20
    }
  },
  watch: {
    'params.tag_id': {
      handler(newVal) {
        if (!newVal || newVal.length === 0) {
          this.selectedCrowdTags = []
        } else {
          this.selectedCrowdTags = this.selectedCrowdTags.filter((tag) =>
            newVal.includes(tag.tag_id)
          )
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(['isMicorMall', 'login_type']),
    setting() {
      return finderSetting(this)
    },
    sexoptionList() {
      return [
        { value: '0', label: this.$t('ff557c54.1622dc') },
        { value: '1', label: this.$t('ff557c54.36a490') },
        { value: '2', label: this.$t('ff557c54.87c835') }
      ]
    },
    // 标签选择器显示值
    tagSelectValue() {
      if (this.selectedCrowdTags.length === 0) {
        return ''
      }
      if (this.selectedCrowdTags.length === 1) {
        return this.selectedCrowdTags[0].tag_name
      }
      return this.$t('ff557c54.731737', { count: this.selectedCrowdTags.length })
    },
    // 清除按钮是否显示
    clearTagBtnVisible() {
      return this.selectedCrowdTags.length > 0
    }
  },
  mounted() {
    const { salesman_mobile, wechat_nickname, mobile, orderRecords, grade_id } = this.$route.query

    this.params.salesman_mobile = salesman_mobile
    if (wechat_nickname) {
      this.params.wechat_nickname = wechat_nickname
    }
    if (mobile) {
      this.params.mobile = mobile
    }
    if (orderRecords) {
      this.params.have_consume = orderRecords
    }
    if (grade_id) {
      this.params.grade_id = grade_id
    }
    this.getMembers()
    this.getGradeList()
    this.getShopsList()
    getMemberRegisterSetting().then((response) => {
      delete response.data.data.content_agreement
      this.membersSetting = response.data.data.setting
    })

    // 获取短信type
    this.getAliSMS()
    this.$api.third.getDmcrmSetting().then((response) => {
      this.dmcrmIsOpen = response.is_open
    })
  },
  methods: {
    async getAliSMS() {
      const { aliyunsms_status } = await this.$api.sms.getaliSmsStatus()
      this.aliyunsms_status = aliyunsms_status
    },
    gradeUpdate(row) {
      this.params.action_type = 'set_grade'
      this.dialogTitle = this.$t('ff557c54.1f7120')
      this.dialogIsShow = true
      this.gradeForm.user_id = row.user_id
      this.gradeForm.grade_id = row.grade_id
      this.gradeForm.old_grade_id = row.grade_id
      this.gradeForm.remarks = row.remarks
      this.is_batch = false
    },
    infoUpdate(value) {
      this.params.action_type = 'basic_info'
      this.dialogTitle = this.$t('ff557c54.523fb8')
      this.dialogIsShow = true
      this.basicInfo.user_id = value.user_id
      this.basicInfo.username = value.username
      this.basicInfo.mobile = value.mobile
      this.basicInfo.sex = value.sex
      this.basicInfo.birthday = value.birthday
      this.basicInfo.address = value.address
      this.basicInfo.email = value.email
      this.basicInfo.industry = value.industry
      this.basicInfo.income = value.income
      this.basicInfo.edu_background = value.edu_background
      let habbit = []
      value.habbit.forEach((data) => {
        if (data) {
          if (data.ischecked == 'true') {
            habbit.push(data.name)
          }
        }
      })
      this.basicInfo.habbit = habbit
      for (let setting in this.membersSetting) {
        for (let row in value) {
          if (setting == row) {
            this.membersSetting[setting].value = value[row]
            if (setting == 'habbit') {
              this.membersSetting[setting].value = habbit
            }
          }
        }
      }
    },
    infoUpdateSubmit() {
      updateMemberBasicInfo(this.basicInfo).then((res) => {
        this.$message({ type: 'success', message: this.$t('ff557c54.69be67') })
        this.$refs.finder.refresh()
        this.dialogIsShow = false
      })
    },
    gradeUpdateSubmit() {
      if (!this.gradeForm.grade_id) {
        this.$message({
          type: 'error',
          message: this.$t('ff557c54.ccd519')
        })
        return
      }
      if (this.is_batch === false) {
        updateMemberGrade(this.gradeForm).then((res) => {
          this.$message({ type: 'success', message: this.$t('ff557c54.69be67') })
          this.$refs.finder.refresh()
          this.dialogIsShow = false
        })
      } else {
        this.params.grade_form = JSON.stringify(this.gradeForm)
        this.batchAction(this.$t('ff557c54.13daef'))
      }
    },
    editRemarks() {
      let params = {
        user_id: this.remarksForm.user_id
      }
      if (this.remarksForm.type == 'remarks') {
        params.remarks = this.remarksForm.input
      } else {
        params.name = this.remarksForm.input
      }
      updateMemberInfo({ ...params }).then((res) => {
        this.$message({ type: 'success', message: this.$t('ff557c54.55aa63') })
        this.isEditRemarks = false
        this.$refs.finder.refresh()
      })
    },
    isEdit(row, val) {
      this.isEditRemarks = true
      if (val == 'remarks') {
        this.remarksForm = {
          user_id: row.user_id,
          title: this.$t('ff557c54.29e3df'),
          label: this.$t('ff557c54.2432b5'),
          placeholder: this.$t('ff557c54.3cac63'),
          type: 'remarks',
          input: row.remarks
        }
      } else {
        this.remarksForm = {
          user_id: row.user_id,
          title: this.$t('ff557c54.559382'),
          label: this.$t('ff557c54.819767'),
          placeholder: this.$t('ff557c54.08b1fa'),
          type: 'name',
          input: row.name
        }
      }
    },
    getRowKeys(row) {
      return `${row.user_id}${row.shop_id}`
    },
    handleCancelLabelsDialog() {
      this.editMobileDialog = false
      this.isEditRemarks = false
      this.dialogIsShow = false
    },
    handleSalesmanChange(row) {
      this.salesperson_id = row.salesperson_id
    },
    handleSelectionChange(rows) {
      this.user_id = []
      if (rows) {
        rows.forEach((row) => {
          if (row) {
            this.user_id.push(row.user_id)
          }
        })
      }
    },
    handleCurrentChange(pageIndex) {
      this.page.pageIndex = pageIndex
    },
    // 调整每页显示条数
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
    },

    getParams() {
      if (this.currentShop) {
        this.params.shop_id = this.currentShop
      } else {
        this.params.shop_id = ''
      }

      if (this.currentDistributor) {
        this.params.distributor_id = this.currentDistributor
      } else {
        this.params.distributor_id = ''
      }
    },
    onReset() {
      this.created = ''
      this.birthday = ''
      this.selectedCrowdTags = []
      this.params = {
        vip_grade: '',
        tag_id: '',
        mobile: '',
        have_consume: '',
        role: '',
        reg_distributor: '',
        store_name: '',
        employee_number: '',
        birthday_start: '',
        birthday_end: '',
        reg_salesperson: ''
      }
      this.$refs.finder.refresh(true)
    },
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    async getMembers() {
      let params = {
        page: 1,
        pageSize: this.pageSize
      }
      const { datapass_block } = await this.$api.member.getMembers(params)
      this.datapass_block = datapass_block
    },
    beforeSearch(params) {
      // 更新 pageSize，使用用户选择的分页大小
      if (params.pageSize) {
        this.pageSize = params.pageSize
      }
      const finderParams = {
        page: params.page,
        pageSize: params.pageSize || this.pageSize,
        ...this.params,
        tag_id: this.params.tag_id.length > 0 ? this.params.tag_id.join(',') : ''
      }
      // // 处理日期范围
      // if (this.created && this.created.length === 2) {
      //   finderParams.time_start_begin = this.dateStrToTimeStamp(this.created[0] + ' 00:00:00')
      //   finderParams.time_start_end = this.dateStrToTimeStamp(this.created[1] + ' 23:59:59')
      // }
      // if (this.birthday && this.birthday.length === 2) {
      //   finderParams.birthday_start = this.dateStrToTimeStamp(this.birthday[0] + ' 00:00:00')
      //   finderParams.birthday_end = this.dateStrToTimeStamp(this.birthday[1] + ' 23:59:59')
      // }
      return finderParams
    },
    async getGradeList() {
      const gradeList = await this.$api.membercard.getGradeList()
      const vipGradeList = await this.$api.cardticket.listVipGrade()
      const _levelData = []
      gradeList.forEach(({ grade_id, grade_name }) => {
        _levelData.push({
          grade_id,
          grade_name
        })
      })
      if (!this.VERSION_SHUYUN()) {
        vipGradeList.forEach(({ vip_grade_id, grade_name, lv_type }) => {
          _levelData.push({
            grade_id: lv_type,
            grade_name
            // lv_type
          })
        })
      }

      this.gradeList = gradeList
      this.vipGrade = vipGradeList
      this.levelData = _levelData
    },
    async getShopsList() {
      const { list } = await this.$api.shop.getWxShopsList({
        page: 1,
        pageSize: 500,
        is_disabled: false
      })
      this.wxShopsList = list
    },
    showGrade(grade_id, vip_grade) {
      if (vip_grade) {
        const filterList = this.levelData.find((item) => item.grade_id == vip_grade)
        return filterList && filterList.grade_name
      } else {
        const filterList = this.levelData.find((item) => item.grade_id == grade_id)
        return filterList && filterList.grade_name
      }
    },
    getDetail(userid) {
      let isShopadmin = false
      try {
        isShopadmin = /\/shopadmin/.test(document.location.pathname)
      } catch (e) {}
      this.$router.push({
        path: `${this.$route.path}/detail`,
        query: {
          user_id: userid,
          mobile: this.params.mobile,
          orderRecords: this.params.have_consume,
          grade_id: this.params.grade_id
        }
      })
    },
    getCoupons() {
      this.staffCoupons.loading = true
      getEffectiveCardList({
        page_no: this.staffCoupons.page.currentPage,
        page_size: this.staffCoupons.page.pageSize,
        card_type: this.card_type
      }).then((res) => {
        var data = res.data.data.list
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < this.staffCoupons.temp.length; j++) {
            if (data[i].card_id === this.staffCoupons.temp[j].card_id) {
              data[i].checked = true
            }
          }
        }
        this.staffCoupons.list = data
        this.staffCoupons.page.total = res.data.data.total_count
        this.staffCoupons.loading = false
      }) //addCouponsItems
    },
    salesmanSearch() {
      this.loadingSalesman = true
      getSalesmanList({
        salesman_name: this.salesmanPaging.name,
        mobile: this.salesmanPaging.mobile,
        page: this.salesmanPaging.page,
        pageSize: this.salesmanPaging.pageSize
      }).then((res) => {
        this.salesman = res.data.data.list
        this.salesperson_id = ''
        this.salesmanPaging.total_count = res.data.data.total_count
        this.loadingSalesman = false
      })
    },
    handleVipGradeDelay(isSubmit = false) {
      if (isSubmit) {
        if (this.vipGradeDelay.add_day <= 0) {
          this.$message({
            type: 'error',
            message: this.$t('ff557c54.1220ce')
          })
          return
        }
        if (this.vipGradeDelay.filter == 'users') {
          this.params.user_id = this.user_id
        }
        this.params.vip_grade_form = JSON.stringify(this.vipGradeDelay)
        this.batchAction(this.$t('ff557c54.a423a5'))
      } else {
        this.params.action_type = 'vip_delay'
        this.dialogTitle = this.$t('ff557c54.54dfae')
        if (this.vipGrade.length <= 0) {
          this.$message({
            type: 'error',
            message: this.$t('ff557c54.f4dcc8')
          })
          return
        }
        this.dialogIsShow = true
        this.vipGradeDelay.vip_grade_id = this.vipGrade[0].vip_grade_id
      }
    },
    checkNum() {
      if (this.sms_content.length > 67) {
        this.$alert(this.$t('ff557c54.878c9e'), '', {
          confirmButtonText: this.$t('ff557c54.38cf16')
        })
      }
    },
    onSmsSends() {
      if (!this.sms_content) {
        this.$message({
          type: 'error',
          message: this.$t('ff557c54.27a383')
        })
        return
      }
      this.params.sms_content = this.sms_content

      if (this.user_id.length > 0) {
        this.$confirm(this.$t('ff557c54.5d25ed'), this.$t('ff557c54.02d981'), {
          confirmButtonText: this.$t('ff557c54.38cf16'),
          cancelButtonText: this.$t('ff557c54.625fb2'),
          type: 'warning'
        })
          .then(() => {
            this.params.action_type = 'send_sms'
            this.batchAction(this.$t('ff557c54.5d25ed'))
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$t('ff557c54.a8344d')
            })
          })
      } else {
        this.params.action_type = 'send_sms'
        this.batchAction(this.$t('ff557c54.ae5d50'))
      }
    },
    clearParams() {
      this.params.user_id = undefined
      this.params.grade_form = undefined
      this.params.action_type = undefined
    },
    batchAction(message) {
      console.log(this.params)
      if (this.user_id.length > 0) {
        this.params.user_id = this.user_id
        let params = JSON.parse(JSON.stringify(this.params))
        params.tag_id = params.tag_id.length > 0 ? params.tag_id.join(',') : ''
        console.log(this.params)
        batchOperating(params).then((res) => {
          if (res.data.data.status) {
            this.dialogIsShow = false
            this.$message({
              type: 'success',
              message: res.data.data.msg
            })
            this.clearParams()
            this.getGradeList()
            this.$refs.finder.refresh()
          }
        })
      } else {
        this.$confirm(message, this.$t('ff557c54.02d981'), {
          confirmButtonText: this.$t('ff557c54.38cf16'),
          cancelButtonText: this.$t('ff557c54.625fb2'),
          type: 'warning'
        })
          .then(() => {
            let params = JSON.parse(JSON.stringify(this.params))
            params.tag_id = params.tag_id.length > 0 ? params.tag_id.join(',') : ''
            batchOperating(params).then((res) => {
              if (res.data.data.status) {
                this.dialogIsShow = false
                this.$message({
                  type: 'success',
                  message: res.data.data.msg
                })
                this.getGradeList()
                this.$refs.finder.refresh()
              }
              this.params.tag_ids = []
              this.params.couponsids = []
              this.params.user_id = []
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$t('ff557c54.2111cc')
            })
            this.params.tag_ids = []
            this.params.couponsids = []
            this.params.user_id = []
          })
      }
    },

    editMobile(row) {
      this.editMobileDialog = true
      this.form.oldMobile = row.mobile
      this.form.user_id = row.user_id
      this.form.username = row.username
      this.form.newMobile = ''
      this.getOperateLog(row.user_id)
    },
    onEditMobileSubmit() {
      if (!this.form.newMobile) {
        this.$message({
          type: 'error',
          message: this.$t('ff557c54.395447')
        })
        return
      }
      this.$confirm(this.$t('ff557c54.fb25bd'), this.$t('ff557c54.02d981'), {
        cancelButtonText: this.$t('ff557c54.625fb2'),
        confirmButtonText: this.$t('ff557c54.38cf16'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            updateMemberMobile(this.form).then((res) => {
              this.$message({
                type: 'success',
                message: this.$t('ff557c54.57ee28')
              })
              this.$refs.finder.refresh()
              this.editMobileDialog = false
            })
          }
          done()
        }
      })
    },
    getOperateLog(userId) {
      var params = {
        user_id: userId
      }
      getMemberOperateLog(params).then((res) => {
        this.operateLog = res.data.data.list
      })
    },
    storeHandle(param) {
      param && param.shop_id
      this.currentDistributor = param.shop_id
      this.currentShop = ''
      this.$refs.finder.refresh(true)
    },
    shopHandle(val) {
      this.performInit = true
      this.currentStore = ''
      this.currentShop = val
      this.$refs.finder.refresh(true)
    },
    exportData() {
      memberExport(this.params).then((response) => {
        if (response.data.data.status) {
          this.$message({
            type: 'success',
            message: this.$t('ff557c54.3e1ddd')
          })
          this.$export_open('member')
          return
        } else if (response.data.data.url) {
          this.downloadUrl = response.data.data.url
          this.downloadName = response.data.filename
          this.downloadView = true
        } else {
          this.$message({
            type: 'error',
            message: this.$t('ff557c54.89ae53')
          })
          return
        }
      })
    },
    dateChange(val) {
      if (val && val.length > 0) {
        this.params.time_start_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.time_start_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.params.time_start_begin = ''
        this.params.time_start_end = ''
      }
    },
    birthdayChange(val) {
      if (val && val.length > 0) {
        this.params.birthday_start = val[0]
        this.params.birthday_end = val[1]
      } else {
        this.params.birthday_start = ''
        this.params.birthday_end = ''
      }
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    panelCollapse(name) {
      this.panel[name] = !this.panel[name]
    },
    acitonDisabled(index, row) {
      if (row.is_disabled === true) {
        var msg = this.$t('ff557c54.556277')
        this.$confirm(msg, this.$t('ff557c54.02d981'), {
          confirmButtonText: this.$t('ff557c54.38cf16'),
          cancelButtonText: this.$t('ff557c54.625fb2'),
          type: 'warning'
        }).then(() => {
          let params = {
            user_id: row.user_id,
            disabled: row.disabled == 1 ? 0 : 1
          }
          updateMemberInfo(params).then((res) => {
            this.$refs.finder.refresh()
          })
        })
      } else {
        let params = {
          user_id: row.user_id,
          disabled: row.disabled == 1 ? 0 : 1
        }
        updateMemberInfo(params).then((res) => {
          this.$refs.finder.refresh()
        })
      }
    },
    switchChief(index, row) {
      console.log(row.is_chief)
      if (row.is_chief == 1) {
        var msg = this.$t('ff557c54.5cb062')
        this.$confirm(msg, this.$t('ff557c54.02d981'), {
          confirmButtonText: this.$t('ff557c54.38cf16'),
          cancelButtonText: this.$t('ff557c54.625fb2'),
          type: 'warning'
        }).then(() => {
          let params = {
            user_id: row.user_id,
            distributor_ids: [this.$store.getters.shopId]
          }
          setCheif(params).then((res) => {
            this.$refs.finder.refresh()
          })
        })
      } else {
        this.$message({ type: 'error', message: this.$t('ff557c54.3666db') })
        this.$refs.finder.refresh()
        // let params = {
        //   'user_id': row.user_id,
        //   'distributor_ids': [this.$store.getters.shopId]
        // }
        // setCheif(params).then((res) => {
        //   this.getMembers()
        // })
      }
    },

    async relTagDelEvent(tagId, userId) {
      await this.$api.member.usersRelTagsDel({
        tag_id: tagId,
        user_id: userId
      })
      this.$message({ type: 'success', message: this.$t('ff557c54.69be67') })
      this.$refs.finder.refresh()
    },
    changeStaffCouponsPage(currentPage) {
      this.staffCoupons.page.currentPage = currentPage
      this.getCoupons()
    },
    selectStaffItems(item) {
      if (item.checked) {
        for (var i = 0; i < this.staffCoupons.temp.length; i++) {
          if (this.staffCoupons.temp[i].card_id === item.card_id) {
            this.staffCoupons.temp.splice(i, 1)
          }
        }
        for (var i = 0; i < this.staffCoupons.list.length; i++) {
          if (this.staffCoupons.list[i].card_id === item.card_id) {
            this.staffCoupons.list[i].checked = false
          }
        }
      } else {
        for (var i = 0; i < this.staffCoupons.list.length; i++) {
          if (this.staffCoupons.list[i].card_id === item.card_id) {
            this.staffCoupons.list[i].checked = true
          }
        }
        this.staffCoupons.temp.push(item)
      }
    },
    editSuperior(row) {
      this.editSuperiorVisible = true
      this.row = row
      this.identifierModal = ''
      this.numberSearchModal()
    },
    submitSuperiorAction() {
      this.editPopularizeRemoveFun()
      this.editSuperiorVisible = false
    },
    handleCancelSuperior() {
      this.editSuperiorVisible = false
    },

    numberSearchModal(e) {
      this.paramsModal.page = 1
      this.paramsModal.mobile = this.identifierModal
      this.getPopularizeListModalFun(this.paramsModal)
    },
    async getPopularizeListModalFun(filter) {
      this.modalLoading = true
      try {
        const { list, total_count } = await this.$api.promotions.getPopularizeList(filter)
        this.modalList = list
        this.modal_total_count = Number(total_count)
        this.modalLoading = false
      } catch (error) {
        console.error(error)
      }
    },
    handleCurrentChangeUpLV(val) {
      console.log('handleCurrentChangeUpChange')
      if (val && val.user_id) {
        this.currentRow = val.user_id
      }
    },
    async editPopularizeRemoveFun() {
      try {
        await this.$api.promotions.editPopularizeRemove({
          user_id: this.row.user_id,
          new_user_id: this.currentRow
        })
        this.$message({
          message: this.$t('ff557c54.2b8558'),
          type: 'success',
          duration: 5 * 1000
        })
        this.$refs.finder.refresh()
        this.loading = false
      } catch (error) {
        console.error(error)
      }
    },
    handleModalPage(page_num) {
      this.paramsModal.page = page_num
      this.getPopularizeListModalFun(this.paramsModal)
    },

    async batchActionDialog(actiontype) {
      this.params.action_type = actiontype

      if (actiontype == 'send_sms' && this.aliyunsms_status) {
        // 展示阿里短信的
        this.switchAliyunsmsDialog(true)
        console.log(this.user_id)
        return
      }

      if (actiontype == 'change_shop') {
        const { data } = await this.$picker.shop({
          multiple: false, // 单选
          queryParams: {
            is_valid: true
          }
        })
        this.changeStoreId = data[0].distributor_id
        try {
          await this.$api.member.setRegDistributor({
            user_id: this.user_id,
            distributor_id: data[0].distributor_id
          })
          this.$message({
            type: 'success',
            message: this.$t('ff557c54.9c4b8a')
          })
          this.$refs.finder.refresh()
          return
        } catch (error) {
          console.error(error)
          return
        }
      }

      this.dialogIsShow = true
      if (actiontype == 'send_sms') {
        this.sms_content = ''
        this.dialogTitle = this.$t('ff557c54.43e10b')
      } else if (actiontype == 'vip_delay') {
        this.dialogTitle = this.$t('ff557c54.54dfae')
      } else if (actiontype == 'set_grade') {
        this.gradeForm.user_id = ''
        this.gradeForm.grade_id = ''
        this.gradeForm.old_grade_id = ''
        this.gradeForm.remarks = ''
        this.is_batch = true
        this.dialogTitle = this.$t('ff557c54.306c74')
      } else if (actiontype == 'set_saleman') {
        this.dialogTitle = this.$t('ff557c54.0c4f72')
      }
    },

    /* ali短信 相关 */
    switchAliyunsmsDialog(val = false) {
      this.aliyunsmsDialogVisible = val
    },
    handleTagConfirm(tags) {
      // 处理标签确认
      this.params.action_type = 'rel_tag'
      this.params.tag_ids = []
      this.params.user_id = []

      // 将选中的标签转换为 tag_ids 数组
      tags.forEach((tag) => {
        this.params.tag_ids.push(tag.tag_id)
      })

      if (this.params.tag_ids.length <= 0) {
        this.$message({
          type: 'error',
          message: this.$t('ff557c54.19cf67')
        })
        return
      }

      // 调用批量操作
      this.batchAction('是否给全部会员打标签?')
    },
    handleCrowdTagConfirm(tags) {
      console.log(tags)
      if (!tags || tags.length == 0) {
        this.$message({
          type: 'error',
          message: this.$t('ff557c54.ce7cf5')
        })
        return
      }
      this.selectedCrowdTags = tags
      // 将选中的标签ID存储到 params 中用于筛选
      this.params.tag_id = tags.map((tag) => tag.tag_id)
    },
    handleCrowdTagRemove(tagId) {
      const index = this.selectedCrowdTags.findIndex((tag) => tag.tag_id == tagId)
      if (index > -1) {
        this.selectedCrowdTags.splice(index, 1)
      }
    },
    // 清除所有标签
    handleClearTag() {
      this.selectedCrowdTags = []
      this.params.tag_id = []
    },
    async onSelectCoupon() {
      const { data } = await this.$picker.coupon({
        multiple: true,
        data: this.selectedCoupons.map((item) => item.card_id)
      })
      if (data && data.length > 0) {
        this.selectedCoupons = data.map((item) => ({
          card_id: item.card_id,
          card_type: item.card_type,
          title: item.title
        }))
      }
      this.params.couponsids = this.selectedCoupons.map((item) => item.card_id)
      this.params.action_type = 'give_coupon'
      this.batchAction('是否给全部会员赠送优惠券?')
    }
  }
}
</script>
