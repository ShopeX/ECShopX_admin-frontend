<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpRouterView>
    <SpPage>
      <SpPlatformTip h5 app pc alipay />
      <SpPlatformTip
        class="damo-crm-tip"
        v-if="dmcrmSetting.is_open"
        :text-val="$t('9cc0c982.44de88')"
      />

      <div class="action-container" v-if="!dmcrmSetting.is_open">
        <el-button type="primary" @click="addCoupon"> {{ $t('9cc0c982.2ec71c') }} </el-button>
      </div>

      <el-tabs v-model="params.date_status" type="card" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.name"
          :name="item.activeName"
        >
          <el-table v-loading="loading" :data="tableList" border @filter-change="filterTag">
            <el-table-column width="240" :label="$t('9cc0c982.2b6bc0')" fixed="left">
              <template slot-scope="scope">
                <div class="flex items-center flex-wrap gap-2">
                  <el-button type="text" class="m-0 px-1">
                    <router-link
                      class="no-underline text-inherit"
                      :to="{
                        path: matchRoutePath('detail'),
                        query: {
                          chooseCardtype: scope.row.card_type,
                          cardId: scope.row.card_id,
                          title: scope.row.title
                        }
                      }"
                    >
                      {{ $t('9cc0c982.607e7a') }}
                    </router-link>
                  </el-button>
                  <el-button
                    v-if="
                      scope.row.edit_btn == 'Y' &&
                      (!isShopadmin
                        ? parseInt(scope.row.source_id) <= 0
                        : parseInt(scope.row.source_id) > 0) &&
                      !dmcrmSetting.is_open
                    "
                    type="text"
                    class="m-0 px-1"
                  >
                    <router-link
                      class="no-underline text-inherit"
                      :to="{
                        path: matchRoutePath('editor'),
                        query: { chooseCardtype: scope.row.card_type, cardId: scope.row.card_id }
                      }"
                    >
                      {{ $t('9cc0c982.95b351') }}
                    </router-link>
                  </el-button>
                  <!-- <el-popover v-if="appID" placement="top" width="200" trigger="click"> -->
                  <el-popover placement="top" width="200" trigger="click">
                    <div>
                      <img class="page-code" :src="appCodeUrl" />
                      <div class="page-btns">
                        <el-button
                          type="primary"
                          plain
                          size="mini"
                          @click="handleDownload(scope.row.title)"
                        >
                          {{ $t('9cc0c982.99e985') }}
                        </el-button>
                        <el-button v-clipboard:copy="curPageUrl" type="primary" plain size="mini">
                          {{ $t('9cc0c982.879058') }}
                        </el-button>
                      </div>
                    </div>
                    <el-button
                      slot="reference"
                      type="text"
                      class="m-0 px-1"
                      @click="handleShow(scope.row.card_id)"
                    >
                      {{ $t('9cc0c982.536ff1') }}
                    </el-button>
                  </el-popover>
                  <el-button
                    v-if="scope.row.status != 'CARD_STATUS_DISPATCH' && !dmcrmSetting.is_open"
                    type="text"
                    class="m-0 px-1"
                    @click="deleteCard(scope.row.card_id, scope.$index)"
                  >
                    {{ $t('9cc0c982.2f4aad') }}
                  </el-button>
                </div>
                <!-- <a v-if="!scope.row.ifpass" href="#" @click="sendoutShowAction(scope.row.card_id, scope.$index)">投放</a> -->
              </template>
            </el-table-column>
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <el-table-column
              prop="card_type"
              column-key="type"
              :label="$t('9cc0c982.f47182')"
              width="120"
              :filter-multiple="false"
              :filters="typeFilters"
              filter-placement="bottom-end"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="
                    scope.row.card_type === 'discount'
                      ? 'primary'
                      : scope.row.card_type === 'cash'
                      ? 'danger'
                      : 'warning'
                  "
                  size="mini"
                >
                  {{ scope.row.card_type | formatCardStr }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="title" :label="$t('9cc0c982.d90724')" />
            <el-table-column width="350" :label="$t('9cc0c982.d48a7a')">
              <template slot-scope="scope">
                <i class="el-icon-time" />
                <template v-if="scope.row.takeEffect">
                  {{ scope.row.takeEffect }}
                </template>
                <template v-else>
                  {{ scope.row.begin_time | datetime('YYYY-MM-DD HH:mm:ss') }}
                  <template v-if="scope.row.end_time"> ~ </template>
                  {{ scope.row.end_time | datetime('YYYY-MM-DD HH:mm:ss') }}
                  <!-- {{ Date.parse(new Date()) > scope.row.end_time * 1000 ? '已过期' : '' }} -->
                </template>
              </template>
            </el-table-column>
            <el-table-column width="120" :label="$t('9cc0c982.4b06cf')">
              <template slot-scope="scope">
                <span v-if="scope.row.quantity > scope.row.get_num">{{
                  scope.row.quantity - scope.row.get_num
                }}</span>
                <span v-else>0</span>
                <el-button
                  v-if="scope.row.edit_btn === 'Y'"
                  type="text"
                  @click="editCouponStore(scope.row.card_id)"
                >
                  <i class="el-icon-edit" />
                </el-button>
                <!-- <el-popover
                  v-if="scope.row.edit_btn === 'Y'"
                  :ref="`popover-${scope.row.card_id}`"
                  v-model="scope.row.storePop"
                  placement="bottom"
                  width="300"
                  trigger="hover"
                >
                  <div ref="store" class="store-pop" tabIndex="1">
                    <div class="store-content">
                      <el-radio-group
                        v-model="scope.row.operationType"
                        class="content-bottom-padded"
                      >
                        <el-radio label="increase"> {{ $t('9cc0c982.491411') }} </el-radio>
                        <el-radio label="reduce"> {{ $t('9cc0c982.cdf124') }} </el-radio>
                      </el-radio-group>
                      <el-row>
                        <el-col :span="22">
                          <el-input v-model="scope.row.storeValue" :placeholder="$t('9cc0c982.b97d6d')" />
                        </el-col>
                        <el-col :span="2" style="line-height: 36px" class="content-center">
                          {{ $t('9cc0c982.2a5da6') }}
                        </el-col>
                      </el-row>
                    </div>
                    <el-row :gutter="10">
                      <el-col :span="12">
                        <el-button
                          :loading="loadingbtn"
                          type="primary"
                          style="width: 100%"
                          @click="saveStore(scope.$index, scope.row.operationType)"
                        >
                          {{ $t('9cc0c982.38cf16') }}
                        </el-button>
                      </el-col>
                      <el-col :span="12">
                        <el-button style="width: 100%" @click="scope.row.storePop = false">
                          {{ $t('9cc0c982.625fb2') }}
                        </el-button>
                      </el-col>
                    </el-row>
                  </div>
                  <el-button slot="reference" type="text">
                    <i class="el-icon-edit" />
                  </el-button>
                </el-popover> -->
              </template>
            </el-table-column>
            <el-table-column width="80" prop="get_num" :label="$t('9cc0c982.5d5aac')">
              <template slot-scope="scope">
                <span>{{ scope.row.get_num || 0 }}</span>
              </template>
            </el-table-column>
            <el-table-column width="80" prop="use_num" :label="$t('9cc0c982.ce2ed8')">
              <template slot-scope="scope">
                <span>{{ scope.row.use_num || 0 }}</span>
              </template>
            </el-table-column>
            <el-table-column width="120" :label="$t('9cc0c982.fea789')">
              <template slot-scope="scope">
                {{
                  0 >= parseInt(scope.row.source_id, 10) ||
                  !(scope.row.source_name || scope.row.store_name || scope.row.shop_name)
                    ? $t('9cc0c982.498128')
                    : scope.row.source_name || scope.row.store_name || scope.row.shop_name
                }}
              </template>
            </el-table-column>
            <el-table-column width="120" :label="$t('9cc0c982.eb4307')">
              <template slot-scope="scope">
                {{ scope.row.use_all_shops == 1 ? $t('9cc0c982.77678b') : $t('9cc0c982.fcf7d8') }}
              </template>
            </el-table-column>
            <el-table-column width="200" prop="source_name" label="店铺" />
          </el-table>
          <div class="mt-4 text-right">
            <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              :total="page.total"
              :page-size="page.pageSize"
              @current-change="onCurrentChange"
              @size-change="onSizeChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>

      <el-dialog :title="$t('9cc0c982.9a494c')" :visible.sync="sendoutVisible">
        <div
          v-for="(item, index) in sedoutList"
          :key="index"
          class="sendout-item"
          :class="{ checked: currSendout === index }"
          @click="chooseSendout(index)"
        >
          <div>{{ item.name }}</div>
          <div class="icon-checked">
            <i class="el-icon-circle-check" />
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="sendoutVisible = false">
            {{ $t('9cc0c982.625fb2') }}
          </el-button>
          <el-button type="primary" @click.native="sendoutAction">
            {{ $t('9cc0c982.38cf16') }}
          </el-button>
        </div>
      </el-dialog>
    </SpPage>
    <SpDialog
      ref="editDialogRef"
      v-model="editDialog"
      width="500px"
      :title="$t('9cc0c982.42477d')"
      :form="editForm"
      :form-list="editFormList"
      @onSubmit="onEditSubmit"
    />
  </SpRouterView>
</template>

<script>
import store from '@/store'
import { getQRcode, removeCard, updateStore } from '@/api/cardticket'
import { getPageCode } from '@/api/marketing'
import mixin, { pageMixin } from '@/mixins'

export default {
  mixins: [mixin, pageMixin],
  provide() {
    return {
      refresh: this.fetchList
    }
  },
  data() {
    const initialParams = {
      date_status: '2',
      card_type: undefined,
      status: undefined,
      store_self: undefined
    }
    const typeFilters = [
      {
        text: this.$t('9cc0c982.9268f9'),
        value: 'discount'
      },
      {
        text: this.$t('9cc0c982.f23195'),
        value: 'cash'
      }
    ]
    if (this.VERSION_STANDARD()) {
      typeFilters.push({ text: this.$t('9cc0c982.8bc752'), value: 'new_gift' })
    }
    return {
      initialParams,
      params: {
        ...initialParams
      },
      loading: false,
      loadingbtn: false,
      sendoutVisible: false,
      currSendout: 1,
      checkedType: {},
      typeId: -1,
      sedoutList: [{ name: this.$t('9cc0c982.feea92'), id: 3 }],
      typeFilters,
      tabList: [
        { name: this.$t('9cc0c982.30ce10'), activeName: '2' },
        { name: this.$t('9cc0c982.438aa8'), activeName: '1' },
        { name: this.$t('9cc0c982.4d5ccd'), activeName: '3' }
      ],
      isShopadmin: /\/shopadmin/.test(document.location.pathname),
      appID: '',
      appCodeUrl: '',
      curPageUrl: '',
      editDialog: false,
      editForm: {
        card_id: '',
        type: 'increase',
        quantity: 1
      },
      editFormList: [
        {
          label: '',
          key: 'type',
          type: 'radio',
          options: [
            { label: 'increase', name: this.$t('9cc0c982.491411') },
            { label: 'reduce', name: this.$t('9cc0c982.cdf124') }
          ]
        },
        {
          label: this.$t('9cc0c982.0bf60b'),
          key: 'quantity',
          type: 'input',
          placeholder: this.$t('9cc0c982.fa7872'),
          validator: (rule, value, callback) => {
            const fd = this.tableList.find((item) => item.card_id == this.editForm.card_id)
            if (this.editForm.type == 'reduce') {
              if (this.editForm.quantity > fd.quantity - fd.get_num) {
                callback(new Error(this.$t('9cc0c982.6f3a33')))
              } else {
                callback()
              }
            } else {
              callback()
            }
          }
        }
      ],
      dmcrmSetting: {}
    }
  },
  mounted() {
    this.params.store_self = false
    if (this.VERSION_PLATFORM() && store.getters.login_type !== 'distributor') {
      this.params.store_self = true
    }
    this.fetchList()
    this.fetchWechatList()
    this.getDmcrmSetting()
  },
  methods: {
    async getDmcrmSetting() {
      const data = await this.$api.third.getDmcrmSetting()
      this.dmcrmSetting = data
    },
    async fetchWechatList() {
      const { list } = await this.$api.minimanage.gettemplateweapplist()
      console.log(list, 'src/view/member/cardticket/coupon.vue-第355行')
      list.forEach((item, i) => {
        if (item.key_name == 'yykweishop') {
          this.appID = item.authorizer.authorizer_appid
        }
      })
    },
    handleShow(card_id) {
      const page = 'subpages/marketing/coupon-center'
      this.curPageUrl = `${page}?card_id=${card_id}`
      let params = {
        wxaAppId: this.appID,
        page,
        card_id
      }
      getPageCode(params).then((response) => {
        this.appCodeUrl = response.data.data.base64Image
      })
    },
    handleDownload(name) {
      var a = document.createElement('a')
      var temp = name
      if (this.appCodeUrl) {
        a.href = this.appCodeUrl
        a.download = temp + '.png'
        a.click()
      }
    },
    editCouponStore(id) {
      this.editForm.card_id = id
      this.editDialog = true
    },
    async onEditSubmit() {
      await this.$api.cardticket.updateStore(this.editForm)
      this.editDialog = false
      this.fetchList()
    },
    getParams() {
      let params = {
        ...this.params
      }
      return params
    },
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
    async fetchList() {
      this.loading = true
      const { pageIndex: page_no, pageSize: page_size } = this.page
      let params = {
        page_no,
        page_size,
        ...this.getParams()
      }
      const { list, total_count } = await this.$api.cardticket.getCardList(params)
      this.tableList = list
      this.page.total = total_count
      this.loading = false
    },
    handleClick(tab, event) {
      this.onSearch()
    },
    addCoupon() {
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    sendoutShowAction(id) {
      this.sendoutVisible = true
      this.typeId = id
      this.currSendout = 0
    },
    sendoutAction() {
      if (this.currSendout == 0) {
        if (this.typeId) {
          getQRcode(this.typeId).then((res) => {
            var a = document.createElement('a')
            a.href = res.data.data.show_qrcode_url
            a.download = true
            a.click()
          })
        }
      }
      this.sendoutVisible = false
    },
    deleteCard(id, index) {
      this.$confirm(this.$t('9cc0c982.a00278'), this.$t('9cc0c982.02d981'), {
        cancelButtonText: this.$t('9cc0c982.625fb2'),
        confirmButtonText: this.$t('9cc0c982.38cf16'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            removeCard({ card_id: id })
              .then((res) => {
                this.$message({
                  message: this.$t('9cc0c982.0007d1'),
                  type: 'success'
                })
                this.fetchList()
              })
              .catch((error) => {
                console.error(error)
              })
          }
          done()
        }
      })
    },
    chooseSendout(index) {
      this.currSendout = index
    },
    pullWechatCard() {
      this.$confirm(this.$t('9cc0c982.991084'), this.$t('9cc0c982.02d981'), {
        confirmButtonText: this.$t('9cc0c982.38cf16'),
        cancelButtonText: this.$t('9cc0c982.625fb2'),
        type: 'warning'
      })
        .then(() => {
          pullWechatCard().then((response) => {
            this.$message({
              message: this.$t('9cc0c982.52b85c'),
              type: 'success',
              duration: 5 * 1000
            })
            this.fetchList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('9cc0c982.2111cc')
          })
        })
    },
    filterTag(value) {
      if (value.type) {
        this.params.card_type = value.type[0]
        this.fetchList()
      }
      if (value.status) {
        this.params.status = value.status
        this.fetchList()
      }
    },
    saveStore(index, operationType) {
      this.loadingbtn = true
      let reg = /^[1-9]\d*$/
      if (!reg.test(this.tableList[index].storeValue)) {
        this.$message({
          message: this.$t('9cc0c982.099729'),
          type: 'error'
        })
        return
      }
      if (operationType == 'reduce') {
        var quantity =
          Number(this.tableList[index].quantity) > this.tableList[index].get_num
            ? Number(this.tableList[index].quantity) - this.tableList[index].get_num
            : 0
        if (this.tableList[index].storeValue > quantity) {
          this.$message({
            message: this.$t('9cc0c982.6f3a33'),
            type: 'error'
          })
          return
        }
      }
      var param = {
        card_id: this.tableList[index].card_id,
        type: this.tableList[index].operationType,
        quantity: this.tableList[index].storeValue
      }
      updateStore(param).then((response) => {
        setTimeout(() => {
          this.loadingbtn = false
        }, 1000)
        this.fetchList()
      })
    }
  }
}
</script>
<style scoped lang="scss">
.el-icon-edit {
  cursor: pointer;
}
// 覆盖 Element UI 文本按钮的默认 margin-left，确保按钮间距正确
::v-deep .flex .el-button--text {
  margin-left: 0;
}
.coupon-list {
  margin-top: 10px;
}
.coupon-item {
  position: relative;
  height: 130px;
  padding: 25px 20px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #dadadd;
  border-radius: 5px;
  text-align: center;
  font-size: 14px;
  width: 19%;
  float: left;
  margin: 0.5%;
  &.coupon-add {
    padding-top: 20px;
    cursor: pointer;
    i {
      font-size: 40px;
    }
    :last-child {
      margin-top: 10px;
    }
  }
  .price {
    font-size: 24px;
  }
  .color-gray {
    color: #99a9bf;
  }
  .color-gray-deep {
    color: #8492a6;
  }
  .item-code {
    display: inline-block;
    width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  span.icon-triangle {
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border-top: 34px solid #20a0ff;
    border-left: 34px solid transparent;
    color: #fff;
  }
  label {
    position: absolute;
    top: -34px;
    right: 0;
    width: 20px;
    height: 20px;
    line-height: 20px;
  }
}
.item-bg {
  position: absolute;
  left: 0;
  bottom: -101%;
  width: 100%;
  height: 100%;
  background: rgba(241, 244, 246, 0.9);
  text-align: left;
  border-radius: 5px;
  padding-top: 8px;
  transition: all 0.4s ease;
  p {
    padding: 0 10px;
  }
  .item-operate {
    position: absolute;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    padding: 4px 0;
    text-align: center;
    cursor: pointer;
    a {
      color: #fff;
    }
  }
}
.coupon-item:hover {
  .item-bg {
    bottom: 0;
  }
}
.coupon-type-item {
  position: relative;
  padding: 30px 10px;
  border: 1px solid #ff5000;
  color: #ff5000;
  border-radius: 5px;
  text-align: center;
  margin-bottom: 20px;
  background: #fff;
  overflow: hidden;
  cursor: pointer;
  &:first-child {
    font-size: 18px;
  }
  .coupon-type-desc {
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: -100%;
    left: 0;
    padding: 10px 0;
    background: #ff5000;
    color: #fff;
    font-size: 18px;
    transition: all 0.4s ease;
    div:last-child {
      width: 70%;
      margin: 8px auto 0;
      font-size: 12px;
    }
  }
  &:hover {
    .coupon-type-desc {
      bottom: 0;
    }
  }
}

.coupon-type-item,
.sendout-item {
  overflow: hidden;
  .icon-checked {
    display: none;
    width: 100px;
    height: 25px;
    transform: rotate(35deg);
    position: absolute;
    font-size: 14;
    top: 5px;
    right: -25px;
    font-size: 20px;
    color: #fff;
    background: #ff5000;
    i {
      transform: rotate(-35deg);
    }
  }
  &.checked {
    .icon-checked {
      display: block;
    }
  }

  &:hover .icon-checked {
    background: #fff;
    i {
      color: #ff5000;
    }
  }
}
.store-pop {
  padding: 20px 15px;
  .store-content {
    margin-bottom: 15px;
  }
}
.page-code {
  width: 100%;
}
.page-btns {
  text-align: center;
}
.damo-crm-tip {
  background: #fef5ea !important;
}
</style>
<style>
.el-table__column-filter-trigger {
  line-height: initial;
}
</style>
