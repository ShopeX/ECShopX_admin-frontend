<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<!--
 * @Author: your name
 * @Date: 2021-02-20 16:12:19
 * @LastEditTime: 2021-02-23 16:43:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/work/espier-shop/app/src/components/img_picker/index.vue
-->
<template>
  <div>
    <div class="img_picker_wrapper">
      <ul class="goodspic-wrap">
        <draggable
          v-model="pics"
          :options="dragIssuesOptions"
          class="components-view"
          :class="{ hasValue: pics.length + 1 === max || pics.length === max }"
          @change="handleChangeImg"
        >
          <li
            v-for="(item, index) in pics"
            :key="index"
            class="goodspic"
            @mouseenter="picsEnter(index)"
            @mouseleave="picsLeave"
          >
            <img :src="wximageurl + item">
            <div class="goodspic-mask" :class="picsCurrent == index ? 'on' : ''">
              <!-- <div
                class="iconfont icon-trash-alt"
                @click="removePicsImg(index)"
              ></div> -->
              <div class="text">拖动进行排序</div>
              <div class="button1" @click="replacePicsImg(index)">替换</div>
              <div class="button2" @click="removePicsImg(index)">删除</div>
            </div>
          </li>
          <div v-if="pics.length < max" class="upload-box custom_picker" @click="handlePicsChange">
            <div class="support">
              <div>
                <i class="iconfont iconadd" />
                <span>添加图片</span>
              </div>
            </div>
          </div>
        </draggable>
      </ul>
    </div>

    <imgSelect
      :dialog-visible="picsDialog"
      :sc-status="isGetPics"
      :is-most="multiple"
      @chooseImg="pickPics"
      @closeImgDialog="closePicsDialog"
    />
  </div>
</template>

<script>
import imgSelect from '@/components/imageselect'
import draggable from 'vuedraggable'

export default {
  components: {
    imgSelect,
    draggable
  },
  props: ['max', 'value'],
  data() {
    const _this = this
    return {
      //图片弹框是否显示
      picsDialog: false,
      isGetPics: false,
      //是否可以上传多张
      multiple: false,
      dragIssuesOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true,
        handle: '.goodspic-mask',
        draggable: '.goodspic'
      },
      //选择的图片列表
      pics: [],
      //已经选择的图片数量
      picsOldLen: 0,
      picsCurrent: -1,
      replaceIndex: -1
    }
  },
  watch: {
    value(val) {
      if (val && Array.isArray(val)) {
        this.pics = val
      }
    }
  },
  methods: {
    handleChangeImg: function (moved) {
      this.changePics(this.pics)
    },
    //上传商品图
    handlePicsChange: function () {
      this.picsDialog = true
      this.isGetPics = true
      this.multiple = true
    },
    //替换图片
    replacePicsImg: function (currentIndex) {
      this.replaceIndex = currentIndex
      this.multiple = false
      this.picsDialog = true
      this.isGetPics = true
    },
    //关闭dialog
    closePicsDialog() {
      this.picsDialog = false
      this.multiple = false
      this.replaceIndex = -1
    },
    pickPics(data) {
      if (Array.isArray(data)) {
        if (this.picsOldLen + data.length > this.max) {
          this.$message.error(`最多上传${this.max}张图片!`)
          return false
        } else {
          if (data.length != 0) {
            data.forEach(data => {
              if (data && data.url !== '') {
                this.pics.push(data.url)
                this.picsOldLen = this.pics.length
              }
            })
          }
        }
      } else {
        //替换操作
        if (data && data.url && this.replaceIndex !== -1) {
          this.pics.splice(this.replaceIndex, 1, data.url)
        }
      }
      this.changePics(this.pics)
      this.picsDialog = false
      this.replaceIndex = -1
    },
    picsEnter(index) {
      this.picsCurrent = index
    },
    picsLeave() {
      this.picsCurrent = -1
    },
    removePicsImg: function (index) {
      this.pics.splice(index, 1)
      this.changePics(this.pics)
      this.picsOldLen = this.pics.length
    },
    //pics change回调
    changePics: function (imgList) {
      this.$emit('update:value', imgList)
    }
  }
}
</script>

<style scoped lang="scss">
.img_picker_wrapper {
  overflow: hidden;
  width: 100%;
  height: 100%;
  margin-top: 20px;
  .goodspic-wrap {
    overflow: hidden;
    width: 100%;
    height: 200px;

    .components-view {
      width: 100%;
      display: flex;
      justify-content: space-between;

      &.hasValue {
        justify-content: space-between;
        .goodspic {
          margin-right: 0;
        }
      }
    }

    .goodspic {
      position: relative;
      width: 21%;
      height: 0;
      border-radius: 6px;
      overflow: hidden;
      margin-right: 2%;
      width: 300px;
      height: 200px;
      border: 1px solid red;

      img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
      }

      .goodspic-mask {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background-color: inherit;
        transition: all 0.3s;

        .text {
          color: #78c9ec;
          margin-bottom: 8%;
          font-weight: 600;
        }

        .button1,
        .button2 {
          background-color: #fff;
          min-width: 2vw;
          padding: 0.3vh 1vw;
          box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
            0px 1px 5px 0px rgba(0, 0, 0, 0.12);
          border-radius: 3px;
          cursor: pointer;
        }

        .button2 {
          color: red;
          margin-top: 1vh;
        }

        &.on {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.5);
        }
        .iconfont {
          margin: 0 8px;
          font-size: 20px;
          color: #fff;
        }
      }
    }
  }

  .upload-box {
    display: inline-block;
    height: 0;
    text-align: center;
    position: relative;
    width: 300px;
    height: 200px;
    border: 1px solid #78c9ec;

    .support {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      color: #78c9ec;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.6vw;

      .iconfont {
        font-size: 1.6vw;
      }
    }
  }

  .custom_picker {
    border: 1px solid #78c9ec;
  }
}
</style>
