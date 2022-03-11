<template>
  <div class="section section-white">
    <div class="section-header with-border">
      添加商品
    </div>
    <div class="section-body">
      <el-form
        ref="form"
        :model="form"
        label-width="150px"
        label-position="left"
        class="demo-ruleForm"
      >
        <el-form-item label="核销类型">
          <el-radio-group v-model="form.consume_type">
            <div style="margin-bottom: 10px">
              <el-radio
                label="every"
                :disabled="form.item_id !== '' && form.consume_type === 'all' ? true : false"
              >
                次卡类型&nbsp;<span class="frm-tips">(每个物料都需要核销)</span>
              </el-radio>
            </div>
            <div>
              <el-radio
                label="all"
                :disabled="form.item_id !== '' && form.consume_type === 'every' ? true : false"
              >
                团购券类型&nbsp;<span
                  class="frm-tips"
                >(所有物料作为一个整体，只核销一次)</span>
              </el-radio>
            </div>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-col :span="12">
            <el-input
              v-model="form.item_name"
              :maxlength="30"
              placeholder=""
            />
          </el-col>
        </el-form-item>
        <el-form-item label="简洁的描述">
          <el-col :span="12">
            <el-input
              v-model="form.brief"
              type="textarea"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="成本价">
          <el-col :span="5">
            <el-input
              v-model="form.cost_price"
              type="number"
              required
              min="0"
              placeholder=""
            />
          </el-col>
          <el-col :span="1">
            &nbsp;元
          </el-col>
        </el-form-item>
        <el-form-item label="销售价">
          <el-col :span="5">
            <el-input
              v-model="form.price"
              type="number"
              required
              min="0"
              placeholder=""
            />
          </el-col>
          <el-col :span="1">
            &nbsp;元
          </el-col>
        </el-form-item>
        <el-form-item label="商品状态">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-select
                v-model="form.approve_status"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in statusOption"
                  :key="item.value"
                  :label="item.title"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="排序编号">
          <el-row :gutter="20">
            <el-col :span="4">
              <el-input
                v-model="form.sort"
                placeholder=""
              />
            </el-col>
            <el-col :span="10">
              数字越大越靠前
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="商品内容">
          <div class="content-bottom-padded">
            <el-button
              type="primary"
              size="small"
              icon="plus"
              @click="addLabel"
            >
              选择基础物料
            </el-button>
          </div>
          <el-table
            :data="form.type_labels"
            border
            style="line-height: normal"
          >
            <el-table-column
              label="物料名称"
              prop="labelName"
              width="150"
            />
            <el-table-column
              label="单价(元)"
              width="90"
            >
              <template slot-scope="scope">
                <el-col :span="12">
                  ￥{{ scope.row.labelPrice }}
                </el-col>
              </template>
            </el-table-column>
            <el-table-column label="数量">
              <template slot-scope="scope">
                <el-row>
                  <el-col :span="12">
                    <el-radio
                      v-model="scope.row.isNotLimitNum"
                      :label="2"
                    >
                      限制数量
                    </el-radio>
                    <el-radio
                      v-model="scope.row.isNotLimitNum"
                      :label="1"
                    >
                      不限数量
                    </el-radio>
                  </el-col>
                  <el-col
                    v-if="scope.row.isNotLimitNum == 2"
                    :span="12"
                  >
                    <el-input
                      v-model="scope.row.num"
                      type="number"
                      min="1"
                      placeholder="整数"
                      @change="handleMarketPrice"
                    />
                  </el-col>
                </el-row>
                <el-row />
              </template>
            </el-table-column>
            <el-table-column
              label="有效期(天)"
              width="150"
            >
              <template slot-scope="scope">
                <el-col
                  :span="24"
                >
                  <el-input
                    v-model="scope.row.limitTime"
                    :disabled="form.consume_type === 'all' ? true : false"
                    type="number"
                    min="1"
                    placeholder="正整数"
                  />
                </el-col>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="100"
            >
              <template slot-scope="scope">
                <el-button
                  size="small"
                  icon="delete"
                  type="danger"
                  @click.native.prevent="deleteServiceLabelsAction(scope.$index, form.type_labels)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="原价">
          <el-col :span="5">
            <el-input
              v-model="form.market_price"
              type="number"
              required
              min="0"
              placeholder=""
            />
          </el-col>
          <el-col :span="1">
            &nbsp;元
          </el-col>
        </el-form-item>
        <el-form-item
          v-show="form.consume_type === 'all'"
          label="有效期"
          prop="date_type"
        >
          <el-radio-group
            v-model="form.date_type"
            @change="changeDatetime"
          >
            <div style="margin-bottom: 20px">
              <el-radio
                :disabled="
                  form.item_id !== '' && form.date_type === 'DATE_TYPE_FIX_TERM' ? true : false
                "
                label="DATE_TYPE_FIX_TIME_RANGE"
              >
                固定日期&nbsp;&nbsp;
              </el-radio>
              <el-date-picker
                v-model="date_range"
                type="daterange"
                format="yyyy-MM-dd"
                :picker-options="form.item_id ? '' : pickerOptions"
                style="width: 215px"
                :disabled="
                  form.item_id !== '' && form.date_type == 'DATE_TYPE_FIX_TERM' ? true : false
                "
              />
            </div>
            <div>
              <el-radio
                :disabled="
                  form.item_id !== '' && form.date_type === 'DATE_TYPE_FIX_TIME_RANGE'
                    ? true
                    : false
                "
                label="DATE_TYPE_FIX_TERM"
              >
                领取后&nbsp;&nbsp;&nbsp;&nbsp;
                <el-input
                  v-model="form.fixed_term"
                  :disabled="
                    form.item_id !== '' && form.date_type === 'DATE_TYPE_FIX_TIME_RANGE'
                      ? true
                      : false
                  "
                  type="number"
                  min="1"
                  placeholder=""
                  style="width: 60px"
                />
                天内有效
              </el-radio>
            </div>
          </el-radio-group>
        </el-form-item>
        <!-- 老的写法[用的element] -->
        <!-- <el-form-item label="图片">
          <el-col><p class="frm-tips">最多可上传9个图片，文件格式为bmp、png、jpeg、jpg或gif，大小不超过2M（建议尺寸：375px * 200px）</p></el-col>
            <el-col>
              <el-upload
                action=""
                list-type="picture-card"
                :on-preview="handlePicCardPreview"
                :auto-upload="false"
                :limit=9
                :file-list="picsList"
                :on-remove="handleRemovePic"
                :on-change="handlePicChange">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-col>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item> -->

        <el-form-item label="图片">
          <el-row :gutter="20">
            <el-col :span="18">
              <div class="frm-tips">
                最多可上传9个图片，文件格式为bmp、png、jpeg、jpg或gif，大小不超过2M（建议尺寸：375px
                * 200px）
              </div>
              <div class="pics-box">
                <ul class="goodspic-wrap">
                  <li
                    v-for="(item, index) in form.pics"
                    :key="index"
                    class="goodspic"
                    @mouseenter="picsEnter(index)"
                    @mouseleave="picsLeave"
                  >
                    <img :src="wximageurl + item">
                    <div
                      class="goodspic-mask"
                      :class="picsCurrent == index ? 'on' : ''"
                      @click="removePicsImg(index)"
                    >
                      <i class="iconfont icon-trash-alt1 icon1" />
                    </div>
                  </li>
                </ul>
                <div
                  v-if="form.pics.length < 9"
                  class="upload-box"
                  @click="handlePicsChange"
                >
                  <i class="el-icon-plus avatar-uploader-icon" />
                </div>
              </div>
              <imgPicker
                :dialog-visible="picsDialog"
                :sc-status="isGetPics"
                :is-most="true"
                @chooseImg="pickPics"
                @closeImgDialog="closePicsDialog"
              />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="详情">
          <vue-html5-editor
            ref="editor"
            :content="form.intro"
            :height="360"
            @change="updateContent"
          />
        </el-form-item>
        <el-form-item label="开启购买协议">
          <el-switch
            v-model="form.enable_agreement"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="购买协议">
          <el-input
            v-model="form.purchase_agreement"
            type="textarea"
            :autosize="{ minRows: 6 }"
            placeholder="请输入购买协议"
          />
          <!-- <vue-html5-editor :content="form.purchase_agreement" ref="editor" @change="updatePurchaseAgreement" :height="360"></vue-html5-editor> -->
        </el-form-item>
        <el-form-item label=" ">
          <el-button @click.native="handleCancel">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submitItemsAction"
          >
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 添加、编辑标识-开始 -->
    <el-dialog
      title="选择基础物料"
      :visible.sync="serviceLabelsVisible"
      :before-close="handleCancelLabelsDialog"
    >
      <template>
        <div
          v-if="total_count > params.pageSize"
          class="f_r"
        >
          <el-pagination
            layout="prev, pager, next"
            :total="total_count"
            :page-size="params.pageSize"
            @current-change="handleCurrentChange"
          />
        </div>
        <el-table
          ref="multipleTable"
          :data="serviceLabelsList"
          :row-key="handleRowKey"
          style="width: 100%"
          @select="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            :reserve-selection="true"
            width="55"
          />
          <el-table-column
            prop="labelName"
            label="物料名称"
          />
          <el-table-column
            prop="serviceType"
            label="系统类型"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.serviceType === 'point'">积分</span>
              <span v-if="scope.row.serviceType === 'deposit'">储值</span>
              <span v-if="scope.row.serviceType === 'timescard'">次卡</span>
            </template>
          </el-table-column>
          <el-table-column label="物料价格">
            <template slot-scope="scope">
              <span>￥{{ scope.row.labelPrice / 100 }}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-dialog>
    <!-- 添加、编辑基础物料-结束 -->
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getItemsDetail, createItems, updateItems, getServiceLabelsList } from '@/api/goods'
import { uploadMaterial } from '@/api/wechat'
import imgPicker from '@/components/imageselect'
export default {
  inject: ['refresh'],
  components: {
    imgPicker
  },
  data () {
    return {
      serviceLabelsVisible: false,
      serviceLabelsList: [],
      type_labels: [],
      date_range: '',
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      statusOption: [
        {
          title: '前台可销售',
          value: 'onsale'
        },
        {
          title: '可线下销售',
          value: 'offline_sale'
        },
        {
          title: '不可销售',
          value: 'instock'
        }
      ],
      form: {
        item_id: '',
        date_type: '',
        begin_date: '',
        end_date: '',
        fixed_term: '',
        consume_type: 'every',
        item_name: '',
        sort: 0,
        brief: '',
        price: '',
        market_price: '',
        intro: '',
        enable_agreement: false,
        purchase_agreement: '',
        pics: [],
        approve_status: 'onsale',
        type_labels: []
      },
      activeName: 'first',

      picsList: [],
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20
      },
      dialogVisible: false,
      dialogImageUrl: '',
      oldLabels: [],
      isGetPics: false,
      picsDialog: false,
      picsCurrent: -1,
      picsOldLen: 0
    }
  },
  mounted () {
    if (this.$route.params.itemId) {
      // 初始化门店数据
      getItemsDetail(this.$route.params.itemId)
        .then((response) => {
          let itemsDetailData = response.data.data
          this.form.pics = itemsDetailData.pics
          // 处理图片列表
          var picList = []
          for (var item in itemsDetailData.pics) {
            var newpic = {}
            newpic.url = this.wximageurl + itemsDetailData.pics[item]
            picList.push(newpic)
          }
          this.picsList = picList

          this.form.item_id = itemsDetailData.item_id
          this.form.consume_type = itemsDetailData.consume_type
          this.form.date_type = itemsDetailData.date_type
          this.form.sort = itemsDetailData.sort
          const start = new Date(this.getSplitDate(itemsDetailData.begin_date))
          const end = new Date(this.getSplitDate(itemsDetailData.end_date))
          this.date_range = [start, end]
          this.form.fixed_term = itemsDetailData.fixed_term
          this.form.item_name = itemsDetailData.item_name
          this.form.brief = itemsDetailData.brief
          this.form.price = itemsDetailData.price / 100
          this.form.approve_status = itemsDetailData.approve_status
          this.form.market_price = itemsDetailData.market_price / 100
          this.form.pics = itemsDetailData.pics
          this.form.intro = itemsDetailData.intro
          this.form.purchase_agreement = itemsDetailData.purchase_agreement
          this.form.enable_agreement = itemsDetailData.enable_agreement
          let newItemsDetail = []
          itemsDetailData.type_labels.forEach(function (val) {
            let tmp = {}
            tmp.labelId = val.labelId
            tmp.labelName = val.labelName
            tmp.limitTime = val.limitTime
            tmp.labelPrice = val.labelPrice / 100
            tmp.num = val.num
            tmp.isNotLimitNum = val.isNotLimitNum
            newItemsDetail.push(tmp)
          })
          this.form.type_labels = newItemsDetail
          this.oldLabels = newItemsDetail
        })
        .catch((error) => {
          this.$router.go(-1)
        })
    }
  },
  methods: {
    changeDatetime: function (val) {
      if (val === 'DATE_TYPE_FIX_TIME_RANGE') {
        this.datetimeStatus = true
      } else {
        this.datetimeStatus = false
        this.date_range = ''
        this.begin_time = 0
      }
    },
    handleMarketPrice: function (value) {
      let total_market_price = 0
      this.form.type_labels.forEach(function (val) {
        total_market_price = total_market_price + val.labelPrice * val.num
      })
      this.form.market_price = total_market_price
    },
    handleRowKey: function (row) {
      return row.labelId
    },
    handleSelectionChange: function (selection, row) {
      let oldtmp = []
      let newtmp = []
      this.oldLabels.forEach(function (val1) {
        oldtmp[val1.labelId] = val1
      })
      let total_market_price = 0
      selection.forEach(function (val) {
        let tmp = {}
        tmp.labelId = val.labelId
        tmp.labelName = val.labelName
        tmp.labelPrice = val.labelPrice / 100
        tmp.num = 1
        if (oldtmp[val.labelId]) {
          tmp.num = oldtmp[val.labelId]['num']
          // tmp.labelPrice = oldtmp[val.labelId]['labelPrice']
          tmp.limitTime = oldtmp[val.labelId]['limitTime']
        }
        tmp.isNotLimitNum = 2
        total_market_price = total_market_price + tmp.labelPrice * tmp.num
        newtmp.push(tmp)
      })

      this.form.market_price = total_market_price
      this.form.type_labels = newtmp
    },
    deleteServiceLabelsAction: function (index, rows) {
      rows.splice(index, 1)
      this.handleMarketPrice()
    },
    handleCancelLabelsDialog: function () {
      this.serviceLabelsVisible = false
    },
    getLabelsList: function () {
      getServiceLabelsList(this.params).then((response) => {
        this.serviceLabelsList = response.data.data.list
        this.total_count = response.data.data.total_count
      })
    },
    handleCurrentChange: function (page_num) {
      this.params.page = page_num
      this.getLabelsList()
    },
    addLabel: function () {
      this.serviceLabelsVisible = true
      this.params.service_type = 'timescard'
      getServiceLabelsList(this.params).then((response) => {
        this.serviceLabelsList = response.data.data.list
        // 打开列表选中列保留显示
        this.$refs.multipleTable.clearSelection()
        this.form.type_labels.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
        this.total_count = response.data.data.total_count
      })
    },
    submitItemsAction: function () {
      // 提交商品
      const that = this
      let params = {
        consume_type: this.form.consume_type,
        item_name: this.form.item_name,
        brief: this.form.brief,
        price: this.form.price,
        sort: this.form.sort,
        market_price: this.form.market_price,
        approve_status: this.form.approve_status,
        pics: this.form.pics,
        intro: this.form.intro,
        purchase_agreement: this.form.purchase_agreement,
        enable_agreement: this.form.enable_agreement,
        type_labels: this.form.type_labels
      }
      if (!params.type_labels.length) {
        this.$message.error('物料信息必填!')
        return false
      }
      for (let [index, elem] of params.type_labels.entries()) {
        if (elem.num <= 0 && elem.isNotLimitNum == 2) {
          this.$message.error('物料核销次数，必需大于0!')
          return false
        }
      }

      if (this.form.consume_type === 'all') {
        params.date_type = this.form.date_type
        if (this.form.date_type == 'DATE_TYPE_FIX_TIME_RANGE' && this.date_range.length > 0) {
          params.begin_date = this.getTaskTime(this.date_range[0])
          params.end_date = this.getTaskTime(this.date_range[1])
        }
        if (this.form.date_type == 'DATE_TYPE_FIX_TERM') {
          params.fixed_term = this.form.fixed_term
        }
      }
      if (this.form.item_id) {
        updateItems(this.form.item_id, params).then((response) => {
          this.$message({
            message: '更新成功',
            type: 'success',
            duration: 2 * 1000,
            onClose () {
              that.refresh()
              that.$router.go(-1)
            }
          })
        })
      } else {
        createItems(params).then((response) => {
          this.$message({
            message: '添加成功',
            type: 'success',
            duration: 2 * 1000,
            onClose () {
              that.refresh()
              that.$router.go(-1)
            }
          })
        })
      }
    },
    updateContent: function (data) {
      this.form.intro = data
    },
    updatePurchaseAgreement: function (data) {
      this.form.purchase_agreement = data
    },
    updateAgreement: function (data) {
      this.form.purchase_agreement = data
    },
    handleCancel: function () {
      this.$router.go(-1)
    },
    priceformatter (row, column) {
      return row.labelPrice / 100
    },
    getTaskTime (strDate) {
      let date = new Date(strDate)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let str = y + '-' + m + '-' + d
      return str
    },
    getTimeStr (date) {
      return this.getTaskTime(new Date(parseInt(date) * 1000))
    },
    getSplitDate (date) {
      var date = this.getTimeStr(date).split('-')
      var dateStr = []
      for (var i = 0; i < date.length; i++) {
        dateStr.push(date[i])
      }
      return dateStr.join(',')
    },
    //老的上传图片（9张）
    // handlePicCardPreview: function (file) {
    //   this.dialogImageUrl = file.url
    // },
    // removeByValue: function (arr, val) {
    //   for(var i=0; i<arr.length; i++) {
    //     if(arr[i] == val) {
    //       arr.splice(i, 1);
    //       break;
    //     }
    //   }
    //   return arr;
    // },
    // handleRemovePic: function (file, fileList) {
    //   let picurl = file.url.replace(this.wximageurl, '')
    //   this.form.pics = this.removeByValue(this.form.pics, picurl)
    // },
    // handlePicChange: function (file, fileList) {
    //   let that = this
    //   if (fileList.length > 9) {
    //     fileList.splice(9)
    //     that.$message.error('最多上传9张图片!')
    //     return false
    //   }
    //   that.logo_url = file.url
    //   if (file && file.raw) {
    //     if (file.raw.type !== 'image/jpeg' && file.raw.type !== 'image/png') {
    //       that.$message.error('上传图片只能是 JPG 或者 PNG 格式!')
    //     }
    //     if (file.raw.size / 1024 / 1024 > 2) {
    //       that.$message.error('上传图片大小不能超过 2MB!')
    //     }
    //   }

    //   let params = {isUploadFile: true, file: file.raw, type: 'image'}
    //   uploadMaterial(params).then(res => {
    //     file.url = this.wximageurl + res.data.data.url
    //     that.form.pics.push(res.data.data.url)
    //   })
    // },
    //上传商品图（9张）
    handlePicsChange: function () {
      this.picsDialog = true
      this.isGetPics = true
    },
    pickPics (arr) {
      if (this.picsOldLen + arr.length >= 10) {
        this.$message.error('最多上传9张图片!')
        return false
      } else {
        if (arr.length != 0) {
          arr.forEach((data) => {
            if (data && data.url !== '') {
              this.picsDialog = false
              this.form.pics.push(data.url)
              this.picsOldLen = this.form.pics.length
            }
          })
        }
      }
    },
    closePicsDialog () {
      this.picsDialog = false
    },
    picsEnter (index) {
      this.picsCurrent = index
    },
    picsLeave () {
      this.picsCurrent = -1
    },
    removePicsImg: function (index) {
      this.form.pics.splice(index, 1)
      this.picsOldLen = this.form.pics.length
    }
  }
}
</script>
<style scoped lang="scss">
.pics-box {
  overflow: hidden;
  .goodspic-wrap {
    float: left;
    margin-right: 5px;
    overflow: hidden;
    .goodspic {
      position: relative;
      float: left;
      width: 146px;
      height: 146px;
      margin: 0 5px 10px;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
      .goodspic-mask {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        text-align: center;
        line-height: 146px;
        cursor: pointer;
        &.on {
          display: block;
        }
        .icon1 {
          font-size: 20px;
          color: #fff;
        }
      }
    }
  }

  .upload-box {
    float: left;
    width: 146px;
    height: 146px;
    .avatar-uploader-icon {
      width: 100%;
      height: 100%;
      line-height: 146px;
    }
    .avatar-uploader-icon {
      font-size: 38px;
    }
  }
}
</style>
