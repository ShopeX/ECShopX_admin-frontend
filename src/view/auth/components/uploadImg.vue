<template>
  <div>
    <div class="pics-box">
      <ul class="goodspic-wrap">
        <li
          v-for="(item, index) in list"
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
      <div v-if="list < 1" class="upload-box" @click="handlePicsChange">
        <i class="el-icon-plus avatar-uploader-icon" />
        <span class="placeholder">请上传图片</span>
      </div>
      <span v-if="hasLabel" class="label-note">客服企业微信二维码，用户长按可加企微好友沟通</span>
    </div>
    <imgPicker
      :dialog-visible="picsDialog"
      :sc-status="isGetPics"
      :is-most="true"
      @chooseImg="pickPics"
      @closeImgDialog="closePicsDialog"
    />
  </div>
</template>
<script>
import imgPicker from '@/components/imageselect'
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    hasLabel: {
      type: Boolean,
      default: false
    }
  },
  components: {
    imgPicker
  },
  data() {
    return {
      isGetPics: false,
      picsDialog: false,
      picsCurrent: -1,
      picsOldLen: 0
    }
  },
  methods: {
    //上传门店图片（1张）
    handlePicsChange: function () {
      this.picsDialog = true
      this.isGetPics = true
    },
    pickPics(arr) {
      if (this.picsOldLen + arr.length >= 2) {
        this.$message.error('最多上传1张图片!')
        return false
      } else {
        if (arr.length != 0) {
          arr.forEach(data => {
            if (data && data.url !== '') {
              this.picsDialog = false
              this.list.push(data.url)
              this.changeImg(this.list)
              this.picsOldLen = this.list.length
            }
          })
        }
      }
    },
    closePicsDialog() {
      this.picsDialog = false
    },
    picsEnter(index) {
      this.picsCurrent = index
    },
    picsLeave() {
      this.picsCurrent = -1
    },
    removePicsImg: function (index) {
      this.list.splice(index, 1)
      this.changeImg(this.list)
      this.picsOldLen = this.list.length
    },
    changeImg(list) {
      this.$emit('changeImg', list)
    }
  }
}
</script>
<style lang="scss" scoped>
.label-note {
  color: #ff5d00;
  font-size: 10px;
  line-height: 40px;
  margin-left: 20px;
}
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
.pics-box .upload-box {
  background: #eeeeee;
  position: relative;
  .placeholder {
    font-size: 12px;
    color: #8c939d;
    position: absolute;
    /* bottom: 100px; */
    left: 0;
    right: 0;
    margin: 0 auto;
    text-align: center;
    top: 90px;
  }
}
</style>
