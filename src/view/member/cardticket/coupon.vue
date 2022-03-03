<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1 && $route.path.indexOf('editor') === -1">
      <div class="content-bottom-padded">
        <el-button type="primary" icon="el-icon-circle-plus" @click="addCoupon"
          >创建优惠券</el-button
        >
      </div>
      <el-tabs type="border-card" v-model="fetchParams.date_status" @tab-click="handleClick">
        <el-tab-pane label="已生效" :name="2" />
        <el-tab-pane label="待生效" :name="1" />
        <el-tab-pane label="已过期" :name="3" />
        <el-table
          :data="cardList"
          @filter-change="filterTag"
          v-loading="loading"
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column type="selection" width="55"></el-table-column> -->
          <el-table-column prop="card_type" column-key="type" label="卡券类型" width="120" :filter-multiple="false" :filters="typeFilters" filter-placement="bottom-end">
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
                >{{ scope.row.card_type | formatCardStr }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="title" label="卡券标题"></el-table-column>
          <el-table-column width="280" label="卡券有效期">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <template v-if="scope.row.takeEffect">
                {{ scope.row.takeEffect }}
              </template>
              <template v-else>
                {{ scope.row.begin_time | datetime('YYYY-MM-DD HH:mm:ss') }}
                <template v-if="scope.row.end_time">~</template> {{ scope.row.end_time | datetime('YYYY-MM-DD HH:mm:ss') }}
                <!-- {{ Date.parse(new Date()) > scope.row.end_time * 1000 ? '已过期' : '' }} -->
              </template>
            </template>
          </el-table-column>
          <!-- <el-table-column label="推送至微信">
            <template slot-scope="scope">
              <template v-if="scope.row.if_push_wechat">
                已推微信
              </template>
            </template>

          </el-table-column> -->
          <!-- <el-table-column prop="status" column-key="status" label="投放状态" :filters="statusFilters" filter-placement="bottom-end">
            <template slot-scope="scope">
              {{ scope.row.status | formatStatusStr }}
            </template>
          </el-table-column> -->
          <el-table-column width="120" label="可领取库存">
            <template slot-scope="scope">
              <span v-if="scope.row.quantity > scope.row.get_num">{{
                scope.row.quantity - scope.row.get_num
              }}</span>
              <span v-else>0</span>
              <el-popover
                placement="bottom"
                width="300"
                trigger="click"
                v-model="scope.row.storePop"
                v-if="scope.row.edit_btn === 'Y'"
              >
                <div ref="store" class="store-pop">
                  <div class="store-content">
                    <el-radio-group v-model="scope.row.operationType" class="content-bottom-padded">
                      <el-radio label="increase">增加</el-radio>
                      <el-radio label="reduce">减少</el-radio>
                    </el-radio-group>
                    <el-row>
                      <el-col :span="22">
                        <el-input
                          placeholder="库存不能少于1"
                          v-model="scope.row.storeValue"
                        ></el-input>
                      </el-col>
                      <el-col :span="2" style="line-height: 36px;" class="content-center"
                        >份</el-col
                      >
                    </el-row>
                  </div>
                  <el-row :gutter="10">
                    <el-col :span="12"
                      ><el-button
                        :loading='loadingbtn'
                        type="primary"
                        style="width: 100%"
                        @click="saveStore(scope.$index, scope.row.operationType)"
                        >确定</el-button
                      ></el-col
                    >
                    <el-col :span="12"
                      ><el-button style="width: 100%" @click="scope.row.storePop = false"
                        >取消</el-button
                      ></el-col
                    >
                  </el-row>
                </div>
                <el-button slot="reference" type="text"><i class="el-icon-edit"></i></el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column width="80" prop="get_num" label="领取量">
            <!-- <template v-if="scope.row.get_num">{{scope.row.get_num}}</template> -->
            <!-- <template>0</template> -->
          </el-table-column>
          <el-table-column width="80" prop="use_num" label="使用量">
            <!-- <template v-if="scope.row.use_num">{{scope.row.use_num}}</template> -->
            <!-- <template>0</template> -->
          </el-table-column>
          <el-table-column width="80" prop="source_name" label="店铺">
          </el-table-column>
          <el-table-column width="120" label="操作">
            <template slot-scope="scope">
              <div class="operating-icons">
                <el-button type="text">
                  <router-link
                    :to="{
                      path: matchHidePage('detail'),
                      query: {
                        chooseCardtype: scope.row.card_type,
                        cardId: scope.row.card_id,
                        title: scope.row.title
                      }
                    }"
                    >查看</router-link
                  >
                </el-button>
                <el-button type="text" v-if="scope.row.edit_btn=='Y'"> 
                  <router-link
                    :to="{
                      path: matchHidePage('editor'),
                      query: { chooseCardtype: scope.row.card_type, cardId: scope.row.card_id }
                    }"
                    >编辑</router-link
                  >
                </el-button>
                <el-button
                  type="text"
                  v-if="scope.row.status != 'CARD_STATUS_DISPATCH'"
                  @click="deleteCard(scope.row.card_id, scope.$index)"
                  >删除</el-button
                >
              </div>
              <!-- <a v-if="!scope.row.ifpass" href="#" @click="sendoutShowAction(scope.row.card_id, scope.$index)">投放</a> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="content-padded content-center">
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :total="pagers.total"
            :page-size="pageSize"
          >
          </el-pagination>
        </div>
      </el-tabs>
      <el-dialog title="您可以通过以下方式投放" :visible.sync="sendoutVisible">
        <div
          class="sendout-item"
          v-for="(item, index) in sedoutList"
          :key="index"
          :class="{ 'checked': currSendout === index }"
          @click="chooseSendout(index)"
        >
          <div>{{ item.name }}</div>
          <div class="icon-checked">
            <i class="el-icon-circle-check"></i>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="sendoutVisible = false">取消</el-button>
          <el-button type="primary" @click.native="sendoutAction">确定</el-button>
        </div>
      </el-dialog>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import {
  getCardList,
  getQRcode,
  removeCard,
  updateStore,
  pushToWechat
} from '../../../api/cardticket'
import util from '../../../common/js/util'
export default {
  provide() {
    return {
      refresh: this.getCardList
    }
  },
  data() {
    return {
      loading: false,
      loadingbtn:false,
      sendoutVisible: false,
      currSendout: 1,
      checkedType: {},
      cardList: [],
      pagers: {
        total: 0
      },
      typeId: -1,
      pageSize: 10,
      currentPage: 1,
      sedoutList: [
        //{ name: '直接群发', id: 1 },
        //{ name: '嵌入图文消息', id: 2 },
        { name: '下载二维码', id: 3 }
      ],
      couponList: [
        { type: 'discount', name: '折扣券', desc: '可为用户提供消费折扣支持优惠抵扣快速买单' },
        {
          type: 'cash',
          name: '满减券',
          desc: '可为用户提供抵扣现金服务。可设置成为“满*元，减*元”，支持优惠抵扣快速买单'
        },
        { type: 'new_gift', name: '兑换券', desc: '可为用户提供消费送赠品服务' }
        // { type: 'money', name: '现金券', desc: '现金券' },
      ],
      params: {},
      typeFilters: [
        {
          text: '折扣券',
          value: 'discount'
        },
        {
          text: '满减券',
          value: 'cash'
        },
        {
          text: '兑换券',
          value: 'new_gift'
        },
        // {
        //   text: '现金券',
        //   value: 'money'
        // }
      ],
      statusFilters: [
        {
          text: '待审核',
          value: 'CARD_STATUS_NOT_VERIFY'
        },
        {
          text: '待投放',
          value: 'CARD_STATUS_VERIFY_OK'
        },
        {
          text: '已投放',
          value: 'CARD_STATUS_DISPATCH'
        },
        {
          text: '审核失败',
          value: 'CARD_STATUS_VERIFY_FAIL'
        }
      ],
      fetchParams: {
        currentPage: 1,
        card_type: '',
        status: '',
        pageSize: 10,
        date_status: 2
      },
      multipleSelection: []
    }
  },
  filters: {
    formatStatusStr(str) {
      switch (str) {
        case 'CARD_STATUS_NOT_VERIFY':
          str = '待审核'
          break
        case 'CARD_STATUS_VERIFY_OK':
          str = '待投放'
          break
        case 'CARD_STATUS_DISPATCH':
          str = '已投放'
          break
        case 'CARD_STATUS_VERIFY_FAIL':
          str = '审核失败'
          break
      }
      return str
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  methods: {
    handleCurrentChange(val) {
      this.fetchParams.currentPage = val
      this.getCardList()
    },
    handleSizeChange(val) {
      this.fetchParams.pageSize = val
      this.getCardList()
    },
    handleClick(tab, event) {
      this.fetchParams.date_status = tab.name
      this.getCardList()
    },
    addCoupon() {
      this.$router.push({ path: this.matchHidePage('editor') })
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
    chooseType(item, index) {
      this.i = index
      this.checkedType = item
    },
    deleteCard(id, index) {
      this.$confirm('确定要删除该卡券？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            removeCard({ 'card_id': id }).then((res) => {
              this.cardList.splice(index, 1)
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
      this.$confirm('确定同步微信优惠券到本系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          pullWechatCard().then((response) => {
            this.$message({
              message: '同步成功',
              type: 'success',
              duration: 5 * 1000
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    getCardList() {
      this.loading = true
      var params = {
        status: this.fetchParams.status,
        card_type: this.fetchParams.card_type,
        page_no: this.fetchParams.currentPage,
        page_size: this.fetchParams.pageSize,
        store_self: this.fetchParams.store_self,
        date_status: this.fetchParams.date_status
      }
      getCardList(params)
        .then((res) => {
          // if (res.data.data.list.length > 0) {
            this.cardList = res.data.data.list
            this.pagers.total = res.data.data.pagers.total
            this.loading = false
          // } else {
          //   this.cardList = []
          //   this.loading = false
          // }
        })
        .catch((error) => {
          this.loading = false
        })
    },
    filterTag(value) {
      if (value.type) {
        this.fetchParams.card_type = value.type[0]
        this.getCardList()
      }
      if (value.status) {
        this.fetchParams.status = value.status
        this.getCardList()
      }
    },
    saveStore(index, operationType) {
       this.loadingbtn = true
      let reg = /^[1-9]\d*$/
      if (!reg.test(this.cardList[index].storeValue)) {
        this.$message({
          message: '请输入大于0的正整数',
          type: 'error'
        })
        return
      }
      if (operationType == 'reduce') {
        var quantity =
          Number(this.cardList[index].quantity) > this.cardList[index].get_num
            ? Number(this.cardList[index].quantity) - this.cardList[index].get_num
            : 0
        if (this.cardList[index].storeValue > quantity) {
          this.$message({
            message: '减少数量不能大于可领取库存',
            type: 'error'
          })
          return
        }
      }
      var param = {
        card_id: this.cardList[index].card_id,
        type: this.cardList[index].operationType,
        quantity: this.cardList[index].storeValue
      }     
      updateStore(param).then((response) => {
        //  this.loadingbtn = false
        setTimeout(()=>{
          this.loadingbtn = false
        },1000)
        this.getCardList()
        
      })
      
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    pushWechatCard() {
      var selectCardId = []
      for (var i = 0; i < this.multipleSelection.length; i++) {
        selectCardId.push(this.multipleSelection[i].card_id)
      }
      var param = { card_ids: selectCardId }
      this.$confirm('确定同步选中的优惠券至微信么？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        pushToWechat(param).then((res) => {
          if (res.data.data.status) {
            this.$message({
              message: '已经加入上传队列，请稍后查看状态',
              type: 'success',
              duration: 5 * 1000
            })
            //this.$refs.multipleTable.clearSelection();
          } else {
            this.$message({
              message: '推送出错',
              type: 'error'
            })
            return
          }
        })
      })
    }
  },
  mounted() {
    this.fetchParams.store_self = false
    if (this.system_mode === 'platform' && store.getters.login_type !== 'distributor') {
      this.fetchParams.store_self = true
    }
    this.getCardList()
  }
}
</script>
<style scoped lang="scss">
.el-icon-edit {
  cursor: pointer;
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
</style>
