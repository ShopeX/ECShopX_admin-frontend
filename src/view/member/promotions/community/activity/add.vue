<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section section-white">
    <el-form ref="form" :model="form" class="box-set" label-width="100px">
      <div class="section-header with-border">
        <div>{{ $t('3c26d461.6fd631') }}</div>
      </div>
      <div class="form-wrapper clearfix">
        <el-form-item :label="$t('3c26d461.350355')">
          <div class="frm-tips">{{ $t('3c26d461.6113fc') }}</div>
          <div>
            <div class="upload-box" @click="handleImgChange">
              <img v-if="form.banner_img" :src="wximageurl + form.banner_img" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </div>
          </div>
          <imgPicker
            :dialog-visible="imgDialog"
            :sc-status="isGetImage"
            @chooseImg="pickImg"
            @closeImgDialog="closeImgDialog"
          />
        </el-form-item>
        <el-form-item
          :label="$t('3c26d461.39834b')"
          prop="activity_name"
          :rules="{ required: true, message: $t('3c26d461.813065'), trigger: 'blur' }"
        >
          <el-col :span="20">
            <el-input
              v-model="form.activity_name"
              :maxlength="30"
              :placeholder="$t('3c26d461.39834b')"
            />
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('3c26d461.c799f5')">
          <el-col :span="20">
            <el-date-picker
              v-model="activity_date"
              type="datetimerange"
              :range-separator="$t('3c26d461.981cbe')"
              :start-placeholder="$t('3c26d461.fc92e9')"
              :end-placeholder="$t('3c26d461.1fa23f')"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
            />
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('3c26d461.b432c1')" prop="delivery_date">
          <el-col :span="20">
            <el-date-picker
              v-model="form.delivery_date"
              type="datetime"
              :placeholder="$t('3c26d461.a42ae4')"
            />
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('3c26d461.7add39')">
          <el-col :span="20">
            <el-input v-model="form.description" type="textarea" :rows="2" placeholder="" />
          </el-col>
        </el-form-item>
        <!--el-form-item label="活动库存" prop="total_num">
            <el-col :span="20">
              <el-input v-model="form.total_num" placeholder=""></el-input>
            </el-col>
          </el-form-item-->
        <el-form-item :label="$t('3c26d461.ed9ea7')">
          <el-col :span="20">
            <el-radio-group v-model="community" @change="communityChange">
              <el-radio label="1">{{ $t('3c26d461.56dc38') }}</el-radio>
              <el-radio label="2">{{ $t('3c26d461.d37573') }}</el-radio>
            </el-radio-group>
            <div v-if="community == 2" style="margin-left: 1.5%">
              <template>
                <el-table
                  ref="multipleTable"
                  :data="communityList"
                  tooltip-effect="dark"
                  style="width: 100%"
                  :row-key="getCommunityRowKeys"
                  @selection-change="handleCommunitySelectionChange"
                >
                  <el-table-column type="selection" :reserve-selection="true" width="55" />
                  <el-table-column :label="$t('3c26d461.d541f8')">
                    <template slot-scope="scope">
                      {{ scope.row.community_name }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="leader_name" :label="$t('3c26d461.07e57c')" />
                  <el-table-column
                    prop="leader_mobile"
                    :label="$t('3c26d461.6621f6')"
                    min-width="110"
                  />
                </el-table>
                <div
                  v-if="communitycount > communityParams.pageSize"
                  class="content-center content-top-padded"
                >
                  <el-pagination
                    layout="prev, pager, next"
                    :current-page.sync="communityParams.page"
                    :total="communitycount"
                    :page-size="communityParams.pageSize"
                    @current-change="handleCommunityChange"
                  />
                </div>
              </template>
            </div>
          </el-col>
        </el-form-item>
        <el-form-item v-if="form.status == 'processing'">
          <el-col :span="20">
            <el-alert :title="$t('3c26d461.f4bf66')" type="warning" />
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('3c26d461.3b9737')">
          <el-col :span="23">
            <el-button type="primary" class="el-icon-plus" @click="relItems">
              {{ $t('3c26d461.43d1e2') }}
            </el-button>
            <el-table v-if="form.items.length > 0" :data="form.items" style="line-height: normal">
              <el-table-column label="ID" prop="item_id" width="60" />
              <el-table-column :label="$t('3c26d461.d7ec2d')" prop="item_name" />
              <el-table-column :label="$t('3c26d461.08ee55')" width="100">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.activity_price" min="0.01" size="mini">
                    <i slot="prefix" class="el-input__icon">{{ cursymbol }}</i>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                v-if="vipGrade.length == 1"
                :label="$t('3c26d461.627908')"
                width="150"
              >
                <template slot-scope="scope">
                  <div v-if="vipGrade[0].lv_type == 'vip'">
                    <el-input v-model="scope.row.vip_price" class="member-price" size="mini">
                      <i slot="prefix" class="el-input__icon">vip:{{ cursymbol }}</i>
                    </el-input>
                  </div>
                  <div v-if="vipGrade[0].lv_type == 'svip'">
                    <el-input v-model="scope.row.svip_price" class="member-price" size="mini">
                      <i slot="prefix" class="el-input__icon">svip:{{ cursymbol }}</i>
                    </el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-if="vipGrade.length == 2"
                :label="$t('3c26d461.627908')"
                width="120"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.vip_price" class="member-price" size="mini">
                    <i slot="prefix" class="el-input__icon">vip:{{ cursymbol }}</i>
                  </el-input>
                  <el-input v-model="scope.row.svip_price" class="member-price" size="mini">
                    <i slot="prefix" class="el-input__icon">svip:{{ cursymbol }}</i>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                v-if="vipGrade.length == 0"
                :label="$t('3c26d461.627908')"
                width="150"
              >
                <template slot-scope="scope">{{ $t('3c26d461.5cbf39') }}</template>
              </el-table-column>
              <el-table-column :label="$t('3c26d461.0eac88')" width="90">
                <template slot-scope="scope">
                  {{ $t('3c26d461.a235e5') }}{{ scope.row.sales_store }}
                  <el-input v-model="scope.row.activity_store" size="mini" width="50" />
                </template>
              </el-table-column>
              <el-table-column :label="$t('3c26d461.343488')" width="80">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.limit_num" size="mini" />
                </template>
              </el-table-column>
              <el-table-column :label="$t('3c26d461.b6ac77')" width="80">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.initial_sales" size="mini" />
                </template>
              </el-table-column>
              <el-table-column :label="$t('3c26d461.9f68a8')" width="80">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.points" size="mini" />
                </template>
              </el-table-column>
              <el-table-column :label="$t('3c26d461.c360e9')" width="80">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.sort" size="mini" />
                </template>
              </el-table-column>
              <el-table-column :label="$t('3c26d461.2b6bc0')" width="50">
                <template slot-scope="scope">
                  <i class="el-icon-delete" @click="deleteItemRow(scope.$index, form.items)" />
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-form-item>
        <el-form-item label=" ">
          <el-button @click.native="handleCancel">{{ $t('3c26d461.5f4112') }}</el-button>
          <el-button type="primary" :loading="loading" @click="submitActivityAction">
            {{ $t('3c26d461.be5fbb') }}
          </el-button>
        </el-form-item>
      </div>
    </el-form>
    <GoodsSelect
      :items-visible="itemVisible"
      :get-status="setItemStatus"
      :rel-items-ids="relItemsIds"
      not-sku
      @chooseStore="chooseItemsAction"
      @closeStoreDialog="closeItemDialogAction"
    />
  </div>
</template>

<script>
import {
  getCommunityList,
  CommunityActivityCreate,
  CommunityActivityInfo,
  CommunityActivityUpdate
} from '../../../../../api/community'
import { listVipGrade } from '../../../../../api/cardticket'
import { getDefaultCurrency } from '../../../../../api/company'
import GoodsSelect from '@/components/goodsSelect'
import imgPicker from '@/components/imageselect'
export default {
  inject: ['refresh'],
  components: {
    GoodsSelect,
    imgPicker
  },
  data() {
    return {
      loading: false,
      cursymbol: '￥',
      goodsVisible: false,
      community: '1',
      communityList: [],
      is_add_similar: false,
      communitycount: 0,
      communityParams: {
        page: 1,
        pageSize: 10,
        status: 'open'
      },
      form: {
        activity_id: '',
        activity_name: '',
        description: '',
        activity_start_time: '',
        activity_end_time: '',
        community: [],
        coupon_id: '',
        total_num: '',
        num: '',
        items: [],
        delivery_date: '',
        banner_img: ''
      },
      activity_date: [],
      initCommunity: [],
      vipGrade: [],
      relItemsIds: [],
      itemVisible: false,
      setItemStatus: false,
      imgDialog: false,
      isGetImage: false
    }
  },
  mounted() {
    var params = { is_disabled: 'false' }
    listVipGrade(params).then((res) => {
      this.vipGrade = res.data.data
      if (this.$route.query.is_new == 'true') {
        this.is_add_similar = true
      }
      if (this.$route.params.activity_id) {
        this.getActivityDetail(this.$route.params.activity_id)
      }
      this.getCommunitysList()
    })
  },
  methods: {
    handleImgChange() {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg(data) {
      this.form.banner_img = data.url
      this.imgDialog = false
    },
    closeImgDialog() {
      this.imgDialog = false
    },
    relItems() {
      this.itemVisible = true
      this.setItemStatus = true
    },
    communityChange(val) {
      if (val == 1) {
        this.form.community = []
      }
    },
    handleCommunityChange(page_num) {
      this.communityParams.page = page_num
      this.getCommunitysList()
    },
    getCommunityRowKeys(row) {
      return row.community_id
    },
    getCommunitysList() {
      getCommunityList(this.communityParams).then((response) => {
        this.communityList = response.data.data.list
        if (this.initCommunity.length > 0) {
          this.communityList.forEach((row) => {
            var index = this.initCommunity.indexOf(row.community_id)
            if (index !== -1) {
              this.initCommunity.splice(index, 1)
              this.$refs.multipleTable.toggleRowSelection(row)
            }
          })
        }
        this.communitycount = response.data.data.total_count
      })
    },
    handleCommunitySelectionChange(val) {
      if (val.length > 0) {
        this.form.community = []
        val.forEach((row) => {
          this.form.community.push(row.community_id)
        })
      } else {
        this.form.community = []
      }
    },
    chooseItemsAction(data) {
      this.itemVisible = false
      this.relItemsIds = data
      if (data === null || data.length <= 0) return
      let arr = []
      data.forEach((item, index) => {
        let newData = ''
        let isInArr = this.form.items.findIndex((n) => n.item_id == item.itemId)
        if (isInArr == -1) {
          newData = {
            item_id: item.itemId,
            item_name: item.itemName,
            activity_store: item.store,
            activity_price: item.price / 100,
            sort: item.sort,
            vip_price: 0,
            svip_price: 0,
            points: 0,
            limit_num: 0,
            initial_sales: 10
          }
        } else {
          newData = this.form.items[index]
        }
        arr.push(newData)
      })
      this.form.items = arr
    },
    closeItemDialogAction() {
      this.itemVisible = false
    },
    deleteItemRow: function (index, rows) {
      rows.splice(index, 1)
      this.form.items = rows
      this.setItemStatus = false
      this.relItemsIds.splice(index, 1)
    },
    submitActivityAction() {
      const that = this
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 2000)
      if (this.activity_date.length > 0) {
        this.form.activity_start_time = this.activity_date[0]
        this.form.activity_end_time = this.activity_date[1]
      }
      let params = JSON.stringify(this.form)
      params = JSON.parse(params)
      params.items = JSON.stringify(params.items)
      if (this.form.activity_id && !this.is_add_similar) {
        CommunityActivityUpdate(this.form.activity_id, params).then((res) => {
          if (res.data.data.activity_id) {
            this.loading = false
            this.$message({
              message: this.$t('3c26d461.55aa63'),
              type: 'success',
              duration: 2 * 1000,
              onClose() {
                that.refresh()
                that.$router.go(-1)
              }
            })
          } else {
            this.$message.error(this.$t('3c26d461.73b0d9'))
            return false
          }
        })
      } else {
        params.status = 'waiting'
        CommunityActivityCreate(params).then((res) => {
          if (res.data.data.activity_id) {
            this.loading = false
            this.$message({
              message: this.$t('3c26d461.3fdaea'),
              type: 'success',
              duration: 2 * 1000,
              onClose() {
                that.refresh()
                that.$router.go(-1)
              }
            })
          } else {
            this.$message.error(this.$t('3c26d461.73b0d9'))
            return false
          }
        })
      }
    },
    getTaskTime(strDate) {
      let date = new Date(strDate)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let str = y + '-' + m + '-' + d
      return str
    },
    getActivityDetail(id) {
      CommunityActivityInfo(id).then((res) => {
        let response = res.data.data
        let data = {
          activity_id: response.activity_id,
          activity_name: response.activity_name,
          description: response.description,
          activity_start_time: response.activity_start_time,
          activity_end_time: response.activity_end_time,
          community: response.community,
          coupon_id: '',
          total_num: response.total_num,
          status: response.status,
          num: response.num,
          items: response.items,
          delivery_date: response.delivery_date,
          banner_img: response.banner_img
        }
        this.form = data
        this.initCommunity = data.community
        if (data.community == 'all') {
          this.community = '1'
        } else {
          this.community = '2'
        }
        if (!this.is_add_similar) {
          this.activity_date = [response.activity_start_date, response.activity_end_date]
        }
        this.relItemsIds = response.itemLists
      })
    },
    handleCancel: function () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss">
.member-price.el-input--prefix .el-input__inner {
  padding-left: 45px;
}
</style>
