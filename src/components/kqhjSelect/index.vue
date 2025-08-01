<template>
  <el-dialog
    title="选择卡券货架"
    :visible.sync="showDialog"
    :close-on-click-modal="false"
    :before-close="cancelAction"
  >
    <div class="sub_title_bar tr">
      <el-button type="primary"> <i class="el-icon-plus" />添加货架 </el-button>
    </div>
    <div class="select_shelf_area group">
      <div class="shelf_item_col shelf_item_col_odd">
        <div
          v-for="(item, index) in dataList"
          class="shelf_item js_shelf_item_p"
          :class="{ checked: index === i }"
          @click="checkedItemAction(index, item)"
        >
          <div>
            <div class="shop_module_item shop_module_banner js_shopModuleWrapper">
              <strong class="shop_banner_title">Onex平台</strong>
              <!-- <span class="banner_logo"><img src="@/assets/img/logo2.31693aa.png" alt=""/></span> -->
              <span class="banner_bg"><img src="" alt="" class="banner_pic"></span>
              <div class="pic_mask" />
            </div>
            <div class="list_section shop_module_item js_shopModuleWrapper">
              <ul class="list_classfy">
                <li><a href="javascript:;">全部优惠券</a></li>
                <li><a href="javascript:;">折扣券</a></li>
                <li><a href="javascript:;">满减券</a></li>
                <li><a href="javascript:;">通用优惠券</a></li>
              </ul>
            </div>
            <div class="list_section shop_module_item js_shopModuleWrapper">
              <ul class="list_row">
                <li>
                  <a href="javascript:;">
                    <img alt="img" src="">
                  </a>
                </li>
              </ul>
            </div>
            <div class="list_section shop_module_item js_shopModuleWrapper">
              <el-row :gutter="20" class="list_row_col">
                <el-col :span="14">
                  <div class="ele_1">
                    <a href="javascript:;"><img src="" alt="img"></a>
                  </div>
                </el-col>
                <el-col :span="10">
                  <div class="ele_2">
                    <a href="javascript:;"><img src="" alt="img"></a>
                  </div>
                  <div class="ele_2">
                    <a href="javascript:;"><img src="" alt="img"></a>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="shelf_item_mask">
            <i class="el-icon-check" />
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelAction"> 取 消 </el-button>
      <el-button type="primary" @click="saveAction"> 确 定 </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ['kqhjVisible'],
  data() {
    return {
      i: -1,
      selectedItem: {},
      dataList: [
        {
          id: 1,
          bannerPic: '',
          bannerLogo: '',
          bannerBg: '',
          tickList: [{ id: 1, name: '' }],
          layoutele1: '',
          layoutele2: '',
          layoutele3: ''
        }
      ]
    }
  },
  computed: {
    showDialog() {
      return this.kqhjVisible
    }
  },
  methods: {
    saveAction() {
      this.$emit('chooseKQHJ', this.selectedItem)
    },
    cancelAction() {
      this.$emit('closeKQHJDialog')
    },
    checkedItemAction(index, item) {
      this.selectedItem = item
      this.i = index
    }
  }
}
</script>

<style scoped lang="scss">
.sub_title_bar {
  border-bottom: 1px solid #d9dadc;
  padding-bottom: 20px;
}
.select_shelf_area {
  padding: 28px 70px;
  height: 400px;
  overflow-y: auto;
  text-align: center;
}
.shelf_item_col {
  width: 48%;
  display: inline-block;
  vertical-align: top;
}
.shelf_item {
  position: relative;
  width: 327px;
  padding: 14px;
  border: 1px solid #d9dadc;
  margin: 0 auto 20px;
  cursor: pointer;
  &:hover,
  &.checked {
    .shelf_item_mask {
      display: block;
    }
  }
  &.checked {
    .shelf_item_mask {
      i {
        display: block;
      }
    }
  }
}
.shop_module_item {
  position: relative;
  margin: 0 10px 10px;
  &.shop_module_banner {
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 35px;
  }
}
.shop_module_banner {
  height: 150px;
  .shop_banner_title {
    position: absolute;
    z-index: 1;
    bottom: 10px;
    left: 90px;
    font-size: 14px;
    color: #fff;
    text-shadow: 0 2px 1px rgba(0, 0, 0, 0.5);
  }
  .banner_logo {
    position: absolute;
    z-index: 1;
    bottom: -20px;
    left: 20px;
    width: 68px;
    height: 68px;
    background-color: #fff;
    padding: 3px;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    box-shadow: 0 0.5px 1px 0 rgba(0, 0, 0, 0.8);
    -moz-box-shadow: 0 0.5px 1px 0 rgba(0, 0, 0, 0.8);
    -webkit-box-shadow: 0 0.5px 1px 0 rgba(0, 0, 0, 0.8);
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .banner_bg {
    display: block;
    height: 100%;
    overflow: hidden;
    .banner_pic {
      width: 100%;
      height: 100%;
    }
  }
}
.pic_mask {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.15);
}
.list_classfy {
  text-align: center;
  li {
    display: inline-block;
    width: 46%;
    height: 38px;
    line-height: 38px;
    background: #f4f5f9;
    a {
      display: block;
      color: #333;
    }
  }
  li:nth-child(odd) {
    margin: 0 9px 10px 0;
  }
  li:nth-child(even) {
    margin: 0 0 10px;
  }
}
.list_row {
  li {
    a {
      display: block;
    }
    img {
      display: block;
      width: 100%;
      height: 140px;
      text-align: center;
    }
  }
}
.list_row_col {
  a {
    display: block;
    height: 100%;
  }
  .ele_1 {
    height: 165px;
  }
  .ele_2 {
    height: 77px;
    margin-bottom: 10px;
  }
  img {
    width: 100%;
    height: 100%;
    display: block;
    text-align: center;
  }
}
.shelf_item_mask {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  i {
    display: none;
    position: absolute;
    top: 45%;
    left: 45%;
    color: #fff;
    font-size: 30px;
  }
}
</style>
