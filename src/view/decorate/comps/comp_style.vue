<template>
    <div class="comps_style">
      <div class="comps_style-item">
        <div v-show="showLabel" class="im-tt">
          内边距
        </div>
        <el-row class="im-bd">
          <el-col v-if="showTop" :span="10" class="im-bd-pd">
            <p class="label">上</p>
            <el-input-number v-model="form.paddedt" controls-position="right" size="mini" :min="0" />
          </el-col>
          <el-col v-if="showBottom" :span="10" class="im-bd-pd">
            <p class="label"> 下</p>
            <el-input-number v-model="form.paddedb" controls-position="right" size="mini" :min="0" />
          </el-col>
          <el-col v-if="showLeft" :span="10" class="im-bd-pd">
            <p class="label">左</p>
            <el-input-number v-model="form.paddedl" controls-position="right" size="mini" :min="0" />
          </el-col>
          <el-col v-if="showRight" :span="10" class="im-bd-pd">
            <p class="label">右</p>
            <el-input-number v-model="form.paddedr" controls-position="right" size="mini" :min="0" />
          </el-col>
          <!-- <el-slider v-model="form.padded" :min="0"  />
          <p>{{ form.padded }}px</p> -->
        </el-row>
      </div>
      <div class="comps_style-item">
        <el-row class="im-bd">
          <el-col v-if="showTB" :span="10" class="im-bd-pd">
            <p class="label">上下</p>
            <el-input-number v-model="form.paddedtb" controls-position="right" size="mini" :min="0" />
          </el-col>
          <el-col v-if="showLR" :span="10" class="im-bd-pd">
            <p class="label">左右</p>
            <el-input-number v-model="form.paddedlr" controls-position="right" size="mini" :min="0" />
          </el-col>
          <!-- <el-slider v-model="form.padded" :min="0"  />
          <p>{{ form.padded }}px</p> -->
        </el-row>
      </div>
      <div v-if="showBgsetting" class="comps_style-item">
        <div class="im-tt">
          背景
        </div>
        <div class="im-bd el-color-picker-wrap">
          <el-radio-group v-model="form.bgType" @change="handlechange">
            <el-radio label="color">颜色背景</el-radio>
            <el-radio label="pic">图片背景</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div v-if="showBgsetting && form.bgType == 'color'" class="comps_style-item">
        <div class="im-tt">
          背景色
        </div>
        <div class="im-bd el-color-picker-wrap">
          <el-color-picker v-model="form.bgColor" size="small" />
        </div>
      </div>
      <div v-if="showBgsetting && form.bgType == 'pic'" class="comps_style-item">
        <div class="im-tt">
          背景图
        </div>
        <div class="im-bd el-color-picker-wrap">
          <SpImagePicker v-model="form.bgPic" size="small" class="video-link" text="背景图" />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { cloneDeep } from 'lodash'
  export default {
    props: {
      value: {
        type: Object,
        default: () => { }
      },
      uuid: {
        type: String,
        default: ''
      },
      showBgsetting: {
        type: Boolean,
        default: true
      },
      showTop: {
        type: Boolean,
        default: true
      },
      showBottom: {
        type: Boolean,
        default: true
      },
      showLeft: {
        type: Boolean,
        default: true
      },
      showRight: {
        type: Boolean,
        default: true
      },
      showLabel: {
        type: Boolean,
        default: true
      },
      showTB: {
        type: Boolean,
        default: false
      },
      showLR: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        form: {
          margined: "",
          padded: "",
          bgColor: "",
          bgPic: "",
          bgType: 'color'
        },
      }
    },
    watch: {
      uuid: {
        handler() {
          this.form = !this.value ? {
            margined: 0,
            paddedt: 0,
            paddedb: 0,
            paddedl: 0,
            paddedr: 0,
            bgColor: '',
            bgPic: '',
            bgType: 'color'
          } : cloneDeep(this.value)
        },
        immediate: true,
        deep: true
      },
      form: {
        handler(val) {
          this.$emit('input', val)
        },
        deep: true
      }
    },
    methods: {
      async handlechange() {
        this.$set(this.form, 'bgPic', '')
        this.$set(this.form, 'bgColor', '')
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .comps_style {
    &-item {
      display: flex;
      align-items: flex-start;
      .comps_style-item{
        width: 100%;
      }
  
  
      .im-tt {
        width: 80px;
        font-size: 12px;
        color: rgb(156, 156, 156);
        padding-top: 10px;
      }
  
      .im-bd {
        width: 100%;
        flex: 1;
        display: flex;
        flex-wrap: wrap;
  
        &-pd {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          margin-right: 10px;
  
          .label {
            font-size: 10px;
            padding-right: 5px;
            color: rgb(156, 156, 156);
            min-width: 28px;
          }
  
          .el-input-number {
            flex: 1;
            min-width: 80px;

          }
        }
      }
    }
  }
  </style>
  <style lang="scss">
  .comps_style {
    .el-input-number.is-controls-right .el-input__inner {
      padding-right: 35px;
      padding-left: 5px;
      text-align: left;
    }
    .el-form-item__content {
      line-height: normal;
    }
 
  
  }
  </style>
  