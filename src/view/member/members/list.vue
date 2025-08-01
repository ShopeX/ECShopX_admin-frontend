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
      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="mobile" label="手机号:">
          <el-input v-model="params.mobile" placeholder="请输入手机号" />
        </SpFilterFormItem>
        <SpFilterFormItem v-if="!VERSION_SHUYUN()" prop="username" label="微信昵称:">
          <el-input v-model="params.username" placeholder="请输入微信昵称" />
        </SpFilterFormItem>
        <SpFilterFormItem
          v-if="!VERSION_IN_PURCHASE()"
          prop="vip_grade"
          :label="!VERSION_SHUYUN() ? '会员身份:' : '付费会员等级:'"
        >
          <el-select v-model="params.vip_grade" clearable placeholder="请选择">
            <el-option
              v-for="item in vipGrade"
              :key="item.lv_type"
              :label="item.grade_name"
              :value="item.lv_type"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem v-if="!VERSION_IN_PURCHASE()" prop="grade_id" label="会员等级:">
          <el-select v-model="params.grade_id" clearable placeholder="请选择">
            <el-option
              v-for="item in levelData"
              :key="item.grade_id"
              :label="item.grade_name"
              :value="item.grade_id"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem v-if="!VERSION_IN_PURCHASE()" prop="inviter_mobile" label="推荐人:">
          <el-input v-model="params.inviter_mobile" placeholder="请输入推荐人手机号" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="tag_id" label="标签:">
          <el-select v-model="params.tag_id" clearable placeholder="请选择">
            <el-option
              v-for="item in tag.list"
              :key="item.tag_id"
              :label="item.tag_name"
              :value="item.tag_id"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="tag_id" label="注册日期:">
          <el-date-picker
            v-model="created"
            unlink-panels
            type="daterange"
            align="right"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            prefix-icon="null"
            :picker-options="pickerOptions"
            @change="dateChange"
          />
        </SpFilterFormItem>
        <!-- <SpFilterFormItem prop="wechat_nickname" label="微信昵称:">
          <el-input v-model="params.wechat_nickname" placeholder="请输入微信昵称" />
        </SpFilterFormItem> -->
        <SpFilterFormItem prop="remarks" label="备注:">
          <el-input v-model="params.remarks" placeholder="备注" />
        </SpFilterFormItem>
        <SpFilterFormItem v-if="!VERSION_IN_PURCHASE()" prop="have_consume" label="购买记录:">
          <el-select v-model="params.have_consume" placeholder="请选择" clearable>
            <el-option label="有记录" value="true" />
            <el-option label="无记录" value="false" />
          </el-select>
        </SpFilterFormItem>
        <!-- <SpFilterFormItem prop="salesman_mobile" label="导购手机:" v-if="$store.getters.login_type != 'distributor' && !isMicorMall">
          <shop-select
            distributors
            :performInit="performInit"
            @update="storeHandle"
            @init="init"
          ></shop-select>
        </SpFilterFormItem> -->
        <SpFilterFormItem prop="role" label="角色:">
          <el-select v-model="params.role" placeholder="请选择" clearable>
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" @click="batchActionDialog('rel_tag')"> 打标签 </el-button>
        <el-button
          v-if="!VERSION_IN_PURCHASE()"
          type="primary"
          @click="batchActionDialog('give_coupon')"
        >
          赠送优惠券
        </el-button>
        <el-button
          v-if="$store.getters.login_type != 'distributor'"
          type="primary"
          @click="batchActionDialog('send_sms')"
        >
          群发短信
        </el-button>
        <el-button
          v-if="$store.getters.login_type != 'distributor' && !VERSION_IN_PURCHASE()"
          type="primary"
          @click="handleVipGradeDelay(false)"
        >
          付费会员延期
        </el-button>
        <el-button
          v-if="
            $store.getters.login_type != 'distributor' &&
            !VERSION_IN_PURCHASE() &&
            !VERSION_SHUYUN()
          "
          type="primary"
          @click="batchActionDialog('set_grade')"
        >
          会员等级设置
        </el-button>
        <el-button type="primary" @click="exportData"> 导出 </el-button>
      </div>

      <el-table
        v-loading="loading"
        border
        :data="memberData"
        :row-key="getRowKeys"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" label="全选" />
        <el-table-column v-if="VERSION_SHUYUN()" prop="userid" label="平台账号" width="100" />
        <el-table-column prop="mobile" label="手机号" width="160">
          <template slot-scope="scope">
            {{ scope.row.mobile }}
            <el-tooltip
              v-if="$store.getters.login_type != 'distributor' &&
                datapass_block == 0 &&
                !VERSION_SHUYUN() && !dmcrmIsOpen"
              class="item"
              effect="dark"
              content="修改手机号"
              placement="top-start"
            >
              <el-button
                class="el-icon-edit"
                type="text"
                size="mini"
                @click="editMobile(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="昵称" width="140" />

        <el-table-column v-if="!VERSION_IN_PURCHASE()" prop="sex" label="性别" width="70">
          <template slot-scope="scope">
            <span v-if="scope.row.sex == '2'">女</span>
            <span v-else-if="scope.row.sex == '1'">男</span>
            <span v-else-if="scope.row.sex == '0'">未知</span>
            <span v-else>{{ scope.row.sex }}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="!VERSION_IN_PURCHASE()" prop="is_chief" label="是否团长" width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_chief"
              disabled
              active-value="1"
              inactive-value="0"
              active-color="#ff4949"
              inactive-color="#ccc"
              @change="switchChief(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="is_chief"
          label="是否团长"
          width="100"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.is_chief == '1'">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column> -->

        <el-table-column v-if="!VERSION_IN_PURCHASE()" prop="grade_id" label="会员等级" width="140">
          <template slot-scope="scope">
            <!-- <span v-if="scope.row.grade_id == '1'">女</span>
            <span v-else>{{ scope.row.grade_id }}</span> -->
            <span>{{ showGrade(scope.row.grade_id, scope.row.vip_grade) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="!VERSION_IN_PURCHASE()" prop="inviter" label="推荐人" width="130" />
        <el-table-column prop="disabled" label="禁用" width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.disabled"
              active-value="1"
              inactive-value="0"
              active-color="#ff4949"
              inactive-color="#ccc"
              @change="acitonDisabled(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="会员标签" width="130">
          <template slot-scope="scope">
            <template v-if="scope.row.tagList.length > 0">
              <el-tag
                v-for="tag in scope.row.tagList"
                :key="tag.tag_id"
                size="mini"
                closable
                effect="dark"
                :color="tag.tag_color"
                :style="'color:' + tag.font_color"
                @close="relTagDelEvent(tag.tag_id, scope.row.user_id)"
              >
                {{ tag.tag_name }}
              </el-tag>
            </template>
            <template v-else>
              <span class="muted">暂无会员标签</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column v-if="false" prop="user_card_code" label="会员卡编号" width="130" />

        <el-table-column v-if="false" prop="created" label="注册日期" width="120">
          <template slot-scope="scope">
            <el-tooltip placement="top">
              <div slot="content">
                注册时间<br>{{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}
              </div>
              <span>{{ scope.row.created | datetime }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="用户名" width="130">
          <template slot-scope="scope">
            <span v-if="scope.row.name">{{ scope.row.name }}</span>
            <span v-else class="muted">暂无用户名</span>
            <el-tooltip class="item" effect="dark" content="编辑用户名" placement="top-start">
              <el-button
                class="el-icon-edit"
                type="text"
                size="mini"
                @click="isEdit(scope.row, 'name')"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="130">
          <template slot-scope="scope">
            <span v-if="scope.row.remarks">{{ scope.row.remarks }}</span>
            <span v-else class="muted">暂无备注</span>
            <el-tooltip class="item" effect="dark" content="编辑备注" placement="top-start">
              <el-button
                class="el-icon-edit"
                type="text"
                size="mini"
                @click="isEdit(scope.row, 'remarks')"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button type="text" @click="getDetail(scope.row.user_id)"> 详情 </el-button>
            <el-button
              v-if="
                $store.getters.login_type != 'distributor' &&
                datapass_block == 0 &&
                !VERSION_SHUYUN()
              "
              type="text"
              @click="infoUpdate(scope.row)"
            >
              基础信息
            </el-button>
            <el-button
              v-if="
                $store.getters.login_type != 'distributor' &&
                !VERSION_IN_PURCHASE() &&
                !VERSION_SHUYUN()
              "
              type="text"
              @click="gradeUpdate(scope.row)"
            >
              会员等级
            </el-button>
            <el-button icon="edit" type="text" @click="editSuperior(scope.row)">
              调整上级
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="content-center content-top-padded c-pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :current-page.sync="page.pageIndex"
          :page-sizes="[10, 20, 50]"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>

      <el-dialog title="会员下载" :visible.sync="downloadView" :close-on-click-modal="false">
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
        <template v-if="params.action_type == 'give_coupon'">
          <el-radio-group v-model="card_type" @change="changeStaffCouponsPage(1)">
            <el-radio-button label="all" value="all"> 全部 </el-radio-button>
            <el-radio-button label="cash" value="cash"> 满减券 </el-radio-button>
            <el-radio-button label="discount" value="discount"> 折扣券 </el-radio-button>
            <el-radio-button v-if="VERSION_STANDARD()" label="new_gift" value="new_gift">
              兑换券
            </el-radio-button>
          </el-radio-group>
          <ul v-loading="staffCoupons.loading" class="dialog-list clearfix">
            <template v-for="(item, index) in staffCoupons.list">
              <li
                :key="index"
                :class="item.checked ? 'checked' : ''"
                @click="selectStaffItems(item)"
              >
                <i v-if="item.checked" class="el-icon-check" /> {{ item.title }}
              </li>
            </template>
          </ul>
          <div class="content-padded">
            <el-pagination
              background
              layout="prev, pager, next"
              style="white-space: initial"
              :current-page="staffCoupons.page.currentPage"
              :page-size="staffCoupons.page.pageSize"
              :total="staffCoupons.page.total"
              @current-change="changeStaffCouponsPage"
            />
          </div>
          <div style="display: none">
            <template v-for="(item, index) in staffCoupons.temp">
              <li :key="index">
                {{ item.title }}
              </li>
            </template>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitSelected">确定赠送</el-button>
          </span>
        </template>

        <template v-if="params.action_type == 'rel_tag'">
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
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogIsShow = false">取 消</el-button>
            <el-button type="primary" @click="submitMemberTag">确 定</el-button>
          </span>
        </template>

        <template v-if="params.action_type == 'send_sms'">
          <el-form>
            <el-form-item class="content-center">
              <el-input
                v-model="sms_content"
                focus
                type="textarea"
                :rows="4"
                placeholder="请输入短信内容"
                @blur="checkNum"
              />
              <span>{{ sms_content.length }}</span>
            </el-form-item>
            <el-form-item class="content-center">
              <el-button type="primary" @click="onSmsSends"> 确定发送 </el-button>
            </el-form-item>
          </el-form>
          <template>
            <el-alert
              title="短信基础"
              type="info"
              description="1、短信字符<=67个字符，按照70个字符一条短信计算；短信内容中，汉字、字母、符号、数字、空格全按一个字符算，不分半角、全角。含有标签（如短信签名、商品名、链接）的短信以实际发送时字符数计算；超过规定的67个字符的短信内容将会被拆分为两条或多条短信
                            2、短信内容禁止有‘测试，test，错乱字符’等，这类短信会被拦截不予发送。
                            3、短信接收不到原因：手机号黑名单发送不了；内容不正规不允发送；时间段导致延迟；被手机拦截软件拦截；该手机号短信接收上限；该手机号状态不正常（欠费，停机，空号，信号不正常）详询客服
                            4、 短信内容切记出现敏感类字眼，如出现有的话，系统是发送不出去被拦截掉的哦。
                            5、 短信内容当中不允许出现两个【】或 ⎣⎤ 括弧"
            />
            <el-alert
              title="营销短信（手动输入的短信）"
              type="info"
              description="营销短信发送时间为8：00~21:00，双十一双十二大促期间，短信发送时间可24小时。"
            />
            <el-alert
              title="短信限制注意事项"
              type="info"
              description="1、通知短信加营销短信同一号码月限制50条。2、相同内容，相同手机号，日限制2条，第3条会被拦截。"
            />
          </template>
        </template>

        <template v-if="params.action_type == 'vip_delay'">
          <el-form label-width="100px">
            <el-form-item class="content-center" label="付费会员类型">
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
            <el-form-item class="content-center" label="延期条件">
              <el-row>
                <el-col :span="8">
                  <el-select v-model="vipGradeDelay.filter" style="width: 100%">
                    <el-option key="users" label="指定会员 或 指定条件" value="users" />
                    <el-option key="expired" label="付费会员已失效" value="expired" />
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item class="content-center" label="延期天数">
              <el-row>
                <el-col :span="8">
                  <el-input v-model="vipGradeDelay.add_day" />
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item class="content-center">
              <el-button type="primary" @click="handleVipGradeDelay(true)"> 确定延期 </el-button>
            </el-form-item>
          </el-form>
        </template>

        <template v-if="params.action_type == 'set_grade'">
          <el-form label-width="100px">
            <el-form-item class="content-center" label="会员等级">
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
            <el-form-item class="content-center" label="备注">
              <el-row>
                <el-col :span="20">
                  <el-input v-model="gradeForm.remarks" focus type="textarea" :rows="3" />
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item class="content-center">
              <el-button type="primary" @click="gradeUpdateSubmit"> 确定修改 </el-button>
            </el-form-item>
          </el-form>
        </template>

        <template v-if="params.action_type == 'set_saleman'">
          <el-col :gutter="20">
            <el-input
              v-model="salesmanPaging.mobile"
              class="input-m"
              placeholder="导购手机号"
              clearable
            >
              <el-button slot="append" icon="el-icon-search" @click="salesmanSearch" />
            </el-input>
            <el-input
              v-model="salesmanPaging.name"
              class="input-m"
              placeholder="导购姓名"
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
            <el-table-column label="导购员" prop="salesman_name" />
            <el-table-column label="手机号" prop="mobile" />
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
            <el-button type="default" @click="dialogIsShow = false"> 取消 </el-button>
            <el-button type="primary" @click="setSalesman(true)"> 确定 </el-button>
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
                    placeholder="选择日期"
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
                      v-for="sex in sexoption"
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
                    placeholder="请选择爱好"
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
              <el-button type="primary" @click="infoUpdateSubmit"> 确定修改 </el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-dialog>

      <el-dialog
        title="修改会员手机号"
        class="right-dialog"
        :visible.sync="editMobileDialog"
        :before-close="handleCancelLabelsDialog"
      >
        <template>
          <el-form>
            <el-form-item label-width="100px" label="会员名称">
              {{ form.username }}
            </el-form-item>
            <el-form-item label-width="100px" label="原手机号">
              {{ form.oldMobile }}
            </el-form-item>
            <el-form-item label-width="100px" label="新手机号">
              <el-input v-model="form.newMobile" placeholder="手机号" />
            </el-form-item>
            <el-form-item class="content-center">
              <el-button type="primary" @click="onEditMobileSubmit"> 确定添加 </el-button>
            </el-form-item>
          </el-form>
        </template>
        <template>
          <el-table v-loading="loading" :data="operateLog" height="580" border>
            <el-table-column prop="old_data" label="原手机号" />
            <el-table-column prop="new_data" label="修改后手机号" />
            <el-table-column prop="operater" label="操作员" />
            <el-table-column prop="created" label="操作时间">
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
            <el-form-item class="content-center">
              <el-button type="primary" @click="editRemarks()"> 确定 </el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-dialog>

      <!-- 调整上下级弹框 -->
      <el-dialog
        title="调整上级"
        :visible.sync="editSuperiorVisible"
        :before-close="handleCancelSuperior"
      >
        <el-row :gutter="10">
          <el-col :md="8" :lg="10">
            <el-input v-model="identifierModal" placeholder="请输入手机号">
              <el-button slot="append" icon="el-icon-search" @click="numberSearchModal" />
            </el-input>
          </el-col>
        </el-row>

        <el-table
          v-loading="modalLoading"
          :data="modalList"
          style="width: 100%"
          :height="400"
          element-loading-text="数据加载中..."
          highlight-current-row
          @current-change="handleCurrentChangeUpLV"
        >
          <el-table-column type="index" width="50" />
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="mobile" label="手机号" />
          <!-- <el-table-column prop="promoter_grade_name" label="推广员等级" /> -->
          <el-table-column prop="disabled" label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.disabled == '0'" type="success" size="mini"> 有效 </el-tag>
              <el-tag v-else type="info" size="mini"> 无效 </el-tag>
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
          <el-button @click.native="handleCancelSuperior"> 取消 </el-button>
          <el-button type="primary" @click="submitSuperiorAction"> 确定 </el-button>
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
    </SpRouterView>
  </SpPage>
</template>

<script>
import exportTip from '@/components/export_tips'
import aliyunsmsDialog from '@/view/base/shortmessage/cpn/sms_MassLog_edit.vue'
import { mapGetters } from 'vuex'
import {
  getMembers,
  memberSmsSend,
  usersRelTagsDel,
  tagSearchUser,
  updateMemberMobile,
  getMemberOperateLog,
  memberExport,
  updateMemberInfo,
  setSindusersalespersonrel,
  updateMemberGrade,
  batchupdateMemberGrade,
  batchOperating,
  getMemberRegisterSetting,
  updateMemberBasicInfo,
  setCheif
} from '../../../api/member'
import { getaliSmsStatus } from '@/api/sms'

import {
  addPromoter,
  getPopularizeList,
  editPopularizeRemove,
  editPopularizeGrade,
  editPopularizeDisabled,
  getPromoterGradeConfig,
  updatePromoterShop
} from '../../../api/promotions'

import { getSalesmanList, setMemberSalesman, getDistributorEasyList } from '../../../api/marketing'
import { getEffectiveCardList } from '../../../api/cardticket'
import { giveCoupons } from '../../../api/promotions'
import { listVipGrade, batchReceiveMemberCard } from '../../../api/cardticket'
import shopSelect from '@/components/shopSelect'
import { forEach } from 'jszip'
import { ROLE_LIST } from '@/consts'

export default {
  components: {
    shopSelect,
    exportTip,
    aliyunsmsDialog
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
      memberData: [],
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
      tag: {
        dialog: false,
        editUser: [],
        list: [],
        form: {
          tag_ids: [],
          user_ids: []
        },
        currentTags: [],
        tags: []
      },
      editMobileDialog: false,
      form: {
        oldMobile: '',
        user_id: '',
        newMobile: ''
      },
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      params: {
        vip_grade: '',
        tag_id: '',
        mobile: '',
        have_consume: '',
        role: ''
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
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
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
        {
          value: '0',
          label: '未知'
        },
        {
          value: '1',
          label: '男'
        },
        {
          value: '2',
          label: '女'
        }
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
      dmcrmIsOpen:false
    }
  },
  computed: {
    ...mapGetters(['isMicorMall', 'login_type'])
  },
  mounted() {
    const { salesman_mobile, wechat_nickname, mobile, orderRecords, grade_id, currentPage } =
      this.$route.query

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
    if (currentPage) {
      this.page.pageIndex = Number(currentPage)
    }
    this.getMembers()
    this.getAllTagLists()
    this.getGradeList()
    // this.getVipList()
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
      this.dialogTitle = '修改指定会员等级'
      this.dialogIsShow = true
      this.gradeForm.user_id = row.user_id
      this.gradeForm.grade_id = row.grade_id
      this.gradeForm.old_grade_id = row.grade_id
      this.gradeForm.remarks = row.remarks
      this.is_batch = false
    },
    infoUpdate(value) {
      this.params.action_type = 'basic_info'
      this.dialogTitle = '修改会员基础信息'
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
        this.$message({ type: 'success', message: '修改成功' })
        this.getMembers()
        this.dialogIsShow = false
      })
    },
    gradeUpdateSubmit() {
      if (!this.gradeForm.grade_id) {
        this.$message({
          type: 'error',
          message: '没有指定等级'
        })
        return
      }
      if (this.is_batch === false) {
        updateMemberGrade(this.gradeForm).then((res) => {
          this.$message({ type: 'success', message: '修改成功' })
          this.getMembers()
          this.dialogIsShow = false
        })
      } else {
        this.params.grade_form = JSON.stringify(this.gradeForm)
        this.batchAction('是否给全部会员指定会员等级?')
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
        this.$message({ type: 'success', message: '更新成功' })
        this.isEditRemarks = false
        this.getMembers()
      })
    },
    isEdit(row, val) {
      this.isEditRemarks = true
      if (val == 'remarks') {
        this.remarksForm = {
          user_id: row.user_id,
          title: '修改会员备注',
          label: '备注',
          placeholder: '请输入备注',
          type: 'remarks',
          input: row.remarks
        }
      } else {
        this.remarksForm = {
          user_id: row.user_id,
          title: '修改会员用户名',
          label: '用户名',
          placeholder: '请输入用户名',
          type: 'name',
          input: row.name
        }
      }
    },
    getRowKeys(row) {
      return `${row.user_id}${row.shop_id}`
    },
    submitSelected() {
      this.staffCoupons.dialog = false
      this.staffCoupons.checked = this.staffCoupons.temp
      console.log(this.staffCoupons.checked)
      let cardIds = []
      for (var i = 0; i < this.staffCoupons.checked.length; i++) {
        cardIds.push(this.staffCoupons.checked[i].card_id)
      }
      this.staffCoupons.temp = []
      this.params.couponsids = cardIds
      console.log(this.params)
      this.params.action_type = 'give_coupon'
      this.batchAction('是否给全部会员赠送优惠券?')
    },
    handleCancelLabelsDialog() {
      this.tag.dialog = false
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
      this.getMembers()
    },
    // 调整每页显示条数
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.getMembers()
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
      this.params.time_start_begin = ''
      this.params.time_start_end = ''
      this.onSearch()
    },
    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.getMembers()
      })
    },
    async getMembers() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.params
      }
      const { list, total_count, datapass_block } = await this.$api.member.getMembers(params)
      this.memberData = list
      this.datapass_block = datapass_block
      this.page.total = total_count
      this.loading = false
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
    async getAllTagLists() {
      const params = {
        page: 1,
        page_size: 500
      }
      const { list } = await this.$api.member.getTagList(params)
      this.tag.list = list
    },
    // async getVipList () {
    //   const res = await this.$api.cardticket.listVipGrade()
    //   this.vipGrade = res
    // },
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
          grade_id: this.params.grade_id,
          currentPage: this.page.pageIndex
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
            message: '请输入正确的延期天数'
          })
          return
        }
        if (this.vipGradeDelay.filter == 'users') {
          this.params.user_id = this.user_id
        }
        this.params.vip_grade_form = JSON.stringify(this.vipGradeDelay)
        this.batchAction('是否给全部会员进行付费会员延期?')
      } else {
        this.params.action_type = 'vip_delay'
        this.dialogTitle = '付费会员延期'
        if (this.vipGrade.length <= 0) {
          this.$message({
            type: 'error',
            message: '无付费会员'
          })
          return
        }
        this.dialogIsShow = true
        this.vipGradeDelay.vip_grade_id = this.vipGrade[0].vip_grade_id
      }
    },
    checkNum() {
      if (this.sms_content.length > 67) {
        this.$alert('当前短信内容字数超出67，将会分成多条发送', '', {
          confirmButtonText: '确定'
        })
      }
    },
    onSmsSends() {
      if (!this.sms_content) {
        this.$message({
          type: 'error',
          message: '短信内容不能为空'
        })
        return
      }
      this.params.sms_content = this.sms_content

      if (this.user_id.length > 0) {
        this.$confirm('确定发送该条短信给会员?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.params.action_type = 'send_sms'
            this.batchAction('确定发送该条短信给会员?')
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消发送'
            })
          })
      } else {
        this.params.action_type = 'send_sms'
        this.batchAction('是否给全部会员发短信?')
      }
    },
    addMemberTag() {
      this.params.action_type = 'rel_tag'

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
    submitMemberTag() {
      this.params.tag_ids = []
      this.params.user_id = []
      this.tag.currentTags.forEach((item) => {
        this.params.tag_ids.push(item.tag_id)
      })
      if (this.params.tag_ids.length <= 0) {
        this.$message({
          type: 'error',
          message: '没有选中标签'
        })
        return
      }
      this.dialogIsShow = false
      this.batchAction('是否给全部会员打标签?')
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
            this.getMembers()
          }
        })
      } else {
        this.$confirm(message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let params = JSON.parse(JSON.stringify(this.params))
            batchOperating(params).then((res) => {
              if (res.data.data.status) {
                this.dialogIsShow = false
                this.$message({
                  type: 'success',
                  message: res.data.data.msg
                })
                this.getGradeList()
                this.getMembers()
              }
              this.params.tag_ids = []
              this.params.couponsids = []
              this.params.couponsids = []
              this.params.user_id = []
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
            this.params.tag_ids = []
            this.params.couponsids = []
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
          message: '请填写手机号码'
        })
        return
      }
      this.$confirm('确定要修改该会员手机号？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            updateMemberMobile(this.form).then((res) => {
              this.$message({
                type: 'success',
                message: '修改手机号成功'
              })
              this.getMembers()
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
      this.currentPage = 1
      this.getMembers()
    },

    init() {
      this.params.mobile = ''
      this.params.have_consume = ''
      this.params.vip_grade = ''
      this.params.grade_id = ''
      this.params.tag_id = ''
      this.params.inviter_mobile = ''
      this.created = ''
      this.params.remarks = ''
      this.params.username = ''
      this.params.salesman_mobile = ''
      this.currentShop = ''
      this.getMembers()
    },
    shopHandle(val) {
      this.performInit = true
      this.currentStore = ''
      this.currentShop = val
      this.currentPage = 1
      this.getMembers()
    },

    exportData() {
      this.currentPage = 1
      memberExport(this.params).then((response) => {
        if (response.data.data.status) {
          this.$message({
            type: 'success',
            message: '已加入执行队列，请在设置-导出列表中下载'
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
            message: '无内容可导出 或 执行失败，请检查重试'
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
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    panelCollapse(name) {
      this.panel[name] = !this.panel[name]
    },
    acitonDisabled(index, row) {
      if (row.is_disabled === true) {
        var msg = '此操作将会禁用该会员，是否继续?'
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            user_id: row.user_id,
            disabled: row.disabled
          }
          updateMemberInfo(params).then((res) => {
            this.getMembers()
          })
        })
      } else {
        let params = {
          user_id: row.user_id,
          disabled: row.disabled
        }
        updateMemberInfo(params).then((res) => {
          this.getMembers()
        })
      }
    },
    switchChief(index, row) {
      console.log(row.is_chief)
      if (row.is_chief == 1) {
        var msg = '此操作将设置为团长，是否继续?'
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            user_id: row.user_id,
            distributor_ids: [this.$store.getters.shopId]
          }
          setCheif(params).then((res) => {
            this.getMembers()
          })
        })
      } else {
        this.$message({ type: 'error', message: '取消团长，请联系管理员' })
        this.getMembers()
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
      this.$message({ type: 'success', message: '修改成功' })
      this.getMembers()
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
    getPopularizeListModalFun(filter) {
      this.modalLoading = true
      getPopularizeList(filter).then((res) => {
        this.modalList = res.data.data.list
        this.modal_total_count = Number(res.data.data.total_count)
        this.modalLoading = false
      })
    },
    handleCurrentChangeUpLV(val) {
      console.log('handleCurrentChangeUpChange')
      if (val && val.user_id) {
        this.currentRow = val.user_id
      }
    },
    editPopularizeRemoveFun() {
      editPopularizeRemove({ user_id: this.row.user_id, new_user_id: this.currentRow }).then(
        (res) => {
          this.message = '上下级'
          this.loading = false
          this.$message({
            message: '调整' + this.message + '成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.fetchList()
        }
      )
    },
    handleModalPage(page_num) {
      this.paramsModal.page = page_num
      this.getPopularizeListModalFun(this.paramsModal)
    },

    batchActionDialog(actiontype) {
      this.params.action_type = actiontype

      if (actiontype == 'send_sms' && this.aliyunsms_status) {
        // 展示阿里短信的
        this.switchAliyunsmsDialog(true)
        console.log(this.user_id)
        return
      }

      this.dialogIsShow = true
      if (actiontype == 'rel_tag') {
        this.dialogTitle = '为会员打标签'
        this.tag.currentTags = []
        this.tag.tags = [...this.tag.list]
        this.tag.tags.forEach((item, index) => {
          let isInArr = this.tag.currentTags.findIndex((n) => n.tag_id == item.tag_id)
          if (isInArr != -1) this.tag.tags.splice(index, 1)
        })
        this.tag.dialog = true
      } else if (actiontype == 'give_coupon') {
        this.getCoupons()
        this.dialogTitle = '赠送优惠券'
      } else if (actiontype == 'send_sms') {
        this.sms_content = ''
        this.dialogTitle = '群发短信'
      } else if (actiontype == 'vip_delay') {
        this.dialogTitle = '付费会员延期'
      } else if (actiontype == 'set_grade') {
        this.gradeForm.user_id = ''
        this.gradeForm.grade_id = ''
        this.gradeForm.old_grade_id = ''
        this.gradeForm.remarks = ''
        this.is_batch = true
        this.dialogTitle = '修改会员等级'
      } else if (actiontype == 'set_saleman') {
        this.dialogTitle = '设置导购员'
      }
    },

    /* ali短信 相关 */
    switchAliyunsmsDialog(val = false) {
      this.aliyunsmsDialogVisible = val
    }
  }
}
</script>
