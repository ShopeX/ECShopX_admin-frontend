<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-form ref="form" :model="form" class="box-set" label-width="100px">
    <el-card :header="$t('cfc108c7.6fd631')" shadow="never">
      <el-form-item :label="$t('cfc108c7.350355')">
        <div class="frm-tips">
          {{ $t('cfc108c7.270fe3') }}
        </div>
        <div>
          <imgBox :img-url="wximageurl + form.pics" @click="handleImgChange" />
        </div>
      </el-form-item>
      <el-form-item :label="$t('cfc108c7.f95101')">
        <el-row :gutter="20">
          <el-col :span="20">
            <p class="frm-tips" />
            <div class="logo-box" @click="changeItem">
              <div class="bran-img">
                <div v-if="goods.pics" class="groups-addgoods">
                  <img :src="wximageurl + goods.pics[0]" class="groups-goodspic" />
                  <div class="gooups-goodsmsg">
                    <div>{{ goods.itemName }}</div>
                    <div>{{ $t('cfc108c7.80193b') }}{{ goods.price }}</div>
                    <div v-if="goods.item_type == 'normal'">
                      {{ $t('cfc108c7.b008bd') }}{{ goods.store }}
                    </div>
                  </div>
                </div>
                <div v-else tabindex="0" class="el-upload el-upload--picture-card">
                  <i class="el-icon-plus" />
                </div>
              </div>
              <!-- <el-button size="small" type="primary" @click="changeItem">选择商品</el-button> -->
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('cfc108c7.39834b')" prop="act_name" :rules="rules.act_name">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input
              v-model="form.act_name"
              :maxlength="30"
              :placeholder="$t('cfc108c7.68b3e2')"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('cfc108c7.c799f5')" prop="date" :rules="rules.date">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-date-picker
              v-model="form.date"
              type="datetimerange"
              :range-separator="$t('cfc108c7.981cbe')"
              :start-placeholder="$t('cfc108c7.fc92e9')"
              :end-placeholder="$t('cfc108c7.1fa23f')"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('cfc108c7.b96ff6')" prop="store" :rules="rules.store">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input v-model="form.store" placeholder="" />
          </el-col>
          <el-col :span="2"> {{ $t('cfc108c7.f7edf5') }} </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('cfc108c7.8c918e')" prop="act_price" :rules="rules.act_price">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input v-model="form.act_price" placeholder="">
              {{ $t('cfc108c7.c16655') }}
            </el-input>
          </el-col>
          <el-col :span="2"> {{ $t('cfc108c7.c16655') }} </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('cfc108c7.25c463')" prop="person_num" :rules="rules.person_num">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input v-model="form.person_num" placeholder="">
              {{ $t('cfc108c7.465afe') }}
            </el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('cfc108c7.2c7235')" prop="limit_time" :rules="rules.limit_time">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input v-model="form.limit_time" :placeholder="$t('cfc108c7.2de0d4')" />
          </el-col>
          <el-col :span="2"> {{ $t('cfc108c7.2de0d4') }} </el-col>
        </el-row>
      </el-form-item>
      <el-form-item
        :label="$t('cfc108c7.9bd6cd')"
        prop="limit_buy_num"
        :rules="rules.limit_buy_num"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input v-model="form.limit_buy_num" placeholder="" />
            <p class="frm-tips">{{ $t('cfc108c7.ba09a0') }}</p>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('cfc108c7.93a064')">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-switch v-model="form.robot" active-value="1" inactive-value="0" />
            <p class="frm-tips">
              {{ $t('cfc108c7.c29269') }}
            </p>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('cfc108c7.e1e717')">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-switch v-model="form.rig_up" active-value="1" inactive-value="0" />
            <p class="frm-tips">
              {{ $t('cfc108c7.bf4a11') }}
            </p>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item v-if="goods.item_type == 'normal'" :label="$t('cfc108c7.56f046')">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-switch v-model="form.free_post" active-value="1" inactive-value="0" />
            <p class="frm-tips">{{ $t('cfc108c7.cdaed5') }}</p>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('cfc108c7.8fcba7')" prop="share_desc" :rules="rules.share_desc">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input
              v-model="form.share_desc"
              :maxlength="25"
              :placeholder="$t('cfc108c7.1aa60b')"
            >
              {{ $t('cfc108c7.4570f6') }}
            </el-input>
          </el-col>
        </el-row>
      </el-form-item>
    </el-card>
    <div style="margin-top: 10px">
      <el-button @click.native="handleCancel"> {{ $t('cfc108c7.5f4112') }} </el-button>
      <el-button v-if="true == show" type="primary" @click.prevent="submitItemsAction('form')">
        {{ $t('cfc108c7.be5fbb') }}
      </el-button>
    </div>
    <el-dialog :title="$t('cfc108c7.43d1e2')" :visible.sync="goodsDialogVisible" center>
      <!-- <el-button-group class="tab-group">
        <el-button
          class="tab-btn"
          @click="changeGoods('every')"
          :class="goodsTypeTitle === $t('cfc108c7.fcd4d7') ? 'on' : ''"
          >{{ $t('cfc108c7.fcd4d7') }}</el-button
        >
        <el-button
          class="tab-btn"
          @click="changeGoods('normal')"
          :class="goodsTypeTitle === $t('cfc108c7.ddf672') ? 'on' : ''"
          >{{ $t('cfc108c7.ddf672') }}</el-button
        >
      </el-button-group> -->
      <el-row class="content-bottom-padded" :gutter="20">
        <el-col :span="12">
          <el-input v-model="itemsParams.keywords" :placeholder="$t('cfc108c7.1fd1d5')">
            <el-button slot="append" icon="el-icon-search" @click="goodsSearch" />
          </el-input>
        </el-col>
      </el-row>
      <el-table v-loading="itemsLoading" :data="itemsList" style="width: 100%" border height="500">
        <el-table-column prop="itemName" :label="$t('cfc108c7.1fd1d5')" />
        <el-table-column :label="$t('cfc108c7.0f088d')">
          <template slot-scope="scope">
            <img width="20" :src="wximageurl + scope.row.pics[0]" />
          </template>
        </el-table-column>
        <el-table-column prop="price" :label="$t('cfc108c7.e29575')" :formatter="priceformatter" />
        <el-table-column prop="itemName" :label="$t('cfc108c7.3fea7c')">
          <template slot-scope="scope">
            <el-button
              v-if="form.goods_id != scope.row.itemId"
              type="text"
              @click="chooseItem(scope.row)"
            >
              {{ $t('cfc108c7.153fa6') }}
            </el-button>
            <span v-else>{{ $t('cfc108c7.f08afd') }}</span>
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
        <el-button @click="goodsDialogVisible = false">{{ $t('cfc108c7.9d2578') }}</el-button>
        <el-button type="primary" @click="goodsDialogVisible = false">{{
          $t('cfc108c7.aa7527')
        }}</el-button>
      </span>
    </el-dialog>
  </el-form>
