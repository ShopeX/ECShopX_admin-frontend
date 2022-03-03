<template>
  <div class="wheel">
    <el-form
      ref="dataForm"
      :model="dataForm"
      label-width="125px"
    >
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="是否开启大转盘">
            <el-switch v-model="dataForm.turntable_open" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否长期有效">
            <el-switch v-model="dataForm.long_term" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            v-if="!dataForm.long_term"
            label="活动周期"
          >
            <el-date-picker
              v-model="dataForm.long_date"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="timestamp"
            />
          </el-form-item>
          <div
            v-else
            style="height: 40px; margin-bottom: 22px"
          />
        </el-col>
        <el-col :span="6">
          <el-form-item label="大转盘标题">
            <el-input
              v-model="dataForm.turntable_title"
              maxlength="20"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="每天最大抽奖次数">
            <el-input
              v-model="dataForm.max_times_day"
              maxlength="20"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="登录送抽奖次数">
            <el-input
              v-model="dataForm.login_get_times"
              maxlength="20"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="">
            <div class="op" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="购物满">
            <el-input
              v-model="dataForm.shopping_full"
              maxlength="20"
            />
          </el-form-item>
        </el-col>
        <el-col
          :span="6"
          class="line-height__40"
        >
          元获取一次抽奖次数
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="活动结束时清空抽奖次数"
            label-width="170px"
          >
            <el-switch v-model="dataForm.clear_times_after_end" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="wheel-con">
      <el-tabs v-model="activeName">
        <el-tab-pane
          label="奖项配置"
          name="1"
        >
          <div class="wheel-con__table">
            <el-table
              :data="tableData"
              style="width: 100%"
            >
              <el-table-column
                label="奖项类型"
                width="140"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.prize_type"
                    @change="handleChangeType(scope)"
                  >
                    <el-option
                      v-for="item in prize_type_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="奖项名称"
                width="130"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.prize_name"
                    maxlength="4"
                  />
                </template>
              </el-table-column>

              <el-table-column
                label="奖项描述"
                width="130"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.prize_describe" />
                </template>
              </el-table-column>

              <el-table-column label="中奖概率  0-100的整数">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.prize_probability"
                    :controls="false"
                    :min="0"
                    :max="100"
                  />
                </template>
              </el-table-column>
              <el-table-column label="奖项值">
                <template
                  v-if="isCheck"
                  slot-scope="scope"
                >
                  <el-input
                    v-if="scope.row.prize_type === 'points'"
                    v-model="scope.row.prize_value"
                  />
                  <el-select
                    v-if="scope.row.prize_type === 'coupon'"
                    v-model="scope.row.prize_value"
                    filterable
                    placeholder="请选择"
                    @change="handleChangePrizaValue(scope.row, scope.$index)"
                  >
                    <el-option
                      v-for="item in coupon_options"
                      :key="item.card_id"
                      :label="item.title"
                      :value="item.card_id"
                    />
                  </el-select>
                  <el-select
                    v-if="scope.row.prize_type === 'coupons'"
                    v-model="scope.row.prize_value"
                    multiple
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in coupon_options"
                      :key="item.card_id"
                      :label="item.title"
                      :value="item.card_id"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="address"
                label="图片"
              >
                <template slot-scope="scope">
                  <el-image
                    style="width: 30px; height: 30px"
                    :src="scope.row.prize_image"
                    fit="fill"
                  />
                  <el-button
                    type="primary"
                    size="mini"
                    @click="handleClickUpload(scope.$index)"
                  >
                    图片上传
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="address"
                label="设置商品"
              >
                <template slot-scope="scope">
                  <el-select
                    v-if="scope.row.prize_type === 'coupon' && scope.row.goods_options.length > 0"
                    v-model="scope.row.prize_url"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in scope.row.goods_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="100"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="handleClickDel(scope.row, scope.$index)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button
              class="add-prize"
              type="primary"
              @click="handleClickAdd"
            >
              添加
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="大转盘配置"
          name="2"
        >
          <div class="wheel-con__turntable">
            <div class="turntable-box">
              <div class="turntable-box__background">
                <el-image
                  v-if="turntableData.background_img"
                  :src="turntableData.background_img"
                  fit="contain"
                />
              </div>
              <div class="turntable-box__con">
                <div
                  class="turntable"
                  :style="{
                    border: `5px solid ${turntableData.border_color}`,
                    'box-shadow': `0px 0px 5px 5px ${turntableData.shadow_color}`
                  }"
                >
                  <ul
                    class="turntable-bg"
                    :style="{ transform: `rotate(${rotateBg}deg)` }"
                  >
                    <li
                      v-for="(item, index) in tableData"
                      :key="index"
                      :style="{
                        transform: `rotate(${(360 / tableData.length) * (index + 1)}deg)`,
                        background: `${turntableData.line_color}`
                      }"
                    />
                  </ul>
                  <ul
                    class="turntable-gift"
                    :style="{ transform: `rotate(${rotateGift}deg)` }"
                  >
                    <li
                      v-for="(item, index) in tableData"
                      :key="index"
                      :style="{
                        transform: `rotate(${(360 / tableData.length) * (index + 1)}deg)`
                      }"
                      :class="{ 'even-numbers': index % 2 === 0 }"
                    >
                      <div class="div-text">
                        <div>{{ item.prize_name }}</div>
                        <img :src="item.prize_image">
                      </div>
                    </li>
                  </ul>
                  <div class="turntable_pointer">
                    <el-image
                      v-if="turntableData.pointer_img"
                      style="width: 100%; height: 100%"
                      :src="turntableData.pointer_img"
                      fit="fill"
                    />
                  </div>
                </div>
                <div
                  class="turntable-box__con-describe"
                  v-html="turntableData.describe"
                />
              </div>
            </div>
            <div class="turntable-setup">
              <el-form
                ref="turntableData"
                :model="turntableData"
                label-width="120px"
              >
                <el-row :gutter="20">
                  <el-col :span="24">
                    <el-form-item label="背景">
                      <el-button
                        size="mini"
                        @click="handleClickAddBackground"
                      >
                        添加背景图
                      </el-button>
                      <el-button
                        v-if="turntableData.background_img"
                        size="mini"
                        @click="handleClickDelBackground"
                      >
                        删除背景图
                      </el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="背景">
                      <el-button
                        size="mini"
                        @click="handleClickAddPointer"
                      >
                        上传指针
                      </el-button>
                      <el-button
                        v-if="turntableData.pointer_img"
                        size="mini"
                        @click="handleClickDelPointer"
                      >
                        删除指针
                      </el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="边框颜色">
                      <el-color-picker
                        v-model="turntableData.border_color"
                        show-alpha
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="阴影颜色">
                      <el-color-picker
                        v-model="turntableData.shadow_color"
                        show-alpha
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="分割线颜色">
                      <el-color-picker
                        v-model="turntableData.line_color"
                        show-alpha
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="活动描述">
                      <vue-html5-editor
                        ref="editor"
                        :content="turntableData.describe"
                        :height="360"
                        @change="handelChangeUpdateContent"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="wheel-save">
      <el-button
        type="danger"
        @click="handleClickSave"
      >
        保存
      </el-button>
    </div>
    <imgPicker
      :dialog-visible="picsDialog"
      :sc-status="isGetPics"
      :is-most="false"
      @chooseImg="pickPics"
      @closeImgDialog="closePicsDialog"
    />
  </div>
