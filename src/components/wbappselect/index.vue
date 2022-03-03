<template>
  <el-dialog
    title="选择小程序"
    :visible.sync="showDialog"
    :close-on-click-modal="false"
    style="min-width: 726px"
    :before-close="cancelAction"
  >
    <div class="menu_link_weapp">
      <div class="link_weapp_desc">
        请选择已绑定的小程序
      </div>
      <div class="link_weapp_wrp">
        <div class="link_weapp_box weapplinks_box">
          <ul class="wechat_list weapplink_list clearfix">
            <li
              v-for="(item, index) in dataList"
              class="weapplink_item"
              :class="{ 'selected': i === index }"
              @click="selectItemAction(item, index)"
            >
              <div class="weapplink_item_inner">
                <div class="weapplink_info clearfix">
                  <img
                    class="weapplink_avatar f_l"
                    :src="wechatImg"
                    alt="img"
                  >
                  <strong class="f_l">商派小店</strong>
                </div>
                <div class="weapplink_select_mask">
                  <i class="el-icon-check" />
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="cancelAction">
        取 消
      </el-button>
      <el-button
        type="primary"
        @click="saveAction"
      >
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
var wimg = require('@/assets/img/webchat.png')
export default {
  props: ['appVisible'],
  data () {
    return {
      wechatImg: wimg,
      i: -1,
      dataList: [
        { id: 1, name: '商派小店', imgUrl: wimg, url: 'http://www.baidu.com' },
        { id: 1, name: '商派小店', imgUrl: wimg, url: 'http://www.baidu.com' }
      ],
      selectedItem: {}
    }
  },
  computed: {
    showDialog () {
      return this.appVisible
    }
  },
  methods: {
    selectItemAction (item, index) {
      this.selectedItem = item
      this.i = index
    },
    saveAction () {
      this.$emit('chooseApp', this.selectedItem)
    },
    cancelAction () {
      this.$emit('closeAppDialog')
    }
  }
}
</script>

<style scoped lang="scss">
.link_weapp_desc {
  padding: 20px 100px;
}
.link_weapp_wrp {
  height: 320px;
  overflow-y: auto;
}
.weapplinks_box {
  padding: 0 100px 20px;
  .weapplink_list {
    overflow: hidden;
    margin-right: -20px;
  }
  .weapplink_item {
    float: left;
    width: 50%;
    cursor: pointer;
    .weapplink_item_inner {
      padding: 15px 20px;
      margin: 0 20px 20px 0;
      position: relative;
      border-radius: 5px;
      border: 1px solid #e7e7eb;
    }
    .weapplink_info {
      padding: 10px 0;
      min-height: 50px;
    }
    .weapplink_avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    strong {
      font-weight: 400;
      font-style: normal;
      display: block;
      width: auto;
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: break-word;
      white-space: nowrap;
      line-height: 50px;
    }
    &.selected {
      .weapplink_select_mask {
        display: block;
      }
    }
  }
}
.weapplink_select_mask {
  display: none;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  text-align: center;
  font-size: 0;
  color: #fff;
  i {
    font-size: 34px;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