</template>
<script>
import { uploadMaterial } from '../../../api/wechat'
import { getItemsList } from '../../../api/goods'
import { getDefaultCurrency } from '../../../api/company'
import { createGroupActivity, updateGroupActivity, getGroupsInfo } from '../../../api/promotions'
import imgBox from '@/components/element/imgBox'

export default {
  inject: ['refresh'],
  components: {
    imgBox
  },
  data() {
    return {
      show: true,
      itemsLoading: false,
      groups_activity_id: '',
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
        share_desc: ''
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
      currency: {},
      cursymbol: '￥',
      goodsTypeTitle: ''
    }
  },
  computed: {
    rules() {
      return {
        act_name: [{ required: true, message: this.$t('cfc108c7.6b7caf') }],
        date: [{ required: true, message: this.$t('cfc108c7.696416') }],
        store: [
          { required: true, message: this.$t('cfc108c7.05c81c') },
          { pattern: /^[1-9]\d{0,4}$/, message: this.$t('cfc108c7.e8ba08') }
        ],
        act_price: [
          { required: true, message: this.$t('cfc108c7.91c590') },
          { pattern: /^(?=.*[1-9])\d+(\.\d{1,2})?$/, message: this.$t('cfc108c7.6cd091') }
        ],
        person_num: [
          { required: true, message: this.$t('cfc108c7.19b2d8') },
          { pattern: /^([2-9]|[1-9]\d{1})$/, message: this.$t('cfc108c7.a7e01e') }
        ],
        limit_time: [
          { required: true, message: this.$t('cfc108c7.7df867') },
          { pattern: /^[1-9]\d{0,1}$/, message: this.$t('cfc108c7.fdbb26') }
        ],
        limit_buy_num: [
          { required: true, message: this.$t('cfc108c7.d5297f') },
          { pattern: /^\d{0,2}$/, message: this.$t('cfc108c7.b7d94a') }
        ],
        share_desc: [{ required: true, message: this.$t('cfc108c7.f80b7a') }]
      }
    }
  },
  mounted() {
    this.goodsTypeTitle = this.$t('cfc108c7.ddf672')
    if (this.$route.query.show) {
      this.show = false
    }
    if (this.$route.params.groups_id) {
      this.groups_activity_id = this.$route.params.groups_id
      this.getGroupsInfo()
    }
    this.getCurrencyInfo()
  },
  methods: {
    submitItemsAction(formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.form.pics) {
            this.$message.error(this.$t('cfc108c7.104b35'))
            return false
          }
          if (!this.form.goods_id) {
            this.$message.error(this.$t('cfc108c7.c5c5f2'))
            return false
          }
          if (this.groups_activity_id) {
            updateGroupActivity(this.groups_activity_id, this.form).then((res) => {
              if (res.data.data) {
                this.$message({
                  message: this.$t('cfc108c7.55aa63'),
                  type: 'success',
                  duration: 2 * 1000,
                  onClose() {
                    that.refresh()
                    that.$router.go(-1)
                  }
                })
              }
            })
          } else {
            createGroupActivity(this.form).then((res) => {
              if (res.data.data) {
                this.$message({
                  message: this.$t('cfc108c7.3fdaea'),
                  type: 'success',
                  duration: 2 * 1000,
                  onClose() {
                    that.refresh()
                    that.$router.go(-1)
                  }
                })
              }
            })
          }
        } else {
          return false
        }
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
            message: this.$t('cfc108c7.325305')
          })
        })
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
          this.goods = response.data.data.goods
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: this.$t('cfc108c7.c5c26e')
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
    async handleImgChange() {
      try {
        const { data } = await this.$picker.image({
          data: this.form.pics ? { url: this.form.pics } : undefined
        })

        // 获取图片URL，可能是对象中的url属性，也可能是直接的字符串
        const imgUrl = (data && data.url) || data || ''

        if (imgUrl) {
          // 如果包含 wximageurl，则提取相对路径
          // form.pics 存储的是相对路径（显示时使用 wximageurl + form.pics）
          if (this.wximageurl && imgUrl.indexOf(this.wximageurl) === 0) {
            this.form.pics = imgUrl.replace(this.wximageurl, '')
          } else {
            this.form.pics = imgUrl
          }
        }
      } catch (error) {
        // 用户取消选择时不处理错误
        console.log('图片选择已取消')
      }
    },
    changeGoods(type) {
      switch (type) {
        case 'every':
          this.$set(this.itemsParams, 'consume_type', 'every')
          this.$delete(this.itemsParams, 'item_type')
          this.goodsTypeTitle = this.$t('cfc108c7.fcd4d7')
          break
        case 'normal':
          this.$set(this.itemsParams, 'item_type', 'normal')
          this.$delete(this.itemsParams, 'consume_type')
          this.goodsTypeTitle = this.$t('cfc108c7.ddf672')
          break
      }
      this.getGoodsList()
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