</template>
<script>
import { getEffectiveCardList } from '@/api/cardticket'
import { getSurntableconfig, setSurntableconfig, getGoodsbycoupon } from '@/api/promotions'
import imgPicker from '@/components/imageselect'

export default {
  components: {
    imgPicker
  },
  data () {
    return {
      activeName: '1',
      dataForm: {
        turntable_open: false, //是否开启大转盘
        long_term: false, //是否长期有效
        turntable_title: '', //大转盘标题
        long_date: '', //周期时间
        max_times_day: '', //每天最大抽奖次数
        login_get_times: '', //登陆时获取的次数，-1为不设置
        shopping_full: '', //购物满多少元获取一次抽奖次数，-1为不设置
        clear_times_after_end: false //活动结束时清空抽奖次数
      },
      coupon_options: '', //优惠卷列表
      goods_options: '', //商品列表
      upload_index: 0,
      rotateBg: 0,
      rotateGift: 0,
      isCheck: true,
      picsDialog: false,
      isGetPics: false,
      prize_type_options: [
        //奖项类型
        {
          value: 'points',
          label: '积分'
        },
        {
          value: 'coupon',
          label: '优惠券'
        },
        {
          value: 'coupons',
          label: '优惠券包'
        },
        {
          value: 'thanks',
          label: '谢谢惠顾'
        }
      ],
      tableData: [],
      isB: true,
      isP: true,
      turntableData: {
        background_img: '',
        shadow_color: 'rgba(254, 234, 149, 1)',
        line_color: 'rgba(254, 234, 149, 1)',
        border_color: 'rgba(193, 63, 7, 1)',
        pointer_img: '',
        describe: ''
      }
    }
  },
  watch: {
    tableData (value) {
      this.rotateBg = 360 / value.length / 2
      this.rotateGift = -(360 / value.length - 45)
    }
  },

  mounted () {
    this._getEffectiveCardList()
    this._getSurntableconfig()
  },

  methods: {
    handelChangeUpdateContent (data) {
      this.turntableData.describe = data
    },
    /**
     * 获取奖项值 list
     * */
    _getEffectiveCardList () {
      const requestData = { page_size: 1000 }
      getEffectiveCardList(requestData).then((response) => {
        this.coupon_options = response.data.data.list
      })
    },

    handleChangeType (item) {
      this.isCheck = false
      item.row.prize_value = ''
      if (item.row.prize_type === 'coupons') {
        item.row.prize_value = []
      }
      setTimeout(() => {
        this.isCheck = true
      })
    },

    handleClickDel (row, index) {
      this.tableData.splice(index, 1)
    },

    handleClickAdd () {
      if (this.tableData.length >= 8) return
      this.tableData.push({
        prize_type: '', //奖项类型
        prize_name: '', //奖项名称
        prize_describe: '', //奖项描述
        prize_probability: 0, //中奖概率  0-10000的整数
        prize_image: '', //图片链接
        prize_url: '', //中奖后跳转链接  可不设置
        prize_bgcolor: '', //背景颜色
        prize_value: '', //奖项值，优惠券id
        goods_options: ''
      })
    },

    /**
     * 获取大转盘详情
     * */
    _getSurntableconfig () {
      getSurntableconfig({}).then((res) => {
        if (Array.isArray(res)) return

        let data = res.data.data

        let list = data.prizes.map((item) => {
          item.prize_probability = item.prize_probability / 100
          return item
        })
        this.tableData = list

        this.rotateBg = 360 / data.prizes.length / 2

        this.rotateGift = -(360 / data.prizes.length - 45)

        let params = {
          turntable_open: data.turntable_open == '1' ? true : false,
          turntable_title: data.turntable_title,
          long_term: data.long_term == '1' ? true : false,
          long_date: [data.start_time * 1000, data.end_time * 1000],
          login_get_times: data.login_get_times ? data.login_get_times : '',
          shopping_full: data.shopping_full ? data.shopping_full : '',
          clear_times_after_end: data.clear_times_after_end == '1' ? true : false,
          max_times_day: data.max_times_day
        }

        if (data.prizes[0].dataForm) {
          this.turntableData = data.prizes[0].dataForm
        }

        this.dataForm = params
      })
    },

    /**
     * 上传背景图
     * */
    handleClickAddBackground () {
      this.isB = true
      this.isP = false
      this.picsDialog = true
      this.isGetPics = true
    },

    handleClickDelBackground () {
      this.turntableData.background_img = ''
    },

    /**
     * 上传指针
     * */
    handleClickAddPointer () {
      this.isB = false
      this.isP = true
      this.picsDialog = true
      this.isGetPics = true
    },

    handleClickDelPointer () {
      this.turntableData.pointer_img = ''
    },

    /**
     * 上传图片
     * */
    handleClickUpload (index) {
      this.isB = false
      this.isP = false
      this.picsDialog = true
      this.isGetPics = true
      this.upload_index = index
    },

    /**
     * 上传图片回调
     * */
    pickPics (item) {
      console.log(1111, item.url, this.upload_index)
      if (this.isB) {
        this.turntableData.background_img = item.url
      } else if (this.isP) {
        this.turntableData.pointer_img = item.url
      } else {
        this.tableData[this.upload_index].prize_image = item.url
      }
      this.picsDialog = false
    },

    closePicsDialog () {
      this.picsDialog = false
    },

    /**
     * 选择奖项值
     * */
    async handleChangePrizaValue (item, index) {
      console.log('handleChangePrizaValue', item)
      let { data } = await getGoodsbycoupon(item.prize_value)
      let { list } = data.data

      let nList = list.map((item) => {
        return {
          value: item.item_id,
          label: item.item_name
        }
      })

      item.goods_options = nList
      item.prize_url = ''

      this.tableData.splice(index, 1, item)
    },

    /**
     * 保存
     * */
    handleClickSave () {
      let nTableData = JSON.parse(JSON.stringify(this.tableData))

      let num = nTableData.reduce((accumulator, currentValue) => {
        if (typeof accumulator === 'number') {
          return accumulator + currentValue.prize_probability
        }
        return accumulator.prize_probability + currentValue.prize_probability
      })

      if (num !== 100) {
        this.$message.error('中奖概况总和需要等于100')
        return
      }

      let list = nTableData.map((item) => {
        return {
          ...item,
          prize_probability: item.prize_probability * 100,
          dataForm: this.turntableData
        }
      })

      let params = {
        turntable_open: this.dataForm.turntable_open ? 1 : 0,
        turntable_title: this.dataForm.turntable_title,
        long_term: this.dataForm.long_term ? 1 : 0,
        start_time: this.dataForm.long_date[0] / 1000,
        end_time: this.dataForm.long_date[1] / 1000,
        max_times_day: this.dataForm.max_times_day,
        login_get_times: this.dataForm.login_get_times ? this.dataForm.login_get_times : -1,
        shopping_full: this.dataForm.shopping_full ? this.dataForm.shopping_full : -1,
        clear_times_after_end: this.dataForm.clear_times_after_end ? 1 : 0,
        prizes: JSON.stringify(list)
      }

      console.log('this.tableData', list)

      setSurntableconfig(params).then((res) => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      })
    }
  }
}
</script>
<style scoped lang="scss">
.line-height__40 {
  line-height: 40px;
}
.wheel {
  &-con {
    margin-top: 10px;

    &__turntable {
      display: flex;
      .turntable-box {
        width: 375px;
        // height: 500px;
        position: relative;
        &__background {
          width: 100%;
        }

        &__con {
          position: absolute;
          width: 100%;
          top: 0px;

          .turntable {
            overflow: hidden;
            width: 250px;
            height: 250px;
            // border: 5px solid #c13f07;
            border-radius: 50%;
            margin: 10px auto;
            // box-shadow: 0px 0px 5px 5px #feea95;
            position: relative;
            margin-top: 120px;
            &-bg {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: #fff;
              border-radius: 50%;
              transform: rotate(90deg);
              li {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                margin: 0 auto;
                width: 1px;
                height: 100%;
                // background: #feea95;
                transform-origin: center center;
              }
            }

            &-gift {
              position: relative;
              width: 100%;
              height: 100%;
              // transform: rotate(45deg);
              li {
                position: absolute;
                top: 0%;
                left: 0%;
                width: 50%;
                height: 50%;
                transform-origin: right bottom;
                // background-color: #fff;
                img {
                  width: 40px;
                  height: 40px;
                }
                .div-text {
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  display: block;
                  width: 50px;
                  height: 70px;
                  margin: auto;
                  // background: yellow;
                  transform: rotate(-45deg);
                  text-align: center;
                  line-height: 64px;
                  border-radius: 5px;
                  // background: #f23c3c;
                  // color: #fff;
                  font-size: 12px;
                  color: #000;
                  div {
                    height: 34px;
                    line-height: 34px;
                  }
                }
              }
            }

            &_pointer {
              position: absolute;
              left: 50%;
              top: 50%;
              width: 50px;
              height: 50px;
              margin-top: -25px;
              margin-left: -25px;
            }
          }

          &-describe {
            max-width: 80%;
            margin: 0 auto;
            margin-top: 40px;
            background-color: #fff;
            border-radius: 5px;
            box-sizing: border-box;
            padding: 10px;
            padding-bottom: 20px;
            font-size: 12px;
            line-height: 20px;
          }
        }
      }

      .turntable-setup {
        flex: 1;
        margin-left: 50px;
      }
    }

    &__table {
    }
  }
  &__table {
  }
  &-save {
    text-align: center;
    padding: 40px;
  }
  .op {
    width: 10px;
    height: 40px;
    opacity: 0;
  }
}
</style>
<style type="text/css" lang="scss">
.add-prize {
  width: 100%;
}
</style>
